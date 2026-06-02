/*
 * @Description: 船舶轨迹相关接口
 */
import request from '/@/utils/request';

// ==================== 类型定义 ====================

/**
 * 港口停靠信息
 */
export interface IPortStop {
	/** 港口英文名 */
	portNameEn: string;
	/** 国家英文名 */
	countryNameEn: string;
	/** 港口中文名 */
	portNameZh: string;
	/** 国家中文名 */
	countryNameZh: string;
	/** 离港时间 */
	departureTime: string;
	/** 到港时间 */
	arrivalTime: string;
}

/**
 * 航线信息
 */
export interface IRouteInfo {
	/** 船名 */
	vessel: string;
	/** 实际出发时间 */
	actualDepartureTime: string;
	/** 港口停靠列表 */
	portStops: IPortStop[];
}

/**
 * 船舶列表项
 */
export interface IShipListItem {
	/** 船号/柜号值 */
	value: string;
	/** 显示标签 */
	label: string;
	/** 出发时间 */
	departureTime: string;
	/** 航线信息 */
	routeInfo: IRouteInfo;
}

/**
 * SKU 信息
 */
export interface ISkuInfo {
	/** SKU 编码 */
	sku: string;
	/** 数量 */
	quantity: number;
}

/**
 * 货柜信息
 */
export interface ICabinetInfo {
	/** 柜号 */
	cabinet: string;
	/** 数量 */
	quantity: number;
	/** SKU 列表 */
	skuList: ISkuInfo[];
}

/**
 * 船舶详细信息
 */
export interface IShipDetailInfo {
	/** 船号/柜号 */
	shipNo: string;
	/** 船名 */
	shipName: string;
	/** 实际出发时间 */
	actualDepartureTime: string;
	/** 港口停靠列表 */
	portStops: IPortStop[];
	/** 货柜列表 */
	cabinetList: ICabinetInfo[];
}

/**
 * 船列表查询参数
 */
export interface IGetShipListParams {
	/** 关键词搜索（船号/船名） */
	keyword?: string;
	/** 页码 */
	pageNum?: number;
	/** 每页数量 */
	pageSize?: number;
}

/**
 * 货柜列表查询参数
 */
export interface IGetCabinetListParams {
	/** 船号 */
	shipNo?: string;
	/** 关键词搜索（柜号） */
	keyword?: string;
	/** 页码 */
	pageNum?: number;
	/** 每页数量 */
	pageSize?: number;
}

/**
 * 船舶详细信息查询参数
 */
export interface IGetShipDetailParams {
	/** 船号/柜号 */
	shipNo: string;
}

/**
 * 获取箱号信息查询参数
 */
export interface IGetContainerInfoParams {
	/** 箱号 */
	containerNo: string;
	/** 开始时间（可选） */
	startTime?: string;
	/** 结束时间（可选） */
	endTime?: string;
}

/**
 * 获取船名信息查询参数
 */
export interface IGetVesselInfoParams {
	/** 船名 */
	vessel: string;
	/** 开始时间（可选） */
	startTime?: string;
	/** 结束时间（可选） */
	endTime?: string;
}

/**
 * SKU 信息（箱号/船名信息中的SKU）
 */
export interface ISkuInfoVO {
	/** SKU 编码 */
	skuCode: string;
	/** 数量 */
	quantity: number;
}

/**
 * 历史港口信息
 */
export interface IHistoryPort {
	/** ID */
	id: number;
	/** 船名 */
	vessel: string;
	/** 港口代码 */
	portCode: string;
	/** 港口英文名 */
	portNameEn: string;
	/** 港口中文名 */
	portNameCn: string;
	/** 国家英文名 */
	countryEn: string;
	/** 国家中文名 */
	countryCn: string;
	/** 到港时间 */
	ata: string;
	/** 离港时间 */
	atd: string;
}

/**
 * 箱号信息
 */
export interface IContainerInfo {
	/** 船名 */
	vessel: string;
	/** 箱号 */
	containerNo: string;
	/** 实际出发时间 */
	actualDepartureTime: string;
	/** 预计到达时间 */
	estimatedArrivalTime: string;
	/** 起始港口 */
	originPort: string;
	/** 起始港口中文名 */
	originPortCn: string;
	/** 目的港口中文名 */
	destPortCn: string;
	/** 目的港口 */
	destPort: string;
	/** SKU 信息列表 */
	skuInfos: ISkuInfoVO[];
	/** 历史港口列表 */
	historyPort: IHistoryPort[];
}

/**
 * 船名信息中的箱号信息
 */
export interface IContainerNoInfo {
	/** 柜号 */
	containerNo: string;
	/** SKU 信息列表 */
	skuInfos: ISkuInfoVO[];
}

/**
 * 船名信息
 */
export interface IVesselInfo {
	/** 船名 */
	vessel: string;
	/** 实际出发时间 */
	actualDepartureTime: string;
	/** 预计到达时间 */
	estimatedArrivalTime: string;
	/** 起始港口 */
	originPort: string;
	/** 起始港口中文名 */
	originPortCn: string;
	/** 目的港口中文名 */
	destPortCn: string;
	/** 目的港口 */
	destPort: string;
	/** 箱号列表（包含SKU信息） */
	containerNos: IContainerNoInfo[];
	/** 历史港口列表 */
	historyPort: IHistoryPort[];
}

// ==================== 接口函数 ====================

/**
 * 获取轨迹信息
 */
export function getTrajectory(data?: object) {
	return request({
		url: 'tracking/ais/trajectory',
		method: 'post',
		data,
	});
}

/**
 * 获取所有船名（未结束）
 * @see https://api.apifox.cn/temp-links/api/396447992?t=9fdca166-fad1-4a41-9546-b893990a6a17
 */
export function getAllVessels() {
	return request<string[]>({
		url: 'tracking/ais/vessels',
		method: 'get',
	});
}

/**
 * 获取所有柜号（未结束）
 * @see https://api.apifox.cn/temp-links/api/396447993?t=7291ff88-6756-4d75-922f-7b5c52540dd7
 */
export function getAllContainerNos() {
	return request<string[]>({
		url: 'tracking/ais/containerNos',
		method: 'get',
	});
}

/**
 * 获取箱号信息
 * @param params 查询参数
 * @see https://api.apifox.cn/temp-links/api/396444866?t=af4b4188-592f-415c-8b33-a2cf2e7aa7a2
 */
export function getContainerInfo(params: IGetContainerInfoParams) {
	return request<IContainerInfo>({
		url: 'tracking/ais/containerNo',
		method: 'get',
		params,
	});
}

/**
 * 获取船名信息
 * @param params 查询参数
 * @see https://api.apifox.cn/temp-links/api/396444867?t=0e9a01c8-2815-4947-9a6b-b7cf18ff58a4
 */
export function getVesselInfo(params: IGetVesselInfoParams) {
	return request<IVesselInfo>({
		url: 'tracking/ais/vessel',
		method: 'get',
		params,
	});
}
