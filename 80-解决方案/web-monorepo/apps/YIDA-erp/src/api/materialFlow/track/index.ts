/*
 * @Author: YIDA zhuhansong@merach.com
 * @Date: 2025-08-05 13:50:35
 * @LastEditors: wuyueqin wuyueqin@merach.com
 * @LastEditTime: 2026-04-14 19:51:02
 * @FilePath: \qianyi-ui\src\api\materialFlow\track\index.ts
 * @Description:
 *
 * Copyright (c) 2026 by ${git_name_email}, All Rights Reserved.
 */
import request from '/@/utils/request';

// 仓库下拉列表
export function getWareHouseList(params?: object) {
	return request({
		url: '/warehouse/warehouseInfo/options',
		method: 'get',
		params,
	});
}

// 物流订单列表
export function logisticsOrderList(data?: object) {
	return request({
		url: '/tracking/logisticsOrder/page',
		method: 'post',
		data,
	});
}

// 物流订单列表
export function logisticsOrderCount(params?: object) {
	return request({
		url: '/tracking/logisticsOrder/cnt',
		method: 'get',
		params,
	});
}

// 物流渠道列表
export function logisticsCourier(params?: object) {
	return request({
		url: '/tracking/logisticsCourier/courier',
		method: 'get',
		params,
	});
}

// 物流订单列表
export function logisticsInfo(params?: string) {
	return request({
		url: `/tracking/logisticsInfo/details/${params}`,
		method: 'get',
	});
}

// 物流订单列表国家列表
type DebounceConfig = {
	delay?: number;
	enable?: boolean;
};

export function sysCountryList(
	params?: string,
	debounceConfig?: DebounceConfig
) {
	return request({
		url: `/admin/sysCountry/list`,
		method: 'get',
		params,
		debounceConfig: {
			delay: 300,
			enable: false, // 默认开启防抖
			...debounceConfig, // 传了就覆盖
		},
	});
}

// 同步物流信息
export function syncLogisticsInfo(data: {
	syncAll: boolean;
	systemOrderNos: string[];
	platform: number;
}) {
	return request({
		url: '/tracking/logisticsInfo/sync',
		method: 'post',
		data,
	});
}

// 同步物流信息
export function syncLogisticsOrder(params?: object) {
	return request({
		url: '/tracking/logisticsOrder/sync',
		method: 'put',
		data: params,
	});
}

// 同导出订单
export function exportOrder(data?: object) {
	return request({
		url: '/tracking/logisticsOrder/export',
		method: 'post',
		data,
		responseType: 'blob',
	});
}
