import request from '/@/utils/request';
import type { IPageListResponse } from '/@/components/BaseTable/hooks/BaseTable';

// 订柜管理列表
export function getOrderContainerPage(
	data?: object
): Promise<IPageListResponse> {
	return request({
		url: '/mcp/orderContainer/page',
		method: 'post',
		data,
	}) as Promise<IPageListResponse>;
}
// 订柜详情
export function getOrderContainerDetail(params?: object) {
	return request({
		url: '/mcp/orderContainer/show',
		method: 'get',
		params,
	});
}

// 订柜管理列表
export function getPlanFactoryList(params?: object) {
	return request({
		url: '/mcp/collectionPlanFactory/getListByCondition',
		method: 'get',
		params,
	});
}

// 更新订单货柜
export function updateOrderContainer(params?: object) {
	return request({
		url: '/mcp/orderContainer/update',
		method: 'post',
		data: params,
		loadingConfig: {
			loading: true,
		},
	});
}

// 确认发货
export function confirmDelivery(params?: object) {
	return request({
		url: '/mcp/orderContainer/confirmDelivery',
		method: 'post',
		data: params,
		loadingConfig: {
			loading: true,
		},
	});
}

// 确认订舱
export function confirmOrder(params?: object) {
	return request({
		url: '/mcp/orderContainer/confirmOrder',
		method: 'post',
		data: params,
		loadingConfig: {
			loading: true,
		},
	});
}

// 作废
export function cancelOrderContainer(params?: object) {
	return request({
		url: '/mcp/orderContainer/cancel',
		method: 'post',
		data: params,
		loadingConfig: {
			loading: true,
		},
	});
}

// 发送工厂邮件
export function sendMail(params?: object) {
	return request({
		url: '/mcp/orderContainer/sendMail',
		method: 'post',
		data: params,
		loadingConfig: {
			loading: true,
		},
	});
}

// 发送工厂邮件
export function updateFactoryEmail(params?: object) {
	return request({
		url: '/purchase/supplierInfo/updateFactoryEmail',
		method: 'post',
		data: params,
		loadingConfig: {
			loading: true,
		},
	});
}

// 获取工厂邮件
export function getEmailDetail(params?: object) {
	return request({
		url: '/mcp/orderContainer/getSendMailMessageByOrderContainerNo',
		method: 'get',
		params,
	});
}

// 导出装柜清单
export function exportLoadingList(params?: object) {
	return request({
		url: '/mcp/orderContainer/exportLoadingList',
		method: 'get',
		params,
		responseType: 'blob',
	});
}

// 导出订柜
export function exportContainer(data?: object) {
	return request({
		url: '/mcp/orderContainer/exportContainer',
		method: 'post',
		data,
		responseType: 'blob',
	});
}

// 导出装车分配表
export function exportLoadingAllocation(data?: object) {
	return request({
		url: '/mcp/orderContainer/exportLoadingAllocation',
		method: 'post',
		data,
		responseType: 'blob',
	});
}

// 维护装柜时间
export function updateEstimatedLoadingTime(data?: Object) {
	return request({
		url: '/mcp/orderContainer/updateEstimatedLoadingTime',
		method: 'post',
		data,
	});
}

export function getExportBookedContainerInformation(params?: object) {
	return request({
		// 发起HTTP请求
		url: '/mcp/orderContainer/exportOrderContainerInfo', // 请求的URL路径
		method: 'get', // 请求方法为GET
		params, // 请求参数
		responseType: 'blob', // 设置响应类型为blob，用于处理文件下载
	});
}

export function uploadFileAttachment(data?: object) {
	return request({
		url: '/mcp/orderContainer/uploadFile',
		method: 'post',
		data: data,
		loadingConfig: {
			loading: true,
		},
	});
}
// 导出截单资料
export function getExportCutoffDataInformation(params?: object) {
	return request({
		// 发起HTTP请求
		url: '/mcp/orderContainer/exportCutoffData', // 请求的URL路径
		method: 'get', // 请求方法为GET
		params, // 请求参数
		responseType: 'blob', // 设置响应类型为blob，用于处理文件下载
	});
}
// 订柜管理列表 驳回
export function postOrderContainerRejectPrevious(
	data?: object
): Promise<IPageListResponse> {
	return request({
		url: '/mcp/orderContainer/rejectPrevious',
		method: 'post',
		data,
		loadingConfig: {
			loading: true,
		},
	}) as Promise<IPageListResponse>;
}

/**
 * 安排装柜
 * @param data
 * @returns
 */
export function postArrangeStuffing(data?: object): Promise<IPageListResponse> {
	return request({
		url: '/mcp/orderContainer/arrangeStuffing',
		method: 'post',
		data,
		loadingConfig: {
			loading: true,
		},
	}) as Promise<IPageListResponse>;
}

/**
 * 确认提货
 * @param data
 * @returns
 */
export function postConfirmPickup(data?: object): Promise<IPageListResponse> {
	return request({
		url: '/mcp/orderContainer/confirmPickup',
		method: 'post',
		data,
		loadingConfig: {
			loading: true,
		},
	}) as Promise<IPageListResponse>;
}
/**
 * 头程调拨
 * @param data
 * @returns
 */
export function postFirstLegTransfer(
	data?: object
): Promise<IPageListResponse> {
	return request({
		url: '/mcp/orderContainer/firstLegTransfer',
		method: 'post',
		data,
		loadingConfig: {
			loading: true,
		},
	}) as Promise<IPageListResponse>;
}
