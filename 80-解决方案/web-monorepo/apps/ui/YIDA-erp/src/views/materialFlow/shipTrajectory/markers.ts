// 导入大规模航线数据
// import {  routeStats, routeConfig } from './largeRouteData';

import { portMapByLocation } from './portMap';
import { portData, portData2 } from './pino';
import { processTrajectoryData } from './commonKiro';

// 方式1：综合处理（推荐）
const result = processTrajectoryData(portMapByLocation, portData, {
	maxMatchDistance: 5,
	filterNavigation: true,
	useSimplification: true,
	simplificationTolerance: 5,
});
const result2 = processTrajectoryData(portMapByLocation, portData2, {
	maxMatchDistance: 5,
	filterNavigation: true,
	useSimplification: true,
	simplificationTolerance: 5,
});
// console.log({result});
// console.log({portData});
// console.log({result2});
// console.log({portData2});
const shipsMap: any = {
	id: 1,
	name: 'test',
	status: 'stopped',
	start: result[0],
	end: result[result.length - 1],
	traveledPath: result,
	color: '#4285F4',
};
const shipsMap2: any = {
	id: 2,
	name: 'test2',
	status: 'stopped',
	start: result2[0],
	end: result2[result2.length - 1],
	traveledPath: result2,
	color: '#DB4437',
};
// 使用大规模数据
// 数据规模由 largeRouteData.ts 中的配置参数控制
// 默认配置：200艘船舶，完整航线20000个坐标点
// export const ships = largeShipRoutes;
// export const ships = [shipsMap];
export const ships = [shipsMap, shipsMap2];

/**
 * 货柜
 */
export const shipDataListMarkers = [
	{
		value: 'UUDU7065177',
		label: 'UUDU7065177',
		departureTime: '2025-08-10 10:00',
		routeInfo: {
			shipName: 'MSC LARA III',
			actualDepartureTime: '2025-08-10 10:00',
			portStops: [
				{
					portNameEn: 'Shanghai Port',
					countryNameEn: 'China',
					portNameZh: '上海港',
					countryNameZh: '中国',
					departureTime: '2025-08-11 10:00',
					arrivalTime: '2025-08-10 10:00',
				},
				{
					portNameEn: 'Singapore Port',
					countryNameEn: 'Singapore',
					portNameZh: '新加坡港',
					countryNameZh: '新加坡',
					departureTime: '2025-08-08 12:00',
					arrivalTime: '2025-08-08 08:00',
				},
				{
					portNameEn: 'Rotterdam Port',
					countryNameEn: 'Netherlands',
					portNameZh: '鹿特丹港',
					countryNameZh: '荷兰',
					departureTime: '2025-08-07 14:00',
					arrivalTime: '2025-08-07 11:00',
				},
			],
		},
	},
	{
		value: 'CSNU6564939',
		label: 'CSNU6564939',
		departureTime: '2025-07-15 08:30',
		routeInfo: {
			shipName: 'COSCO SHIPPING',
			actualDepartureTime: '2025-07-15 08:30',
			portStops: [
				{
					portNameEn: 'Qingdao Port',
					countryNameEn: 'China',
					portNameZh: '青岛港',
					countryNameZh: '中国',
					departureTime: '2025-07-16 09:00',
					arrivalTime: '2025-07-15 08:30',
				},
				{
					portNameEn: 'Busan Port',
					countryNameEn: 'South Korea',
					portNameZh: '釜山港',
					countryNameZh: '韩国',
					departureTime: '2025-07-18 14:00',
					arrivalTime: '2025-07-17 10:00',
				},
				{
					portNameEn: 'Los Angeles Port',
					countryNameEn: 'USA',
					portNameZh: '洛杉矶港',
					countryNameZh: '美国',
					departureTime: '2025-07-30 16:00',
					arrivalTime: '2025-07-29 12:00',
				},
			],
		},
	},
	{
		value: 'GAOU7051530',
		label: 'GAOU7051530',
		departureTime: '2025-09-01 14:20',
		routeInfo: {
			shipName: 'MAERSK LINE',
			actualDepartureTime: '2025-09-01 14:20',
			portStops: [
				{
					portNameEn: 'Ningbo Port',
					countryNameEn: 'China',
					portNameZh: '宁波港',
					countryNameZh: '中国',
					departureTime: '2025-09-02 15:00',
					arrivalTime: '2025-09-01 14:20',
				},
				{
					portNameEn: 'Dubai Port',
					countryNameEn: 'UAE',
					portNameZh: '迪拜港',
					countryNameZh: '阿联酋',
					departureTime: '2025-09-10 10:00',
					arrivalTime: '2025-09-09 08:00',
				},
			],
		},
	},
];
export const shipDataListMarkers2 = [
	{
		shipName: 'MSC LARA III',
		actualDepartureTime: '2025-08-10 10:00',
		portStops: [
			{
				portNameEn: 'Shanghai Port',
				countryNameEn: 'China',
				portNameZh: '上海港',
				countryNameZh: '中国',
				departureTime: '2025-08-11 10:00',
				arrivalTime: '2025-08-10 10:00',
			},
			{
				portNameEn: 'Singapore Port',
				countryNameEn: 'Singapore',
				portNameZh: '新加坡港',
				countryNameZh: '新加坡',
				departureTime: '2025-08-08 12:00',
				arrivalTime: '2025-08-08 08:00',
			},
			{
				portNameEn: 'Rotterdam Port',
				countryNameEn: 'Netherlands',
				portNameZh: '鹿特丹港',
				countryNameZh: '荷兰',
				departureTime: '2025-08-07 14:00',
				arrivalTime: '2025-08-07 11:00',
			},
		],
	},
	{
		shipName: 'COSCO SHIPPING',
		actualDepartureTime: '2025-07-15 08:30',
		portStops: [
			{
				portNameEn: 'Qingdao Port',
				countryNameEn: 'China',
				portNameZh: '青岛港',
				countryNameZh: '中国',
				departureTime: '2025-07-16 09:00',
				arrivalTime: '2025-07-15 08:30',
			},
			{
				portNameEn: 'Busan Port',
				countryNameEn: 'South Korea',
				portNameZh: '釜山港',
				countryNameZh: '韩国',
				departureTime: '2025-07-18 14:00',
				arrivalTime: '2025-07-17 10:00',
			},
			{
				portNameEn: 'Los Angeles Port',
				countryNameEn: 'USA',
				portNameZh: '洛杉矶港',
				countryNameZh: '美国',
				departureTime: '2025-07-30 16:00',
				arrivalTime: '2025-07-29 12:00',
			},
		],
	},
	{
		shipName: 'MAERSK LINE',
		actualDepartureTime: '2025-09-01 14:20',
		portStops: [
			{
				portNameEn: 'Ningbo Port',
				countryNameEn: 'China',
				portNameZh: '宁波港',
				countryNameZh: '中国',
				departureTime: '2025-09-02 15:00',
				arrivalTime: '2025-09-01 14:20',
			},
			{
				portNameEn: 'Dubai Port',
				countryNameEn: 'UAE',
				portNameZh: '迪拜港',
				countryNameZh: '阿联酋',
				departureTime: '2025-09-10 10:00',
				arrivalTime: '2025-09-09 08:00',
			},
		],
	},
];
// 导出配置和统计信息供调试使用
// export { routeStats, routeConfig };

const skuList = [
	{
		sku: 'RKB-R02B7-US',
		quantity: 439,
	},
	{
		sku: 'RKB-R02W7-US',
		quantity: 300,
	},
	{
		sku: 'SKU-001',
		quantity: 150,
	},
	{
		sku: 'SKU-002',
		quantity: 200,
	},
];
const cabinetList = [
	{
		cabinet: 'UUDU7065177',
		quantity: 439,
		skuList: skuList,
	},
	{
		cabinet: 'CSNU6564939',
		quantity: 150,
		skuList: skuList,
	},
	{
		cabinet: 'GAOU7051530',
		quantity: 200,
		skuList: skuList,
	},
];

// 航线港口停靠信息数据结构
export const shipRouteInfo = {
	shipName: 'MSC LARA III',
	actualDepartureTime: '2025-08-10 10:00',
	// 港口停靠点列表
	portStops: [
		{
			portNameEn: 'Shanghai Port',
			countryNameEn: 'China',
			portNameZh: '上海港',
			countryNameZh: '中国',
			departureTime: '2025-08-11 10:00',
			arrivalTime: '2025-08-10 10:00',
		},
		{
			portNameEn: 'Singapore Port',
			countryNameEn: 'Singapore',
			portNameZh: '新加坡港',
			countryNameZh: '新加坡',
			departureTime: '2025-08-08 12:00',
			arrivalTime: '2025-08-08 08:00',
		},
		{
			portNameEn: 'Rotterdam Port',
			countryNameEn: 'Netherlands',
			portNameZh: '鹿特丹港',
			countryNameZh: '荷兰',
			departureTime: '2025-08-07 14:00',
			arrivalTime: '2025-08-07 11:00',
		},
	],
};

// 第二条航线示例数据
export const shipRouteInfo2 = {
	shipName: 'COSCO SHIPPING',
	actualDepartureTime: '2025-07-15 08:30',
	portStops: [
		{
			portNameEn: 'Qingdao Port',
			countryNameEn: 'China',
			portNameZh: '青岛港',
			countryNameZh: '中国',
			departureTime: '2025-07-16 09:00',
			arrivalTime: '2025-07-15 08:30',
		},
		{
			portNameEn: 'Busan Port',
			countryNameEn: 'South Korea',
			portNameZh: '釜山港',
			countryNameZh: '韩国',
			departureTime: '2025-07-18 14:00',
			arrivalTime: '2025-07-17 10:00',
		},
		{
			portNameEn: 'Los Angeles Port',
			countryNameEn: 'USA',
			portNameZh: '洛杉矶港',
			countryNameZh: '美国',
			departureTime: '2025-07-30 16:00',
			arrivalTime: '2025-07-29 12:00',
		},
	],
};

// 柜号与航线信息的映射关系
// 实际使用时，这些数据应该从后端 API 获取
export const cabinetRouteMap: Record<string, any> = {
	UUDU7065177: shipRouteInfo,
	CSNU6564939: shipRouteInfo2,
	GAOU7051530: shipRouteInfo,
};

export const shipInfoMarkers = {
	startPortName: '起始港口名称',
	endPortName: '目的港口名称',
	actualDepartureTime: '实际开船时间',
	estimatedArrivalTime: '预计抵港时间',
	shipStatus: 1,
	cabinetList: cabinetList,
	skuList: skuList,
};

export const markerList = {};
