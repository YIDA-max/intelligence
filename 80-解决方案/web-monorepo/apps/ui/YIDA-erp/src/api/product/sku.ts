/*
 * @Author: 朱寒松 3136271519@qq.com
 * @Date: 2025-07-07 16:49:25
 * @LastEditors: wuyueqin wuyueqin@merach.com
 * @LastEditTime: 2026-05-13 15:03:56
 * @FilePath: \qianyi-ui\src\api\product\sku.ts
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
import request, { httpService } from '/@/utils/request';
import type { BatchUpdateSkuDTO } from '/@/interface/views/product/sku';
import type { IPageListResponse } from '/@/components/BaseTable/hooks/BaseTable';
export * from '/@/interface/views/product/sku';

// 分页查询
export function getSkuList(data?: object): Promise<IPageListResponse> {
	return request({
		url: '/product/sku/page',
		method: 'post',
		data,
	}) as Promise<IPageListResponse>;
}

// 根据id查询sku详情
export function getSkuDetailInfo(params?: object) {
	return request({
		url: '/product/sku/detailInfo',
		method: 'get',
		params,
		loadingConfig: {
			loading: true,
		},
	});
}

// 启用SKU
export function enableSku(params?: object) {
	return request({
		url: '/product/sku/enable',
		method: 'post',
		data: params,
	});
}

// 禁用SKU
export function disableSku(params?: object) {
	return request({
		url: '/product/sku/disable',
		method: 'post',
		data: params,
	});
}

// 添加SKU
export function addSkuSave(params?: object) {
	return request({
		url: '/product/sku/save',
		method: 'post',
		data: params,
		loadingConfig: {
			loading: true,
			text: '保存中...',
			background: 'rgba(255, 255, 255, 0.7)',
		},
	});
}

// 编辑SKU
export function editSkuUpdate(params?: object) {
	return request({
		url: '/product/sku/update',
		method: 'post',
		data: params,
		loadingConfig: {
			loading: true,
			text: '保存中...',
			background: 'rgba(255, 255, 255, 0.7)',
		},
	});
}

// sku操作-关联MSKU
export function relatedMsku(params?: object) {
	return request({
		url: '/product/sku/relatedMsku',
		method: 'post',
		data: params,
		loadingConfig: {
			loading: true,
			text: '保存中...',
			background: 'rgba(255, 255, 255, 0.7)',
		},
	});
}

// sku分配运营组
export function postSkuAssignOperationGroup(params?: object) {
	return request({
		url: '/product/sku/assignOperationGroup',
		method: 'post',
		data: params,
		loadingConfig: {
			loading: true,
			text: '保存中...',
			background: 'rgba(255, 255, 255, 0.7)',
		},
	});
}

// 导出sku
export function getExportSku(data?: object) {
	return request({
		url: '/product/sku/exportPart',
		method: 'post',
		data,
		responseType: 'blob', // 设置响应类型为blob
	});
}

// 获取sku的列表,全部,keyword查询
export function getAllSkuList(params?: object) {
	return request({
		url: '/product/sku/list',
		method: 'get',
		params,
	});
}
// 获取sku的列表,根据skuCode查询
export function postGetBySkuCode(data?: Object) {
	return request({
		url: '/product/sku/webGetBySkuCode',
		method: 'post',
		data,
	});
}

/**
 * 箱规单位转换接口
 * @param params 箱规数据和单位类型
 */
export const cartonUnitConvert = (params?: object) => {
	return request({
		url: '/product/sku/carton/unit/convert',
		method: 'post',
		data: params,
	});
};

/**
 * 箱规单位转换接口
 * @param params 采购数据和单位类型
 */
export const purchaseUnitConvert = (params?: object) => {
	return request({
		url: '/product/sku/purchase/unit/convert',
		method: 'post',
		data: params,
	});
};
// 店铺/站点列表
export function getListByCondition(params?: object) {
	return request({
		url: '/admin/baseStore/getListByCondition',
		method: 'get',
		params,
	});
}
// 币种列表
export function getCurrencyOption(params?: object) {
	return request({
		url: '/admin/baseCurrency/getListByCondition',
		method: 'get',
		params,
	});
}

// 批量编辑产品图片
export function batchUpdateSkuImg(data?: Object) {
	return request({
		url: '/product/sku/batchUpdateSkuImg',
		method: 'post',
		data,
	});
}
/**
 * 批量根据sku查询详细信息
 * @param data
 * @returns
 */
export const postFetchProductSkus = (data?: object) => {
	return request({
		url: '/product/sku/fetchProductSkus',
		method: 'post',
		data,
	});
};
/**
 * 批量编辑产品
 * @param data
 * @returns
 */
export const postBatchUpdateSkus = (data: BatchUpdateSkuDTO) => {
	return httpService.post<{
		code: number;
		data: any;
		msg: string;
	}>('/product/sku/batchUpdateSku', data, {
		loadingConfig: {
			loading: true,
		},
	});
};
