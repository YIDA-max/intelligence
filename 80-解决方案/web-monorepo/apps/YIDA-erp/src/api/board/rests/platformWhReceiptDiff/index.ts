import { httpService } from '/@/utils/request';

/**
 * 平台仓收货差异表查询参数
 */
export interface PlatformWhReceiptDiffQuery {
	'records[0].key'?: string;
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
	platformChannelCodes?: string[];
	associationStatus?: string[];
	shipmentIds?: string[];
	transferOrderNos?: string[];
	skuCodes?: string[];
	shipmentCreateDateStart?: string;
	shipmentCreateDateEnd?: string;
	[key: string]: any;
}

/**
 * 平台仓收货差异明细项 VO
 */
export interface PlatformWhReceiptDiffItemVO {
	createId?: number;
	createName?: string;
	updateId?: number;
	updateName?: string;
	createTime?: string;
	updateTime?: string;
	delFlag?: number;
	id?: number;
	mainId?: number;
	msku?: string;
	sku?: string;
	productName?: string;
	receivedQuantity?: number;
	shippedQuantity?: number;
	differenceQuantity?: number;
	[key: string]: any;
}

/**
 * 平台仓收货差异 VO
 */
export interface PlatformWhReceiptDiffVO {
	createId?: number;
	createName?: string;
	updateId?: number;
	updateName?: string;
	createTime?: string;
	updateTime?: string;
	delFlag?: number;
	id?: number;
	shipmentId?: string;
	platform?: string;
	warehouseCode?: string;
	shipmentStatus?: string;
	transferOrderNo?: string;
	associationStatus?: string;
	items?: PlatformWhReceiptDiffItemVO[];
	[key: string]: any;
}

/**
 * 列表分页查询
 */
export function getPlatformWhReceiptDiffPage(
	params?: PlatformWhReceiptDiffQuery
) {
	return httpService.get('/board/platformWhReceiptDiff/page', {
		params,
	});
}

/**
 * 导出平台仓收货差异表
 */
export function getPlatformWhReceiptDiffExport(
	params?: PlatformWhReceiptDiffQuery
) {
	return httpService.get('/board/platformWhReceiptDiff/export', {
		params,
		responseType: 'blob',
	});
}

/**
 * 更新货件单数据
 */
export function updateShipmentData(params?: { [key: string]: any }) {
	return httpService.post(
		'/board/platformWhReceiptDiff/updateShipment',
		params
	);
}
