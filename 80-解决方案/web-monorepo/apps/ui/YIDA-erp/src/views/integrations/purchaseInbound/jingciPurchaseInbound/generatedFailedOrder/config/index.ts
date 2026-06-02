import {
	salesOrgRelation,
	stockOrgRelation,
	productInfoOrgRelation,
} from '/@/views/integrations/components/tableRouteConfig';
import type { Columns } from '/@/types/table';
import {
	getJingciPurchaseInboundPage,
	getJingciPurchaseInboundExport,
	generateJingciPurchaseInboundBill,
} from '/@/api/integrations/purchaseInbound/jingciPurchaseInbound/index';

export const listApi = {
	getList: getJingciPurchaseInboundPage,
	exportList: getJingciPurchaseInboundExport,
	generateList: generateJingciPurchaseInboundBill,
};

export const searchConfig = [
	{
		component: 'TreeSelectInputApi',
		props: {
			componentType: 'kingdeeOrg',
			settings: {
				code: 'kingdeeInventoryOrgCodes',
				text: '金蝶库存组织',
			},
		},
	},
	{
		component: 'SelectInput',
		props: {
			searchTypes: [
				{
					label: '订柜单号',
					value: 'orderContainerNos',
				},
				{
					label: '发货单号',
					value: 'deliveryNos',
				},
				{
					label: 'SKU代码',
					value: 'skuCodes',
				},
				{
					label: '金蝶单据编号',
					value: 'generateKingdeeDocNos',
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
		width: 180,
	},
	{
		title: '订柜单号',
		field: 'orderContainerNo',
		width: 180,
	},
	{
		title: '发货单号',
		field: 'deliveryNo',
		width: 180,
	},
	{
		title: 'SKU代码',
		field: 'skuCode',
		width: 150,
	},
	{
		title: '产品名称',
		field: 'skuName',
		width: 200,
	},
	{
		title: '金蝶物料编码',
		field: 'kingdeeMaterialCode',
		width: 150,
		slotName: 'RowValueLink',
		slotAttrs: productInfoOrgRelation,
	},
	{
		title: '入库数量',
		field: 'inboundQuantity',
		width: 120,
	},
	{
		title: '入库日期',
		field: 'inboundDate',
		width: 150,
	},
	{
		title: '仟易仓库编码',
		field: 'qianyiWarehouseCode',
		width: 150,
	},
	{
		title: '仟易仓库名称',
		field: 'qianyiWarehouseName',
		width: 150,
	},
	{
		title: '金蝶调出仓库编码',
		field: 'kingdeeOutWarehouseCode', // 金蝶调出仓库编码
		width: 180,
		slotName: 'RowValueLink',
		slotAttrs: stockOrgRelation,
	},
	{
		title: '金蝶调出仓库名称',
		field: 'kingdeeOutWarehouseName', // 金蝶调出仓库名称
		width: 150,
		slotName: 'RowValueLink',
		slotAttrs: stockOrgRelation,
	},
	{
		title: '金蝶调入仓库编码',
		field: 'kingdeeWarehouseCode',
		width: 180,
		slotName: 'RowValueLink',
		slotAttrs: stockOrgRelation,
	},
	{
		title: '金蝶调入仓库名称',
		field: 'kingdeeWarehouseName',
		width: 150,
		slotName: 'RowValueLink',
		slotAttrs: stockOrgRelation,
	},
	{
		title: '金蝶库存组织编码',
		field: 'kingdeeInventoryOrgCode',
		width: 180,
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

const moduleKey = 'purchaseInboundJingciPurchaseInbound_generatedFailedOrder';

export { columns, moduleKey };
