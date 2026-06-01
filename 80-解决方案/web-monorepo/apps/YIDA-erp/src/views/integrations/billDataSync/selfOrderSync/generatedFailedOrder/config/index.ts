import {
	salesOrgRelation,
	stockOrgRelation,
	orderProgressOrgRelation,
	productInfoSku,
} from '/@/views/integrations/components/tableRouteConfig';
import type { Columns } from '/@/types/table';
import {
	getSelfOrderKingdeeDocPage,
	getSelfOrderKingdeeDocExport,
	generateKingdeeBill,
} from '/@/api/integrations/billDataSync/selfOrderSync/index';
export const listApi = {
	getList: getSelfOrderKingdeeDocPage,
	exportList: getSelfOrderKingdeeDocExport,
	generateList: generateKingdeeBill,
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
					label: '发货仓库名称',
					value: 'shippingWarehouses',
				},
			],
		},
	},
	{
		component: 'SelectInput',
		props: {
			searchTypes: [
				{
					label: '平台单号',
					value: 'platformOrderNos',
				},
				{
					label: '系统订单号',
					value: 'pickOrderNos',
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
					label: '金蝶发货仓库编码',
					value: 'kingdeeWarehouseCodes',
				},
				{
					label: '金蝶发货仓库名称',
					value: 'kingdeeWarehouseNames',
				},
			],
		},
	},
	{
		component: 'SelectInput',
		props: {
			searchTypes: [
				{
					label: '金蝶库存组织编码',
					value: 'kingdeeInventoryOrgCodes',
				},
				{
					label: '金蝶库存组织名称',
					value: 'kingdeeInventoryOrgNames',
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
		// 是否补发
		component: 'SelectInputApi',
		props: {
			text: '是否补发',
			code: 'resendOrder',
			componentType: 'yesNo',
		},
	},
	{
		// 是否赠品
		component: 'SelectInputApi',
		props: {
			text: '是否赠品',
			code: 'giftFlag',
			componentType: 'yesNo',
		},
	},
	{
		component: 'SelectDate',
		props: {
			searchTypes: [
				{
					label: '订单订购时间 (北京)',
					value: 'orderTime',
					isAddHMS: true,
					dateStart: 'orderTimeStart',
					dateEnd: 'orderTimeEnd',
				},
				{
					label: '订单创建时间',
					value: 'createTime',
					isAddHMS: true,
					dateStart: 'orderCreateTimeStart',
					dateEnd: 'orderCreateTimeEnd',
				},
				{
					label: '订单发货时间',
					value: 'deliveryTime',
					isAddHMS: true,
					dateStart: 'shippingTimeStart',
					dateEnd: 'shippingTimeEnd',
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
		title: '平台单号',
		field: 'platformOrderNo',
		width: 150,
		sortable: true,
	},
	{
		title: '系统订单号',
		field: 'pickOrderNo',
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
		title: '国家',
		field: 'country',
		width: 100,
		sortable: true,
	},
	{
		title: '店铺 ID',
		field: 'storeId',
		width: 120,
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
		width: 100,
		sortable: true,
	},
	{
		title: '订单配送方式',
		field: 'orderDeliveryMethodText',
		width: 150,
	},
	{
		title: '订单订购时间 (北京)',
		field: 'orderTime',
		width: 180,
		sortable: true,
	},
	{
		title: '订单创建时间',
		field: 'orderCreateTime',
		width: 180,
		sortable: true,
	},
	{
		title: '订单发货时间',
		field: 'shippingTime',
		width: 180,
		sortable: true,
	},
	{
		title: '订单商品编号',
		field: 'itemId',
		width: 150,
		sortable: true,
	},
	{
		title: '订单数量',
		field: 'orderQuantity',
		width: 120,
		sortable: true,
	},
	{
		title: '本次发货数量',
		field: 'shippedQuantity',
		width: 120,
		sortable: true,
	},
	{
		title: '发货仓库名称',
		field: 'shippingWarehouse',
		width: 150,
		sortable: true,
	},
	{
		title: '原币币种',
		field: 'currency',
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
		title: '销售金额',
		field: 'orderTotalAmountCustom',
		width: 120,
	},
	{
		title: '商品售价 (不含税)',
		field: 'sellingPrice',
		width: 120,
		sortable: true,
	},
	{
		title: '商品税金',
		field: 'tax',
		width: 120,
		sortable: true,
	},
	{
		title: '买家支付运费',
		field: 'customerPaidShipping',
		width: 120,
		sortable: true,
	},
	{
		title: '商品折扣',
		field: 'discount',
		width: 120,
		sortable: true,
	},
	{
		title: '商品积分',
		field: 'points',
		width: 120,
		sortable: true,
	},
	{
		title: '商品其他费用',
		field: 'otherFee',
		width: 120,
		sortable: true,
	},
	{
		title: '买家姓名',
		field: 'buyerName',
		width: 150,
		sortable: true,
	},
	{
		title: '买家邮箱',
		field: 'buyerEmail',
		width: 150,
		sortable: true,
	},
	{
		title: '买家编码',
		field: 'buyerId',
		width: 150,
		sortable: true,
	},
	{
		title: '买家备注',
		field: 'buyerMessage',
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
		title: '金蝶发货仓库编码',
		field: 'kingdeeWarehouseCode',
		width: 180,
		sortable: true,
		slotName: 'RowValueLink',
		slotAttrs: stockOrgRelation,
	},
	{
		title: '金蝶发货仓库名称',
		field: 'kingdeeWarehouseName',
		width: 180,
		slotName: 'RowValueLink',
		slotAttrs: stockOrgRelation,
	},
	{
		title: '金蝶库存组织编码',
		field: 'kingdeeInventoryOrgCode',
		width: 180,
		sortable: true,
		slotName: 'RowValueLink',
		slotAttrs: stockOrgRelation,
	},
	{
		title: '金蝶库存组织名称',
		field: 'kingdeeInventoryOrgName',
		width: 180,
		slotName: 'RowValueLink',
		slotAttrs: stockOrgRelation,
	},
	{
		title: '生成金蝶单据名称',
		field: 'kingdeeBillTypeText',
		width: 180,
		slotName: 'RowValueLink',
		slotAttrs: orderProgressOrgRelation,
	},
	{
		title: '失败原因',
		field: 'failedReason',
		width: 250,
		sortable: true,
	},
];
const moduleKey = 'selfOrderSync_notGeneratedOrder';

export { columns, moduleKey };
