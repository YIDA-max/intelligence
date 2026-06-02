/*
 * @Author: 朱寒松 3136271519@qq.com
 * @Date: 2025-07-07 16:49:25
 * @LastEditors: 朱寒松 3136271519@qq.com
 * @LastEditTime: 2025-07-16 18:32:27
 * @FilePath: \qianyi-ui\src\api\product\ops.ts
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
import request from '/@/utils/request';

// 系统日志分页查询
export function getLogList(params?: object) {
	return request({
		url: '/admin/ops/log/page',
		method: 'get',
		params,
	});
}
