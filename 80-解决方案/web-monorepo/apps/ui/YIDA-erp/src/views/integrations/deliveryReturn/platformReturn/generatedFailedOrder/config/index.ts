import {
	salesOrgRelation,
	stockOrgRelation,
	productInfoOrgRelation,
	productInfoSku,
	orderProgressOrgRelation,
} from '/@/views/integrations/components/tableRouteConfig';
import type { Columns } from '/@/types/table';
import {
	getPlatformReturnPage,
	getPlatformReturnExport,
	getPlatformReturnPushKingdee,
} from '/@/api/integrations/deliveryReturn/platformReturn/index';
import {
	getStockformTree,
	getPlatformTree,
	getPlatformReturntree,
} from '/@/views/integrations/deliveryReturn/platformReturn/hooks/getParmarsTree';

export const listApi = {
	getList: getPlatformReturnPage,
	exportList: getPlatformReturnExport,
	generateList: getPlatformReturnPushKingdee,
};

/** 金蝶销售组织关系：无数据时跳转与提示 */
const salesOrgEmptyLink = {
	...salesOrgRelation,
	infoTips: '金蝶销售组织信息没有维护,请前往销售组织中维护>>',
};
/** 金蝶库存组织关系：无数据时跳转与提示 */
const stockOrgEmptyLink = {
	...stockOrgRelation,
	infoTips: '金蝶库存组织信息没有维护,请前往库存组织关系中维护>>',
};
/** 订单推送关系：无数据时跳转与提示 */
const orderPushEmptyLink = {
	...orderProgressOrgRelation,
	infoTips: '金蝶订单推送关系没有维护,请前往订单推送关系中维护>>',
};
/** 产品 SKU 关系表（金蝶物料等） */
const productSkuRelationEmptyLink = {
	...productInfoOrgRelation,
	infoTips: '请前往产品SKU关系表中维护>>',
};
/** 产品中心 SKU 管理 */
const skuProductCenterLink = {
	...productInfoSku,
	infoTips: '请前往产品SKU管理表中维护>>',
};

export const searchConfig = [
	{
		component: 'customCascaderApi',
		props: {
			componentType: '',
			settings: {
				code: 'storeIds',
				text: '店铺站点',
				width: 200,
			},
			getData: getPlatformTree,
		},
	},
	{
		component: 'customCascaderApi',
		props: {
			componentType: '',
			settings: {
				code: 'warehouseCodes',
				text: '仓库',
				width: 200,
			},
			getData: getStockformTree,
		},
	},
	{
		component: 'TreeSelectInputApi',
		props: {
			componentType: 'dicts',
			settings: {
				text: '订单类型',
				code: 'orderTypes',
				getTreeDataParams: 'order_type',
			},
		},
	},

	/*
	 * 产品要求：平台退货单集成页面暂时隐藏「退货状态」筛选项。
	 * 原因：当前口径/字典未最终确认，避免用户误筛选导致对账歧义；待后端字段&枚举对齐后再放开。
	 */
	// {
	// 	component: 'customCascaderApi',
	// 	props: {
	// 		componentType: '',
	// 		settings: {
	// 			code: 'returnStatus',
	// 			text: '退货状态',
	// 			width: 200,
	// 		},
	// 		getData: getPlatformReturntree,
	// 	},
	// },
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
					label: '平台订单号',
					value: 'platformReturnOrderNos',
				},
				{
					label: '数据编号',
					value: 'integrationNos',
				},
			],
		},
	},
	{
		component: 'SelectDate',
		props: {
			searchTypes: [
				{
					label: '退货时间(市场)',
					value: 'returnTimeMarket',
					isAddHMS: true,
					dateStart: 'returnTimeMarketStart',
					dateEnd: 'returnTimeMarketEnd',
				},
				{
					label: '退货时间(北京)',
					value: 'returnTime',
					isAddHMS: true,
					dateStart: 'returnTimeStart',
					dateEnd: 'returnTimeEnd',
				},
				{
					label: '订购时间',
					value: 'orderTime',
					isAddHMS: true,
					dateStart: 'orderTimeStart',
					dateEnd: 'orderTimeEnd',
				},
				{
					label: '集成数据创建时间',
					value: 'integrationDataCreateTime',
					isAddHMS: true,
					dateStart: 'integrationDataCreateTimeStart',
					dateEnd: 'integrationDataCreateTimeEnd',
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
		field: 'integrationNo',
		width: 200,
	},
	{
		title: '平台退货订单号',
		field: 'platformReturnOrderNo',
		width: 200,
	},
	{
		title: '平台',
		field: 'platformChannelCode',
		width: 120,
	},
	{
		title: '店铺名称：站点',
		field: 'siteCode',
		width: 200,
		prefixObj: {
			//前缀对象
			field: 'storeName', //前缀字段
			connectStr: '：', //连接符
		},
	},
	{
		title: '仟易仓库名称',
		field: 'qianyiWarehouseName',
		width: 180,
	},
	{
		title: '订单类型',
		field: 'orderTypeText',
		width: 180,
	},
	{
		title: 'SKU',
		field: 'skuCode',
		width: 230,
		slotName: 'RowValueLink',
		slotAttrs: skuProductCenterLink,
	},
	{
		title: '产品名称',
		field: 'skuName',
		width: 180,
	},
	{
		title: 'MSKU',
		field: 'mskuCode',
		width: 180,
	},
	{
		title: '金蝶物料编码',
		field: 'kingdeeMaterialsCode',
		width: 220,
		slotName: 'RowValueLink',
		slotAttrs: productSkuRelationEmptyLink,
	},
	{
		title: '金蝶销售组织名称',
		field: 'kingdeeSalesOrgName',
		width: 220,
		slotName: 'RowValueLink',
		slotAttrs: salesOrgEmptyLink,
	},
	{
		title: '金蝶销售组织编码',
		field: 'kingdeeSalesOrgCode',
		width: 220,
		slotName: 'RowValueLink',
		slotAttrs: salesOrgEmptyLink,
	},
	{
		title: '金蝶退货客户名称',
		field: 'kingdeeReturnCustomerName',
		width: 220,
		slotName: 'RowValueLink',
		slotAttrs: salesOrgEmptyLink,
	},
	{
		title: '金蝶退货客户编码',
		field: 'kingdeeReturnCustomerCode',
		width: 220,
		slotName: 'RowValueLink',
		slotAttrs: salesOrgEmptyLink,
	},
	{
		title: '金蝶调入仓名称',
		field: 'kingdeeInWarehouseName',
		width: 220,
		slotName: 'RowValueLink',
		slotAttrs: stockOrgEmptyLink,
	},
	{
		title: '金蝶调入仓库编码',
		field: 'kingdeeInWarehouseCode',
		width: 220,
		slotName: 'RowValueLink',
		slotAttrs: stockOrgEmptyLink,
	},
	{
		title: '金蝶调出仓名称',
		field: 'kingdeeOutWarehouseName',
		width: 220,
		slotName: 'RowValueLink',
		slotAttrs: salesOrgEmptyLink,
	},
	{
		title: '金蝶调出仓库编码',
		field: 'kingdeeOutWarehouseCode',
		width: 220,
		slotName: 'RowValueLink',
		slotAttrs: salesOrgEmptyLink,
	},
	{
		title: '调入库存组织名称',
		field: 'kingdeeInInventoryOrgName',
		width: 220,
		slotName: 'RowValueLink',
		slotAttrs: stockOrgEmptyLink,
	},
	{
		title: '调入库存组织编码',
		field: 'kingdeeInInventoryOrgCode',
		width: 220,
		slotName: 'RowValueLink',
		slotAttrs: stockOrgEmptyLink,
	},
	{
		title: '调出库存组织名称',
		field: 'kingdeeOutInventoryOrgName',
		width: 220,
		slotName: 'RowValueLink',
		slotAttrs: salesOrgEmptyLink,
	},
	{
		title: '调出库存组织编码',
		field: 'kingdeeOutInventoryOrgCode',
		width: 220,
		slotName: 'RowValueLink',
		slotAttrs: salesOrgEmptyLink,
	},
	{
		title: '订购时间（北京）',
		field: 'orderTime',
		width: 200,
		sortable: true,
	},
	{
		title: '退货时间(北京)',
		field: 'returnTime',
		width: 200,
		sortable: true,
	},
	{
		title: '退货时间(市场)',
		field: 'returnTimeMarket',
		width: 200,
	},
	{
		title: '市场币种',
		field: 'currency',
		width: 120,
	},
	{
		title: '退货类型',
		field: 'returnTypeText',
		width: 180,
	},
	{
		title: '退货数量',
		field: 'returnQuantity',
		width: 120,
	},
	/*
	 * 产品要求：平台退货单集成列表暂时隐藏「退货状态」列。
	 * 原因同筛选：状态口径待确认，先不在列表暴露，避免误解。
	 */
	// {
	// 	title: '退货状态',
	// 	field: 'returnStatus',
	// 	width: 180,
	// },
	{
		title: '退货原因',
		field: 'returnReason',
		width: 180,
	},
	{
		title: '推送单据名称',
		field: 'pullBillTypeText',
		width: 250,
		slotName: 'RowValueLink',
		slotAttrs: orderPushEmptyLink,
	},
	{
		title: '集成数据创建时间',
		field: 'integrationDataCreateTime',
		width: 200,
		sortable: true,
	},
	{
		title: '生成金蝶单据名称',
		field: 'generateKingdeeDocName',
		width: 250,
		slotName: 'RowValueLink',
		slotAttrs: orderPushEmptyLink,
	},
	{
		title: '失败原因',
		field: 'pushErrorReason',
		width: 300,
	},
];

const moduleKey = 'deliveryReturnPlatformReturn_generatedFailedOrder';

export { columns, moduleKey };
