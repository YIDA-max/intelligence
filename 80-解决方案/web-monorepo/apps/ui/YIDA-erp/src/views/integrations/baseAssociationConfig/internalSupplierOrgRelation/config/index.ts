/*
 * @Author: YIDA 3136271519@qq.com
 * @Date: 2026-02-04 14:48:32
 * @LastEditors: YIDA 3136271519@qq.com
 * @LastEditTime: 2026-02-04 14:57:46
 * @FilePath: \qianyi-ui\src\views\integrations\baseAssociationConfig\internalSupplierOrgRelation\config\index.ts
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
		minWidth: 120,
	},
	{
		title: '金蝶内部供应商编码',
		field: 'kingdeeSupplierCode',
		minWidth: 180,
	},
	{
		title: '供应商对应的金蝶组织编码',
		field: 'kingdeeOrgCode',
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
		sortable: true,
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

const moduleKey = 'internalSupplierOrgRelation';

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
			'biz-type': ['INTERNAL_SUPPLIER_ORG_RELATION'],
		},
		auth: `${moduleKey}-log`,
	},
];

export { columns, moduleKey, actionMenuList };
