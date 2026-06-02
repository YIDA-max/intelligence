import request from '/@/utils/request';

// 分页查询
export function getTicktockStorageList(params?: object) {
	return request({
		url: '/stock/platformWarehouseStorageTiktok/page',
		method: 'get',
		params,
	});
}

// 导出
export function exportTicktockStorageList(params?: object) {
	return request({
		url: '/stock/platformWarehouseStorageTiktok/export',
		method: 'get',
		params,
		responseType: 'blob',
	});
}
