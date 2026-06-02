/*
 * @Author: 朱寒松 3136271519@qq.com
 * @Date: 2025-07-28 17:25:58
 * @LastEditors: 朱寒松 3136271519@qq.com
 * @LastEditTime: 2025-07-29 14:39:29
 * @FilePath: \qianyi-ui\src\api\warehouse\spSku\index.ts
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
import request from '/@/utils/request';
import type { IPageListResponse } from '/@/components/BaseTable/hooks/BaseTable';

// 分页查询
export function getSpSkuList(params?: object): Promise<IPageListResponse> {
	return request({
		url: '/warehouse/spSku/page',
		method: 'get',
		params,
	}) as Promise<IPageListResponse>;
}

// 同步三方仓SKU
export function postSynchronizeSpSku(params?: object) {
	return request({
		url: '/warehouse/spSku/sync',
		method: 'post',
		data: params,
	});
}

// 批量确认配对
export function postConfirmSpSkuMapping(data?: Object) {
	return request({
		url: '/warehouse/spSku/mapping/commit',
		method: 'post',
		data,
	});
}

// SKU列表查询可选
export function getSpSkuSelectList(params?: object) {
	return request({
		url: '/warehouse/spSku/skus/selectable',
		method: 'get',
		params,
	});
}

// 手动配对
export function postManualSpSkuMapping(data?: Object) {
	return request({
		url: '/warehouse/spSkuMapping/save/or/update',
		method: 'post',
		data,
	});
}

// 批量启动
export function postSpSkuEnable(data?: Object) {
	return request({
		url: '/warehouse/spSku/enable',
		method: 'post',
		data,
	});
}

// 批量禁用
export function postSpSkuDisable(data?: Object) {
	return request({
		url: '/warehouse/spSku/disable',
		method: 'post',
		data,
	});
}

// 批量解除配对
export function postSpSkuUnbind(data?: Object) {
	return request({
		url: '/warehouse/spSku/mapping/cancel',
		method: 'post',
		data,
	});
}

// 导出
export function getSpSkuExport(params?: object) {
	return request({
		url: '/warehouse/spSku/export',
		method: 'get',
		params,
		responseType: 'blob', // 设置响应类型为blob
	});
}

// 推送sku到三方仓
export function postPushSpSku(data?: Object) {
	return request({
		url: '/warehouse/spSku/pushSku',
		method: 'post',
		data,
	});
}
