/*
 * @Author: YIDA 3136271519@qq.com
 * @Date: 2025-09-16 09:54:54
 * @LastEditors: YIDA zhuhansong@merach.com
 * @LastEditTime: 2026-04-11 15:59:38
 * @FilePath: \qianyi-ui\src\api\materialFlow\nextLogistics\index.ts
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
import request from '/@/utils/request';

/**
 * 获取二程物流列表
 * @param params
 * @returns
 */
export function getSecondMileLogisticsPage(data?: object) {
	return request({
		url: '/tracking/SecondMileLogistics/page',
		method: 'post',
		data,
	});
}
/**
 * 导出二程物流列表
 * @param params
 * @returns
 */
export function getSecondMileLogisticsExport(params?: object) {
	return request({
		url: '/tracking/SecondMileLogistics/export',
		method: 'get',
		params,
		responseType: 'blob',
	});
}

/**
 * 导出二程物流柜子信息
 * @param params - 可选的查询参数对象
 * @returns 返回一个Promise，解析为服务器响应的二进制数据(blob格式)
 */
export function getSecondMileLogisticsExportContainer(data?: object) {
	return request({
		url: '/tracking/SecondMileLogistics/exportContainer', // 请求的URL路径
		method: 'post', // HTTP请求方法为POST
		data,
		responseType: 'blob', // 设置响应数据类型为二进制流
	});
}
/**
 * 导出二程物流明细
 * @param params - 可选的查询参数对象
 * @returns 返回一个Promise， resolves为二程物流详情的Blob数据
 */
export function getSecondMileLogisticsExportDetail(data?: object) {
	return request({
		url: '/tracking/SecondMileLogistics/exportDetail', // 请求的API端点
		method: 'post', // 请求方法为POST
		data, // 请求参数
		responseType: 'blob', // 指定响应数据类型为Blob，用于处理文件下载
	});
}

/**
 * 根据id获取二程信息
 * @param params
 * @returns
 */
export function getSecondMileLogisticsById(params?: object) {
	return request({
		url: '/tracking/SecondMileLogistics/id',
		method: 'get',
		params,
	});
}
/**
 * 更新二程信息
 * @param data
 * @returns
 */
export function postSecondMileLogisticsUpdate(data?: Object) {
	return request({
		url: '/tracking/SecondMileLogistics/update',
		method: 'post',
		data,
	});
}
