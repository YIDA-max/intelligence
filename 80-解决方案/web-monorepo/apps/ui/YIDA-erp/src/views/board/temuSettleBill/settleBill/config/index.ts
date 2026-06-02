const columns = [
	{
		type: 'checkbox',
		width: 60,
		align: 'center',
		fixed: 'left',
	},
	{
		title: '店铺/站点',
		field: 'storeName',
		width: 150,
		fixed: 'left',
	},
	{
		title: '到账时间',
		field: 'arrivalTime',
		width: 180,
		fixed: 'left',
		sortable: true,
	},
	{
		title: '结算流水ID',
		field: 'settlementTransactionId',
		width: 180,
		fixed: 'left',
	},
	{
		title: '批次号',
		field: 'batchNumber',
		width: 150,
		fixed: 'left',
	},
	{
		title: 'PO单号',
		field: 'poNumber',
		width: 180,
		fixed: 'left',
	},
	{
		title: '单据号',
		field: 'documentNumber',
		width: 180,
	},
	{
		title: 'SKU ID',
		field: 'skuId',
		width: 150,
	},
	{
		title: 'Msku',
		field: 'msku',
		width: 150,
	},
	{
		title: 'sku/产品名称',
		field: 'skuName',
		align: 'left',
		width: 200,
	},
	{
		title: '产品描述',
		field: 'productDescription',
		width: 250,
	},
	{
		title: '交易类型',
		field: 'transactionTypeName',
		width: 120,
	},
	{
		title: '结算金额',
		field: 'settlementAmount',
		width: 120,
		sortable: true,
	},
	{
		title: '件数',
		field: 'quantity',
		width: 100,
	},
	{
		title: '申报价格',
		field: 'declaredPrice',
		width: 120,
		sortable: true,
	},
	{
		title: '是否活动价',
		field: 'isPromotionalPrice',
		width: 120,
	},
	{
		title: '币种',
		field: 'currency',
		width: 100,
	},
	{
		title: '总申报价格',
		field: 'totalDeclaredPrice',
		width: 130,
		sortable: true,
	},
	{
		title: '单品优惠券金额',
		field: 'itemCouponAmount',
		width: 150,
		sortable: true,
	},
	{
		title: '店铺满减券优惠金额',
		field: 'storeDiscountCouponAmount',
		width: 180,
		sortable: true,
	},
	{
		title: '活动运费主动减免金额',
		field: 'shippingDiscountAmount',
		width: 200,
		sortable: true,
	},
	{
		title: '申报价格折扣金额',
		field: 'declaredPriceDiscountAmount',
		width: 170,
		sortable: true,
	},
	{
		title: '备注',
		field: 'remark',
		width: 200,
	},
];

const moduleKey = 'temuSettleBillSettleBill';

export { columns, moduleKey };
