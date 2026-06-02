/*
 * @Author: YIDA zhuhansong@merach.com
 * @Date: 2026-03-30 09:54:12
 * @LastEditors: YIDA zhuhansong@merach.com
 * @LastEditTime: 2026-04-11 17:01:25
 * @FilePath: \qianyi-ui\src\api\fbm\amazonOrderReturn\index.ts
 * @Description:
 *
 * Copyright (c) 2026 by ${git_name_email}, All Rights Reserved.
 */
import { httpService } from '/@/utils/request';
import { returnOrderPageMock } from './mock/index';
export interface AmazonOrderPageQuery {
	/**
	 * 申请取消状态（多选）
	 */
	applyCancelStatuses?: string[];
	/**
	 * 业务类型
	 */
	bizType?: string;
	countId?: string;
	current?: number;
	/**
	 * 勾选的id列表  导出时使用
	 */
	ids?: number[];
	maxLimit?: number;
	optimizeCountSql?: boolean;
	optimizeJoinOfCountSql?: boolean;
	'orders[0].asc'?: boolean;
	'orders[0].column'?: string;
	/**
	 * 订购时间结束日期
	 */
	orderTimeEnd?: string;
	/**
	 * 订购时间开始日期
	 */
	orderTimeStart?: string;
	'records[0]'?: string[];
	/**
	 * 退货申请时间结束日期
	 */
	returnApplyTimeEnd?: string;
	/**
	 * 退货申请时间开始日期
	 */
	returnApplyTimeStart?: string;
	/**
	 * 退货送达时间结束日期
	 */
	returnDeliverTimeEnd?: string;
	/**
	 * 退货送达时间开始日期
	 */
	returnDeliverTimeStart?: string;
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
	 * 库存属性（多选）
	 */
	stockAttributes?: string[];
	/**
	 * 店铺ID（多选）
	 */
	storeIds?: number[];
	total?: number;
	[property: string]: any;
}
export function getAmazonOrderReturnPage(data: AmazonOrderPageQuery) {
	return httpService.post('/fbm/amazonReturnOrderView/page', data, {
		mockConfig: {
			enable: false,
			data: returnOrderPageMock,
		},
	});
}

/**
 * 导出平台发货订单金蝶单据
 */
export function getAmazonOrderReturnExport(data: AmazonOrderPageQuery) {
	return httpService.post('/fbm/amazonReturnOrderView/export', data, {
		responseType: 'blob',
	});
}
