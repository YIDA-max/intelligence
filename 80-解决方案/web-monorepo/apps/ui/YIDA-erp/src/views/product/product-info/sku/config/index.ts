import type { Columns } from '/@/types/table';

/** SKU列表列配置 */
export const columns: Columns = [
	{
		type: 'checkbox',
		width: 50,
		align: 'center',
		fixed: 'left',
	},
	{
		title: '图片',
		field: 'imgUrl',
		width: 100,
		fixed: 'left',
	},
	{
		title: 'SKU/产品名称',
		field: 'skuCodeCustom',
		width: 160,
		fixed: 'left',
		sortable: true,
		sortableFn: () => {
			return 'sku_code';
		},
	},
	{
		title: 'SPU/父产品名称',
		field: 'spuCodeCustom',
		width: 160,
		sortable: true,
		sortableFn: () => {
			return 'spu_code';
		},
	},
	{
		title: '关联MSKU',
		field: 'mskusCustom',
		width: 160,
	},
	{
		title: '类目',
		field: 'categoryCode',
		width: 150,
		sortable: true,
	},
	{
		title: '品牌',
		field: 'brandCode',
		width: 150,
		sortable: true,
	},
	{
		title: '产品类型',
		field: 'productTypeText',
		width: 100,
	},
	{
		title: '产品等级',
		field: 'gradeText',
		width: 100,
	},
	{
		title: '销售国家',
		field: 'countryCodeText',
		width: 100,
	},
	{
		title: '平台',
		field: 'platforms',
		width: 150,
	},
	{
		title: '状态',
		field: 'status',
		width: 80,
	},
	{
		title: '关联产品/配件',
		field: 'materials',
		width: 160,
	},
	{
		title: '产品负责人',
		field: 'productManageName',
		minWidth: 120,
	},
	{
		title: '运营组',
		field: 'skuDepts',
		width: 150,
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
		sortable: true,
	},
	{
		title: '更新时间',
		field: 'updateTime',
		width: 180,
		sortable: true,
	},
	{
		title: '操作',
		field: 'action',
		width: 150,
		fixed: 'right',
	},
];
