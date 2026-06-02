import { httpService } from '/@/utils/request';

/**
 * 仓间调拨发货 - 分页查询参数
 */
export interface WarehouseTransferShipPageQuery {
	/** 集成单据编号 */
	billNo?: string;
	/** 调拨单号 */
	transferNo?: string;
	/** 金蝶单据编号 */
	generateKingdeeDocNo?: string;
	/** 状态：0、未生成，1、已生成，2、生成失败 */
	status?: number;
	/** 实际收货日期-开始 */
	actualReceiptDateStart?: string;
	/** 实际收货日期-结束 */
	actualReceiptDateEnd?: string;
	/** 调出仓编码 */
	takeOutWarehouse?: string;
	/** 调入仓编码 */
	takeInWarehouse?: string;
	/** 金蝶调出仓库编码 */
	kingdeeOutWarehouseCode?: string;
	/** 金蝶调入仓库编码 */
	kingdeeInWarehouseCode?: string;
	/** 交易类型 1:组织内 2:组织间 */
	transactionType?: number;
	/** sku代码 */
	skuCode?: string;
	/** 勾选的id列表 导出时使用 */
	ids?: number[];
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
 * 仓间调拨发货 - 列表数据项
 */
export interface WarehouseTransferShipVO {
	/** 主键ID */
	id?: number;
	/** 主表ID */
	mainId?: number;
	/** 集成单据编号 */
	billNo?: string;
	/** 调拨单号 */
	transferNo?: string;
	/** 金蝶单据名称 */
	generateKingdeeDocName?: string;
	/** 金蝶单据编号 */
	generateKingdeeDocNo?: string;
	/** 状态：0、未生成，1、已生成，2、生成失败 */
	status?: number;
	/** 状态名称 */
	statusName?: string;
	/** 实际收货日期 */
	actualReceiptDate?: string;
	/** 调出仓编码 */
	takeOutWarehouse?: string;
	/** 调入仓编码 */
	takeInWarehouse?: string;
	/** 金蝶调出仓库编码 */
	kingdeeOutWarehouseCode?: string;
	/** 金蝶调入仓库编码 */
	kingdeeInWarehouseCode?: string;
	/** 金蝶调出库存组织编码 */
	kingdeeOutInventoryOrgCode?: string;
	/** 金蝶调入库存组织编码 */
	kingdeeInInventoryOrgCode?: string;
	/** 交易类型 1:组织内 2:组织间 */
	transactionType?: number;
	/** 交易类型名称 */
	transactionTypeName?: string;
	/** 调拨单创建时间 */
	transferOrderCreateTime?: string;
	/** 生成金蝶单据时间 */
	generateKingdeeDocTime?: string;
	/** 金蝶单据创建人 */
	kingdeeDocCreateId?: number;
	/** 金蝶单据创建人名称 */
	kingdeeDocCreateName?: string;
	/** 推送失败原因 */
	pushErrorReason?: string;
	/** sku代码 */
	skuCode?: string;
	/** 收货数量 */
	receiptQuantity?: number;
	/** 收货箱数 */
	receiptCartonQuantity?: number;
}

/**
 * 仓间调拨发货 - 分页响应
 */
export interface WarehouseTransferShipPageResponse {
	code?: number;
	msg?: string;
	data?: {
		records?: WarehouseTransferShipVO[];
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
 * 仓间调拨发货 - 导出数据项
 */
export interface WarehouseTransferShipExcelVO {
	/** 集成单据编号 */
	billNo?: string;
	/** 调拨单号 */
	transferNo?: string;
	/** 金蝶单据名称 */
	generateKingdeeDocName?: string;
	/** 金蝶单据编号 */
	generateKingdeeDocNo?: string;
	/** 状态名称 */
	statusName?: string;
	/** 实际收货日期 */
	actualReceiptDate?: string;
	/** 调出仓编码 */
	takeOutWarehouse?: string;
	/** 调入仓编码 */
	takeInWarehouse?: string;
	/** 金蝶调出仓库编码 */
	kingdeeOutWarehouseCode?: string;
	/** 金蝶调入仓库编码 */
	kingdeeInWarehouseCode?: string;
	/** 金蝶调出库存组织编码 */
	kingdeeOutInventoryOrgCode?: string;
	/** 金蝶调入库存组织编码 */
	kingdeeInInventoryOrgCode?: string;
	/** 交易类型名称 */
	transactionTypeName?: string;
	/** 调拨单创建时间 */
	transferOrderCreateTime?: string;
	/** 生成金蝶单据时间 */
	generateKingdeeDocTime?: string;
	/** 金蝶单据创建人名称 */
	kingdeeDocCreateName?: string;
	/** 推送失败原因 */
	pushErrorReason?: string;
	/** sku代码 */
	skuCode?: string;
	/** 收货数量 */
	receiptQuantity?: number;
	/** 收货箱数 */
	receiptCartonQuantity?: number;
}

/**
 * 仓间调拨发货 - 分页查询
 */
export function getWarehouseTransferShipPage(
	data: WarehouseTransferShipPageQuery
) {
	return httpService.post<WarehouseTransferShipPageResponse>(
		'/kingdee/transferSecondShipKingdee/page',
		data
	);
}

/**
 * 仓间调拨发货 - 导出
 */
export function postExportWarehouseTransferShip(
	data?: WarehouseTransferShipPageQuery
) {
	return httpService.post('/kingdee/transferSecondShipKingdee/export', data, {
		responseType: 'blob',
	});
}

/**
 * 仓间调拨发货 - 生成金蝶单据请求参数
 */
export interface GenerateKingdeeDocParams {
	/** 勾选的id列表 */
	ids?: number[];
	[key: string]: any;
}

/**
 * 仓间调拨发货 - 生成金蝶单据响应
 */
export interface GenerateKingdeeDocResponse {
	code?: number;
	msg?: string;
	data?: any;
}

/**
 * 仓间调拨发货 - 生成金蝶单据
 */
export function getGenerateWarehouseTransferShipKingdeeDoc(
	params?: GenerateKingdeeDocParams
) {
	return httpService.post<GenerateKingdeeDocResponse>(
		'/kingdee/transferSecondShipKingdee/pushKingdee',
		params
	);
}

/**
 * 仓间调拨发货 - 更新集成数据
 */
export function getUpdateWarehouseTransferShipIntegratedData(
	params?: GenerateKingdeeDocParams
) {
	return httpService.post<GenerateKingdeeDocResponse>(
		'/kingdee/transferSecondShipKingdee/update',
		params
	);
}
