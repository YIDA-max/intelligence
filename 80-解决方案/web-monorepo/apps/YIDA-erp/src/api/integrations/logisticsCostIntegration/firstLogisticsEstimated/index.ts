/*
 * @Author: YIDA zhuhansong@merach.com
 * @Date: 2026-04-11 16:57:24
 * @LastEditors: YIDA zhuhansong@merach.com
 * @LastEditTime: 2026-04-11 17:04:31
 * @FilePath: \qianyi-ui\src\api\integrations\logisticsCostIntegration\firstLogisticsEstimated\index.ts
 * @Description:
 *
 * Copyright (c) 2026 by ${git_name_email}, All Rights Reserved.
 */
import { httpService } from '/@/utils/request';

// todo 接口url未对接
// 头程预估物流费用 - 列表分页（三个Tab共用，通过 status 区分：0未生成 1已生成 2生成失败）
export const getFirstLogisticsEstimatedPage = (data?: object) => {
	return httpService.post('/kingdee/transferFeeKingdee/page', data);
};

// 头程预估物流费用 - 导出
export const getFirstLogisticsEstimatedExport = (data?: object) => {
	return httpService.post('/kingdee/transferFeeKingdee/export', data, {
		responseType: 'blob',
	});
};

// 头程预估物流费用 - 生成金蝶单据
export function generateFirstLogisticsEstimatedBill(params?: {
	[key: string]: any;
}) {
	return httpService.post('/kingdee/transferFeeKingdee/pushPayable', params);
}
