/*
 * @Author: YIDA 3136271519@qq.com
 * @Date: 2025-10-17 10:22:00
 * @LastEditors: YIDA 3136271519@qq.com
 * @LastEditTime: 2025-10-17 10:55:06
 * @FilePath: \qianyi-ui\src\api\all-base-data\index.ts
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
// 国家，店铺，仓库，渠道，物流
import request from '/@/utils/request';

/**
 * 获取系统国家列表
 * @param params - 可选的查询参数，用于过滤或分页
 * @returns 返回请求结果，包含国家列表数据
 */
export function sysCountryList(params?: string) {
	return request({
		url: `/admin/sysCountry/list`, // 请求的API端点
		method: 'get', // 请求方法为GET
		params, // 请求参数
	});
}
/**
 * 根据条件查询港口列表
 */
export function getBasePortListByCondition(params?: object) {
	return request({
		url: '/admin/basePort/getListByCondition',
		method: 'get',
		params,
		debounceConfig: {
			delay: 0,
			enable: false,
		},
	});
}

/**
 * 根据国家获取省会列表
 * @param query - 可选的查询参数对象
 * @returns 返回请求Promise
 */
export function getCountryList(query?: Object) {
	return request({
		url: '/admin/sysArea/list', // 请求的API地址
		method: 'get', // 请求方法为GET
		params: query, // 请求参数
	});
}
