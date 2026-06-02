/*
 * @Author: 朱寒松 3136271519@qq.com
 * @Date: 2025-07-30 11:14:09
 * @LastEditors: YIDA zhuhansong@merach.com
 * @LastEditTime: 2026-04-11 16:44:01
 * @FilePath: \qianyi-ui\src\api\mcp\reviewPlan\index.ts
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
import { httpService } from '/@/utils/request';

export * from '/@/interface/views/mcp/reviewPlan/index';
/**
 * 分页查询取消提货计划
 * @param params 查询参数
 * @returns
 */
export function getQueryCollectionPlanCancel(data?: { [key: string]: any }) {
	return httpService.post<{
		total: number;
		records: any[];
	}>('/mcp/collectionPlanCancel/queryCollectionPlanCancel', data);
}
/**
 * 物控审核
 * @param data 查询参数
 * @returns
 */
export function postMaterialReview(data?: { [key: string]: any }) {
	return httpService.post<{ [key: string]: any }>(
		'/mcp/collectionPlanCancel/materialReview',
		data,
		{
			loadingConfig: {
				loading: true,
				text: '保存中...',
				background: 'rgba(255, 255, 255, 0.7)',
			},
		}
	);
}
/**
 * 采购审核
 * @param data 查询参数
 * @returns
 */
export function postPurchaseReview(data?: { [key: string]: any }) {
	return httpService.post<{ [key: string]: any }>(
		'/mcp/collectionPlanCancel/purchaseReview',
		data,
		{
			loadingConfig: {
				loading: true,
				text: '保存中...',
				background: 'rgba(255, 255, 255, 0.7)',
			},
		}
	);
}
