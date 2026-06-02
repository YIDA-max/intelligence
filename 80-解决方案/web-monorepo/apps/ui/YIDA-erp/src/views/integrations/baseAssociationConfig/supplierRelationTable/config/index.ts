/*
 * @Author: wuyueqin wuyueqin@merach.com
 * @Date: 2026-01-30 17:05:57
 * @LastEditors: wuyueqin wuyueqin@merach.com
 * @LastEditTime: 2026-03-26 19:31:50
 * @FilePath: \qianyi-ui\src\views\integrations\baseAssociationConfig\supplierRelationTable\config\index.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const columns = [
	{
		type: 'checkbox',
		width: 40,
		fixed: 'left',
		disabled: true,
	},
	{
		title: '仟易供应商编码',
		field: 'supplierCode',
		minWidth: 150,
	},
	{
		title: '仟易供应商名称',
		field: 'supplierName',
		minWidth: 180,
	},
	{
		title: '金蝶使用组织编码',
		field: 'kingdeeOrgCode',
		minWidth: 150,
	},
	{
		title: '金蝶使用组织',
		field: 'kingdeeOrgName',
		minWidth: 180,
	},
	{
		title: '金蝶供应商编码',
		field: 'kingdeeSupplierCode',
		minWidth: 150,
	},
	{
		title: '金蝶供应商名称',
		field: 'kingdeeSupplierName',
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

const moduleKey = 'supplierRelationTable';

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
			'biz-type': ['SUPPLIER_RELATION'],
		},
		auth: `${moduleKey}-log`,
	},
];

export { columns, moduleKey, actionMenuList };
