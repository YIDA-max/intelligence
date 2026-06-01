import {
	stockOrgRelation,
	supplierCodeRelation,
	purchaseOrgRelation,
	costTypeRelation,
} from '/@/views/integrations/components/tableRouteConfig';
import type { Columns } from '/@/types/table';
import {
	getFirstLogisticsEstimatedPage,
	getFirstLogisticsEstimatedExport,
} from '/@/api/integrations/logisticsCostIntegration/firstLogisticsEstimated/index';

export const listApi = {
	getList: getFirstLogisticsEstimatedPage,
	exportList: getFirstLogisticsEstimatedExport,
};

export const searchConfig = [
	{
		component: 'customCascaderApi',
		props: {
			componentType: 'warehouseId',
			settings: {
				code: 'fromWarehouseCodes',
				text: '发货仓',
			},
			getDataParams: {
				warehouseTypes: ['0', '1', '3'],
			},
		},
	},
	{
		component: 'customCascaderApi',
		props: {
			componentType: 'warehouseId',
			settings: {
				code: 'destinationWarehouseCodes',
				text: '目的仓',
			},
			getDataParams: {
				warehouseTypes: ['0', '1', '3'],
			},
		},
	},
	{
		component: 'TreeSelectInputApi',
		props: {
			componentType: 'feeTypeList',
			settings: {
				code: 'feeItemIds',
				text: '费用类型名称',
			},
		},
	},
	{
		component: 'TreeSelectInputApi',
		props: {
			componentType: 'userList',
			settings: {
				text: '金蝶单据创建人',
				code: 'createIds',
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
					value: 'mskus',
				},
				{
					label: '发货单号',
					value: 'deliveryNos',
				},
				{
					label: '调拨单号',
					value: 'transferNos',
				},
				{
					label: '数据编号',
					value: 'serialNos',
				},
				{
					label: '金蝶单据编号',
					value: 'receiptsKingdeeCodes',
				},
			],
		},
	},
	{
		component: 'SelectDate',
		props: {
			searchTypes: [
				{
					label: '集成数据创建时间',
					value: 'createTime',
					isAddHMS: true,
					dateStart: 'createTimeStart',
					dateEnd: 'createTimeEnd',
				},
				{
					label: '生成金蝶单据时间',
					value: 'kingdeeBillTime',
					isAddHMS: true,
					dateStart: 'kingdeeBillTimeStart',
					dateEnd: 'kingdeeBillTimeEnd',
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
		title: '集成数据编号',
		field: 'serialNo',
		width: 180,
	},
	{
		title: '调拨单号',
		field: 'transferNo',
		width: 180,
	},
	{
		title: '发货单号',
		field: 'deliveryNo',
		width: 180,
	},
	{
		title: '发货仓名称',
		field: 'deliveryWarehouseName',
		width: 150,
	},
	{
		title: '目的国家',
		field: 'destinationCountry',
		width: 120,
	},
	{
		title: '运输方式',
		field: 'transportationTypeName',
		width: 120,
	},
	{
		title: '预估费用录入时间',
		field: 'entryTime',
		width: 180,
	},
	{
		title: '物流商编码',
		field: 'logisticsCode',
		width: 150,
	},
	{
		title: '物流商名称',
		field: 'forwarderName',
		width: 150,
	},
	{
		title: '金蝶供应商编码',
		field: 'logisticsCodeKingdee',
		width: 150,
		slotName: 'RowValueLink',
		slotAttrs: supplierCodeRelation,
	},
	{
		title: '金蝶供应商名称',
		field: 'logisticsNameKingdee',
		width: 150,
		slotName: 'RowValueLink',
		slotAttrs: supplierCodeRelation,
	},
	{
		title: '费用承担组织名称',
		field: 'legalPersonName',
		width: 160,
	},
	{
		title: '金蝶结算组织编码',
		field: 'settlementOrganizationCodeKingdee',
		width: 160,
		slotName: 'RowValueLink',
		slotAttrs: purchaseOrgRelation,
	},
	{
		title: '金蝶结算组织名称',
		field: 'settlementOrganizationNameKingdee',
		width: 160,
		slotName: 'RowValueLink',
		slotAttrs: purchaseOrgRelation,
	},
	{
		title: '店铺站点名称',
		field: 'storeSiteName',
		width: 180,
	},
	{
		title: '目的仓名称',
		field: 'destinationWarehouseName',
		width: 150,
	},
	{
		title: '金蝶库存组织编码',
		field: 'stockCodeKingdee',
		width: 160,
		slotName: 'RowValueLink',
		slotAttrs: stockOrgRelation,
	},
	{
		title: '金蝶库存组织名称',
		field: 'stockNameKingdee',
		width: 160,
		slotName: 'RowValueLink',
		slotAttrs: stockOrgRelation,
	},
	{
		title: '金蝶部门编码',
		field: 'departmentCodeKingdee',
		width: 150,
		slotName: 'RowValueLink',
		slotAttrs: stockOrgRelation,
	},
	{
		title: '金蝶部门名称',
		field: 'departmentNameKingdee',
		width: 150,
		slotName: 'RowValueLink',
		slotAttrs: stockOrgRelation,
	},
	{
		title: '入账方式',
		field: 'accountsReceiptTypeName',
		width: 120,
	},
	{
		title: '费用分摊方式',
		field: 'shareTypeName',
		width: 150,
	},
	{
		title: 'SKU',
		field: 'skuCode',
		width: 180,
	},
	{
		title: 'MSKU',
		field: 'msku',
		width: 180,
	},
	{
		title: '产品名称',
		field: 'productName',
		width: 200,
	},
	{
		title: '箱规编码',
		field: 'skuCartonCode',
		width: 150,
	},
	{
		title: '发货数量',
		field: 'deliveryQuantity',
		width: 120,
	},
	{
		title: '费用类型名称',
		field: 'feeItemName',
		width: 150,
	},
	{
		title: '金蝶费用类型编码',
		field: 'feeItemKingdeeCode',
		width: 160,
		slotName: 'RowValueLink',
		slotAttrs: costTypeRelation,
	},
	{
		title: '金蝶费用类型名称',
		field: 'feeItemKingdeeName',
		width: 160,
		slotName: 'RowValueLink',
		slotAttrs: costTypeRelation,
	},
	{
		title: '预估费用分摊单价(原币)',
		field: 'shareUnitPrice',
		width: 180,
	},
	{
		title: '预估费用分摊总价(原币)',
		field: 'shareTotalPrice',
		width: 180,
	},
	{
		title: '原币币种',
		field: 'currency',
		width: 120,
	},
	{
		title: '费用项目备注',
		field: 'remark',
		width: 150,
	},
	{
		title: '集成数据创建时间',
		field: 'createTime',
		width: 180,
		sortable: true,
	},
	// 已生成额外字段
	{
		title: '生成金蝶单据名称',
		field: 'receiptsKingdeeName',
		width: 160,
	},
	{
		title: '金蝶单据编号',
		field: 'receiptsKingdeeCode',
		width: 180,
	},
	{
		title: '生成金蝶单据时间',
		field: 'receiptsKingdeeTime',
		width: 180,
		sortable: true,
	},
	{
		title: '金蝶单据创建人',
		field: 'receiptsKingdeeCreateUserName',
		width: 150,
	},
];

const moduleKey =
	'logisticsCostIntegrationFirstLogisticsEstimated_generatedOrder';

export { columns, moduleKey };
