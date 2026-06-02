/*
 * @Author: YIDA 3136271519@qq.com
 * @Date: 2025-09-19 11:23:15
 * @LastEditors: YIDA zhuhansong@merach.com
 * @LastEditTime: 2026-04-11 15:47:15
 * @FilePath: \qianyi-ui\src\api\warehouse\platformChannelWarehouse\index.ts
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
import request from '/@/utils/request';
import type { IPageListResponse } from '/@/components/BaseTable/hooks/BaseTable';

/**
 * 分页查询
 * @param params
 * @returns
 */
export function getWareHouseList(data?: object): Promise<IPageListResponse> {
	return request({
		url: '/warehouse/warehouseInfo/platformPage',
		method: 'post',
		data,
	}) as Promise<IPageListResponse>;
}
/**
 * 启用平台仓
 * @param data
 * @returns
 */
export function postEnableWareHouse(data?: any) {
	return request({
		url: '/warehouse/warehouseInfo/enablePlatform',
		method: 'post',
		data,
	});
}
/**
 * 禁用平台仓
 * @param data
 * @returns
 */
export function postDisableWareHouse(data?: any) {
	return request({
		url: '/warehouse/warehouseInfo/disablePlatform',
		method: 'post',
		data,
	});
}
/**
 * 新增平台仓
 * @param data
 * @returns
 */
export function postAddWarehouse(data?: any) {
	return request({
		url: '/warehouse/warehouseInfo/savePlatformWarehouse',
		method: 'post',
		loadingConfig: {
			loading: true,
			text: '保存中...',
			background: 'rgba(255, 255, 255, 0.7)',
		},
		data,
	});
}
/**
 * 编辑平台仓
 * @param data
 * @returns
 */
export function postUpdateWarehouse(data?: any) {
	return request({
		url: '/warehouse/warehouseInfo/updatePlatformWarehouse',
		method: 'post',
		loadingConfig: {
			loading: true,
			text: '保存中...',
			background: 'rgba(255, 255, 255, 0.7)',
		},
		data,
	});
}
/**
 * 查看平台仓详情
 * @param data
 * @returns
 */
export function getPlatformShow(params?: any) {
	return request({
		url: '/warehouse/warehouseInfo/platformShow',
		method: 'get',
		params,
	});
}
/**
 * 导出平台仓
 * @param query
 * @returns
 */
export function getExportWarehouseExcel(data?: Object) {
	return request({
		url: '/warehouse/warehouseInfo/exportPlatformWarehouseExcel',
		method: 'post',
		data,
		responseType: 'blob', // 设置响应类型为blob
	});
}
