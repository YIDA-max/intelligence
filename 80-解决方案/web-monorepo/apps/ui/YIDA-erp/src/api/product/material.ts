/*
 * @Author: 朱寒松 3136271519@qq.com
 * @Date: 2025-07-08 10:04:01
 * @LastEditors: 朱寒松 3136271519@qq.com
 * @LastEditTime: 2025-07-11 17:34:42
 * @FilePath: \qianyi-ui\src\api\product\material.ts
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
import request from '/@/utils/request';

// 分页查询
export function getMaterialList(params?: object) {
	return request({
		url: '/product/material/page',
		method: 'get',
		params,
	});
}
// 分页简单查询
export function getMaterialSimpleList(params?: object) {
	return request({
		url: '/product/material/list',
		method: 'get',
		params,
	});
}
// 启用
export function enableMaterial(data: any) {
	return request({
		url: `/product/material/enable`,
		method: 'post',
		data,
	});
}

// 禁用
export function disableMaterial(data: any) {
	return request({
		url: `/product/material/disable`,
		method: 'post',
		data,
	});
}

// 新增
export function saveMaterial(data: any) {
	return request({
		url: `/product/material/save`,
		method: 'post',
		data,
	});
}
// 编辑
export function editMaterial(data: any) {
	return request({
		url: `/product/material/update`,
		method: 'post',
		data,
	});
}
// 详情
export function materialDetail(params?: object) {
	return request({
		url: `/product/material/show`,
		method: 'get',
		params,
	});
}

// 导出辅料
export function getExportMaterial(params?: object) {
	return request({
		url: '/product/material/export',
		method: 'get',
		params,
		responseType: 'blob', // 设置响应类型为blob
	});
}
