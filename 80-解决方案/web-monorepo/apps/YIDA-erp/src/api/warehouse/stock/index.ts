/*
 * @Author: 朱寒松 3136271519@qq.com
 * @Date: 2025-07-28 17:25:58
 * @LastEditors: YIDA zhuhansong@merach.com
 * @LastEditTime: 2026-04-11 12:09:31
 * @FilePath: \qianyi-ui\src\api\warehouse\stock\index.ts
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
import request from '/@/utils/request';

// 分页查询
export function getStockPage(data?: object) {
	return request({
		url: '/stock/stock/page',
		method: 'post',
		data,
	});
}

// 导出
export function getExportStockData(data?: object) {
	return request({
		url: '/stock/stock/export',
		method: 'post',
		data,
		responseType: 'blob', // 设置响应类型为 blob
	});
}

/**
 * 查询库存的详情信息
 * @description:
 */
export function postStockList(data?: Object) {
	return request({
		url: '/stock/stock/list',
		method: 'post',
		data,
	});
}

/**
 * 查询库存的详情信息
 * @description:
 */
export function getStockAndCarton(params?: object) {
	return request({
		url: '/stock/stock/getStockAndCarton',
		method: 'get',
		params,
	});
}
/**
 * 获取亚马逊平台仓库存（通过店铺+渠道+sku+msku获取）
 * @description:
 */
export function getAmazonStorage(params?: object) {
	return request({
		url: '/stock/platformWarehouseStorageAmazon/getAmazonStorage',
		method: 'get',
		params,
	});
}

/**
 * 查询库存的详情信息
 * @description:
 */
export function saveTransferInventoryReview(params?: object) {
	return request({
		url: '/stock/transferInventoryReview/save',
		method: 'post',
		data: params,
	});
}

/**
 * 新增转库存申请
 * @description:
 */
export function transferInventoryReview(params?: object) {
	return request({
		url: '/stock/transferInventoryReview/save',
		method: 'post',
		data: params,
	});
}

/**
 * 查询库存的详情信息 根据模块类型编码查询在途库存明
 * @description:
 */
export function getListStockOnewayDetailByPrefix(params?: object) {
	return request({
		url: '/stock/stock/listStockOnewayDetailByPrefix',
		method: 'get',
		params,
	});
}

/**
 * 批量新增转库存申请
 * @description:
 */
export function postBatchSave(params?: object) {
	return request({
		url: '/stock/transferInventoryReview/batchSave',
		method: 'post',
		data: params,
	});
}

/**
 *
 * @param params 查询库存
 * @returns
 */
export function getByCondition(params?: object) {
	return request({
		url: '/stock/stock/getByCondition',
		method: 'get',
		params,
	});
}

/**
 * 根据库存转换申请编号发货单信息查询详情
 * @description:
 *
 */
export function getListDeliveryPlan(params?: object) {
	return request({
		url: '/stock/transferInventoryReview/listDeliveryPlan',
		method: 'get',
		params,
	});
}
