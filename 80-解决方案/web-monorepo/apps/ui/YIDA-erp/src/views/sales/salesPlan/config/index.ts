import type { Columns } from '/@/types/table';

export const columns: Columns = [
	{
		type: 'checkbox',
		width: 50,
		align: 'center',
		fixed: 'left',
	},
	{
		title: '文件名称',
		field: 'fileName',
		width: 270,
	},
	{
		title: '月份',
		field: 'month',
		width: 150,
	},
	{
		title: '版本',
		field: 'version',
		width: 150,
	},
	{
		title: '链接',
		field: 'url',
		width: 200,
	},
	{
		title: '审核状态',
		field: 'statusDesc',
		width: 150,
	},
	{
		title: '审批意见',
		field: 'approveRemark',
		width: 150,
	},
	{
		title: '销售经理',
		field: 'salesDirectorName',
		width: 150,
	},
	{
		title: '计划经理',
		field: 'planManagerName',
		width: 150,
	},
	{
		title: '归档时间',
		field: 'archiveDate',
		width: 150,
	},
	{
		title: '修改时间',
		field: 'updateTime',
		width: 150,
	},
	{
		title: '创建时间',
		field: 'createTime',
		width: 150,
	},
	{
		title: '操作',
		field: 'action',
		width: 200,
		fixed: 'right',
		disabled: true,
	},
];
