/*
 * @Description:
 * @Description:
 */
/*
 * @Description:
 */
const columns = [
	{
		type: 'checkbox',
		width: 60,
		fixed: 'left',
	},
	{
		title: '店铺',
		field: 'shop',
		width: 150,
		fixed: 'left',
	},
	{
		title: '账务时间',
		field: 'accountingTime',
		width: 180,
		fixed: 'left',
		sortable: true,
	},
	{
		title: '账务类型',
		field: 'accountingTypeName',
		width: 150,
		fixed: 'left',
	},
	{
		title: '币种',
		field: 'currency',
		width: 100,
	},
	{
		title: '收支金额',
		field: 'amount',
		width: 120,
		sortable: true,
	},
	{
		title: '备注',
		field: 'remark',
		width: 200,
	},
];

const moduleKey = 'temuSettleBillAccountingDetail';
export { columns, moduleKey };
