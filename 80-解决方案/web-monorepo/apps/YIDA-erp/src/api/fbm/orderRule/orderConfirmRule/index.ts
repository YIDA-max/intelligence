/*
 * @Author: YIDA 3136271519@qq.com
 * @Date: 2025-10-11 16:26:24
 * @LastEditors: YIDA 3136271519@qq.com
 * @LastEditTime: 2025-10-14 14:25:57
 * @FilePath: \qianyi-ui\src\api\fbm\orderRule\orderConfirmRule\index.ts
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

// 新增接单规则
export function postRuleConditionAcceptSave(data: any) {
	return request({
		url: '/fbm/ruleConditionAccept/save',
		method: 'post',
		data,
	});
}
// 编辑接单规则
export function postRuleConditionAcceptUpdate(data: any) {
	return request({
		url: '/fbm/ruleConditionAccept/update',
		method: 'post',
		data,
	});
}

// 根据id获取规则详情
export function getRuleConditionAcceptDetail(params: any) {
	return request({
		url: '/fbm/ruleConditionAccept/detail',
		method: 'get',
		params,
	});
}

// 开启规则
export function postRuleInfoOpen(data: any) {
	return request({
		url: '/fbm/ruleInfo/open',
		method: 'post',
		data,
	});
}

// 禁用规则
export function postRuleInfoClose(data: any) {
	return request({
		url: '/fbm/ruleInfo/close',
		method: 'post',
		data,
	});
}
