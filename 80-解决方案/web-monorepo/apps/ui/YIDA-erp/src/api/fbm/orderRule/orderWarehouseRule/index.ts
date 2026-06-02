/*
 * @Author: YIDA 3136271519@qq.com
 * @Date: 2025-10-11 16:26:24
 * @LastEditors: YIDA zhuhansong@merach.com
 * @LastEditTime: 2026-04-11 17:01:04
 * @FilePath: \qianyi-ui\src\api\fbm\orderRule\orderWarehouseRule\index.ts
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
import request from '/@/utils/request';

// 接单规则列表
export function getRuleInfoList(data: any) {
	return request({
		url: '/fbm/ruleInfo/ruleList',
		method: 'post',
		data,
	});
}

// 重新排序
export function reorderRuleInfoList(data: any) {
	return request({
		url: '/fbm/ruleInfo/reorder',
		method: 'post',
		data,
	});
}
// 新增规则
export function postRuleConditionShippedSave(data: any) {
	return request({
		url: '/fbm/ruleConditionWarehouse',
		method: 'post',
		data,
	});
}

// 编辑规则
export function postRuleConditionShippedUpdate(data: any) {
	return request({
		url: '/fbm/ruleConditionWarehouse',
		method: 'put',
		data,
	});
}

// 根据id获取规则详情
export function getRuleConditionShippedDetail(params: any) {
	return request({
		url: `/fbm/ruleConditionWarehouse/${params}`,
		method: 'get',
		params,
	});
}
