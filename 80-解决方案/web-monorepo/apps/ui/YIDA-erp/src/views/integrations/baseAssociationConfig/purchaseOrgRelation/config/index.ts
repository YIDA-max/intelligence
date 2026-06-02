/*
 * @Description:
 */
const columns = [
	{
		type: 'checkbox',
		width: 40,
		fixed: 'left',
		disabled: true,
	},
	{
		title: '仟易采购主体',
		field: 'legalPersonName',
		minWidth: 150,
	},
	{
		title: '金蝶采购组织编码',
		field: 'kingdeeOrgCode',
		minWidth: 150,
	},
	{
		title: '金蝶采购组织名称',
		field: 'kingdeeOrgName',
		minWidth: 200,
	},
	{
		title: '金蝶组织核算本位币',
		field: 'kingdeeCurrencyName',
		minWidth: 150,
	},
	{
		title: '是否境外公司',
		field: 'overseasFlag',
		minWidth: 120,
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

const moduleKey = 'purchaseOrgRelation';

const bizTypeList = ['PURCHASE_ORG_RELATION'];

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
			'biz-type': bizTypeList,
		},
		auth: `${moduleKey}-log`,
	},
];

export { columns, moduleKey, bizTypeList, actionMenuList };
