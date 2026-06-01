import { httpService } from '/@/utils/request';

/** 分页查询 */
export function getAgeListPage(data?: any) {
	return httpService.post('/stock/companyStockAge/page', data);
}

/** 导出 */
export function getAgeListExport(data?: any) {
	return httpService.post('/stock/companyStockAge/export', data, {
		responseType: 'blob',
	});
}
export function getQuanityList(data?: Object) {
	return httpService.post('/stock/companyStockAge/detail', data);
}
