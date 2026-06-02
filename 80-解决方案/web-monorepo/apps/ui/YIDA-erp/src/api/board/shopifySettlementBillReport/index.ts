/*
 * @Author: YIDA 3136271519@qq.com
 * @Date: 2026-01-20 10:20:57
 * @LastEditors: YIDA zhuhansong@merach.com
 * @LastEditTime: 2026-04-11 12:16:31
 * @FilePath: \qianyi-ui\src\api\board\shopifySettlementBillReport\index.ts
 * @Description:
 *
 * Copyright (c) 2026 by ${git_name_email}, All Rights Reserved.
 */
import { httpService } from '/@/utils/request';
/**
 * 分页查询Shopify订单销售额报表
 * @param data
 * @returns
 */
export function getShopifyOrderSaleReportPage(data: any) {
	return httpService.post('/finance/shopifyOrderSaleReport/page', data);
}

/**
 * 导出Shopify订单销售额报表
 */
export function getExportShopifyOrderSaleReport(data?: any) {
	return httpService.post('/finance/shopifyOrderSaleReport/export', data, {
		responseType: 'blob',
	});
}
