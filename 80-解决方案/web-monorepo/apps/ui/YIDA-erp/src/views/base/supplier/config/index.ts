import type { Columns } from '/@/types/table';

export const columns: Columns = [
	{ type: 'checkbox', width: 60, align: 'center', fixed: 'left' },
	{ title: '供应商编号', field: 'supplierNo', width: 200, sortable: true },
	{ title: '供应商名称', field: 'name', width: 200, sortable: true },
	{
		title: '状态',
		field: 'status',
		width: 100,
		sortable: true,
		isTemplate: true,
	},
	{
		title: '采购员',
		field: 'purchaseUserId',
		width: 150,
		sortable: true,
		isTemplate: true,
	},
	{ title: '联系人-联系方式', field: 'currency', width: 150, isTemplate: true },
	{ title: '开发员', field: 'developerName', width: 150 },
	{ title: '附件', field: 'attachmentUrlList', width: 300, isTemplate: true },
	{ title: '备注', field: 'remark', width: 150 },
	{ title: '创建人', field: 'createName', width: 150, sortable: true },
	{ title: '创建时间', field: 'createTime', width: 150, sortable: true },
	{
		title: '操作',
		field: 'action',
		width: 150,
		fixed: 'right',
		isTemplate: true,
	},
];
