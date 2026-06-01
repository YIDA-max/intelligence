/*
 * @Description: 币种对照关系 API
 */
import { httpService } from '/@/utils/request';

/** 导入模板地址 */
export const CURRENCY_CORRESPONDENCE_RELATION_IMPORT_TEMPLATE_URL =
	'/files/import-template/币种对照关系导入模板.xlsx';
/** 导入接口地址 */
export const CURRENCY_CORRESPONDENCE_RELATION_IMPORT_URL =
	'/kingdee/currencyMapRelation/import';
import type { OrderItem } from '../types';

export interface CurrencyCorrespondenceRelationVO {
	/** id */
	id?: number;
	/** currencyCode */
	currencyCode?: string;
	/** kingdeeCurrencyCode */
	kingdeeCurrencyCode?: string;
	/** createName */
	createName?: string;
	/** createTime */
	createTime?: string;
	/** updateName */
	updateName?: string;
	/** updateTime */
	updateTime?: string;
}

export interface PageCurrencyCorrespondenceRelationVO {
	records: CurrencyCorrespondenceRelationVO[];
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

export interface QueryCurrencyCorrespondenceRelationPageParams {
	total?: number;
	size?: number;
	current?: number;
	optimizeCountSql?: boolean;
	searchCount?: boolean;
	optimizeJoinOfCountSql?: boolean;
	maxLimit?: number;
	countId?: string;
	/** 仟易币种代码 */
	currencyCodes?: string[];
	/** 金蝶币种编码 */
	kingdeeCurrencyCodes?: string[];
	/** 创建人ID集合 */
	createIds?: number[];
	/** 创建时间-开始 */
	createTimeStart?: string;
	/** 创建时间-结束 */
	createTimeEnd?: string;
	/** 勾选的id列表  导出时使用 */
	ids?: number[];
}

/** 分页查询币种对照关系 */
export function getCurrencyCorrespondenceRelationPage(
	data: QueryCurrencyCorrespondenceRelationPageParams
) {
	return httpService.post<PageCurrencyCorrespondenceRelationVO>(
		'/kingdee/currencyMapRelation/page',
		data
	);
}

/** 新增币种对照关系 */
export function addCurrencyCorrespondenceRelation(data: any) {
	return httpService.post<{ code: number; data: number; msg: string }>(
		'/kingdee/currencyMapRelation/add',
		data
	);
}

/** 编辑币种对照关系 */
export function updateCurrencyCorrespondenceRelation(data: any) {
	return httpService.post<{ code: number; data: boolean; msg: string }>(
		'/kingdee/currencyMapRelation/update',
		data
	);
}

/** 获取币种对照关系详情 */
export function getCurrencyCorrespondenceRelationDetail(params: {
	id: number;
}) {
	return httpService.get<{ code: number; data: any; msg: string }>(
		'/kingdee/currencyMapRelation/detail',
		{ params }
	);
}

/** 删除币种对照关系 */
export function deleteCurrencyCorrespondenceRelation(data: { id: number }) {
	return httpService.post<{ code: number; data: boolean; msg: string }>(
		'/kingdee/currencyMapRelation/delete',
		data
	);
}

/** 导出币种对照关系 */
export function getExportCurrencyCorrespondenceRelation(params?: any) {
	return httpService.post('/kingdee/currencyMapRelation/export', params ?? {}, {
		responseType: 'blob',
	});
}
