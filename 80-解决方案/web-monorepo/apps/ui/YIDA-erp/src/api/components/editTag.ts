import request from '/@/utils/request';

/**
 * 获取标记列表
 * @param params
 * @returns
 */
export function getTagList(params: any) {
	return request({
		url: '/fbm/tag/list',
		method: 'get',
		params,
	});
}
/**
 * 标记列表(包含禁用)
 * @param params
 * @returns
 */
export function getTagAllList(params: any) {
	return request({
		url: '/fbm/tag/allList',
		method: 'get',
		params,
	});
}
/**
 *  新增标记
 * @param data
 * @returns
 */
export function postTagSave(data: any) {
	return request({
		url: '/fbm/tag/save',
		method: 'post',
		data,
	});
}
/**
 *  修改标记
 * @param data
 * @returns
 */
export function postTagUpdate(data: any) {
	return request({
		url: '/fbm/tag/update',
		method: 'post',
		data,
	});
}
/**
 *  删除标记
 * @param data
 * @returns
 */
export function postTagDelete(data: any) {
	return request({
		url: '/fbm/tag/delete',
		method: 'post',
		data,
	});
}
