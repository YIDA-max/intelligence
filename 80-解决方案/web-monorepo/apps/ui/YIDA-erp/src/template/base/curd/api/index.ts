import { httpService } from '/@/utils/request';
/**
 * 分页列表
 * @param params
 * @returns
 */
export function getCurdPage(params: any) {
	return httpService.get('/fbm/curd/page', {
		params,
	});
}
/**
 * 根据id获取详情
 * @param data
 * @returns
 */
export function getCurdDetail(data: any) {
	return httpService.post(`/fbm/selfOrder/detail`, data);
}
/**
 * 新增
 * @param data
 * @returns
 */
export function addCurd(data: any) {
	return httpService.post('/fbm/curd', data);
}
/**
 * 编辑
 * @param data
 * @returns
 */
export function updateCurd(data: any) {
	return httpService.post('/fbm/selfOrder', data);
}
/**
 * 导出
 * @param params
 * @returns
 */
export function getExportCurd(params?: any) {
	return httpService.get('/fbm/curd/export', {
		params: params,
		responseType: 'blob',
	});
}
