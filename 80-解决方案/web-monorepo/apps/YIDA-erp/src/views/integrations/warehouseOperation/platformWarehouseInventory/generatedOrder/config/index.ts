import {
	stockOrgRelation,
	productInfoOrgRelation,
	productInfoSku,
	virtualShopStock,
} from '/@/views/integrations/components/tableRouteConfig';
import type { Columns } from '/@/types/table';
import {
	getPlatformWarehouseInventoryKingdeePage,
	getPlatformWarehouseInventoryKingdeeExport,
	postPlatformWarehouseInventoryPushKingdee,
} from '/@/api/integrations/warehouseOperation/platformWarehouseInventory/index';

export const listApi = {
	getList: getPlatformWarehouseInventoryKingdeePage,
	exportList: getPlatformWarehouseInventoryKingdeeExport,
	generateList: postPlatformWarehouseInventoryPushKingdee,
};

export const moduleKey = 'platformWarehouseInventory_generatedOrder';

export const searchConfig: Array<{
	component: string;
	props: Record<string, any>;
}> = [
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
			componentType: 'warehouseId',
			settings: {
				code: 'warehouseCodes',
				text: '仟易仓库',
			},
			getDataParams: {
				warehouseTypes: ['3'],
			},
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
		component: 'TreeSelectInputApi',
		props: {
			componentType: 'userList',
			settings: {
				text: '金蝶单据创建人',
				code: 'docCreateIds',
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
		component: 'SelectInput',
		props: {
			searchTypes: [
				{
					label: '金蝶单据号',
					value: 'generateKingdeeDocNos',
				},
			],
			settings: {
				selectStyle: {
					width: '200px',
				},
			},
		},
	},
	{
		component: 'SelectDate',
		props: {
			searchTypes: [
				{
					label: '盘点时间',
					value: 'countDate',
					isAddHMS: true,
					dateStart: 'countDateStart',
					dateEnd: 'countDateEnd',
				},
				{
					label: '集成数据创建时间',
					value: 'createTime',
					isAddHMS: true,
					dateStart: 'createTimeStart',
					dateEnd: 'createTimeEnd',
				},
				{
					label: '金蝶单据生成时间',
					value: 'generateKingdeeDocTime',
					isAddHMS: true,
					dateStart: 'generateKingdeeDocTimeStart',
					dateEnd: 'generateKingdeeDocTimeEnd',
				},
			],
			settings: {
				selectStyle: {
					width: '200px',
				},
			},
		},
	},
];

export const columns: Columns = [
	{
		type: 'checkbox',
		width: 60,
		align: 'center',
		fixed: 'left',
	},
	{
		field: 'integrationNo',
		title: '集成数据编码',
		width: 180,
	},
	{
		field: 'platformChannelCode',
		title: '平台',
		width: 120,
	},
	{
		field: 'siteCode',
		title: '店铺名称：站点',
		width: 150,
		prefixObj: {
			field: 'storeName',
			connectStr: ':',
		},
	},
	{
		field: 'warehouseName',
		title: '仓库',
		width: 150,
		slotName: 'RowValueLink',
		slotAttrs: virtualShopStock,
	},
	{
		field: 'countDate',
		title: '盘点时间',
		width: 160,
	},
	{
		field: 'msku',
		title: 'MSKU',
		width: 150,
	},
	{
		title: 'SKU',
		field: 'skuCode',
		width: 180,
		slotName: 'RowValueLink',
		slotAttrs: productInfoSku,
	},
	{
		field: 'countQuantity',
		title: '盘点数量',
		width: 120,
		align: 'center',
	},
	{
		field: 'countTypeText',
		title: '盘点类型',
		width: 120,
		align: 'center',
	},
	{
		title: '金蝶物料编码',
		field: 'kingdeeMaterialCode',
		width: 180,
		slotName: 'RowValueLink',
		slotAttrs: productInfoOrgRelation,
	},
	{
		title: '金蝶仓库编码',
		field: 'kingdeeWarehouseCode',
		width: 180,
		slotName: 'RowValueLink',
		slotAttrs: stockOrgRelation,
	},
	{
		title: '金蝶仓库名称',
		field: 'kingdeeWarehouseName',
		width: 180,
		slotName: 'RowValueLink',
		slotAttrs: stockOrgRelation,
	},
	{
		title: '金蝶库存组织编码',
		field: 'inventoryOrgCode',
		width: 180,
		slotName: 'RowValueLink',
		slotAttrs: stockOrgRelation,
	},
	{
		title: '金蝶库存组织名称',
		field: 'inventoryOrgName',
		width: 180,
		slotName: 'RowValueLink',
		slotAttrs: stockOrgRelation,
	},
	{
		title: '金蝶部门编码',
		field: 'kingdeeDeptCode',
		width: 180,
		slotName: 'RowValueLink',
		slotAttrs: stockOrgRelation,
	},
	{
		title: '金蝶部门名称',
		field: 'kingdeeDeptName',
		width: 180,
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
		title: '金蝶单据名称',
		field: 'generateKingdeeDocName',
		width: 180,
	},
	{
		title: '金蝶单据编号',
		field: 'generateKingdeeDocNo',
		width: 180,
	},
	{
		title: '金蝶单据生成时间',
		field: 'generateKingdeeDocTime',
		width: 180,
	},
	{
		title: '金蝶单据创建人',
		field: 'kingdeeDocCreateName',
		width: 150,
	},
];
