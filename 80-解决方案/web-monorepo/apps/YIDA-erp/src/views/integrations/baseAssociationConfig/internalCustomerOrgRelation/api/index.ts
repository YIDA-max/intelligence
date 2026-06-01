import { httpService } from '/@/utils/request';

/**
 * 分页列表
 * @param params
 * @returns
 */
export function getInternalCustomerOrgRelationPage(params: any) {
	return httpService.get('/integrations/internalCustomerOrgRelation/page', {
		params,
	});
}

/**
 * 根据id获取详情
 * @param data
 * @returns
 */
export function getInternalCustomerOrgRelationDetail(data: any) {
	return httpService.get(`/integrations/internalCustomerOrgRelation/detail`, {
		params: data,
	});
}

/**
 * 新增
 * @param data
 * @returns
 */
export function addInternalCustomerOrgRelation(data: any) {
	return httpService.post('/integrations/internalCustomerOrgRelation', data);
}

/**
 * 编辑
 * @param data
 * @returns
 */
export function updateInternalCustomerOrgRelation(data: any) {
	return httpService.put('/integrations/internalCustomerOrgRelation', data);
}

/**
 * 导出
 * @param params
 * @returns
 */
export function getExportInternalCustomerOrgRelation(params?: any) {
	return httpService.get('/integrations/internalCustomerOrgRelation/export', {
		params: params,
		responseType: 'blob',
	});
}
