/*
 * @Author: YIDA 3136271519@qq.com
 * @Date: 2025-09-19 11:23:15
 * @LastEditors: YIDA zhuhansong@merach.com
 * @LastEditTime: 2026-04-11 15:49:09
 * @FilePath: \qianyi-ui\src\api\warehouse\otherStock\outStock\index.ts
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
export function getOtherOutboundPage(data?: object) {
	return request({
		url: '/stock/otherOutbound/page',
		method: 'post',
		data,
	});
}
/**
 * 新增其他出库单
 * @param params
 * @returns
 */
export function postOtherOutboundAdd(data?: object) {
	return request({
		url: '/stock/otherOutbound/add',
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
 * 编辑其他出库单
 * @param params
 * @returns
 */
export function postOtherOutboundUpdate(data?: object) {
	return request({
		url: '/stock/otherOutbound/update',
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
 * 查询其他出库单详情
 * @param id
 * @returns
 */
export function getOtherOutboundById(params?: object) {
	return request({
		url: `/stock/otherOutbound/getOtherOutboundById`,
		method: 'get',
		params,
	});
}
/**
 * 通过出库单号查询其他出库信息
 * @param id
 * @returns
 */
export function getOtherOutboundDetails(params?: object) {
	return request({
		url: `/stock/otherOutbound/details`,
		method: 'get',
		params,
	});
}
/**
 * 待物流审核
 * @param params
 * @returns
 */
export function postOtherOutboundLogisticsAudit(data?: object) {
	return request({
		url: '/stock/otherOutbound/logistics/audit',
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
export function postOtherOutboundFinancialAudit(data?: object) {
	return request({
		url: '/stock/otherOutbound/financial/audit',
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
export function postOtherOutboundDiscard(data?: object) {
	return request({
		url: '/stock/otherOutbound/discard',
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
export function getOtherOutboundExport(data?: object) {
	return request({
		url: `/stock/otherOutbound/export`,
		method: 'post',
		data,
		responseType: 'blob',
	});
}
/**
 * 用于出库选择SKU
 * @param
 * @returns
 */
export function getOtherOutboundChooseSku(params?: object) {
	return request({
		url: `/stock/otherOutbound/chooseSkuByOutBound`,
		method: 'get',
		params,
	});
}
