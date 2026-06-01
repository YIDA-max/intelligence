/*
 * @Author: YIDA 3136271519@qq.com
 * @Date: 2026-01-20 10:20:57
 * @LastEditors: YIDA zhuhansong@merach.com
 * @LastEditTime: 2026-04-11 16:13:25
 * @FilePath: \qianyi-ui\src\api\board\amazon\FBAOverdueBill\index.ts
 * @Description:
 *
 * Copyright (c) 2026 by ${git_name_email}, All Rights Reserved.
 */
import { httpService } from '/@/utils/request';
/**
 * 分页查询FBA库龄账单
 * @param data
 * @returns
 */
export function getFBAOverdueBillPage(data: any) {
	return httpService.post('/stock/platformAmazonInventoryAge/page', data);
}

/**
 * 导出FBA库龄账单数据
 */
export function getExportFBAOverdueBill(data?: any) {
	return httpService.post('/stock/platformAmazonInventoryAge/export', data, {
		responseType: 'blob',
	});
}
