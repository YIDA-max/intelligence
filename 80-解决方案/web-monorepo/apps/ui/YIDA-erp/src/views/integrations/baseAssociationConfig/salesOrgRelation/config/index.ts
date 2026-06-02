/*
 * @Author: YIDA 3136271519@qq.com
 * @Date: 2026-02-02 14:09:51
 * @LastEditors: wuyueqin wuyueqin@merach.com
 * @LastEditTime: 2026-02-27 16:44:42
 * @FilePath: \qianyi-ui\src\views\integrations\baseAssociationConfig\salesOrgRelation\config\index.ts
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
		title: '平台',
		field: 'platformChannelCode',
		width: 150,
	},
	{
		title: '仟易店铺站点名称',
		field: 'storeName',
		width: 180,
	},
	{
		title: '金蝶销售组织编码',
		field: 'kingdeeSalesOrgCode',
		width: 150,
	},
	{
		title: '金蝶销售组织名称',
		field: 'kingdeeSalesOrgName',
		width: 200,
	},
	{
		title: '金蝶客户编码',
		field: 'kingdeeCustomerCode',
		width: 200,
	},
	{
		title: '金蝶客户名称',
		field: 'kingdeeCustomerName',
		width: 200,
	},
	{
		title: '金蝶发出商品仓编码',
		field: 'kingdeeDispatchWhCode',
		width: 180,
	},
	{
		title: '金蝶发出商品仓名称',
		field: 'kingdeeDispatchWhName',
		width: 200,
	},
	{
		title: '金蝶部门编码',
		field: 'kingdeeDeptCode',
		width: 150,
	},
	{
		title: '金蝶部门名称',
		field: 'kingdeeDeptName',
		width: 200,
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

const moduleKey = 'salesOrgRelation';

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
			'biz-type': ['SALES_ORG_RELATION'],
		},
		auth: `${moduleKey}-log`,
	},
];

export { columns, moduleKey, actionMenuList };
