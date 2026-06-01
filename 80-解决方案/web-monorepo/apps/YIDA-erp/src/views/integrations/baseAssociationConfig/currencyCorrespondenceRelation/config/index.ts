/*
 * @Author: YIDA 3136271519@qq.com
 * @Date: 2026-02-02 11:12:10
 * @LastEditors: YIDA 3136271519@qq.com
 * @LastEditTime: 2026-02-10 10:24:21
 * @FilePath: \qianyi-ui\src\views\integrations\baseAssociationConfig\currencyCorrespondenceRelation\config\index.ts
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
		title: '仟易币种代码',
		field: 'currencyCode',
		minWidth: 150,
	},
	{
		title: '仟易币种名称',
		field: 'currencyName',
		minWidth: 150,
	},
	{
		title: '金蝶币种编码',
		field: 'kingdeeCurrencyCode',
		minWidth: 150,
	},
	{
		title: '创建人',
		field: 'createName',
		width: 120,
	},
	{
		title: '创建时间',
		field: 'createTime',
		width: 180,
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

const moduleKey = 'currencyCorrespondenceRelation';

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
			'biz-type': ['CURRENCY_MAP_RELATION'],
		},
		auth: `${moduleKey}-log`,
	},
];

export { columns, moduleKey, actionMenuList };
