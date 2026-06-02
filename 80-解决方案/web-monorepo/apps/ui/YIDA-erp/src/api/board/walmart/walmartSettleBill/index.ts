import { httpService } from '/@/utils/request';
/**
 * 分页查询结算账单
 * @param data
 * @returns
 */
export function getWalmartSettleBillPage(data: any) {
	return httpService.post('/finance/walmartSettlementReport/page', data);
}

/**
 * 导出结算账单数据
 */
export function getExportWalmartSettleBill(data?: any) {
	return httpService.post('/finance/walmartSettlementReport/export', data, {
		responseType: 'blob',
	});
}
