import { productInfoSku } from '/@/views/integrations/components/tableRouteConfig';
import {
	getAmazonOrderReturnPage,
	getAmazonOrderReturnExport,
} from '/@/api/fbm/amazonOrderReturn/index';

export const listApi = {
	getList: getAmazonOrderReturnPage,
	exportList: getAmazonOrderReturnExport,
};

export const searchConfig = [
	{
		component: 'customCascaderApi',
		props: {
			componentType: 'siteStoreId',
			settings: {
				code: 'storeIds',
			},
			getDataParams: {
				platformChannelCode: 'Amazon',
			},
		},
	},
	{
		component: 'TreeSelectInputApi',
		props: {
			componentType: 'dicts',
			settings: {
				text: '退货原因',
				code: 'returnReasons',
				getTreeDataParams: 'Amazon_fba_return_reason',
			},
		},
	},

	{
		component: 'TreeSelectInputApi',
		props: {
			componentType: 'dicts',
			settings: {
				text: '退货状态',
				code: 'returnStatuses',
				getTreeDataParams: 'Amazon_fba_return_status',
			},
		},
	},
	{
		component: 'TreeSelectInputApi',
		props: {
			componentType: 'dicts',
			settings: {
				text: '库存属性',
				code: 'stockAttributes',
				getTreeDataParams: 'Amazon_fba_inventory_attr',
			},
		},
	},
	{
		component: 'SelectInput',
		props: {
			searchTypes: [
				{
					label: 'SKU',
					value: 'skuList',
				},
				{
					label: 'ASIN',
					value: 'asins',
				},
				{
					label: 'MSKU',
					value: 'mskuList',
				},
				{
					label: '亚马逊订单编号',
					value: 'amazonOrderIds',
				},
				{
					label: '卖家订单编号',
					value: 'sellerOrderIds',
				},
				{
					label: '产品名称',
					value: 'productNames',
				},
				{
					label: 'FNSKU',
					value: 'fnskuList',
				},
				{
					label: 'LPN',
					value: 'lpnList',
				},
			],
		},
	},
	{
		component: 'SelectDate',
		props: {
			searchTypes: [
				{
					label: '退货时间(北京)',
					value: 'returnTime',
					isAddHMS: true,
					dateStart: 'returnTimeStart',
					dateEnd: 'returnTimeEnd',
				},
				{
					label: '退货时间(市场)',
					value: 'originReturnTime',
					isAddHMS: true,
					dateStart: 'originReturnTimeStart',
					dateEnd: 'originReturnTimeEnd',
				},
				{
					label: '订购时间',
					value: 'orderTime',
					isAddHMS: true,
					dateStart: 'orderTimeStart',
					dateEnd: 'orderTimeEnd',
				},
			],
		},
	},
];
const columns = [
	{
		type: 'checkbox',
		width: 60,
		align: 'center',
		fixed: 'left',
	},
	{
		title: '店铺名称：站点',
		field: 'siteCode',
		width: 200,
		prefixObj: {
			field: 'storeName',
			connectStr: ':',
		},
	},
	{
		title: '亚马逊订单编号',
		field: 'amazonOrderId',
		width: 180,
	},
	{
		title: '商品标题/ASIN/MSKU',
		field: 'productTitleAsinMsku',
		width: 250,
	},
	{
		title: '产品名称/SKU',
		field: 'skuNameCode',
		width: 220,
	},
	{
		title: '卖家订单编号',
		field: 'sellerOrderId',
		width: 180,
	},
	{
		title: 'FNSKU',
		field: 'fnsku',
		width: 150,
	},
	{
		title: '订购时间（北京时间）',
		field: 'orderTimeBeijing',
		width: 180,
		sortable: true,
	},
	{
		title: '退货时间（北京时间）',
		field: 'returnTimeBeijing',
		width: 180,
		sortable: true,
	},
	{
		title: '退货时间（市场时间）',
		field: 'returnTime',
		width: 180,
		sortable: true,
	},
	{
		title: '退货数量',
		field: 'returnQuantity',
		width: 120,
	},
	{
		title: '运营中心',
		field: 'operationCenter',
		width: 150,
	},
	{
		title: '库存属性',
		field: 'stockAttribute',
		width: 150,
	},
	{
		title: '退货原因',
		field: 'returnReason',
		width: 180,
		sortable: true,
	},
	{
		title: '退货状态',
		field: 'returnStatus',
		width: 150,
	},
	{
		title: '买家备注',
		field: 'buyerRemark',
		width: 200,
		sortable: true,
	},
	{
		title: 'LPN',
		field: 'lpn',
		width: 150,
	},
];
const moduleKey = 'fbaReturnsOrder';

export { columns, moduleKey };
