/*
 * @Author: YIDA 3136271519@qq.com
 * @Date: 2025-08-08 17:44:33
 * @LastEditors: YIDA zhuhansong@merach.com
 * @LastEditTime: 2026-04-11 12:13:01
 * @FilePath: \qianyi-ui\src\api\purchase\order\index.ts
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
import request from '/@/utils/request';

/**
 * 获取采购订单列表
 */
export function getOrderPage(data?: any) {
	return request({
		url: '/purchase/order/page',
		method: 'post',
		data,
	});
}
/**
 * 获取采购sku信息
 */
export function getskuInfo(params?: any) {
	return request({
		url: '/purchase/order/skuInfo',
		method: 'get',
		params,
	});
}
/**
 * 导出采购单
 */
export function exporOrder(data?: any) {
	return request({
		url: '/purchase/order/export',
		method: 'post',
		data,
		responseType: 'blob',
	});
}

/**
 * 确定下单
 */
export function confirmOrder(params?: object) {
	return request({
		url: '/purchase/order/confirmOrder',
		method: 'post',
		data: params,
		loadingConfig: {
			loading: true,
			text: '保存中...',
			background: 'rgba(255, 255, 255, 0.7)',
		},
	});
}

/**
 * 维护交期
 */
export function updateDeliveryDate(params?: object) {
	return request({
		url: '/purchase/order/updateDeliveryDate',
		method: 'post',
		data: params,
		loadingConfig: {
			loading: true,
			text: '保存中...',
			background: 'rgba(255, 255, 255, 0.7)',
		},
	});
}

/**
 * 删除
 */
export function deleteOrder(params?: object) {
	return request({
		url: '/purchase/order/delete',
		method: 'post',
		data: params,
	});
}

/**
 * 变更采购员
 */
export function updatePurchaseUser(params?: object) {
	return request({
		url: '/purchase/order/updatePurchaseUser',
		method: 'post',
		data: params,
		loadingConfig: {
			loading: true,
			text: '保存中...',
			background: 'rgba(255, 255, 255, 0.7)',
		},
	});
}

/**
 * 新增采购订单
 */
export function postOrderSave(data?: Object) {
	return request({
		url: '/purchase/order/save',
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
 * 编辑采购订单
 */
export function postOrderUpdate(data?: Object) {
	return request({
		url: '/purchase/order/update',
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
 * 采购订单详情
 */
export function orderInfo(params?: any) {
	return request({
		url: '/purchase/order/detailInfo',
		method: 'get',
		params,
	});
}

/**
 * 通过id获取采购确认信息
 */
export function getProConfirmById(params?: any) {
	return request({
		url: '/purchase/order/getProConfirmById',
		method: 'get',
		params,
	});
}

/**
 * 采购确认入库
 */
export function postConfirmInto(data?: Object) {
	return request({
		url: '/purchase/order/saveProConfirm',
		method: 'post',
		data,
	});
}
/**
 * 通过采购单号获取采购记录
 */
export function getPurchaseRecordByCode(params?: any) {
	return request({
		url: '/purchase/order/getPurchaseRecordByCode',
		method: 'get',
		params,
	});
}

/**
 * 编辑交付信息
 */
export function updateDeliveryInfo(data?: Object) {
	return request({
		url: '/purchase/order/updateDeliveryInfo',
		method: 'post',
		data,
	});
}
/**
 * 获取再分配信息
 */
export function getAllocateData(params?: any) {
	return request({
		url: '/purchase/order/getAllocateData',
		method: 'get',
		params,
	});
}

/**
 * 分配采购数量功能
 */
export function allocatePurchaseQuantity(data?: Object) {
	return request({
		url: '/purchase/order/allocatePurchaseQuantity',
		method: 'post',
		data,
	});
}

/**
 * 导出需要采购确认订单
 */
export function exportNeedConfirmOrder(params?: any) {
	return request({
		url: '/purchase/order/exportNeedConfirmOrder',
		method: 'get',
		params,
		responseType: 'blob',
	});
}

/**
 * 导出采购需修改订单
 */
export function exportNeedUpdateOrder(params?: any) {
	return request({
		url: '/purchase/order/exportNeedUpdateOrder',
		method: 'get',
		params,
		responseType: 'blob',
	});
}
