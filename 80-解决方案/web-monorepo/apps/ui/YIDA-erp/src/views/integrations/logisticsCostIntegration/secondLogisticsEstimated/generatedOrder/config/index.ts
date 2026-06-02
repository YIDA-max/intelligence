import type { Columns } from '/@/types/table';
import {
	salesOrgRelation,
	purchaseOrgRelation,
	warehouseRelation,
	costTypeRelation,
	supplierCodeRelation,
} from '/@/views/integrations/components/tableRouteConfig';
import {
	getSecondLogisticsEstimatedPage,
	getSecondLogisticsEstimatedExport,
} from '/@/api/integrations/logisticsCostIntegration/secondLogisticsEstimated/index';

export const listApi = {
	getList: getSecondLogisticsEstimatedPage,
	exportList: getSecondLogisticsEstimatedExport,
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
		component: 'customCascaderApi',
		props: {
			componentType: 'siteStoreId',
			settings: {
				code: 'storeIds',
				text: '店铺/站点',
			},
		},
	},
	// 已生成Tab额外：金蝶单据创建人
	{
		component: 'TreeSelectInputApi',
		props: {
			componentType: 'userList',
			settings: {
				text: '金蝶单据创建人',
				code: 'kingdeeDocCreateIds',
			},
		},
	},
	{
		component: 'SelectInput',
		props: {
			searchTypes: [{ label: '平台单号', value: 'platformOrderNos' }],
		},
	},
	{
		component: 'SelectInput',
		props: {
			searchTypes: [{ label: '系统订单号', value: 'selfOrderNos' }],
		},
	},
	{
		component: 'SelectInput',
		props: {
			searchTypes: [
				{ label: 'SKU', value: 'skuList' },
				{ label: '产品名称', value: 'productNames' },
			],
		},
	},
	{
		component: 'SelectInput',
		props: {
			searchTypes: [{ label: '跟踪号', value: 'logisticsTrackingNos' }],
		},
	},
	{
		component: 'SelectInput',
		props: {
			searchTypes: [
				{ label: '物流商名称', value: 'logisticsChannelNames' },
				{ label: '物流商编码', value: 'logisticsChannelCodes' },
			],
			settings: {
				selectStyle: {
					width: '150px',
				},
			},
		},
	},
	{
		component: 'SelectInput',
		props: {
			searchTypes: [
				{ label: '金蝶销售组织编码', value: 'kingdeeSalesOrgCodes' },
				{ label: '金蝶销售组织名称', value: 'kingdeeSalesOrgCodeNames' },
			],
			settings: {
				selectStyle: {
					width: '170px',
				},
			},
		},
	},
	{
		component: 'SelectInput',
		props: {
			searchTypes: [
				{ label: '金蝶采购组织编码', value: 'kingdeeOrgCodes' },
				{ label: '金蝶采购组织名称', value: 'kingdeeOrgCodeNames' },
			],
			settings: {
				selectStyle: {
					width: '170px',
				},
			},
		},
	},
	{
		component: 'SelectInput',
		props: {
			searchTypes: [
				{ label: '发货仓库名称', value: 'designatedWarehouseNames' },
			],
			settings: {
				selectStyle: {
					width: '150px',
				},
			},
		},
	},

	{
		component: 'SelectInput',
		props: {
			searchTypes: [
				{ label: '物流费金蝶结算组织编码', value: 'kingdeeSettleOrgCodes' },
				{ label: '物流费金蝶结算组织名称', value: 'kingdeeSettleOrgNames' },
			],
			settings: {
				selectStyle: {
					width: '200px',
				},
			},
		},
	},

	{
		component: 'SelectInput',
		props: {
			searchTypes: [
				{ label: '物流费金蝶付款组织编码', value: 'kingdeePaymentOrgCodes' },
				{ label: '物流费金蝶付款组织名称', value: 'kingdeePaymentOrgNames' },
			],
			settings: {
				selectStyle: {
					width: '200px',
				},
			},
		},
	},
	{
		component: 'SelectInput',
		props: {
			searchTypes: [{ label: '费用项目名称', value: 'expenseItemNames' }],
			settings: {
				selectStyle: {
					width: '170px',
				},
			},
		},
	},
	{
		component: 'SelectInput',
		props: {
			searchTypes: [{ label: '仟易供应商', value: 'suppliers' }],
			settings: {
				selectStyle: {
					width: '150px',
				},
			},
		},
	},

	{
		component: 'SelectInput',
		props: {
			searchTypes: [{ label: '金蝶供应商编码', value: 'kingdeeSupplierCodes' }],
			settings: {
				selectStyle: {
					width: '170px',
				},
			},
		},
	},
	{
		component: 'SelectInput',
		props: {
			searchTypes: [{ label: '金蝶单据编号', value: 'generateKingdeeDocNos' }],
			settings: {
				selectStyle: {
					width: '170px',
				},
			},
		},
	},
	// {
	// 	component: 'SelectInput',
	// 	props: {
	// 		searchTypes: [
	// 			{ label: '平台单号', value: 'platformOrderNos' },
	// 			{ label: '系统订单号', value: 'selfOrderNos' },
	// 			{ label: 'SKU', value: 'skuList' },
	// 			{ label: '产品名称', value: 'productNames' },
	// 			{ label: '跟踪号', value: 'logisticsTrackingNos' },
	// 			{ label: '物流商名称', value: 'logisticsChannelNames' },
	// 			{ label: '物流商编码', value: 'logisticsChannelCodes' },
	// 			{ label: '金蝶销售组织编码', value: 'kingdeeSalesOrgCodes' },
	// 			{ label: '金蝶销售组织名称', value: 'kingdeeSalesOrgCodeNames' },
	// 			{ label: '金蝶采购组织编码', value: 'kingdeeOrgCodes' },
	// 			{ label: '金蝶采购组织名称', value: 'kingdeeOrgCodeNames' },
	// 			{ label: '发货仓库名称', value: 'designatedWarehouseNames' },
	// 			{ label: '物流费金蝶结算组织编码', value: 'kingdeeSettleOrgCodes' },
	// 			{ label: '物流费金蝶结算组织名称', value: 'kingdeeSettleOrgNames' },
	// 			{ label: '物流费金蝶付款组织编码', value: 'kingdeePaymentOrgCodes' },
	// 			{ label: '物流费金蝶付款组织名称', value: 'kingdeePaymentOrgNames' },
	// 			{ label: '费用项目名称', value: 'expenseItemNames' },
	// 			{ label: '仟易供应商', value: 'suppliers' },
	// 			{ label: '金蝶供应商编码', value: 'kingdeeSupplierCodes' },
	// 		],
	// 	},
	// },
	{
		component: 'SelectDate',
		props: {
			searchTypes: [
				{
					label: '费用录入时间',
					value: 'entryTime',
					isAddHMS: true,
					dateStart: 'entryTimeStart',
					dateEnd: 'entryTimeEnd',
				},
				{
					label: '生成金蝶单据时间',
					value: 'kingdeeDocTime',
					isAddHMS: true,
					dateStart: 'kingdeeDocTimeStart',
					dateEnd: 'kingdeeDocTimeEnd',
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
	{ title: '集成单据编号', field: 'integrationDocNo', width: 200 },
	{ title: '平台', field: 'platformChannelCode', width: 120 },
	{ title: '平台单号', field: 'platformOrderNo', width: 180 },
	{ title: '系统订单号', field: 'selfOrderNo', width: 180 },
	{
		title: '店铺：站点',
		field: 'storeInfo',
		width: 200,
	},
	{
		title: 'SKU',
		field: 'skuCode',
		width: 200,
	},
	{
		title: '产品名称',
		field: 'skuName',
		width: 200,
	},
	{ title: '跟踪号', field: 'logisticsTrackingNo', width: 180 },
	{ title: '物流商名称', field: 'logisticsChannelName', width: 150 },
	{ title: '物流商编码', field: 'logisticsChannelCode', width: 150 },
	{ title: '是否结算', field: 'settleFlagText', width: 120 },
	{
		title: '金蝶销售组织编码',
		field: 'kingdeeSalesOrgCode',
		width: 180,
		slotName: 'RowValueLink',
		slotAttrs: salesOrgRelation,
	},
	{
		title: '金蝶销售组织名称',
		field: 'kingdeeSalesOrgCodeName',
		width: 180,
		slotName: 'RowValueLink',
		slotAttrs: salesOrgRelation,
	},
	{
		title: '金蝶部门编码',
		field: 'kingdeeDeptCode',
		width: 150,
		slotName: 'RowValueLink',
		slotAttrs: salesOrgRelation,
	},
	{
		title: '金蝶采购组织编码',
		field: 'kingdeeOrgCode',
		width: 180,
		slotName: 'RowValueLink',
		slotAttrs: purchaseOrgRelation,
	},
	{
		title: '金蝶采购组织名称',
		field: 'kingdeeOrgCodeName',
		width: 180,
		slotName: 'RowValueLink',
		slotAttrs: purchaseOrgRelation,
	},
	{
		title: '金蝶销售组织本币',
		field: 'kingdeeCurrencyName',
		width: 160,
		slotName: 'RowValueLink',
		slotAttrs: purchaseOrgRelation,
	},
	{ title: '发货仓库名称', field: 'designatedWarehouseName', width: 150 },
	{
		title: '发货仓法人主体',
		field: 'legalPersonName',
		width: 160,
		slotName: 'RowValueLink',
		slotAttrs: warehouseRelation,
	},
	{
		title: '物流费金蝶结算组织编码',
		field: 'kingdeeSettleOrgCode',
		width: 200,
	},
	{
		title: '物流费金蝶结算组织名称',
		field: 'kingdeeSettleOrgName',
		width: 200,
	},
	{
		title: '物流费金蝶付款组织编码',
		field: 'kingdeePaymentOrgCode',
		width: 200,
	},
	{
		title: '物流费金蝶付款组织名称',
		field: 'kingdeePaymentOrgName',
		width: 200,
	},
	{
		title: '费用类型',
		field: 'expenseTypeName',
		width: 150,
	},
	{
		title: '费用项目名称',
		field: 'expenseItemName',
		width: 150,
		slotName: 'RowValueLink',
		slotAttrs: costTypeRelation,
	},
	{
		title: '金蝶费用项目名称',
		field: 'kingdeeExpenseItemName',
		width: 160,
		slotName: 'RowValueLink',
		slotAttrs: costTypeRelation,
	},
	{
		title: '费用类型币种',
		field: 'currencyCode',
		width: 150,
	},
	{
		title: '仟易供应商',
		field: 'supplier',
		width: 150,
	},
	{
		title: '金蝶供应商编码',
		field: 'kingdeeSupplierCode',
		width: 160,
		slotName: 'RowValueLink',
		slotAttrs: supplierCodeRelation,
	},
	{ title: 'SKU数量', field: 'skuQty', width: 120 },
	{ title: '订单总计费重', field: 'totalCost', width: 150 },
	{ title: 'SKU计费重', field: 'skuCost', width: 150 },
	{ title: '预估运费', field: 'estimatedCost', width: 150 },
	{ title: '尾程物流分摊费用', field: 'apportionCosts', width: 180 },
	{
		title: '费用录入时间',
		field: 'entryTime',
		width: 180,
		sortable: true,
	},
	// 已生成额外字段
	{
		title: '是否已生成金蝶单据',
		field: 'generateKingdeeDocFlagText',
		width: 180,
	},
	{ title: '生成单据状态', field: 'statusText', width: 150 },
	{ title: '生成金蝶单据名称', field: 'kingdeeBillName', width: 180 },
	{ title: '金蝶单据编号', field: 'kingdeeBillNo', width: 180 },
	{
		title: '生成金蝶单据时间',
		field: 'kingdeeDocTime',
		width: 180,
		sortable: true,
	},
	{ title: '金蝶单据创建人', field: 'kingdeeDocCreateName', width: 150 },
];

const moduleKey =
	'logisticsCostIntegrationSecondLogisticsEstimated_generatedOrder';

export { columns, moduleKey };
