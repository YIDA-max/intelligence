/*
 * @Author: YIDA 3136271519@qq.com
 * @Date: 2025-12-01 15:22:09
 * @LastEditors: YIDA zhuhansong@merach.com
 * @LastEditTime: 2026-04-14 18:15:42
 * @FilePath: \qianyi-ui\src\api\base\exchangeRate\index.ts
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
import { httpService } from '/@/utils/request';
import { BaseCurrencyVO } from '/@/interface/views/base/exchangeRate/index';
export * from '/@/interface/views/base/exchangeRate/index';
/**
 * 分页查询
 * @param params
 * @returns
 */
export function getBaseCurrencyPage(params: { [key: string]: any }) {
	return httpService.get<{
		code: number;
		data: {
			records: BaseCurrencyVO[];
			total: number;
			size: number;
			current: number;
			pages: number;
		};
		msg: string;
	}>('/admin/baseCurrency/page', {
		params,
	});
}
/**
 *  查询基础货币列表
 * @param params
 * @returns
 */
export function getBaseCurrencyGetListByCondition(params: {
	[key: string]: any;
}) {
	return httpService.get<{
		code: number;
		data: {
			records: BaseCurrencyVO[];
			total: number;
			size: number;
			current: number;
			pages: number;
		};
		msg: string;
	}>('/admin/baseCurrency/getListByCondition', {
		params,
	});
}
/**
 * 更新
 * @param params
 * @returns
 */
export function putBaseCurrencyUpdate(data: { [key: string]: any }) {
	return httpService.put<{
		code: number;
		data: unknown;
		msg: string;
	}>('/admin/baseCurrency/update', data);
}
