/*
 * @Author: wuyueqin wuyueqin@merach.com
 * @Date: 2026-03-25 14:56:33
 * @LastEditors: wuyueqin wuyueqin@merach.com
 * @LastEditTime: 2026-04-23 10:51:52
 * @FilePath: \qianyi-ui-copy\src\views\warehouse\stockManage\fbaInventoryReport\config\index.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import type { Columns } from '/@/types/table';
import type { IPageListResponse } from '/@/components/BaseTable/hooks/BaseTable';
import {
	getFbaInventoryReportPage,
	postFbaInventoryReportExport,
} from '/@/api/warehouse/stockManage/fbaInventoryReport/index';
import { productInfoSku } from '/@/views/integrations/components/tableRouteConfig';

export const moduleKey = 'stockManageFbaInventoryReport';

export const listApi = {
	getList: getFbaInventoryReportPage as (
		_params?: any
	) => Promise<IPageListResponse>,
	exportList: postFbaInventoryReportExport,
};

export const searchConfig = [
	{
		component: 'TreeSelectInputApi',
		props: {
			componentType: 'warehouseInfo',
			settings: {
				code: 'warehouseCodes',
				text: '仓库',
				getTreeDataParams: {
					platformChannelCode: 'Amazon',
					size: 5000,
					current: 1,
				},
			},
		},
	},
	{
		component: 'TreeSelectInputApi',
		props: {
			componentType: 'dicts',
			settings: {
				text: '库存属性',
				code: 'dispositions',
				getTreeDataParams: 'Amazon_Disposition',
			},
		},
	},
	{
		component: 'SelectInput',
		props: {
			searchTypes: [
				{ label: 'SKU', value: 'skuCodes' },
				{ label: 'MSKU', value: 'mskuCodes' },
				{ label: 'ASIN', value: 'asins' },
				{ label: '产品名称', value: 'skuNames' },
			],
		},
	},
	{
		component: 'SelectDateDynamic',
		props: {
			dateType: 'month',
			searchTypes: [
				{
					label: '月份',
					value: 'month',
					dateType: 'month',
					isAddHMS: false,
					dateStart: 'startMonth',
					dateEnd: 'endMonth',
					defaultMonthsAgo: 1,
					autoInit: true, // 自动初始化到 queryForm
				},
			],
		},
	},
];

export const columns: Columns = [
	// { type: 'checkbox', width: 60, align: 'center', fixed: 'left' },
	{ title: '仓库', field: 'warehouseName', width: 150 },
	{
		title: '店铺站点',
		field: 'siteCode',
		width: 180,
		prefixObj: { field: 'storeName' },
	},
	{
		title: 'SKU',
		field: 'skuCode',
		width: 180,
		slotName: 'RowValueLink',
		slotAttrs: productInfoSku,
	},
	{
		title: '产品名称',
		field: 'productName',
		width: 200,
		slotName: 'RowValueLink',
		slotAttrs: productInfoSku,
	},
	{ title: 'MSKU', field: 'mskuCode', width: 180 },
	{ title: 'ASIN', field: 'asin', width: 180 },
	{ title: 'FNSKU', field: 'fnsku', width: 180 },
	{ title: '库存属性', field: 'disposition', width: 180 },
	{ title: '期初库存', field: 'openingStock', width: 120, isSum: true },
	{
		title: '期初库存(含转运中)',
		field: 'openingStockWithTransit',
		width: 120,
		isSum: true,
	},
	{ title: '货件收货', field: 'shipmentReceived', width: 120, isSum: true },
	{ title: '订单发货', field: 'orderShipped', width: 120, isSum: true },
	{ title: '买家退货', field: 'buyerReturn', width: 120, isSum: true },
	{ title: '找回', field: 'recovered', width: 120, isSum: true },
	{ title: '丢失', field: 'lost', width: 120, isSum: true },
	{ title: '损坏', field: 'damaged', width: 120, isSum: true },
	{ title: '弃置', field: 'disposed', width: 120, isSum: true },
	{ title: '其他', field: 'other', width: 120, isSum: true },
	{ title: '已移除', field: 'removed', width: 120, isSum: true },
	{
		title: '仓库转入/转出',
		field: 'warehouseTransfer',
		width: 140,
		isSum: true,
	},
	{
		title: '仓库间转运中',
		field: 'warehouseTransiting',
		width: 140,
		isSum: true,
	},
	{ title: '未知事件', field: 'unknownEvent', width: 120, isSum: true },
	{ title: '期末库存', field: 'closingStock', width: 120, isSum: true },
	{
		title: '期末库存(含转运中)',
		field: 'closingStockWithTransit',
		width: 120,
		isSum: true,
	},
	{ title: 'ERP在途', field: 'erpInTransit', width: 120, isSum: true },
];
