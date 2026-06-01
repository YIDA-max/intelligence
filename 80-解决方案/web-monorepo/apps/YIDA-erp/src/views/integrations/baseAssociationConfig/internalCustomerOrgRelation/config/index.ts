/*
 * @Author: YIDA 3136271519@qq.com
 * @Date: 2026-02-09 13:41:56
 * @LastEditors: YIDA 3136271519@qq.com
 * @LastEditTime: 2026-02-09 14:15:12
 * @FilePath: \qianyi-ui\src\views\integrations\baseAssociationConfig\internalCustomerOrgRelation\config\index.ts
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
		title: '仟易主体',
		field: 'legalPersonName',
		minWidth: 220,
	},
	{
		title: '金蝶内部客户编码',
		field: 'internalCustomerCode',
		minWidth: 180,
	},
	{
		title: '客户对应金蝶组织编码',
		field: 'customerOrgCode',
		minWidth: 200,
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
	},
	{
		title: '更新人',
		field: 'updateName',
		minWidth: 120,
	},
	{
		title: '更新时间',
		field: 'updateTime',
		minWidth: 180,
	},
	{
		title: '操作',
		field: 'action',
		width: 150,
		fixed: 'right',
		disabled: true,
	},
];

const moduleKey = 'internalCustomerOrgRelation';

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
			'biz-type': ['INTERNAL_CUSTOMER_ORG_RELATION'],
		},
		auth: `${moduleKey}-log`,
	},
];

export { columns, moduleKey, actionMenuList };
