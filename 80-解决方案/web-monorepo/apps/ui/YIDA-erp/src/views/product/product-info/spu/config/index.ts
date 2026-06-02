import type { Columns } from '/@/types/table';

export const columns: Columns = [
	{
		type: 'checkbox',
		width: 50,
		align: 'center',
		fixed: 'left',
	},
	{
		type: 'expand',
		width: 60,
		fixed: 'left',
	},
	{
		title: '图片',
		field: 'imgUrl',
		width: 100,
		fixed: 'left',
	},
	{
		title: 'SPU/父产品名称',
		field: 'spuCode',
		width: 160,
		fixed: 'left',
		sortable: true,
		prefixObj: {
			field: 'spuName',
			connectStr: '-',
		},
	},
	{
		title: 'SKU/产品名称',
		field: 'skuCode',
		width: 160,
		sortable: true,
		prefixObj: {
			field: 'skuName',
			connectStr: '-',
		},
	},
	{
		title: '类目',
		field: 'categoryCode',
		width: 150,
		sortable: true,
	},
	{
		title: '品牌',
		field: 'brandCode',
		width: 150,
		sortable: true,
	},
	{
		title: '产品类型',
		field: 'productTypeText',
		width: 100,
	},
	{
		title: '产品等级',
		field: 'gradeText',
		width: 100,
	},
	{
		title: '产品负责人',
		field: 'productManageName',
		width: 120,
	},
	{
		title: '状态',
		field: 'status',
		width: 80,
	},
	{
		title: '创建人',
		field: 'createName',
		width: 100,
	},
	{
		title: '创建时间',
		field: 'createTime',
		width: 180,
		sortable: true,
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
	},
];

export const skuColumns: Columns = [
	{
		type: 'checkbox',
		width: 50,
		align: 'center',
	},
	{
		title: '图片',
		field: 'imgUrl',
		width: 100,
	},
	{
		title: 'SPU/父产品名称',
		field: 'spuCode',
		width: 160,
	},
	{
		title: 'SKU/产品名称',
		field: 'skuCode',
		width: 160,
	},
	{
		title: '类目',
		field: 'categoryName',
		width: 150,
	},
	{
		title: '品牌',
		field: 'brandName',
		width: 150,
	},
	{
		title: '产品类型',
		field: 'productTypeText',
		width: 100,
	},
	{
		title: '产品等级',
		field: 'gradeText',
		width: 100,
	},
	{
		title: '产品负责人',
		field: 'productManageName',
		width: 120,
	},
	{
		title: '状态',
		field: 'status',
		width: 80,
	},
	{
		title: '创建人',
		field: 'createName',
		width: 100,
	},
	{
		title: '创建时间',
		field: 'createTime',
		width: 180,
	},
	{
		title: '更新时间',
		field: 'updateTime',
		width: 180,
	},
];
