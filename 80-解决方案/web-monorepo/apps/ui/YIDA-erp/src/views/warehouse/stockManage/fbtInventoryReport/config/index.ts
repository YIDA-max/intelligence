/*
 * @Author: wuyueqin wuyueqin@merach.com
 * @Date: 2026-03-25 14:49:09
 * @LastEditors: wuyueqin wuyueqin@merach.com
 * @LastEditTime: 2026-04-23 10:51:46
 * @FilePath: \qianyi-ui\src\views\warehouse\stockManage\fbtInventoryReport\config\index.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import type { Columns } from '/@/types/table';
import type { IPageListResponse } from '/@/components/BaseTable/hooks/BaseTable';
import {
	getFbtInventoryReportPage,
	postFbtInventoryReportExport,
} from '/@/api/warehouse/stockManage/fbtInventoryReport/index';
import { productInfoSku } from '/@/views/integrations/components/tableRouteConfig';

export const moduleKey = 'stockManageFbtInventoryReport';

export const listApi = {
	getList: getFbtInventoryReportPage as (
		_params?: any
	) => Promise<IPageListResponse>,
	exportList: postFbtInventoryReportExport,
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
					platformChannelCode: 'Tiktok自运营',
					size: 5000,
					current: 1,
				},
			},
		},
	},
	{
		component: 'TreeSelectInputApi',
		props: {
			settings: {
				text: '库存属性',
				code: 'inventoryGoodsTypes',
			},
			options: [
				{
					label: '可售',
					value: 'NORMAL',
				},
				{
					label: '不可售',
					value: 'DEFECTIVE',
				},
			],
		},
	},
	{
		component: 'SelectInput',
		props: {
			searchTypes: [
				{ label: 'SKU', value: 'skuCodes' },
				{ label: 'MSKU', value: 'mskuCodes' },
				{ label: '商品ID', value: 'goodsIds' },
				{ label: '产品名称', value: 'skuNames' },
			],
		},
	},
	{
		component: 'SelectDate',
		props: {
			dateType: 'month',
			searchTypes: [
				{
					label: '月份',
					value: 'reportMonth',
					isAddHMS: true,
					dateStart: 'reportMonthStart',
					dateEnd: 'reportMonthEnd',
					defaultCurrentMonth: true, // 默认本月
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
	}, // 需拼接 storeName + siteCode
	{ title: 'MSKU', field: 'mskuCode', width: 180 },
	{ title: '商品ID', field: 'goodsId', width: 180 },
	{
		title: 'SKU',
		field: 'skuCode',
		width: 180,
		slotName: 'RowValueLink',
		slotAttrs: productInfoSku,
	},
	{
		title: '产品名称',
		field: 'skuName',
		width: 200,
		slotName: 'RowValueLink',
		slotAttrs: productInfoSku,
	},
	{ title: '期初库存', field: 'beginningQuantity', width: 120, isSum: true },
	{ title: '库存属性', field: 'inventoryGoodsTypeName', width: 120 },
	{ title: '货件收货', field: 'inboundQuantity', width: 120, isSum: true },
	{ title: '订单发货', field: 'consignmentQuantity', width: 120, isSum: true },
	{
		title: '买家退货',
		field: 'failedDeliveryQuantity',
		width: 120,
		isSum: true,
	},
	{
		title: '盘点',
		field: 'inventoryAdjustmentQuantity',
		width: 100,
		isSum: true,
	},
	{ title: '已移除', field: 'removedQuantity', width: 120, isSum: true },
	{ title: '仓库间转运中', field: 'transferQuantity', width: 140, isSum: true },
	{ title: '期末库存', field: 'endingQuantity', width: 120, isSum: true },
	{ title: 'ERP在途', field: 'inTransitQuantity', width: 120, isSum: true },
];
