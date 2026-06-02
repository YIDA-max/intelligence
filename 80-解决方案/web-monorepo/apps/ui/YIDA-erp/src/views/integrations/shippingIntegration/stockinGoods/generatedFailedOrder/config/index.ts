import {
	salesOrgRelation,
	stockOrgRelation,
	productInfoOrgRelation,
} from '/@/views/integrations/components/tableRouteConfig';
import {
	getStockinGoodsPage,
	getStockinGoodsExport,
	postGenerateStockinGoods,
	postUpdateIntegratedData,
} from '/@/api/integrations/shippingIntegration/stockinGoods/index';
import { update } from 'lodash';

export const listApi = {
	getList: getStockinGoodsPage,
	exportList: getStockinGoodsExport,
	generateList: postGenerateStockinGoods,
	updateList: postUpdateIntegratedData,
};

export const searchConfig = [
	{
		component: 'customCascaderApi',
		props: {
			componentType: 'warehouseId',
			settings: {
				code: 'takeOutWarehouses',
				text: '调出仓库',
			},
			blacklist: ['2'],
		},
	},
	{
		component: 'customCascaderApi',
		props: {
			componentType: 'warehouseId',
			settings: {
				code: 'takeInWarehouses',
				text: '调入仓库',
			},
			blacklist: ['2'],
		},
	},
	{
		component: 'TreeSelectInputApi',
		props: {
			componentType: 'kingdeeOrg',
			settings: {
				text: '金蝶调入库存组织',
				code: 'kingdeeInInventoryOrgCodes',
			},
		},
	},
	{
		component: 'TreeSelectInputApi',
		props: {
			componentType: 'kingdeeOrg',
			settings: {
				text: '金蝶调出库存组织',
				code: 'kingdeeOutInventoryOrgCodes',
			},
		},
	},
	// {
	// 	component: 'TreeSelectInputApi',
	// 	props: {
	// 		componentType: 'dicts',
	// 		settings: {
	// 			text: '生成单据状态',
	// 			code: 'generateKingdeeDocStatuses',
	// 			getTreeDataParams: 'not_generate_kingdee_doc_query_status',
	// 		},
	// 	},
	// },

	{
		component: 'SelectInput',
		props: {
			searchTypes: [
				{
					label: '调拨单号',
					value: 'transferNos',
				},
			],
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
					label: '实际发货日期',
					value: 'actualDeliveryDate',
					isAddHMS: true,
					dateStart: 'actualDeliveryDateStart',
					dateEnd: 'actualDeliveryDateEnd',
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
		field: 'billNo', // integrated → billNo
		title: '集成单据编号',
		width: 150,
	},
	{
		title: '调拨单号',
		field: 'transferNo', // transferOrderNo → transferNo
		width: 150,
	},
	{
		title: '发货单号',
		field: 'deliveryNo',
		width: 150,
	},
	{
		title: '实际发货日期',
		field: 'actualDeliveryDate', // actualShippingDate → actualDeliveryDate
		width: 150,
	},
	{
		title: 'SKU',
		field: 'skuCode', // sku → skuCode
		width: 150,
	},
	{
		title: '产品名称',
		field: 'skuName',
		width: 150,
	},
	{
		title: '发货数量',
		field: 'shipmentQuantity', // shippingQuantity → shipmentQuantity
		width: 150,
	},
	{
		title: '发货箱数',
		field: 'deliveryCartonQuantity', // shippingCartonCount → deliveryCartonQuantity
		width: 150,
	},
	{
		title: '调出仓库编码',
		field: 'takeOutWarehouse', // transferOutWarehouseCode → takeOutWarehouse
		width: 150,
	},
	{
		title: '调出仓库名称',
		field: 'takeOutWarehouseName', // transferOutWarehouseName → takeOutWarehouseName
		width: 150,
	},
	{
		title: '调入仓库编码',
		field: 'takeInWarehouse',
		width: 150,
	},
	{
		title: '调入仓库名称',
		field: 'takeInWarehouseName',
		width: 150,
	},
	{
		title: '金蝶物料编码',
		field: 'kingdeeMaterialCode',
		width: 150,
		slotName: 'RowValueLink',
		slotAttrs: productInfoOrgRelation,
	},
	{
		title: '金蝶调出仓库编码',
		field: 'kingdeeOutWarehouseCode', // kingdeeTransferOutWarehouseCode → kingdeeOutWarehouseCode
		width: 180,
		slotName: 'RowValueLink',
		slotAttrs: stockOrgRelation,
	},
	{
		title: '金蝶调出仓库名称',
		field: 'kingdeeOutWarehouseName',
		width: 150,
		slotName: 'RowValueLink',
		slotAttrs: stockOrgRelation,
	},
	{
		title: '金蝶调入仓库编码',
		field: 'kingdeeInWarehouseCode',
		width: 150,
		slotName: 'RowValueLink',
		slotAttrs: stockOrgRelation,
	},
	{
		title: '金蝶调入仓库名称',
		field: 'kingdeeInWarehouseName',
		width: 150,
		slotName: 'RowValueLink',
		slotAttrs: stockOrgRelation,
	},
	{
		title: '金蝶调出库存组织编码',
		field: 'kingdeeOutInventoryOrgCode', // kingdeeTransferOutStockOrgCode → kingdeeOutInventoryOrgCode
		width: 170,
		slotName: 'RowValueLink',
		slotAttrs: stockOrgRelation,
	},
	{
		title: '金蝶调出库存组织名称',
		field: 'kingdeeOutInventoryOrgName',
		width: 180,
		slotName: 'RowValueLink',
		slotAttrs: stockOrgRelation,
	},
	{
		title: '金蝶调入库存组织编码',
		field: 'kingdeeInInventoryOrgCode',
		width: 180,
		slotName: 'RowValueLink',
		slotAttrs: stockOrgRelation,
	},
	{
		title: '金蝶调入库存组织名称',
		field: 'kingdeeInInventoryOrgName',
		width: 180,
		slotName: 'RowValueLink',
		slotAttrs: stockOrgRelation,
	},
	{
		title: '交易类型',
		field: 'transactionTypeText',
		width: 120,
	},
	{
		title: '失败原因',
		field: 'pushErrorReason', // failedReason → pushErrorReason
		width: 150,
	},
	{
		title: '调拨单创建时间',
		field: 'transferOrderCreateTime',
		width: 150,
		sortable: true,
	},
	{
		title: '集成数据创建时间',
		field: 'createTime', // integrationDataCreateTime → createTime
		width: 180,
		sortable: true,
	},
];
export const goodsListColumnsLeft = [
	{
		title: 'SKU',
		field: 'skuCode',
		width: 120,
	},
	{
		title: '产品名称',
		field: 'skuName',
		width: 150,
	},
	{
		title: 'MSKU',
		field: 'mskuCode',
		width: 120,
	},
	{
		title: '购买数量',
		field: 'orderQuantity',
		width: 100,
	},
	{
		title: '商品单价',
		field: 'unitPrice',
		width: 120,
	},
];

const moduleKey = 'stockinGoods_generatedFailedOrder';

export { columns, moduleKey };
