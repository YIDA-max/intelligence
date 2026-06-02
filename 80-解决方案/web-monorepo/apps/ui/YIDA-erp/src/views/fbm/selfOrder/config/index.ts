import type { Columns } from '/@/types/table';

const columns: Columns = [
	{
		type: 'checkbox',
		width: 40,
		fixed: 'left',
		align: 'center',
	},
	{
		title: '订单明细',
		field: 'orderDetail',
		minWidth: 600,
	},
	{
		title: '订单金额',
		field: 'orderMoney',
		minWidth: 250,
	},
	{
		title: '时间',
		field: 'orderTime',
		minWidth: 200,
	},
	{
		title: '发货信息',
		field: 'deliveryInfo',
		minWidth: 220,
	},
	{
		title: '状态',
		field: 'status',
		minWidth: 130,
	},
	{
		title: '操作',
		field: 'action',
		minWidth: 60,
	},
	{
		type: 'expand',
		width: 50,
		field: 'expand',
	},
];

export { columns };
