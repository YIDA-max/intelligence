/*
 * @Description: 内部供应商与组织关系 API
 */
import { httpService } from '/@/utils/request';

/** 导入模板地址 */
export const INTERNAL_SUPPLIER_ORG_RELATION_IMPORT_TEMPLATE_URL =
	'/files/import-template/内部供应商与组织关系导入模板.xlsx';
/** 导入接口地址 */
export const INTERNAL_SUPPLIER_ORG_RELATION_IMPORT_URL =
	'/kingdee/internalSupplierOrgRelation/import';
import type { OrderItem } from '../types';

export interface InternalSupplierOrgRelationVO {
	/** id */
	id?: number;
	/** relationName */
	relationName?: string;
	/** internalSupplierCode */
	internalSupplierCode?: string;
	/** supplierOrgCode */
	supplierOrgCode?: string;
	/** createName */
	createName?: string;
	/** createTime */
	createTime?: string;
	/** updateName */
	updateName?: string;
	/** updateTime */
	updateTime?: string;
}

export interface PageInternalSupplierOrgRelationVO {
	records: InternalSupplierOrgRelationVO[];
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
	[key: string]: any; // 其他属性
}

export interface QueryInternalSupplierOrgRelationPageParams {
	total?: number;
	size?: number;
	current?: number;
	optimizeCountSql?: boolean;
	searchCount?: boolean;
	optimizeJoinOfCountSql?: boolean;
	maxLimit?: number;
	countId?: string;
	/** 金蝶内部供应与组织关系 */
	relationNames?: string[];
	/** 金蝶内部供应商编码 */
	internalSupplierCodes?: string[];
	/** 供应商对应的金蝶组织编码 */
	supplierOrgCodes?: string[];
	/** 创建人ID集合 */
	createIds?: number[];
	/** 创建时间-开始 */
	createTimeStart?: string;
	/** 创建时间-结束 */
	createTimeEnd?: string;
	/** 勾选的id列表  导出时使用 */
	ids?: number[];
}

/** 分页查询内部供应商与组织关系 */
export function getInternalSupplierOrgRelationPage(
	data: QueryInternalSupplierOrgRelationPageParams
) {
	return httpService.post<PageInternalSupplierOrgRelationVO>(
		'/kingdee/internalSupplierOrgRelation/page',
		data
	);
}

/** 新增内部供应商与组织关系 */
export function addInternalSupplierOrgRelation(data: any) {
	return httpService.post<{ code: number; data: number; msg: string }>(
		'/kingdee/internalSupplierOrgRelation/add',
		data
	);
}

/** 编辑内部供应商与组织关系 */
export function updateInternalSupplierOrgRelation(data: any) {
	return httpService.post<{ code: number; data: boolean; msg: string }>(
		'/kingdee/internalSupplierOrgRelation/update',
		data
	);
}

/** 获取内部供应商与组织关系详情 */
export function getInternalSupplierOrgRelationDetail(params: { id: number }) {
	return httpService.get<{ code: number; data: any; msg: string }>(
		'/kingdee/internalSupplierOrgRelation/detail',
		{ params }
	);
}

/** 删除内部供应商与组织关系 */
export function deleteInternalSupplierOrgRelation(data: { id: number }) {
	return httpService.post<{ code: number; data: boolean; msg: string }>(
		'/kingdee/internalSupplierOrgRelation/delete',
		data
	);
}

/** 导出内部供应商与组织关系 */
export function getExportInternalSupplierOrgRelation(params?: any) {
	return httpService.post(
		'/kingdee/internalSupplierOrgRelation/export',
		params ?? {},
		{
			responseType: 'blob',
		}
	);
}
