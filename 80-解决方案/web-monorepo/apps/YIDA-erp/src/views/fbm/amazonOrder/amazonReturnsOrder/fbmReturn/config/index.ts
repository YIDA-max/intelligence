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
				getTreeDataParams: 'Amazon_fbm_return_reason',
			},
		},
	},
	{
		component: 'TreeSelectInputApi',
		props: {
			componentType: 'dicts',
			settings: {
				text: '申请取消状态',
				code: 'applyCancelStatuses',
				getTreeDataParams: 'Amazon_fbm_apply_cancel_status',
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
					label: '亚马逊RMA单号',
					value: 'amazonRmaIds',
				},
				{
					label: '跟踪号',
					value: 'trackingNumbers',
				},
			],
		},
	},
	{
		component: 'SelectDate',
		props: {
			searchTypes: [
				{
					label: '退货申请时间',
					value: 'returnApplyTime',
					isAddHMS: true,
					dateStart: 'returnApplyTimeStart',
					dateEnd: 'returnApplyTimeEnd',
				},
				{
					label: '退货送达时间',
					value: 'returnDeliverTime',
					isAddHMS: true,
					dateStart: 'returnDeliverTimeStart',
					dateEnd: 'returnDeliverTimeEnd',
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
			connectStr: '：',
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
		width: 220,
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
		title: '订购时间（北京时间）',
		field: 'orderTimeBeijing',
		width: 220,
		sortable: true,
	},
	{
		title: '退货申请时间（北京时间）',
		field: 'returnApplyTimeBeijing',
		width: 220,
		sortable: true,
	},
	{
		title: '退货送达时间（北京时间）',
		field: 'returnDeliveryTimeBeijing',
		width: 220,
		sortable: true,
	},
	{
		title: '订单金额',
		field: 'orderAmount',
		width: 150,
	},
	{
		title: '订单数量',
		field: 'orderQuantity',
		width: 120,
	},
	{
		title: '申请取消状态',
		field: 'applyCancelStatus',
		width: 150,
	},
	{
		title: '符合政策',
		field: 'policyCompliance',
		width: 150,
	},
	{
		title: '退货原因',
		field: 'returnReason',
		width: 180,
	},
	{
		title: '退货类型',
		field: 'returnType',
		width: 150,
		sortable: true,
	},
	{
		title: '退款金额',
		field: 'refundAmount',
		width: 150,
	},
	{
		title: '退货数量',
		field: 'returnQuantity',
		width: 120,
	},
	{
		title: '退货承运商',
		field: 'returnCarrier',
		width: 150,
	},
	{
		title: '跟踪号',
		field: 'trackingNumber',
		width: 180,
	},
	{
		title: '标签类型',
		field: 'labelType',
		width: 150,
	},
	{
		title: '标签费用',
		field: 'labelFee',
		width: 150,
	},
	{
		title: '标签支付方',
		field: 'labelPayer',
		width: 150,
	},
	{
		title: '亚马逊RMA ID',
		field: 'amazonRmaId',
		width: 180,
	},
	{
		title: '卖家RMA ID',
		field: 'sellerRmaId',
		width: 180,
	},
	{
		title: 'A-to-Z索赔',
		field: 'atoZClaim',
		width: 150,
	},
	{
		title: 'Prime订单',
		field: 'primeOrder',
		width: 120,
	},
	{
		title: '解决办法',
		field: 'solution',
		width: 150,
	},
	{
		title: '发票编号',
		field: 'invoiceNumber',
		width: 150,
	},
	{
		title: 'Safe-T索赔原因',
		field: 'safetActionReason',
		width: 180,
	},
	{
		title: 'Safe-T索赔单号',
		field: 'safetClaimId',
		width: 180,
	},
	{
		title: 'Safe-T索赔状态',
		field: 'safetClaimState',
		width: 160,
	},
	{
		title: 'Safe-T索赔时间',
		field: 'safetClaimCreationTime',
		width: 200,
	},
	{
		title: 'Safe-T索赔金额',
		field: 'safetClaimReimbursementAmount',
		width: 260,
	},
];

const moduleKey = 'fbmReturnsOrder';

export { columns, moduleKey };
