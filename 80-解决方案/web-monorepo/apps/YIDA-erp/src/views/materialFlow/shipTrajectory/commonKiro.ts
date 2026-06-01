/**
 * 港口和航线轨迹数据处理工具
 *  pino数据格式数组下的每一项为：轨迹点对象，格式为： 
 {
    "latitude": 26.205433,
    "longitude": 151.206413,
    "naviStatus": 0,
    "sog": "19.70",
    "cog": "102.80",
    "hdg": "101.00",
    "utc": "2025-12-12 14:03:36"
  }
 */

import type { PortData as TrajectoryPoint } from './pino';

// 港口信息接口
interface PortInfo {
	code?: string;
	name?: string;
	country_code?: string;
	zone_code?: string;
	latitude: number;
	longitude: number;
	chinese_name?: string;
	state?: string;
}

// 匹配结果接口
export interface MatchedTrajectoryPoint extends TrajectoryPoint {
	portInfo?: PortInfo; // 匹配到的港口信息
	isPort: boolean; // 是否为港口点
}

/**
 * 计算两个经纬度坐标之间的距离（单位：公里）
 * 使用 Haversine 公式
 */
function calculateDistance(
	lat1: number,
	lon1: number,
	lat2: number,
	lon2: number
): number {
	const R = 6371; // 地球半径（公里）
	const dLat = toRadians(lat2 - lat1);
	const dLon = toRadians(lon2 - lon1);

	const a =
		Math.sin(dLat / 2) * Math.sin(dLat / 2) +
		Math.cos(toRadians(lat1)) *
			Math.cos(toRadians(lat2)) *
			Math.sin(dLon / 2) *
			Math.sin(dLon / 2);

	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	return R * c;
}

function toRadians(degrees: number): number {
	return degrees * (Math.PI / 180);
}

/**
 * 将港口数据与航行轨迹数据进行匹配
 * @param portMapByLocation 港口数据 Map（key 为 "latitude/longitude"）
 * @param trajectoryData 航行轨迹数据
 * @param maxDistance 最大匹配距离（公里），默认 5 公里
 * @returns 匹配后的轨迹数据
 */
export function matchPortsToTrajectory(
	portMapByLocation: Map<string, PortInfo>,
	trajectoryData: TrajectoryPoint[],
	maxDistance: number = 5
): MatchedTrajectoryPoint[] {
	const portArray = Array.from(portMapByLocation.values());

	return trajectoryData.map((point) => {
		const matchedPoint: MatchedTrajectoryPoint = {
			...point,
			lat: point.latitude,
			lng: point.longitude,
			isPort: point.naviStatus === 1,
		};

		// 只对靠港状态的点进行港口匹配
		if (point.naviStatus === 1) {
			let closestPort: PortInfo | null = null;
			let minDistance = maxDistance;

			// 遍历所有港口，找到最近的港口
			for (const port of portArray) {
				const distance = calculateDistance(
					point.latitude,
					point.longitude,
					port.latitude,
					port.longitude
				);

				if (distance < minDistance) {
					minDistance = distance;
					closestPort = port;
				}
			}

			if (closestPort) {
				matchedPoint.portInfo = closestPort;
			}
		}

		return matchedPoint;
	});
}

/**
 * 过滤靠港数据中的重复点
 * 根据位置相似度和时间间隔过滤掉冗余数据，保持状态段的连续性
 * @param trajectoryData 航行轨迹数据
 * @param distanceThreshold 距离阈值（公里），默认 0.5 公里
 * @param timeThreshold 时间阈值（分钟），默认 10 分钟
 * @returns 过滤后的轨迹数据
 */
export function filterDuplicatePortPoints(
	trajectoryData: TrajectoryPoint[],
	distanceThreshold: number = 0.5,
	timeThreshold: number = 10
): TrajectoryPoint[] {
	if (trajectoryData.length === 0) {
		return trajectoryData;
	}

	// 按连续状态段分组
	const segments = groupByContinuousStatus(trajectoryData);
	const filtered: TrajectoryPoint[] = [];

	for (const segment of segments) {
		if (segment.length === 0) continue;

		const isPortSegment = segment[0].naviStatus === 1;

		if (!isPortSegment) {
			// 非靠港段：直接保留所有点
			filtered.push(...segment);
		} else {
			// 靠港段：过滤重复点
			if (segment.length <= 1) {
				filtered.push(...segment);
			} else {
				const portFiltered: TrajectoryPoint[] = [];
				let lastPoint: TrajectoryPoint | null = null;

				for (const point of segment) {
					if (!lastPoint) {
						portFiltered.push(point);
						lastPoint = point;
						continue;
					}

					// 计算与上一个点的距离
					const distance = calculateDistance(
						lastPoint.latitude,
						lastPoint.longitude,
						point.latitude,
						point.longitude
					);

					// 计算时间差（分钟）
					const timeDiff = calculateTimeDifference(lastPoint.utc, point.utc);

					// 如果距离超过阈值或时间差超过阈值，则保留该点
					if (distance > distanceThreshold || timeDiff > timeThreshold) {
						portFiltered.push(point);
						lastPoint = point;
					}
					// 否则跳过该点（认为是重复数据）
				}

				filtered.push(...portFiltered);
			}
		}
	}

	// 按时间排序返回（保持原始顺序）
	return filtered.sort((a, b) => {
		const timeA = new Date(a.utc.replace(' ', 'T')).getTime();
		const timeB = new Date(b.utc.replace(' ', 'T')).getTime();
		return timeA - timeB;
	});
}

/**
 * 使用 Douglas-Peucker 算法简化航行轨迹
 * 保留关键转折点，减少冗余数据，同时保持航线流畅度
 * @param points 轨迹点数组
 * @param epsilon 容差值（公里），默认 0.3 公里
 * @returns 简化后的轨迹点数组
 */
function douglasPeucker(
	points: TrajectoryPoint[],
	epsilon: number = 0.3
): TrajectoryPoint[] {
	if (points.length <= 2) {
		return points;
	}

	// 找到距离起点和终点连线最远的点
	let maxDistance = 0;
	let maxIndex = 0;
	const start = points[0];
	const end = points[points.length - 1];

	for (let i = 1; i < points.length - 1; i++) {
		const distance = perpendicularDistance(points[i], start, end);
		if (distance > maxDistance) {
			maxDistance = distance;
			maxIndex = i;
		}
	}

	// 如果最大距离大于容差，递归简化
	if (maxDistance > epsilon) {
		const left = douglasPeucker(points.slice(0, maxIndex + 1), epsilon);
		const right = douglasPeucker(points.slice(maxIndex), epsilon);
		return [...left.slice(0, -1), ...right];
	} else {
		// 否则只保留起点和终点
		return [start, end];
	}
}

/**
 * 计算点到线段的垂直距离
 */
function perpendicularDistance(
	point: TrajectoryPoint,
	lineStart: TrajectoryPoint,
	lineEnd: TrajectoryPoint
): number {
	const x0 = point.latitude;
	const y0 = point.longitude;
	const x1 = lineStart.latitude;
	const y1 = lineStart.longitude;
	const x2 = lineEnd.latitude;
	const y2 = lineEnd.longitude;

	const dx = x2 - x1;
	const dy = y2 - y1;

	if (dx === 0 && dy === 0) {
		return calculateDistance(x0, y0, x1, y1);
	}

	const t = ((x0 - x1) * dx + (y0 - y1) * dy) / (dx * dx + dy * dy);
	const clampedT = Math.max(0, Math.min(1, t));
	const closestX = x1 + clampedT * dx;
	const closestY = y1 + clampedT * dy;

	return calculateDistance(x0, y0, closestX, closestY);
}

/**
 * 将轨迹数据按连续的状态段分组
 * @param trajectoryData 轨迹数据（必须按时间排序）
 * @returns 分组后的状态段数组
 */
function groupByContinuousStatus(
	trajectoryData: TrajectoryPoint[]
): TrajectoryPoint[][] {
	if (trajectoryData.length === 0) return [];

	// 确保数据按时间排序
	const sorted = [...trajectoryData].sort((a, b) => {
		const timeA = new Date(a.utc.replace(' ', 'T')).getTime();
		const timeB = new Date(b.utc.replace(' ', 'T')).getTime();
		return timeA - timeB;
	});

	const segments: TrajectoryPoint[][] = [];
	let currentSegment: TrajectoryPoint[] = [sorted[0]];
	let currentStatus = sorted[0].naviStatus;

	for (let i = 1; i < sorted.length; i++) {
		const point = sorted[i];
		// 如果状态改变，开始新的段
		if (point.naviStatus !== currentStatus) {
			segments.push(currentSegment);
			currentSegment = [point];
			currentStatus = point.naviStatus;
		} else {
			currentSegment.push(point);
		}
	}

	// 添加最后一个段
	if (currentSegment.length > 0) {
		segments.push(currentSegment);
	}

	return segments;
}

/**
 * 智能过滤航行轨迹点（naviStatus = 0）
 * 按连续状态段分别处理，保持轨迹的完整性
 * @param trajectoryData 航行轨迹数据
 * @param options 过滤选项
 * @returns 过滤后的轨迹数据
 */
export function filterNavigationPoints(
	trajectoryData: TrajectoryPoint[],
	options?: {
		useSimplification?: boolean; // 是否使用轨迹简化算法
		simplificationTolerance?: number; // 简化容差（公里）
		minTimeInterval?: number; // 最小时间间隔（分钟）
		minDistance?: number; // 最小距离（公里）
		speedChangeThreshold?: number; // 速度变化阈值（节）
		courseChangeThreshold?: number; // 航向变化阈值（度）
		keepKeyPoints?: boolean; // 是否保留关键点（速度/航向突变点）
	}
): TrajectoryPoint[] {
	const {
		useSimplification = true,
		simplificationTolerance = 0.3,
		minTimeInterval = 15,
		minDistance = 1,
		speedChangeThreshold = 2,
		courseChangeThreshold = 30,
		keepKeyPoints = true,
	} = options || {};

	if (trajectoryData.length === 0) {
		return trajectoryData;
	}

	// 按连续状态段分组
	const segments = groupByContinuousStatus(trajectoryData);

	// 处理每个段
	const processedSegments: TrajectoryPoint[] = [];

	for (const segment of segments) {
		if (segment.length === 0) continue;

		const isPortSegment = segment[0].naviStatus === 1;

		if (isPortSegment) {
			// 靠港段：保留所有点（或轻微过滤，这里保留全部）
			processedSegments.push(...segment);
		} else {
			// 航行段：进行简化处理
			let filteredSegment: TrajectoryPoint[] = [];

			if (segment.length <= 2) {
				// 如果段很短，保留所有点
				filteredSegment = segment;
			} else if (useSimplification) {
				// 使用 Douglas-Peucker 算法简化
				filteredSegment = douglasPeucker(segment, simplificationTolerance);
			} else {
				// 使用基于规则的过滤
				filteredSegment = filterByRules(
					segment,
					minTimeInterval,
					minDistance,
					speedChangeThreshold,
					courseChangeThreshold,
					keepKeyPoints
				);
			}

			processedSegments.push(...filteredSegment);
		}
	}

	// 按时间排序返回（保持原始顺序）
	return processedSegments.sort((a, b) => {
		const timeA = new Date(a.utc.replace(' ', 'T')).getTime();
		const timeB = new Date(b.utc.replace(' ', 'T')).getTime();
		return timeA - timeB;
	});
}

/**
 * 基于规则过滤航行点
 */
function filterByRules(
	navPoints: TrajectoryPoint[],
	minTimeInterval: number,
	minDistance: number,
	speedChangeThreshold: number,
	courseChangeThreshold: number,
	keepKeyPoints: boolean
): TrajectoryPoint[] {
	if (navPoints.length === 0) return [];

	const filtered: TrajectoryPoint[] = [];
	let lastPoint: TrajectoryPoint | null = null;

	for (const point of navPoints) {
		// 第一个点必须保留
		if (!lastPoint) {
			filtered.push(point);
			lastPoint = point;
			continue;
		}

		// 计算与上一个点的差异
		const distance = calculateDistance(
			lastPoint.latitude,
			lastPoint.longitude,
			point.latitude,
			point.longitude
		);
		const timeDiff = calculateTimeDifference(lastPoint.utc, point.utc);
		const speedChange = Math.abs(
			parseFloat(point.sog) - parseFloat(lastPoint.sog)
		);
		const courseChange = calculateCourseChange(
			parseFloat(lastPoint.cog),
			parseFloat(point.cog)
		);

		// 判断是否为关键点
		const isKeyPoint =
			keepKeyPoints &&
			(speedChange > speedChangeThreshold ||
				courseChange > courseChangeThreshold);

		// 保留条件：
		// 1. 关键点（速度或航向有显著变化）
		// 2. 距离超过阈值
		// 3. 时间间隔超过阈值
		if (isKeyPoint || distance > minDistance || timeDiff > minTimeInterval) {
			filtered.push(point);
			lastPoint = point;
		}
	}

	// 确保最后一个点被保留
	const lastNavPoint = navPoints[navPoints.length - 1];
	if (filtered[filtered.length - 1]?.id !== lastNavPoint.id) {
		filtered.push(lastNavPoint);
	}

	return filtered;
}

/**
 * 计算航向变化（考虑 0-360 度的循环）
 */
function calculateCourseChange(course1: number, course2: number): number {
	let diff = Math.abs(course2 - course1);
	if (diff > 180) {
		diff = 360 - diff;
	}
	return diff;
}

/**
 * 计算两个时间字符串之间的差值（分钟）
 * @param time1 时间字符串（格式：YYYY-MM-DD HH:mm:ss）
 * @param time2 时间字符串（格式：YYYY-MM-DD HH:mm:ss）
 * @returns 时间差（分钟）
 */
function calculateTimeDifference(time1: string, time2: string): number {
	try {
		const date1 = new Date(time1.replace(' ', 'T'));
		const date2 = new Date(time2.replace(' ', 'T'));
		const diffMs = Math.abs(date2.getTime() - date1.getTime());
		return diffMs / (1000 * 60); // 转换为分钟
	} catch (error) {
		return 0;
	}
}

/**
 * 综合处理：过滤重复点、简化航行轨迹、匹配港口信息
 * @param portMapByLocation 港口数据 Map
 * @param trajectoryData 航行轨迹数据
 * @param options 配置选项
 * @returns 处理后的轨迹数据
 */
export function processTrajectoryData(
	portMapByLocation: Map<string, PortInfo>,
	trajectoryData: TrajectoryPoint[],
	options?: {
		// 港口匹配选项
		maxMatchDistance?: number; // 港口匹配最大距离（公里），默认 5

		// 靠港点过滤选项
		portFilterDistance?: number; // 靠港点过滤距离阈值（公里），默认 1
		portFilterTime?: number; // 靠港点过滤时间阈值（分钟），默认 10

		// 航行点过滤选项
		filterNavigation?: boolean; // 是否过滤航行点，默认 true
		useSimplification?: boolean; // 是否使用轨迹简化算法，默认 true
		simplificationTolerance?: number; // 简化容差（公里），默认 1
		minTimeInterval?: number; // 最小时间间隔（分钟），默认 15
		minDistance?: number; // 最小距离（公里），默认 1
		speedChangeThreshold?: number; // 速度变化阈值（节），默认 2
		courseChangeThreshold?: number; // 航向变化阈值（度），默认 30
		keepKeyPoints?: boolean; // 是否保留关键点，默认 true

		// 新增：激进缩减选项
		maxPoints?: number; // 最大保留点数，超过则进行二次抽样
		samplingStrategy?: 'uniform' | 'adaptive'; // 抽样策略：均匀抽样 | 自适应抽样
	}
): MatchedTrajectoryPoint[] {
	const {
		maxMatchDistance = 5,
		portFilterDistance = 1,
		portFilterTime = 10,
		filterNavigation = true,
		useSimplification = true,
		simplificationTolerance = 1,
		minTimeInterval = 15,
		minDistance = 1,
		speedChangeThreshold = 5,
		courseChangeThreshold = 30,
		keepKeyPoints = true,
		maxPoints,
		samplingStrategy = 'adaptive',
	} = options || {};

	// 确保输入数据按时间排序
	let processedData = [...trajectoryData].sort((a, b) => {
		const timeA = new Date(a.utc.replace(' ', 'T')).getTime();
		const timeB = new Date(b.utc.replace(' ', 'T')).getTime();
		return timeA - timeB;
	});

	// 1. 过滤重复的靠港点（保持状态段连续性）
	processedData = filterDuplicatePortPoints(
		processedData,
		portFilterDistance,
		portFilterTime
	);

	// 2. 过滤航行轨迹点（可选，按状态段分别处理）
	if (filterNavigation) {
		processedData = filterNavigationPoints(processedData, {
			useSimplification,
			simplificationTolerance,
			minTimeInterval,
			minDistance,
			speedChangeThreshold,
			courseChangeThreshold,
			keepKeyPoints,
		});
	}

	// 3. 如果设置了最大点数限制，进行二次抽样（保持状态段连续性）
	if (maxPoints && processedData.length > maxPoints) {
		processedData = secondarySampling(
			processedData,
			maxPoints,
			samplingStrategy
		);
	}

	// 4. 匹配港口信息（最终结果已按时间排序）
	return matchPortsToTrajectory(
		portMapByLocation,
		processedData,
		maxMatchDistance
	);
}

/**
 * 二次抽样：当数据点仍然过多时，进行进一步缩减
 * 按状态段分别处理，保持轨迹的完整性
 * @param trajectoryData 轨迹数据（必须按时间排序）
 * @param maxPoints 最大保留点数
 * @param strategy 抽样策略
 * @returns 抽样后的轨迹数据（按时间排序）
 */
function secondarySampling(
	trajectoryData: TrajectoryPoint[],
	maxPoints: number,
	strategy: 'uniform' | 'adaptive'
): TrajectoryPoint[] {
	if (trajectoryData.length <= maxPoints) {
		return trajectoryData;
	}

	// 按连续状态段分组
	const segments = groupByContinuousStatus(trajectoryData);

	// 统计靠港点总数
	const totalPortPoints = segments
		.filter((seg) => seg.length > 0 && seg[0].naviStatus === 1)
		.reduce((sum, seg) => sum + seg.length, 0);

	// 如果靠港点数量已经超过限制，只保留靠港点
	if (totalPortPoints >= maxPoints) {
		const portPoints: TrajectoryPoint[] = [];
		for (const segment of segments) {
			if (segment.length > 0 && segment[0].naviStatus === 1) {
				portPoints.push(...segment);
			}
		}
		return portPoints.sort((a, b) => {
			const timeA = new Date(a.utc.replace(' ', 'T')).getTime();
			const timeB = new Date(b.utc.replace(' ', 'T')).getTime();
			return timeA - timeB;
		});
	}

	const remainingQuota = maxPoints - totalPortPoints;
	const processedSegments: TrajectoryPoint[] = [];

	// 收集所有航行段
	const navSegments: TrajectoryPoint[][] = [];
	for (const segment of segments) {
		if (segment.length > 0 && segment[0].naviStatus === 1) {
			// 靠港段：全部保留
			processedSegments.push(...segment);
		} else {
			// 航行段：收集起来统一处理
			navSegments.push(segment);
		}
	}

	// 计算所有航行点的总数
	const totalNavPoints = navSegments.reduce((sum, seg) => sum + seg.length, 0);

	if (totalNavPoints > 0 && remainingQuota > 0) {
		// 将航行段展开为单个数组（保持时间顺序）
		const allNavPoints: TrajectoryPoint[] = [];
		for (const segment of navSegments) {
			allNavPoints.push(...segment);
		}

		let sampledNavPoints: TrajectoryPoint[];
		if (strategy === 'uniform') {
			// 均匀抽样：按固定间隔抽取
			sampledNavPoints = uniformSampling(allNavPoints, remainingQuota);
		} else {
			// 自适应抽样：保留重要点（航向/速度变化大的点）
			sampledNavPoints = adaptiveSampling(allNavPoints, remainingQuota);
		}

		processedSegments.push(...sampledNavPoints);
	}

	// 按时间排序返回
	return processedSegments.sort((a, b) => {
		const timeA = new Date(a.utc.replace(' ', 'T')).getTime();
		const timeB = new Date(b.utc.replace(' ', 'T')).getTime();
		return timeA - timeB;
	});
}

/**
 * 均匀抽样
 */
function uniformSampling(
	points: TrajectoryPoint[],
	targetCount: number
): TrajectoryPoint[] {
	if (points.length <= targetCount) {
		return points;
	}

	const step = points.length / targetCount;
	const sampled: TrajectoryPoint[] = [];

	for (let i = 0; i < targetCount; i++) {
		const index = Math.floor(i * step);
		sampled.push(points[index]);
	}

	// 确保最后一个点被保留
	if (sampled[sampled.length - 1]?.id !== points[points.length - 1].id) {
		sampled[sampled.length - 1] = points[points.length - 1];
	}

	return sampled;
}

/**
 * 自适应抽样：优先保留重要点
 */
function adaptiveSampling(
	points: TrajectoryPoint[],
	targetCount: number
): TrajectoryPoint[] {
	if (points.length <= targetCount) {
		return points;
	}

	// 计算每个点的重要性分数
	const scoredPoints = points.map((point, index) => {
		let score = 0;

		// 起点和终点必须保留
		if (index === 0 || index === points.length - 1) {
			score = Infinity;
		} else {
			const prev = points[index - 1];

			// 速度变化
			const speedChange = Math.abs(
				parseFloat(point.sog) - parseFloat(prev.sog)
			);
			score += speedChange * 10;

			// 航向变化
			const courseChange = calculateCourseChange(
				parseFloat(prev.cog),
				parseFloat(point.cog)
			);
			score += courseChange;

			// 距离因素（距离较远的点更重要）
			const distance = calculateDistance(
				prev.latitude,
				prev.longitude,
				point.latitude,
				point.longitude
			);
			score += distance * 5;
		}

		return { point, score };
	});

	// 按分数排序，保留分数最高的点
	scoredPoints.sort((a, b) => b.score - a.score);
	const selected = scoredPoints.slice(0, targetCount).map((item) => item.point);

	// // 按时间顺序排序（保持原始顺序）
	// return selected.sort((a, b) => {
	//   const timeA = new Date(a.utc.replace(' ', 'T')).getTime();
	//   const timeB = new Date(b.utc.replace(' ', 'T')).getTime();
	//   return timeA - timeB;
	// });
	return selected;
}
