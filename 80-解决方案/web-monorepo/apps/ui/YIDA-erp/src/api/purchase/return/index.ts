/*
 * @Author: YIDA zhuhansong@merach.com
 * @Date: 2025-08-07 11:21:40
 * @LastEditors: YIDA zhuhansong@merach.com
 * @LastEditTime: 2026-04-11 16:33:46
 * @FilePath: \qianyi-ui\src\api\purchase\return\index.ts
 * @Description:
 *
 * Copyright (c) 2026 by ${git_name_email}, All Rights Reserved.
 */
import request from '/@/utils/request';

/**
 * 获取退货单列表
 */
export function getReturnPage(data?: any) {
	return request({
		url: '/purchase/return/page',
		method: 'post',
		data,
	});
}
/**
 * 采购主体列表
 */
export function entitySelectList(params?: any) {
	return request({
		url: '/purchase/entity/selectList',
		method: 'get',
		params,
	});
}
/**
 * 导出退货单列表
 */
export function exportReturnPage(data?: any) {
	return request({
		url: '/purchase/return/export',
		method: 'post',
		data,
		responseType: 'blob',
	});
}

/**
 * 同意退货单
 */
export function processReturn(params?: object) {
	return request({
		url: '/purchase/return/handle',
		method: 'post',
		data: params,
	});
}

/**
 * 废弃退货单
 */
export function invalidReturn(params?: object) {
	return request({
		url: '/purchase/return/invalid',
		method: 'post',
		data: params,
	});
}

/**
 * 退货申请选择sku
 */
export function chooseSkuByReturn(params?: object) {
	return request({
		url: '/purchase/return/chooseSkuByReturn',
		method: 'get',
		params,
	});
}

/**
 * 新增退货单
 */
export function saveReturn(params?: object) {
	return request({
		url: '/purchase/return/save',
		method: 'post',
		data: params,
	});
}

/**
 * 通过id获取退货信息
 */
export function returnInfoSkuById(params?: object) {
	return request({
		url: '/purchase/order/returnInfoSkuById',
		method: 'get',
		params,
	});
}
