/*
 * @Author: 朱寒松 3136271519@qq.com
 * @Date: 2025-07-07 16:49:25
 * @LastEditors: YIDA zhuhansong@merach.com
 * @LastEditTime: 2026-04-11 15:38:17
 * @FilePath: \qianyi-ui\src\api\product\category.ts
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
import request from '/@/utils/request';

// 修改产品类目
export function postCategoryUpdate(data?: Object) {
	return request({
		url: '/product/category/update',
		method: 'post',
		data,
	});
}
// 启用类目
export function postCategoryEnable(data?: Object) {
	return request({
		url: '/product/category/enable',
		method: 'post',
		data,
	});
}
// 停用类目
export function postCategoryDisable(data?: Object) {
	return request({
		url: '/product/category/disable',
		method: 'post',
		data,
	});
}
// 新增产品类目
export function postCategorySave(data?: Object) {
	return request({
		url: '/product/category/save',
		method: 'post',
		data,
	});
}

// 通过id删除产品类目
export function postCategoryRemove(data?: Object) {
	return request({
		url: '/product/category/remove',
		method: 'post',
		data,
	});
}

// 导入产品类目
export function postCategoryImport(data?: Object) {
	return request({
		url: '/product/category/import',
		method: 'post',
		data,
	});
}

// 类目树
export function getCategoryTree(params?: object) {
	return request({
		url: '/product/category/tree',
		method: 'get',
		params,
		debounceConfig: {
			enable: false,
			delay: 0,
		},
	});
}

// 分页查询
export function getCategoryList(data?: object) {
	return request({
		url: '/product/category/page',
		method: 'post',
		data,
	});
}

// 导入产品类目-下载错误文件
export function getCategoryFailFile(params?: object) {
	return request({
		url: '/product/category/failFile',
		method: 'get',
		params,
	});
}

// 导出产品类目-部分字段
export function getCategoryExportPart(data?: object) {
	return request({
		url: '/product/category/exportPart',
		method: 'post',
		data,
		responseType: 'blob', // 设置响应类型为blob
	});
}

// 查询产品类目
export function getCategoryDetails(params?: object) {
	return request({
		url: '/product/category/details',
		method: 'get',
		params,
	});
}

// 通过id数组删除产品类目
export function delCategory(data?: Object) {
	return request({
		url: '/product/category/details',
		method: 'delete',
		data,
	});
}

// 获取物控负责人
export function getUsersByDepartment(params?: object) {
	return request({
		url: '/product/category/getUsersByDepartment',
		method: 'get',
		params,
	});
}

//更新物控相关用户
export function postUpdateControlPerson(data?: Object) {
	return request({
		url: '/product/category/updateControlPerson',
		method: 'post',
		data: data,
	});
}
