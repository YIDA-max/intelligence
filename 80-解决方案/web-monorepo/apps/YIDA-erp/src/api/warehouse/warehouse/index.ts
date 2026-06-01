/*
 * @Author: YIDA 3136271519@qq.com
 * @Date: 2025-07-30 10:14:35
 * @LastEditors: YIDA zhuhansong@merach.com
 * @LastEditTime: 2026-04-11 15:46:29
 * @FilePath: \qianyi-ui\src\api\warehouse\warehouse\index.ts
 * @Description:
 *
 * Copyright (c) 2026 by ${git_name_email}, All Rights Reserved.
 */
import request from '/@/utils/request';
import type { IPageListResponse } from '/@/components/BaseTable/hooks/BaseTable';

// 分页查询
export function getWareHouseList(data?: object): Promise<IPageListResponse> {
	return request({
		url: '/warehouse/warehouseInfo/page',
		method: 'post',
		data,
	}) as Promise<IPageListResponse>;
}
// 启用
export function enableWareHouse(data?: any) {
	return request({
		url: '/warehouse/warehouseInfo/enable',
		method: 'post',
		data,
	});
}
// 禁用
export function disableWareHouse(data?: any) {
	return request({
		url: '/warehouse/warehouseInfo/disable',
		method: 'post',
		data,
	});
}
// 新增自营仓
export function addWarehouse(data?: any) {
	return request({
		url: '/warehouse/warehouseInfo/saveWarehouse',
		method: 'post',
		data,
		loadingConfig: {
			loading: true,
			text: '保存中...',
			background: 'rgba(255, 255, 255, 0.7)',
		},
	});
}
// 编辑自营仓
export function updateWarehouse(data?: any) {
	return request({
		url: '/warehouse/warehouseInfo/updateWarehouse',
		method: 'post',
		data,
		loadingConfig: {
			loading: true,
			text: '保存中...',
			background: 'rgba(255, 255, 255, 0.7)',
		},
	});
}
// 获取国家列表
export function getCountryList(query?: Object) {
	return request({
		url: '/admin/sysArea/list',
		method: 'get',
		params: query,
	});
}
// 编辑自营仓
export function warehouseInfo(query?: Object) {
	return request({
		url: '/warehouse/warehouseInfo/show',
		method: 'get',
		params: query,
	});
}
// 导出自营仓
export function exportWarehouseExcel(data?: Object) {
	return request({
		url: '/warehouse/warehouseInfo/exportWarehouseExcel',
		method: 'post',
		data,
		responseType: 'blob', // 设置响应类型为blob
	});
}
