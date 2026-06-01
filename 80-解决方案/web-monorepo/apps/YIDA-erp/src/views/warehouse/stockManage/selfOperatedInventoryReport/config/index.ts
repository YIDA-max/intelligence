import type { Columns } from '/@/types/table';
import type { IPageListResponse } from '/@/components/BaseTable/hooks/BaseTable';
import {
	getSelfOperatedInventoryReportPage,
	postSelfOperatedInventoryReportExport,
} from '/@/api/warehouse/stockManage/selfOperatedInventoryReport/index';
import { productInfoSku } from '/@/views/integrations/components/tableRouteConfig';

export const moduleKey = 'stockManage_selfOperatedInventoryReport';
// todo 接口未对接，暂时使用第三方仓接口
export const listApi = {
	getList: getSelfOperatedInventoryReportPage as (
		_params?: any
	) => Promise<IPageListResponse>,
	exportList: postSelfOperatedInventoryReportExport,
};

export const searchConfig = [
	{
		component: 'customCascaderApi',
		props: {
			componentType: 'warehouseId',
			settings: {
				code: 'warehouseCodes',
				text: '仓库',
			},
			getDataParams: {
				warehouseTypes: ['0'],
			},
		},
	},
	{
		component: 'SelectDateDynamic',
		props: {
			searchTypes: [
				{
					label: '按月',
					value: 'month',
					dateType: 'month',
					isAddHMS: false,
					dateStart: 'start',
					dateEnd: 'end',
					autoInit: true, // 切换时自动应用默认值
				},
				{
					label: '按天',
					value: 'day',
					dateType: 'date',
					isAddHMS: false,
					dateStart: 'start',
					dateEnd: 'end',
					defaultCurrentMonth: true, // 月初到今天
					autoInit: true, // 切换时自动应用默认值
				},
			],
		},
	},
	{
		component: 'SelectInput',
		props: {
			searchTypes: [
				{ label: 'SKU', value: 'skuCodes' },
				{ label: '产品名称', value: 'skuNames' },
			],
		},
	},
];

export const columns: Columns = [
	{ title: '仓库', field: 'warehouseName', width: 150, sortable: true },
	{
		title: 'SKU',
		field: 'skuCode',
		width: 180,
		slotName: 'RowValueLink',
		slotAttrs: productInfoSku,
	},
	{ title: '产品名称', field: 'skuName', width: 200 },
	{ title: '期初库存', field: 'openingStock', width: 120, isSum: true },
	{ title: '期初在途', field: 'openingInTransit', width: 120, isSum: true },
	{ title: '采购入库', field: 'purchaseIn', width: 120, isSum: true },
	// { title: '调拨入库', field: 'allocationIn', width: 120, isSum: true },
	// {
	// 	title: '海外调拨入库',
	// 	field: 'overseasAllocationIn',
	// 	width: 120,
	// 	isSum: true,
	// },
	// { title: '库存转换入库', field: 'stockConvertIn', width: 120, isSum: true },
	// { title: '其他入库', field: 'otherIn', width: 120, isSum: true },
	// { title: '入库汇总', field: 'totalIn', width: 120, isSum: true },
	// { title: '订单出库', field: 'orderOut', width: 120, isSum: true },
	{ title: '调拨出库', field: 'allocationOut', width: 120, isSum: true },
	// {
	// 	title: '海外调拨出库',
	// 	field: 'overseasAllocationOut',
	// 	width: 120,
	// 	isSum: true,
	// },
	// { title: '库存转换出库', field: 'stockConvertOut', width: 120, isSum: true },
	// { title: '其他出库', field: 'otherOut', width: 120, isSum: true },
	// { title: '出库汇总', field: 'totalOut', width: 120, isSum: true },
	{ title: '期末库存', field: 'closingStock', width: 120, isSum: true },
	{ title: '期末在途', field: 'closingInTransit', width: 120, isSum: true },
];
