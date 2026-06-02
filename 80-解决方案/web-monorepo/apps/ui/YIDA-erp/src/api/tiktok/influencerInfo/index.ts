/*
 * @Author: YIDA 3136271519@qq.com
 * @Date: 2025-08-22 18:58:38
 * @LastEditors: YIDA zhuhansong@merach.com
 * @LastEditTime: 2026-04-11 15:52:41
 * @FilePath: \qianyi-ui\src\api\tiktok\influencerInfo\index.ts
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
import request from '/@/utils/request';

/**
 * 分页查询
 */
export function getTikTokInfoPage(data?: any) {
	return request({
		url: '/platform/tiktok/influencer/info/page',
		method: 'post',
		data,
	});
}
/**
 * 查询进度统计
 */
export function getProgressStatistics(params?: any) {
	return request({
		url: '/platform/tiktok/influencer/info/getProgressStatistics',
		method: 'get',
		params,
	});
}
/**
 * 获取详情
 */
export function getTikTokInfoInfo(params: any) {
	return request({
		url: `/platform/tiktok/influencer/info/info`,
		method: 'get',
		params,
	});
}
/**
 * 插入Tiktok达人合作信息
 */
export function postAddTikTokInfo(data: any) {
	return request({
		url: '/platform/tiktok/influencer/info/insert',
		method: 'post',
		data,
	});
}
/**
 * 更新Tiktok达人合作信息
 */
export function postUpdateTikTokInfo(data: any) {
	return request({
		url: '/platform/tiktok/influencer/info/update',
		method: 'post',
		data,
	});
}
/**
 * 删除
 */
export function postDelTikTokInfo(data: any) {
	return request({
		url: `/platform/tiktok/influencer/info/delByIds`,
		method: 'post',
		data,
	});
}
/**
 * 导出Tiktok达人合作信息
 */
export function getExportTikTokInfo(data?: any) {
	return request({
		url: '/platform/tiktok/influencer/info/export',
		method: 'post',
		data,
		responseType: 'blob',
	});
}
