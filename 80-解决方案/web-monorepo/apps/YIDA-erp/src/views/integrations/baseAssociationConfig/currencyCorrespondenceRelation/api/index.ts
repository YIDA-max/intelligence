import { httpService } from '/@/utils/request';

/**
 * 分页列表
 * @param params
 * @returns
 */
export function getCurrencyCorrespondenceRelationPage(params: any) {
	return httpService.get('/integrations/currencyCorrespondenceRelation/page', {
		params,
	});
}

/**
 * 根据id获取详情
 * @param data
 * @returns
 */
export function getCurrencyCorrespondenceRelationDetail(data: any) {
	return httpService.get(
		`/integrations/currencyCorrespondenceRelation/detail`,
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
export function addCurrencyCorrespondenceRelation(data: any) {
	return httpService.post('/integrations/currencyCorrespondenceRelation', data);
}

/**
 * 编辑
 * @param data
 * @returns
 */
export function updateCurrencyCorrespondenceRelation(data: any) {
	return httpService.put('/integrations/currencyCorrespondenceRelation', data);
}

/**
 * 导出
 * @param params
 * @returns
 */
export function getExportCurrencyCorrespondenceRelation(params?: any) {
	return httpService.get(
		'/integrations/currencyCorrespondenceRelation/export',
		{
			params: params,
			responseType: 'blob',
		}
	);
}
