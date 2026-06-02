import { httpService } from '/@/utils/request';

/**
 * 分页列表
 * @param params
 * @returns
 */
export function getProductSkuRelationPage(params: any) {
	return httpService.get('/integrations/productSkuRelation/page', {
		params,
	});
}

/**
 * 根据id获取详情
 * @param data
 * @returns
 */
export function getProductSkuRelationDetail(data: any) {
	return httpService.get(`/integrations/productSkuRelation/detail`, {
		params: data,
	});
}

/**
 * 新增
 * @param data
 * @returns
 */
export function addProductSkuRelation(data: any) {
	return httpService.post('/integrations/productSkuRelation', data);
}

/**
 * 编辑
 * @param data
 * @returns
 */
export function updateProductSkuRelation(data: any) {
	return httpService.put('/integrations/productSkuRelation', data);
}

/**
 * 导出
 * @param params
 * @returns
 */
export function getExportProductSkuRelation(params?: any) {
	return httpService.get('/integrations/productSkuRelation/export', {
		params: params,
		responseType: 'blob',
	});
}
