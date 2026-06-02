/*
 * @Author: YIDA 3136271519@qq.com
 * @Date: 2025-10-11 16:26:24
 * @LastEditors: YIDA 3136271519@qq.com
 * @LastEditTime: 2025-10-15 17:10:20
 * @FilePath: \qianyi-ui\src\api\fbm\orderRule\orderSplitRule\index.ts
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
import request from '/@/utils/request';

// 新增规则
export function postRuleConditionSplitSave(data: any) {
	return request({
		url: '/fbm/ruleConditionSplit/save',
		method: 'post',
		data,
	});
}

// 编辑规则
export function postRuleConditionSplitUpdate(data: any) {
	return request({
		url: '/fbm/ruleConditionSplit/update',
		method: 'post',
		data,
	});
}

// 根据id获取规则详情
export function getRuleConditionSplitDetail(params: any) {
	return request({
		url: '/fbm/ruleConditionSplit/detail',
		method: 'get',
		params,
	});
}
