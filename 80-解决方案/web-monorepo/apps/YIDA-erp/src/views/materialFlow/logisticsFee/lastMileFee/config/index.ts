/*
 * @Author: YIDA zhuhansong@merach.com
 * @Date: 2026-05-13 10:12:53
 * @LastEditors: YIDA zhuhansong@merach.com
 * @LastEditTime: 2026-05-14 16:53:42
 * @FilePath: \qianyi-ui\src\views\materialFlow\logisticsFee\lastMileFee\config\index.ts
 * @Description:
 *
 * Copyright (c) 2026 by ${git_name_email}, All Rights Reserved.
 */
/**
 * 尾程费用 — 查询表单默认值、枚举与列表列元数据（展示 label，字段名待与后端对齐）
 */

import type { Columns } from '/@/types/table';

/** BaseTable / Vxe 列配置（field 占位，可按后端对齐） */
export const columns: Columns = [
	{ type: 'checkbox', width: 48, align: 'center', fixed: 'left' },
	{ title: '平台订单号', field: 'platformOrderNo', width: 160 },
	{ title: '平台渠道', field: 'platformChannelCode', width: 120 },
	{ title: '店铺站点', field: 'storeSite', width: 180 },
	{ title: '系统订单号', field: 'selfOrderNo', width: 160 },
	{ title: '发货时间', field: 'shippingTime', width: 170, sortable: true },
	{ title: '仓库单号', field: 'warehouseOrderNo', width: 140 },
	{ title: '运单号', field: 'waybillNo', width: 140 },
	{ title: '跟踪号', field: 'logisticsTrackingNo', width: 140 },
	{ title: '物流商', field: 'logisticsProvider', width: 140 },
	{ title: '发货仓', field: 'shippingWarehouseName', width: 140 },
	{ title: '物流渠道', field: 'shippingLogisticsName', width: 140 },
	{ title: '目的国家', field: 'destinationCountry', width: 100 },
	{ title: '预估费用(原币)', field: 'estimatedFee', width: 140 },
	{ title: '实际费用(原币)', field: 'actualFee', width: 140 },
	{ title: '费用差额', field: 'difference', width: 120 },
	{ title: '汇率', field: 'exchangeRate', width: 90 },
	{ title: '实际费用录入时间', field: 'actualFeeInputTime', width: 170 },
	{ title: '同步时间', field: 'syncTime', width: 170 },
	{ title: '创建时间', field: 'actualFeeInputTime', width: 170 },
	{ title: '请款池同步标记', field: 'requestPoolSyncFlag', width: 140 },
	{ title: '操作', field: 'action', width: 200, fixed: 'right' },
];

/** 入账方式（PRD） */
export const ACCOUNTS_RECEIPT_OPTIONS = [
	{ label: '仅请付款', value: 'PAY_ONLY' },
	{ label: '仅计入费用', value: 'FEE_ONLY' },
	{ label: '仅计入成本', value: 'COST_ONLY' },
	{ label: '计入成本并请款', value: 'COST_AND_PAY' },
	{ label: '计入费用并请款', value: 'FEE_AND_PAY' },
] as const;

/** 费用分摊方式：仅实重 KG / 体积 CBM */
export const SHARE_TYPE_OPTIONS = [
	{ label: '实重(KG)', value: 1 },
	{ label: '体积(CBM)', value: 2 },
] as const;

/** 结算方式（PRD；后端字典 key 确认后可改为 TreeSelectInputApi dicts） */
export const SETTLEMENT_OPTIONS = [
	{ label: '日结', value: 'DAILY' },
	{ label: '月结', value: 'MONTHLY' },
	{ label: '双月结', value: 'BIMONTHLY' },
] as const;

/** 录入状态筛选 */
export const FEE_ENTRY_STATUS_OPTIONS = [
	{ label: '已录入', value: 1 },
	{ label: '未录入', value: 0 },
] as const;

export const moduleKey = 'logisticsFee_lastMileFee';
