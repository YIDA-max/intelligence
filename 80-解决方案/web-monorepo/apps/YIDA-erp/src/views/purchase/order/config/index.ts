import type { Columns } from '/@/types/table';

export const columns: Columns = [
	{
		type: 'checkbox',
		width: 50,
		align: 'center',
		fixed: 'left',
	},
	{
		type: 'expand',
		width: 60,
		fixed: 'left',
	},
	{
		title: '采购单号',
		field: 'purchaseNo',
		minWidth: 200,
	},
	{
		title: '单据状态',
		field: 'statusText',
		minWidth: 150,
	},
	{
		title: '供应商',
		field: 'supplierName',
		minWidth: 150,
	},
	{
		title: '采购员',
		field: 'purchaseUserName',
		width: 120,
	},
	{
		title: '主计划',
		field: 'planUserName',
		width: 120,
	},
	{
		title: '法人主体',
		field: 'legalPersonName',
		width: 120,
	},
	{
		title: 'SKU',
		field: 'skuCode',
		width: 220,
	},
	{
		title: '计划数量',
		field: 'planNum',
		width: 150,
	},
	{
		title: '待采购数量',
		field: 'pendingPurchaseQuantity',
		width: 150,
	},
	{
		title: 'PMC确认采购数量',
		field: 'pmcConfirmedPurchaseNum',
		width: 150,
		isSum: true,
	},
	{
		title: 'PMC确认剩余采购数量',
		field: 'confirmedRemainingPurchaseNum',
		width: 200,
	},
	{
		title: '期望提货时间',
		field: 'expectedPickupDate',
		width: 150,
	},
	{
		title: '工厂标准交期',
		field: 'factoryStandardDeliveryDate',
		width: 150,
	},
	{
		title: '工厂回复交期',
		field: 'factoryReplyDeliveryDate',
		width: 180,
	},
	{
		title: '采购备注',
		field: 'orderRemark',
		width: 180,
	},
	{
		title: '产品种类',
		field: 'skuKind',
		width: 120,
		isSum: true,
	},
	{
		title: '采购量',
		field: 'purchaseNum',
		width: 120,
		isSum: true,
	},
	{
		title: '已建提货数量',
		field: 'builtTakeGoodsNum',
		width: 150,
	},
	{
		title: '退货数量/退货中数量',
		field: 'returnNum',
		width: 200,
		isSum: true,
	},
	{
		title: '订单总金额',
		field: 'amountText',
		width: 150,
		isSum: true,
		// summaryPre: '¥',
		summaryFormat: (v: any) => {
			return `¥` + (v || 0).toFixed(2);
		}, // 用于自定义format
	},
	{
		title: '备注',
		field: 'remark',
		width: 180,
		sortable: true,
	},
	{
		title: '创建人',
		field: 'createName',
		width: 180,
		sortable: true,
	},
	{
		title: '创建时间',
		field: 'createTime',
		width: 180,
		sortable: true,
	},
	{
		title: '操作',
		field: 'action',
		width: 250,
		fixed: 'right',
		disabled: true,
	},
];
