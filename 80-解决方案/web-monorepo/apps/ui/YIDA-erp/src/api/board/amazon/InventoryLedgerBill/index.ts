/*
 * @Author: YIDA 3136271519@qq.com
 * @Date: 2026-01-20 10:20:57
 * @LastEditors: YIDA zhuhansong@merach.com
 * @LastEditTime: 2026-04-11 16:13:56
 * @FilePath: \qianyi-ui\src\api\board\amazon\InventoryLedgerBill\index.ts
 * @Description:
 *
 * Copyright (c) 2026 by ${git_name_email}, All Rights Reserved.
 */
import { httpService } from '/@/utils/request';
/**
 * 分页查询库存分类账单
 * @param data
 * @returns
 */
export function getInventoryLedgerBillPage(data: any) {
	return httpService.post('/stock/platformAmazonInventoryJxc/page', data);
}

/**
 * 导出库存分类账单数据
 */
export function getExportInventoryLedgerBill(data?: any) {
	return httpService.post('/stock/platformAmazonInventoryJxc/export', data, {
		responseType: 'blob',
	});
}
