import {
	salesOrgRelation,
	stockOrgRelation,
	orderProgressOrgRelation,
	productInfoSku,
} from '/@/views/integrations/components/tableRouteConfig';
import type { Columns } from '/@/types/table';
import {
	getPlatformOrderKingdeeDocPage,
	getPlatformOrderKingdeeDocExport,
	postGeneratePlatformOrderKingdeeDoc,
} from '/@/api/integrations/billDataSync/deliverGoodsOrderSync/index';

export const listApi = {
	getList: getPlatformOrderKingdeeDocPage,
	exportList: getPlatformOrderKingdeeDocExport,
	generateList: postGeneratePlatformOrderKingdeeDoc,
};

export const searchConfig = [
	{
		component: 'customCascaderApi',
		props: {
			componentType: 'siteStoreId',
			settings: {
				code: 'storeIds',
			},
		},
	},
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
				text: '金蝶单据名称',
				code: 'kingdeeBillTypes',
				getTreeDataParams: 'kingdee_base_Kingdee_bill_type',
			},
		},
	},
	{
		component: 'SelectInput',
		props: {
			searchTypes: [
				{
					label: 'SKU',
					value: 'skuCodes',
				},
				{
					label: 'MSKU',
					value: 'mskuCodes',
				},
				{
					label: '产品名称',
					value: 'skuNames',
				},
			],
		},
	},
	{
		component: 'SelectInput',
		props: {
			searchTypes: [
				{
					label: '平台订单号',
					value: 'platformOrderNos',
				},
			],
		},
	},
	{
		component: 'SelectInput',
		props: {
			searchTypes: [
				{
					label: '金蝶发货仓库编码',
					value: 'kingdeeDispatchWarehouseCodes',
				},
				{
					label: '金蝶发货仓库名称',
					value: 'kingdeeDispatchWarehouseNames',
				},
			],
		},
	},
	{
		component: 'SelectInput',
		props: {
			searchTypes: [
				{
					label: '金蝶销售组织编码',
					value: 'kingdeeSalesOrgCodes',
				},
				{
					label: '金蝶销售组织名称',
					value: 'kingdeeSalesOrgNames',
				},
			],
		},
	},
	{
		component: 'SelectInput',
		props: {
			searchTypes: [
				{
					label: '金蝶客户编码',
					value: 'kingdeeCustomerCodes',
				},
				{
					label: '金蝶客户名称',
					value: 'kingdeeCustomerNames',
				},
			],
		},
	},
	{
		component: 'SelectInput',
		props: {
			searchTypes: [
				{
					label: '集成单据编号',
					value: 'integrationNos',
				},
			],
		},
	},
	{
		component: 'SelectDate',
		props: {
			searchTypes: [
				{
					label: '订单订购时间(北京时间)',
					value: 'orderTime',
					isAddHMS: true,
					dateStart: 'orderTimeStart',
					dateEnd: 'orderTimeEnd',
				},
				{
					label: '付款时间(北京时间)',
					value: 'paymentTime',
					isAddHMS: true,
					dateStart: 'paymentTimeStart',
					dateEnd: 'paymentTimeEnd',
				},
				{
					label: '更新时间 (北京时区)',
					value: 'updateTime',
					isAddHMS: true,
					dateStart: 'orderUpdateTimeStart',
					dateEnd: 'orderUpdateTimeEnd',
				},
				{
					label: '发货时间(北京)',
					value: 'shippingTime',
					isAddHMS: true,
					dateStart: 'shippingTimeStart',
					dateEnd: 'shippingTimeEnd',
				},
				{
					label: '发货时间(市场)',
					value: 'shippingTimeMarket',
					isAddHMS: true,
					dateStart: 'shippingTimeMarketStart',
					dateEnd: 'shippingTimeMarketEnd',
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
		field: 'integrationNo', // 集成单据编号
		title: '集成单据编号',
		width: 150,
		sortable: true,
	},
	{
		title: '平台',
		field: 'platformChannelCode',
		width: 100,
		sortable: true,
	},
	{
		title: '店铺名称：站点',
		field: 'siteName',
		width: 200,
		prefixObj: {
			//前缀对象
			field: 'storeName', //前缀字段
			connectStr: '：', //连接符
		},
	},
	{
		title: '平台订单号',
		field: 'platformOrderNo',
		width: 150,
		sortable: true,
	},
	{
		title: '订单类型',
		field: 'orderTypeText',
		width: 120,
	},
	{
		title: 'SKU',
		field: 'skuCode',
		width: 100,
		sortable: true,
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
	{
		title: 'MSKU',
		field: 'mskuCode',
		width: 120,
		sortable: true,
	},
	{
		title: '购买数量',
		field: 'orderQuantity',
		width: 100,
		sortable: true,
	},
	{
		title: '已发数量',
		field: 'shippedQuantity',
		width: 100,
		sortable: true,
	},
	{
		title: '商品单价',
		field: 'unitPrice',
		width: 120,
		sortable: true,
	},
	{
		title: '订购时间(北京时间)',
		field: 'orderTime',
		width: 160,
		sortable: true,
	},
	{
		title: '付款时间(北京时间)',
		field: 'paymentTime',
		width: 160,
		sortable: true,
	},
	{
		title: '发货时间(北京)',
		field: 'shippingTime',
		width: 200,
		sortable: true,
	},
	{
		title: '发货时间(市场)',
		field: 'shippingTimeMarket',
		width: 160,
	},
	{
		title: '更新时间 (北京时区)',
		field: 'orderUpdateTime',
		width: 180,
		sortable: true,
	},
	{
		title: '金蝶发货仓库编码',
		field: 'kingdeeDispatchWarehouseCode',
		width: 150,
		sortable: true,
		slotName: 'RowValueLink',
		slotAttrs: stockOrgRelation,
	},
	{
		title: '金蝶发货仓库名称',
		field: 'kingdeeDispatchWarehouseName',
		width: 150,
		slotName: 'RowValueLink',
		slotAttrs: stockOrgRelation,
	},
	{
		title: '履约方',
		field: 'carrier',
		width: 120,
		sortable: true,
	},
	{
		title: '平台佣金',
		field: 'platformCommission',
		width: 120,
		sortable: true,
	},
	{
		title: '订单币种',
		field: 'currency',
		width: 120,
		sortable: true,
	},
	{
		title: '订单总金额',
		field: 'orderTotalAmount',
		width: 150,
		sortable: true,
	},
	{
		title: '税费',
		field: 'orderTaxFee',
		width: 100,
		sortable: true,
	},
	{
		title: '交易手续费',
		field: 'transactionFee',
		width: 120,
		sortable: true,
	},
	{
		title: '优惠金额',
		field: 'discountAmount',
		width: 120,
		sortable: true,
	},
	{
		title: '买家所付物流运费',
		field: 'buyerShippingFee',
		width: 180,
		sortable: true,
	},
	{
		title: '买家实付金额',
		field: 'buyerActualPayment',
		width: 150,
		sortable: true,
	},
	{
		title: '退返费用',
		field: 'orderRefundTotalAmount',
		width: 120,
		sortable: true,
	},
	{
		title: '推金蝶含税单价',
		field: 'kingdeeTaxPrice',
		width: 120,
	},
	{
		title: '推金蝶金额（不含税）',
		field: 'kingdeeOfNullTaxPrice',
		width: 120,
		isSum: true,
	},
	{
		title: '买家邮箱',
		field: 'buyerEmail',
		width: 150,
		sortable: true,
	},
	{
		title: '买家账号名',
		field: 'buyerName',
		width: 150,
		sortable: true,
	},
	{
		title: '金蝶销售组织编码',
		field: 'kingdeeSalesOrgCode',
		width: 180,
		sortable: true,
		slotName: 'RowValueLink',
		slotAttrs: salesOrgRelation,
	},
	{
		title: '金蝶销售组织名称',
		field: 'kingdeeSalesOrgName',
		width: 180,
		slotName: 'RowValueLink',
		slotAttrs: salesOrgRelation,
	},
	{
		title: '金蝶客户编码',
		field: 'kingdeeCustomerCode',
		width: 180,
		sortable: true,
		slotName: 'RowValueLink',
		slotAttrs: salesOrgRelation,
	},
	{
		title: '金蝶客户名称',
		field: 'kingdeeCustomerName',
		width: 180,
		slotName: 'RowValueLink',
		slotAttrs: salesOrgRelation,
	},
	{
		title: '生成金蝶单据名称',
		field: 'kingdeeBillTypeText',
		width: 180,
		slotName: 'RowValueLink',
		slotAttrs: orderProgressOrgRelation,
	},
];

const moduleKey = 'deliverGoodsOrderSync_notGeneratedOrder';

export { columns, moduleKey };
