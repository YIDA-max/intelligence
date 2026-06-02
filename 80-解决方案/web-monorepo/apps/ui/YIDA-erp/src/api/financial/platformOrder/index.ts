/*
 * @Author: YIDA zhuhansong@merach.com
 * @Date: 2025-12-04 20:28:19
 * @LastEditors: wuyueqin wuyueqin@merach.com
 * @LastEditTime: 2026-04-13 10:47:40
 * @FilePath: \qianyi-ui\src\api\financial\platformOrder\index.ts
 * @Description:
 *
 * Copyright (c) 2026 by ${git_name_email}, All Rights Reserved.
 */
import request from '/@/utils/request';
import type { IPageListResponse } from '/@/components/BaseTable/hooks/BaseTable';

/**
 * 分页查询
 */
export function getTiktokFinalOrderPage(
	data?: any
): Promise<IPageListResponse> {
	return request({
		url: '/order/tiktokFinalOrder/page',
		method: 'post',
		data,
	}) as Promise<IPageListResponse>;
}
