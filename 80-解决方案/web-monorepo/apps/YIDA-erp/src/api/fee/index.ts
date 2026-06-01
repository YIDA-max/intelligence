/*
 * @Author: YIDA 3136271519@qq.com
 * @Date: 2025-09-29 15:50:19
 * @LastEditors: YIDA 3136271519@qq.com
 * @LastEditTime: 2025-10-18 14:35:09
 * @FilePath: \qianyi-ui\src\api\fee\index.ts
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
import request from '/@/utils/request';

/**
 * 查询费用系统的仓库
 * @param params
 * @returns
 */
export function getFeeWarehouseBaseList(params: any) {
	return request({
		url: '/fee/warehouse/getAllEnable',
		method: 'get',
		params,
	});
}
