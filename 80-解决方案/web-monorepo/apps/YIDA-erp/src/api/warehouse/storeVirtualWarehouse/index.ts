/*
 * @Author: YIDA 3136271519@qq.com
 * @Date: 2025-09-11 14:49:21
 * @LastEditors: YIDA zhuhansong@merach.com
 * @LastEditTime: 2026-04-11 15:47:37
 * @FilePath: \qianyi-ui\src\api\warehouse\storeVirtualWarehouse\index.ts
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
import request from '/@/utils/request';
import type { IPageListResponse } from '/@/components/BaseTable/hooks/BaseTable';

/**
 * 分页查询
 * */
export function getWarehouseInfoStoreList(
	data?: object
): Promise<IPageListResponse> {
	return request({
		url: '/warehouse/warehouseInfo/storeList',
		method: 'post',
		data,
	}) as Promise<IPageListResponse>;
}
