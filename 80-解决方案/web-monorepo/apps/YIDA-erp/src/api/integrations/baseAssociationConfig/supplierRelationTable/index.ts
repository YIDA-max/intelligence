/*
 * @Description: 供应商关系 API
 */
import { httpService } from '/@/utils/request';

/** 导入模板地址 */
export const SUPPLIER_RELATION_TABLE_IMPORT_TEMPLATE_URL =
	'/files/import-template/供应商关系表导入模板.xlsx';
/** 导入接口地址 */
export const SUPPLIER_RELATION_TABLE_IMPORT_URL =
	'/kingdee/supplierRelation/import';
import type { OrderItem } from '../types';

export interface SupplierRelationTableVO {
	/** id */
	id?: number;
	/** type */
	type?: string;
	/** qianyiCode */
	qianyiCode?: string;
	/** qianyiName */
	qianyiName?: string;
	/** kingdeeUsageOrgCode */
	kingdeeUsageOrgCode?: string;
	/** kingdeeUsageOrgName */
	kingdeeUsageOrgName?: string;
	/** kingdeeSupplierCode */
	kingdeeSupplierCode?: string;
	/** kingdeeSupplierName */
	kingdeeSupplierName?: string;
	/** createName */
	createName?: string;
	/** createTime */
	createTime?: string;
	/** updateName */
	updateName?: string;
	/** updateTime */
	updateTime?: string;
}

export interface PageSupplierRelationTableVO {
	records: SupplierRelationTableVO[];
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

export interface QuerySupplierRelationTablePageParams {
	total?: number;
	size?: number;
	current?: number;
	optimizeCountSql?: boolean;
	searchCount?: boolean;
	optimizeJoinOfCountSql?: boolean;
	maxLimit?: number;
	countId?: string;
	/** 类型 */
	types?: string[];
	/** 仟易编码 */
	qianyiCodes?: string[];
	/** 仟易名称 */
	qianyiNames?: string[];
	/** 金蝶使用组织编码 */
	kingdeeUsageOrgCodes?: string[];
	/** 金蝶供应商编码 */
	kingdeeSupplierCodes?: string[];
	/** 金蝶供应商名称 */
	kingdeeSupplierNames?: string[];
	/** 创建人ID集合 */
	createIds?: number[];
	/** 创建时间-开始 */
	createTimeStart?: string;
	/** 创建时间-结束 */
	createTimeEnd?: string;
	/** 勾选的id列表  导出时使用 */
	ids?: number[];
}

/** 分页查询供应商关系 */
export function getSupplierRelationTablePage(
	data: QuerySupplierRelationTablePageParams
) {
	return httpService.post<PageSupplierRelationTableVO>(
		'/kingdee/supplierRelation/page',
		data
	);
}

/** 新增供应商关系 */
export function addSupplierRelationTable(data: any) {
	return httpService.post<{ code: number; data: number; msg: string }>(
		'/kingdee/supplierRelation/add',
		data
	);
}

/** 编辑供应商关系 */
export function updateSupplierRelationTable(data: any) {
	return httpService.post<{ code: number; data: boolean; msg: string }>(
		'/kingdee/supplierRelation/update',
		data
	);
}

/** 删除供应商关系 */
export function deleteSupplierRelationTable(data: { id: number }) {
	return httpService.post<{ code: number; data: boolean; msg: string }>(
		'/kingdee/supplierRelation/delete',
		data
	);
}

/** 获取供应商关系详情 */
export function getSupplierRelationTableDetail(params: { id: number }) {
	return httpService.get<{ code: number; data: any; msg: string }>(
		'/kingdee/supplierRelation/detail',
		{ params }
	);
}

/** 导出供应商关系 */
export function getExportSupplierRelationTable(params?: any) {
	return httpService.post('/kingdee/supplierRelation/export', params ?? {}, {
		responseType: 'blob',
	});
}

/** 获取供应商下拉数据 */
export function getSupplierMergeList(params: { id: number }) {
	return httpService.get<{ code: number; data: any; msg: string }>(
		'/kingdee/supplierRelation/listAllLogistics',
		{ params }
	);
}
