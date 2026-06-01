/*
 * @Author: YIDA 3136271519@qq.com
 * @Date: 2026-01-20 10:20:57
 * @LastEditors: YIDA zhuhansong@merach.com
 * @LastEditTime: 2026-04-13 14:18:55
 * @FilePath: \qianyi-ui\src\api\financial\other\cost\index.ts
 * @Description:
 *
 * Copyright (c) 2026 by ${git_name_email}, All Rights Reserved.
 */
import { httpService } from '/@/utils/request';
/**
 * 商品成本的分页查询
 * @param data
 * @returns
 */
export function getRpaTiktokCostCalculationPage(data: any) {
	return httpService.post('/rpa/tiktokCostCalculation/search', data);
}

/**
 * 导出计算汇总数据
 */
export function getExportRpaTiktokCostCalculation(data?: any) {
	return httpService.post('/rpa/tiktokCostCalculation/export', data, {
		responseType: 'blob',
	});
}
