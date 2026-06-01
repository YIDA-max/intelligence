/*
 * @Author: 朱寒松 3136271519@qq.com
 * @Date: 2025-07-07 16:49:25
 * @LastEditors: wuyueqin wuyueqin@merach.com
 * @LastEditTime: 2026-04-13 17:46:50
 * @FilePath: \qianyi-ui\src\api\product\spu.ts
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
import request from '/@/utils/request';
import type { IPageListResponse } from '/@/components/BaseTable/hooks/BaseTable';

// 分页查询
export function getSpuList(data?: object): Promise<IPageListResponse> {
	return request({
		url: '/product/spu/page',
		method: 'post',
		data,
	}) as Promise<IPageListResponse>;
}

// 根据id查询spu详情
export function getSpuDetailsById(params?: object) {
	return request({
		url: '/product/spu/getSpuDetailsById',
		method: 'get',
		params,
	});
}

// 启用SPU
export function enableSpu(params?: object) {
	return request({
		url: '/product/spu/enable',
		method: 'post',
		data: params,
	});
}

// 禁用SPU
export function disableSpu(params?: object) {
	return request({
		url: '/product/spu/disable',
		method: 'post',
		data: params,
	});
}

// 添加SPU
export function addSpuSave(params?: object) {
	return request({
		url: '/product/spu/save',
		method: 'post',
		data: params,
		loadingConfig: {
			loading: true,
			text: '保存中...',
			background: 'rgba(255, 255, 255, 0.7)',
		},
	});
}

// 编辑SPU
export function editSpuUpdate(params?: object) {
	return request({
		url: '/product/spu/update',
		method: 'post',
		data: params,
		loadingConfig: {
			loading: true,
			text: '保存中...',
			background: 'rgba(255, 255, 255, 0.7)',
		},
	});
}

// 选择SKU
export function getChooseSku(params?: object) {
	return request({
		url: '/product/sku/chooseSkuBySpu',
		method: 'get',
		params,
	});
}

// 导出SPU
export function getExportSpu(data?: object) {
	return request({
		url: '/product/spu/export',
		method: 'post',
		data,
		responseType: 'blob', // 设置响应类型为blob
	});
}
