import { httpService } from '/@/utils/request';

/**
 * 分页列表
 * @param params
 * @returns
 */
export function getOrderPromotionPage(params: any) {
	return httpService.get('/integrations/orderPromotion/page', {
		params,
	});
}

/**
 * 根据id获取详情
 * @param data
 * @returns
 */
export function getOrderPromotionDetail(data: any) {
	return httpService.get(`/integrations/orderPromotion/detail`, {
		params: data,
	});
}

/**
 * 新增
 * @param data
 * @returns
 */
export function addOrderPromotion(data: any) {
	return httpService.post('/integrations/orderPromotion', data);
}

/**
 * 编辑
 * @param data
 * @returns
 */
export function updateOrderPromotion(data: any) {
	return httpService.put('/integrations/orderPromotion', data);
}

/**
 * 导出
 * @param params
 * @returns
 */
export function getExportOrderPromotion(params?: any) {
	return httpService.get('/integrations/orderPromotion/export', {
		params: params,
		responseType: 'blob',
	});
}
