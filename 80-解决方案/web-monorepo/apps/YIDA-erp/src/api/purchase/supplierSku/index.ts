/*
 * @Author: 朱寒松 3136271519@qq.com
 * @Date: 2025-07-30 11:14:09
 * @LastEditors: wuyueqin wuyueqin@merach.com
 * @LastEditTime: 2026-05-13 18:22:40
 * @FilePath: \qianyi-ui\src\api\purchase\supplierSku\index.ts
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
import request from '/@/utils/request';
import type { IPageListResponse } from '/@/components/BaseTable/hooks/BaseTable';

// 分页查询
export function getSupplierSkuPage(data?: object): Promise<IPageListResponse> {
	return request({
		url: '/purchase/supplierSku/page',
		method: 'post',
		data,
	}) as Promise<IPageListResponse>;
}

// 获取供应商信息列表
export function getSupplierInfoList(params?: object) {
	return request({
		url: '/purchase/supplierInfo/list',
		method: 'get',
		params,
	});
}

// 启用供应商
export function postSupplierEnable(params?: object) {
	return request({
		url: '/purchase/supplierSku/enable',
		method: 'post',
		data: params,
	});
}

// 禁用供应商
export function postSupplierDisable(params?: object) {
	return request({
		url: '/purchase/supplierSku/disable',
		method: 'post',
		data: params,
	});
}

// 添加供应商
export function postSupplierSkuSave(params?: object) {
	return request({
		url: '/purchase/supplierSku/save',
		method: 'post',
		data: params,
		loadingConfig: {
			loading: true,
			text: '保存中...',
			background: 'rgba(255, 255, 255, 0.7)',
		},
	});
}

// 编辑供应商
export function postSupplierSkuUpdate(params?: object) {
	return request({
		url: '/purchase/supplierSku/update',
		method: 'post',
		data: params,
		loadingConfig: {
			loading: true,
			text: '保存中...',
			background: 'rgba(255, 255, 255, 0.7)',
		},
	});
}

// 查看供应商详情
export function getSupplierSkuDetailInfo(params?: object) {
	return request({
		url: '/purchase/supplierSku/detailInfo',
		method: 'get',
		params,
	});
}

// 删除供应商
export function postSupplierSkuDelete(params?: object) {
	return request({
		url: '/purchase/supplierSku/delete',
		method: 'post',
		data: params,
	});
}

// 导出供应商
export function getSupplierSkuExport(data?: object) {
	return request({
		url: '/purchase/supplierSku/export',
		method: 'post',
		data,
		responseType: 'blob', // 设置响应类型为 blob
	});
}

// 查询币种的数据
export function getListByCondition(params?: object) {
	return request({
		url: '/admin/baseCurrency/getListByCondition',
		method: 'get',
		params,
	});
}

/**
 * 根据skuCode批量获取开启的供应商
 * @param params
 * @returns
 */
export function getSupplierBySkuCode(params?: object) {
	return request({
		url: '/purchase/supplierSku/getSupplierBySkuCode',
		method: 'post',
		data: params,
	});
}
