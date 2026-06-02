import {
	salesOrgRelation,
	stockOrgRelation,
	productInfoOrgRelation,
	productInfoSku,
} from '/@/views/integrations/components/tableRouteConfig';
import {
	getAmazonRemovePage,
	getAmazonRemoveExport,
	postGenerateAmazonRemoveBill,
} from '/@/api/integrations/warehouseOperation/amazonRemove/index';

export const listApi = {
	getList: getAmazonRemovePage,
	exportList: getAmazonRemoveExport,
	generateList: postGenerateAmazonRemoveBill,
};

export const searchConfig = [
	{
		component: 'TreeSelectInputApi',
		props: {
			componentType: 'warehouseInfo',
			settings: {
				text: '仟易仓库',
				code: 'warehouseCodes',
				getTreeDataParams: { size: 999, current: 1 },
			},
		},
	},
	{
		component: 'TreeSelectInputApi',
		props: {
			componentType: 'kingdeeOrg',
			settings: {
				text: '金蝶库存组织',
				code: 'kingdeeInventoryOrgCodes',
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
		component: 'SelectInput',
		props: {
			searchTypes: [
				{
					label: '移除订单号',
					value: 'removalOrderIds',
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
					label: '集成数据编号',
					value: 'integrationNos',
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
					label: '集成数据创建时间',
					value: 'paymentTime',
					isAddHMS: true,
					dateStart: 'integrationCreateTimeStart',
					dateEnd: 'integrationCreateTimeEnd',
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
const columns = [
	{
		type: 'checkbox',
		width: 60,
		align: 'center',
		fixed: 'left',
	},
	{
		field: 'integrationNo',
		title: '集成数据编码',
		width: 150,
	},
	{
		title: '平台',
		field: 'platformChannelCode',
		width: 150,
	},
	{
		title: '店铺站点',
		field: 'siteCode',
		width: 200,
		prefixObj: {
			//前缀对象
			field: 'storeName', //前缀字段
			connectStr: '：', //连接符
		},
	},
	{
		title: '仓库名称',
		field: 'warehouseName',
		width: 200,
	},
	{
		title: '移除订单号',
		field: 'removalOrderId',
		width: 200,
	},

	{
		title: 'MSKU',
		field: 'mskuCode',
		width: 200,
	},
	{
		title: 'SKU',
		field: 'skuCode',
		width: 200,
		slotName: 'RowValueLink',
		slotAttrs: productInfoSku,
	},
	{
		title: '移除数量',
		field: 'removalQuantity',
		width: 200,
		sortable: true,
	},
	{
		title: '金蝶物料编码',
		field: 'kingdeeMaterialCode',
		width: 220,
		slotName: 'RowValueLink',
		slotAttrs: productInfoOrgRelation,
	},
	{
		title: '金蝶仓库编码',
		field: 'kingdeeWarehouseCode',
		width: 200,
		slotName: 'RowValueLink',
		slotAttrs: stockOrgRelation,
	},
	{
		title: '金蝶仓库名称',
		field: 'kingdeeWarehouseName',
		width: 200,
		slotName: 'RowValueLink',
		slotAttrs: stockOrgRelation,
	},
	{
		title: '金蝶库存组织编码',
		field: 'kingdeeInventoryOrgCode',
		width: 200,
		slotName: 'RowValueLink',
		slotAttrs: stockOrgRelation,
	},
	{
		title: '金蝶库存组织名称',
		field: 'kingdeeInventoryOrgName',
		width: 200,
		slotName: 'RowValueLink',
		slotAttrs: stockOrgRelation,
	},

	{
		title: '金蝶部门编码',
		field: 'kingdeeDeptCode',
		width: 200,
		slotName: 'RowValueLink',
		slotAttrs: stockOrgRelation,
	},
	{
		title: '金蝶部门名称',
		field: 'kingdeeDeptName',
		width: 200,
		slotName: 'RowValueLink',
		slotAttrs: stockOrgRelation,
	},
	{
		title: '集成数据创建时间',
		field: 'integrationCreateTime',
		width: 200,
		sortable: true,
	},
	{
		title: '移除时间',
		field: 'removalTime',
		width: 200,
		sortable: true,
	},
];

const moduleKey = 'amazonRemove_notGeneratedOrder';

export { columns, moduleKey };
