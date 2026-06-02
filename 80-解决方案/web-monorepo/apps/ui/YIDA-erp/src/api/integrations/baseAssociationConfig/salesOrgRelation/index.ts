/*
 * @Description: 销售组织关系 API
 */
import { httpService } from '/@/utils/request';

/** 导入模板地址 */
export const SALES_ORG_RELATION_IMPORT_TEMPLATE_URL =
	'/files/import-template/销售组织关系导入模板.xlsx';
/** 导入接口地址 */
export const SALES_ORG_RELATION_IMPORT_URL = '/kingdee/salesOrgRelation/import';
import type { OrderItem } from '../types';

export interface SalesOrgRelationVO {
	/** id */
	id?: number;
	/** platformChannelCode */
	platformChannelCode?: string;
	/** platformChannelText */
	platformChannelText?: string;
	/** storeId */
	storeId?: number;
	/** storeName */
	storeName?: string;
	/** kingdeeSalesOrgCode */
	kingdeeSalesOrgCode?: string;
	/** kingdeeSalesOrgName */
	kingdeeSalesOrgName?: string;
	/** kingdeeCustomerCode */
	kingdeeCustomerCode?: string;
	/** kingdeeCustomerName */
	kingdeeCustomerName?: string;
	/** kingdeeFbaTransitWhCode */
	kingdeeFbaTransitWhCode?: string;
	/** kingdeeFbaTransitWhName */
	kingdeeFbaTransitWhName?: string;
	/** kingdeeOverseasTransitWhCode */
	kingdeeOverseasTransitWhCode?: string;
	/** kingdeeOverseasTransitWhName */
	kingdeeOverseasTransitWhName?: string;
	/** platformDeliveryKingdeeWhCode */
	platformDeliveryKingdeeWhCode?: string;
	/** platformDeliveryKingdeeWhName */
	platformDeliveryKingdeeWhName?: string;
	/** kingdeeDispatchWhCode */
	kingdeeDispatchWhCode?: string;
	/** kingdeeDispatchWhName */
	kingdeeDispatchWhName?: string;
	/** kingdeeOrgCode */
	kingdeeOrgCode?: string;
	/** kingdeeOrgName */
	kingdeeOrgName?: string;
	/** kingdeeBusinessLineName */
	kingdeeBusinessLineName?: string;
	/** createName */
	createName?: string;
	/** createTime */
	createTime?: string;
	/** updateName */
	updateName?: string;
	/** updateTime */
	updateTime?: string;
}

export interface PageSalesOrgRelationVO {
	records: SalesOrgRelationVO[];
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
	[key: string]: unknown;
}

export interface QuerySalesOrgRelationPageParams {
	total?: number;
	size?: number;
	current?: number;
	optimizeCountSql?: boolean;
	searchCount?: boolean;
	optimizeJoinOfCountSql?: boolean;
	maxLimit?: number;
	countId?: string;
	/** 仟易平台(渠道编码) */
	platformChannelCodes?: string[];
	/** 仟易店铺id */
	shoreIds?: string[];
	/** 金蝶销售组织编码 */
	kingdeeSalesOrgCodes?: string[];
	/** 金蝶销售组织名称 */
	kingdeeSalesOrgNames?: string[];
	/** 创建人ID集合 */
	createIds?: number[];
	/** 创建时间-开始 */
	createTimeStart?: string;
	/** 创建时间-结束 */
	createTimeEnd?: string;
	/** 勾选的id列表  导出时使用 */
	ids?: number[];
}

/** 分页查询销售组织关系 */
export function getSalesOrgRelationPage(data: QuerySalesOrgRelationPageParams) {
	return httpService.post<PageSalesOrgRelationVO>(
		'/kingdee/salesOrgRelation/page',
		data
	);
}

/** 新增销售组织关系 */
export function addSalesOrgRelation(data: any) {
	return httpService.post<{ code: number; data: number; msg: string }>(
		'/kingdee/salesOrgRelation/add',
		data
	);
}

/** 编辑销售组织关系 */
export function updateSalesOrgRelation(data: any) {
	return httpService.post<{ code: number; data: boolean; msg: string }>(
		'/kingdee/salesOrgRelation/update',
		data
	);
}

/** 删除销售组织关系 */
export function deleteSalesOrgRelation(data: { id: number }) {
	return httpService.post<{ code: number; data: boolean; msg: string }>(
		'/kingdee/salesOrgRelation/delete',
		data
	);
}

/** 获取销售组织关系详情 */
export function getSalesOrgRelationDetail(params: { id: number }) {
	return httpService.get<{ code: number; data: any; msg: string }>(
		'/kingdee/salesOrgRelation/detail',
		{ params }
	);
}

/** 导出销售组织关系 */
export function getExportSalesOrgRelation(params?: any) {
	return httpService.post('/kingdee/salesOrgRelation/export', params ?? {}, {
		responseType: 'blob',
	});
}
