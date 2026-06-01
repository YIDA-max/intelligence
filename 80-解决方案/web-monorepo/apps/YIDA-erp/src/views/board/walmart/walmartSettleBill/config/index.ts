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
		slot: 'storeInfo',
	},
	{
		title: '周期开始日期',
		field: 'periodStartDate',
		width: 150,
		sortable: true,
	},
	{
		title: '周期结束日期',
		field: 'periodEndDate',
		width: 180,
		sortable: true,
	},
	{
		title: '客户订单号',
		field: 'customerOrderNum',
		width: 120,
	},
	{
		title: '客户订单行号',
		field: 'customerOrderLineNum',
		width: 200,
	},
	{
		title: '采购订单号',
		field: 'purchaseOrderNum',
		width: 150,
	},
	{
		title: '采购订单行号',
		field: 'purchaseOrderLineNum',
		width: 250,
	},
	{
		title: '应付总额',
		field: 'totalPayable',
		width: 180,
		sortable: true,
	},
	{
		title: '货币类型',
		field: 'currency',
		width: 180,
	},

	{
		title: '交易关键字',
		field: 'transactionKey',
		width: 180,
	},
	{
		title: '订单/交易过账时间戳',
		field: 'transactionPostedTimestamp',
		width: 180,
		sortable: true,
	},
	{
		title: '交易类型',
		field: 'transactionType',
		width: 150,
	},
	{
		title: '交易商品描述',
		field: 'transactionDescription',
		width: 200,
	},
	{
		title: '交易原因商品描述',
		field: 'transactionReasonDescription',
		width: 150,
	},
	{
		title: '金额',
		field: 'amount',
		width: 150,
		sortable: true,
	},
	{
		title: '金额类型',
		field: 'amountType',
		width: 150,
		sortable: true,
	},
	{
		title: '发货数量',
		field: 'shipQty',
		width: 150,
		sortable: true,
	},
	{
		title: '佣金费率',
		field: 'commissionRate',
		width: 150,
		sortable: true,
	},
	{
		title: '基础佣金费率',
		field: 'baseCommissionRate',
		width: 150,
		sortable: true,
	},

	{
		title: '合作伙伴商品 ID',
		field: 'partnerItemId',
		width: 150,
	},
	{
		title: '合作伙伴全球贸易项目代码',
		field: 'partnerGtin',
		width: 200,
	},
	{
		title: '合作伙伴商品名称',
		field: 'partnerItemName',
		width: 180,
	},
	{
		title: '商品税码',
		field: 'productTaxCode',
		width: 150,
	},
	{
		title: '配送省份 / 州',
		field: 'shipToState',
		width: 150,
	},
	{
		title: '配送城市',
		field: 'shipToCity',
		width: 150,
	},
	{
		title: '配送邮编',
		field: 'shipToZipcode',
		width: 150,
	},
	{
		title: '合同类别',
		field: 'contractCategory',
		width: 150,
	},
	{
		title: '商品类型',
		field: 'productType',
		width: 180,
	},
	{
		title: '佣金规则',
		field: 'commissionRule',
		width: 180,
	},
	{
		title: '配送方式',
		field: 'shippingMethod',
		width: 150,
	},

	{
		title: '履约类型',
		field: 'fulfillmentType',
		width: 150,
	},
	{
		title: '履约详情',
		field: 'fulfillmentDetails',
		width: 180,
	},
	{
		title: '原始佣金',
		field: 'originalCommission',
		width: 150,
		sortable: true,
	},
	{
		title: '佣金节省金额',
		field: 'commissionSaving',
		width: 150,
		sortable: true,
	},
	{
		title: '客户促销类型',
		field: 'customerPromoType',
		width: 150,
	},
	{
		title: '沃尔玛资助的储蓄计划总金额',
		field: 'totalWalmartFundedSavingsProgram',
		width: 220,
		sortable: true,
	},
	{
		title: '活动 ID',
		field: 'campaignId',
		width: 150,
	},
	{
		title: '商品状态',
		field: 'itemCondition',
		width: 150,
	},
	{
		title: '原始费用',
		field: 'originalCharge',
		width: 150,
		sortable: true,
	},
	{
		title: '费用节省金额',
		field: 'chargeSavings',
		width: 150,
		sortable: true,
	},
	{
		title: '佣金激励计划',
		field: 'commissionIncentiveProgram',
		width: 180,
	},
	{
		title: '激励计划名称',
		field: 'incentiveProgramName',
		width: 180,
	},
	{
		title: '创建时间',
		field: 'createTime',
		width: 150,
		sortable: true,
	},
	{
		title: '更新时间',
		field: 'updateTime',
		width: 200,
		sortable: true,
	},
	{
		title: '批量处理时间',
		field: 'batchTime',
		width: 200,
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
