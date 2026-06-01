/*
 * @Author: YIDA zhuhansong@merach.com
 * @Date: 2026-03-30 09:54:12
 * @LastEditors: YIDA zhuhansong@merach.com
 * @LastEditTime: 2026-04-13 14:25:53
 * @FilePath: \qianyi-ui\src\api\integrations\shippingIntegration\stockinGoods\index.ts
 * @Description:
 *
 * Copyright (c) 2026 by ${git_name_email}, All Rights Reserved.
 */
import { httpService } from '/@/utils/request';
import { getStockinGoodsPageMock } from './mock/index';

export interface StockinGoodsPageQuery {
	countId?: string;
	createIds?: number[];
	createTimeEnd?: string;
	createTimeStart?: string;
	actualDeliveryDateEnd?: string;
	actualDeliveryDateStart?: string;
	generateKingdeeDocTimeEnd?: string;
	generateKingdeeDocTimeStart?: string;
	current?: number;
	generateKingdeeDocNos?: string[];
	ids?: number[];
	kingdeeInInventoryOrgCodes?: string[];
	kingdeeOutInventoryOrgCodes?: string[];
	maxLimit?: number;
	optimizeCountSql?: boolean;
	optimizeJoinOfCountSql?: boolean;
	searchCount?: boolean;
	size?: number;
	skuCodes?: string[];
	statuses?: number[];
	takeInWarehouses?: string[];
	takeOutWarehouses?: string[];
	total?: number;
	transferNos?: string[];
	[property: string]: any;
}
export function getStockinGoodsPage(data: StockinGoodsPageQuery) {
	return httpService.post('/kingdee/transferShipKingdee/page', data, {
		mockConfig: {
			enable: false,
			data: getStockinGoodsPageMock,
		},
	});
}

/**
 * 导出平台发货订单金蝶单据
 */
export function getStockinGoodsExport(data?: StockinGoodsPageQuery) {
	return httpService.post('/kingdee/transferShipKingdee/export', data, {
		responseType: 'blob',
	});
}

/**
 * 生成金蝶单据
 */
export function postGenerateStockinGoods(params?: { [key: string]: any }) {
	return httpService.post('/kingdee/transferShipKingdee/pushKingdee', params);
}

export function postUpdateIntegratedData(params?: { [key: string]: any }) {
	return httpService.post('/kingdee/platformOrderKingdeeDoc/generate', params);
}
