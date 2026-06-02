import { portMapByLocation } from './portMap';

// 轨迹数据接口（从pino.ts导入的类型）
export interface TrajectoryPortData {
	id: number;
	latitude: number;
	longitude: number;
	lat: number;
	lng: number;
	vessel: string;
	navi_status: number;
	hdg: string;
	cog: string;
	sog: string;
	utc: string;
	[key: string]: any;
}

// 港口数据接口（从port.ts导入的类型）
export interface PortInfo {
	code?: string;
	name?: string;
	country_code?: string;
	zone_code?: string;
	latitude: number;
	longitude: number;
	chinese_name?: string;
	state?: string;
	[key: string]: any;
}

// 匹配后的数据接口
export interface MatchedTrajectoryData extends TrajectoryPortData {
	portInfo?: PortInfo; // 匹配到的港口信息
	distance?: number; // 与港口的距离（度）
}

/**
 * 计算两点之间的距离（使用Haversine公式，返回度数）
 * @param lat1 点1纬度
 * @param lon1 点1经度
 * @param lat2 点2纬度
 * @param lon2 点2经度
 * @returns 距离（度）
 */
function calculateDistance(
	lat1: number,
	lon1: number,
	lat2: number,
	lon2: number
): number {
	const dLat = lat2 - lat1;
	const dLon = lon2 - lon1;
	return Math.sqrt(dLat * dLat + dLon * dLon);
}

/**
 * 生成港口Map的key（纬度/经度格式）
 * @param lat 纬度
 * @param lon 经度
 * @param precision 精度（小数位数，默认7位）
 * @returns 格式化的key
 */
function generatePortKey(
	lat: number,
	lon: number,
	precision: number = 7
): string {
	return `${lat.toFixed(precision)}/${lon.toFixed(precision)}`;
}

/**
 * 尝试通过不同精度匹配港口
 * @param lat 纬度
 * @param lon 经度
 * @returns 匹配到的港口信息，如果未匹配到则返回null
 */
function findPortByPrecision(lat: number, lon: number): PortInfo | null {
	// 尝试不同的精度级别（从高到低）
	const precisions = [7, 6, 5, 4, 3, 2, 1];

	for (const precision of precisions) {
		const key = generatePortKey(lat, lon, precision);
		const port = portMapByLocation.get(key);
		if (port) {
			return port as PortInfo;
		}
	}

	return null;
}

/**
 * 通过距离匹配最近的港口
 * @param lat 纬度
 * @param lon 经度
 * @param maxDistance 最大匹配距离（度），默认0.01度（约1.1公里）
 * @returns 匹配到的港口信息和距离，如果未匹配到则返回null
 */
function findNearestPort(
	lat: number,
	lon: number,
	maxDistance: number = 0.01
): { port: PortInfo; distance: number } | null {
	let nearestPort: PortInfo | null = null;
	let minDistance = maxDistance;

	// 遍历所有港口，找到距离最近的
	portMapByLocation.forEach((port) => {
		const portLat = port.latitude;
		const portLon = port.longitude;
		const distance = calculateDistance(lat, lon, portLat, portLon);

		if (distance < minDistance) {
			minDistance = distance;
			nearestPort = port as PortInfo;
		}
	});

	if (nearestPort) {
		return { port: nearestPort, distance: minDistance };
	}

	return null;
}

/**
 * 将轨迹数据与港口数据进行匹配
 * 对于navi_status为1的点（靠港状态），尝试匹配到对应的港口
 * @param trajectoryData 轨迹数据数组
 * @param maxDistance 最大匹配距离（度），默认0.01度（约1.1公里）
 * @returns 匹配后的轨迹数据数组
 */
export function matchTrajectoryWithPorts(
	trajectoryData: TrajectoryPortData[],
	maxDistance: number = 0.01
): MatchedTrajectoryData[] {
	return trajectoryData.map((point) => {
		// 只对靠港状态的点进行匹配
		if (point.navi_status === 1) {
			// 首先尝试通过精度匹配（快速匹配）
			let portInfo = findPortByPrecision(point.latitude, point.longitude);
			let distance: number | undefined;

			// 如果精度匹配失败，则通过距离匹配
			if (!portInfo) {
				const nearest = findNearestPort(
					point.latitude,
					point.longitude,
					maxDistance
				);
				if (nearest) {
					portInfo = nearest.port;
					distance = nearest.distance;
				}
			} else {
				// 如果精度匹配成功，计算实际距离
				distance = calculateDistance(
					point.latitude,
					point.longitude,
					portInfo.latitude,
					portInfo.longitude
				);
			}

			return {
				...point,
				portInfo,
				distance,
			};
		}

		// 非靠港状态的点直接返回
		return point as MatchedTrajectoryData;
	});
}

/**
 * 过滤重复的靠港数据
 * 由于轨迹数据可能定时上传，靠港时可能有略微差异但产生了很多重复数据
 * 该方法会过滤掉相似度高的数据，保留时间最早的点，同时保持原始顺序
 * @param trajectoryData 轨迹数据数组（应该是已经匹配过港口的数据）
 * @param distanceThreshold 距离阈值（度），默认0.001度（约100米），小于此距离的点被认为是重复的
 * @returns 过滤后的轨迹数据数组
 */
export function filterDuplicatePortData(
	trajectoryData: MatchedTrajectoryData[],
	distanceThreshold: number = 0.001
): MatchedTrajectoryData[] {
	const result: MatchedTrajectoryData[] = [];
	const keptPortPointIds = new Set<number>(); // 已保留的靠港点ID
	const portPointGroups: Map<number, MatchedTrajectoryData[]> = new Map(); // 按索引分组相近的靠港点

	// 第一遍：找出所有相近的靠港点组
	for (let i = 0; i < trajectoryData.length; i++) {
		const point = trajectoryData[i];

		if (point.navi_status !== 1) {
			continue; // 跳过非靠港点
		}

		// 查找是否已经存在相近的点组
		let foundGroup = false;
		for (const group of portPointGroups.entries()) {
			const representative = group[0];
			const distance = calculateDistance(
				point.latitude,
				point.longitude,
				representative.latitude,
				representative.longitude
			);

			if (distance < distanceThreshold) {
				group.push(point);
				foundGroup = true;
				break;
			}
		}

		if (!foundGroup) {
			// 创建新的点组
			portPointGroups.set(i, [point]);
		}
	}

	// 第二遍：对每个点组，保留时间最早的点
	portPointGroups.forEach((group) => {
		if (group.length === 0) return;

		// 按时间排序，最早的在前面
		group.sort((a, b) => {
			const timeA = new Date(a.utc).getTime();
			const timeB = new Date(b.utc).getTime();
			return timeA - timeB;
		});

		// 保留时间最早的点
		keptPortPointIds.add(group[0].id);
	});

	// 第三遍：按原始顺序构建结果，只保留应该保留的点
	trajectoryData.forEach((point) => {
		if (point.navi_status === 1) {
			// 如果是靠港点，只保留在保留列表中的
			if (keptPortPointIds.has(point.id)) {
				result.push(point);
			}
		} else {
			// 非靠港点全部保留
			result.push(point);
		}
	});

	return result;
}

/**
 * 组合方法：先匹配港口，再过滤重复数据
 * @param trajectoryData 轨迹数据数组
 * @param matchMaxDistance 匹配时的最大距离（度），默认0.01度
 * @param filterDistanceThreshold 过滤时的距离阈值（度），默认0.001度
 * @returns 处理后的轨迹数据数组
 */
export function processTrajectoryData(
	trajectoryData: TrajectoryPortData[],
	matchMaxDistance: number = 0.01,
	filterDistanceThreshold: number = 0.001
): MatchedTrajectoryData[] {
	// 先匹配港口
	const matchedData = matchTrajectoryWithPorts(
		trajectoryData,
		matchMaxDistance
	);
	// 再过滤重复数据
	return filterDuplicatePortData(matchedData, filterDistanceThreshold);
}
