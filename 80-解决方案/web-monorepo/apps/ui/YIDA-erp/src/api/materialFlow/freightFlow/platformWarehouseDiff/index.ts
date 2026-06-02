import { httpService } from '/@/utils/request';

/**
 * 平台货件单收发差异表 - 分页查询参数
 */
export interface KingdeeShipmentDiffPageQuery {
	/** 平台 */
	platforms?: string[];
	/** 目的仓code列表 */
	destinationWarehouseCodes?: string[];
	/** 匹配状态(0未匹配/1已匹配) */
	matchStatus?: number;
	/** 差异处理状态(0未处理/1部分处理/2处理完成) */
	handledDiffStatus?: number;
	/** 收货日期-开始 */
	receiveDateStart?: string;
	/** 收货日期-结束 */
	receiveDateEnd?: string;
	/** 货件号列表(单个模糊查询,多个精确查询) */
	shipmentIds?: string[];
	/** 调拨单号列表(单个模糊查询,多个精确查询) */
	transferOrderNos?: string[];
	/** 发货单号列表(单个模糊查询,多个精确查询) */
	deliveryNos?: string[];
	/** SKU列表(单个模糊查询,多个精确查询) */
	skuCodes?: string[];
	/** MSKU列表(单个模糊查询,多个精确查询) */
	mskuCodes?: string[];
	/** 分页参数 */
	total?: number;
	size?: number;
	current?: number;
	'orders[0].column'?: string;
	'orders[0].asc'?: boolean;
	optimizeCountSql?: boolean;
	searchCount?: boolean;
	optimizeJoinOfCountSql?: boolean;
	maxLimit?: number;
	countId?: string;
	[key: string]: any;
}

/**
 * 平台货件单收发差异表 - 列表数据项
 */
export interface KingdeeShipmentDiffVO {
	/** ID */
	id?: number;
	/** 平台 */
	platform?: string;
	/** 店铺站点 */
	storeSiteName?: string;
	/** 货件单号 */
	shipmentId?: string;
	/** 货件单状态 */
	shipmentStatus?: string;
	/** 目的仓代码 */
	destinationWarehouseCode?: string;
	/** 目的仓名称 */
	destinationWarehouseName?: string;
	/** 调拨单号 */
	transferOrderNo?: string;
	/** 发货单号 */
	deliveryNo?: string;
	/** 匹配状态(0未匹配/1已匹配) */
	matchStatus?: number;
	/** 差异处理状态code */
	handledDiffStatusCode?: number;
	/** 差异处理状态描述 */
	handledDiffStatusValue?: string;
	/** 平台MSKU */
	mskuCode?: string;
	/** 仟易SKU编码 */
	skuCode?: string;
	/** 产品名称 */
	productName?: string;
	/** 发货数量 */
	shipQuantity?: number;
	/** 收货数量(累加汇总) */
	receiveQuantity?: number;
	/** 最后一次收货日期 */
	lastReceiveDate?: string;
	/** 差异数量(收货数量-发货数量) */
	diffQuantity?: number;
	/** 已处理差异数量 */
	handledDiffQuantity?: number;
	/** 创建时间 */
	createTime?: string;
	[key: string]: any;
}

/**
 * 平台货件单收发差异处理请求
 */
export interface KingdeeShipmentDiffHandleParams extends KingdeeShipmentDiffVO {
	/** 索赔数量 */
	claimQuantity?: number;
	/** 认丢数量 */
	lossQuantity?: number;
	/** 多收数量 */
	extraReceiveQuantity?: number;
}

/**
 * 平台货件单收发差异表 - 分页响应
 */
export interface KingdeeShipmentDiffPageResponse {
	code?: number;
	msg?: string;
	data?: {
		records?: KingdeeShipmentDiffVO[];
		total?: number;
		size?: number;
		current?: number;
		orders?: Array<{ column?: string; asc?: boolean }>;
		optimizeCountSql?: boolean;
		searchCount?: boolean;
		optimizeJoinOfCountSql?: boolean;
		maxLimit?: number;
		countId?: string;
	};
}

/**
 * 平台货件单收发差异表 - 导出数据项
 */
export interface KingdeeShipmentDiffExcelVO {
	/** 平台 */
	platform?: string;
	/** 店铺站点 */
	storeSiteName?: string;
	/** 店铺名称 */
	storeName?: string;
	/** 站点代码 */
	siteCode?: string;
	/** 货件单号 */
	shipmentId?: string;
	/** 货件单状态 */
	shipmentStatus?: string;
	/** 目的仓名称 */
	destinationWarehouseName?: string;
	/** 调拨单号 */
	transferOrderNo?: string;
	/** 发货单号 */
	deliveryNo?: string;
	/** 匹配状态描述 */
	matchStatusValue?: string;
	/** 差异处理状态描述 */
	handledDiffStatusValue?: string;
	/** 平台MSKU */
	mskuCode?: string;
	/** 仟易SKU编码 */
	skuCode?: string;
	/** 产品名称 */
	productName?: string;
	/** 发货数量 */
	shipQuantity?: number;
	/** 收货数量 */
	receiveQuantity?: number;
	/** 最后一次收货日期 */
	lastReceiveDate?: string;
	/** 差异数量 */
	diffQuantity?: number;
	/** 已处理差异数量 */
	handledDiffQuantity?: number;
	/** 创建时间 */
	createTime?: string;
}

/**
 * 平台货件单收发差异表 - 分页查询
 */
export function getKingdeeShipmentDiffPage(
	data?: KingdeeShipmentDiffPageQuery
) {
	return httpService.post<{ records: KingdeeShipmentDiffVO[]; total: number }>(
		'/kingdee/kingdeeShipmentDiff/page',
		data
	);
}

/**
 * 平台货件单收发差异表 - 导出
 */
export function postKingdeeShipmentDiffExport(
	data?: KingdeeShipmentDiffPageQuery
) {
	return httpService.post('/kingdee/kingdeeShipmentDiff/export', data, {
		responseType: 'blob',
	});
}

/**
 * 获取收货详情列表
 */
export function getPlatformWarehouseReceiveDetail(params?: any) {
	return httpService.get('/kingdee/kingdeeShipmentItem/listByDiffId', {
		params,
	});
}

/**
 * 处理收发差异
 */
export function postKingdeeShipmentDiffHandle(
	data?: KingdeeShipmentDiffHandleParams
) {
	return httpService.post('/kingdee/kingdeeShipmentDiff/handle', data);
}
