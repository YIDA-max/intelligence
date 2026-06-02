/*
 * @Author: YIDA 3136271519@qq.com
 * @Date: 2025-09-11 14:49:21
 * @LastEditors: YIDA zhuhansong@merach.com
 * @LastEditTime: 2026-04-11 15:38:36
 * @FilePath: \qianyi-ui\src\api\warehouse\transferInventoryReview\index.ts
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
import request from '/@/utils/request';

/**
 * 分页查询
 * */
export function getTransferInventoryReviewPage(data?: object) {
	return request({
		url: '/stock/transferInventoryReview/page',
		method: 'post',
		data,
	});
}

/**
 * 导出转库存审核
 * */
export function getTransferInventoryReviewExport(data?: object) {
	return request({
		url: '/stock/transferInventoryReview/export',
		method: 'post',
		data,
		responseType: 'blob',
	});
}
/**
 * 新部门主管审核
 * */
export function postNewDeptSupervisorReview(data?: any) {
	return request({
		url: '/stock/transferInventoryReview/newDeptSupervisorReview',
		method: 'post',
		data,
	});
}
/**
 * 原部门主管审核
 * */
export function postOriginalDeptSupervisorReview(data?: any) {
	return request({
		url: '/stock/transferInventoryReview/originalDeptSupervisorReview',
		method: 'post',
		data,
	});
}
/**
 * 物流审核
 * */
export function postLogisticsReview(data?: any) {
	return request({
		url: '/stock/transferInventoryReview/logisticsReview',
		method: 'post',
		data,
	});
}
/**
 * 物控审核
 * */
export function postMaterialReview(data?: any) {
	return request({
		url: '/stock/transferInventoryReview/materialReview',
		method: 'post',
		data,
	});
}
/**
 * 物流总监审核
 * */
export function postLogisticsDirectorReview(data?: any) {
	return request({
		url: '/stock/transferInventoryReview/logisticsDirectorReview',
		method: 'post',
		data,
	});
}

export function logisticsDirectorReview(data?: any) {
	return request({
		url: '/purchase/demand/logisticsDirectorReview',
		method: 'post',
		data,
	});
}
