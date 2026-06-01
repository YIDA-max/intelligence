/*
 * @Author: YIDA 3136271519@qq.com
 * @Date: 2026-01-15 17:50:44
 * @LastEditors: YIDA 3136271519@qq.com
 * @LastEditTime: 2026-01-26 14:33:15
 * @FilePath: \qianyi-ui\src\views\financial\other\cost\config\TableColumn.ts
 * @Description:
 *
 * Copyright (c) 2026 by ${git_name_email}, All Rights Reserved.
 */
interface ITableColumn {
	/** 表头 */
	title?: string;
	/** 字段名（需与接口返回字段一致） */
	field?: string;
	/** 列宽 */
	width?: number;
	/** 是否固定 */
	fixed?: boolean | 'left' | 'right' | false | null;
	/** 列类型 */
	type?: string;
	/** 保留选择项 */
	'reserve-selection'?: boolean;
}

const columns: ITableColumn[] = [
	{
		type: 'checkbox',
		width: 40,
	},
	{
		title: '平台',
		field: 'platformChannelCode',
		width: 150,
	},
	{
		title: '店铺',
		field: 'storeName',
		width: 150,
	},
	{
		title: '站点',
		field: 'siteName',
		width: 150,
	},
	{
		title: 'SKU',
		field: 'sku',
		width: 150,
	},
	{
		title: 'MSKU',
		field: 'msku',
		width: 150,
	},
	{
		title: '日期',
		field: 'costDate',
		width: 120,
	},
	{
		title: '采购成本',
		field: 'procurementCost',
		width: 150,
	},
	{
		title: '头程成本',
		field: 'firstLegCost',
		width: 120,
	},
	{
		title: '尾程成本',
		field: 'lastLegCost',
		width: 120,
	},
	{
		title: '平台仓仓租',
		field: 'platformWarehouseRentRate',
		width: 150,
	},
	{
		title: '海外仓仓租',
		field: 'overseasWarehouseRentRate',
		width: 150,
	},
	{
		title: '平台佣金',
		field: 'platformCommissionRate',
		width: 150,
	},
	{
		title: '平台服务费',
		field: 'platformServiceFeeRate',
		width: 150,
	},
	{
		title: '广告费（站内）',
		field: 'inSiteAdFeeRate',
		width: 150,
	},
	{
		title: '推广费（站内）',
		field: 'inSitePromotionFeeRate',
		width: 150,
	},
	{
		title: '广告费（站外）',
		field: 'outSiteAdFeeRate',
		width: 150,
	},
	{
		title: '财务费用-手续费',
		field: 'financialHandlingFeeRate',
		width: 150,
	},
	{
		title: '存货减值计提',
		field: 'inventoryImpairmentProvisionRate',
		width: 150,
	},
	{
		title: '寄样成本',
		field: 'sampleDeliveryCostRate',
		width: 150,
	},
	{
		title: '币种',
		field: 'currency',
		width: 100,
	},
];

export { columns };
