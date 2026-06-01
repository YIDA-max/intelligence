/*
 * @Description: 内部结算原币规则 API
 */
import { httpService } from '/@/utils/request';

/** 导入模板地址 */
export const INTERNAL_SETTLEMENT_ORIGINAL_CURRENCY_RULE_IMPORT_TEMPLATE_URL =
	'/files/import-template/内部结算原币规则导入模板.xlsx';
/** 导入接口地址 */
export const INTERNAL_SETTLEMENT_ORIGINAL_CURRENCY_RULE_IMPORT_URL =
	'/kingdee/internalSettlementCurrencyRule/import';
import type { OrderItem } from '../types';

export interface InternalSettlementOriginalCurrencyRuleVO {
	/** id */
	id?: number;
	/** ruleCode */
	ruleCode?: string;
	/** salesOrgCode */
	salesOrgCode?: string;
	/** salesOrgName */
	salesOrgName?: string;
	/** purchaseOrgCode */
	purchaseOrgCode?: string;
	/** purchaseOrgName */
	purchaseOrgName?: string;
	/** settlementCurrency */
	settlementCurrency?: string;
	/** ruleDescription */
	ruleDescription?: string;
	/** createName */
	createName?: string;
	/** createTime */
	createTime?: string;
	/** updateName */
	updateName?: string;
	/** updateTime */
	updateTime?: string;
}

export interface PageInternalSettlementOriginalCurrencyRuleVO {
	records: InternalSettlementOriginalCurrencyRuleVO[];
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

export interface QueryInternalSettlementOriginalCurrencyRulePageParams {
	total?: number;
	size?: number;
	current?: number;
	optimizeCountSql?: boolean;
	searchCount?: boolean;
	optimizeJoinOfCountSql?: boolean;
	maxLimit?: number;
	countId?: string;
	/** 规则编号 */
	ruleCodes?: string[];
	/** 销售组织编码 */
	salesOrgCodes?: string[];
	/** 采购组织编码 */
	purchaseOrgCodes?: string[];
	/** 创建人ID集合 */
	createIds?: number[];
	/** 创建时间-开始 */
	createTimeStart?: string;
	/** 创建时间-结束 */
	createTimeEnd?: string;
	/** 勾选的id列表  导出时使用 */
	ids?: number[];
}

/** 分页查询内部结算原币规则 */
export function getInternalSettlementOriginalCurrencyRulePage(
	data: QueryInternalSettlementOriginalCurrencyRulePageParams
) {
	return httpService.post<PageInternalSettlementOriginalCurrencyRuleVO>(
		'/kingdee/internalSettlementCurrencyRule/page',
		data
	);
}

/** 新增内部结算原币规则 */
export function addInternalSettlementOriginalCurrencyRule(data: any) {
	return httpService.post<{ code: number; data: number; msg: string }>(
		'/kingdee/internalSettlementCurrencyRule/add',
		data
	);
}

/** 编辑内部结算原币规则 */
export function updateInternalSettlementOriginalCurrencyRule(data: any) {
	return httpService.post<{ code: number; data: boolean; msg: string }>(
		'/kingdee/internalSettlementCurrencyRule/update',
		data
	);
}

/** 获取内部结算原币规则详情 */
export function getInternalSettlementOriginalCurrencyRuleDetail(params: {
	id: number;
}) {
	return httpService.get<{ code: number; data: any; msg: string }>(
		'/kingdee/internalSettlementCurrencyRule/detail',
		{ params }
	);
}

/** 删除内部结算原币规则 */
export function deleteInternalSettlementOriginalCurrencyRule(data: {
	id: number;
}) {
	return httpService.post<{ code: number; data: boolean; msg: string }>(
		'/kingdee/internalSettlementCurrencyRule/delete',
		data
	);
}

/** 导出内部结算原币规则 */
export function getExportInternalSettlementOriginalCurrencyRule(params?: any) {
	return httpService.post(
		'/kingdee/internalSettlementCurrencyRule/export',
		params ?? {},
		{
			responseType: 'blob',
		}
	);
}
