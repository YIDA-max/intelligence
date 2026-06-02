import { httpService } from '/@/utils/request';
import { getGeneratedKingdeeBillPageMock } from '/@/api/integrations/billDataSync/selfOrderSync/mock/getGeneratedKingdeeBillPageMock';

/**
 * 自发货订单金蝶单据查询参数
 */
export interface SelfOrderKingdeeDocQuery {
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
	pickOrderNos?: string[];
	platformChannelCodes?: string[];
	storeIds?: number[];
	shippingWarehouseIds?: string[];
	shippingWarehouses?: string[];
	kingdeeBillTypes?: string[];
	generateKingdeeDocStatuses?: number[];
	generateKingdeeDocNos?: string[];
	kingdeeDocCreateIds?: string[];
	orderTimeStart?: string;
	orderTimeEnd?: string;
	orderMarketTimeStart?: string;
	orderMarketTimeEnd?: string;
	orderCreateTimeStart?: string;
	orderCreateTimeEnd?: string;
	shippingTimeStart?: string;
	shippingTimeEnd?: string;
	deliveryMarketTimeStart?: string;
	deliveryMarketTimeEnd?: string;
	generateKingdeeDocTimeStart?: string;
	generateKingdeeDocTimeEnd?: string;
	ids?: string[];
	skuCodes?: string[];
	skuNames?: string[];
	mskuCodes?: string[];
	salesOrgRelationIds?: number[];
	kingdeeSalesOrgCodes?: string[];
	kingdeeSalesOrgNames?: string[];
	kingdeeCustomerCodes?: string[];
	kingdeeCustomerNames?: string[];
	inventoryOrgRelationIds?: number[];
	kingdeeInventoryOrgCodes?: string[];
	kingdeeInventoryOrgNames?: string[];
	kingdeeWarehouseCodes?: string[];
	kingdeeWarehouseNames?: string[];
	[key: string]: any;
}

/**
 * 自发货订单金蝶单据项 VO
 */
export interface SelfOrderKingdeeDocItemVO {
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
	fnsku?: string;
	asin?: string;
	quantity?: number;
	productPrice?: number;
	productPriceExcludingTax?: number;
	productTaxRate?: number;
	productTax?: number;
	productPriceIncludingTax?: number;
	productAmount?: number;
	productAmountExcludingTax?: number;
	productAmountIncludingTax?: number;
	currency?: string;
	kingdeeMaterialCode?: string;
	kingdeeMaterialName?: string;
	kingdeeMaterialId?: string;
	[key: string]: any;
}

/**
 * 自发货订单金蝶单据 VO
 */
export interface SelfOrderKingdeeDocVO {
	createId?: number;
	createName?: string;
	updateId?: number;
	updateName?: string;
	createTime?: string;
	updateTime?: string;
	delFlag?: number;
	id?: number;
	platformOrderNo?: string;
	pickOrderNo?: string;
	platformChannelCode?: string;
	country?: string;
	storeId?: number;
	orderDeliveryMethod?: string;
	orderTime?: string;
	orderCreateTime?: string;
	shippingTime?: string;
	shippingWarehouseId?: string;
	shippingWarehouse?: string;
	currency?: string;
	orderTotalAmount?: number;
	productPriceExcludingTax?: number;
	buyerShippingFee?: number;
	buyerName?: string;
	buyerEmail?: string;
	buyerId?: string;
	buyerMessage?: string;
	salesOrgRelationId?: number;
	inventoryOrgRelationId?: number;
	kingdeeBillType?: string;
	generateKingdeeDocFlag?: number;
	generateKingdeeDocStatus?: number;
	generateKingdeeDocNo?: string;
	generateKingdeeDocTime?: string;
	kingdeeDocCreateId?: number;
	storeName?: string;
	siteCode?: string;
	kingdeeSalesOrgCode?: string;
	kingdeeSalesOrgName?: string;
	kingdeeCustomerCode?: string;
	kingdeeCustomerName?: string;
	kingdeeInventoryOrgCode?: string;
	kingdeeInventoryOrgName?: string;
	kingdeeWarehouseCode?: string;
	kingdeeWarehouseName?: string;
	kingdeeBillTypeText?: string;
	generateKingdeeDocStatusText?: string;
	kingdeeDocCreateName?: string;
	items?: SelfOrderKingdeeDocItemVO[];
	[key: string]: any;
}

/**
 * 列表分页查询
 */
export function getSelfOrderKingdeeDocPage(data?: SelfOrderKingdeeDocQuery) {
	return httpService.post('/kingdee/selfOrderKingdeeDoc/page', data, {
		mockConfig: {
			enable: false,
			data: getGeneratedKingdeeBillPageMock,
		},
	});
}

/**
 * 导出自发货订单金蝶单据
 */
export function getSelfOrderKingdeeDocExport(data?: SelfOrderKingdeeDocQuery) {
	return httpService.post('/kingdee/selfOrderKingdeeDoc/export', data, {
		responseType: 'blob',
	});
}

/**
 * 生成金蝶单据
 */
export function generateKingdeeBill(params?: { [key: string]: any }) {
	return httpService.post(
		'/kingdee/selfOrderKingdeeDoc/pushKingdeeIntegration',
		params
	);
}
