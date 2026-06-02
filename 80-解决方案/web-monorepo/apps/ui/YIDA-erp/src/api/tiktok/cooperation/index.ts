/*
 * @Author: YIDA 3136271519@qq.com
 * @Date: 2025-08-22 18:58:38
 * @LastEditors: YIDA zhuhansong@merach.com
 * @LastEditTime: 2026-04-11 15:53:00
 * @FilePath: \qianyi-ui\src\api\tiktok\cooperation\index.ts
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
import request from '/@/utils/request';

/**
 * 分页查询
 */
export function getTikTokPage(data?: any) {
	return request({
		url: '/platform/tiktok/influencer/cooperation/page',
		method: 'post',
		data,
	});
}
/**
 * 查询进度统计
 */
export function getProgressStatistics(params?: any) {
	return request({
		url: '/platform/tiktok/influencer/cooperation/getProgressStatistics',
		method: 'get',
		params,
	});
}
/**
 * 获取详情
 */
export function getTikTokInfo(params: any) {
	return request({
		url: `/platform/tiktok/influencer/cooperation/id`,
		method: 'get',
		params,
	});
}
/**
 * 插入Tiktok达人合作信息
 */
export function postAddTikTok(data: any) {
	return request({
		url: '/platform/tiktok/influencer/cooperation/insert',
		method: 'post',
		data,
	});
}
/**
 * 更新Tiktok达人合作信息
 */
export function postUpdateTikTok(data: any) {
	return request({
		url: '/platform/tiktok/influencer/cooperation/update',
		method: 'post',
		data,
	});
}
/**
 * 删除
 */
export function postDelTikTok(data: any) {
	return request({
		url: `/platform/tiktok/influencer/cooperation/delByIds`,
		method: 'post',
		data,
	});
}
/**
 * 导出Tiktok达人合作信息
 */
export function getExportTikTok(data?: any) {
	return request({
		url: '/platform/tiktok/influencer/cooperation/export',
		method: 'post',
		data,
		responseType: 'blob',
	});
}
/**
 * 查询店铺
 */
export function getListByCondition(params?: any) {
	return request({
		url: '/admin/baseStore/getListByCondition',
		method: 'get',
		params,
	});
}
