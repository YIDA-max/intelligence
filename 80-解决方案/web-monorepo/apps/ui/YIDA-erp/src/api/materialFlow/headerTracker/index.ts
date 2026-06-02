import request from '/@/utils/request';

// 发货下拉列表
export function getHeaderTrackPage(data?: object) {
	return request({
		url: '/tracking/firstMileLogistics/page',
		method: 'post',
		data,
	});
}

// 国家下拉列表
export function sysCountryList(params?: string) {
	return request({
		url: `/admin/sysCountry/list`,
		method: 'get',
		params,
	});
}

// 发货计划列表
export function getListByCondition(params?: object) {
	return request({
		url: '/admin/basePort/getListByCondition',
		method: 'get',
		params,
	});
}
export function freightForwarDerdetails(params?: object) {
	return request({
		url: '/tracking/firstMileLogistics/id',
		method: 'get',
		params,
	});
}

/**
 * 查询平台仓库列表
 * @returns
 */
export function getPlatformList(params?: object) {
	return request({
		url: '/warehouse/warehouseInfo/platformList',
		method: 'get',
		params,
		debounceConfig: {
			delay: 0,
			enable: false,
		},
	});
}

export function getThirdformList(params?: object) {
	return request({
		url: '/warehouse/warehouseInfo/thirdList',
		method: 'get',
		params,
		debounceConfig: {
			delay: 0,
			enable: false,
		},
	});
}

export function getPlatThirdformList(params?: object) {
	return Promise.all([getPlatformList(params), getThirdformList(params)]);
}

// 货代管理列表
export function getFreightForwarderListByCondition(params?: object) {
	return request({
		url: '/mcp/freightForwarder/getListByCondition',
		method: 'get',
		params,
	});
}

// 导出接口
export function getFirstMileLogistics(params?: object) {
	return request({
		url: '/tracking/firstMileLogistics/export',
		method: 'get',
		params,
		responseType: 'blob', // 设置响应类型为 blob
	});
}
/**
 * 导出物流柜信息
 * @param params - 可选参数对象，用于请求导出时的查询条件
 * @returns 返回一个 Promise，解析为服务器响应的 blob 数据
 */
export function getExportCabinet(data?: object) {
	return request({
		url: '/tracking/firstMileLogistics/exportContainer', //请求的URL路径
		method: 'post', // 请求方法为 POST
		data, // 请求参数
		responseType: 'blob', // 设置响应类型为 blob，用于处理文件下载
	});
}
/**
 * 获取导出详情数据
 * @param params - 可选参数对象，用于传递查询条件
 * @returns 返回一个Promise， resolves为响应的blob数据
 */
export function getExportDetail(data?: object) {
	return request({
		url: '/tracking/firstMileLogistics/exportDetail', // 请求的URL路径
		method: 'post', // 请求方法为 POST
		data, // 请求参数
		responseType: 'blob', // 设置响应类型为 blob，用于处理文件下载等二进制数据
	});
}

export function saveHeaderTrack(data?: Object) {
	return request({
		url: '/mcp/freightForwarder/save',
		method: 'post',
		data,
	});
}

/**
 * 修改货代管理
 */
export function updateHeaderTrack(data?: Object) {
	return request({
		url: '/tracking/firstMileLogistics/update',
		method: 'post',
		data,
	});
}

// 重新订阅
export function reSubscribe(data?: Object) {
	return request({
		url: '/tracking/firstMileLogistics/reSubscribe',
		method: 'post',
		data,
	});
}
