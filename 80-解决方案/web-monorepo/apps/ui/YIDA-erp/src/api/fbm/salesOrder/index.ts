/*
 * @Author: YIDA 3136271519@qq.com
 * @Date: 2025-09-28 20:37:09
 * @LastEditors: YIDA zhuhansong@merach.com
 * @LastEditTime: 2026-04-11 12:15:53
 * @FilePath: \qianyi-ui\src\api\fbm\salesOrder\index.ts
 * @Description:
 *
 * Copyright (c) 2026 by ${git_name_email}, All Rights Reserved.
 */
import request from '/@/utils/request';

// 销售订单分页
export function getorderBasicList(data: any) {
	return request({
		url: '/fbm/orderBasic/search',
		method: 'post',
		data,
	});
}
// 销售订单详情
export function getOrderDetailByOrderNo(params: any) {
	return request({
		url: '/fbm/orderBasic/getOrderDetailByOrderNo',
		method: 'get',
		params,
	});
}
// 修改订单备注
export function updateOrderRemark(data: any) {
	return request({
		url: '/fbm/orderBasic/updateOrderRemark',
		method: 'post',
		data,
	});
}
// 导出销售订单
export function getExportOrder(data: any) {
	return request({
		url: '/fbm/orderBasic/export',
		method: 'post',
		data,
		responseType: 'blob',
	});
}
