import request from '/@/utils/request';

// 分页查询
export function getWalmartStorageList(params?: object) {
	return request({
		url: '/stock/platformWarehouseStorageWalmart/query',
		method: 'get',
		params,
	});
}

// 导出
export function exportWalmartStorageList(params?: object) {
	return request({
		url: '/stock/platformWarehouseStorageWalmart/export',
		method: 'get',
		params,
		responseType: 'blob',
	});
}

// export function refreshSkuList(params?: object) {
// 	return request({
// 		url: '/stock/platformWarehouseStorageWalmart/refreshSku',
// 		method: 'get',
// 		params,
// 	});
// }
