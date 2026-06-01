import type { Columns } from '/@/types/table';
import {
	getPaymentRequestPoolPage,
	exportPaymentRequestPool,
	discardPaymentRequestPool,
	confirmPaymentRequest,
} from '/@/api/financial/transactionManagement/paymentRequestPool/index';

export const moduleKey = 'paymentRequestPool';

export const listApi = {
	getList: getPaymentRequestPoolPage,
	exportList: exportPaymentRequestPool,
	discardList: discardPaymentRequestPool,
	confirmRequest: confirmPaymentRequest,
};

export const searchConfig = [
	{
		component: 'TreeSelectInputApi',
		props: {
			componentType: 'dicts',
			settings: {
				code: 'paymentStatus',
				text: '请款状态',
				getTreeDataParams: 'payment_request_status',
			},
		},
	},
	{
		component: 'TreeSelectInputApi',
		props: {
			componentType: 'dicts',
			settings: {
				code: 'applicationStatus',
				text: '申请单状态',
				getTreeDataParams: 'apply_order_status',
			},
		},
	},
	{
		component: 'TreeSelectInputApi',
		props: {
			componentType: 'legalEntity',
			settings: {
				code: 'businessEntity',
				text: '业务主体',
			},
		},
	},
	{
		component: 'TreeSelectInputApi',
		props: {
			componentType: 'currencyOption',
			settings: { code: 'currency', text: '费用币种' },
		},
	},
	{
		component: 'TreeSelectInputApi',
		props: {
			componentType: 'dicts',
			settings: {
				code: 'urgencyLevel',
				text: '紧急程度',
				getTreeDataParams: 'urgency_level',
			},
		},
	},
	{
		component: 'SelectInput',
		props: {
			searchTypes: [{ label: 'SKU', value: 'skuList' }],
		},
	},
	{
		component: 'SelectInput',
		props: {
			searchTypes: [{ label: '请款单号', value: 'paymentNoList' }],
		},
	},
	{
		component: 'SelectDate',
		props: {
			searchTypes: [
				{
					label: '创建时间',
					value: 'requestDate',
					isAddHMS: true,
					dateStart: 'requestDateStart',
					dateEnd: 'requestDateEnd',
				},
				{
					label: '到期日',
					value: 'dueDate',
					isAddHMS: true,
					dateStart: 'dueDateStart',
					dateEnd: 'dueDateEnd',
				},
				{
					label: '业务时间',
					value: 'businessDate',
					isAddHMS: true,
					dateStart: 'businessDateStart',
					dateEnd: 'businessDateEnd',
				},
				{
					label: '请款时间',
					value: 'paymentDate',
					isAddHMS: true,
					dateStart: 'paymentDateStart',
					dateEnd: 'paymentDateEnd',
				},
				{
					label: '期望付款日期',
					value: 'expectedPaymentDate',
					isAddHMS: true,
					dateStart: 'expectedPaymentDateStart',
					dateEnd: 'expectedPaymentDateEnd',
				},
			],
		},
	},
	{
		component: 'TreeSelectInputApi',
		props: {
			componentType: 'dicts',
			settings: {
				code: 'sourceType',
				text: '单据来源',
				getTreeDataParams: 'request_pool_source',
			},
		},
	},
	{
		component: 'TreeSelectInputApi',
		props: {
			componentType: 'payableObject',
			settings: {
				code: 'payableObject',
				text: '应付对象',
			},
		},
	},
	{
		component: 'TreeSelectInputApi',
		props: {
			componentType: 'dicts',
			settings: {
				code: 'settlementMethod',
				text: '结算方式',
				getTreeDataParams: 'settlement_method',
			},
		},
	},
	{
		component: 'TreeSelectInputApi',
		props: {
			componentType: 'dicts',
			settings: {
				code: 'accountingMethod',
				text: '入账方式',
				getTreeDataParams: 'ACCOUNTING_METHOD',
			},
		},
	},
	{
		component: 'TreeSelectInputApi',
		props: {
			componentType: 'dicts',
			settings: {
				code: 'collectionType',
				text: '收款类型',
				getTreeDataParams: 'receipt_type',
			},
		},
	},
	{
		component: 'TreeSelectInputApi',
		props: {
			componentType: 'feeTypeList',
			settings: { code: 'costItemId', text: '费用项' },
		},
	},
	{
		component: 'TreeSelectInputApi',
		props: {
			componentType: 'dicts',
			settings: {
				code: 'paymentMethod',
				text: '付款方式',
				getTreeDataParams: 'payment_method',
			},
		},
	},
	{
		component: 'SelectInput',
		props: {
			searchTypes: [
				{ label: '调拨单号', value: 'transferOrderNoList' },
				{ label: '系统单号', value: 'systemOrderNoList' },
			],
		},
	},
	{
		component: 'SelectInput',
		props: {
			searchTypes: [
				{ label: '发货单号', value: 'shippingOrderNoList' },
				{ label: '仓库单号', value: 'warehouseNoList' },
			],
		},
	},
	{
		component: 'customCascaderApi',
		props: {
			componentType: 'warehouseId',
			settings: { code: 'destinationWarehouse', text: '头程、二程目的仓' },
		},
	},
	{
		component: 'customCascaderApi',
		props: {
			componentType: 'warehouseId',
			settings: { code: 'shippingWarehouse', text: '尾程发货仓' },
		},
	},
];

export const columns: Columns = [
	{ type: 'checkbox', width: 60, align: 'center', fixed: 'left' },
	// 1. 请款单号
	{ title: '请款单号', field: 'paymentRequestNo', width: 180, sortable: true },
	// 2. 请款状态
	{ title: '请款状态', field: 'paymentStatusStr', width: 120 },
	// 3. 申请单状态
	{ title: '申请单状态', field: 'applyOrderStatusStr', width: 120 },
	// 4. 单据来源
	{ title: '单据来源', field: 'orderSourceStr', width: 120 },
	// 5. 调拨单号
	{ title: '调拨单号', field: 'transferOrderNo', width: 180 },
	// 6. 发货单号
	{ title: '发货单号', field: 'shippingOrderNo', width: 180 },
	// 7. 平台单号
	{ title: '平台单号', field: 'platformOrderNo', width: 180 },
	// 8. 系统订单号
	{ title: '系统订单号', field: 'systemOrderNo', width: 180 },
	// 9. 仓库单号
	{ title: '仓库单号', field: 'warehouseOrderNo', width: 180 },
	// 10. SKU
	{ title: 'SKU', field: 'sku', width: 180 },
	// 11. 费用项
	{ title: '费用项', field: 'costItemName', width: 150 },
	// 12. 应付对象
	{ title: '应付对象', field: 'payableObject', width: 150 },
	// 13. 应付对象类型
	{ title: '应付对象类型', field: 'payableObjectType', width: 130 },
	// 14. 业务主体
	{ title: '业务主体', field: 'businessEntity', width: 150 },
	// 15. 结算方式
	{ title: '结算方式', field: 'settlementMethodStr', width: 120 },
	// 16. 头程、二程目的仓
	{ title: '头程、二程目的仓', field: 'destinationWarehouse', width: 180 },
	// 17. 尾程发货仓
	{ title: '尾程发货仓', field: 'shippingWarehouse', width: 150 },
	// 18. 费用币种
	{ title: '费用币种', field: 'currency', width: 120 },
	// 19. 费用汇率
	{ title: '费用汇率', field: 'exchangeRate', width: 120 },
	// 20. 费用分摊总价
	{
		title: '费用分摊总价',
		field: 'totalAllocatedAmount',
		width: 130,
		sortable: true,
	},
	// 21. 应付比例
	{ title: '应付比例', field: 'payableRatio', width: 120 },
	// 22. 可请金额
	{ title: '可请金额', field: 'requestableAmount', width: 120, sortable: true },
	// 23. 已付金额
	{ title: '已付金额', field: 'paidAmount', width: 120, sortable: true },
	// 24. 入账方式
	{ title: '入账方式', field: 'accountingMethodStr', width: 120 },
	// 25. 业务时间
	{ title: '业务时间', field: 'businessDate', width: 180, sortable: true },
	// 26. 到期日
	{ title: '到期日', field: 'dueDate', width: 180, sortable: true },
	// 27. 业务人员
	{ title: '业务人员', field: 'operatorName', width: 120 },
	// 28. 请款单创建时间
	{ title: '请款单创建时间', field: 'createTime', width: 180, sortable: true },
	// 29. 请款时间
	{ title: '请款时间', field: 'requestDate', width: 180, sortable: true },
	// 30. 紧急程度
	{ title: '紧急程度', field: 'urgencyLevelStr', width: 120 },
	// 31. 期望付款日期
	{
		title: '期望付款日期',
		field: 'expectedPaymentDate',
		width: 180,
		sortable: true,
	},
	// 32. 收款类型
	{ title: '收款类型', field: 'collectionTypeStr', width: 120 },
	// 33. 付款方式
	{ title: '付款方式', field: 'paymentMethodStr', width: 120 },
	// 34. 本次申请金额
	{ title: '本次申请金额', field: 'currentApplyAmount', width: 130 },
	// 35. 备注
	{ title: '备注', field: 'remark', width: 150 },
	// 36. 附件
	{ title: '附件', field: 'attachmentUrls', width: 120 },
	// 操作栏
	{ title: '操作', field: 'action', width: 200, fixed: 'right' },
];
