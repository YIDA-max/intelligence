import { httpService } from '/@/utils/request';

/**
 * 库存调整查询参数
 */
export interface InventoryAdjustmentQuery {
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
	warehouseIds?: string[];
	warehouseNames?: string[];
	kingdeeBillTypes?: string[];
	generateKingdeeDocStatuses?: number[];
	generateKingdeeDocNos?: string[];
	kingdeeDocCreateIds?: string[];
	adjustmentTimeStart?: string;
	adjustmentTimeEnd?: string;
	generateKingdeeDocTimeStart?: string;
	generateKingdeeDocTimeEnd?: string;
	ids?: string[];
	skuCodes?: string[];
	skuNames?: string[];
	mskuCodes?: string[];
	inventoryOrgRelationIds?: number[];
	kingdeeInventoryOrgCodes?: string[];
	kingdeeInventoryOrgNames?: string[];
	kingdeeWarehouseCodes?: string[];
	kingdeeWarehouseNames?: string[];
	[key: string]: any;
}

/**
 * 库存调整明细项 VO
 */
export interface InventoryAdjustmentItemVO {
	createId?: number;
	createName?: string;
	updateId?: number;
	updateName?: string;
	createTime?: string;
	updateTime?: string;
	delFlag?: number;
	id?: number;
	mainId?: number;
	skuId?: string;
	skuCode?: string;
	skuName?: string;
	mskuCode?: string;
	adjustmentQuantity?: number;
	adjustmentType?: string;
	adjustmentTypeText?: string;
	kingdeeMaterialCode?: string;
	kingdeeMaterialName?: string;
	kingdeeMaterialId?: string;
	[key: string]: any;
}

/**
 * 库存调整 VO
 */
export interface InventoryAdjustmentVO {
	createId?: number;
	createName?: string;
	updateId?: number;
	updateName?: string;
	createTime?: string;
	updateTime?: string;
	delFlag?: number;
	id?: number;
	adjustmentNo?: string;
	warehouseId?: string;
	warehouseName?: string;
	adjustmentTime?: string;
	adjustmentReason?: string;
	inventoryOrgRelationId?: number;
	kingdeeBillType?: string;
	generateKingdeeDocFlag?: number;
	generateKingdeeDocStatus?: number;
	generateKingdeeDocNo?: string;
	generateKingdeeDocTime?: string;
	kingdeeDocCreateId?: number;
	kingdeeInventoryOrgCode?: string;
	kingdeeInventoryOrgName?: string;
	kingdeeWarehouseCode?: string;
	kingdeeWarehouseName?: string;
	kingdeeBillTypeText?: string;
	generateKingdeeDocStatusText?: string;
	generateKingdeeDocFlagText?: string;
	kingdeeDocCreateName?: string;
	items?: InventoryAdjustmentItemVO[];
	[key: string]: any;
}

/**
 * 列表分页查询
 */
export function getInventoryAdjustmentPage(params?: InventoryAdjustmentQuery) {
	return httpService.get('/kingdee/inventoryAdjustment/page', {
		params,
	});
}

/**
 * 导出库存调整
 */
export function getInventoryAdjustmentExport(
	params?: InventoryAdjustmentQuery
) {
	return httpService.get('/kingdee/inventoryAdjustment/export', {
		params,
		responseType: 'blob',
	});
}

/**
 * 生成金蝶单据
 */
export function generateInventoryAdjustmentBill(params?: {
	[key: string]: any;
}) {
	return httpService.post('/kingdee/inventoryAdjustment/generate', params);
}
