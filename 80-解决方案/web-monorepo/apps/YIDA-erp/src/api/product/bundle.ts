/*
 * @Author: 朱寒松 3136271519@qq.com
 * @Date: 2025-07-15 10:50:03
 * @LastEditors: YIDA zhuhansong@merach.com
 * @LastEditTime: 2026-04-11 15:37:36
 * @FilePath: \qianyi-ui\src\api\product\bundle.ts
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
import request from '/@/utils/request';

// 分页查询
export function getBundleList(data?: object) {
	return request({
		url: '/product/bundle/page',
		method: 'post',
		data,
	});
}
// 通过id启用捆绑产品
export function enableBundle(data: Object) {
	return request({
		url: `/product/bundle/enable`,
		method: 'post',
		data,
	});
}

// 通过id禁用捆绑产品
export function disableBundle(data: Object) {
	return request({
		url: `/product/bundle/disable`,
		method: 'post',
		data,
	});
}

// 通过id获取捆绑详情
export function getBundleDetailsById(params?: object) {
	return request({
		url: `/product/bundle/getBundleDetailsById`,
		method: 'get',
		params,
	});
}

// 选择SKU
export function getSkuChooseSkuByBundle(params?: object) {
	return request({
		url: `/product/sku/chooseSkuByBundle`,
		method: 'get',
		params,
	});
}

// 新增捆绑产品
export function postBundleSave(data: Object) {
	return request({
		url: `/product/bundle/save`,
		method: 'post',
		data,
		loadingConfig: {
			loading: true,
			text: '保存中...',
			background: 'rgba(255, 255, 255, 0.7)',
		},
	});
}

// 修改捆绑产品
export function postBundleUpdate(data: Object) {
	return request({
		url: `/product/bundle/update`,
		method: 'post',
		data,
		loadingConfig: {
			loading: true,
			text: '保存中...',
			background: 'rgba(255, 255, 255, 0.7)',
		},
	});
}

// 导出捆绑产品
export function getBundleExport(data?: object) {
	return request({
		url: `/product/bundle/export`,
		method: 'post',
		data,
		responseType: 'blob', // 设置响应类型为 blob
	});
}
