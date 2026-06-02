/*
 * @Author: YIDA zhuhansong@merach.com
 * @Date: 2026-02-06 09:48:44
 * @LastEditors: YIDA zhuhansong@merach.com
 * @LastEditTime: 2026-04-11 16:44:56
 * @FilePath: \qianyi-ui\src\api\customerService\orderSetting\index.ts
 * @Description:
 *
 * Copyright (c) 2026 by ${git_name_email}, All Rights Reserved.
 */
import request from '/@/utils/request';
import { httpService } from '/@/utils/request';
/**
 * 获取标签列表
 */
export function getCustomerServiceTagPage(data?: any) {
	return httpService.post('/customer-service/tag/page', data);
}

/**
 * 查询所有标签树（不分页，用于下拉选择）
 */
export function getAllTag(params?: Object) {
	return request({
		url: '/customer-service/tag/tree',
		method: 'get',
		params,
	});
}

/**
 * 导出订单
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
 * 新增标签
 */
export function postTagSave(data?: Object) {
	return request({
		url: '/customer-service/tag',
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
 * 编辑标签
 */
export function postOrderUpdate(data?: Object) {
	return request({
		url: '/customer-service/tag',
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
 * 标签详情
 */
export function tagDetail(params?: any) {
	return request({
		url: `/customer-service/tag/${params.id}`,
		method: 'get',
	});
}

/**
 * 修改标签状态
 */
export function tagStatusUpdate(params?: any) {
	return request({
		url: `/customer-service/tag/status`,
		method: 'put',
		data: params,
	});
}

/**
 * 删除
 */
export function deleteTag(params?: any) {
	return request({
		url: `/customer-service/tag/${params}`,
		method: 'delete',
	});
}
