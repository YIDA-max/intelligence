/*
 * @Author: YIDA zhuhansong@merach.com
 * @Date: 2026-03-30 09:54:12
 * @LastEditors: YIDA zhuhansong@merach.com
 * @LastEditTime: 2026-04-13 14:45:29
 * @FilePath: \qianyi-ui\src\api\integrations\receivingIntegration\overseasWarehouseGoodsReceipt\index.ts
 * @Description:
 *
 * Copyright (c) 2026 by ${git_name_email}, All Rights Reserved.
 */
import { httpService } from '/@/utils/request';

export interface goodsReceiptPageQuery {
	countId?: string;
	createIds?: number[];
	createTimeEnd?: string;
	createTimeStart?: string;
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
export function getwarhouseGoodsPage(data: goodsReceiptPageQuery) {
	return httpService.post('/kingdee/transferIntegrationReceipt/page', data);
}

/**
 * 导出平台发货订单金蝶单据
 */
export function getwarhouseGoodsExport(data?: goodsReceiptPageQuery) {
	return httpService.post('/kingdee/transferIntegrationReceipt/export', data, {
		responseType: 'blob',
	});
}

/**
 * 生成金蝶单据
 */
export function postGenerateWarhouseGoods(params?: { [key: string]: any }) {
	return httpService.post(
		'/kingdee/transferIntegrationReceipt/pushKingdeeIntegration',
		params
	);
}

export function postUpdateIntegratedData(params?: { [key: string]: any }) {
	return httpService.post(
		'/kingdee/transferIntegrationReceipt/pushKingdeeIntegration',
		params
	);
}
