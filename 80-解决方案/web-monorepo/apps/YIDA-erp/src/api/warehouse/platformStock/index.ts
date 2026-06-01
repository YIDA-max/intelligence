/*
 * @Author: YIDA zhuhansong@merach.com
 * @Date: 2025-11-24 11:23:17
 * @LastEditors: YIDA zhuhansong@merach.com
 * @LastEditTime: 2026-04-11 12:09:58
 * @FilePath: \qianyi-ui\src\api\warehouse\platformStock\index.ts
 * @Description:
 *
 * Copyright (c) 2026 by ${git_name_email}, All Rights Reserved.
 */
import request from '/@/utils/request';

// 分页查询
export function getAmazonStorageList(data?: object) {
	return request({
		url: '/stock/platformWarehouseStorageAmazon/page',
		method: 'post',
		data,
	});
}

// 导出
export function exportAmazonStorageList(data?: object) {
	return request({
		url: '/stock/platformWarehouseStorageAmazon/export',
		method: 'post',
		data,
		responseType: 'blob',
	});
}
