import { httpService } from '/@/utils/request';

/**
 * 分页列表
 * @param params
 * @returns
 */
export function getExpenseItemRelationPage(params: any) {
	return httpService.get('/integrations/expenseItemRelation/page', {
		params,
	});
}

/**
 * 根据id获取详情
 * @param data
 * @returns
 */
export function getExpenseItemRelationDetail(data: any) {
	return httpService.get(`/integrations/expenseItemRelation/detail`, {
		params: data,
	});
}

/**
 * 新增
 * @param data
 * @returns
 */
export function addExpenseItemRelation(data: any) {
	return httpService.post('/integrations/expenseItemRelation', data);
}

/**
 * 编辑
 * @param data
 * @returns
 */
export function updateExpenseItemRelation(data: any) {
	return httpService.put('/integrations/expenseItemRelation', data);
}

/**
 * 导出
 * @param params
 * @returns
 */
export function getExportExpenseItemRelation(params?: any) {
	return httpService.get('/integrations/expenseItemRelation/export', {
		params: params,
		responseType: 'blob',
	});
}
