interface ModuleOption {
	label: string;
	value: string;
}
const exportModules: { title: string; options: ModuleOption[] }[] = [
	{
		title: '基本信息',
		options: [
			{ label: '工单类型', value: 'platformChannelCode' },
			{ label: '登记人', value: 'registerUser' },
			{ label: '处理进度', value: 'status' },
			{ label: '创建时间', value: 'createTime' },
			{ label: '截止时间', value: 'deadlineTime' },
			{ label: '解决时间', value: 'solveTime' },
		],
	},
	{
		title: '订单信息',
		options: [
			{ label: '订单号', value: 'orderNo' },
			{ label: '国家', value: 'countryCode' },
			{ label: '平台渠道', value: 'platform' },
			{ label: '店铺/站点', value: 'storeName' },
			{ label: '购买日期', value: 'purchaseDate' },
			{ label: '买家姓名', value: 'buyerName' },
			{ label: '电话', value: 'phone' },
			{ label: '邮箱', value: 'email' },
			{ label: 'SKU', value: 'sku' },
			{ label: '产品名称', value: 'productName' },
			{ label: '品牌', value: 'brandName' },
			{ label: '类目', value: 'categoryName' },
			{ label: 'ASIN', value: 'asin' },
			{ label: 'SN', value: 'sn' },
		],
	},
	{
		title: '原因/描述',
		options: [
			{ label: '外语描述', value: 'foreignDesc' },
			{ label: '中文描述', value: 'chineseDesc' },
			{ label: '一级标签', value: 'firstTag' },
			{ label: '二级标签', value: 'secondTag' },
			{ label: '三级标签', value: 'thirdTag' },
			{ label: '四级标签', value: 'fourthTag' },
		],
	},
	{
		title: '附件&备注',
		options: [{ label: '内部备注', value: 'internalRemark' }],
	},
	{
		title: '退款信息',
		options: [
			{ label: '退款类型', value: 'refundType' },
			{ label: '退款金额', value: 'refundAmount' },
			{ label: '币种', value: 'currency' },
			{ label: '退款日期', value: 'refundDate' },
		],
	},
	{
		title: '退货信息',
		options: [
			{ label: '退货日期', value: 'returnDate' },
			{ label: '退货跟踪号', value: 'returnTrackingNo' },
		],
	},
	{
		title: '补发新机记录',
		options: [
			{ label: '补发新机日期', value: 'reissueDate' },
			{ label: '补发新机单号', value: 'reissueNo' },
		],
	},
	{
		title: '补发配件记录',
		options: [
			{ label: '补发配件时间', value: 'reissuePartTime' },
			{ label: '补发配件单号', value: 'reissuePartNo' },
			{ label: '补发配件原因', value: 'reissuePartReason' },
			{ label: '补发配件明细', value: 'reissuePartDetail' },
			{ label: '配件发出跟踪号', value: 'partTrackingNo' },
			{ label: '供应商', value: 'supplier' },
			{ label: '补发备注', value: 'reissueRemark' },
		],
	},
];

export { exportModules };
