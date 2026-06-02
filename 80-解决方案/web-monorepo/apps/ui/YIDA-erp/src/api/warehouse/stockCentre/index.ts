/*
 * @Author: wuyueqin wuyueqin@merach.com
 * @Date: 2025-11-25 09:56:55
 * @LastEditors: YIDA zhuhansong@merach.com
 * @LastEditTime: 2026-04-11 12:11:03
 * @FilePath: \qianyi-ui\src\api\warehouse\stockCentre\index.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import request from '/@/utils/request';

/**
 * 分页查询中央库存
 * */
export function getCentralStockPage(data?: object) {
	return request({
		url: '/stock/centralInventory/page',
		method: 'post',
		data,
	});
}
/**
 * 导出中央库存excel表格
 * */
export function getCentralStockExport(data?: object) {
	return request({
		url: '/stock/centralInventory/export',
		method: 'post',
		data,
		responseType: 'blob',
	});
}
