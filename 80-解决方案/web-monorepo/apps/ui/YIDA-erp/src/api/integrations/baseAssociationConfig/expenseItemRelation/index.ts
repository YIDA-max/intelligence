/*
 * @Description: 费用项目关系 API
 */
import { httpService } from '/@/utils/request';

/** 导入模板地址 */
export const EXPENSE_ITEM_RELATION_IMPORT_TEMPLATE_URL =
	'/files/import-template/费用项目关系导入模板.xlsx';
/** 导入接口地址 */
export const EXPENSE_ITEM_RELATION_IMPORT_URL =
	'/kingdee/expenseItemRelation/import';
import type { OrderItem } from '../types';

export interface ExpenseItemRelationVO {
	/** id */
	id?: number;
	/** businessModule */
	businessModule?: string;
	/** expenseType */
	expenseType?: string;
	/** expenseItemName */
	expenseItemName?: string;
	/** kingdeeExpenseCode */
	kingdeeExpenseCode?: string;
	/** kingdeeExpenseName */
	kingdeeExpenseName?: string;
	/** createName */
	createName?: string;
	/** createTime */
	createTime?: string;
	/** updateName */
	updateName?: string;
	/** updateTime */
	updateTime?: string;
}

export interface PageExpenseItemRelationVO {
	records: ExpenseItemRelationVO[];
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

export interface QueryExpenseItemRelationPageParams {
	total?: number;
	size?: number;
	current?: number;
	optimizeCountSql?: boolean;
	searchCount?: boolean;
	optimizeJoinOfCountSql?: boolean;
	maxLimit?: number;
	countId?: string;
	/** 业务模块 */
	businessModules?: string[];
	/** 费用类型 */
	expenseTypes?: string[];
	/** 费用项目名称 */
	expenseItemNames?: string[];
	/** 金蝶费用项目编码 */
	kingdeeExpenseCodes?: string[];
	/** 金蝶费用项目名称 */
	kingdeeExpenseNames?: string[];
	/** 创建人ID集合 */
	createIds?: number[];
	/** 创建时间-开始 */
	createTimeStart?: string;
	/** 创建时间-结束 */
	createTimeEnd?: string;
	/** 勾选的id列表  导出时使用 */
	ids?: number[];
}

/** 分页查询费用项目关系 */
export function getExpenseItemRelationPage(
	data: QueryExpenseItemRelationPageParams
) {
	return httpService.post<PageExpenseItemRelationVO>(
		'/kingdee/expenseItemRelation/page',
		data
	);
}

/** 新增费用项目关系 */
export function addExpenseItemRelation(data: any) {
	return httpService.post<{ code: number; data: number; msg: string }>(
		'/kingdee/expenseItemRelation/add',
		data
	);
}

/** 编辑费用项目关系 */
export function updateExpenseItemRelation(data: any) {
	return httpService.post<{ code: number; data: boolean; msg: string }>(
		'/kingdee/expenseItemRelation/update',
		data
	);
}

/** 获取费用项目关系详情 */
export function getExpenseItemRelationDetail(params: { id: number }) {
	return httpService.get<{ code: number; data: any; msg: string }>(
		'/kingdee/expenseItemRelation/detail',
		{ params }
	);
}

/** 删除费用项目关系 */
export function deleteExpenseItemRelation(data: { id: number }) {
	return httpService.post<{ code: number; data: boolean; msg: string }>(
		'/kingdee/expenseItemRelation/delete',
		data
	);
}

/** 导出费用项目关系 */
export function getExportExpenseItemRelation(params?: any) {
	return httpService.post('/kingdee/expenseItemRelation/export', params ?? {}, {
		responseType: 'blob',
	});
}
