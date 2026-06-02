/*
 * @Author: YIDA zhuhansong@merach.com
 * @Date: 2026-05-08 10:16:47
 * @LastEditors: YIDA zhuhansong@merach.com
 * @LastEditTime: 2026-05-14 17:01:12
 * @FilePath: \qianyi-ui\src\api\materialFlow\logisticsFee\lastMileFee\index.ts
 * @Description:
 *
 * Copyright (c) 2026 by ${git_name_email}, All Rights Reserved.
 */
import { httpService } from '/@/utils/request';

/** 分页列表（默认排序：发货时间 desc 由后端或参数 descs 控制） */
export function getLastMileFeePage(data?: object) {
	return httpService.post('/mcp/last-mile/fee/page', data, {});
}

/** 尾程费用列表导出） */
export function postLastMileFeeExport(data?: object) {
	return httpService.post('/mcp/last-mile/fee/export', data, {
		responseType: 'blob',
	});
}

/** 尾程费用导出（支持批量） */
export function postLastMileFeeExportDetail(data?: object) {
	return httpService.post('/mcp/last-mile/fee/export-detail', data, {
		responseType: 'blob',
	});
}

/** 试算分摊（预览，不写库） */
export function postLastMileFeePreviewAllocation(data?: object) {
	return httpService.post('/mcp/logisticsFee/lastMile/previewAllocation', data);
}

/** 实际分摊（按订单号） */
export function postLastMileFeeShare(data?: object, orderNo?: string) {
	return httpService.post(`/mcp/last-mile/fee/share/${orderNo}`, data, {
		loadingConfig: {
			loading: true,
		},
	});
}

/** 录入提交 */
export function postLastMileFee(data?: object) {
	return httpService.post('/mcp/last-mile/fee', data);
}

/** 尾程实际费用项列表查询 */
export function getLastMileFeeList(params?: object) {
	return httpService.get('/mcp/last-mile/fee', {
		params,
	});
}

/** 尾程实际费用分摊列表查询 */
export function getLastMileFeeShareList(params?: object) {
	return httpService.get('/mcp/last-mile/fee/share', {
		params,
	});
}

/** 查询回显（按订单维度） */
export function queryLastMileFeeVOsByOrders(data?: object) {
	return httpService.post(
		'/mcp/last-mile/fee/queryLastMileFeeVOsByOrders',
		data
	);
}

/** 保存录入的实际费用并触发分摊确认（写库，名称以后端为准） */
export function postLastMileFeeSave(data?: object) {
	return httpService.post('/mcp/last-mile/fee', data);
}

/**
 * 请款池校验：是否允许修改（平台单号+系统订单号+费用项维度）
 * 返回示例：{ editable: boolean, reason?: string }
 */
export function getLastMileFeeEditableCheck(params?: object) {
	return httpService.get('/mcp/logisticsFee/lastMile/checkEditable', {
		params,
	});
}

/** 尾程费用项下拉（若后端走字典，可改为 dict key） */
export function getLastMileFeeItemOptions(params?: object) {
	return httpService.get('/mcp/logisticsFee/lastMile/feeItemOptions', {
		params,
	});
}

/** 入账方式枚举/字典（占位） */
export function getLastMileAccountsReceiptOptions(params?: object) {
	return httpService.get('/mcp/logisticsFee/lastMile/accountsReceiptOptions', {
		params,
	});
}

/** 结算方式（若后端字典化） */
export function getLastMileSettlementOptions(params?: object) {
	return httpService.get('/mcp/logisticsFee/lastMile/settlementOptions', {
		params,
	});
}

/** 已录入的实际费用行（打开弹窗回显，入参含 platformOrderNo、selfOrderNo） */
export function getLastMileFeeRows(params?: object) {
	return httpService.get('/mcp/logisticsFee/lastMile/actualFeeRows', {
		params,
	});
}
