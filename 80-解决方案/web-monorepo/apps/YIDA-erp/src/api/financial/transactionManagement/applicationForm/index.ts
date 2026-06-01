import { httpService } from '/@/utils/request';

/**
 * 分页查询
 */
export const getLogisticsPaymentApplyOrderPage = (data?: object) => {
	return httpService.post('/finance/logisticsPaymentApplyOrder/page', data);
};

/**
 * 审核/驳回
 */
export const approveOrRejectLogisticsPaymentApplyOrder = (data?: object) => {
	return httpService.post(
		'/financelogisticsPaymentApplyOrder/approveOrReject',
		data
	);
};

/**
 * 作废申请单
 */
export const invalidateLogisticsPaymentApplyOrder = (data?: object) => {
	return httpService.post(
		'/finance/logisticsPaymentApplyOrder/invalidate',
		data
	);
};

/**
 * 付款申请单
 */
export const payLogisticsPaymentApplyOrder = (data?: object) => {
	return httpService.post('/finance/logisticsPaymentApplyOrder/pay', data);
};

/**
 * 导出申请单
 */
export const exportLogisticsPaymentApplyOrderPage = (data?: object) => {
	return httpService.post('/finance/logisticsPaymentApplyOrder/export', data);
};
