/*
 * @Author: YIDA 3136271519@qq.com
 * @Date: 2025-09-05 18:32:34
 * @LastEditors: wuyueqin wuyueqin@merach.com
 * @LastEditTime: 2026-05-12 17:51:25
 * @FilePath: \qianyi-ui\src\api\materialFlow\firstMileLogistics\index.ts
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
import request from '/@/utils/request';
/**
 * 分页查询
 */
export function getFirstMilePage(data?: object) {
	return request({
		url: '/mcp/firstMile/page',
		method: 'post',
		data,
	});
}

/**
 * 导出头程调拨单详情数据
 */
export function getExportFirstMileDetail(data?: object) {
	return request({
		url: '/mcp/firstMile/exportFirstMileDetail',
		method: 'post',
		data,
		responseType: 'blob', // 设置响应类型为 blob
	});
}
/**
 * 导出头程调拨单列表数据
 */
export function getExportFirstMileList(data?: object) {
	return request({
		url: '/mcp/firstMile/exportFirstMileList',
		method: 'post',
		data,
		responseType: 'blob', // 设置响应类型为 blob
	});
}
/**
 * 查询头程调拨详情
 */
export function getFirstMileDetail(params?: object) {
	return request({
		url: '/mcp/firstMile/getDetailById',
		method: 'get',
		params,
	});
}
/**
 * 确认入库
 */
export function postConfirmInto(data?: Object) {
	return request({
		url: '/mcp/firstMile/confirmInto',
		method: 'post',
		data,
	});
}

/**
 * 差异确认入库查询
 */
export function postGetDiffConfirm(data?: Object) {
	return request({
		url: '/mcp/firstMile/getDiffConfirm',
		method: 'post',
		data,
	});
}

/**
 * 确认差异入库
 */
export function postDiffConfirm(data?: Object) {
	return request({
		url: '/mcp/firstMile/diffConfirm',
		method: 'post',
		data,
	});
}

/**
 * 差异确认提交（确认入库并生成二程调拨）
 */
export function postConfirmIntoAndInsertSecondMile(data?: Object) {
	return request({
		url: '/mcp/firstMile/confirmIntoAndInsertSecondMile',
		method: 'post',
		data,
		loadingConfig: {
			loading: true,
		},
	});
}
/**
 * 添加中转仓
 */
export function postAddTransshipmentWarehouse(data?: Object) {
	return request({
		url: '/mcp/firstMile/addTransshipmentWarehouse',
		method: 'post',
		data,
		loadingConfig: {
			loading: true,
		},
	});
}
/**
 * 变更中转仓
 */
export function postChangeTransshipmentWarehouse(data?: Object) {
	return request({
		url: '/mcp/firstMile/changeTransshipmentWarehouse',
		method: 'post',
		data,
		loadingConfig: {
			loading: true,
		},
	});
}
/**
 * 变更目的仓
 */
export function postChangeDestWarehouse(data?: Object) {
	return request({
		url: '/mcp/firstMile/changeDestWarehouse',
		method: 'post',
		data,
		loadingConfig: {
			loading: true,
		},
	});
}
/**
 * 新增二程调拨
 */
export function postInsertSecondMile(data?: Object) {
	return request({
		url: '/mcp/secondMile/insertSecondMile',
		method: 'post',
		data,
		loadingConfig: {
			loading: true,
		},
	});
}

/**
 * 根据条件查询货代数据
 */
export function getFreightForwarderListByCondition(params?: object) {
	return request({
		url: '/mcp/freightForwarder/getListByCondition',
		method: 'get',
		params,
	});
}

/**
 * 入库预报预处理信息
 */
export function predictionPre(data?: Object) {
	return request({
		url: '/mcp/firstMile/intoPredictionPre',
		method: 'post',
		data,
	});
}

/**
 * 批量入库预报
 */
export function predictionBatch(data?: Object) {
	return request({
		url: '/mcp/firstMile/intoPredictionBatch',
		method: 'post',
		data,
		loadingConfig: {
			loading: true,
		},
	});
}

/**
 * 获取头程调拨发货明细列表（转库存申请用）
 * @param params - 查询参数，包含 firstMileId 等
 */
export function getDetailById(params?: object) {
	return request({
		url: '/firstMile/getDetailById',
		method: 'get',
		params,
	});
}

/**
 * 获取费用配置（新增头程调拨费用）
 */
export function feeConfig(params?: object) {
	return request({
		url: '/mcp/transfer-fee/config',
		method: 'get',
		params,
	});
}

/**
 * 调拨费用列表
 */
export function transferFeeList(params?: object) {
	return request({
		// 后台换路由了
		url: '/mcp/first/transfer-fee/share',
		method: 'get',
		params,
	});
}
/**
 * 头程调拨费用分摊 预览
 */
export function postTransferFeeShare(data?: object, transferNo?: string) {
	return request({
		// 后台要求的带查询字符串和json请求头双请求
		url: `/mcp/first/transfer-fee/share/${transferNo}`,
		method: 'post',
		data,
		loadingConfig: {
			loading: true,
		},
	});
}
/**
 * 头程调拨费用录入 保存
 */
export function postTransferFeeSave(data?: object) {
	return request({
		url: `/mcp/first/transfer-fee`,
		method: 'post',
		data,
	});
}
/**
 * 头程调拨费用录入 查询上面的list
 */
export function getTransferFeeList(params?: object) {
	return request({
		url: `/mcp/first/transfer-fee`,
		method: 'get',
		params,
	});
}
/**
 * 新增头程调拨费用
 */
export function transferFeeCreate(data?: object) {
	return request({
		url: '/mcp/transfer-fee/first',
		method: 'post',
		data,
		loadingConfig: {
			loading: true,
		},
	});
}
/**
 * 预览费用分摊结果
 */
export function transferFeePreviewAllocation(data?: object) {
	return request({
		url: '/mcp/transfer-fee/preview-allocation',
		method: 'post',
		data,
		loadingConfig: { loading: true },
	});
}

/**
 * 查询已确认分摊结果（供详情页分摊页签使用）
 */
export function transferFeeAllocationResult(params?: object) {
	return request({
		url: '/mcp/transfer-fee/allocation-result',
		method: 'get',
		params,
	});
}

/**
 *头程导出费用模板
 */
export function transferFeeExportFirstTemplate(params?: object) {
	return request({
		url: '/mcp/transfer-fee/export/first',
		method: 'get',
		params,
		responseType: 'blob', // 设置响应类型为 blob
	});
}
/**
 *头程导出费用模板 分摊
 */
export function getExportFirstMileFeeTemplate(data?: object) {
	return request({
		url: '/mcp/first/transfer-fee/export',
		method: 'post',
		data,
		responseType: 'blob', // 设置响应类型为 blob
	});
}
