import request from '/@/utils/request';
import type { IPageListResponse } from '/@/components/BaseTable/hooks/BaseTable';

/**
 * 获取销售计划列表
 */
export function salesPlanList(data?: object): Promise<IPageListResponse> {
	return request({
		url: '/mcp/rsf/salesPlan/page',
		method: 'post',
		data,
	}) as Promise<IPageListResponse>;
}
/**
 * 获取销售计划详情
 */
export function detailInfo(params?: object) {
	return request({
		url: `/mcp/rsf/salesPlan/detail`,
		method: 'get',
		params,
	});
}
/**
 * 删除销售计划
 */
export function deletePlan(params?: any) {
	return request({
		url: `/mcp/rsf/salesPlan/${params.id}`,
		method: 'delete',
	});
}
/**
 * 下载销售计划模板
 */
export function salesPlanTemp(params?: any) {
	return request({
		url: '/mcp/rsf/salesPlan/download-template',
		method: 'get',
		params,
		responseType: 'blob', // 设置响应类型为blob
	});
}

/**
 * sku基础信息导入
 */
export function skuBaseInfoImport(params?: object) {
	return request({
		url: '/mcp/rsf/skuBaseInfo/import',
		method: 'post',
		data: params,
	});
}

/**
 * 销售计划导入
 */
export function salesPlanImport(params?: object) {
	return request({
		url: '/mcp/rsf/salesPlan/import',
		method: 'post',
		data: params,
	});
}

/**
 * 审批
 */
export function approvePlan(params?: object) {
	return request({
		url: '/mcp/rsf/salesPlan/approve',
		method: 'put',
		data: params,
		loadingConfig: {
			loading: true,
			text: '保存中...',
			background: 'rgba(255, 255, 255, 0.7)',
		},
	});
}

/**
 * 导出销售计划
 */
export function exportPlan(params?: any) {
	return request({
		url: `/mcp/rsf/salesPlan/export/${params}`,
		method: 'get',
		responseType: 'blob', // 设置响应类型为blob
	});
}

/**
 * 新增计划
 */
export function addSalesPlan(params?: object) {
	return request({
		url: '/mcp/rsf/salesPlan',
		method: 'post',
		data: params,
		loadingConfig: {
			loading: true,
			text: '保存中...',
			background: 'rgba(255, 255, 255, 0.7)',
		},
	});
}

/**
 * 更新计划
 */
export function updateSalesPlan(params?: any) {
	return request({
		url: `/mcp/rsf/salesPlan/${params.id}`,
		method: 'put',
		data: params,
		loadingConfig: {
			loading: true,
			text: '保存中...',
			background: 'rgba(255, 255, 255, 0.7)',
		},
	});
}
