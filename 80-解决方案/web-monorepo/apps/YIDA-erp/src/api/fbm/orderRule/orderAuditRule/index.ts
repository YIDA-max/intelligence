/*
 * @Author: YIDA 3136271519@qq.com
 * @Date: 2025-10-11 16:26:24
 * @LastEditors: YIDA 3136271519@qq.com
 * @LastEditTime: 2025-10-14 15:43:04
 * @FilePath: \qianyi-ui\src\api\fbm\orderRule\orderAuditRule\index.ts
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
import request from '/@/utils/request';

// 新增规则
export function postRuleConditionReviewSave(data: any) {
	return request({
		url: '/fbm/ruleConditionReview/save',
		method: 'post',
		data,
	});
}

// 编辑规则
export function postRuleConditionReviewUpdate(data: any) {
	return request({
		url: '/fbm/ruleConditionReview/update',
		method: 'post',
		data,
	});
}

// 根据id获取规则详情
export function getRuleConditionReviewDetail(params: any) {
	return request({
		url: '/fbm/ruleConditionReview/detail',
		method: 'get',
		params,
	});
}
