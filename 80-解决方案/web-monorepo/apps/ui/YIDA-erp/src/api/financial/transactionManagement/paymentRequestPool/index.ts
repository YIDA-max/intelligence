/*
 * @Author: wuyueqin wuyueqin@merach.com
 * @Date: 2026-05-13 19:53:41
 * @LastEditors: wuyueqin wuyueqin@merach.com
 * @LastEditTime: 2026-05-14 17:41:10
 * @FilePath: \qianyi-ui\src\api\financial\transactionManagement\paymentRequestPool\index.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { httpService } from '/@/utils/request';

/**
 * 分页查询
 */
export const getPaymentRequestPoolPage = (_data?: object) => {
	// TODO: 联调时删除此 mock，恢复下方真实请求
	// return Promise.resolve({
	// 	code: 0,
	// 	msg: '',
	// 	data: {
	// 		records: [
	// 			{
	// 				id: 1,
	// 				paymentRequestNo: 'QK20260514000001',
	// 				paymentStatus: 0,
	// 				paymentStatusStr: '未请款',
	// 				applyOrderNo: '',
	// 				applyOrderStatus: '',
	// 				applyOrderStatusStr: '',
	// 				orderSource: '1',
	// 				orderSourceStr: '头程',
	// 				transferOrderNo: 'TF20260514001',
	// 				shippingOrderNo: 'SH20260514001',
	// 				platformOrderNo: '',
	// 				systemOrderNo: 'SYS20260514001',
	// 				warehouseOrderNo: '',
	// 				sku: 'SKU-A001',
	// 				costItemId: 1,
	// 				costItemName: '头程运费',
	// 				payableObject: '顺丰物流',
	// 				payableObjectType: '物流商',
	// 				businessEntity: '深圳仟易科技',
	// 				settlementMethod: 1,
	// 				settlementMethodStr: '月结',
	// 				destinationWarehouse: '三方仓-GLK仓库',
	// 				shippingWarehouse: '',
	// 				currency: 'CNY',
	// 				exchangeRate: 1.0,
	// 				totalAllocatedAmount: 1200.0,
	// 				payableRatio: '100%',
	// 				requestableAmount: 1200.0,
	// 				paidAmount: 0.0,
	// 				accountingMethod: 1,
	// 				accountingMethodStr: '仅请付款',
	// 				businessDate: '2026-05-10 10:00:00',
	// 				dueDate: '2026-06-10',
	// 				operatorName: '张三',
	// 				createTime: '2026-05-14 09:00:00',
	// 				requestDate: '',
	// 				urgencyLevel: 0,
	// 				urgencyLevelStr: '正常',
	// 				expectedPaymentDate: '',
	// 				collectionType: 0,
	// 				collectionTypeStr: '付款',
	// 				paymentMethod: 1,
	// 				paymentMethodStr: '银行转账',
	// 				currentApplyAmount: 0,
	// 				remark: '',
	// 				attachmentUrls: '',
	// 			},
	//       {
	// 				id: 4,
	// 				paymentRequestNo: 'QK20260514000001',
	// 				paymentStatus: 0,
	// 				paymentStatusStr: '未请款',
	// 				applyOrderNo: '',
	// 				applyOrderStatus: '',
	// 				applyOrderStatusStr: '',
	// 				orderSource: '1',
	// 				orderSourceStr: '头程',
	// 				transferOrderNo: 'TF20260514001',
	// 				shippingOrderNo: 'SH20260514001',
	// 				platformOrderNo: '',
	// 				systemOrderNo: 'SYS20260514001',
	// 				warehouseOrderNo: '',
	// 				sku: 'SKU-A001',
	// 				costItemId: 1,
	// 				costItemName: '头程运费',
	// 				payableObject: '顺丰物流',
	// 				payableObjectType: '物流商',
	// 				businessEntity: '深圳仟易科技',
	// 				settlementMethod: 1,
	// 				settlementMethodStr: '月结',
	// 				destinationWarehouse: '三方仓-GLK仓库',
	// 				shippingWarehouse: '',
	// 				currency: 'CNY',
	// 				exchangeRate: 1.0,
	// 				totalAllocatedAmount: 1200.0,
	// 				payableRatio: '100%',
	// 				requestableAmount: 1200.0,
	// 				paidAmount: 0.0,
	// 				accountingMethod: 1,
	// 				accountingMethodStr: '仅请付款',
	// 				businessDate: '2026-05-10 10:00:00',
	// 				dueDate: '2026-06-10',
	// 				operatorName: '张三',
	// 				createTime: '2026-05-14 09:00:00',
	// 				requestDate: '',
	// 				urgencyLevel: 0,
	// 				urgencyLevelStr: '正常',
	// 				expectedPaymentDate: '',
	// 				collectionType: 0,
	// 				collectionTypeStr: '付款',
	// 				paymentMethod: 1,
	// 				paymentMethodStr: '银行转账',
	// 				currentApplyAmount: 0,
	// 				remark: '',
	// 				attachmentUrls: '',
	// 			},
	// 			{
	// 				id: 2,
	// 				paymentRequestNo: 'QK20260514000002',
	// 				paymentStatus: 1,
	// 				paymentStatusStr: '已请款',
	// 				applyOrderNo: 'AP20260514001',
	// 				applyOrderStatus: '1',
	// 				applyOrderStatusStr: '待审核',
	// 				orderSource: '2',
	// 				orderSourceStr: '二程',
	// 				transferOrderNo: 'TF20260514002',
	// 				shippingOrderNo: 'SH20260514002',
	// 				platformOrderNo: 'PL20260514002',
	// 				systemOrderNo: 'SYS20260514002',
	// 				warehouseOrderNo: 'WH20260514002',
	// 				sku: 'SKU-B002',
	// 				costItemId: 2,
	// 				costItemName: '二程派送费',
	// 				payableObject: '京东物流',
	// 				payableObjectType: '物流商',
	// 				businessEntity: '深圳仟易科技',
	// 				settlementMethod: 2,
	// 				settlementMethodStr: '现结',
	// 				destinationWarehouse: '自营仓-深圳仓',
	// 				shippingWarehouse: '',
	// 				currency: 'CNY',
	// 				exchangeRate: 1.0,
	// 				totalAllocatedAmount: 3500.0,
	// 				payableRatio: '100%',
	// 				requestableAmount: 3500.0,
	// 				paidAmount: 0.0,
	// 				accountingMethod: 2,
	// 				accountingMethodStr: '计入成本并请款',
	// 				businessDate: '2026-05-11 14:30:00',
	// 				dueDate: '2026-05-25',
	// 				operatorName: '李四',
	// 				createTime: '2026-05-14 09:30:00',
	// 				requestDate: '2026-05-14 10:00:00',
	// 				urgencyLevel: 1,
	// 				urgencyLevelStr: '加急',
	// 				expectedPaymentDate: '2026-05-20',
	// 				collectionType: 0,
	// 				collectionTypeStr: '付款',
	// 				paymentMethod: 1,
	// 				paymentMethodStr: '银行转账',
	// 				currentApplyAmount: 3500.0,
	// 				remark: '加急处理',
	// 				attachmentUrls: '发票.pdf',
	// 			},
	// 			{
	// 				id: 3,
	// 				paymentRequestNo: 'QK20260514000003',
	// 				paymentStatus: 2,
	// 				paymentStatusStr: '已作废',
	// 				applyOrderNo: '',
	// 				applyOrderStatus: '',
	// 				applyOrderStatusStr: '',
	// 				orderSource: '3',
	// 				orderSourceStr: '尾程',
	// 				transferOrderNo: '',
	// 				shippingOrderNo: '',
	// 				platformOrderNo: 'PL20260513001',
	// 				systemOrderNo: 'SYS20260513001',
	// 				warehouseOrderNo: 'WH20260513001',
	// 				sku: 'SKU-C003',
	// 				costItemId: 3,
	// 				costItemName: '尾程配送费',
	// 				payableObject: '深圳市邮全球贸易有限公司',
	// 				payableObjectType: '物流商',
	// 				businessEntity: '广州仟易贸易',
	// 				settlementMethod: 3,
	// 				settlementMethodStr: '双月结',
	// 				destinationWarehouse: '',
	// 				shippingWarehouse: '三方仓-FFM泰国仓',
	// 				currency: 'USD',
	// 				exchangeRate: 7.25,
	// 				totalAllocatedAmount: 580.0,
	// 				payableRatio: '100%',
	// 				requestableAmount: 580.0,
	// 				paidAmount: 0.0,
	// 				accountingMethod: 1,
	// 				accountingMethodStr: '仅请付款',
	// 				businessDate: '2026-05-08 09:00:00',
	// 				dueDate: '2026-07-08',
	// 				operatorName: '王五',
	// 				createTime: '2026-05-13 16:00:00',
	// 				requestDate: '',
	// 				urgencyLevel: 2,
	// 				urgencyLevelStr: '特急',
	// 				expectedPaymentDate: '',
	// 				collectionType: 1,
	// 				collectionTypeStr: '报销',
	// 				paymentMethod: 7,
	// 				paymentMethodStr: '电汇',
	// 				currentApplyAmount: 0,
	// 				remark: '重复录入已作废',
	// 				attachmentUrls: '',
	// 			},
	// 		],
	// 		total: 3,
	// 		size: 10,
	// 		current: 1,
	// 	},
	// });
	return httpService.post('/finance/logisticsPaymentRequestPool/page', _data);
};

/**
 * 导出
 */
export const exportPaymentRequestPool = (data?: object) => {
	return httpService.post('/finance/logisticsPaymentRequestPool/export', data, {
		responseType: 'blob',
	});
};

/**
 * 作废
 */
export const discardPaymentRequestPool = (data?: object) => {
	return httpService.post('/finance/logisticsPaymentRequestPool/discard', data);
};

/**
 * 确认请款
 */
export const confirmPaymentRequest = (data?: object) => {
	return httpService.post(
		'/finance/logisticsPaymentRequestPool/confirmRequest',
		data,
		{
			loadingConfig: {
				loading: true,
			},
		}
	);
};

/**
 * 获取应付对象列表
 */
export const getPayableObjectList = (data?: object) => {
	return httpService.post(
		'/finance/logisticsPaymentRequestPool/getPayableObjectList',
		data
	);
};
