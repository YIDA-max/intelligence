/*
 * @Author: YIDA 3136271519@qq.com
 * @Date: 2025-12-01 15:22:09
 * @LastEditors: YIDA zhuhansong@merach.com
 * @LastEditTime: 2026-04-11 17:00:34
 * @FilePath: \qianyi-ui\src\api\fbm\logisticsChannel\platformLogistics\index.ts
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
import { httpService } from '/@/utils/request';
import type {
	PlatformLogisticsProviderVO,
	QueryPlatformLogisticsProviderVO,
	PlatformLogisticsVO,
	QueryPlatformLogisticsVO,
	PlatformLogisticsSaveDTO,
	PlatformLogisticsDetailVO,
	PlatformLogisticsUpdateDTO,
	PlatformLogisticsResponse,
} from '/@/interface/views/fbm/logisticsChannel/platformLogistics/index';
export * from '/@/interface/views/fbm/logisticsChannel/platformLogistics/index';
/**
 * 获取平台物流供应商列表
 * @param params
 * @returns
 */
export function getPlatformLogisticsProviderList(
	params: QueryPlatformLogisticsProviderVO
) {
	return httpService.get<{
		code: number;
		data: PlatformLogisticsProviderVO[];
		msg: string;
	}>('/fbm/platformLogistics/providerList', {
		params,
	});
}
/**
 * 获取平台物流供应商列表
 * @param params
 * @returns
 */
export function getPlatformLogisticsPage(data: QueryPlatformLogisticsVO) {
	return httpService.post<{
		code: number;
		data: {
			records: PlatformLogisticsVO[];
			total: number;
			size: number;
			current: number;
			pages: number;
		};
		msg: string;
	}>('/fbm/platformLogistics/page', data);
}
/**
 * 新增平台物流
 * @param params
 * @returns
 */
export function postPlatformLogisticsSave(data: PlatformLogisticsSaveDTO) {
	return httpService.post<{
		code: number;
		data: any;
		msg: string;
	}>('/fbm/platformLogistics/save', data, {
		loadingConfig: {
			loading: true,
		},
	});
}
/**
 * 查看详情
 * @param params
 * @returns
 */
export function getPlatformLogisticsDetailInfo(params: { id: number }) {
	return httpService.get<{
		code: number;
		data: PlatformLogisticsDetailVO;
		msg: string;
	}>('/fbm/platformLogistics/detailInfo', {
		params,
	});
}
/**
 * 启用/禁用平台物流
 * @param data
 * @returns
 */
export function postPlatformLogisticsUpdateStatus(data: {
	id: number; // 物流ID
	status: number; // 1: 启用, 0: 禁用
}) {
	return httpService.post<{
		code: number;
		data: any;
		msg: string;
	}>('/fbm/platformLogistics/updateStatus', data);
}
/**
 * 批量启用/禁用平台物流
 * @param data
 * @returns
 */
export function postPlatformLogisticsBatchUpdateStatus(data: {
	ids: number[]; // 物流ID
	status: number; // 1: 启用, 0: 禁用
}) {
	return httpService.post<{
		code: number;
		data: any;
		msg: string;
	}>('/fbm/platformLogistics/batchUpdateStatus', data);
}
/**
 * 根据物流商启用/禁用平台物流
 * @param data
 * @returns
 */
export function postPlatformLogisticsUpdateStatusByProvider(data: {
	id: number; // 物流ID
	status: number; // 1: 启用, 0: 禁用
}) {
	return httpService.post<{
		code: number;
		data: any;
		msg: string;
	}>('/fbm/platformLogistics/updateStatusByProvider', data);
}
/**
 * 更新平台物流

 * @param data
 * @returns
 */
export function postPlatformLogisticsUpdate(data: PlatformLogisticsUpdateDTO) {
	return httpService.post<{
		code: number;
		data: any;
		msg: string;
	}>('/fbm/platformLogistics/update', data);
}
/**
 * 查询平台物流树形结构
 * @param data
 * @returns
 */
export function getPlatformLogisticsTree(params: any) {
	return httpService.get<{
		code: number;
		data: PlatformLogisticsResponse;
		msg: string;
	}>('/fbm/platformLogistics/tree', {
		params,
	});
}
/**
 * 查询仓库物流渠道(树形结构列表)
 * @param data
 * @returns
 */
export function getWarehouseLogisticsChannelTree(params: {
	logisticsChannelNameCns?: string; // 物流渠道名称(中文)
	status?: number; // 状态 0: 禁用, 1: 启用
	createIds?: number[]; // 创建人ID集合
	syncTimeStart?: string; // 同步时间开始
	syncTimeEnd?: string; // 同步时间结束
	warehouseCodes?: string[]; // 仓库编码集合
}) {
	return httpService.get<{
		code: number;
		data: Array<any>;
		msg: string;
	}>('/fbm/logisticsChannel/tree', {
		params,
	});
}
