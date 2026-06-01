/*
 * @Description: 内部客户与组织关系 API
 */
import { httpService } from '/@/utils/request';

/** 导入模板地址 */
export const INTERNAL_CUSTOMER_ORG_RELATION_IMPORT_TEMPLATE_URL =
	'/files/import-template/内部客户与组织关系导入模板.xlsx';
/** 导入接口地址 */
export const INTERNAL_CUSTOMER_ORG_RELATION_IMPORT_URL =
	'/kingdee/internalCustomerOrgRelation/import';
import type { OrderItem } from '../types';

export interface InternalCustomerOrgRelationVO {
	/** id */
	id?: number;
	/** relationName */
	relationName?: string;
	/** internalCustomerCode */
	internalCustomerCode?: string;
	/** customerOrgCode */
	customerOrgCode?: string;
	/** createName */
	createName?: string;
	/** createTime */
	createTime?: string;
	/** updateName */
	updateName?: string;
	/** updateTime */
	updateTime?: string;
}

export interface PageInternalCustomerOrgRelationVO {
	records: InternalCustomerOrgRelationVO[];
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

export interface QueryInternalCustomerOrgRelationPageParams {
	total?: number;
	size?: number;
	current?: number;
	optimizeCountSql?: boolean;
	searchCount?: boolean;
	optimizeJoinOfCountSql?: boolean;
	maxLimit?: number;
	countId?: string;
	/** 金蝶内部客户与组织关系 */
	relationNames?: string[];
	/** 金蝶内部客户编码 */
	internalCustomerCodes?: string[];
	/** 客户对应金蝶组织编码 */
	customerOrgCodes?: string[];
	/** 创建人ID集合 */
	createIds?: number[];
	/** 创建时间-开始 */
	createTimeStart?: string;
	/** 创建时间-结束 */
	createTimeEnd?: string;
	/** 勾选的id列表  导出时使用 */
	ids?: number[];
}

/** 分页查询内部客户与组织关系 */
export function getInternalCustomerOrgRelationPage(
	data: QueryInternalCustomerOrgRelationPageParams
) {
	return httpService.post<PageInternalCustomerOrgRelationVO>(
		'/kingdee/internalCustomerOrgRelation/page',
		data
	);
}

/** 新增内部客户与组织关系 */
export function addInternalCustomerOrgRelation(data: any) {
	return httpService.post<{ code: number; data: number; msg: string }>(
		'/kingdee/internalCustomerOrgRelation/add',
		data
	);
}

/** 编辑内部客户与组织关系 */
export function updateInternalCustomerOrgRelation(data: any) {
	return httpService.post<{ code: number; data: boolean; msg: string }>(
		'/kingdee/internalCustomerOrgRelation/update',
		data
	);
}

/** 获取内部客户与组织关系详情 */
export function getInternalCustomerOrgRelationDetail(params: { id: number }) {
	return httpService.get<{ code: number; data: any; msg: string }>(
		'/kingdee/internalCustomerOrgRelation/detail',
		{ params }
	);
}

/** 删除内部客户与组织关系 */
export function deleteInternalCustomerOrgRelation(data: { id: number }) {
	return httpService.post<{ code: number; data: boolean; msg: string }>(
		'/kingdee/internalCustomerOrgRelation/delete',
		data
	);
}

/** 导出内部客户与组织关系 */
export function getExportInternalCustomerOrgRelation(params?: any) {
	return httpService.post(
		'/kingdee/internalCustomerOrgRelation/export',
		params ?? {},
		{
			responseType: 'blob',
		}
	);
}
