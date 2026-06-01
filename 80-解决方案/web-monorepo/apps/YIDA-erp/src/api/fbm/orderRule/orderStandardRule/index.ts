/*
 * @Author: YIDA 3136271519@qq.com
 * @Date: 2025-10-11 16:26:24
 * @LastEditors: YIDA 3136271519@qq.com
 * @LastEditTime: 2025-10-14 15:41:19
 * @FilePath: \qianyi-ui\src\api\fbm\orderRule\orderStandardRule\index.ts
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
import request from '/@/utils/request';

// 新增规则
export function postRuleConditionShippedSave(data: any) {
	return request({
		url: '/fbm/ruleConditionShipped/save',
		method: 'post',
		data,
	});
}

// 编辑规则
export function postRuleConditionShippedUpdate(data: any) {
	return request({
		url: '/fbm/ruleConditionShipped/update',
		method: 'post',
		data,
	});
}

// 根据id获取规则详情
export function getRuleConditionShippedDetail(params: any) {
	return request({
		url: '/fbm/ruleConditionShipped/detail',
		method: 'get',
		params,
	});
}
