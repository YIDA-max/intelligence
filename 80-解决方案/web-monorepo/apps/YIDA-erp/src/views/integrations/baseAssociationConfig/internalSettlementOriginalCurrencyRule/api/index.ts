import { httpService } from '/@/utils/request';

/**
 * 分页列表
 * @param params
 * @returns
 */
export function getInternalSettlementOriginalCurrencyRulePage(params: any) {
	return httpService.get(
		'/integrations/internalSettlementOriginalCurrencyRule/page',
		{
			params,
		}
	);
}

/**
 * 根据id获取详情
 * @param data
 * @returns
 */
export function getInternalSettlementOriginalCurrencyRuleDetail(data: any) {
	return httpService.get(
		`/integrations/internalSettlementOriginalCurrencyRule/detail`,
		{
			params: data,
		}
	);
}

/**
 * 新增
 * @param data
 * @returns
 */
export function addInternalSettlementOriginalCurrencyRule(data: any) {
	return httpService.post(
		'/integrations/internalSettlementOriginalCurrencyRule',
		data
	);
}

/**
 * 编辑
 * @param data
 * @returns
 */
export function updateInternalSettlementOriginalCurrencyRule(data: any) {
	return httpService.put(
		'/integrations/internalSettlementOriginalCurrencyRule',
		data
	);
}

/**
 * 导出
 * @param params
 * @returns
 */
export function getExportInternalSettlementOriginalCurrencyRule(params?: any) {
	return httpService.get(
		'/integrations/internalSettlementOriginalCurrencyRule/export',
		{
			params: params,
			responseType: 'blob',
		}
	);
}
