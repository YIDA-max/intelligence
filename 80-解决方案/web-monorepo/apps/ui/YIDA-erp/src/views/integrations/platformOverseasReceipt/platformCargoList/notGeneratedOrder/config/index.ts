import {
	stockOrgRelation,
	productInfoSku,
	productInfoOrgRelation,
} from '/@/views/integrations/components/tableRouteConfig';
import {
	getGeneratedKingdeeBillPage,
	exportGeneratedKingdeeBill,
	postGenerateKingdeeBill,
} from '/@/api/integrations/platformOverseasReceipt/platformCargoList/notGeneratedOrder';
import { update } from 'lodash';

export const listApi = {
	getList: getGeneratedKingdeeBillPage,
	exportList: exportGeneratedKingdeeBill,
	generateList: postGenerateKingdeeBill,
};
export const searchConfig = [
	{
		component: 'TreeSelectInputApi',
		props: {
			componentType: 'dicts',
			settings: {
				text: '平台',
				code: 'platforms',
				getTreeDataParams: 'platform_channel',
			},
		},
	},

	{
		component: 'TreeSelectInputApi',
		props: {
			componentType: 'warehouseInfo',
			settings: {
				text: '调入仓',
				code: 'qianyiWarehouseCodes',
				getTreeDataParams: { size: 999, current: 1 },
			},
		},
	},

	{
		component: 'customCascaderApi',
		props: {
			componentType: 'siteStoreId',
			settings: {
				code: 'storeSiteNames',
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
					label: '货件号',
					value: 'shipmentIds',
				},
				{
					label: '调拨单号',
					value: 'transferOrderNos',
				},
				{
					label: '集成数据编号',
					value: 'dataNos',
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
const columns = [
	{
		type: 'checkbox',
		width: 60,
		align: 'center',
		fixed: 'left',
	},
	{
		title: '集成数据编号',
		field: 'dataNo',
		width: 150,
	},
	{
		title: '货件单号',
		field: 'shipmentId',
		width: 150,
	},
	{
		title: '调拨单号',
		field: 'transferOrderNo',
		width: 150,
	},
	{
		title: '发货单号',
		field: 'deliveryNo',
		width: 150,
	},
	{
		title: '平台',
		field: 'platform',
		width: 150,
	},
	{
		title: '店铺名称：站点',
		field: 'storeSiteName',
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
		title: '产品名称',
		field: 'productName',
		width: 150,
	},
	{
		title: '仟易调入仓',
		field: 'qianyiWarehouseName',
		width: 150,
	},
	{
		title: 'SKU预报数量',
		field: 'shipQuantity',
		width: 200,
	},

	{
		title: '收货数量',
		field: 'receiveQuantity',
		width: 180,
	},
	{
		title: '收货状态',
		field: 'shipmentStatus',
		width: 180,
	},
	{
		title: '收货日期',
		field: 'receiveDate',
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
		field: 'kingdeeOutWarehouseCode', // 金蝶调出仓库编码
		width: 180,
		slotName: 'RowValueLink',
		slotAttrs: stockOrgRelation,
	},
	{
		title: '金蝶调出仓库名称',
		field: 'kingdeeOutWarehouseName', // 金蝶调出仓库名称
		width: 180,
		slotName: 'RowValueLink',
		slotAttrs: stockOrgRelation,
	},
	{
		title: '金蝶调入仓库编码',
		field: 'kingdeeInWarehouseCode', // 金蝶调入仓库编码
		width: 180,
		slotName: 'RowValueLink',
		slotAttrs: stockOrgRelation,
	},
	{
		title: '金蝶调入仓库名称',
		field: 'kingdeeInWarehouseName', // 金蝶调入仓库名称
		width: 180,
		slotName: 'RowValueLink',
		slotAttrs: stockOrgRelation,
	},
	{
		title: '金蝶调出库存组织编码',
		field: 'kingdeeOutStockOrgCode', // 金蝶调出库存组织编码
		width: 180,
		slotName: 'RowValueLink',
		slotAttrs: stockOrgRelation,
	},
	{
		title: '金蝶调出库存组织名称',
		field: 'kingdeeOutStockOrgName', // 金蝶调出库存组织名称
		width: 180,
		slotName: 'RowValueLink',
		slotAttrs: stockOrgRelation,
	},
	{
		title: '金蝶调入库存组织编码',
		field: 'kingdeeInStockOrgCode', // 金蝶调入库存组织编码
		width: 180,
		slotName: 'RowValueLink',
		slotAttrs: stockOrgRelation,
	},
	{
		title: '金蝶调入库存组织名称',
		field: 'kingdeeInStockOrgName', // 金蝶调入库存组织名称
		width: 180,
		slotName: 'RowValueLink',
		slotAttrs: stockOrgRelation,
	},
	{
		title: '调拨单创建时间',
		field: 'transferOrderCreateTime', // 调拨单创建时间
		width: 150,
	},
	{
		title: '集成数据创建时间',
		field: 'createTime', // 集成数据创建时间
		width: 180,
	},
];

const moduleKey = 'platformCargoList_notGeneratedOrder';

export { columns, moduleKey };
