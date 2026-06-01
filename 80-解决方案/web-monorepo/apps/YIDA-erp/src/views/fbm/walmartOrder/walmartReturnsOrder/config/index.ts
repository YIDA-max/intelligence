import {
	salesOrgRelation,
	stockOrgRelation,
} from '/@/views/integrations/components/tableRouteConfig';
import type { Columns } from '/@/types/table';
import {
	getWalmartOrderReturnPage,
	getWalmartOrderReturnExport,
	getWalmartOrderInfo,
} from '/@/api/fbm/walmartOrderReturn/index';

export const listApi = {
	getList: getWalmartOrderReturnPage,
	exportList: getWalmartOrderReturnExport,
	getInfo: getWalmartOrderInfo,
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
				platformChannelCode: 'Walmart',
			},
		},
	},
	// {
	// 	component: 'TreeSelectInputApi',
	// 	props: {
	// 		componentType: '',
	// 		settings: {
	// 			text: '配送方式',
	// 			code: 'orderDeliveryMethods',
	// 			getTreeData: () => {
	// 				return {
	// 					code: 0,
	// 					data: [
	// 						{ value: 1, label: '平台发货' },
	// 						{ value: 2, label: '自发货' },
	// 					],
	// 				};
	// 			},
	// 		},
	// 	},
	// },
	{
		component: 'TreeSelectInputApi',
		props: {
			componentType: 'dicts',
			settings: {
				text: '配送方式',
				code: 'orderDeliveryMethods',
				getTreeDataParams: 'order_delivery_method',
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
				getTreeDataParams: 'Walmart_return_status',
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
				getTreeDataParams: 'Walmart_return_reason',
			},
		},
	},
	{
		component: 'TreeSelectInputApi',
		props: {
			componentType: 'dicts',
			settings: {
				text: '退款渠道',
				code: 'refundChannels',
				getTreeDataParams: 'Walmart_refund_channel',
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
					label: 'MSKU',
					value: 'mskuList',
				},
				{
					label: '平台订单号',
					value: 'platformOrderNos',
				},
				{
					label: '退货订单编号(RMA)',
					value: 'returnOrderIds',
				},
				{
					label: '产品名称',
					value: 'productNames',
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
					value: 'returnTimeMarket',
					isAddHMS: true,
					dateStart: 'returnTimeMarketStart',
					dateEnd: 'returnTimeMarketEnd',
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
		title: '店铺名称',
		field: 'siteCode',
		width: 200,
		prefixObj: {
			//前缀对象
			field: 'storeName', //前缀字段
			connectStr: ':',
		},
	},
	{ title: '退货订单编号(RMA)', field: 'returnOrderId', width: 200 },
	{ title: '客户邮箱ID', field: 'customerEmailId', width: 200 },
	{ title: '买家姓名', field: 'buyerName', width: 150 },
	{ title: '平台订单号', field: 'platformOrderNo', width: 200 },
	{ title: '订单配送方式', field: 'orderDeliveryMethod', width: 160 },
	{ title: '订购时间（北京）', field: 'orderTime', width: 160 },
	{ title: '退货时间(北京)', field: 'returnTime', width: 180, sortable: true },
	{
		title: '退货时间(市场)',
		field: 'returnTimeMarket',
		width: 180,
	},
	{ title: '退货订单类型', field: 'returnOrderType', width: 160 },
	{
		title: '换货原始买家订单编号',
		field: 'exchangeOriginalOrderNo',
		width: 200,
	},
	{
		title: '退货截止时间',
		field: 'returnDeadline',
		width: 180,
		sortable: true,
	},
	{ title: '退款模式', field: 'refundMode', width: 150 },
	{ title: '退款总额', field: 'refundTotalAmount', width: 150 },
	{ title: '币种', field: 'currency', width: 100 },
];

export const goodsListColumnsLeft = [
	{ title: '退货包裹编码', field: 'returnPackageCode', width: 180 },
	{ title: '退换货订单行编号', field: 'returnOrderLineNo', width: 180 },
	{ title: '退货标签图片链接', field: 'returnLabelImageUrl', width: 220 },
	{ title: '承运商ID', field: 'carrierId', width: 150 },
	{ title: '承运商', field: 'carrierName', width: 160 },
	{ title: '服务类型', field: 'serviceType', width: 150 },
	{ title: '跟踪号', field: 'trackingNumber', width: 200 },
	{
		title: '退货订单行编号',
		field: 'returnOrderLineNo',
		width: 100,
	},

	{
		title: '销售订单行编号',
		field: 'salesOrderLineNo',
		width: 150,
	},
	{
		title: '退货原因',
		field: 'returnReason',
		width: 100,
	},
	{
		title: '退货描述',
		field: 'returnDescription',
		width: 200,
		sortable: true,
	},
	{
		title: '产品名称',
		field: 'systemSkuName',
		width: 200,
	},
	{
		title: 'MSKU',
		field: 'msku',
		width: 200,
	},
	{
		title: '商品名称',
		field: 'productName',
		width: 150,
	},
	{
		title: '商品状况',
		field: 'productCondition',
		width: 150,
	},
	{
		title: 'SKU',
		field: 'sku',
		width: 200,
	},
	{
		title: '单位税费',
		field: 'unitTax',
		width: 150,
	},
	{
		title: '商品单价',
		field: 'unitPrice',
		width: 150,
	},
	// {
	// 	title: '费用明细',
	// 	field: 'feeDetails',
	// 	width: 150,
	// },
	{
		title: '退货配送状态',
		field: 'returnDeliveryStatus',
		width: 200,
	},
	{
		title: '退款状态',
		field: 'refundStatus',
		width: 150,
	},
	{
		title: '退款渠道',
		field: 'refundChannel',
		width: 150,
	},
	{
		title: '数量',
		field: 'quantity',
		width: 200,
	},
	{
		title: '已退款的数量',
		field: 'refundedQuantity',
		width: 200,
	},
	{
		title: '未退数量',
		field: 'cancelQuantity',
		width: 200,
	},
	{
		title: '退货状态',
		field: 'returnStatus',
		width: 150,
	},
];

const moduleKey = 'walmartReturnsOrder';

export { columns, moduleKey };
