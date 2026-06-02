/*
 * @Author: YIDA zhuhansong@merach.com
 * @Date: 2026-03-30 09:54:12
 * @LastEditors: YIDA zhuhansong@merach.com
 * @LastEditTime: 2026-04-11 17:02:00
 * @FilePath: \qianyi-ui\src\api\fbm\tiktokOrderReturn\index.ts
 * @Description:
 *
 * Copyright (c) 2026 by ${git_name_email}, All Rights Reserved.
 */
import { httpService } from '/@/utils/request';
export interface tiktokReturnPageQuery {
	/**
	 * 仲裁状态（多选）
	 */
	arbitrationStatuses?: string[];
	countId?: string;
	/**
	 * 创建时间结束日期
	 */
	createTimeEnd?: string;
	/**
	 * 创建时间开始日期
	 */
	createTimeStart?: string;
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
	 * 退货ID
	 */
	returnIds?: string[];
	/**
	 * 退货状态（多选）
	 */
	returnStatuses?: string[];
	/**
	 * 退货类型（多选）
	 */
	returnTypes?: string[];
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
export function getTiktokOrderReturnPage(data: tiktokReturnPageQuery) {
	return httpService.post('/fbm/tiktokReturnOrderView/page', data);
}

export function getTiktokOrderReturnExport(data?: tiktokReturnPageQuery) {
	return httpService.post('/fbm/tiktokReturnOrderView/export', data, {
		responseType: 'blob',
	});
}

export function getTiktokOrderInfo(params?: any) {
	return httpService.get('/fbm/tiktokReturnOrderItemView/returnInfo', {
		params,
	});
}
