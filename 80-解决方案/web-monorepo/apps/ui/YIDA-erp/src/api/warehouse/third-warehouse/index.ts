/*
 * @Author: 朱寒松 3136271519@qq.com
 * @Date: 2025-07-07 16:49:25
 * @LastEditors: YIDA zhuhansong@merach.com
 * @LastEditTime: 2026-04-11 15:46:55
 * @FilePath: \qianyi-ui\src\api\warehouse\third-warehouse\index.ts
 * @Description: 产品品牌相关接口
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
import request from '/@/utils/request';
import type { IPageListResponse } from '/@/components/BaseTable/hooks/BaseTable';

// 分页三方仓查询
export function getThirdWarehouseList(
	data?: object
): Promise<IPageListResponse> {
	return request({
		url: '/warehouse/warehouseInfo/thirdPage',
		method: 'post',
		data,
	}) as Promise<IPageListResponse>;
}

// 三方仓详情查询
export function getThirdWarehouseThirdShow(params?: object) {
	return request({
		url: `/warehouse/warehouseInfo/thirdShow`,
		method: 'get',
		params,
	});
}

// 新增三方仓
export function postSaveThirdWarehouse(data: Object) {
	return request({
		url: '/warehouse/warehouseInfo/saveThirdWarehouse',
		method: 'post',
		data,
		loadingConfig: {
			loading: true,
			text: '保存中...',
			background: 'rgba(255, 255, 255, 0.7)',
		},
	});
}

// 修改三方仓
export function postUpdateThirdWarehouse(data: Object) {
	return request({
		url: '/warehouse/warehouseInfo/updateThirdWarehouse',
		method: 'post',
		data,
		loadingConfig: {
			loading: true,
			text: '保存中...',
			background: 'rgba(255, 255, 255, 0.7)',
		},
	});
}

// 导出三方仓
export function getExportThirdWarehouseExcel(data?: object) {
	return request({
		url: '/warehouse/warehouseInfo/exportThirdWarehouseExcel',
		method: 'post',
		data,
		responseType: 'blob',
	});
}

// 三方仓启用

export function postWarehouseInfoEnableThird(data?: Object) {
	return request({
		url: '/warehouse/warehouseInfo/enableThird',
		method: 'post',
		data,
	});
}

// 三方仓禁用

export function postWarehouseInfoDisableThird(data?: Object) {
	return request({
		url: '/warehouse/warehouseInfo/disableThird',
		method: 'post',
		data,
	});
}

// 三方仓列表查询
export function getWarehouseInfoList(params?: object) {
	return request({
		url: '/warehouse/warehouseInfo/thirdList',
		method: 'get',
		params,
		debounceConfig: {
			enable: false,
			delay: 0,
		},
	});
}
