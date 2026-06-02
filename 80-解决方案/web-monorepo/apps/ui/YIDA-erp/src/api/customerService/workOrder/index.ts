/*
 * @Author: YIDA zhuhansong@merach.com
 * @Date: 2026-02-06 09:48:44
 * @LastEditors: YIDA zhuhansong@merach.com
 * @LastEditTime: 2026-04-11 16:45:09
 * @FilePath: \qianyi-ui\src\api\customerService\workOrder\index.ts
 * @Description:
 *
 * Copyright (c) 2026 by ${git_name_email}, All Rights Reserved.
 */
import request from '/@/utils/request';
import { httpService } from '/@/utils/request';
/**
 * 获取客服订单列表
 */
export function getCustomerServiceOrderPage(data?: any) {
	return httpService.post('/customer-service/order/page', data);
}
/**
 * 导出订单
 */
export function exporOrder(data?: any) {
	return request({
		url: '/customer-service/order/export',
		method: 'post',
		data,
		responseType: 'blob',
	});
}

/**
 * 获取平台订单号
 */
export function getPlatformOrderNo(params?: Object) {
	return request({
		url: '/fbm/orderBasic/getAllOrder/byPlatformOrderNo',
		method: 'get',
		params,
	});
}

/**
 * 新增订单
 */
export function postOrderSave(data?: Object) {
	return request({
		url: '/customer-service/order',
		method: 'post',
		data,
		loadingConfig: {
			loading: true,
			text: '保存中...',
			background: 'rgba(255, 255, 255, 0.7)',
		},
	});
}

/**
 * 编辑订单
 */
export function postOrderUpdate(data?: Object) {
	return request({
		url: '/customer-service/order',
		method: 'put',
		data,
		loadingConfig: {
			loading: true,
			text: '保存中...',
			background: 'rgba(255, 255, 255, 0.7)',
		},
	});
}

/**
 * 修改订单状态
 */
export function statusOrderUpdate(data?: Object) {
	return request({
		url: '/customer-service/order/status',
		method: 'put',
		data,
		loadingConfig: {
			loading: true,
			text: '保存中...',
			background: 'rgba(255, 255, 255, 0.7)',
		},
	});
}

/**
 * 订单详情
 */
export function orderInfo(params?: any) {
	return request({
		url: `/customer-service/order/${params.orderNo}`,
		method: 'get',
	});
}

/**
 * 判断是否有已有关联订单
 */
export function orderList(params?: any) {
	return request({
		url: `/customer-service/order/check`,
		method: 'get',
		params,
	});
}
