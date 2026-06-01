import type { Columns } from '/@/types/table';

/** 供应商产品列表列配置 */
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
	},
	{
		title: 'SKU/产品名称',
		field: 'skuCode',
		width: 160,
		sortable: true,
	},
	{
		title: '产品状态',
		field: 'skuStatus',
		width: 150,
		sortable: true,
	},
	{
		title: '状态',
		field: 'status',
		width: 100,
		sortable: true,
	},
	{
		title: '供应商',
		field: 'supplierName',
		width: 200,
		sortable: true,
		prefixObj: {
			field: 'supplierNo',
			connectStr: '-',
		},
	},
	{
		title: '采购员',
		field: 'purchaseUserName',
		width: 150,
		sortable: true,
	},
	{
		title: '币种',
		field: 'currency',
		width: 100,
		sortable: true,
	},
	{
		title: '是否梯度报价',
		field: 'ladderFlag',
		width: 150,
		sortable: true,
		valueType: 'boolean',
	},
	{
		title: '不含税单价 | 税率% | 含税单价',
		field: 'unitPriceWithoutTax',
		width: 250,
		sortable: true,
	},
	{
		title: '创建人',
		field: 'createName',
		width: 150,
		sortable: true,
	},
	{
		title: '主计划',
		field: 'planUserName',
		width: 150,
		sortable: true,
	},
	{
		title: '采购交期',
		field: 'purchaseDeliveryDays',
		width: 150,
	},
	{
		title: '最小起订量',
		field: 'minimumOrder',
		width: 150,
	},
	{
		title: '创建时间',
		field: 'createTime',
		width: 150,
		sortable: true,
	},
	{
		title: '操作',
		field: 'action',
		width: 150,
		fixed: 'right',
	},
];
