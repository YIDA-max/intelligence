/*
 * @Author: YIDA 3136271519@qq.com
 * @Date: 2025-08-19 10:08:15
 * @LastEditors: YIDA zhuhansong@merach.com
 * @LastEditTime: 2026-05-19 16:32:21
 * @FilePath: \qianyi-ui\src\api\materialFlow\deliveryPlan\index.ts
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
import request from '/@/utils/request';
import type { IPageListResponse } from '/@/components/BaseTable/hooks/BaseTable';
// 发货下拉列表
export function getDeliveryPlanPage(data?: object) {
	return request({
		url: '/mcp/deliveryPlan/page',
		method: 'post',
		data,
	});
}
/**
 * 查询货件维护国家/渠道等配置列表（后台维护表）。
 * 说明：发货计划列表行是否命中配置请以接口返回字段 `shipmentCountryConfigFlag` 为准，勿用本列表在前端推断按钮显隐。
 */
export function getDeliveryPlanChannelShipmentConfigList(params?: object) {
	return request({
		url: '/mcp/deliveryPlanChannelShipmentConfig/list',
		method: 'get',
		params,
	});
}

/**
 * 单条发货计划维护货件信息（与提货计划 preservePackageInfo 语义一致，路径为发货计划域）。
 * 提交字段需与后端 `/mcp/deliveryPlan/preservePackageInfo` 约定一致。
 */
export interface IDeliveryPlanPreservePackageInfoRequest {
	/**
	 * 条码附件
	 */
	barcodeAttachment: string;
	/**
	 * 国家代码
	 */
	countryCode: string;
	/**
	 * 货件创建时间
	 */
	goodsCreateTime: string;
	/**
	 * 发货计划ID
	 */
	id: number;
	/**
	 * 平台仓库编码
	 */
	platformWarehouseCode: string;
	/**
	 * 备注
	 */
	remark?: string;
	/**
	 * 箱唛附件
	 */
	shippingMarkAttachment: string;
	/**
	 * 平台店铺ID
	 */
	storeId: number;
}

export function postPreservePackageInfo(
	data: IDeliveryPlanPreservePackageInfoRequest
) {
	return request({
		url: '/mcp/deliveryPlan/preservePackageInfo',
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
 * 按筛选（及可选勾选 id）导出「批量维护货件信息」。
 * 与提货计划 `/mcp/collectionPlan/exportPreservePackageInfo` 语义对齐。
 */
export function getExportDeliveryPlanPreservePackageInfo(params?: object) {
	return request({
		url: '/mcp/deliveryPlan/exportPreservePackageInfo',
		method: 'get',
		params,
		responseType: 'blob',
	});
}

/**
 * 批量导入附件（维护货件信息批量接口）。
 */
export function postImportDeliveryPlanPackageAttachments(data?: {
	filesUrl: string[];
	fileType: string;
}) {
	return request({
		url: '/mcp/deliveryPlan/importPackageAttachments',
		method: 'post',
		data,
	});
}

/**
 * 批量提醒运营创建货件：飞书通知对应运营、写业务日志（后端统一处理）。
 * 前端仅传勾选的发货计划 id 列表。
 */
export function postRemindCreateShipment(data?: { ids: unknown[] }) {
	return request({
		url: '/mcp/deliveryPlan/remindCreateShipment',
		method: 'post',
		data,
		loadingConfig: {
			loading: true,
			text: '提交中...',
		},
	});
}

// 批量删除发货计划
export function postDeleteDeliveryPlan(data?: Object) {
	return request({
		url: `/mcp/deliveryPlan/delete`,
		method: 'post',
		data,
	});
}

/**
 * 导出发货计划
 * @param params
 */
export function getExportDeliveryPlan(data?: object) {
	return request({
		url: '/mcp/deliveryPlan/export',
		method: 'post',
		data,
		responseType: 'blob', // 设置响应类型为 blob
	});
}

/**
 * 根据条件查询港口列表
 */
export function getListByCondition(params?: object) {
	return request({
		url: '/admin/basePort/getListByCondition',
		method: 'get',
		params,
	});
}

/**
 * 获取风险标签列表
 */
export function getTagList(params?: object) {
	return request({
		url: '/mcp/tagInfo/list',
		method: 'get',
		params,
	});
}

/**
 * 上传标签
 */
export function postUploadLabel(data?: Object) {
	return request({
		url: '/mcp/deliveryPlan/uploadLabel',
		method: 'post',
		data,
	});
}

/**
 * 拆分发货计划
 */
export function postSplitDeliveryPlan(data?: Object) {
	return request({
		url: '/mcp/deliveryPlan/split',
		method: 'post',
		data,
	});
}

/**
 * 查询新增货柜校验
 */
export function postOrderContainerCheckOrderContainer(data?: Object) {
	return request({
		url: '/mcp/orderContainer/checkOrderContainer',
		method: 'post',
		data,
	});
}
/**
 * 批量添加备注
 */
export function postUpdateLogisticsRemark(data?: Object) {
	return request({
		url: '/mcp/deliveryPlan/updateLogisticsRemark',
		method: 'post',
		data,
	});
}
/**
 * 预创建订单货柜
 */
export function postOrderContainerReCreateOrderContainer(data?: Object) {
	return request({
		url: '/mcp/orderContainer/recreateOrderContainer',
		method: 'post',
		data,
	});
}
/**
 * 查询货柜状态校验
 */
export function postOrderContainerCheckOrderContainerState(data?: Object) {
	return request({
		url: '/mcp/orderContainer/checkOrderContainerState',
		method: 'post',
		data,
	});
}
/**
 * 查询所有的订单货柜
 */
export function getOrderContainerQueryOrderContainerNo(data?: object) {
	return request({
		url: '/mcp/orderContainer/queryOrderContainerNo',
		method: 'post',
		data,
	});
}
/**
 * 订单货柜校验
 */
export function postOrderContainerAddOrderContainerCheck(data?: Object) {
	return request({
		url: '/mcp/orderContainer/addOrderContainerCheck',
		method: 'post',
		data,
	});
}
/**
 * 创建订单货柜
 */
export function postOrderContainerInsertOrderContainer(data?: Object) {
	return request({
		url: '/mcp/orderContainer/insertOrderContainer',
		method: 'post',
		data,
		loadingConfig: {
			loading: true,
		},
	});
}
/**
 * 加入货柜
 */
export function postOrderContainerAddOrderContainer(data?: Object) {
	return request({
		url: '/mcp/orderContainer/addOrderContainer',
		method: 'post',
		data,
		loadingConfig: {
			loading: true,
		},
	});
}
/**
 * 移除货柜
 */
export function postOrderContainerOutOrderContainer(data?: Object) {
	return request({
		url: '/mcp/orderContainer/OutOrderContainer',
		method: 'post',
		data,
		loadingConfig: {
			loading: true,
		},
	});
}

export function updatePlanShipmentDate(data?: Object) {
	return request({
		url: '/mcp/deliveryPlan/updatePlanShipmentDate',
		method: 'post',
		data,
		loadingConfig: {
			loading: true,
		},
	});
}
/**
 * 维护初始预计装柜时间
 * @param data
 * @returns
 */
export function postMaintainContainerTime(
	data?: object
): Promise<IPageListResponse> {
	return request({
		url: '/mcp/deliveryPlan/updateInitialEstimatedLoadingTime',
		method: 'post',
		data,
	}) as Promise<IPageListResponse>;
}

/**
 * 维护变更后预计装柜时间
 * @param data
 * @returns
 */
export function postMaintainChangedContainerTime(
	data?: object
): Promise<IPageListResponse> {
	return request({
		url: '/mcp/deliveryPlan/updateChangedEstimatedLoadingTime',
		method: 'post',
		data,
	}) as Promise<IPageListResponse>;
}
/**
 * 维护物流人员
 * @param data
 * @returns
 */

export function postMaintainLogisticsStaff(
	data?: object
): Promise<IPageListResponse> {
	return request({
		url: '/mcp/deliveryPlan/updateLogisticsUser',
		method: 'post',
		data,
	}) as Promise<IPageListResponse>;
}
