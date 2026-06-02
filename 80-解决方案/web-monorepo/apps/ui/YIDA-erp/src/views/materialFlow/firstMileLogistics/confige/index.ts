// 日期查询配置
export const dateSearchConfig = [
	{
		label: '预计到港时间',
		value: 'eta',
		isAddHMS: true,
		dateStart: 'etaStart',
		dateEnd: 'etaEnd',
	},
	{
		label: '预计到港时间（云当）',
		value: 'etaYd',
		isAddHMS: true,
		dateStart: 'etaYdStart',
		dateEnd: 'etaYdEnd',
	},
	{
		label: '实际到港时间',
		value: 'ata',
		isAddHMS: true,
		dateStart: 'ataStart',
		dateEnd: 'ataEnd',
	},
	{
		label: '入库时间',
		value: 'inStockTime',
		isAddHMS: true,
		dateStart: 'inStockTimeStart',
		dateEnd: 'inStockTimeEnd',
	},
];
