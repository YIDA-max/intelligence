/**
 * 大规模航线数据生成器
 *
 * 功能说明�?
 * - 模拟船舶�?分钟产生一个位置数据点
 * - 所有坐标精确到小数点后7�?
 * - 支持三种航行状态：已完成、刚出发、航行中
 *
 * 配置参数说明�?
 * @param shipNumMax - 总船舶数量（默认�?00�?
 * @param pointNumMax - 完整航线的坐标点数量（默认：20000�?
 * @param completedShipRatio - 已完成航线的比例（默认：0.25 = 25%�?
 * @param justDepartedShipRatio - 刚出发航线的比例（默认：0.25 = 25%�?
 * @param inTransitShipRatio - 航行中航线的比例（默认：0.50 = 50%�?
 * @param justDepartedProgressMin - 刚出发航线最小进度（默认�?.01 = 1%�?
 * @param justDepartedProgressMax - 刚出发航线最大进度（默认�?.05 = 5%�?
 * @param inTransitProgressMin - 航行中航线最小进度（默认�?.20 = 20%�?
 * @param inTransitProgressMax - 航行中航线最大进度（默认�?.95 = 95%�?
 *
 * 快速调整示例：
 * - 增加船舶数量�?00艘：修改 shipNumMax = 500
 * - 增加坐标点到50000个：修改 pointNumMax = 50000
 * - 调整已完成比例到50%：修�?completedShipRatio = 0.50
 * - 调整刚出发进度范围：修改 justDepartedProgressMin/Max
 *
 * 注意：三种状态比例之和应等于1.0
 */

interface Coordinate {
	id: number; // 数据id
	latitude: number; // 纬度
	longitude: number; // 经度
	lat?: number; // 纬度 (Google Maps 格式)
	lng?: number; // 经度 (Google Maps 格式)
	vessel: string; // 航次数据/船名
	naviStatus: number; // 航行状态 0=在航, 1=靠港 靠港表示这是一个港口
	hdg: string; // 航向 (Heading)
	cog: string; // 对地航向 (Course Over Ground)
	sog: string; // 对地航速(Speed Over Ground)
	utc: string; // UTC时间
}

interface ShipRoute {
	id: number;
	name: string;
	naviStatus: 'moving' | 'stopped';
	start: Coordinate;
	end: Coordinate;
	traveledPath: Coordinate[];
	color: string;
}

// ============ 配置参数 ============
const shipNumMax = 10; // 总航线数
const pointNumMax = 50; // 完整航线的坐标数�?

// 航线状态分布配置（三种状态比例之和应�?.0�?
const completedShipRatio = 0.25; // 已完成航线比�?(25% = 50�?
const justDepartedShipRatio = 0.25; // 刚出发航线比�?(25% = 50�?
const inTransitShipRatio = 0.5; // 航行中航线比�?(50% = 100�?

// 进度范围配置
const justDepartedProgressMin = 0.01; // 刚出发最小进�?(1%)
const justDepartedProgressMax = 0.05; // 刚出发最大进�?(5%)
const inTransitProgressMin = 0.2; // 航行中最小进�?(20%)
const inTransitProgressMax = 0.95; // 航行中最大进�?(95%)

// 计算各状态船舶数�?
const completedShipCount = Math.floor(shipNumMax * completedShipRatio);
const justDepartedShipCount = Math.floor(shipNumMax * justDepartedShipRatio);
const inTransitShipCount =
	shipNumMax - completedShipCount - justDepartedShipCount;

// 验证配置
if (
	Math.abs(
		completedShipRatio + justDepartedShipRatio + inTransitShipRatio - 1.0
	) > 0.01
) {
	throw new Error('三种状态比例之和应等于1.0');
}
// ===================================

// 辅助函数：生成UTC时间字符�?
function generateUTCTime(baseTime: Date, minutesOffset: number): string {
	const time = new Date(baseTime.getTime() + minutesOffset * 60000);
	return time.toISOString().replace('T', ' ').substring(0, 19);
}

// 辅助函数：生成随机航向和航�?
function generateNavigationData(isMoving: boolean) {
	if (!isMoving) {
		return {
			hdg: '0.00',
			cog: '0.00',
			sog: '0.00',
		};
	}
	const hdg = (Math.random() * 360).toFixed(2);
	const cog = (parseFloat(hdg) + (Math.random() - 0.5) * 10).toFixed(2);
	const sog = (10 + Math.random() * 15).toFixed(2); // 10-25�?
	return { hdg, cog, sog };
}

// 辅助函数：在两点之间生成插值点，精确到小数点后7�?
function interpolatePoints(
	start: Coordinate,
	end: Coordinate,
	numPoints: number,
	vesselName: string,
	startTime: Date,
	isMoving: boolean
): Coordinate[] {
	const points: Coordinate[] = [];
	let pointId = Math.floor(Math.random() * 10000); // 起始ID

	for (let i = 0; i <= numPoints; i++) {
		const ratio = i / numPoints;
		const navData = generateNavigationData(isMoving);

		points.push({
			id: pointId++,
			latitude: parseFloat(
				(start.latitude + (end.latitude - start.latitude) * ratio).toFixed(7)
			),
			longitude: parseFloat(
				(start.longitude + (end.longitude - start.longitude) * ratio).toFixed(7)
			),
			lat: parseFloat(
				(start.latitude + (end.latitude - start.latitude) * ratio).toFixed(7)
			),
			lng: parseFloat(
				(start.longitude + (end.longitude - start.longitude) * ratio).toFixed(7)
			),
			vessel: vesselName,
			naviStatus: isMoving ? 0 : 1, // 0=在航, 1=靠港
			hdg: navData.hdg,
			cog: navData.cog,
			sog: navData.sog,
			utc: generateUTCTime(startTime, i * 3), // �?分钟一个点
		});
	}
	return points;
}

// 辅助函数：添加随机偏移模拟真实航行轨迹，精确到小数点�?�?
function addRandomOffset(
	points: Coordinate[],
	maxOffset: number = 0.05
): Coordinate[] {
	return points.map((point) => {
		const newLat = parseFloat(
			(point.latitude + (Math.random() - 0.5) * maxOffset).toFixed(7)
		);
		const newLng = parseFloat(
			(point.longitude + (Math.random() - 0.5) * maxOffset).toFixed(7)
		);
		return {
			...point,
			latitude: newLat,
			longitude: newLng,
			lat: newLat,
			lng: newLng,
		};
	});
}

// 辅助函数：通过多个关键点生成完整航�?
function generateRoute(
	waypoints: Coordinate[],
	totalPoints: number,
	vesselName: string,
	includeEndpoint: boolean = true,
	isCompleted: boolean = false
): Coordinate[] {
	const segmentPoints = Math.floor(totalPoints / (waypoints.length - 1));
	let allPoints: Coordinate[] = [];
	const startTime = new Date('2025-09-01T00:00:00Z'); // 基准时间

	const waypointsToUse = includeEndpoint ? waypoints : waypoints.slice(0, -1);

	for (let i = 0; i < waypointsToUse.length - 1; i++) {
		const segmentData = interpolatePoints(
			waypointsToUse[i],
			waypointsToUse[i + 1],
			segmentPoints,
			vesselName,
			new Date(startTime.getTime() + allPoints.length * 3 * 60000),
			!isCompleted || i < waypointsToUse.length - 2
		);
		allPoints = allPoints.concat(segmentData);
	}

	// 添加随机偏移使航线更真实
	const result = addRandomOffset(allPoints.slice(0, totalPoints), 0.03);

	// 如果包含终点，确保最后一个点是终点坐标，并设置为靠港状�?
	if (includeEndpoint && waypoints.length > 0 && isCompleted) {
		const lastPoint = result[result.length - 1];
		const endWaypoint = waypoints[waypoints.length - 1];
		result[result.length - 1] = {
			...lastPoint,
			latitude: endWaypoint.latitude,
			longitude: endWaypoint.longitude,
			lat: endWaypoint.latitude,
			lng: endWaypoint.longitude,
			naviStatus: 1, // 靠港
			hdg: '0.00',
			cog: '0.00',
			sog: '0.00',
		};
	}

	return result;
}

// 辅助函数：生成部分航线（刚出发或航行中）
function generatePartialRoute(
	waypoints: Coordinate[],
	totalPoints: number,
	percentage: number,
	vesselName: string
): Coordinate[] {
	const fullRoute = generateRoute(
		waypoints,
		totalPoints,
		vesselName,
		false,
		false
	);
	const partialLength = Math.floor(fullRoute.length * percentage);
	return fullRoute.slice(0, Math.max(partialLength, 1));
}

// 辅助函数：将简化航点转换为完整坐标�?
function createWaypoint(
	lat: number,
	lng: number,
	vessel: string = 'TEMP',
	id: number = 0
): Coordinate {
	return {
		id,
		latitude: lat,
		longitude: lng,
		lat: lat,
		lng: lng,
		vessel,
		naviStatus: 0,
		hdg: '0.00',
		cog: '0.00',
		sog: '0.00',
		utc: '2025-09-01 00:00:00',
	};
}

// 航线1: 青岛 -> 鹿特�?(经苏伊士运河)
const route1Waypoints: Coordinate[] = [
	createWaypoint(36.078, 120.328), // 青岛
	createWaypoint(31.23, 121.473), // 上海附近
	createWaypoint(22.319, 114.169), // 香港外海
	createWaypoint(10.5, 107.0), // 南海
	createWaypoint(1.264, 103.817), // 新加坡海�?
	createWaypoint(6.0, 95.0), // 安达曼海
	createWaypoint(13.083, 80.27), // 印度金奈外海
	createWaypoint(15.0, 73.0), // 阿拉伯海
	createWaypoint(20.0, 60.0), // 阿曼�?
	createWaypoint(25.0, 56.0), // 波斯湾入�?
	createWaypoint(29.985, 32.549), // 苏伊士运河南�?
	createWaypoint(31.26, 32.29), // 苏伊士运河北�?
	createWaypoint(33.0, 28.0), // 地中海东�?
	createWaypoint(36.0, 18.0), // 地中海中�?
	createWaypoint(38.0, 10.0), // 地中海西�?
	createWaypoint(36.14, -5.353), // 直布罗陀海峡
	createWaypoint(38.0, -9.0), // 葡萄牙外�?
	createWaypoint(43.0, -8.0), // 比斯开�?
	createWaypoint(48.0, -5.0), // 英吉利海峡西�?
	createWaypoint(51.0, 2.0), // 英吉利海峡东�?
	createWaypoint(51.922, 4.478), // 鹿特�?
];

// 航线2: 上海 -> 洛杉�?(跨太平洋)
const route2Waypoints: Coordinate[] = [
	createWaypoint(31.23, 121.473), // 上海
	createWaypoint(32.0, 125.0), // 东海
	createWaypoint(35.0, 140.0), // 日本东部外海
	createWaypoint(38.0, 155.0), // 西北太平�?
	createWaypoint(40.0, 170.0), // 中太平洋
	createWaypoint(42.0, -175.0), // 国际日期变更�?
	createWaypoint(43.0, -160.0), // 东太平洋
	createWaypoint(42.0, -145.0), // 接近北美
	createWaypoint(40.0, -130.0), // 美国西海岸外�?
	createWaypoint(37.0, -123.0), // 加州外海
	createWaypoint(33.716, -118.272), // 洛杉�?
];

// 航线3: 深圳 -> 纽约 (经巴拿马运河)
const route3Waypoints: Coordinate[] = [
	createWaypoint(22.543, 114.057), // 深圳盐田�?
	createWaypoint(18.0, 115.0), // 南海
	createWaypoint(10.0, 118.0), // 菲律宾海
	createWaypoint(5.0, 125.0), // 棉兰老岛外海
	createWaypoint(0.0, 135.0), // 赤道太平�?
	createWaypoint(-5.0, 145.0), // 南太平洋
	createWaypoint(-10.0, 160.0), // 所罗门群岛外海
	createWaypoint(-8.0, 175.0), // 斐济外海
	createWaypoint(-5.0, -170.0), // 中南太平�?
	createWaypoint(0.0, -150.0), // 赤道中太平洋
	createWaypoint(5.0, -130.0), // 东太平洋
	createWaypoint(8.0, -110.0), // 中美洲外�?
	createWaypoint(9.0, -95.0), // 接近巴拿�?
	createWaypoint(9.356, -79.949), // 巴拿马运河太平洋�?
	createWaypoint(9.38, -79.917), // 巴拿马运河大西洋�?
	createWaypoint(12.0, -75.0), // 加勒比海
	createWaypoint(18.0, -72.0), // 海地外海
	createWaypoint(25.0, -75.0), // 巴哈马外�?
	createWaypoint(32.0, -76.0), // 美国东海岸外�?
	createWaypoint(38.0, -74.5), // 接近纽约
	createWaypoint(40.689, -74.044), // 纽约/新泽西港
];

// 航线4: 新加�?-> 汉堡 (经苏伊士运河)
const route4Waypoints: Coordinate[] = [
	createWaypoint(1.264, 103.817), // 新加�?
	createWaypoint(6.0, 95.0), // 安达曼海
	createWaypoint(10.0, 85.0), // 孟加拉湾
	createWaypoint(13.083, 80.27), // 印度金奈外海
	createWaypoint(18.0, 70.0), // 阿拉伯海
	createWaypoint(23.0, 60.0), // 阿曼�?
	createWaypoint(27.0, 50.0), // 波斯�?
	createWaypoint(29.985, 32.549), // 苏伊士运河南�?
	createWaypoint(31.26, 32.29), // 苏伊士运河北�?
	createWaypoint(35.0, 25.0), // 地中海东�?
	createWaypoint(38.0, 15.0), // 地中海中�?
	createWaypoint(36.14, -5.353), // 直布罗陀海峡
	createWaypoint(40.0, -10.0), // 葡萄牙外�?
	createWaypoint(45.0, -8.0), // 比斯开�?
	createWaypoint(50.0, -3.0), // 英吉利海�?
	createWaypoint(52.0, 3.0), // 北海南部
	createWaypoint(54.0, 7.0), // 北海中部
	createWaypoint(53.545, 9.993), // 汉堡
];

// 航线5: 釜山 -> 温哥�?(北太平洋)
const route5Waypoints: Coordinate[] = [
	createWaypoint(35.179, 129.075), // 釜山
	createWaypoint(38.0, 135.0), // 日本�?
	createWaypoint(42.0, 145.0), // 北太平洋西部
	createWaypoint(45.0, 160.0), // 千岛群岛外海
	createWaypoint(48.0, 175.0), // 阿留申群岛外�?
	createWaypoint(50.0, -170.0), // 白令海南�?
	createWaypoint(51.0, -155.0), // 阿拉斯加�?
	createWaypoint(52.0, -140.0), // 阿拉斯加东南外海
	createWaypoint(51.0, -130.0), // 不列颠哥伦比亚外�?
	createWaypoint(49.283, -123.121), // 温哥�?
];

// 航线6: 香港 -> 悉尼
const route6Waypoints: Coordinate[] = [
	createWaypoint(22.319, 114.169), // 香港
	createWaypoint(18.0, 118.0), // 南海
	createWaypoint(10.0, 125.0), // 菲律宾海
	createWaypoint(0.0, 135.0), // 赤道印尼外海
	createWaypoint(-10.0, 145.0), // 珊瑚�?
	createWaypoint(-20.0, 150.0), // 澳大利亚东北外海
	createWaypoint(-30.0, 153.0), // 澳大利亚东海�?
	createWaypoint(-33.865, 151.209), // 悉尼
];

// 航线7: 东京 -> 旧金�?
const route7Waypoints: Coordinate[] = [
	createWaypoint(35.676, 139.65), // 东京
	createWaypoint(37.0, 145.0), // 日本东部外海
	createWaypoint(39.0, 160.0), // 西北太平�?
	createWaypoint(40.0, 175.0), // 中太平洋
	createWaypoint(40.0, -170.0), // 国际日期变更�?
	createWaypoint(39.0, -155.0), // 夏威夷北�?
	createWaypoint(38.0, -140.0), // 东太平洋
	createWaypoint(37.775, -122.419), // 旧金�?
];

// 航线8: 迪拜 -> 伦敦 (经苏伊士运河)
const route8Waypoints: Coordinate[] = [
	createWaypoint(25.276, 55.296), // 迪拜
	createWaypoint(26.0, 56.0), // 波斯�?
	createWaypoint(24.0, 60.0), // 阿曼�?
	createWaypoint(20.0, 65.0), // 阿拉伯海
	createWaypoint(15.0, 55.0), // 也门外海
	createWaypoint(12.0, 45.0), // 亚丁�?
	createWaypoint(13.0, 43.0), // 红海南部
	createWaypoint(20.0, 38.0), // 红海中部
	createWaypoint(27.0, 34.0), // 红海北部
	createWaypoint(29.985, 32.549), // 苏伊士运河南�?
	createWaypoint(31.26, 32.29), // 苏伊士运河北�?
	createWaypoint(34.0, 25.0), // 地中海东�?
	createWaypoint(37.0, 12.0), // 地中海中�?
	createWaypoint(36.14, -5.353), // 直布罗陀海峡
	createWaypoint(42.0, -9.0), // 比斯开�?
	createWaypoint(48.0, -5.0), // 英吉利海峡西�?
	createWaypoint(50.0, -1.0), // 英吉利海峡中�?
	createWaypoint(51.507, -0.127), // 伦敦
];

// 航线9: 墨尔�?-> 开普敦
const route9Waypoints: Coordinate[] = [
	createWaypoint(-37.814, 144.963), // 墨尔�?
	createWaypoint(-38.0, 140.0), // 澳大利亚南部外海
	createWaypoint(-40.0, 130.0), // 大澳大利亚湾
	createWaypoint(-42.0, 115.0), // 印度洋东南部
	createWaypoint(-43.0, 95.0), // 印度洋中南部
	createWaypoint(-42.0, 75.0), // 印度洋西南部
	createWaypoint(-40.0, 55.0), // 马达加斯加南部外�?
	createWaypoint(-38.0, 35.0), // 莫桑比克海峡南部
	createWaypoint(-35.0, 25.0), // 南非东海岸外�?
	createWaypoint(-33.925, 18.424), // 开普敦
];

// 航线10: 圣保�?桑托斯港) -> 上海 (跨太平洋)
const route10Waypoints: Coordinate[] = [
	createWaypoint(-23.96, -46.333), // 桑托斯港
	createWaypoint(-25.0, -45.0), // 巴西东南海岸
	createWaypoint(-30.0, -40.0), // 南大西洋西部
	createWaypoint(-35.0, -30.0), // 南大西洋中部
	createWaypoint(-38.0, -15.0), // 南大西洋东部
	createWaypoint(-35.0, 0.0), // 非洲西南外海
	createWaypoint(-34.0, 18.0), // 开普敦外海
	createWaypoint(-35.0, 35.0), // 印度洋西南部
	createWaypoint(-30.0, 55.0), // 印度洋中南部
	createWaypoint(-20.0, 75.0), // 印度洋中�?
	createWaypoint(-10.0, 90.0), // 印度洋东�?
	createWaypoint(0.0, 100.0), // 赤道印度�?
	createWaypoint(5.0, 105.0), // 马六甲海峡南�?
	createWaypoint(10.0, 110.0), // 南海南部
	createWaypoint(20.0, 115.0), // 南海中部
	createWaypoint(28.0, 120.0), // 东海
	createWaypoint(31.23, 121.473), // 上海
];

// 航线11: 天津 -> 安特卫普 (经苏伊士运河)
const route11Waypoints: Coordinate[] = [
	createWaypoint(39.021, 117.709), // 天津
	createWaypoint(36.0, 121.0), // 渤海�?
	createWaypoint(30.0, 123.0), // 东海
	createWaypoint(22.0, 118.0), // 台湾海峡
	createWaypoint(15.0, 112.0), // 南海
	createWaypoint(8.0, 105.0), // 泰国�?
	createWaypoint(1.264, 103.817), // 新加坡海�?
	createWaypoint(5.0, 92.0), // 安达曼海
	createWaypoint(12.0, 78.0), // 孟加拉湾
	createWaypoint(18.0, 68.0), // 阿拉伯海
	createWaypoint(24.0, 58.0), // 阿曼�?
	createWaypoint(29.985, 32.549), // 苏伊士运河南�?
	createWaypoint(31.26, 32.29), // 苏伊士运河北�?
	createWaypoint(35.0, 22.0), // 地中海东�?
	createWaypoint(38.0, 8.0), // 地中海西�?
	createWaypoint(36.14, -5.353), // 直布罗陀海峡
	createWaypoint(43.0, -7.0), // 比斯开�?
	createWaypoint(49.0, -2.0), // 英吉利海�?
	createWaypoint(51.0, 2.5), // 北海南部
	createWaypoint(51.22, 4.405), // 安特卫普
];

// 航线12: 釜山 -> 长滩�?(洛杉�?
const route12Waypoints: Coordinate[] = [
	createWaypoint(35.179, 129.075), // 釜山
	createWaypoint(36.0, 135.0), // 日本�?
	createWaypoint(38.0, 150.0), // 西北太平�?
	createWaypoint(40.0, 165.0), // 中太平洋
	createWaypoint(40.0, -180.0), // 国际日期变更�?
	createWaypoint(38.0, -165.0), // 东太平洋
	createWaypoint(36.0, -145.0), // 美国西海岸外�?
	createWaypoint(34.0, -125.0), // 加州外海
	createWaypoint(33.754, -118.193), // 长滩�?
];

// 航线13: 高雄 -> 鹿特�?(经苏伊士运河)
const route13Waypoints: Coordinate[] = [
	createWaypoint(22.617, 120.266), // 高雄
	createWaypoint(20.0, 118.0), // 台湾海峡南部
	createWaypoint(15.0, 115.0), // 南海
	createWaypoint(8.0, 110.0), // 南海南部
	createWaypoint(1.264, 103.817), // 新加坡海�?
	createWaypoint(6.0, 94.0), // 安达曼海
	createWaypoint(13.083, 80.27), // 印度金奈外海
	createWaypoint(20.0, 68.0), // 阿拉伯海
	createWaypoint(25.0, 58.0), // 阿曼�?
	createWaypoint(29.985, 32.549), // 苏伊士运河南�?
	createWaypoint(31.26, 32.29), // 苏伊士运河北�?
	createWaypoint(34.0, 26.0), // 地中海东�?
	createWaypoint(37.0, 14.0), // 地中海中�?
	createWaypoint(36.14, -5.353), // 直布罗陀海峡
	createWaypoint(40.0, -9.0), // 葡萄牙外�?
	createWaypoint(45.0, -6.0), // 比斯开�?
	createWaypoint(50.0, -1.0), // 英吉利海�?
	createWaypoint(51.922, 4.478), // 鹿特�?
];

// 航线14: 新加�?-> 迈阿�?(经巴拿马运河)
const route14Waypoints: Coordinate[] = [
	createWaypoint(1.264, 103.817), // 新加�?
	createWaypoint(-5.0, 110.0), // 爪哇�?
	createWaypoint(-10.0, 125.0), // 帝汶�?
	createWaypoint(-12.0, 140.0), // 阿拉弗拉�?
	createWaypoint(-10.0, 155.0), // 珊瑚�?
	createWaypoint(-5.0, 170.0), // 所罗门群岛外海
	createWaypoint(0.0, -175.0), // 赤道中太平洋
	createWaypoint(5.0, -155.0), // 夏威夷南�?
	createWaypoint(8.0, -130.0), // 东太平洋
	createWaypoint(9.0, -100.0), // 中美洲外�?
	createWaypoint(9.356, -79.949), // 巴拿马运河太平洋�?
	createWaypoint(9.38, -79.917), // 巴拿马运河大西洋�?
	createWaypoint(12.0, -78.0), // 加勒比海西部
	createWaypoint(18.0, -80.0), // 古巴南部外海
	createWaypoint(23.0, -82.0), // 佛罗里达海峡
	createWaypoint(25.761, -80.191), // 迈阿�?
];

// 航线15: 大连 -> 汉堡 (经苏伊士运河)
const route15Waypoints: Coordinate[] = [
	createWaypoint(38.914, 121.614), // 大连
	createWaypoint(36.0, 122.0), // 黄海
	createWaypoint(30.0, 125.0), // 东海
	createWaypoint(22.0, 120.0), // 台湾海峡
	createWaypoint(12.0, 115.0), // 南海
	createWaypoint(1.264, 103.817), // 新加坡海�?
	createWaypoint(8.0, 88.0), // 安达曼海
	createWaypoint(15.0, 75.0), // 阿拉伯海
	createWaypoint(22.0, 62.0), // 阿曼�?
	createWaypoint(29.985, 32.549), // 苏伊士运河南�?
	createWaypoint(31.26, 32.29), // 苏伊士运河北�?
	createWaypoint(35.0, 24.0), // 地中海东�?
	createWaypoint(38.0, 10.0), // 地中海中�?
	createWaypoint(36.14, -5.353), // 直布罗陀海峡
	createWaypoint(43.0, -8.0), // 比斯开�?
	createWaypoint(50.0, -2.0), // 英吉利海�?
	createWaypoint(53.0, 5.0), // 北海
	createWaypoint(53.545, 9.993), // 汉堡
];

// 航线16: 横滨 -> 西雅�?
const route16Waypoints: Coordinate[] = [
	createWaypoint(35.443, 139.638), // 横滨
	createWaypoint(38.0, 148.0), // 日本东部外海
	createWaypoint(42.0, 165.0), // 西北太平�?
	createWaypoint(45.0, -180.0), // 国际日期变更�?
	createWaypoint(47.0, -165.0), // 阿留申群岛南�?
	createWaypoint(48.0, -145.0), // 阿拉斯加�?
	createWaypoint(48.0, -130.0), // 美国西北外海
	createWaypoint(47.606, -122.332), // 西雅�?
];

// 航线17: 孟买 -> 纽约 (经苏伊士运河)
const route17Waypoints: Coordinate[] = [
	createWaypoint(18.94, 72.835), // 孟买
	createWaypoint(16.0, 68.0), // 阿拉伯海
	createWaypoint(12.0, 55.0), // 阿拉伯海西部
	createWaypoint(12.0, 45.0), // 亚丁�?
	createWaypoint(15.0, 42.0), // 红海南部
	createWaypoint(22.0, 37.0), // 红海中部
	createWaypoint(29.985, 32.549), // 苏伊士运河南�?
	createWaypoint(31.26, 32.29), // 苏伊士运河北�?
	createWaypoint(34.0, 28.0), // 地中海东�?
	createWaypoint(37.0, 16.0), // 地中海中�?
	createWaypoint(36.14, -5.353), // 直布罗陀海峡
	createWaypoint(38.0, -15.0), // 大西洋东�?
	createWaypoint(40.0, -30.0), // 大西洋中�?
	createWaypoint(40.0, -50.0), // 大西洋西�?
	createWaypoint(40.689, -74.044), // 纽约
];

// 航线18: 巴塞罗那 -> 上海 (经苏伊士运河)
const route18Waypoints: Coordinate[] = [
	createWaypoint(41.38, 2.173), // 巴塞罗那
	createWaypoint(38.0, 8.0), // 地中海西�?
	createWaypoint(35.0, 18.0), // 地中海中�?
	createWaypoint(32.0, 28.0), // 地中海东�?
	createWaypoint(31.26, 32.29), // 苏伊士运河北�?
	createWaypoint(29.985, 32.549), // 苏伊士运河南�?
	createWaypoint(25.0, 38.0), // 红海中部
	createWaypoint(15.0, 43.0), // 红海南部
	createWaypoint(12.0, 48.0), // 亚丁�?
	createWaypoint(15.0, 60.0), // 阿拉伯海
	createWaypoint(18.0, 72.0), // 印度西海岸外�?
	createWaypoint(13.083, 80.27), // 印度金奈外海
	createWaypoint(8.0, 90.0), // 孟加拉湾
	createWaypoint(1.264, 103.817), // 新加坡海�?
	createWaypoint(8.0, 110.0), // 南海南部
	createWaypoint(18.0, 116.0), // 南海中部
	createWaypoint(28.0, 122.0), // 东海
	createWaypoint(31.23, 121.473), // 上海
];

// 航线19: 悉尼 -> 温哥�?
const route19Waypoints: Coordinate[] = [
	createWaypoint(-33.865, 151.209), // 悉尼
	createWaypoint(-30.0, 158.0), // 澳大利亚东海岸外�?
	createWaypoint(-20.0, 165.0), // 珊瑚�?
	createWaypoint(-10.0, 170.0), // 所罗门群岛外海
	createWaypoint(0.0, 175.0), // 赤道西太平洋
	createWaypoint(10.0, -180.0), // 国际日期变更�?
	createWaypoint(20.0, -170.0), // 夏威夷南�?
	createWaypoint(30.0, -155.0), // 夏威夷北�?
	createWaypoint(40.0, -140.0), // 东北太平�?
	createWaypoint(48.0, -130.0), // 不列颠哥伦比亚外�?
	createWaypoint(49.283, -123.121), // 温哥�?
];

// 航线20: 利马(卡亚俄港) -> 上海 (跨太平洋)
const route20Waypoints: Coordinate[] = [
	createWaypoint(-12.066, -77.15), // 卡亚俄港(利马)
	createWaypoint(-10.0, -85.0), // 秘鲁外海
	createWaypoint(-5.0, -95.0), // 东太平洋
	createWaypoint(0.0, -110.0), // 赤道东太平洋
	createWaypoint(5.0, -125.0), // 中太平洋
	createWaypoint(10.0, -140.0), // 中太平洋北部
	createWaypoint(15.0, -155.0), // 夏威夷南�?
	createWaypoint(20.0, -170.0), // 中太平洋
	createWaypoint(25.0, 175.0), // 西太平洋
	createWaypoint(28.0, 160.0), // 西北太平�?
	createWaypoint(30.0, 145.0), // 日本外海
	createWaypoint(31.0, 130.0), // 东海
	createWaypoint(31.23, 121.473), // 上海
];

// 生成所有航线数�?
// 生成200种颜�?
const colors = [
	'#4285F4',
	'#DB4437',
	'#F4B400',
	'#0F9D58',
	'#AB47BC',
	'#00ACC1',
	'#FF7043',
	'#9E9D24',
	'#5C6BC0',
	'#F06292',
	'#26A69A',
	'#FF5722',
	'#7E57C2',
	'#29B6F6',
	'#66BB6A',
	'#FFA726',
	'#EC407A',
	'#42A5F5',
	'#8D6E63',
	'#78909C',
	'#E91E63',
	'#9C27B0',
	'#673AB7',
	'#3F51B5',
	'#2196F3',
	'#03A9F4',
	'#00BCD4',
	'#009688',
	'#4CAF50',
	'#8BC34A',
	'#CDDC39',
	'#FFEB3B',
	'#FFC107',
	'#FF9800',
	'#FF5722',
	'#795548',
	'#607D8B',
	'#F44336',
	'#E81E63',
	'#9C28B0',
];

// 生成200个船�?
const shipPrefixes = [
	'远航号',
	'海神号',
	'探索者号',
	'先锋号',
	'勇士号',
	'征服者号',
	'航海家号',
	'冒险号',
	'发现号',
	'领航者号',
	'开拓者号',
	'巨轮号',
	'飞鲸号',
	'海龙号',
	'蓝鲸号',
	'海鹰号',
	'破浪号',
	'乘风号',
	'扬帆号',
	'启航号',
	'远洋号',
	'深海号',
	'巨鲸号',
	'海豚号',
	'海星号',
	'珊瑚号',
	'贝壳号',
	'浪花号',
	'潮汐号',
	'海风号',
	'海浪号',
	'海洋号',
	'航程号',
	'航道号',
	'航标号',
	'锚泊号',
	'舵手号',
	'船长号',
	'水手号',
	'舰队号',
];

const shipNames: string[] = [];
for (let i = 0; i < shipNumMax; i++) {
	const prefix = shipPrefixes[i % shipPrefixes.length];
	shipNames.push(`${prefix}${i + 1}`);
}

// ============ 数据生成说明 ============
// 根据配置参数自动计算�?
// - 已完成航�? ID 1 ~ completedShipCount
//   状�? stopped, 进度: 100%, 坐标点数: pointNumMax
// - 刚出发航�? ID (completedShipCount + 1) ~ (completedShipCount + justDepartedShipCount)
//   状�? moving, 进度: justDepartedProgressMin ~ justDepartedProgressMax
// - 航行中航�? ID (completedShipCount + justDepartedShipCount + 1) ~ shipNumMax
//   状�? moving, 进度: inTransitProgressMin ~ inTransitProgressMax
// ======================================

// 所有航线模板（循环使用�?
const allRouteWaypoints = [
	route1Waypoints,
	route2Waypoints,
	route3Waypoints,
	route4Waypoints,
	route5Waypoints,
	route6Waypoints,
	route7Waypoints,
	route8Waypoints,
	route9Waypoints,
	route10Waypoints,
	route11Waypoints,
	route12Waypoints,
	route13Waypoints,
	route14Waypoints,
	route15Waypoints,
	route16Waypoints,
	route17Waypoints,
	route18Waypoints,
	route19Waypoints,
	route20Waypoints,
];

// 生成航线数据
export const largeShipRoutes: ShipRoute[] = [];

// === 已完成航�?- 状态为 stopped，包含终点坐�?===
for (let i = 0; i < completedShipCount; i++) {
	const waypoints = allRouteWaypoints[i % allRouteWaypoints.length];
	const vesselName = shipNames[i];
	largeShipRoutes.push({
		id: i + 1,
		name: vesselName,
		status: 'stopped',
		start: waypoints[0],
		end: waypoints[waypoints.length - 1],
		traveledPath: generateRoute(waypoints, pointNumMax, vesselName, true, true), // 已到达终�?
		color: colors[i % colors.length],
	});
}

// === 刚出发航�?- 状态为 moving，进度范围由配置决定 ===
const justDepartedStartIndex = completedShipCount;
const justDepartedEndIndex = completedShipCount + justDepartedShipCount;
for (let i = justDepartedStartIndex; i < justDepartedEndIndex; i++) {
	const waypoints = allRouteWaypoints[i % allRouteWaypoints.length];
	const vesselName = shipNames[i];
	const progressRange = justDepartedProgressMax - justDepartedProgressMin;
	const progress = justDepartedProgressMin + Math.random() * progressRange;
	largeShipRoutes.push({
		id: i + 1,
		name: vesselName,
		status: 'moving',
		start: waypoints[0],
		end: waypoints[waypoints.length - 1],
		traveledPath: generatePartialRoute(
			waypoints,
			pointNumMax,
			progress,
			vesselName
		),
		color: colors[i % colors.length],
	});
}

// === 航行中航�?- 状态为 moving，进度范围由配置决定 ===
const inTransitStartIndex = justDepartedEndIndex;
const inTransitEndIndex = shipNumMax;
for (let i = inTransitStartIndex; i < inTransitEndIndex; i++) {
	const waypoints = allRouteWaypoints[i % allRouteWaypoints.length];
	const vesselName = shipNames[i];
	const progressRange = inTransitProgressMax - inTransitProgressMin;
	const progress = inTransitProgressMin + Math.random() * progressRange;
	largeShipRoutes.push({
		id: i + 1,
		name: vesselName,
		status: 'moving',
		start: waypoints[0],
		end: waypoints[waypoints.length - 1],
		traveledPath: generatePartialRoute(
			waypoints,
			pointNumMax,
			progress,
			vesselName
		),
		color: colors[i % colors.length],
	});
}

// 导出配置信息（供外部查看和调整）
export const routeConfig = {
	shipNumMax,
	pointNumMax,
	completedShipRatio,
	justDepartedShipRatio,
	inTransitShipRatio,
	justDepartedProgressMin,
	justDepartedProgressMax,
	inTransitProgressMin,
	inTransitProgressMax,
	completedShipCount,
	justDepartedShipCount,
	inTransitShipCount,
};

// 导出统计信息
export const routeStats = {
	// 配置信息
	largeShipRoutes,
	config: {
		totalShips: shipNumMax,
		pointsPerCompletedRoute: pointNumMax,
		completedRatio: `${(completedShipRatio * 100).toFixed(0)}%`,
		justDepartedRatio: `${(justDepartedShipRatio * 100).toFixed(0)}%`,
		inTransitRatio: `${(inTransitShipRatio * 100).toFixed(0)}%`,
		justDepartedProgressRange: `${(justDepartedProgressMin * 100).toFixed(
			0
		)}%-${(justDepartedProgressMax * 100).toFixed(0)}%`,
		inTransitProgressRange: `${(inTransitProgressMin * 100).toFixed(0)}%-${(
			inTransitProgressMax * 100
		).toFixed(0)}%`,
	},
	// 实际统计
	actual: {
		totalRoutes: largeShipRoutes.length,
		totalPoints: largeShipRoutes.reduce(
			(sum, route) => sum + route.traveledPath.length,
			0
		),
		averagePointsPerRoute: Math.floor(
			largeShipRoutes.reduce(
				(sum, route) => sum + route.traveledPath.length,
				0
			) / largeShipRoutes.length
		),
		completedRoutes: completedShipCount,
		justDepartedRoutes: justDepartedShipCount,
		inTransitRoutes: inTransitShipCount,
		stoppedShips: largeShipRoutes.filter((r) => r.naviStatus === 'stopped')
			.length,
		movingShips: largeShipRoutes.filter((r) => r.naviStatus === 'moving')
			.length,
	},
	// 详细分布
	distribution: {
		completed: largeShipRoutes.slice(0, completedShipCount).map((r) => ({
			id: r.id,
			name: r.name,
			naviStatus: r.naviStatus,
			points: r.traveledPath.length,
			progress: '100%',
		})),
		justDeparted: largeShipRoutes
			.slice(completedShipCount, completedShipCount + justDepartedShipCount)
			.map((r) => ({
				id: r.id,
				name: r.name,
				naviStatus: r.naviStatus,
				points: r.traveledPath.length,
				progress: `${((r.traveledPath.length / pointNumMax) * 100).toFixed(
					1
				)}%`,
			})),
		inTransit: largeShipRoutes
			.slice(completedShipCount + justDepartedShipCount)
			.map((r) => ({
				id: r.id,
				name: r.name,
				naviStatus: r.naviStatus,
				points: r.traveledPath.length,
				progress: `${((r.traveledPath.length / pointNumMax) * 100).toFixed(
					1
				)}%`,
			})),
	},
	// 摘要
	summary: `${shipNumMax}艘船�? ${completedShipCount}艘已到港(${pointNumMax}号', ${justDepartedShipCount}艘刚出发(${(
		justDepartedProgressMin * 100
	).toFixed(0)}-${(justDepartedProgressMax * 100).toFixed(
		0
	)}%), ${inTransitShipCount}艘航行中(${(inTransitProgressMin * 100).toFixed(
		0
	)}-${(inTransitProgressMax * 100).toFixed(0)}%)`,
};
