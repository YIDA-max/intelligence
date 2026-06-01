/*
 * @Author: YIDA 3136271519@qq.com
 * @Date: 2025-09-13 15:46:00
 * @LastEditors: YIDA zhuhansong@merach.com
 * @LastEditTime: 2026-04-11 16:44:26
 * @FilePath: \qianyi-ui\src\api\affairs\customs\clearance\index.ts
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
import request from '/@/utils/request';

/**
 * 出口报关单列表
 * */
export function getClearancePage(data?: object) {
	return request({
		url: '/affairs/clearance/page',
		method: 'post',
		data,
	});
}

/**
 * 导出
 */
export function getClearanceExport(data?: object) {
	return request({
		url: '/affairs/clearance/export',
		method: 'post',
		data,
		responseType: 'blob',
	});
}
/**
 * 导出报关模板
 */
export function postClearanceExportTemplates(data?: Object) {
	return request({
		url: '/affairs/clearance/exportTemplates',
		method: 'post',
		data,
		responseType: 'blob',
	});
}

/**
 * 设置报关单为已处理
 * @param data
 * @returns
 */
export function postProcess2Processed(data?: Object) {
	return request({
		url: '/affairs/clearance/process2Processed',
		method: 'post',
		data,
	});
}
