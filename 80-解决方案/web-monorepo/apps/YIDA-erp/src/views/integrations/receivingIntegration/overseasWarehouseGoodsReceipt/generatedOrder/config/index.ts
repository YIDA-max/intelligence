import {
	salesOrgRelation,
	stockOrgRelation,
} from '/@/views/integrations/components/tableRouteConfig';
import {
	getwarhouseGoodsPage,
	getwarhouseGoodsExport,
	postGenerateWarhouseGoods,
	postUpdateIntegratedData,
} from '/@/api/integrations/receivingIntegration/overseasWarehouseGoodsReceipt/index';
import { update } from 'lodash';

export const listApi = {
	getList: getwarhouseGoodsPage,
	exportList: getwarhouseGoodsExport,
};
export const searchConfig = [
	{
		component: 'customCascaderApi',
		props: {
			componentType: 'warehouseId',
			settings: {
				code: 'outWarehouseNames',
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
				code: 'inWarehouseNames',
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
				code: 'kingdeeInOrgCodes',
			},
		},
	},
	{
		component: 'TreeSelectInputApi',
		props: {
			componentType: 'kingdeeOrg',
			settings: {
				text: '金蝶调出库存组织',
				code: 'kingdeeOutOrgCodes',
			},
		},
	},
	{
		component: 'TreeSelectInputApi',
		props: {
			componentType: 'userList',
			settings: {
				text: '金蝶单据创建人',
				code: 'creatorIds',
			},
		},
	},
	{
		component: 'SelectInput',
		props: {
			searchTypes: [
				{
					label: '调拨单号',
					value: 'transferOrderNos',
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
					value: 'skus',
				},
			],
		},
	},
	{
		component: 'SelectInput',
		props: {
			searchTypes: [
				{
					label: '金蝶单据编号',
					value: 'kingdeeDocNos',
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
					value: 'paymentTime',
					isAddHMS: true,
					dateStart: 'integrationDataCreateTimeStart',
					dateEnd: 'integrationDataCreateTimeEnd',
				},
				{
					label: '实际发货日期',
					value: 'updateTime',
					isAddHMS: true,
					dateStart: 'actualDeliveryDateStart',
					dateEnd: 'actualDeliveryDateEnd',
				},
				{
					label: '生成金蝶单据时间',
					value: 'kingdeeBillCreateTime',
					isAddHMS: true,
					dateStart: 'generateTimeStart',
					dateEnd: 'generateTimeEnd',
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
		field: 'integrationDocNo',
		title: '集成单据编号',
		width: 150,
		sortable: true,
	},
	{
		title: '调拨单号',
		field: 'transferOrderNo',
		width: 150,
		sortable: true,
	},
	{
		title: '发货单号',
		field: 'deliveryNo',
		width: 150,
		sortable: true,
	},
	{
		title: '实际发货日期',
		field: 'actualShipDate',
		width: 150,
		sortable: true,
	},
	{
		title: 'SKU',
		field: 'sku',
		width: 150,
		sortable: true,
	},
	{
		title: '产品名称',
		field: 'productName',
		width: 150,
	},
	{
		title: '金蝶单据名称',
		field: 'kingdeeBillName',
		width: 150,
		sortable: true,
	},
	{
		title: '金蝶单据编号',
		field: 'kingdeeBillNo',
		width: 150,
		sortable: true,
	},

	{
		title: '金蝶单据生成时间',
		field: 'kingdeeDocTime',
		width: 150,
		sortable: true,
	},
	{
		title: '金蝶单据创建人',
		field: 'kingdeeDocCreateName',
		width: 150,
		sortable: true,
	},
	{
		title: '发货数量',
		field: 'shipQty',
		width: 150,
		sortable: true,
	},
	{
		title: '发货箱数',
		field: 'shipCartonCount',
		width: 150,
		sortable: true,
	},
	{
		title: '入库数量',
		field: 'inboundQty',
		width: 150,
		sortable: true,
	},
	{
		title: '入库日期',
		field: 'receiveTime',
		width: 150,
		sortable: true,
	},
	{
		title: '调出仓库编码',
		field: 'outWarehouseCode',
		width: 150,
		sortable: true,
	},
	{
		title: '调出仓库名称',
		field: 'outWarehouseName',
		width: 150,
	},
	{
		title: '调入仓库编码',
		field: 'inWarehouseCode',
		width: 150,
		sortable: true,
	},
	{
		title: '调入仓库名称',
		field: 'inWarehouseName',
		width: 150,
	},
	{
		title: '金蝶调出仓库编码',
		field: 'kingdeeOutWhCode',
		width: 180,
		sortable: true,
		slotName: 'RowValueLink',
		slotAttrs: stockOrgRelation,
	},
	{
		title: '金蝶调出仓库名称',
		field: 'kingdeeOutWhName',
		width: 150,
		slotName: 'RowValueLink',
		slotAttrs: stockOrgRelation,
	},
	{
		title: '金蝶调入仓库编码',
		field: 'kingdeeInWhCode',
		width: 150,
		sortable: true,
		slotName: 'RowValueLink',
		slotAttrs: stockOrgRelation,
	},
	{
		title: '金蝶调入仓库名称',
		field: 'kingdeeInWhName',
		width: 150,
		slotName: 'RowValueLink',
		slotAttrs: stockOrgRelation,
	},
	{
		title: '金蝶调出库存组织编码',
		field: 'kingdeeOutOrgCode',
		width: 170,
		sortable: true,
		slotName: 'RowValueLink',
		slotAttrs: stockOrgRelation,
	},
	{
		title: '金蝶调出库存组织名称',
		field: 'kingdeeOutOrgName',
		width: 180,
		slotName: 'RowValueLink',
		slotAttrs: stockOrgRelation,
	},
	{
		title: '金蝶调入库存组织编码',
		field: 'kingdeeInOrgCode',
		width: 180,
		sortable: true,
		slotName: 'RowValueLink',
		slotAttrs: stockOrgRelation,
	},
	{
		title: '金蝶调入库存组织名称',
		field: 'kingdeeInOrgName',
		width: 180,
		slotName: 'RowValueLink',
		slotAttrs: stockOrgRelation,
	},
	{
		title: '交易类型',
		field: 'transactionTypeName',
		width: 120,
	},
	{
		title: '调拨单创建时间',
		field: 'transferOrderCreateTime',
		width: 150,
		sortable: true,
	},
	{
		title: '集成数据创建时间',
		field: 'integrationDataCreateTime',
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

const moduleKey = 'overseasWarehouseGoodsReceipt_generatedOrder';

export { columns, moduleKey };
