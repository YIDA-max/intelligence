/*
 * @Author: YIDA zhuhansong@merach.com
 * @Date: 2025-09-03 09:57:16
 * @LastEditors: YIDA zhuhansong@merach.com
 * @LastEditTime: 2026-04-11 12:14:47
 * @FilePath: \qianyi-ui\src\api\affairs\customsInfo\index.ts
 * @Description:
 *
 * Copyright (c) 2026 by ${git_name_email}, All Rights Reserved.
 */
import request from '/@/utils/request';

// 关务信息列表
export function getCustomsInfoList(data?: object) {
	return request({
		url: '/affairs/customsInfo/page',
		method: 'post',
		data,
	});
}

// 关务信息列表
export function getCustomsDetail(params?: object) {
	return request({
		url: '/affairs/customsInfo/getCustomsDetailsById',
		method: 'get',
		params,
	});
}

// 导出关务信息
export function exportCustomsInfo(data?: object) {
	return request({
		url: '/affairs/customsInfo/export',
		method: 'post',
		data,
		responseType: 'blob',
	});
}

// 导出关务信息
export function updateCustomsInfo(params?: object) {
	return request({
		url: '/affairs/customsInfo/update',
		method: 'post',
		data: params,
	});
}
