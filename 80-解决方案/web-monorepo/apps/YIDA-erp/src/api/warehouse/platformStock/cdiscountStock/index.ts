import request from '/@/utils/request';

// 分页查询
export function getCdiscountStorageList(params?: object) {
	return request({
		url: '/stock/platformWarehouseStorageCdiscount/findListByPage',
		method: 'get',
		params,
	});
}

// 导出
export function exportCdiscountStorageList(params?: object) {
	return request({
		url: '/stock/platformWarehouseStorageCdiscount/export',
		method: 'get',
		params,
		responseType: 'blob',
	});
}
