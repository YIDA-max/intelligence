import { httpService } from '/@/utils/request';

/**
 * 分页列表
 * @param params
 * @returns
 */
export function getSupplierRelationTablePage(params: any) {
	return httpService.get('/integrations/supplierRelationTable/page', {
		params,
	});
}

/**
 * 根据id获取详情
 * @param data
 * @returns
 */
export function getSupplierRelationTableDetail(data: any) {
	return httpService.get(`/integrations/supplierRelationTable/detail`, {
		params: data,
	});
}

/**
 * 新增
 * @param data
 * @returns
 */
export function addSupplierRelationTable(data: any) {
	return httpService.post('/integrations/supplierRelationTable', data);
}

/**
 * 编辑
 * @param data
 * @returns
 */
export function updateSupplierRelationTable(data: any) {
	return httpService.put('/integrations/supplierRelationTable', data);
}

/**
 * 导出
 * @param params
 * @returns
 */
export function getExportSupplierRelationTable(params?: any) {
	return httpService.get('/integrations/supplierRelationTable/export', {
		params: params,
		responseType: 'blob',
	});
}
