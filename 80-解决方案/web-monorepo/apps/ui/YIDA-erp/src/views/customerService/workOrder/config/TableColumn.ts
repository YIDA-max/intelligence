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
	showOverflow?: boolean;
}

const columns: ITableColumn[] = [
	{
		type: 'checkbox',
		width: 40,
		'reserve-selection': true,
	},
	{
		title: '工单编号',
		field: 'orderNo',
		width: 150,
	},
	{
		title: '工单类型',
		field: 'orderTypeDesc',
		width: 150,
	},
	{
		title: '订单号',
		field: 'relatedOrderNo',
		width: 150,
	},
	{
		title: '平台渠道',
		field: 'platformChannelCode',
		width: 150,
	},
	{
		title: '店铺/站点',
		field: 'storeName',
		width: 150,
	},
	{
		title: 'SKU/产品名称',
		field: 'skus',
		width: 400,
		showOverflow: false,
	},
	{
		title: '品牌',
		field: 'skuBrand',
		width: 170,
	},
	{
		title: '类目',
		field: 'skuCategory',
		width: 170,
	},
	{
		title: '一级标签',
		field: 'oneTags',
		width: 120,
	},
	{
		title: '二级标签',
		field: 'twoTags',
		width: 150,
	},
	{
		title: '处理进度',
		field: 'processStatus',
		width: 220,
	},
	{
		title: '登记人',
		field: 'createName',
		width: 150,
	},
	{
		title: '创建时间',
		field: 'createTime',
		width: 150,
	},
	{
		title: '截止时间',
		field: 'deadlineTime',
		width: 150,
	},
	{
		title: '解决时间',
		field: 'solveTime',
		width: 150,
	},
	{
		title: '操作',
		field: 'action',
		width: 150,
		fixed: 'right',
		disabled: true,
	},
];

export { columns };
