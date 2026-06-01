/*
 * @Author: YIDA 3136271519@qq.com
 * @Date: 2025-08-19 10:08:15
 * @LastEditors: YIDA zhuhansong@merach.com
 * @LastEditTime: 2026-04-22 18:18:47
 * @FilePath: \qianyi-ui\src\api\materialFlow\lclRecommend\index.ts
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
import request from '/@/utils/request';

/**
 * 分页查询拼柜推荐
 */
export function getLclRecommendPage(data?: object) {
	return request({
		url: '/mcp/lclRecommend/page',
		method: 'post',
		data,
	});
}
/**
 * 订柜号下拉框
 */
export function getSelectBookingNos(params?: object) {
	return request({
		url: '/mcp/lclRecommend/selectBookingNos',
		method: 'get',
		params,
	});
}
/**
 * 加入货柜信息预览
 */
export function postAddContainerView(data?: Object) {
	return request({
		url: '/mcp/lclRecommend/addContainerView',
		method: 'post',
		data,
	});
}
/**
 * 加入货柜
 */
export function postAddContainer(data?: Object) {
	return request({
		url: '/mcp/lclRecommend/addContainer',
		method: 'post',
		data,
	});
}
/**
 * 移出货柜
 */
export function postRemoveContainer(data?: Object) {
	return request({
		url: '/mcp/lclRecommend/removeContainer',
		method: 'post',
		data,
	});
}

/**
 * 重新推荐
 */
export function postRecommend(data?: Object) {
	return request({
		url: '/mcp/lclRecommend/recommend',
		method: 'post',
		data,
		loadingConfig: {
			loading: true,
		},
	});
}
/**
 * 拼柜推荐导出
 */
export function getExportCollectionPlan(data?: object) {
	return request({
		url: '/mcp/lclRecommend/exportCollectionPlan',
		method: 'post',
		data,
		responseType: 'blob',
	});
}
