/*
 * @Description: 采购组织关系 API
 */
import { httpService } from '/@/utils/request';
import type { OrderItem } from '../types';
export const PURCHASE_ORG_RELATION_IMPORT_TEMPLATE_URL =
	'/files/import-template/采购组织关系导入模板.xlsx';
export const PURCHASE_ORG_RELATION_IMPORT_URL =
	'/kingdee/purchaseOrgRelation/import';
export interface PurchaseOrgRelationVO {
	/** id */
	id?: number;
	/** legalPersonId */
	legalPersonId?: number;
	/** legalPersonName */
	legalPersonName?: string;
	/** kingdeeOrgCode */
	kingdeeOrgCode?: string;
	/** kingdeeOrgName */
	kingdeeOrgName?: string;
	/** kingdeeCurrency */
	kingdeeCurrency?: string;
	/** overseasFlag */
	overseasFlag?: number;
	/** kingdeeDefaultWarehouse */
	kingdeeDefaultWarehouse?: string;
	/** createName */
	createName?: string;
	/** createTime */
	createTime?: string;
	/** updateName */
	updateName?: string;
	/** updateTime */
	updateTime?: string;
}

export interface PagePurchaseOrgRelationVO {
	records: PurchaseOrgRelationVO[];
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

export interface QueryPurchaseOrgRelationPageParams {
	total?: number;
	size?: number;
	current?: number;
	optimizeCountSql?: boolean;
	searchCount?: boolean;
	optimizeJoinOfCountSql?: boolean;
	maxLimit?: number;
	countId?: string;
	/** 仟易采购主体ID集合 */
	legalPersonIds?: number[];
	/** 金蝶采购组织编码集合 */
	kingdeeOrgCodes?: string[];
	/** 创建人ID集合 */
	createIds?: number[];
	/** 创建时间-开始 */
	createTimeStart?: string;
	/** 创建时间-结束 */
	createTimeEnd?: string;
	/** 勾选的id列表  导出时使用 */
	ids?: number[];
}

/** 分页查询采购组织关系表 */
export function getPurchaseOrgRelationPage(data: PagePurchaseOrgRelationVO) {
	return httpService.post<PagePurchaseOrgRelationVO>(
		'/kingdee/purchaseOrgRelation/page',
		data
	);
}

/** 新增采购组织关系表 */
export function addPurchaseOrgRelation(data: any) {
	return httpService.post<{ code: number; data: number; msg: string }>(
		'/kingdee/purchaseOrgRelation/add',
		data
	);
}

/** 编辑采购组织关系表 */
export function updatePurchaseOrgRelation(data: any) {
	return httpService.post<{ code: number; data: boolean; msg: string }>(
		'/kingdee/purchaseOrgRelation/update',
		data
	);
}

/** 删除采购组织关系表 */
export function deletePurchaseOrgRelation(data: { id: number }) {
	return httpService.post<{ code: number; data: boolean; msg: string }>(
		'/kingdee/purchaseOrgRelation/delete',
		data
	);
}

/** 获取采购组织关系表详情 */
export function getPurchaseOrgRelationDetail(params: { id: number }) {
	return httpService.get<{ code: number; data: any; msg: string }>(
		'/kingdee/purchaseOrgRelation/detail',
		{ params }
	);
}

/** 导出采购组织关系表 */
export function getExportPurchaseOrgRelation(data?: any) {
	return httpService.post('/kingdee/purchaseOrgRelation/export', data, {
		responseType: 'blob',
	});
}
