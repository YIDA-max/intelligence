/*
 * @Author: wuyueqin wuyueqin@merach.com
 * @Date: 2026-01-30 17:05:57
 * @LastEditors: wuyueqin wuyueqin@merach.com
 * @LastEditTime: 2026-02-04 16:30:28
 * @FilePath: \qianyi-ui\src\views\integrations\baseAssociationConfig\orderPromotion\config\index.ts
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
		title: '集成单据',
		field: 'integrationModule',
		minWidth: 150,
	},
	{
		title: '平台',
		field: 'platformChannelText',
		minWidth: 120,
	},
	{
		title: '金蝶单据名称',
		field: 'kingdeeBillText',
		minWidth: 150,
	},
	{
		title: '生效时间',
		field: 'effectTime',
		minWidth: 180,
	},
	{
		title: '失效时间',
		field: 'expireTime',
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

const moduleKey = 'orderPromotion';

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
			'biz-type': ['ORDER_PUSH_RELATION'],
		},
		auth: `${moduleKey}-log`,
	},
];

export { columns, moduleKey, actionMenuList };
