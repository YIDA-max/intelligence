/*
 * @Author: 朱寒松 3136271519@qq.com
 * @Date: 2025-07-30 11:14:09
 * @LastEditors: YIDA zhuhansong@merach.com
 * @LastEditTime: 2026-04-11 16:43:22
 * @FilePath: \qianyi-ui\src\api\mcp\collectionPlan\index.ts
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
import request from '/@/utils/request';
import { CollectionPlanVo } from '/@/interface/views/mcp/collectionPlan/index';
import type { IPageListResponse } from '/@/components/BaseTable/hooks/BaseTable';
export * from '/@/interface/views/mcp/collectionPlan/index';
/**
 * 获取需求分页列表
 * @param params 查询参数
 * @returns
 */
export function getCollectionPlanPage(
	data?: object
): Promise<IPageListResponse> {
	return request({
		url: '/mcp/collectionPlan/queryCollectionPlan',
		method: 'post',
		data,
	}) as Promise<IPageListResponse>;
}

/**
 * 根据id获取提货计划详情
 * @param params
 * @returns
 */
export function getCollectionPlanDetail(params: object) {
	return request({
		url: '/mcp/collectionPlan/queryCollectionPlanDetailById',
		method: 'get',
		params,
	});
}
/**
 * 根据条件查询工厂
 * @param params
 * @returns
 */
export function getFactoryList(params: object) {
	return request({
		url: '/purchase/supplierInfo/address/getListByCondition',
		method: 'get',
		params,
	});
}

/**
 * 获取需求sku详情
 * @param id 需求ID
 * @returns
 */
export function getCollectionPlanQuerySku(params?: object) {
	return request({
		url: `/mcp/collectionPlan/querySku`,
		method: 'get',
		params,
	});
}

/**
 * 新增需求
 * @param data 需求数据
 * @returns
 */
export function postCollectionPlanSave(data: Object) {
	return request({
		url: '/mcp/collectionPlan/insertCollectionPlan',
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
 * 修改需求
 * @param data 需求数据
 * @returns
 */
export function postCollectionPlanUpdate(data: Object) {
	return request({
		url: '/mcp/collectionPlan/updateCollectionPlan',
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
 * 删除需求
 * @param data 需求ID数组
 * @returns
 * 	*/
export function postCollectionPlanDelete(data: Object) {
	return request({
		url: '/mcp/collectionPlan/deleteCollectionPlan',
		method: 'post',
		data,
	});
}
/**
 * 运营确认发货
 * @param data 需求数据
 * @returns
 * 	*/
export function postCollectionPlanAffirmDeliverGoods(data: Object) {
	return request({
		url: '/mcp/collectionPlan/affirmDeliverGoods',
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
 * 获取工厂的信息
 * @returns
 */

export function getVoList(params?: object) {
	return request({
		url: '/mcp/collectionPlanFactory/getVoList',
		method: 'get',
		params,
	});
}

/**
 * 工厂确认交期
 * @returns
 */
export function postCollectionPlanAffirmDeliveryTime(data: Object) {
	return request({
		url: '/mcp/collectionPlan/affirmDeliveryTime',
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
 * 工厂更新交期
 * @returns
 */
export function postCollectionPlanUpdateDeliveryTime(data: Object) {
	return request({
		url: '/mcp/collectionPlan/updateDeliveryTime',
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
 * 导出提货计划
 * @param params 查询参数
 */
export function getExportCollectionPlan(data?: object) {
	return request({
		url: '/mcp/collectionPlan/exportCollectionPlan',
		method: 'post',
		data,
		responseType: 'blob', // 设置响应类型为blob
	});
}

/**
 * 根据条件获取店铺列表
 * @param params 查询参数
 */

export function getListByCondition(params?: object) {
	return request({
		url: '/admin/baseStore/getListByCondition',
		method: 'get',
		params,
	});
}

/**
 * 查询平台仓库列表
 * @returns
 */
export function getPlatformList(params?: object) {
	return request({
		url: '/warehouse/warehouseInfo/platformList',
		method: 'get',
		params,
	});
}

/**
 * 根据渠道查询货件配置
 * @param params 查询参数
 */
export function getConfigByPtChannelCode(params?: object) {
	return request({
		url: '/mcp/deliveryPlanChannelShipmentConfig/getConfigByPtChannelCode',
		method: 'get',
		params,
	});
}

/**
 * 维护货件信息
 * @param params 查询参数
 * @returns
 */
export function postPreservePackageInfo(data?: Object) {
	return request({
		url: '/mcp/collectionPlan/preservePackageInfo',
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
 * 平台仓批量推送发货
 * @param params 查询参数
 * @returns
 */
export function postPushDeliverGoodsForPlatform(data: Object) {
	return request({
		url: '/mcp/collectionPlan/pushDeliverGoodsForPlatform',
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
 * 推送发货（一件代发）
 * @param params 查询参数
 * @returns
 */
export function postPushDeliverGoods(data: Object) {
	return request({
		url: '/mcp/collectionPlan/pushDeliverGoods',
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
 * 根据条件查询港口列表
 * @param params 查询参数
 * @returns
 */
export function getCollectionPlanCountryPortListByCondition(params?: object) {
	return request({
		url: '/mcp/CollectionPlanCountryPort/getListByCondition',
		method: 'get',
		params,
	});
}

/**
 * 查根据条件查询仓库列表
 * @returns
 */
export function getWarehouseListByCondition(params?: object) {
	return request({
		url: '/warehouse/warehouseInfo/getListByCondition',
		method: 'get',
		params,
	});
}
/**
 * 导出需要维护货件信息的提货计划
 * @returns
 */
export function getExportNeedAffirmDeliveryTime(params?: object) {
	return request({
		url: '/mcp/collectionPlan/exportNeedAffirmDeliveryTime',
		method: 'get',
		params,
		responseType: 'blob', // 设置响应类型为blob
	});
}

/**
 * 导出批量维护货件信息
 * @param params - 可选参数对象，用于传递导出条件的参数
 * @returns 返回一个Promise， resolves为服务器返回的Blob对象
 */
export function getExportShipmentInformation(params?: object) {
	return request({
		// 发起HTTP请求
		url: '/mcp/collectionPlan/exportPreservePackageInfo', // 请求的URL路径
		method: 'get', // 请求方法为GET
		params, // 请求参数
		responseType: 'blob', // 设置响应类型为blob，用于处理文件下载
	});
}

/**
 * 导出批量推送发货（一件代发）
 * @param params - 可选的查询参数对象
 * @returns 返回一个Promise，用于处理导出请求的响应
 */
export function getExportDispatchShipments(params?: object) {
	return request({
		url: '/mcp/collectionPlan/exportPushDeliverGoods', // 请求的API地址
		method: 'get', // 请求方法为GET
		params, // 请求参数
		responseType: 'blob', // 设置响应类型为blob，用于处理文件下载
	});
}

/**
 * 根据id查询提货计划列表
 * @returns
 */
export function getCollectionPlanListByIds(params?: object) {
	return request<CollectionPlanVo[]>({
		url: '/mcp/collectionPlan/selectListByids',
		method: 'get',
		params,
	});
}
/**
 * 批量取消提货计划
 * @param data 查询参数
 * @returns
 */
export function postBatchCancelCollectionPlan(
	data: {
		id: number;
		num: number;
		reason: string;
	}[]
) {
	return request({
		url: '/mcp/collectionPlanCancel/batchCancel',
		method: 'post',
		data,
	});
}

// 上传附件标签
export function uploadFileAttachment(data?: any) {
	return request({
		url: '/mcp/collectionPlan/importPackageAttachments',
		method: 'post',
		data,
	});
}
