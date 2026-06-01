/*
 * @Author: 朱寒松 3136271519@qq.com
 * @Date: 2025-07-07 16:49:25
 * @LastEditors: YIDA zhuhansong@merach.com
 * @LastEditTime: 2026-04-15 14:43:19
 * @FilePath: \qianyi-ui\src\api\warehouse\spInfo\index.ts
 * @Description: 产品品牌相关接口
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
import request from '/@/utils/request';

// 分页查询
export function getSpInfoList(params?: object) {
	return request({
		url: '/warehouse/spInfo/list',
		method: 'get',
		params,
		debounceConfig: {
			enable: false,
			delay: 0,
		},
	});
}

// 新增服务商
export function postSpInfoSave(data: Object) {
	return request({
		url: '/warehouse/spInfo/save',
		method: 'post',
		data,
	});
}

// 修改服务商
export function postSpInfoUpdate(data: Object) {
	return request({
		url: '/warehouse/spInfo/update',
		method: 'post',
		data,
	});
}

// 启用服务商
export function postSpInfoEnable(data: Object) {
	return request({
		url: '/warehouse/spInfo/enable',
		method: 'post',
		data,
	});
}
// 禁用服务商
export function postSpInfoDisable(data: Object) {
	return request({
		url: '/warehouse/spInfo/disable',
		method: 'post',
		data,
	});
}

// 查询可对接的服务商
export function getSpDockConfigGetSpConfigList(params?: object) {
	return request({
		url: '/warehouse/spDockConfig/getSpConfigList',
		method: 'get',
		params,
	});
}

// 根据自己的服务商ID查询服务商信息
export function getWarehouseListBySpId(params?: object) {
	return request({
		url: '/warehouse/warehouseInfo/getWarehouseListBySpId',
		method: 'get',
		params,
	});
}

// 根据服务商id获取服务商仓库列表
export function getSpWarehouseListBySpId(params?: object) {
	return request({
		url: '/warehouse/spWarehouse/getSpWarehouseListBySpId',
		method: 'get',
		params,
	});
}

// 根据服务商id获取服务商仓库列表 查询第三方
export function getSpWarehouseSyncWarehouse(params?: object) {
	return request({
		url: '/warehouse/spWarehouse/syncWarehouse',
		method: 'get',
		params,
	});
}

// 授权服务商
export function postSpInfoAuth(data: Object) {
	return request({
		url: '/warehouse/spInfo/auth',
		method: 'post',
		data,
	});
}

// 首次授权服务商快捷配对仓库
export function postSpInfoFastMapping(data: Object) {
	return request({
		url: '/warehouse/spInfo/fastMapping',
		method: 'post',
		data,
	});
}
