import { httpService } from '/@/utils/request';

/**
 * 分页列表
 * @param params
 * @returns
 */
export function getInventoryOrgRelationPage(params: any) {
	return httpService.get('/integrations/inventoryOrgRelation/page', {
		params,
	});
}

/**
 * 根据id获取详情
 * @param data
 * @returns
 */
export function getInventoryOrgRelationDetail(data: any) {
	return httpService.get(`/integrations/inventoryOrgRelation/detail`, {
		params: data,
	});
}

/**
 * 新增
 * @param data
 * @returns
 */
export function addInventoryOrgRelation(data: any) {
	return httpService.post('/integrations/inventoryOrgRelation', data);
}

/**
 * 编辑
 * @param data
 * @returns
 */
export function updateInventoryOrgRelation(data: any) {
	return httpService.put('/integrations/inventoryOrgRelation', data);
}

/**
 * 导出
 * @param params
 * @returns
 */
export function getExportInventoryOrgRelation(params?: any) {
	return httpService.get('/integrations/inventoryOrgRelation/export', {
		params: params,
		responseType: 'blob',
	});
}
