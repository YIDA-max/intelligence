/*
 * @Author: YIDA 3136271519@qq.com
 * @Date: 2025-10-11 16:26:24
 * @LastEditors: YIDA 3136271519@qq.com
 * @LastEditTime: 2025-10-15 16:14:46
 * @FilePath: \qianyi-ui\src\api\fbm\orderRule\orderReceiptInformation\index.ts
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
import request from '/@/utils/request';

// 新增规则
export function postRuleConditionRecipientSave(data: any) {
	return request({
		url: '/fbm/ruleConditionRecipient/save',
		method: 'post',
		data,
	});
}

// 编辑规则
export function postRuleConditionRecipientUpdate(data: any) {
	return request({
		url: '/fbm/ruleConditionRecipient/update',
		method: 'post',
		data,
	});
}

// 根据id获取规则详情
export function getRuleConditionRecipientDetail(params: any) {
	return request({
		url: '/fbm/ruleConditionRecipient/detail',
		method: 'get',
		params,
	});
}
