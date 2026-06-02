/*
 * @Author: YIDA zhuhansong@merach.com
 * @Date: 2025-08-05 13:50:35
 * @LastEditors: YIDA zhuhansong@merach.com
 * @LastEditTime: 2026-04-11 15:53:52
 * @FilePath: \qianyi-ui\src\api\materialFlow\providerCode\index.ts
 * @Description:
 *
 * Copyright (c) 2026 by ${git_name_email}, All Rights Reserved.
 */
import request from '/@/utils/request';

// 物流服务商分页
export function logisticsCourierPage(data?: object) {
	return request({
		url: '/tracking/logisticsCourier/page',
		method: 'post',
		data,
	});
}

// 平台服务商查询
export function platformCourierList(params?: object) {
	return request({
		url: '/tracking/logisticsCourier/platformCourier',
		method: 'get',
		params,
	});
}

// 新增渠道
export function addLogisticsCourier(params?: object) {
	return request({
		url: '/tracking/logisticsCourier',
		method: 'post',
		data: params,
	});
}
// 编辑渠道
export function editLogisticsCourier(params?: object) {
	return request({
		url: '/tracking/logisticsCourier',
		method: 'put',
		data: params,
	});
}
// 渠道详情
export function courierDetail(params?: string | number) {
	return request({
		url: `/tracking/logisticsCourier/detail/${params}`,
		method: 'get',
	});
}
// 同步
export function courierSync(params?: string | number) {
	return request({
		url: `/tracking/logisticsCourier/sync/${params}`,
		method: 'get',
	});
}
// 导出
export function exportCourier(data?: object) {
	return request({
		url: '/tracking/logisticsCourier/export',
		method: 'post',
		data,
		responseType: 'blob', // 设置响应类型为 blob
	});
}
