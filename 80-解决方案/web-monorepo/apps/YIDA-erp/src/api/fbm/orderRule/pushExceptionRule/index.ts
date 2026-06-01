import request from '/@/utils/request';

// 新增规则
export function postRuleConditionReviewSave(data: any) {
	return request({
		url: '/fbm/ruleConditionPushWms/save',
		method: 'post',
		data,
	});
}

// 编辑规则
export function postRuleConditionReviewUpdate(data: any) {
	return request({
		url: '/fbm/ruleConditionPushWms/update',
		method: 'post',
		data,
	});
}

// 根据id获取规则详情
export function getRulePushExceptionDetail(params: any) {
	return request({
		url: '/fbm/ruleConditionPushWms/detail',
		method: 'get',
		params,
	});
}
