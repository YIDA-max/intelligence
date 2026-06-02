/*
 * @Author: YIDA zhuhansong@merach.com
 * @Date: 2026-03-30 09:54:12
 * @LastEditors: YIDA zhuhansong@merach.com
 * @LastEditTime: 2026-04-11 17:02:31
 * @FilePath: \qianyi-ui\src\api\fbm\walmartOrderReturn\index.ts
 * @Description:
 *
 * Copyright (c) 2026 by ${git_name_email}, All Rights Reserved.
 */
import { httpService } from '/@/utils/request';
export interface walmartReturnPageQuery {
	countId?: string;
	current?: number;
	/**
	 * 勾选的id列表  导出时使用
	 */
	ids?: number[];
	maxLimit?: number;
	/**
	 * msku
	 */
	mskuList?: string[];
	optimizeCountSql?: boolean;
	optimizeJoinOfCountSql?: boolean;
	/**
	 * 配送方式（多选）
	 */
	orderDeliveryMethods?: string[];
	'orders[0].asc'?: boolean;
	'orders[0].column'?: string;
	/**
	 * 平台订单号
	 */
	platformOrderNos?: string[];
	/**
	 * 产品名称
	 */
	productNames?: string[];
	'records[0]'?: string[];
	/**
	 * 退款渠道（多选）
	 */
	refundChannels?: string[];
	/**
	 * 退货订单号
	 */
	returnOrderId?: string[];
	/**
	 * 退货原因（多选）
	 */
	returnReasons?: string[];
	/**
	 * 退货状态（多选）
	 */
	returnStatuses?: string[];
	/**
	 * 退货时间结束日期
	 */
	returnTimeEnd?: string;
	/**
	 * 退货时间开始日期
	 */
	returnTimeStart?: string;
	searchCount?: boolean;
	size?: number;
	/**
	 * sku
	 */
	skuList?: string[];
	/**
	 * 店铺ID（多选）
	 */
	storeIds?: number[];
	total?: number;
	[property: string]: any;
}
export function getWalmartOrderReturnPage(data: walmartReturnPageQuery) {
	return httpService.post('/fbm/walmartReturnOrderView/page', data);
}

/**
 * 导出平台发货订单金蝶单据
 */
export function getWalmartOrderReturnExport(data: walmartReturnPageQuery) {
	return httpService.post('/fbm/walmartReturnOrderView/export', data, {
		responseType: 'blob',
	});
}
export function getWalmartOrderInfo(params?: any) {
	return httpService.get('/fbm/walmartReturnOrderItemView/returnInfo', {
		params,
	});
}
