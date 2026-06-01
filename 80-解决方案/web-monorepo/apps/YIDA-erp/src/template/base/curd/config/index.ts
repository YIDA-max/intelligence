const columns = [
	{
		title: '店铺/站点',
		field: 'store_site',
		width: 200,
	},
	{
		title: '订单创建日期',
		field: 'order_create_date',
		width: 150,
		sortable: true,
	},
	{
		title: '订单ID',
		field: 'order_id',
		width: 180,
	},
	{
		title: '平台订单号',
		field: 'platform_order_name',
		width: 180,
	},
	{
		title: '交易类型',
		field: 'item_type', // 枚举: Product, Sale_adjustment, shipping
		width: 120,
	},
	{
		title: '订单/退货',
		field: 'order_return_type', // 枚举: order, return
		width: 100,
	},
	{
		title: '销售渠道',
		field: 'sales_channel', // 枚举: Facebook & Instagram, Online Store, Shop
		width: 150,
	},
	{
		title: '账单寄送国家/地区',
		field: 'billing_country',
		width: 150,
	},
	{
		title: '账单寄送城市',
		field: 'billing_city',
		width: 120,
	},
	{
		title: '账单地区',
		field: 'billing_region',
		width: 120,
	},
	{
		title: '收货国家/地区',
		field: 'shipping_country',
		width: 150,
	},
	{
		title: '收货地区',
		field: 'shipping_region',
		width: 120,
	},
	{
		title: '收货城市',
		field: 'shipping_city',
		width: 120,
	},
	{
		title: '产品厂商',
		field: 'product_vendor',
		width: 120,
	},
	{
		title: '产品类别',
		field: 'product_type',
		width: 120,
	},
	{
		title: '产品描述',
		field: 'product_title',
		width: 200,
	},
	{
		title: 'MSKU',
		field: 'msku',
		width: 150,
	},
	{
		title: 'sku/产品名称',
		field: 'sku_product_name',
		width: 250,
	},
	{
		title: '毛销售额',
		field: 'gross_sales',
		width: 120,
		sortable: true,
	},
	{
		title: '折扣金额',
		field: 'discounts',
		width: 120,
		sortable: true,
	},
	{
		title: '退货金额',
		field: 'returns',
		width: 120,
		sortable: true,
	},
	{
		title: '净销售额',
		field: 'net_sales',
		width: 120,
		sortable: true,
	},
	{
		title: '运费',
		field: 'shipping_fee',
		width: 100,
		sortable: true,
	},
	{
		title: '税费',
		field: 'taxes',
		width: 100,
		sortable: true,
	},
	{
		title: '总销售额',
		field: 'total_sales',
		width: 120,
		sortable: true,
	},
	{
		title: '净售出商品数',
		field: 'net_quantity',
		width: 150,
		sortable: true,
	},
	{
		title: '币种',
		field: 'currency',
		width: 80,
	},
];
const treeSelectInputs: Array<{
	settings: {
		getTreeData: (
			params?: any
		) => Promise<{ code: number; data: any[] }> | { code: number; data: any };
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
			getTreeData: () => {
				return { code: 0, data: [] };
			},
			text: '店铺',
			width: '200px',
			code: 'purchaseUserIds',
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
