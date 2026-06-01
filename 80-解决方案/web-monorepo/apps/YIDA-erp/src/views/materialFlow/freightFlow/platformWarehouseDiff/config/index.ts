import { productInfoOrgRelation } from '/@/views/integrations/components/tableRouteConfig';
import type { Columns } from '/@/types/table';
import {
	getKingdeeShipmentDiffPage,
	postKingdeeShipmentDiffExport,
	getPlatformWarehouseReceiveDetail,
	postKingdeeShipmentDiffHandle,
} from '/@/api/materialFlow/freightFlow/platformWarehouseDiff/index';

export const listApi = {
	getList: getKingdeeShipmentDiffPage,
	exportList: postKingdeeShipmentDiffExport,
	getReceiveDetail: getPlatformWarehouseReceiveDetail,
	handleDiff: postKingdeeShipmentDiffHandle,
	generateList: getPlatformWarehouseReceiveDetail,
};

export const searchConfig = [
	{
		component: 'TreeSelectInputApi',
		props: {
			componentType: 'dicts',
			settings: {
				code: 'platforms',
				text: '平台',
				getTreeDataParams: 'platform_channel',
			},
		},
	},
	{
		component: 'TreeSelectInputApi',
		props: {
			componentType: 'dicts',
			settings: {
				code: 'matchStatus',
				text: '匹配状态',
				getTreeDataParams: 'match_status',
			},
		},
	},
	{
		component: 'TreeSelectInputApi',
		props: {
			componentType: 'dicts',
			settings: {
				code: 'handledDiffStatus',
				text: '差异处理状态',
				getTreeDataParams: 'diff_handle_status',
			},
		},
	},
	{
		component: 'TreeSelectInputApi',
		props: {
			componentType: 'warehouseInfo',
			settings: {
				code: 'destinationWarehouseCodes',
				text: '目的仓',
				getTreeDataParams: { size: 5000, current: 1 },
			},
		},
	},
	{
		component: 'SelectInput',
		props: {
			searchTypes: [
				{
					label: 'Shipment ID',
					value: 'shipmentIds',
				},
				{
					label: '调拨单号',
					value: 'transferOrderNos',
				},
				{
					label: '发货单号',
					value: 'deliveryNos',
				},
				{
					label: 'SKU',
					value: 'skuCodes',
				},
				{
					label: 'MSKU',
					value: 'mskuCodes',
				},
			],
		},
	},
	{
		component: 'SelectDate',
		props: {
			searchTypes: [
				{
					label: '收货时间',
					value: 'receiveDate',
					isAddHMS: false,
					dateStart: 'receiveDateStart',
					dateEnd: 'receiveDateEnd',
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
		title: 'Shipment ID',
		field: 'shipmentId',
		width: 150,
	},
	{
		title: '货件单状态',
		field: 'shipmentStatus',
		width: 120,
	},
	{
		title: '平台',
		field: 'platform',
		width: 100,
	},
	{
		title: '目的仓',
		field: 'destinationWarehouseName',
		width: 150,
	},
	{
		title: '调货单号',
		field: 'transferOrderNo',
		width: 180,
	},
	{
		title: '发货单号',
		field: 'deliveryNo',
		width: 180,
	},
	{
		title: '匹配状态',
		field: 'matchStatus',
		width: 100,
	},
	{
		title: '差异处理状态',
		field: 'handledDiffStatusValue',
		width: 130,
	},
	{
		title: 'MSKU',
		field: 'mskuCode',
		width: 180,
	},
	{
		title: 'SKU',
		field: 'skuCode',
		width: 180,
		slotName: 'RowValueLink',
		slotAttrs: productInfoOrgRelation,
	},
	{
		title: '产品名称',
		field: 'productName',
		width: 200,
	},
	{
		title: '发货数量',
		field: 'shipQuantity',
		width: 100,
	},
	{
		title: '收货数量',
		field: 'receiveQuantity',
		width: 100,
	},
	{
		title: '收货时间',
		field: 'lastReceiveDate',
		width: 180,
	},
	{
		title: '差异数量',
		field: 'diffQuantity',
		width: 100,
		tips: '差异数量=收货数量-发货数量',
	},
	{
		title: '已处理差异数量',
		field: 'handledDiffQuantity',
		width: 140,
	},
	{
		title: '操作',
		field: 'action',
		width: 200,
		fixed: 'right',
		disabled: true,
	},
];

// 收货详情弹窗的列配置
export const receiveDetailColumns: Columns = [
	{
		title: 'SKU',
		field: 'skuCode',
		width: 180,
	},
	{
		title: 'MSKU',
		field: 'mskuCode',
		width: 180,
	},
	{
		title: '收货数量',
		field: 'receiveQuantity',
		width: 120,
	},
	{
		title: '收货时间',
		field: 'receiveDate',
		width: 160,
	},
	{
		title: '仓库名称',
		field: 'qianyiWarehouseName',
		width: 150,
	},
];

const moduleKey = 'platformWarehouseDiff';

export { columns, moduleKey };
