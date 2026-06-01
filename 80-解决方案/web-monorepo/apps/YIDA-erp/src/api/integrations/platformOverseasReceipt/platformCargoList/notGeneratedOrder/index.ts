/*
 * @Author: YIDA zhuhansong@merach.com
 * @Date: 2026-02-10 10:53:30
 * @LastEditors: YIDA zhuhansong@merach.com
 * @LastEditTime: 2026-04-13 14:44:42
 * @FilePath: \qianyi-ui\src\api\integrations\platformOverseasReceipt\platformCargoList\notGeneratedOrder\index.ts
 * @Description:
 *
 * Copyright (c) 2026 by ${git_name_email}, All Rights Reserved.
 */
import { httpService } from '/@/utils/request';
export interface queryGeneratedKingdeeBillPage {
	/**
	 * 金蝶单据状态(0未处理/1生成成功/2生成失败)
	 */
	billStatus?: number;
	countId?: string;
	current?: number;
	/**
	 * 集成数据编号列表(单个模糊查询,多个精确查询)
	 */
	dataNos?: string[];
	/**
	 * 金蝶单据创建人列表
	 */
	kingdeeBillCreators?: string[];
	/**
	 * 金蝶单据生成时间-结束
	 */
	kingdeeBillTimeEnd?: string;
	/**
	 * 金蝶单据生成时间-开始
	 */
	kingdeeBillTimeStart?: string;
	/**
	 * 匹配状态(0未匹配/1已匹配)
	 */
	matchStatus?: number;
	maxLimit?: number;
	/**
	 * MSKU列表(单个模糊查询,多个精确查询)
	 */
	mskuCodes?: string[];
	optimizeCountSql?: boolean;
	optimizeJoinOfCountSql?: boolean;
	'orders[0].asc'?: boolean;
	'orders[0].column'?: string;
	searchCount?: boolean;
	/**
	 * 货件号列表(单个模糊查询,多个精确查询)
	 */
	shipmentIds?: string[];
	size?: number;
	/**
	 * SKU列表(单个模糊查询,多个精确查询)
	 */
	skuCodes?: string[];
	/**
	 * 店铺站点列表
	 */
	storeSiteNames?: string[];
	total?: number;
	/**
	 * 调拨单号列表(单个模糊查询,多个精确查询)
	 */
	transferOrderNos?: string[];
	[property: string]: any;
}

/** 分页查询生成金蝶单据数据 */
export function getGeneratedKingdeeBillPage(
	data: queryGeneratedKingdeeBillPage
) {
	return httpService.post('kingdee/kingdeeShipmentItem/page', data);
}

export function postGenerateKingdeeBill(params?: { [key: string]: any }) {
	return httpService.post(
		'/kingdee/kingdeeShipmentItem/batchPushToKingdee',
		params
	);
}

export function exportGeneratedKingdeeBill(data: any) {
	return httpService.post('kingdee/kingdeeShipmentItem/export', data, {
		responseType: 'blob',
	});
}
