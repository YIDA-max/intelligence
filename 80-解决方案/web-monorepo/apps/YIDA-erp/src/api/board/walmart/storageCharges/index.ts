/*
 * @Author: YIDA zhuhansong@merach.com
 * @Date: 2026-02-06 09:48:44
 * @LastEditors: YIDA zhuhansong@merach.com
 * @LastEditTime: 2026-04-11 16:00:37
 * @FilePath: \qianyi-ui\src\api\board\walmart\storageCharges\index.ts
 * @Description:
 *
 * Copyright (c) 2026 by ${git_name_email}, All Rights Reserved.
 */
import { httpService } from '/@/utils/request';
/**
 * 分页查询walmart仓储费
 * @param data
 * @returns
 */
export function getStorageChargesPage(data: any) {
	return httpService.post('/finance/storage-fee/walmart/page', data);
}

/**
 * 导出FBA库龄账单数据
 */
export function getExportStorageCharges(data?: any) {
	return httpService.post('/finance/storage-fee/walmart/export', data, {
		responseType: 'blob',
	});
}
