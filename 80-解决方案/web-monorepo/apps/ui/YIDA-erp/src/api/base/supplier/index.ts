/*
 * @Author: YIDA 3136271519@qq.com
 * @Date: 2025-09-23 10:19:44
 * @LastEditors: YIDA zhuhansong@merach.com
 * @LastEditTime: 2026-04-11 12:14:04
 * @FilePath: \qianyi-ui\src\api\base\supplier\index.ts
 * @Description:
 *
 * Copyright (c) 2026 by ${git_name_email}, All Rights Reserved.
 */
/*
 * @Author: YIDA 3136271519@qq.com
 * @Date: 2025-09-23 10:19:44
 * @LastEditors: YIDA 3136271519@qq.com
 * @LastEditTime: 2026-01-05 15:31:17
 * @FilePath: \qianyi-ui\src\api\base\supplier\index.ts
 * @Description:
 *
 * Copyright (c) 2026 by ${git_name_email}, All Rights Reserved.
 */
import request from '/@/utils/request';

// 分页查询
export function getSupplierInfoPage(data?: object) {
	return request({
		url: '/purchase/supplierInfo/page',
		method: 'post',
		data,
	});
}
// 获取供应商列表
export function getDetailInfo(params?: object) {
	return request({
		url: '/purchase/supplierInfo/detailInfo',
		method: 'get',
		params,
	});
}
// add供应商
export function saveSupplierInfo(data?: Object) {
	return request({
		url: '/purchase/supplierInfo/save',
		method: 'post',
		data,
		loadingConfig: {
			loading: true,
			text: '保存中...',
			background: 'rgba(255, 255, 255, 0.7)',
		},
	});
}
// 编辑供应商
export function updateSupplierInfo(data?: Object) {
	return request({
		url: '/purchase/supplierInfo/update',
		method: 'post',
		data,
		loadingConfig: {
			loading: true,
			text: '保存中...',
			background: 'rgba(255, 255, 255, 0.7)',
		},
	});
}
// 启用
export function openStatus(data?: Object) {
	return request({
		url: '/purchase/supplierInfo/open',
		method: 'post',
		data,
	});
}
// 禁用
export function closeStatus(data?: Object) {
	return request({
		url: '/purchase/supplierInfo/close',
		method: 'post',
		data,
	});
}
// 删除
export function deleteSupplier(data?: Object) {
	return request({
		url: '/purchase/supplierInfo/delete',
		method: 'post',
		data,
	});
}
// 变更采购员
export function updatePurchaseUser(data?: Object) {
	return request({
		url: '/purchase/supplierInfo/updatePurchaseUser',
		method: 'post',
		data,
	});
}
// 导出
export function exportSupplierInfo(data?: object) {
	return request({
		url: '/purchase/supplierInfo/export',
		method: 'post',
		data,
		responseType: 'blob',
	});
}
