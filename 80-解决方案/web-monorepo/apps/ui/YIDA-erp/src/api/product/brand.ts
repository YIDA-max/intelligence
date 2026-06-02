/*
 * @Author: 朱寒松 3136271519@qq.com
 * @Date: 2025-07-07 16:49:25
 * @LastEditors: YIDA zhuhansong@merach.com
 * @LastEditTime: 2026-04-11 15:37:57
 * @FilePath: \qianyi-ui\src\api\product\brand.ts
 * @Description: 产品品牌相关接口
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
import request from '/@/utils/request';

// 分页查询
export function getBrandList(data?: object) {
	return request({
		url: '/product/brand/page',
		method: 'post',
		data,
	});
}
// 下拉查询全部产品品牌
export function getBrandAllList(params?: object) {
	return request({
		url: '/product/brand/list',
		method: 'get',
		params,
		debounceConfig: {
			delay: 0,
			enable: false,
		},
	});
}
// 启用产品品牌
export function postBrandEnable(data?: Object) {
	return request({
		url: '/product/brand/enable',
		method: 'post',
		data,
	});
}

// 停用产品品牌
export function postBrandDisable(data?: Object) {
	return request({
		url: '/product/brand/disable',
		method: 'post',
		data,
	});
}

// 通过id删除产品品牌
export function postBrandRemove(ids?: Object) {
	return request({
		url: '/product/brand/remove',
		method: 'post',
		data: ids,
	});
}

// 新增产品品牌
export function postBrandSave(data?: Object) {
	return request({
		url: '/product/brand/save',
		method: 'post',
		data,
	});
}

// 修改产品品牌
export function postBrandUpdate(data?: Object) {
	return request({
		url: '/product/brand/update',
		method: 'post',
		data,
	});
}

// 导出产品品牌-部分字段
export function getBrandExportPart(data?: object) {
	return request({
		url: '/product/brand/exportPart',
		method: 'post',
		data,
		responseType: 'blob', // 设置响应类型为 blob
	});
}
