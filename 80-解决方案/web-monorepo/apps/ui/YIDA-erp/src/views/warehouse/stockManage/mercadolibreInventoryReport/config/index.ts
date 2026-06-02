import type { Columns } from '/@/types/table';
import type { IPageListResponse } from '/@/components/BaseTable/hooks/BaseTable';
import {
	getMercadolibreInventoryReportPage,
	postMercadolibreInventoryReportExport,
	MERCADOLIBRE_IMPORT_URL,
	MERCADOLIBRE_TEMPLATE_URL,
} from '/@/api/warehouse/stockManage/mercadolibreInventoryReport/index';
import { productInfoSku } from '/@/views/integrations/components/tableRouteConfig';

export const moduleKey = 'stockManage_mercadolibreInventoryReport';

export const importConfig = {
	TEMPLATE_URL: MERCADOLIBRE_TEMPLATE_URL,
	IMPORT_URL: MERCADOLIBRE_IMPORT_URL,
};

export const listApi = {
	getList: getMercadolibreInventoryReportPage as (
		_params?: any
	) => Promise<IPageListResponse>,
	exportList: postMercadolibreInventoryReportExport,
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
					platformChannelCode: 'Mercadolibre',
					size: 5000,
					current: 1,
				},
			},
		},
	},
	{
		component: 'SelectDate',
		props: {
			dateType: 'month',
			searchTypes: [
				{
					label: '月份',
					value: 'month',
					isAddHMS: false,
					dateStart: 'startMonth',
					dateEnd: 'endMonth',
					defaultCurrentMonth: true,
					autoInit: true,
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
				{ label: '产品名称', value: 'skuNames' },
			],
		},
	},
];

export const columns: Columns = [
	{ title: '仓库', field: 'warehouseName', width: 150, sortable: true },
	{
		title: '店铺：站点',
		field: 'siteCode',
		width: 180,
		prefixObj: { field: 'storeName', connectStr: '：' },
	},
	{
		title: 'MSKU',
		field: 'mskuCode',
		width: 180,
		slotName: 'RowValueLink',
		slotAttrs: productInfoSku,
	},
	{
		title: 'SKU',
		field: 'skuCode',
		width: 180,
		slotName: 'RowValueLink',
		slotAttrs: productInfoSku,
	},
	{ title: '产品名称', field: 'skuName', width: 200 },
	{ title: '期初库存', field: 'openingStock', width: 120, isSum: true },
	{ title: '货件收货', field: 'shipmentReceived', width: 120, isSum: true },
	{ title: '订单发货', field: 'orderShipped', width: 120, isSum: true },
	{ title: '买家退货', field: 'buyerReturn', width: 120, isSum: true },
	{ title: '期末库存', field: 'closingStock', width: 120, isSum: true },
	{ title: 'ERP在途', field: 'erpInTransit', width: 120, isSum: true },
];
