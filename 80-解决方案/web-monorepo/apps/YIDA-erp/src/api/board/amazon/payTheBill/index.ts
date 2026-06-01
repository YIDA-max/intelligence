/*
 * @Author: YIDA 3136271519@qq.com
 * @Date: 2026-01-20 10:20:57
 * @LastEditors: YIDA zhuhansong@merach.com
 * @LastEditTime: 2026-04-11 16:14:43
 * @FilePath: \qianyi-ui\src\api\board\amazon\payTheBill\index.ts
 * @Description:
 *
 * Copyright (c) 2026 by ${git_name_email}, All Rights Reserved.
 */
import { httpService } from '/@/utils/request';
/**
 * 分页查询结算账单
 * @param data
 * @returns
 */
export function getPayTheBillPage(data: any) {
	return httpService.post('/finance/settlement-report/amazon/page', data);
}

/**
 * 导出结算账单数据
 */
export function getExportPayTheBill(data?: any) {
	return httpService.post('/finance/settlement-report/amazon/export', data, {
		responseType: 'blob',
	});
}
