/*
 * @Author: YIDA zhuhansong@merach.com
 * @Date: 2025-12-02 15:23:21
 * @LastEditors: YIDA zhuhansong@merach.com
 * @LastEditTime: 2026-04-11 17:00:02
 * @FilePath: \qianyi-ui\src\api\fbm\logisticsChannel\thirdWarehouseLogistics\index.ts
 * @Description:
 *
 * Copyright (c) 2026 by ${git_name_email}, All Rights Reserved.
 */
import request from '/@/utils/request';

// 分页
export function getLogisticsChannelList(data: any) {
	return request({
		url: '/fbm/logisticsChannel/search',
		method: 'post',
		data,
	});
}
// 详情
export function getOrderDetailByOrderNo(params: any) {
	return request({
		url: '/fbm/orderBasic/getOrderDetailByOrderNo',
		method: 'get',
		params,
	});
}
// add
export function saveLogisticsChannel(data: any) {
	return request({
		url: '/fbm/logisticsChannel/save',
		method: 'post',
		data,
	});
}
// 修改
export function updateLogisticsChannel(data: any) {
	return request({
		url: '/fbm/logisticsChannel/update',
		method: 'post',
		data,
	});
}
// 修改物流渠道状态
export function updateStatus(data: any) {
	return request({
		url: '/fbm/logisticsChannel/updateStatus',
		method: 'post',
		data,
	});
}
// 层级仓库
export function searchThirdWarehouse(params: any) {
	return request({
		url: '/fbm/logisticsChannel/searchThirdWarehouse',
		method: 'get',
		params,
	});
}
// 同步三方仓仓库信息
export function syncThirdWarehouse(params: any) {
	return request({
		url: '/fbm/logisticsChannel/syncThirdWarehouse',
		method: 'get',
		params,
	});
}
// 三方仓下拉列表
export function searchThirdWarehouseDropdown(params: any) {
	return request({
		url: '/fbm/logisticsChannel/searchThirdWarehouseDropdown',
		method: 'get',
		params,
	});
}
// 根据仓库代码集合查询启用状态的物流渠道
export function getChannelByWarehouseCodes(params: any) {
	return request({
		url: '/fbm/logisticsChannel/getByWarehouseCodes',
		method: 'get',
		params,
	});
}
