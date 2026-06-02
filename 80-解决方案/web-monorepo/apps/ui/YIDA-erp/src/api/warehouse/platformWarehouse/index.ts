/*
 * @Author: YIDA 3136271519@qq.com
 * @Date: 2025-12-01 15:22:09
 * @LastEditors: YIDA zhuhansong@merach.com
 * @LastEditTime: 2026-04-11 15:48:22
 * @FilePath: \qianyi-ui\src\api\warehouse\platformWarehouse\index.ts
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
import { httpService } from '/@/utils/request';
import type {
	IplatformWarehouseMappingPage,
	IpagePlatformWarehouseMappingVO,
} from '/@/interface/views/warehouse/platformWarehouse/index';
export * from '/@/interface/views/warehouse/platformWarehouse/index';
/**
 * 分页查询平台仓库配对列表
 * @param params
 * @returns
 */
export function getPlatformWarehouseMappingPage(
	data: IplatformWarehouseMappingPage
) {
	return httpService.post<{
		code: number;
		data: IpagePlatformWarehouseMappingVO[];
		msg: string;
	}>('/warehouse/platformWarehouseMapping/page', data);
}
/**
 * 导出平台仓库配对列表
 * @param params
 * @returns
 */
export function getPlatformWarehouseMappingExport(
	data: IplatformWarehouseMappingPage
) {
	return httpService.post<{
		code: number;
		data: any;
		msg: string;
	}>('/warehouse/platformWarehouseMapping/export', data, {
		responseType: 'blob',
	});
}
