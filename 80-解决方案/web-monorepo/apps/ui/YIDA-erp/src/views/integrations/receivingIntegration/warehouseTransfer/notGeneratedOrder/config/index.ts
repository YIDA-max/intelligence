import {
	getWarehouseTransferReceiptPage,
	postExportWarehouseTransferReceipt,
	getGenerateWarehouseTransferReceiptKingdeeDoc,
	getUpdateWarehouseTransferReceiptIntegratedData,
} from '/@/api/integrations/receivingIntegration/warehouseTransfer/index';
import {
	stockOrgRelation,
	productInfoOrgRelation,
} from '/@/views/integrations/components/tableRouteConfig';

export const listApi = {
	getList: getWarehouseTransferReceiptPage,
	exportList: postExportWarehouseTransferReceipt,
	generateList: getGenerateWarehouseTransferReceiptKingdeeDoc,
	updateList: getUpdateWarehouseTransferReceiptIntegratedData,
};

export const searchConfig = [
	{
		component: 'customCascaderApi',
		props: {
			componentType: 'warehouseId',
			settings: {
				code: 'takeOutWarehouses', // 调出仓编码
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
				code: 'takeInWarehouses', // 调入仓编码
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
				code: 'kingdeeInInventoryOrgCodes', // 金蝶调入仓库编码（接口无库存组织字段，使用仓库编码）
			},
		},
	},
	{
		component: 'TreeSelectInputApi',
		props: {
			componentType: 'kingdeeOrg',
			settings: {
				text: '金蝶调出库存组织',
				code: 'kingdeeOutInventoryOrgCodes', // 金蝶调出仓库编码（接口无库存组织字段，使用仓库编码）
			},
		},
	},
	{
		component: 'SelectInput',
		props: {
			searchTypes: [
				{
					label: '调拨单号',
					value: 'transferNos', // 调拨单号
				},
				{
					label: 'SKU',
					value: 'skuCodes', // SKU代码
				},
			],
		},
	},
	{
		component: 'SelectDate',
		props: {
			searchTypes: [
				{
					label: '实际发货日期',
					value: 'actualDeliveryDate',
					isAddHMS: true,
					dateStart: 'actualDeliveryDateStart', // 实际收货日期-开始
					dateEnd: 'actualDeliveryDateEnd', // 实际收货日期-结束
				},
				{
					label: '集成数据创建时间',
					value: 'createTime',
					isAddHMS: true,
					dateStart: 'createTimeStart', //集成数据创建时间-开始
					dateEnd: 'createTimeEnd', // 集成数据创建时间-结束
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
		field: 'billNo', // 集成单据编号
		title: '集成单据编号',
		width: 150,
	},
	{
		title: '调拨单号',
		field: 'transferNo', // 调拨单号
		width: 150,
	},
	{
		title: '实际发货日期',
		field: 'actualDeliveryDate', // 实际收货日期
		width: 150,
	},
	{
		title: 'SKU',
		field: 'skuCode', // SKU代码
		width: 150,
	},
	{
		title: '产品名称',
		field: 'productName', // 产品名称
		width: 150,
	},
	{
		title: '发货数量',
		field: 'shipQuantity', // 发货数量
		width: 150,
	},
	{
		title: '发货箱数',
		field: 'shipCartonQuantity', // 发货箱数
		width: 150,
	},
	{
		title: '入库数量',
		field: 'receiptQuantity', // 入库数量
		width: 150,
	},
	{
		title: '入库日期',
		field: 'receiveTime', // 入库日期
		width: 150,
	},
	{
		title: '调出仓编码',
		field: 'takeOutWarehouse', // 调出仓编码
		width: 150,
	},
	{
		title: '调出仓库名称',
		field: 'takeOutWarehouseName', // 调出仓库名称
		width: 150,
	},
	{
		title: '调入仓编码',
		field: 'takeInWarehouse', // 调入仓编码
		width: 150,
	},
	{
		title: '调入仓库名称',
		field: 'takeInWarehouseName', // 调入仓库名称
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
		width: 150,
		slotName: 'RowValueLink',
		slotAttrs: stockOrgRelation,
	},
	{
		title: '金蝶调入仓库编码',
		field: 'kingdeeInWarehouseCode', // 金蝶调入仓库编码
		width: 150,
		slotName: 'RowValueLink',
		slotAttrs: stockOrgRelation,
	},
	{
		title: '金蝶调入仓库名称',
		field: 'kingdeeInWarehouseName', // 金蝶调入仓库名称
		width: 150,
		slotName: 'RowValueLink',
		slotAttrs: stockOrgRelation,
	},
	{
		title: '金蝶调出库存组织编码',
		field: 'kingdeeOutInventoryOrgCode', // 金蝶调出库存组织编码
		width: 170,
		slotName: 'RowValueLink',
		slotAttrs: stockOrgRelation,
	},
	{
		title: '金蝶调出库存组织名称',
		field: 'kingdeeOutInventoryOrgName', // 金蝶调出库存组织名称
		width: 180,
		slotName: 'RowValueLink',
		slotAttrs: stockOrgRelation,
	},
	{
		title: '金蝶调入库存组织编码',
		field: 'kingdeeInInventoryOrgCode', // 金蝶调入库存组织编码
		width: 180,
		slotName: 'RowValueLink',
		slotAttrs: stockOrgRelation,
	},
	{
		title: '金蝶调入库存组织名称',
		field: 'kingdeeInInventoryOrgName', // 金蝶调入库存组织名称
		width: 180,
		slotName: 'RowValueLink',
		slotAttrs: stockOrgRelation,
	},
	{
		title: '交易类型',
		field: 'transactionTypeName', // 交易类型名称
		width: 120,
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

const moduleKey = 'warehouseTransferReceive_notGeneratedOrder';

export { columns, moduleKey };
