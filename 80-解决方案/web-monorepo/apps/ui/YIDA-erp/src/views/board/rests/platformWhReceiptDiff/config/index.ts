import type { Columns } from '/@/types/table';
import {
	getPlatformWhReceiptDiffPage,
	getPlatformWhReceiptDiffExport,
	updateShipmentData,
} from '/@/api/board/rests/platformWhReceiptDiff/index';

export const listApi = {
	getList: getPlatformWhReceiptDiffPage,
	exportList: getPlatformWhReceiptDiffExport,
	updateShipment: updateShipmentData,
};

export const searchConfig = [
	{
		component: 'TreeSelectInputApi',
		props: {
			componentType: 'dicts',
			settings: {
				text: '平台',
				code: 'platformChannelCodes',
				getTreeDataParams: 'platform_channel',
			},
		},
	},
	{
		component: 'TreeSelectInputApi',
		props: {
			componentType: 'dicts',
			settings: {
				text: '关联状态',
				code: 'associationStatus',
				getTreeDataParams: 'association_status',
			},
		},
	},
	{
		component: 'SelectInput',
		props: {
			searchTypes: [
				{
					label: 'Shipment ID',
					value: 'shipmentIds',
				},
				{
					label: '调拨单号',
					value: 'transferOrderNos',
				},
				{
					label: 'SKU',
					value: 'skuCodes',
				},
			],
		},
	},
	{
		component: 'SelectDate',
		props: {
			searchTypes: [
				{
					label: '货件单创建日期',
					value: 'shipmentCreateDate',
					isAddHMS: true,
					dateStart: 'shipmentCreateDateStart',
					dateEnd: 'shipmentCreateDateEnd',
				},
			],
		},
	},
];

const columns: Columns = [
	{
		type: 'checkbox',
		width: 60,
		align: 'center',
		fixed: 'left',
	},
	{
		type: 'expand',
		title: '商品详情',
		field: 'expand',
		width: 80,
		fixed: 'left',
	},
	{
		title: 'Shipment ID',
		field: 'shipmentIdTest',
		width: 180,
	},
	{
		title: '平台',
		field: 'platformTest',
		width: 120,
	},
	{
		title: '仓库代码',
		field: 'warehouseCodeTest',
		width: 150,
	},
	{
		title: '货件单状态',
		field: 'shipmentStatusTest',
		width: 150,
	},
	{
		title: '调拨单号',
		field: 'transferOrderNoTest',
		width: 180,
	},
	{
		title: '关联状态',
		field: 'associationStatusTest',
		width: 120,
	},
];

export const goodsListColumnsLeft = [
	{
		title: 'MSKU',
		field: 'mskuTest',
		width: 150,
	},
	{
		title: 'SKU',
		field: 'skuTest',
		width: 150,
	},
	{
		title: '产品名称',
		field: 'productNameTest',
		width: 200,
	},
	{
		title: '收货数量',
		field: 'receivedQuantityTest',
		width: 120,
		sortable: true,
	},
	{
		title: '发货数量',
		field: 'shippedQuantityTest',
		width: 120,
		sortable: true,
	},
	{
		title: '差异数量',
		field: 'differenceQuantityTest',
		width: 120,
		sortable: true,
	},
];

const moduleKey = 'restsPlatformWhReceiptDiff';

export { columns, moduleKey };
