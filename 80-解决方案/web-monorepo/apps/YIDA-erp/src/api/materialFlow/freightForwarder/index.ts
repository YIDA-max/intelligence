/*
 * @Author: YIDA zhuhansong@merach.com
 * @Date: 2025-09-03 09:57:16
 * @LastEditors: YIDA zhuhansong@merach.com
 * @LastEditTime: 2026-04-11 12:12:28
 * @FilePath: \qianyi-ui\src\api\materialFlow\freightForwarder\index.ts
 * @Description:
 *
 * Copyright (c) 2026 by ${git_name_email}, All Rights Reserved.
 */
import request from '/@/utils/request';

/**
 * 货代管理分页查询
 */
export function getFreightForwarderPage(data?: object) {
	return request({
		url: '/mcp/freightForwarder/page',
		method: 'post',
		data,
	});
}

/**
 * 新增货代管理
 */
export function saveFreightForwarder(data?: Object) {
	return request({
		url: '/mcp/freightForwarder/save',
		method: 'post',
		data,
	});
}

/**
 * 修改货代管理
 */
export function updateFreightForwarder(data?: Object) {
	return request({
		url: '/mcp/freightForwarder/update',
		method: 'post',
		data,
	});
}

/**
 * 修改货代管理
 */
export function freightForwarDerdetails(params?: object) {
	return request({
		url: '/mcp/freightForwarder/details',
		method: 'get',
		params,
	});
}

/**
 * 启用货代
 */
export function enableFreightForwarDer(data?: Object) {
	return request({
		url: '/mcp/freightForwarder/enable',
		method: 'post',
		data,
	});
}

/**
 * 停用货代
 */
export function disableFreightForwarDer(data?: Object) {
	return request({
		url: '/mcp/freightForwarder/disable',
		method: 'post',
		data,
	});
}

/**
 * 导出货代
 */
export function exportFreightForwarDer(data?: object) {
	return request({
		url: '/mcp/freightForwarder/export',
		method: 'post',
		data,
		responseType: 'blob',
	});
}

/**
 * 根据条件查询货代数据
 */
export function getForwarderList(params?: object) {
	return request({
		url: '/mcp/freightForwarder/getListByCondition',
		method: 'get',
		params,
	});
}
