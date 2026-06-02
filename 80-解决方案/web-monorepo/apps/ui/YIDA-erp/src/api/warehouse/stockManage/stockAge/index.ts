/*
 * @Author: YIDA zhuhansong@merach.com
 * @Date: 2026-04-11 15:19:16
 * @LastEditors: YIDA zhuhansong@merach.com
 * @LastEditTime: 2026-04-11 17:34:36
 * @FilePath: \qianyi-ui\src\api\warehouse\stockManage\stockAge\index.ts
 * @Description:
 *
 * Copyright (c) 2026 by ${git_name_email}, All Rights Reserved.
 */
import { httpService } from '/@/utils/request';

/** 分页查询 */
export function getAgeListPage(data?: any) {
	return httpService.post('/stock/warehouseStockAge/page', data);
}

/** 导出 */
export function getAgeListExport(data?: any) {
	return httpService.post('/stock/warehouseStockAge/export', data, {
		responseType: 'blob',
	});
}
export function getQuanityList(data?: Object) {
	return httpService.post('/stock/warehouseStockAge/detail', data);
}
