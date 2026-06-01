/*
 * @Author: wuyueqin wuyueqin@merach.com
 * @Date: 2026-01-30 17:05:57
 * @LastEditors: YIDA zhuhansong@merach.com
 * @LastEditTime: 2026-03-26 10:43:54
 * @FilePath: \qianyi-ui\src\views\integrations\baseAssociationConfig\internalSettlementOriginalCurrencyRule\config\index.ts
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
		title: '规则编码',
		field: 'ruleCode',
		width: 150,
	},
	{
		title: '金蝶销售组织编码',
		field: 'salesOrgCode',
		width: 150,
	},
	{
		title: '金蝶销售组织名称',
		field: 'salesOrgName',
		width: 180,
	},
	{
		title: '金蝶采购组织编码',
		field: 'purchaseOrgCode',
		width: 150,
	},
	{
		title: '金蝶采购组织名称',
		field: 'purchaseOrgName',
		width: 180,
	},
	{
		title: '结算原币',
		field: 'settlementCurrencyName',
		width: 120,
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

const moduleKey = 'internalSettlementOriginalCurrencyRule';

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
			'biz-type': ['INTERNAL_SETTLEMENT_CURRENCY_RULE'],
		},
		auth: `${moduleKey}-log`,
	},
];

export { columns, moduleKey, actionMenuList };
