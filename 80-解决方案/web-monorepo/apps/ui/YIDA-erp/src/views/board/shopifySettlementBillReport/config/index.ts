const columns = [
	{
		type: 'checkbox',
		width: 40,
		fixed: 'left',
		disabled: true,
	},
	{
		title: '店铺/站点',
		field: 'storeInfo',
		width: 200,
		fixed: 'left',
	},
	{
		title: '订单创建日期',
		field: 'orderCreatedDate',
		width: 150,
		sortable: true,
		fixed: 'left',
	},
	{
		title: '订单ID',
		field: 'legacyResourceId',
		width: 180,
		fixed: 'left',
	},
	{
		title: '平台订单号',
		field: 'orderName',
		width: 180,
		fixed: 'left',
	},
	{
		title: 'MSKU',
		field: 'msku',
		width: 150,
	},
	{
		title: 'sku/产品名称',
		field: 'skuCode',
		width: 250,
	},
	{
		title: '产品描述',
		field: 'title',
		width: 200,
	},
	{
		title: '产品类别',
		field: 'productType',
		width: 120,
	},
	{
		title: '交易类型',
		field: 'projectType',
		width: 120,
	},
	{
		title: '订单/退货',
		field: 'orderType',
		width: 100,
	},
	{
		title: '销售渠道',
		field: 'appName',
		width: 150,
	},
	{
		title: '账单寄送国家/地区',
		field: 'billingAddressCountry',
		width: 150,
	},
	{
		title: '币种',
		field: 'currencyCode',
		width: 80,
	},
	{
		title: '产品厂商',
		field: 'vendor',
		width: 120,
	},
	{
		title: '毛销售额',
		field: 'originalTotal',
		width: 120,
		sortable: true,
	},
	{
		title: '折扣金额',
		field: 'discountAmount',
		width: 120,
		sortable: true,
	},
	{
		title: '退货金额',
		field: 'refundAmount',
		width: 120,
		sortable: true,
	},
	{
		title: '净销售额',
		field: 'netSalesAmount',
		width: 120,
		sortable: true,
	},
	{
		title: '运费',
		field: 'shippingAmount',
		width: 100,
		sortable: true,
	},
	{
		title: '税费',
		field: 'taxAmount',
		width: 100,
		sortable: true,
	},
	{
		title: '总销售额',
		field: 'totalSaleAmount',
		width: 120,
		sortable: true,
	},
	{
		title: '净售出商品数',
		field: 'itemCount',
		width: 150,
		sortable: true,
	},
];
const treeSelectInputs: Array<{
	settings: {
		text: string;
		width: string;
		code: string;
		searchFn?: () => void;
		selectTreeProps: {
			value: string;
			label: string;
			children: string;
		};
		getIdsCode: string;
	};
}> = [
	{
		settings: {
			text: '店铺',
			width: '200px',
			code: 'storeIds',
			selectTreeProps: {
				value: 'userId',
				label: 'name',
				children: 'children',
			},
			getIdsCode: 'userId',
		},
	},
	{
		settings: {
			text: '交易类型',
			width: '200px',
			code: 'projectTypes',
			selectTreeProps: {
				value: 'userId',
				label: 'name',
				children: 'children',
			},
			getIdsCode: 'userId',
		},
	},
	{
		settings: {
			text: '订单/退货',
			width: '200px',
			code: 'orderTypes',
			selectTreeProps: {
				value: 'userId',
				label: 'name',
				children: 'children',
			},
			getIdsCode: 'userId',
		},
	},
	{
		settings: {
			text: '销售渠道',
			width: '200px',
			code: 'appNames',
			selectTreeProps: {
				value: 'userId',
				label: 'name',
				children: 'children',
			},
			getIdsCode: 'userId',
		},
	},
];
export { columns, treeSelectInputs };
