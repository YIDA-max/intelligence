/*
 * @Author: YIDA 3136271519@qq.com
 * @Date: 2025-09-19 11:23:15
 * @LastEditors: YIDA zhuhansong@merach.com
 * @LastEditTime: 2026-04-11 15:53:28
 * @FilePath: \qianyi-ui\src\api\warehouse\otherStock\enterStock\index.ts
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
import request from '/@/utils/request';

/**
 * 分页查询
 * @param params
 * @returns
 */
export function getOtherInboundPage(data?: object) {
	return request({
		url: '/stock/otherInbound/page',
		method: 'post',
		data,
	});
}
/**
 * 新增其他入库单
 * @param params
 * @returns
 */
export function postOtherInboundAdd(data?: object) {
	return request({
		url: '/stock/otherInbound/add',
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
 * 编辑其他入库单
 * @param params
 * @returns
 */
export function postOtherInboundUpdate(data?: object) {
	return request({
		url: '/stock/otherInbound/update',
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
 * 查询其他入库单详情
 * @param id
 * @returns
 */
export function getOtherInboundById(params?: object) {
	return request({
		url: `/stock/otherInbound/getOtherInboundById`,
		method: 'get',
		params,
	});
}
/**
 * 通过入库单号查询其他入库信息
 * @param id
 * @returns
 */
export function getOtherInboundDetails(params?: object) {
	return request({
		url: `/stock/otherInbound/details`,
		method: 'get',
		params,
	});
}
/**
 * 待物流审核
 * @param params
 * @returns
 */
export function postOtherInboundLogisticsAudit(data?: object) {
	return request({
		url: '/stock/otherInbound/logistics/audit',
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
 * 待财务审核
 * @param params
 * @returns
 */
export function postOtherInboundFinancialAudit(data?: object) {
	return request({
		url: '/stock/otherInbound/financial/audit',
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
 * 废弃
 * @param params
 * @returns
 */
export function postOtherInboundDiscard(data?: object) {
	return request({
		url: '/stock/otherInbound/discard',
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
 * 导出excel 表格
 * @param
 * @returns
 */
export function getOtherInboundExport(data?: object) {
	return request({
		url: `/stock/otherInbound/export`,
		method: 'post',
		data,
		responseType: 'blob',
	});
}
/**
 * 选择sku,提供给其他出入库
 * @param
 * @returns
 */
export function getChooseSkuByOtherbound(params?: object) {
	return request({
		url: `/product/sku/chooseSkuByOtherbound`,
		method: 'get',
		params,
	});
}
