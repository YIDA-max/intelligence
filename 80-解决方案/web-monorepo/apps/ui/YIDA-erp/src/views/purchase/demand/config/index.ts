const columns = [
	{
		type: 'checkbox',
		width: 50,
		fixed: 'left',
		align: 'center',
		disabled: true,
	},
	{
		title: '需求单号',
		field: 'demandNo',
		width: 150,
	},
	{
		title: 'SKU',
		field: 'skuCode',
		width: 200,
	},
	{
		title: '产品名称',
		field: 'skuName',
		width: 200,
	},
	{
		title: '计划数量',
		field: 'planNum',
		width: 100,
		isSum: true,
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
		title: '期望提货时间',
		field: 'expectedPickupDate',
		width: 150,
	},
	{
		title: '发货方式',
		field: 'shippingMethodText',
		width: 100,
	},
	{
		title: '状态',
		field: 'statusText',
		width: 100,
	},
	{
		title: '订单类型',
		field: 'orderTypeText',
		width: 80,
	},
	{
		title: '关联供应商',
		field: 'supplierName',
		width: 150,
	},
	{
		title: '采购订单',
		field: 'purchaseNo',
		width: 130,
	},
	{
		title: '采购数量',
		field: 'purchaseNum',
		width: 100,
		isSum: true,
	},
	{
		title: '部门',
		field: 'parentDeptName',
		width: 100,
	},
	{
		title: '运营小组',
		field: 'deptName',
		width: 100,
	},
	{
		title: '运营人员',
		field: 'operationName',
		width: 100,
	},
	{
		title: '备注',
		field: 'remark',
		width: 100,
	},
	{
		title: '物控人员',
		field: 'mcpName',
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
		width: 120,
	},
	{
		title: '操作',
		field: 'action',
		width: 140,
		fixed: 'right',
		disabled: true,
	},
];

export { columns };
