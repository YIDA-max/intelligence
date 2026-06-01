/*
 * @Author: YIDA zhuhansong@merach.com
 * @Date: 2025-09-23 10:19:44
 * @LastEditors: YIDA zhuhansong@merach.com
 * @LastEditTime: 2026-04-11 16:37:47
 * @FilePath: \qianyi-ui\src\api\base\store\index.ts
 * @Description:
 *
 * Copyright (c) 2026 by ${git_name_email}, All Rights Reserved.
 */
import request from '/@/utils/request';

export function getBaseStorePage(data?: object) {
	return request({
		url: '/admin/baseStore/page',
		method: 'post',
		data,
	});
}

// 启用
export function openStatus(data?: Object) {
	return request({
		url: '/admin/baseStore/enable',
		method: 'post',
		data,
	});
}
// 禁用
export function closeStatus(data?: Object) {
	return request({
		url: '/admin/baseStore/disable',
		method: 'post',
		data,
	});
}

// 导出
export function exportStoreInfo(data?: object) {
	return request({
		url: '/admin/baseStore/export',
		method: 'post',
		data,
		responseType: 'blob',
	});
}

// 获取店铺详情
export function getDetailInfo(params?: object) {
	return request({
		url: '/admin/baseStore/detail',
		method: 'get',
		params,
	});
}

// add店铺
export function saveStoreInfo(data?: Object) {
	return request({
		url: '/admin/baseStore/save',
		method: 'post',
		data,
		loadingConfig: {
			loading: true,
			text: '保存中...',
			background: 'rgba(255, 255, 255, 0.7)',
		},
	});
}
// 编辑店铺
export function updateStoreInfo(data?: Object) {
	return request({
		url: '/admin/baseStore/update',
		method: 'post',
		data,
		loadingConfig: {
			loading: true,
			text: '保存中...',
			background: 'rgba(255, 255, 255, 0.7)',
		},
	});
}
// 根据平台查询店铺，结果按站点分组
export function getGroupStoreByPlatform(params?: Object) {
	return request({
		url: '/admin/baseStore/getGroupStoreByPlatform',
		method: 'get',
		params,
	});
}
