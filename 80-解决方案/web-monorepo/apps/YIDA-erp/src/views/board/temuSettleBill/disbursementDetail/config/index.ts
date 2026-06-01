/*
 * @Description:
 */
/*
 * @Description:
 */
const columns = [
	{
		type: 'checkbox',
		width: 60,
		align: 'center',
		fixed: 'left',
	},
	{
		title: '店铺/站点',
		field: 'storeName',
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
		title: '支出类型',
		field: 'expenseTypeName',
		width: 150,
		fixed: 'left',
	},
	{
		title: '违规编号',
		field: 'violationNumber',
		width: 180,
		fixed: 'left',
	},
	{
		title: '订单编号',
		field: 'orderNumber',
		width: 180,
	},
	{
		title: '支出金额',
		field: 'expenseAmount',
		width: 120,
		sortable: true,
	},
	{
		title: '币种',
		field: 'currency',
		width: 100,
	},
	{
		title: '违规类型',
		field: 'violationTypeName',
		width: 150,
	},
];
const moduleKey = 'temuSettleBillDisbursementDetail';
export { columns, moduleKey };
