/*
 * @Author: YIDA 3136271519@qq.com
 * @Date: 2025-10-11 16:26:24
 * @LastEditors: YIDA 3136271519@qq.com
 * @LastEditTime: 2025-10-17 15:22:32
 * @FilePath: \qianyi-ui\src\api\fbm\orderRule\orderMergeRule\index.ts
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
import request from '/@/utils/request';

// 新增规则
export function postRuleConditionMergeSave(data: any) {
	return request({
		url: '/fbm/ruleConditionMerge/save',
		method: 'post',
		data,
	});
}

// 编辑规则
export function postRuleConditionMergeUpdate(data: any) {
	return request({
		url: '/fbm/ruleConditionMerge/update',
		method: 'post',
		data,
	});
}

// 根据id获取规则详情
export function getRuleConditionMergeDetail(params: any) {
	return request({
		url: '/fbm/ruleConditionMerge/detail',
		method: 'get',
		params,
	});
}
// 查询所有合单规则控制数据
export function getRuleActionControl(params: any) {
	return request({
		url: '/fbm/ruleActionControl/get',
		method: 'get',
		params,
	});
}
// 新增或修改合单规则控制数据
export function postRuleActionControlSaveOrUpdate(data: any) {
	return request({
		url: '/fbm/ruleActionControl/saveOrUpdate',
		method: 'post',
		data,
	});
}
