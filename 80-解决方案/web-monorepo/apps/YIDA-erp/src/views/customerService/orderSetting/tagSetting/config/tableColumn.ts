interface ITableColumn {
	/** 表头 */
	title?: string;
	/** 字段名（需与接口返回字段一致） */
	field?: string;
	/** 列宽 */
	width?: number;
	/** 是否固定 */
	fixed?: boolean | 'left' | 'right' | false | null;
	/** 列类型 */
	type?: string;
	/** 保留选择项 */
	'reserve-selection'?: boolean;
	disabled?: boolean;
	'cell-config'?: {
		height?: number;
	};
	treeNode?: boolean;
}

const columns: ITableColumn[] = [
	{
		type: 'checkbox',
		width: 40,
		'reserve-selection': true,
	},
	{
		title: '标签名称',
		field: 'tagName',
		treeNode: true,
	},
	{
		title: '排序',
		field: 'sort',
	},
	{
		title: '标签类型',
		field: 'tagLevel',
		width: 150,
	},
	{
		title: '标签状态',
		field: 'status',
	},
	{
		title: '操作',
		field: 'action',
		disabled: true,
	},
];

export { columns };
