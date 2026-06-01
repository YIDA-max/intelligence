/*
 * @Author: YIDA 3136271519@qq.com
 * @Date: 2025-09-13 15:46:00
 * @LastEditors: YIDA 3136271519@qq.com
 * @LastEditTime: 2025-09-13 16:28:45
 * @FilePath: \qianyi-ui\src\api\affairs\customs\clearCustoms\index.ts
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
import request from '/@/utils/request';

/**
 * 出口清关单列表
 * */
export function getClearCustomsPage(data?: object) {
	return request({
		url: '/affairs/clearCustoms/page',
		method: 'post',
		data,
	});
}

/**
 * 导出
 */
export function getClearCustomsExport(data?: object) {
	return request({
		url: '/affairs/clearCustoms/export',
		method: 'post',
		data,
		responseType: 'blob',
	});
}

/**
 * 导出模板
 */
export function getClearCustomsExportTemplates(data?: Object) {
	return request({
		url: '/affairs/clearCustoms/exportTemplates',
		method: 'post',
		data,
		responseType: 'blob',
	});
}

/**
 * 设置清关单为已处理
 * @param data
 * @returns
 */
export function postProcess2Processed(data?: Object) {
	return request({
		url: '/affairs/clearCustoms/process2Processed',
		method: 'post',
		data,
	});
}
