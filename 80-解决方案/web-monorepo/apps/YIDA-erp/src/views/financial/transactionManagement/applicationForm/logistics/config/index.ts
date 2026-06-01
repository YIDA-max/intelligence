import type { Columns } from '/@/types/table';
// import {
// 	getLogisticsPaymentApplyOrderPage,
// 	exportApplicationForm,
// 	approveOrRejectLogisticsPaymentApplyOrder,
// 	invalidateLogisticsPaymentApplyOrder,
//  payLogisticsPaymentApplyOrder,
// } from '/@/api/financial/transactionManagement/applicationForm';
import {
	getFirstLogisticsEstimatedPage,
	getFirstLogisticsEstimatedExport,
	generateFirstLogisticsEstimatedBill,
} from '/@/api/integrations/logisticsCostIntegration/firstLogisticsEstimated/index';

export const listApi = {
	getList: getFirstLogisticsEstimatedPage,
	exportList: getFirstLogisticsEstimatedExport,
	auditList: getFirstLogisticsEstimatedPage,
	payList: getFirstLogisticsEstimatedPage,
	invalidateList: generateFirstLogisticsEstimatedBill,
	getAuditDetail: getFirstLogisticsEstimatedPage,
};

export const searchConfig = [
	{
		component: 'TreeSelectInputApi',
		props: {
			componentType: 'dicts',
			settings: {
				code: 'applyOrderStatusList',
				text: '申请状态',
				getTreeDataParams: 'APPLY_ORDER_STATUS',
			},
		},
	},
	{
		component: 'TreeSelectInputApi',
		props: {
			componentType: 'dicts',
			settings: {
				text: '单据来源',
				code: 'orderResource',
				getTreeDataParams: 'APPLY_ORDER_SOURCE',
			},
		},
	},
	{
		component: 'SelectInputApi',
		props: {
			text: '审核是否通过',
			code: 'auditPassedList',
			componentType: 'yesNo',
		},
	},
	{
		component: 'TreeSelectInputApi',
		props: {
			componentType: 'feeTypeList',
			settings: {
				code: 'costItemList',
				text: '费用项',
			},
		},
	},
	{
		component: 'TreeSelectInputApi',
		props: {
			componentType: 'dicts',
			settings: {
				text: '应付对象',
				code: 'payableObjectList',
				getTreeDataParams: 'APPLY_ORDER_STATUS',
			},
		},
	},
	{
		component: 'TreeSelectInputApi',
		props: {
			componentType: 'dicts',
			settings: {
				text: '业务主体',
				code: 'businessEntityList',
				getTreeDataParams: 'APPLY_ORDER_STATUS',
			},
		},
	},
	{
		component: 'TreeSelectInputApi',
		props: {
			componentType: 'currencyOption',
			settings: {
				text: '付款币种',
				code: 'paymentCurrencyList',
			},
		},
	},
	{
		component: 'SelectDate',
		props: {
			searchTypes: [
				{
					label: '业务时间',
					value: 'businessDate',
					isAddHMS: false,
					dateStart: 'businessDateStart',
					dateEnd: 'businessDateEnd',
				},
				{
					label: '到期日',
					value: 'dueDate',
					isAddHMS: false,
					dateStart: 'dueDateStart',
					dateEnd: 'dueDateEnd',
				},
				{
					label: '申请时间',
					value: 'applyDate',
					isAddHMS: false,
					dateStart: 'applyDateStart',
					dateEnd: 'applyDateEnd',
				},
				{
					label: '付款时间',
					value: 'paymentTime',
					isAddHMS: false,
					dateStart: 'paymentTimeStart',
					dateEnd: 'paymentTimeEnd',
				},
				{
					label: '期望付款日期',
					value: 'expectedPaymentDate',
					isAddHMS: false,
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
				text: '付款方式',
				code: 'paymentMethodList',
				getTreeDataParams: 'paymentMethods',
			},
		},
	},
	{
		component: 'TreeSelectInputApi',
		props: {
			componentType: 'dicts',
			settings: {
				text: '紧急程度',
				code: 'urgencyLevelList',
				getTreeDataParams: 'urgencyLevels',
			},
		},
	},
	{
		component: 'SelectInput',
		props: {
			searchTypes: [
				{
					label: '申请单号',
					value: 'applyOrderNoList',
				},
				{
					label: '付款人',
					value: 'payerIdList',
				},
			],
		},
	},
	{
		component: 'SelectInput',
		props: {
			searchTypes: [
				{
					label: 'SKU',
					value: 'skuList',
				},
			],
		},
	},
	{
		component: 'SelectInput',
		props: {
			searchTypes: [
				{
					label: '请款单号',
					value: 'paymentRequestNoList',
				},
				{
					label: '申请人员',
					value: 'applicantIdList',
				},
			],
		},
	},
];

const columns: Columns = [
	{
		type: 'checkbox',
		width: 60,
		align: 'center',
		fixed: 'left',
	},
	{
		title: '申请单号',
		field: 'applyOrderNo',
		width: 180,
	},
	{
		title: '请款单号',
		field: 'paymentRequestNo',
		width: 180,
	},
	{
		title: '申请单状态',
		field: 'applyOrderStatus',
		width: 120,
	},
	{
		title: '单据来源',
		field: 'orderSource',
		width: 120,
	},
	{
		title: '审核是否通过',
		field: 'auditPassed',
		width: 140,
	},
	{
		title: '审核驳回原因',
		field: 'auditRejectReason',
		width: 180,
	},
	{
		title: '费用类型',
		field: 'costType',
		width: 120,
	},
	{
		title: '费用项',
		field: 'costItem',
		width: 150,
	},
	{
		title: '应付对象',
		field: 'payableObject',
		width: 150,
	},
	{
		title: '业务主体',
		field: 'businessEntity',
		width: 150,
	},
	{
		title: '付款币种',
		field: 'paymentCurrency',
		width: 120,
	},
	{
		title: '付款汇率',
		field: 'paymentExchangeRate',
		width: 120,
	},
	{
		title: '本次申请金额',
		field: 'currentApplyAmount',
		width: 150,
	},
	{
		title: '期望付款日期',
		field: 'expectedPaymentDate',
		width: 150,
		sortable: true,
	},
	{
		title: '业务时间',
		field: 'businessDate',
		width: 150,
		sortable: true,
	},
	{
		title: '到期日',
		field: 'dueDate',
		width: 120,
		sortable: true,
	},
	{
		title: '申请时间',
		field: 'applyDate',
		width: 120,
		sortable: true,
	},
	{
		title: '付款方式',
		field: 'paymentMethod',
		width: 120,
	},
	{
		title: '紧急程度',
		field: 'urgencyLevel',
		width: 120,
	},
	{
		title: '申请人员',
		field: 'applicantId',
		width: 120,
	},
	{
		title: '附件',
		field: 'attachmentUrlsList',
		width: 120,
	},
	{
		title: '付款人',
		field: 'payerId',
		width: 120,
	},
	{
		title: '付款金额',
		field: 'paymentAmount',
		width: 150,
	},
	{
		title: '付款时间',
		field: 'paymentTime',
		width: 180,
		sortable: true,
	},
	{
		title: '操作',
		field: 'action',
		width: 300,
		fixed: 'right',
	},
];

const moduleKey = 'applicationForm_logistics';

export { columns, moduleKey };
