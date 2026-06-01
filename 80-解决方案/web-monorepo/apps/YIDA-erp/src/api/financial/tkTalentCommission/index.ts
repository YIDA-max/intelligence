/*
 * @Author: YIDA zhuhansong@merach.com
 * @Date: 2025-12-04 20:28:19
 * @LastEditors: YIDA zhuhansong@merach.com
 * @LastEditTime: 2026-04-11 16:37:25
 * @FilePath: \qianyi-ui\src\api\financial\tkTalentCommission\index.ts
 * @Description:
 *
 * Copyright (c) 2026 by ${git_name_email}, All Rights Reserved.
 */
import request from '/@/utils/request';

/**
 * 分页查询
 */
export function getTiktokCreatorCommissionPage(data?: any) {
	return request({
		url: '/order/tiktokCreatorCommission/page',
		method: 'post',
		data,
	});
}
