/*
 * @Author: YIDA zhuhansong@merach.com
 * @Date: 2026-01-15 17:43:19
 * @LastEditors: YIDA zhuhansong@merach.com
 * @LastEditTime: 2026-04-11 16:35:13
 * @FilePath: \qianyi-ui\src\api\financial\shopifyDailySales\index.ts
 * @Description:
 *
 * Copyright (c) 2026 by ${git_name_email}, All Rights Reserved.
 */
/*
 * @Description:
 */
/*
 * @Description:
 */
/*
 * @Description:
 */
/*
 * @Description:
 */
import request from '/@/utils/request';

/**
 * 分页查询
 */
export function getShopifyDailySalesPage(data?: any) {
	return request({
		url: '/finance/shopifyDailySalesReport/page',
		method: 'post',
		data,
	});
}
/**
 * 导出excel 表格
 */
export function getExportShopifyDailySales(data?: any) {
	return request({
		url: '/finance/shopifyDailySalesReport/export',
		method: 'post',
		data,
		responseType: 'blob',
	});
}

/**
 * 生成数据
 */
export function postGenerateReport(params?: any) {
	return request({
		url: '/finance/shopifyDailySalesReport/generateReport',
		method: 'post',
		data: params,
	});
}
