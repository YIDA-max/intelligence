/*
 * @Author: wuyueqin wuyueqin@merach.com
 * @Date: 2026-04-01 16:34:28
 * @LastEditors: wuyueqin wuyueqin@merach.com
 * @LastEditTime: 2026-04-23 10:51:59
 * @FilePath: \qianyi-ui\src\views\warehouse\stockManage\wfsInventoryReport\config\index.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import type { Columns } from '/@/types/table';
import type { IPageListResponse } from '/@/components/BaseTable/hooks/BaseTable';
import {
	getWfsInventoryReportPage,
	postWfsInventoryReportExport,
} from '/@/api/warehouse/stockManage/wfsInventoryReport/index';
import { productInfoSku } from '/@/views/integrations/components/tableRouteConfig';

export const moduleKey = 'stockManageWfsInventoryReport';

export const listApi = {
	getList: getWfsInventoryReportPage as (
		_params?: any
	) => Promise<IPageListResponse>,
	exportList: postWfsInventoryReportExport,
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
					platformChannelCode: 'Walmart',
					size: 5000,
					current: 1,
				},
			},
		},
	},
	{
		component: 'SelectInput',
		props: {
			searchTypes: [
				{ label: 'SKU', value: 'skuCodes' },
				{ label: 'MSKU', value: 'mskuCodes' },
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
					value: 'date',
					isAddHMS: false,
					dateStart: 'startMonth',
					dateEnd: 'endMonth',
					defaultCurrentMonth: true,
					autoInit: true,
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
		prefixObj: { field: 'storeName', connectStr: ':' },
	},
	{ title: 'MSKU', field: 'mskuCode', width: 180 },
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
	{ title: '期初库存', field: 'openingStock', width: 120, isSum: true },
	{ title: '货件收货', field: 'shipmentReceived', width: 120, isSum: true },
	{ title: '订单发货', field: 'orderShipped', width: 120, isSum: true },
	{ title: '买家退货', field: 'buyerReturn', width: 120, isSum: true },
	{ title: '丢失', field: 'lost', width: 120, isSum: true },
	{ title: '找回', field: 'recovered', width: 120, isSum: true },
	{ title: '已移除', field: 'removed', width: 120, isSum: true },
	{ title: '期末库存', field: 'closingStock', width: 120, isSum: true },
	{ title: 'ERP在途', field: 'erpInTransit', width: 120, isSum: true },
];
