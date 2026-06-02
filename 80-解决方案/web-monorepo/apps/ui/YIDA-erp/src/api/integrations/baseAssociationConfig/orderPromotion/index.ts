/*
 * @Description: 订单推送关系 API
 */
import { httpService } from '/@/utils/request';

/** 导入模板地址 */
export const ORDER_PROMOTION_IMPORT_TEMPLATE_URL =
	'/files/import-template/订单推送关系导入模板.xlsx';
/** 导入接口地址 */
export const ORDER_PROMOTION_IMPORT_URL = '/kingdee/orderPushRelation/import';
import type { OrderItem } from '../types';

export interface OrderPushRelationVO {
	/** id */
	id?: number;
	/** integrationModule */
	integrationModule?: string;
	/** platform */
	platform?: string;
	/** shopName */
	shopName?: string;
	/** kingdeeBillType */
	kingdeeBillType?: string;
	/** status */
	status?: string;
	/** createName */
	createName?: string;
	/** createTime */
	createTime?: string;
	/** updateName */
	updateName?: string;
	/** updateTime */
	updateTime?: string;
}

export interface PageOrderPushRelationVO {
	records: OrderPushRelationVO[];
	total?: number;
	size?: number;
	current?: number;
	orders?: OrderItem[];
	optimizeCountSql?: boolean;
	searchCount?: boolean;
	optimizeJoinOfCountSql?: boolean;
	maxLimit?: number;
	countId?: string;
	/** 勾选的id列表  导出时使用 */
	ids?: number[];
	[key: string]: any;
}

export interface QueryOrderPushRelationPageParams {
	total?: number;
	size?: number;
	current?: number;
	optimizeCountSql?: boolean;
	searchCount?: boolean;
	optimizeJoinOfCountSql?: boolean;
	maxLimit?: number;
	countId?: string;
	/** 集成模块 */
	integrationModules?: string[];
	/** 平台 */
	platforms?: string[];
	/** 店铺 */
	shopNames?: string[];
	/** 金蝶单据 */
	kingdeeBillTypes?: string[];
	/** 状态 */
	statuses?: string[];
	/** 创建人ID集合 */
	createIds?: number[];
	/** 创建时间-开始 */
	createTimeStart?: string;
	/** 创建时间-结束 */
	createTimeEnd?: string;
	/** 勾选的id列表  导出时使用 */
	ids?: number[];
}

/** 分页查询订单推送关系 */
export function getOrderPushRelationPage(
	data: QueryOrderPushRelationPageParams
) {
	return httpService.post<PageOrderPushRelationVO>(
		'/kingdee/orderPushRelation/page',
		data
	);
}

/** 新增订单推送关系 */
export function addOrderPushRelation(data: any) {
	return httpService.post<{ code: number; data: number; msg: string }>(
		'/kingdee/orderPushRelation/add',
		data
	);
}

/** 编辑订单推送关系 */
export function updateOrderPushRelation(data: any) {
	return httpService.post<{ code: number; data: boolean; msg: string }>(
		'/kingdee/orderPushRelation/update',
		data
	);
}

/** 删除订单推送关系 */
export function deleteOrderPushRelation(data: { id: number }) {
	return httpService.post<{ code: number; data: boolean; msg: string }>(
		'/kingdee/orderPushRelation/delete',
		data
	);
}

/** 获取订单推送关系详情 */
export function getOrderPushRelationDetail(params: { id: number }) {
	return httpService.get<{ code: number; data: any; msg: string }>(
		'/kingdee/orderPushRelation/detail',
		{ params }
	);
}

/** 导出订单推送关系 */
export function getExportOrderPromotion(params?: any) {
	return httpService.post('/kingdee/orderPushRelation/export', params ?? {}, {
		responseType: 'blob',
	});
}
