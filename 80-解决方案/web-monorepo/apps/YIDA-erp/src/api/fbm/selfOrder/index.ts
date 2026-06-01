/*
 * @Author: YIDA 3136271519@qq.com
 * @Date: 2025-09-29 15:50:19
 * @LastEditors: wuyueqin wuyueqin@merach.com
 * @LastEditTime: 2026-05-21 16:00:06
 * @FilePath: \qianyi-ui\src\api\fbm\selfOrder\index.ts
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
import request, { httpService } from '/@/utils/request';
/**
 * 分页列表
 * @param params
 * @returns
 */
export function getSelfOrderPage(data: any) {
	return request<any>({
		url: '/fbm/selfOrder/page',
		method: 'post',
		data,
		loadingConfig: {
			loading: true,
		},
	});
}
/**
 * 状态统计
 * @param params
 * @returns
 */
export function getSelfOrderStatusCount(data: any) {
	return request({
		url: '/fbm/selfOrder/statusCount',
		method: 'post',
		data,
	});
}
/**
 * 查询费用比价结果
 * @param params
 * @returns
 */
export function getFeeComparisonResult(orderNo: any) {
	return request({
		url: `/fbm/ruleConditionWarehouse/compareFee/${orderNo}`,
		method: 'get',
	});
}
/**
 * 查看详情
 * @param params
 * @returns
 */
export function getSelfOrderDetail(params: any) {
	return request({
		url: '/fbm/selfOrder/detail',
		method: 'get',
		params,
	});
}
/**
 * 修改订单产品备注
 * @param data
 * @returns
 */
export function postUpdateSkuRemark(data: any) {
	return request({
		url: '/fbm/selfOrder/updateSkuRemark',
		method: 'post',
		data,
		loadingConfig: {
			loading: true,
		},
	});
}
/**
 * 修改客服备注
 * @param data
 * @returns
 */
export function postUpdateCsNote(data: any) {
	return request({
		url: '/fbm/selfOrder/updateCsNote',
		method: 'post',
		data,
		loadingConfig: {
			loading: true,
		},
	});
}
/**
 * 设定仓库物流
 * @param data
 * @returns
 */
export function postSetWareAndLogistics(data: any) {
	return request({
		url: '/fbm/selfOrder/setWareAndLogistics',
		method: 'post',
		data,
		loadingConfig: {
			loading: true,
		},
	});
}

/**
 * 确认接单
 * @param data
 * @returns
 */
export function postOrderConfirm(data: any) {
	return request({
		url: '/fbm/selfOrder/orderConfirm',
		method: 'post',
		data,
		loadingConfig: {
			loading: true,
		},
	});
}
/**
 * 确认发货
 * @param data
 * @returns
 */
export function postOrderShipped(data: any) {
	return request({
		url: '/fbm/selfOrder/orderShipped',
		method: 'post',
		data,
		loadingConfig: {
			loading: true,
		},
	});
}
/**
 * 发货审核
 * @param data
 * @returns
 */
export function postShippingReview(data: any) {
	return request({
		url: '/fbm/selfOrder/shippingReview',
		method: 'post',
		data,
		loadingConfig: {
			loading: true,
		},
	});
}
/**
 * FBA发货
 * @param data
 * @returns
 */
export function postfulfillmentByAmazon(data: any) {
	return request({
		url: '/fbm/selfOrder/fulfillmentByAmazon',
		method: 'post',
		data,
		loadingConfig: {
			loading: true,
		},
	});
}
/**
 * 批量FBA发货
 * @param data
 * @returns
 */
export function postBatchFulfillmentByAmazon(data: any) {
	return request({
		url: '/fbm/selfOrder/batchFulfillmentByAmazon',
		method: 'post',
		data,
		loadingConfig: {
			loading: true,
		},
	});
}
/**
 * 上传附件
 * @param data
 * @returns
 */
export function postUpdateFile(data: any) {
	return request({
		url: '/fbm/selfOrder/updateFile',
		method: 'post',
		data,
		loadingConfig: {
			loading: true,
		},
	});
}
/**
 * 删除附件（入参与 updateFile 一致）
 * @param data
 * @returns
 */
export function deleteFile(data: any) {
	return request({
		url: '/fbm/selfOrder/deleteFile',
		method: 'post',
		data,
		loadingConfig: {
			loading: true,
		},
	});
}
/**
 * 查看物流信息
 * @param data
 * @returns
 */
export function postGetLogisticsInfo(data: any) {
	return request({
		url: '/fbm/selfOrder/getLogisticsInfo',
		method: 'post',
		data,
	});
}
/**
 * 修改订单标签
 * @param data
 * @returns
 */
export function postUpdateOrderTag(data: any) {
	return request({
		url: '/fbm/selfOrder/updateOrderTag',
		method: 'post',
		data,
		loadingConfig: {
			loading: true,
		},
	});
}

/**
 * 批量修改订单标签
 * @param data
 * @returns
 */
export function postBatchUpdateOrderTag(data: any) {
	return request({
		url: '/fbm/selfOrder/batchUpdateOrderTag',
		method: 'post',
		data,
		loadingConfig: {
			loading: true,
		},
	});
}
/**
 * 查询物流渠道列表
 * @param params
 * @returns
 */
export function getLogisticsChannelList(data: any) {
	return request({
		url: '/fbm/logisticsChannel/search',
		method: 'post',
		data,
	});
}
/**
 * 查询系统自发货和销售订单的基本信息
 * @param params
 * @returns
 */
export function postSearchOrderBasicMessage(data: any) {
	return request({
		url: '/fbm/orderBasic/searchOrderBasicMessage',
		method: 'post',
		data,
	});
}

/**
 * 新增自发货订单
 * @param data
 * @returns
 */
export function postAddSelfOrder(data: any) {
	return request({
		url: '/fbm/selfOrder/addSelfOrder',
		method: 'post',
		data,
		loadingConfig: {
			loading: true,
		},
	});
}

/**
 * 更新收件人信息
 * @param data - 包含收件人信息的参数对象
 * @returns 返回一个请求对象，用于发送更新收件人信息的API请求
 */
export function postupdateRecipientInfo(data: any) {
	return request({
		url: '/fbm/selfOrder/updateRecipientInfo', // API请求的URL地址
		method: 'post', // 请求方法为POST
		data, // 请求参数
		loadingConfig: {
			loading: true,
		},
	});
}

/**
 * 发送订单作废请求
 * @param data - 请求参数，包含订单作废所需的数据
 * @returns 返回API请求的Promise对象
 */
export function postOrderInvalid(data: any) {
	return request({
		url: '/fbm/selfOrder/invalid', // API请求的URL地址，用于订单作废接口
		method: 'post', // 请求方法为POST，符合订单作废操作的HTTP规范
		data, // 请求参数，包含需要作废的订单相关信息
		loadingConfig: {
			loading: true,
		},
	});
}

export function postOrderCutOff(data: any) {
	return request({
		url: '/fbm/selfOrder/cutOff', // API请求的URL地址，用于订单作废接口
		method: 'post', // 请求方法为POST，符合订单作废操作的HTTP规范
		data, // 请求参数，包含需要作废的订单相关信息
		loadingConfig: {
			loading: true,
		},
	});
}

/**
 * 合并订单的API请求函数
 * @param data - 合并订单所需的数据对象
 * @returns 返回一个Promise对象，包含服务器响应的数据
 */
export function postMergeOrder(data: any) {
	return request({
		url: '/fbm/selfOrder/mergeOrder', // API请求的URL路径
		method: 'post', // 指定HTTP请求方法为POST
		data, // 发送到服务器的请求数据
		loadingConfig: {
			loading: true,
		},
	});
}

/**
 * 根据自订单号获取订单详情
 * @param params - 请求参数对象
 * @returns 返回API请求结果
 */
export function postdetailBySelfOrderNo(data: any) {
	return request({
		url: '/fbm/selfOrder/detailBySelfOrderNo', // API请求地址
		method: 'post', // 请求方法为post
		data, // 请求参数
		loadingConfig: {
			loading: true,
		},
	});
}

/**
 * 拆分订单的API请求函数
 * @param data - 请求数据对象
 * @returns 返回API请求的Promise对象
 */
export function postSplitOrder(data: any) {
	return request({
		url: '/fbm/selfOrder/splitOrder', // API请求地址
		method: 'post', // 请求方法为post
		data, // 请求参数
		loadingConfig: {
			loading: true,
		},
	});
}

/**
 * 推送订单信息到WMS系统的函数
 * @param data - 需要推送的数据对象
 * @returns 返回一个Promise对象，包含API请求的结果
 */
export function postPushWms(data: any) {
	return request({
		url: '/fbm/selfOrder/pushWms', // API请求地址
		method: 'post', // 请求方法为post
		data, // 请求参数
		loadingConfig: {
			loading: true,
		},
	});
}

/**
 * 标记订单为已发货状态
 * @param data - 订单相关数据
 * @returns 返回请求API的结果
 */
export function markShipped(data: any) {
	return request({
		url: '/fbm/selfOrder/markShipped', // API请求地址
		method: 'post', // 请求方法为post
		data, // 请求参数
		loadingConfig: {
			loading: true,
		},
	});
}

/**
 * 禁止处理
 * @param params
 * @returns
 */
export function stopHanderOrder(params: any) {
	return request({
		url: '/fbm/selfOrder/stopHandlerOrder',
		method: 'get',
		params,
		loadingConfig: {
			loading: true,
		},
	});
}

/**
 * 批量禁止处理
 * @param data
 * @returns
 */
export function postBatchStopHandlerOrder(data: any) {
	return request({
		url: '/fbm/selfOrder/batchStopHandlerOrder',
		method: 'post',
		data,
		loadingConfig: {
			loading: true,
		},
	});
}

/**
 * 解除禁止处理
 * @param params
 * @returns
 */
export function releaseStopHandlerOrder(params: any) {
	return request({
		url: '/fbm/selfOrder/releaseStopHandlerOrder',
		method: 'post',
		data: params,
		loadingConfig: {
			loading: true,
		},
	});
}

/**
 * 添加礼品函数
 * @param data - 礼品相关信息数据
 * @returns 返回请求结果
 */
export function postAddGift(data: any) {
	return request({
		url: '/fbm/selfOrder/addGift', // API请求地址，用于添加礼品的接口
		method: 'post', // 请求方法为post，表示提交数据
		data, // 请求参数，包含礼品相关信息
		loadingConfig: {
			loading: true,
		},
	});
}
/**
 * 导出自发货订单
 * @param data
 * @returns
 */
export function getExportSelfOrder(data: any) {
	return request({
		url: '/fbm/selfOrder/exportSelfOrder',
		method: 'post',
		data,
		responseType: 'blob', // 设置响应类型为blob
	});
}
/**
 * 自发货订单费用导出
 * @param data
 * @returns
 */
export function getExportSelfOrderFee(data: any) {
	return request({
		url: '/fbm/selfOrder/exportSelfOrder/fee',
		method: 'post',
		data,
		responseType: 'blob', // 设置响应类型为blob
	});
}
/**
 * 更新MSKU配对
 * @param data
 * @returns
 */
export function updateMskuPairing(data: any) {
	return request({
		url: '/fbm/selfOrder/updateMskuPairing',
		method: 'post',
		data,
		loadingConfig: {
			loading: true,
		},
	});
}
/**
 * 执行仓库规则
 * @param data
 * @returns
 */
export function executeWarehouseRules(data: any) {
	return request({
		url: '/fbm/selfOrder/executeWarehouseRules',
		method: 'post',
		data,
		loadingConfig: {
			loading: true,
		},
	});
}
/**
 * 更新三方仓SKU配对
 * @param data
 * @returns
 */
export function updateThirdPartySkuPairing(data: any) {
	return request({
		url: '/fbm/selfOrder/updateThirdPartySkuPairing',
		method: 'post',
		data,
		loadingConfig: {
			loading: true,
		},
	});
}

/**
 * 换货接口函数
 * @param data - 换货所需的数据信息
 * @returns 返回请求结果
 */
export function postExchangeGoods(data: any) {
	return request({
		url: '/fbm/selfOrder/exchangeGoods', // API请求地址，用于添加礼品的接口
		method: 'post', // 请求方法为post，表示提交数据
		data, // 请求参数，包含礼品相关信息
		loadingConfig: {
			loading: true,
		},
	});
}

/**
 * 获取MSKU分页信息
 * @param params - 查询参数
 * @returns 返回API请求结果
 */
export function getSelectMskuPage(params: any) {
	return request({
		url: '/product/sku/selectMskuPage',
		method: 'get',
		params,
	});
}

/**
 * 重新计算费用
 * @param params - 查询参数
 * @returns 返回API请求结果
 */
export function putRecalculation(data: {
	// 订单号
	orderNos: string[];
}) {
	return httpService.put<any>(
		'/fbm/ruleConditionWarehouse/recalculation',
		data
	);
}
/**
 * 计算费用
 * @param params - 查询参数
 * @returns 返回API请求结果
 */
export function putCalculateFeen(data: {
	// 物流渠道编码
	logisticsChannelCode: string;
	// 订单号
	orderNo: string;
	// 仓库编码
	warehouseCode: string;
}) {
	return httpService.put<any>(
		'/fbm/ruleConditionWarehouse/calculateFee',
		data,
		{
			loadingConfig: {
				loading: true,
			},
		}
	);
}
/**
 * 物流下单重试
 * @param params - 查询参数
 * @returns 返回API请求结果
 */
export function postRecalculationRetry(data: {
	// 订单号
	ids: string[];
}) {
	return httpService.post<any>('/fbm/selfOrder/batchLogisticsOrder', data, {
		loadingConfig: {
			loading: true,
		},
	});
}

/**
 * 批量设定仓库物流
 * @param params - 查询参数
 * @returns 返回API请求结果
 */
export function batchSetWareAndLogistics(data: any) {
	return httpService.post<any>(
		'/fbm/selfOrder/batchSetWareAndLogistics',
		data,
		{
			loadingConfig: {
				loading: true,
			},
		}
	);
}

/**
 * 批量设定仓库物流（只按SKU）
 * @param data
 * @returns
 */
export function batchSetWareAndLogisticsToSku(data: any) {
	return httpService.post<any>(
		'/fbm/selfOrder/batchSetWareAndLogisticsWithoutDept',
		data,
		{
			loadingConfig: {
				loading: true,
			},
		}
	);
}

/**
 * 批量更新运营人和运营小组
 * @param data ids、operationUserId、deptId
 * @returns
 */
export function batchUpdateOperation(data: {
	ids: (string | number)[];
	operationUserId: string | number;
	deptId: string | number;
}) {
	return httpService.post<any>('/fbm/selfOrder/batchUpdateOperation', data, {
		loadingConfig: {
			loading: true,
		},
	});
}
/**
 * 修复自发货订单数据
 * @param selfOrderNos 系统订单号列表
 */
export function postFixSelfOrderInfo(selfOrderNos: string[]) {
	return httpService.post<any>('/fbm/data/fix/self-order/info', selfOrderNos, {
		loadingConfig: {
			loading: true,
		},
	});
}
