import {
	salesOrgRelation,
	stockOrgRelation,
	productInfoOrgRelation,
} from '/@/views/integrations/components/tableRouteConfig';
import type { Columns } from '/@/types/table';
import {
	getInOutInventoryKingdeePage,
	getInOutInventoryKingdeeExport,
	postInOutInventoryKingdeePushKingdee,
	postInOutInventoryKingdeeUpdata,
} from '/@/api/integrations/warehouseOutInIntegration/index';

export const listApi = {
	getList: getInOutInventoryKingdeePage,
	exportList: getInOutInventoryKingdeeExport,
	generateList: postInOutInventoryKingdeePushKingdee,
	updateList: postInOutInventoryKingdeeUpdata,
};

export const searchConfig = [
	{
		component: 'customCascaderApi',
		props: {
			componentType: 'warehouseId',
			settings: {
				code: 'warehouseCodes',
				text: '仟易仓库',
			},
			blacklist: ['2'],
		},
	},
	{
		component: 'TreeSelectInputApi',
		props: {
			componentType: 'kingdeeOrg',
			settings: {
				code: 'inventoryOrgCodes',
				text: '金蝶库存组织',
			},
		},
	},
	{
		component: 'SelectInput',
		props: {
			searchTypes: [
				{
					label: '来源单据号',
					value: 'otherInOutNos',
				},
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
		title: '集成单据编号',
		field: 'billNo',
		width: 200,
	},
	{
		title: '来源单据',
		field: 'sourceBillTypeText',
		width: 120,
	},
	{
		title: '来源单据编号',
		field: 'otherInOutNo',
		width: 180,
	},
	{
		title: '调拨单号',
		field: 'transferNo',
		width: 180,
	},
	{
		title: '货件单号',
		field: 'shipmentId',
		width: 180,
	},
	{
		title: 'SKU',
		field: 'skuCode',
		width: 180,
	},
	{
		title: '产品名称',
		field: 'skuName',
		width: 200,
	},
	{
		title: '出库/入库数量',
		field: 'quantity',
		width: 130,
	},
	{
		title: '出/入库日期',
		field: 'sourceFinishDate',
		width: 180,
	},
	{
		title: '备注',
		field: 'remark',
		width: 200,
	},
	{
		title: '仟易仓库编码',
		field: 'warehouseCode',
		width: 150,
	},
	{
		title: '仟易仓库名称',
		field: 'warehouseName',
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
		title: '金蝶仓库编码',
		field: 'kingdeeWarehouseCode',
		width: 150,
		slotName: 'RowValueLink',
		slotAttrs: stockOrgRelation,
	},
	{
		title: '金蝶仓库名称',
		field: 'kingdeeWarehouseName',
		width: 150,
		slotName: 'RowValueLink',
		slotAttrs: stockOrgRelation,
	},
	{
		title: '金蝶库存组织编码',
		field: 'inventoryOrgCode',
		width: 160,
		slotName: 'RowValueLink',
		slotAttrs: stockOrgRelation,
	},
	{
		title: '金蝶库存组织名称',
		field: 'inventoryOrgName',
		width: 160,
		slotName: 'RowValueLink',
		slotAttrs: stockOrgRelation,
	},
	{
		title: '金蝶部门编码',
		field: 'kingdeeDeptCode',
		width: 160,
		slotName: 'RowValueLink',
		slotAttrs: stockOrgRelation,
	},
	{
		title: '金蝶部门名称',
		field: 'kingdeeDeptName',
		width: 160,
		slotName: 'RowValueLink',
		slotAttrs: stockOrgRelation,
	},
	{
		title: '集成数据创建时间',
		field: 'createTime',
		width: 180,
		sortable: true,
	},
	{
		title: '失败原因',
		field: 'pushErrorReason',
		width: 250,
	},
];

const moduleKey = 'shippingIntegrationPlatformLoss_notGeneratedOrder';

export { columns, moduleKey };
