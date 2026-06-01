import {
	salesOrgRelation,
	stockOrgRelation,
} from '/@/views/integrations/components/tableRouteConfig';
import type { Columns } from '/@/types/table';
import {
	getTiktokOrderReturnPage,
	getTiktokOrderReturnExport,
	getTiktokOrderInfo,
} from '/@/api/fbm/tiktokOrderReturn/index';

export const listApi = {
	getList: getTiktokOrderReturnPage,
	exportList: getTiktokOrderReturnExport,
	getInfo: getTiktokOrderInfo,
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
				platformChannelCode: 'Tiktok自运营',
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
				text: '退货类型',
				code: 'returnTypes',
				getTreeDataParams: 'TK_return_type',
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
				getTreeDataParams: 'TK_return_status',
			},
		},
	},
	{
		component: 'TreeSelectInputApi',
		props: {
			componentType: 'dicts',
			settings: {
				text: '仲裁状态',
				code: 'arbitrationStatuses',
				getTreeDataParams: 'TK_arbitration_status',
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
					label: '退货ID',
					value: 'returnIds',
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
					label: '创建时间',
					value: 'createTime',
					isAddHMS: true,
					dateStart: 'createTimeStart',
					dateEnd: 'createTimeEnd',
				},
				{
					label: '退款/退货时间(北京)',
					value: 'refundTime',
					isAddHMS: true,
					dateStart: 'refundTimeStart',
					dateEnd: 'refundTimeEnd',
				},
				{
					label: '退款/退货时间(市场)',
					value: 'refundTimeMarket',
					isAddHMS: true,
					dateStart: 'refundTimeMarketStart',
					dateEnd: 'refundTimeMarketEnd',
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
		title: '店铺名称：站点',
		field: 'siteCode',
		width: 200,
		prefixObj: {
			//前缀对象
			field: 'storeName', //前缀字段
			connectStr: ':',
		},
	},
	{ title: '平台订单号', field: 'platformOrderNo', width: 180 },
	{ title: '订单配送方式', field: 'orderDeliveryMethod', width: 160 },

	{
		title: '订购时间（北京）',
		field: 'orderTimeBeijing',
		width: 180,
		sortable: true,
	},
	// { title: '订购数量', field: 'orderQuantity', width: 120 },
	{ title: '退货ID', field: 'returnId', width: 180 },
	{ title: '退货类型', field: 'returnType', width: 150 },
	{ title: '退货状态', field: 'returnStatus', width: 150 },
	{ title: '仲裁状态', field: 'arbitrationStatus', width: 150 },
	{ title: '发起方', field: 'initiator', width: 120 },
	{ title: '退货原因', field: 'returnReason', width: 180 },
	{ title: '退货原因（本地语言）', field: 'returnReasonLocal', width: 180 },
	{ title: '退货发货方式', field: 'returnShippingMethod', width: 160 },
	{ title: '退货收货方式', field: 'returnReceivingMethod', width: 160 },
	{ title: '跟踪号', field: 'trackingNo', width: 180 },
	{ title: '物流服务商', field: 'logisticsProvider', width: 160 },
	{ title: '服务商ID', field: 'providerId', width: 150 },
	{ title: '修改前退货ID', field: 'previousReturnId', width: 180 },
	{ title: '修改后退货ID', field: 'modifiedReturnId', width: 180 },
	{ title: '是否保留商品', field: 'keepProduct', width: 140 },
	{ title: '更新时间', field: 'updateAt', width: 180, sortable: true },
	{ title: '商家下一步操作', field: 'sellerNextAction', width: 180 },
	{
		title: '商家下一步操作的最后期限',
		field: 'sellerActionDeadline',
		width: 200,
	},
	{ title: '退货申请时间', field: 'createAt', width: 180, sortable: true },
	{ title: '退款总金额', field: 'refundTotalAmount', width: 160 },
	{ title: '退款总金额币种', field: 'refundTotalCurrency', width: 160 },
	{ title: '退款分项金额', field: 'refundItemAmount', width: 160 },
	{ title: '退款运费', field: 'refundShippingAmount', width: 150 },
	{ title: '退款税费', field: 'refundTaxAmount', width: 150 },
	{ title: '零售配送费', field: 'retailShippingFee', width: 150 },
	{ title: '服务费', field: 'serviceFee', width: 120 },
	{ title: '商家提供的商品折扣', field: 'sellerProductDiscount', width: 160 },
	{ title: '币种', field: 'currency', width: 120 },
	{ title: '平台提供的商品折扣', field: 'platformProductDiscount', width: 160 },
	{ title: '商家提供的运费折扣', field: 'sellerShippingDiscount', width: 160 },
	{
		title: '平台提供的运费折扣',
		field: 'platformShippingDiscount',
		width: 160,
	},
	{ title: '商家承担的运费金额', field: 'sellerShippingAmount', width: 160 },
	{ title: '商家运费币种', field: 'sellerShippingCurrency', width: 160 },
	{ title: '平台承担的运费金额', field: 'platformShippingAmount', width: 160 },
	{ title: '买家承担的运费金额', field: 'buyerShippingAmount', width: 160 },

	{ title: '退货物流类型', field: 'returnLogisticsType', width: 160 },
	{ title: '退货方式', field: 'returnMethod', width: 150 },
	{ title: '是否合并退货', field: 'isMergeReturn', width: 140 },
	{ title: '合并退货ID', field: 'mergeReturnId', width: 180 },
	{ title: '商家提出退货类型', field: 'sellerProposedReturnType', width: 180 },
	{ title: '部分退款金额', field: 'partialRefundAmount', width: 160 },
	{ title: '部分退款币种', field: 'partialRefundCurrency', width: 160 },
	{
		title: '卖家是否拒绝商家部分退款方案',
		field: 'sellerRejectPartialRefund',
		width: 160,
	},
	{ title: '退货地址', field: 'returnAddress', width: 220 },
	{
		title: '退款/退货时间(北京)',
		field: 'refundTime',
		width: 180,
	},
	{
		title: '退款/退货时间(市场)',
		field: 'refundTimeMarket',
		width: 180,
	},
];
export const goodsListColumnsLeft = [
	{
		title: '退货订单项id',
		field: 'returnItemId',
		width: 100,
	},

	{
		title: '订单项id',
		field: 'orderItemId',
		width: 150,
	},
	{
		title: 'item ID',
		field: 'itemId',
		width: 100,
	},
	{
		title: 'SKU名称',
		field: 'skuName',
		width: 200,
	},
	{
		title: '产品名称',
		field: 'systemSkuName',
		width: 200,
	},
	{
		title: '商品名称',
		field: 'productName',
		width: 200,
	},
	{
		title: 'MSKU',
		field: 'msku',
		width: 150,
	},
	{
		title: 'SKU',
		field: 'sku',
		width: 150,
	},
	{
		title: '退货数量',
		field: 'returnQuantity',
		width: 150,
	},
	{
		title: '退款总金额',
		field: 'refundTotalAmount',
		width: 200,
	},
	{
		title: '币种',
		field: 'currency',
		width: 150,
	},
	{
		title: '退款分项金额',
		field: 'refundItemAmount',
		width: 150,
	},
	{
		title: '退款运费',
		field: 'refundShippingAmount',
		width: 150,
	},
	{
		title: '退款税费',
		field: 'refundTaxAmount',
		width: 200,
	},
	{
		title: '零售配送费',
		field: 'retailShippingFee',
		width: 150,
	},
	{
		title: '服务费',
		field: 'serviceFee',
		width: 150,
	},
];

const moduleKey = 'tiktokReturnsOrder';

export { columns, moduleKey };
