/*
 * @Author: YIDA zhuhansong@merach.com
 * @Date: 2026-01-20 20:51:19
 * @LastEditors: YIDA zhuhansong@merach.com
 * @LastEditTime: 2026-04-11 16:32:42
 * @FilePath: \qianyi-ui\src\api\materialFlow\deliveryTimeAlertSettings\index.ts
 * @Description:
 *
 * Copyright (c) 2026 by ${git_name_email}, All Rights Reserved.
 */
import request, { httpService } from '/@/utils/request';

// 货件失效列表
export function getDeliveryTimeList(data?: object) {
	return request({
		url: '/mcp/shipmentDelayAlert/page',
		method: 'post',
		data,
	});
}

// 导出接口
export function exportDeliveryTimeList(data?: object) {
	return request({
		url: '/mcp/shipmentDelayAlert/export',
		method: 'post',
		data,
		responseType: 'blob', // 设置响应类型为 blob
	});
}

export function freightForwarDerdetails(params?: object) {
	return httpService.get('/mcp/shipmentDelayAlert/getDetailInfo', {
		params,
	});
}

// 国家下拉列表
export function sysCountryList(params?: string) {
	return request({
		url: `/admin/sysCountry/list`,
		method: 'get',
		params,
	});
}
//港口
export function getListByCondition(params?: object) {
	return request({
		url: '/admin/basePort/getListByCondition',
		method: 'get',
		params,
	});
}

//编辑货件时效预警
export function updateShipmentDelayAlert(data?: object) {
	return request({
		url: '/mcp/shipmentDelayAlert/update',
		method: 'post',
		data,
	});
}
//新增货件时效预警
export function addShipmentDelayAlert(data?: object) {
	return request({
		url: '/mcp/shipmentDelayAlert/add',
		method: 'post',
		data,
	});
}
