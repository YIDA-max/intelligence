const columns = [
	{
		type: 'checkbox',
		width: 40,
		fixed: 'left',
		disabled: true,
	},
	{
		title: '店铺/站点',
		field: 'siteStore',
		width: 200,
	},
	{
		title: '全球贸易项目代码',
		field: 'gtin',
		width: 150,
	},
	{
		title: 'Msku',
		field: 'msku',
		width: 180,
	},
	{
		title: 'SKU/产品名称',
		field: 'skuName',
		width: 200,
		slot: 'skuName',
	},

	{
		title: '商品 ID',
		field: 'productId',
		width: 180,
	},

	{
		title: '商品名称',
		field: 'productName',
		width: 180,
	},
	{
		title: '长度（英寸）',
		field: 'length',
		width: 180,
	},
	{
		title: '宽度（英寸）',
		field: 'width',
		width: 150,
	},
	{
		title: '高度（英寸）',
		field: 'height',
		width: 200,
	},
	{
		title: '重量（磅）',
		field: 'weight',
		width: 120,
	},
	{
		title: '常规：单位每日仓储费',
		field: 'standardDailyStorageFee',
		width: 250,
		sortable: true,
	},
	{
		title: '旺季：单位每日仓储费',
		field: 'peakDailyStorageFee',
		width: 250,
		sortable: true,
	},
	{
		title: '长期：单位每日仓储费',
		field: 'longTermDailyStorageFee',
		width: 250,
		sortable: true,
	},
	{
		title: '常规：平均可用数量',
		field: 'standardAverageUnitsAvailable',
		width: 250,
		sortable: true,
	},
	{
		title: '旺季：平均可用数量',
		field: 'peakAverageUnitsAvailable',
		width: 250,
		sortable: true,
	},
	{
		title: '长期：平均可用数量',
		field: 'longTermAverageUnitsAvailable',
		width: 250,
		sortable: true,
	},
	{
		title: '报告期天数',
		field: 'daysReportPeriod',
		width: 250,
	},
	{
		title: '最终仓储费',
		field: 'finalStorageFee',
		width: 150,
		sortable: true,
	},
	{
		title: '原始金额',
		field: 'originalAmount',
		width: 150,
		sortable: true,
	},
	{
		title: '折扣节省金额',
		field: 'discountSavings',
		width: 200,
		sortable: true,
	},
	{
		title: '创建时间',
		field: 'createTime',
		width: 150,
	},
];

export { columns };
