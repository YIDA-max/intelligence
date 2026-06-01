/*
 * @Author: YIDA 3136271519@qq.com
 * @Date: 2025-09-05 18:32:34
 * @LastEditors: wuyueqin wuyueqin@merach.com
 * @LastEditTime: 2026-05-12 17:51:02
 * @FilePath: \qianyi-ui\src\api\materialFlow\secondMileLogistics\index.ts
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
import request from '/@/utils/request';

/**
 * 分页查询
 */
export function getSecondMilePage(data?: object) {
	return request({
		url: '/mcp/secondMile/page',
		method: 'post',
		data,
	});
}

/**
 * 确认处理校验
 */
export function confirmSecondMile(params?: object) {
	return request({
		url: '/mcp/secondMile/confirm',
		method: 'post',
		data: params,
	});
}

/**
 * 确认处理
 */
export function processSecondMile(params?: object) {
	return request({
		url: '/mcp/secondMile/process',
		method: 'post',
		data: params,
		loadingConfig: {
			loading: true,
		},
	});
}

/**
 * 确认发货校验
 */
export function confirmProcessShipment(params?: object) {
	return request({
		url: '/mcp/secondMile/confirmShipment',
		method: 'post',
		data: params,
	});
}
/**
 * 确认发货
 */
export function processShipment(params?: object) {
	return request({
		url: '/mcp/secondMile/processShipment',
		method: 'post',
		data: params,
		loadingConfig: {
			loading: true,
		},
	});
}

/**
 * 获取二程调拨详情
 */
export function getSecondMileDetail(params?: string | number) {
	return request({
		url: `/mcp/secondMile/detail/${params}`,
		method: 'get',
		params,
	});
}

/**
 * 入库校验
 */
export function confirmWarehouseStatus(params?: object) {
	return request({
		url: `/mcp/secondMile/confirmWarehouse/${params}`,
		method: 'get',
		params,
	});
}
/**
 * 入库详情
 */
export function getSecondWarehouseDetail(params?: object) {
	return request({
		url: `/mcp/secondMile/warehouseList/${params}`,
		method: 'get',
		params,
	});
}
/**
 * 确认入库
 */
export function processWarehouse(params?: object) {
	return request({
		url: `/mcp/secondMile/processWarehouse`,
		method: 'post',
		data: params,
	});
}
/**
 * 差异确认入库完成（生成其他出入库单）
 */
export function confirmDiffAndGenerateOther(params?: object) {
	return request({
		url: `/mcp/secondMile/confirmDiffAndGenerateOther`,
		method: 'post',
		data: params,
		loadingConfig: {
			loading: true,
		},
	});
}
/**
 * 差异确认入库查询
 */
export function getDiffConfirm(data?: object) {
	return request({
		url: '/mcp/firstMile/getDiffConfirm',
		method: 'post',
		data,
	});
}
/**
 * 差异确认入库查询-二程
 */
export function diffWarehouseList(data?: object) {
	return request({
		url: '/mcp/secondMile/diffWarehouseList',
		method: 'post',
		data,
	});
}
/**
 * 废弃校验
 */
export function checkAbandon(params?: object) {
	return request({
		url: `/mcp/secondMile/checkAbandon`,
		method: 'post',
		data: params,
	});
}
/**
 * 废弃确认
 */
export function abandon(params?: object) {
	return request({
		url: `/mcp/secondMile/abandon`,
		method: 'post',
		data: params,
	});
}

/**
 * 导出头程调拨单列表数据
 */
export function getExportSecondMileList(data?: object) {
	return request({
		url: '/mcp/secondMile/export',
		method: 'post',
		data,
		responseType: 'blob', // 设置响应类型为 blob
	});
}

/**
 * 导出头程调拨单详情数据
 */
export function getExportSecondMileDetail(data?: object) {
	return request({
		url: '/mcp/secondMile/exportDetail',
		method: 'post',
		data,
		responseType: 'blob', // 设置响应类型为 blob
	});
}
/**
 * 入库预报预处理信息
 */
export function predictionPre(data?: Object) {
	return request({
		url: '/mcp/secondMile/intoPredictionPre',
		method: 'post',
		data,
	});
}
/**
 * 批量入库预报
 */
export function predictionBatch(data?: Object) {
	return request({
		url: '/mcp/secondMile/intoPredictionBatch',
		method: 'post',
		data,
	});
}
/**
 * 新增二程调拨费用
 */
export function transferFeeCreate(data?: object) {
	return request({
		url: '/mcp/transfer-fee/second',
		method: 'post',
		data,
		loadingConfig: {
			loading: true,
		},
	});
}
/**
 * 二程调拨导入费用模板下载
 */
export function transferFeeExportSecondTemplate(params?: object) {
	return request({
		url: '/mcp/transfer-fee/export/second',
		method: 'get',
		params,
		responseType: 'blob', // 设置响应类型为 blob
	});
}
/**
 * 调拨费用列表
 */
export function transferFeeList(params?: object) {
	return request({
		// 后台换路由了
		url: '/mcp/second/transfer-fee/share',
		method: 'get',
		params,
	});
}
/**
 * 二程调拨费用分摊 预览
 */
export function postTransferFeeShare(data?: object, transferNo?: string) {
	return request({
		// 后台要求的带查询字符串和json请求头双请求
		url: `/mcp/second/transfer-fee/share/${transferNo}`,
		method: 'post',
		data,
		loadingConfig: {
			loading: true,
		},
	});
}
/**
 * 二程调拨费用录入 保存
 */
export function postTransferFeeSave(data?: object) {
	return request({
		url: `/mcp/second/transfer-fee`,
		method: 'post',
		data,
	});
}
/**
 * 二程调拨费用录入 查询上面的list
 */
export function getTransferFeeList(params?: object) {
	return request({
		url: `/mcp/second/transfer-fee`,
		method: 'get',
		params,
	});
}
/**
 *二程导出费用模板 分摊
 */
export function getExportSecondMileFeeTemplate(data?: object) {
	return request({
		url: '/mcp/second/transfer-fee/export',
		method: 'post',
		data,
		responseType: 'blob', // 设置响应类型为 blob
	});
}

/**
 * 上传二程调拨附件（箱唛/条码标签）
 */
export function uploadSecondMileAttachment(data: FormData) {
	return request({
		url: '/mcp/secondMile/uploadAttachment',
		method: 'post',
		data,
		headers: { 'Content-Type': 'multipart/form-data' },
	});
}
/**
 * 修改二程
 */
export function postSecondMileUpdate(data?: object) {
	return request({
		url: '/mcp/secondMile/update',
		method: 'post',
		data,
	});
}
