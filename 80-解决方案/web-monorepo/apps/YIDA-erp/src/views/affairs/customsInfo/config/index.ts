export const columns = [
	{
		type: 'checkbox',
		width: 40,
		align: 'center',
		fixed: 'left',
	},
	{
		field: 'skuCode',
		title: 'SKU',
		width: 180,
		sortable: true,
		fixed: 'left',
	},
	{
		field: 'skuName',
		title: '产品名称',
		width: 130,
		sortable: true,
		fixed: 'left',
	},
	{
		field: 'chineseName',
		title: '中文品名',
		width: 130,
		sortable: true,
	},
	{
		field: 'enName',
		title: '英文品名',
		width: 130,
		sortable: true,
	},
	{
		field: 'customsCode',
		title: 'HS编码',
		width: 130,
		sortable: true,
	},
	{
		field: 'decItems',
		title: '申报要素',
		width: 130,
	},
	{
		field: 'legalUnit',
		title: '法定第一单位',
		width: 180,
	},
	{
		field: 'mfnRate',
		title: '最惠国进口税率(%)',
		width: 180,
	},
	{
		field: 'exportRebateRate',
		title: '出口退税率(%)',
		width: 140,
	},
	{
		field: 'customsSupervisionCondition',
		title: '海关监管条件',
		width: 140,
	},
	{
		field: 'createTime',
		title: '创建时间',
		width: 130,
		sortable: true,
	},
	{
		field: 'updateTime',
		title: '更新时间',
		width: 130,
		sortable: true,
	},
	{
		field: 'action',
		title: '操作',
		width: 150,
		fixed: 'right',
	},
];
