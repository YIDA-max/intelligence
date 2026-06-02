/*
 * @Author: 朱寒松 3136271519@qq.com
 * @Date: 2025-07-28 17:25:58
 * @LastEditors: YIDA zhuhansong@merach.com
 * @LastEditTime: 2026-04-11 15:47:48
 * @FilePath: \qianyi-ui\src\api\warehouse\spInventory\index.ts
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
import request from '/@/utils/request';

// 分页查询
export function getSpInventoryList(data?: object) {
	return request({
		url: '/warehouse/spInventory/page',
		method: 'post',
		data,
	});
}

// 同步三方仓SKU
export function postSynchronizeSpInventory(params?: object) {
	return request({
		url: '/warehouse/spInventory/sync',
		method: 'post',
		data: params,
	});
}

// 导出
export function getSpInventoryExport(data?: object) {
	return request({
		url: '/warehouse/spInventory/export',
		method: 'post',
		data,
		responseType: 'blob', // 设置响应类型为blob
	});
}
