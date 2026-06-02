const columns = [
	{
		type: 'checkbox',
		width: 40,
		fixed: 'left',
		disabled: true,
	},
	{
		title: '仟易仓库代码',
		field: 'warehouseCode',
		width: 150,
	},
	{
		title: '仟易仓库名称',
		field: 'warehouseName',
		width: 150,
	},
	{
		title: '仓库对应国家',
		field: 'warehouseCountry',
		width: 150,
	},
	{
		title: '仟易仓库类型',
		field: 'warehouseType',
		width: 150,
	},
	{
		title: '金蝶库存组织编码',
		field: 'kingdeeInventoryOrgCode',
		width: 150,
	},
	{
		title: '金蝶库存组织名称',
		field: 'kingdeeInventoryOrgName',
		width: 180,
	},
	{
		title: '金蝶仓库编码',
		field: 'kingdeeWarehouseCode',
		width: 150,
	},
	{
		title: '金蝶仓库名称',
		field: 'kingdeeWarehouseName',
		width: 180,
	},
	{
		title: '金蝶虚拟在途仓编码',
		field: 'kingdeeVirtualTransitWhCode',
		width: 180,
	},
	{
		title: '金蝶虚拟在途仓名称',
		field: 'kingdeeVirtualTransitWhName',
		width: 200,
	},
	{
		title: '金蝶香港虚拟在途仓编码',
		field: 'kingdeeHkVirtualWareCode',
		width: 180,
	},
	{
		title: '金蝶香港虚拟在途仓名称',
		field: 'kingdeeHkVirtualWareName',
		width: 200,
	},
	{
		title: '香港虚拟仓库存组织编码',
		field: 'kingdeeHkVirtualOrgCode',
		width: 180,
	},
	{
		title: '香港虚拟仓库存组织名称',
		field: 'kingdeeHkVirtualOrgName',
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
		width: 180,
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

interface MenuItem {
	key: string;
	label?: string;
	type?: 'del' | 'log' | 'slot' | 'default';
	itemArgs?: Record<string, any>;
	onClick?: (row: any) => void;
	auth?: string;
}
const moduleKey = 'inventoryOrgRelation';
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
			'biz-type': ['INVENTORY_ORG_RELATION'],
		},
		auth: `${moduleKey}-log`,
	},
];
export { columns, moduleKey, actionMenuList };
