import type { Columns } from '/@/types/table';

export const getColumns = (): Columns => [
	{
		type: 'checkbox',
		width: 60,
		align: 'center',
		fixed: 'left',
	},
	{
		title: '货代名称',
		field: 'forwarderName',
		width: 180,
		sortable: true,
	},
	{
		title: '货代编号',
		field: 'forwarderCode',
		width: 130,
		sortable: true,
	},
	{
		title: '货代类型',
		field: 'forwarderTypeName',
		width: 130,
		sortable: true,
		sortableFn: () => {
			return 'forwarder_type';
		},
	},
	{
		title: '状态',
		field: 'statusText',
		width: 100,
		sortable: true,
		sortableFn: () => {
			return 'status';
		},
	},
	{
		title: '我司对接人',
		field: 'selfPersonName',
		width: 130,
		sortable: true,
		sortableFn: () => {
			return 'self_person_id';
		},
	},
	{
		title: '联系人',
		field: 'contactPerson',
		width: 130,
	},
	{
		title: '联系方式',
		field: 'contactInfo',
		width: 180,
	},
	{
		title: '备注',
		field: 'remark',
		width: 180,
	},
	{
		title: '附件',
		field: 'attachmentUrlsCustom',
		width: 140,
	},
	{
		title: '创建人',
		field: 'createName',
		width: 140,
	},
	{
		title: '更新时间',
		field: 'updateTime',
		width: 180,
		sortable: true,
	},
	{
		title: '操作',
		field: 'action',
		width: 150,
		fixed: 'right',
		disabled: true,
	},
];
