/*
 * @Author: YIDA 3136271519@qq.com
 * @Date: 2026-01-30 16:21:49
 * @LastEditors: YIDA zhuhansong@merach.com
 * @LastEditTime: 2026-04-13 14:20:33
 * @FilePath: \qianyi-ui\src\views\integrations\baseAssociationConfig\salesOrgRelation\api\index.ts
 * @Description:
 *
 * Copyright (c) 2026 by ${git_name_email}, All Rights Reserved.
 */
import { httpService } from '/@/utils/request';

/**
 * 分页列表
 * @param params
 * @returns
 */
export function getSalesOrgRelationPage(data: any) {
	return httpService.post('/kingdee/salesOrgRelation/page', data);
}

/**
 * 根据id获取详情
 * @param data
 * @returns
 */
export function getSalesOrgRelationDetail(data: any) {
	return httpService.get(`/kingdee/salesOrgRelation/detail`, {
		params: data,
	});
}

/**
 * 新增
 * @param data
 * @returns
 */
export function addSalesOrgRelation(data: any) {
	return httpService.post('/kingdee/salesOrgRelation', data);
}

/**
 * 编辑
 * @param data
 * @returns
 */
export function updateSalesOrgRelation(data: any) {
	return httpService.put('/kingdee/salesOrgRelation', data);
}

/**
 * 导出
 * @param params
 * @returns
 */
export function getExportSalesOrgRelation(params?: any) {
	return httpService.get('/kingdee/salesOrgRelation/export', {
		params: params,
		responseType: 'blob',
	});
}
