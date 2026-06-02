/*
 * @Author: YIDA zhuhansong@merach.com
 * @Date: 2025-12-04 20:28:19
 * @LastEditors: YIDA zhuhansong@merach.com
 * @LastEditTime: 2026-04-11 16:35:36
 * @FilePath: \qianyi-ui\src\api\financial\dailySalesOrder\index.ts
 * @Description:
 *
 * Copyright (c) 2026 by ${git_name_email}, All Rights Reserved.
 */
import request from '/@/utils/request';

/**
 * 分页查询
 */
export function getTiktokOrderCalculationSummaryPage(data?: any) {
	return request({
		url: '/order/tiktokOrderCalculationSummary/page',
		method: 'post',
		data,
	});
}

/**
 * 导出计算汇总数据
 */
export function getExportTiktokOrderCalculationSummary(data?: any) {
	return request({
		url: '/order/tiktokOrderCalculationSummary/export',
		method: 'post',
		data,
		responseType: 'blob',
	});
}

/**
 * 生成计算汇总数据
 */
export function getGenerateSummary(params?: any) {
	return request({
		url: '/order/tiktokOrderCalculationSummary/generate',
		method: 'get',
		params,
	});
}
