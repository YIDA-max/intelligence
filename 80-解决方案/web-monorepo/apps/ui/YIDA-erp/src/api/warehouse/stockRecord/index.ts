/*
 * @Author: YIDA 3136271519@qq.com
 * @Date: 2025-09-11 14:49:21
 * @LastEditors: YIDA zhuhansong@merach.com
 * @LastEditTime: 2026-04-11 12:10:26
 * @FilePath: \qianyi-ui\src\api\warehouse\stockRecord\index.ts
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
import request from '/@/utils/request';

/**
 * 分页查询
 * */
export function getStockRecordPage(data?: object) {
	return request({
		url: '/stock/stockRecord/getStockRecordPage',
		method: 'post',
		data,
	});
}
/**
 * 操作类型下拉框
 * */
export function getStockRecordStatusList(params?: object) {
	return request({
		url: '/stock/stockRecord/page',
		method: 'get',
		params,
	});
}
/**
 * 导出excel 表格
 * */
export function getStockRecordExport(data?: object) {
	return request({
		url: '/stock/stockRecord/export',
		method: 'post',
		data,
		responseType: 'blob',
	});
}
