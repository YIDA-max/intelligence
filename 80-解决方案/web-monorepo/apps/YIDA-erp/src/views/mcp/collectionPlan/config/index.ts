const columns = [
	{
		type: 'checkbox',
		width: 50,
		fixed: 'left',
		align: 'center',
		disabled: true,
	},
	{
		title: '提货单号',
		field: 'pickupOrderNo',
		width: 150,
	},
	{
		title: '状态',
		field: 'statusText',
		width: 150,
	},
	{
		title: '取消状态',
		field: 'cancelStatusText',
		width: 150,
	},
	{
		title: '备注',
		field: 'remark',
		width: 100,
	},
	{
		title: 'SKU',
		field: 'skuCode',
		width: 150,
	},
	{
		title: '产品名称',
		field: 'skuName',
		width: 200,
	},
	{
		title: '已推发货数量',
		field: 'pushedShippingQuantity',
		width: 150,
	},
	{
		title: '40HQ预估装柜数量',
		field: 'estimatedContainerQuantity',
		width: 170,
		tips: '按68m³计算',
	},
	{
		title: '提货数量',
		field: 'pickupQuantity',
		width: 100,
	},
	{
		title: '计划提货日期',
		field: 'plannedPickupDate',
		width: 150,
	},
	{
		title: '加急日期',
		field: 'urgentDate',
		width: 150,
	},
	{
		title: '工厂回复交期',
		field: 'factoryDeliveryDate',
		width: 150,
	},
	{
		title: '需求单号',
		field: 'demandOrderNo',
		width: 150,
	},
	{
		title: '国家',
		field: 'countryCode',
		width: 100,
	},
	{
		title: '渠道',
		field: 'platformChannelCodeText',
		width: 100,
	},
	{
		title: 'MSKU',
		field: 'mskuCode',
		width: 100,
	},
	{
		title: '发货方式',
		field: 'shippingMethodText',
		width: 100,
	},
	{
		title: '运输方式',
		field: 'transportMethodText',
		width: 130,
		formatter: (row: any) =>
			row.transportMethodText ||
			row.collectionPlanMessage?.transportMethod ||
			row.transportMethod ||
			'---',
	},
	{
		title: '订单类型',
		field: 'orderTypeText',
		width: 100,
	},
	{
		title: '部门',
		field: 'departmentText',
		width: 100,
	},
	{
		title: '运营小组',
		field: 'deptText',
		width: 100,
	},
	{
		title: '运营人',
		field: 'operationText',
		width: 100,
	},
	{
		title: '采购订单',
		field: 'purchaseOrderNo',
		width: 100,
	},
	{
		title: '采购数量',
		field: 'purchaseNum',
		width: 100,
	},
	{
		title: '采购人',
		field: 'purchaseUserName',
		width: 100,
	},
	{
		title: '创建人',
		field: 'createName',
		width: 100,
	},
	{
		title: '创建时间',
		field: 'createTime',
		width: 150,
	},
	{
		title: '运营确认时间',
		field: 'operationConfirmTime',
		width: 150,
	},
	{
		title: '操作',
		field: 'action',
		width: 80,
		fixed: 'right',
		disabled: true,
	},
];

export { columns };
