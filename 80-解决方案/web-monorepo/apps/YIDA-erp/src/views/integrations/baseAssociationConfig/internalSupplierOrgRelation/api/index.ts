import { httpService } from '/@/utils/request';

/**
 * 分页列表
 * @param params
 * @returns
 */
export function getInternalSupplierOrgRelationPage(params: any) {
	return httpService.get('/integrations/internalSupplierOrgRelation/page', {
		params,
	});
}

/**
 * 根据id获取详情
 * @param data
 * @returns
 */
export function getInternalSupplierOrgRelationDetail(data: any) {
	return httpService.get(`/integrations/internalSupplierOrgRelation/detail`, {
		params: data,
	});
}

/**
 * 新增
 * @param data
 * @returns
 */
export function addInternalSupplierOrgRelation(data: any) {
	return httpService.post('/integrations/internalSupplierOrgRelation', data);
}

/**
 * 编辑
 * @param data
 * @returns
 */
export function updateInternalSupplierOrgRelation(data: any) {
	return httpService.put('/integrations/internalSupplierOrgRelation', data);
}

/**
 * 导出
 * @param params
 * @returns
 */
export function getExportInternalSupplierOrgRelation(params?: any) {
	return httpService.get('/integrations/internalSupplierOrgRelation/export', {
		params: params,
		responseType: 'blob',
	});
}
