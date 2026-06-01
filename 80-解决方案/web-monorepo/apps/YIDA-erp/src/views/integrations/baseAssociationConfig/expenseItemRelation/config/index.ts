/*
 * @Author: YIDA 3136271519@qq.com
 * @Date: 2026-02-02 11:12:10
 * @LastEditors: wuyueqin wuyueqin@merach.com
 * @LastEditTime: 2026-02-04 10:40:41
 * @FilePath: \qianyi-ui\src\views\integrations\baseAssociationConfig\expenseItemRelation\config\index.ts
 * @Description:
 *
 * Copyright (c) 2026 by ${git_name_email}, All Rights Reserved.
 */
const columns = [
	{
		type: 'checkbox',
		width: 40,
		fixed: 'left',
		disabled: true,
	},
	{
		title: '业务模块',
		field: 'businessModule',
		minWidth: 150,
	},
	{
		title: '费用类型',
		field: 'expenseType',
		minWidth: 120,
	},
	{
		title: '费用项目名称',
		field: 'expenseItemName',
		minWidth: 180,
	},
	{
		title: '金蝶费用项目编码',
		field: 'kingdeeExpenseCode',
		minWidth: 150,
	},
	{
		title: '金蝶费用项目名称',
		field: 'kingdeeExpenseName',
		minWidth: 180,
	},
	{
		title: '创建人',
		field: 'createName',
		minWidth: 120,
	},
	{
		title: '创建时间',
		field: 'createTime',
		minWidth: 180,
		sortable: true,
	},
	{
		title: '更新人',
		field: 'updateName',
		width: 120,
	},
	{
		title: '更新时间',
		field: 'updateTime',
		width: 180,
	},
	{
		title: '操作',
		field: 'action',
		width: 150,
		fixed: 'right',
		disabled: true,
	},
];

const moduleKey = 'expenseItemRelation';

interface MenuItem {
	key: string;
	label?: string;
	type?: 'del' | 'log' | 'slot' | 'default';
	itemArgs?: Record<string, any>;
	onClick?: (row: any) => void;
	auth?: string;
}

const actionMenuList: MenuItem[] = [
	{
		key: 'delete',
		label: '删除',
		type: 'del',
		auth: `${moduleKey}-delete`,
	},
	{
		key: 'log',
		type: 'log',
		itemArgs: {
			'biz-type': ['EXPENSE_ITEM_RELATION'],
		},
		auth: `${moduleKey}-log`,
	},
];

export { columns, moduleKey, actionMenuList };
