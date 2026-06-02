import { httpService } from '/@/utils/request';

/**
 * 分页列表
 * @param params
 * @returns
 */
export function getPurchaseOrgRelationPage(params: any) {
	return httpService.get('/integrations/purchaseOrgRelation/page', {
		params,
	});
}

/**
 * 根据id获取详情
 * @param data
 * @returns
 */
export function getPurchaseOrgRelationDetail(data: any) {
	return httpService.get(`/integrations/purchaseOrgRelation/detail`, {
		params: data,
	});
}

/**
 * 新增
 * @param data
 * @returns
 */
export function addPurchaseOrgRelation(data: any) {
	return httpService.post('/integrations/purchaseOrgRelation', data);
}

/**
 * 编辑
 * @param data
 * @returns
 */
export function updatePurchaseOrgRelation(data: any) {
	return httpService.put('/integrations/purchaseOrgRelation', data);
}

/**
 * 导出
 * @param params
 * @returns
 */
export function getExportPurchaseOrgRelation(params?: any) {
	return httpService.get('/integrations/purchaseOrgRelation/export', {
		params: params,
		responseType: 'blob',
	});
}
