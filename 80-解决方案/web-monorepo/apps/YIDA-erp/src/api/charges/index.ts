/*
 * @Author: YIDA 3136271519@qq.com
 * @Date: 2025-10-18 14:35:03
 * @LastEditors: wuyueqin wuyueqin@merach.com
 * @LastEditTime: 2026-03-10 19:55:55
 * @FilePath: \qianyi-ui\src\api\charges\index.ts
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
import request from '/@/utils/request';
/**
 * 查询所有审核通过的物流渠道
 */
export function getChargesAuditAllLogistics(params: any) {
	return request({
		url: '/charges/logisticsproduct/getAuditAll',
		method: 'get',
		params,
	});
}

/**
 * 根据三方仓id获取审核通过的物流渠道列表
 */
export function getChargesByWarehouseList(warehouseId: any) {
	return request({
		url: `/charges/logisticsproduct/getAuditAll/${warehouseId}`,
		method: 'get',
	});
}
/**
 * 根据渠道id获取渠道代码,渠道类型
 */
export function getChargesProviderAndZoneList(logisticsProductId: any) {
	return request({
		url: `/charges/logisticsproduct/getProviderAndZoneList/${logisticsProductId}`,
		method: 'get',
	});
}

/**
 * 根据渠道id获取渠道代码,渠道类型-查询多个
 */
export function getChargesLogisticsChannelType(params: any) {
	return request({
		url: `/charges/logisticsproduct/logisticsChannelType`,
		method: 'get',
		params,
	});
}
