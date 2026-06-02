import { httpService } from '/@/utils/request';
import { getPlatformOrderKingdeeBillPageMock } from './mock/getPlatformOrderKingdeeBillPageMock';

/**
 * 平台发货订单金蝶单据查询参数
 */
export interface PlatformOrderKingdeeDocQuery {
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
	storeIds?: number[];
	platformOrderNos?: string[];
	orderStatuses?: string[];
	shippingWarehouseIds?: string[];
	shippingWarehouses?: string[];
	kingdeeBillTypes?: string[];
	generateKingdeeDocStatuses?: number[];
	generateKingdeeDocNos?: string[];
	kingdeeDocCreateIds?: string[];
	orderTimeStart?: string;
	orderTimeEnd?: string;
	paymentTimeStart?: string;
	paymentTimeEnd?: string;
	orderUpdateTimeStart?: string;
	orderUpdateTimeEnd?: string;
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
	[key: string]: any;
}

/**
 * 平台发货订单金蝶单据项 VO
 */
export interface PlatformOrderKingdeeDocItemVO {
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
 * 平台发货订单金蝶单据 VO
 */
export interface PlatformOrderKingdeeDocVO {
	createId?: number;
	createName?: string;
	updateId?: number;
	updateName?: string;
	createTime?: string;
	updateTime?: string;
	delFlag?: number;
	id?: number;
	platformChannelCode?: string;
	storeId?: number;
	platformOrderNo?: string;
	orderType?: string;
	orderStatus?: string;
	orderTime?: string;
	paymentTime?: string;
	shippingTime?: string;
	orderUpdateTime?: string;
	shippingWarehouseId?: string;
	shippingWarehouse?: string;
	carrier?: string;
	platformCommission?: number;
	currency?: string;
	orderTotalAmount?: number;
	orderTaxFee?: number;
	transactionFee?: number;
	discountAmount?: number;
	buyerShippingFee?: number;
	buyerActualPayment?: number;
	orderRefundTotalAmount?: number;
	buyerEmail?: string;
	buyerName?: string;
	salesOrgRelationId?: number;
	kingdeeBillType?: string;
	generateKingdeeDocFlag?: number;
	generateKingdeeDocStatus?: number;
	generateKingdeeDocNo?: string;
	generateKingdeeDocTime?: string;
	kingdeeDocCreateId?: number;
	storeName?: string;
	siteCode?: string;
	orderTypeText?: string;
	orderStatusText?: string;
	kingdeeSalesOrgCode?: string;
	kingdeeSalesOrgName?: string;
	kingdeeCustomerCode?: string;
	kingdeeCustomerName?: string;
	kingdeeBillTypeText?: string;
	generateKingdeeDocFlagText?: string;
	generateKingdeeDocStatusText?: string;
	kingdeeDocCreateName?: string;
	items?: PlatformOrderKingdeeDocItemVO[];
	[key: string]: any;
}

/**
 * 列表分页查询
 */
export function getPlatformOrderKingdeeDocPage(
	data?: PlatformOrderKingdeeDocQuery
) {
	return httpService.post('/kingdee/platformOrderKingdeeDoc/page', data, {
		mockConfig: {
			enable: false,
			data: getPlatformOrderKingdeeBillPageMock,
		},
	});
}

/**
 * 导出平台发货订单金蝶单据
 */
export function getPlatformOrderKingdeeDocExport(
	data?: PlatformOrderKingdeeDocQuery
) {
	return httpService.post('/kingdee/platformOrderKingdeeDoc/export', data, {
		responseType: 'blob',
	});
}

/**
 * 生成金蝶单据
 */
export function postGeneratePlatformOrderKingdeeDoc(params?: {
	[key: string]: any;
}) {
	return httpService.post(
		'/kingdee/platformOrderKingdeeDoc/pushKingdeeIntegration',
		params
	);
}
