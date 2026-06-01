/*
 * @Author: YIDA 3136271519@qq.com
 * @Date: 2025-07-07 10:17:26
 * @LastEditors: YIDA zhuhansong@merach.com
 * @LastEditTime: 2026-04-23 14:40:21
 * @FilePath: \qianyi-ui\src\api\admin\menu.ts
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
import request from '/@/utils/request';
import { createRateLimitQueue } from '/@/utils/rateLimitQueue';
const rateLimitQueue = createRateLimitQueue(10);
export const pageList = (params?: object) => {
	return rateLimitQueue.enqueue(async () => {
		return request({
			url: '/admin/menu/tree',
			method: 'get',
			params,
		});
	});
};

export const getObj = (obj: object) => {
	return request({
		url: `/admin/menu/details`,
		method: 'get',
		params: obj,
	});
};

export const save = (data: Object) => {
	return request({
		url: '/admin/menu',
		method: 'post',
		data: data,
	});
};
export const menuExport = (params: object) => {
	return request({
		url: '/admin/menu/export',
		method: 'get',
		params: params,
		responseType: 'blob',
	});
};

export const putObj = (data: Object) => {
	return request({
		url: '/admin/menu',
		method: 'put',
		data: data,
	});
};

export const addObj = (data: Object) => {
	return request({
		url: '/admin/menu',
		method: 'post',
		data: data,
	});
};

export const delObj = (id: string) => {
	return request({
		url: '/admin/menu/' + id,
		method: 'delete',
	});
};

/**
 * 后端控制路由，isRequestRoutes 为 true，则开启后端控制路由
 * @method getAdminMenu 获取后端动态路由菜单(admin)
 */
export function useMenuApi() {
	return {
		getAdminMenu: (params?: object) => {
			return request({
				url: '/admin/menu',
				method: 'get',
				params,
			});
		},
	};
}

export function validateExist(
	rule: any,
	value: any,
	callback: any,
	isEdit: boolean
) {
	if (isEdit) {
		return callback();
	}
	getObj({ [rule.field]: value }).then((response) => {
		const result = response.data;
		if (result !== null && result.length > 0) {
			callback(new Error('数据已经存在'));
		} else {
			callback();
		}
	});
}
/**
 * 保存或更新用户配置表头
 * @param data
 * @returns
 */
export function postSaveUserConfig(data?: object) {
	return request({
		url: '/admin/baseFieldDisplayConfig/saveUserConfig',
		method: 'post',
		data,
	});
}

/**
 * 根据菜单标识获取用户配置表头
 * @param menu
 * @returns
 */
export function getUserConfigByMenu(params: { menu: string }) {
	return request({
		url: '/admin/baseFieldDisplayConfig/getUserConfig',
		method: 'get',
		params,
	});
}
