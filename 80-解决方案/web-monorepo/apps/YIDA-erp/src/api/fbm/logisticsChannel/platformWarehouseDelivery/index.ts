/*
 * @Author: YIDA zhuhansong@merach.com
 * @Date: 2025-12-02 15:23:21
 * @LastEditors: YIDA zhuhansong@merach.com
 * @LastEditTime: 2026-04-11 17:00:20
 * @FilePath: \qianyi-ui\src\api\fbm\logisticsChannel\platformWarehouseDelivery\index.ts
 * @Description:
 *
 * Copyright (c) 2026 by ${git_name_email}, All Rights Reserved.
 */
import request from '/@/utils/request';

// 分页
export function getPlatformWareLogisticsList(data: any) {
	return request({
		url: '/fbm/platformWareLogistics/search',
		method: 'post',
		data,
	});
}

// 启用、禁用
export function updateStatus(data: any) {
	return request({
		url: '/fbm/platformWareLogistics/updateStatus',
		method: 'post',
		data,
	});
}

// 详情
export function getPlatformWareLogisticsDetail(params: any) {
	return request({
		url: '/fbm/platformWareLogistics/detail',
		method: 'get',
		params,
	});
}

// 批量添加平台仓物流映射
export function batchSave(data: any) {
	return request({
		url: '/fbm/platformWareLogistics/mapping/batchSave',
		method: 'post',
		data,
	});
}

// 查询所有物流承运商并按平台分组
export function groupByPlatform(params: any) {
	return request({
		url: '/fbm/logisticsCarrier/groupByPlatform',
		method: 'get',
		params,
	});
}
