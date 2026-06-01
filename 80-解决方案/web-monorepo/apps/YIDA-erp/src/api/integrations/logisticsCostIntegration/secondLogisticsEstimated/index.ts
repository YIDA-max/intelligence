/*
 * @Author: YIDA zhuhansong@merach.com
 * @Date: 2026-04-11 16:57:24
 * @LastEditors: YIDA zhuhansong@merach.com
 * @LastEditTime: 2026-04-11 17:03:24
 * @FilePath: \qianyi-ui\src\api\integrations\logisticsCostIntegration\secondLogisticsEstimated\index.ts
 * @Description:
 *
 * Copyright (c) 2026 by ${git_name_email}, All Rights Reserved.
 */
import { httpService } from '/@/utils/request';

// 尾程预估物流费用 - 列表分页（三个Tab共用，通过 status 区分：0未生成 1已生成 2生成失败）
export const getSecondLogisticsEstimatedPage = (data?: object) => {
	return httpService.post('/kingdee/lastMileDeliveryIntegrationDoc/page', data);
};

// 尾程预估物流费用 - 导出
export const getSecondLogisticsEstimatedExport = (data?: object) => {
	return httpService.post(
		'/kingdee/lastMileDeliveryIntegrationDoc/export',
		data,
		{
			responseType: 'blob',
		}
	);
};

// 尾程预估物流费用 - 生成金蝶单据
export const generateSecondLogisticsEstimatedBill = (data?: {
	[key: string]: any;
}) => {
	return httpService.post(
		'/kingdee/lastMileDeliveryIntegrationDoc/pushKingdee',
		data
	);
};
