import { httpService } from '/@/utils/request';
import { getTemuFinanceSettlementPageMock } from './mock/getTemuFinanceSettlementPageMock';
import { getTemuExpenseDetailPageMock } from './mock/getTemuExpenseDetailPageMock';
import { getTemuFinanceDetailPageMock } from './mock/getTemuFinanceDetailPageMock';

/** 导入接口 URL（供 ImportDialog 等直接传 excelUploadApi 使用，不经过封装函数） */
export const TEMU_FINANCE_SETTLEMENT_IMPORT_URL =
	'/finance/temu/settlement/importSettlementReport';
export const TEMU_EXPENSE_DETAIL_IMPORT_URL =
	'/finance/temu/expenseDetail/importExpenseDetailReport';
export const TEMU_FINANCE_DETAIL_IMPORT_URL =
	'/finance/temu/detail/importDetailReport';

/** 导入模板文件URL */
export const TEMU_FINANCE_SETTLEMENT_IMPORT_TEMPLATE_URL =
	'/files/import-template/Temu结算明细.xlsx';
export const TEMU_EXPENSE_DETAIL_IMPORT_TEMPLATE_URL =
	'/files/import-template/Temu支出明细.xlsx';
export const TEMU_FINANCE_DETAIL_IMPORT_TEMPLATE_URL =
	'/files/import-template/Temu财务明细.xlsx';
/**
 * 分页查询取消提货计划
 * @param params 查询参数
 * @returns
 */
export function getQueryCollectionPlanCancel(data?: { [key: string]: any }) {
	return httpService.post<{
		total: number;
		records: any[];
	}>('/mcp/collectionPlanCancel/queryCollectionPlanCancel', data);
}

/**
 * 导出Shopify订单销售额报表
 */
export function getExportShopifyOrderSaleReport(params?: any) {
	return httpService.get('/order/shopifyOrderSaleReport/export', {
		params: params,
		responseType: 'blob',
	});
}

/**
 * Temu 财务结算表 VO
 */
export interface TemuFinanceSettlementVO {
	createId?: number;
	createName?: string;
	updateId?: number;
	updateName?: string;
	createTime?: string;
	updateTime?: string;
	delFlag?: number;
	id?: number;
	settlementTransactionId?: string;
	batchNumber?: string;
	poNumber?: string;
	documentNumber?: string;
	transactionType?: string;
	settlementAmount?: number;
	skuId?: string;
	productDescription?: string;
	msku?: string;
	skuOrProductName?: string;
	skuName?: string;
	quantity?: number;
	declaredPrice?: number;
	isPromotionalPrice?: number;
	currency?: string;
	totalDeclaredPrice?: number;
	itemCouponAmount?: number;
	storeDiscountCouponAmount?: number;
	shippingDiscountAmount?: number;
	declaredPriceDiscountAmount?: number;
	arrivalTime?: string;
	remark?: string;
	storeId?: number;
	storeName?: string;
	transactionTypeName?: string;
}

/**
 * Temu 支出明细表 VO（如罚款、违规扣款等）
 */
export interface TemuExpenseDetailVO {
	createId?: number;
	createName?: string;
	updateId?: number;
	updateName?: string;
	createTime?: string;
	updateTime?: string;
	delFlag?: number;
	id?: number;
	expenseType?: string;
	violationNumber?: string;
	orderNumber?: string;
	violationType?: string;
	expenseAmount?: number;
	currency?: string;
	accountingTime?: string;
	storeId?: number;
	storeName?: string;
	expenseTypeName?: string;
}

/**
 * Temu 财务明细表 VO
 */
export interface TemuFinanceDetailVO {
	createId?: number;
	createName?: string;
	updateId?: number;
	updateName?: string;
	createTime?: string;
	updateTime?: string;
	delFlag?: number;
	id?: number;
	shop?: string;
	accountingTime?: string;
	accountingType?: string;
	currency?: string;
	amount?: number;
	remark?: string;
	accountingTypeName?: string;
}

/**
 * 排序字段
 */
export interface OrderItem {
	column?: string;
	asc?: boolean;
}

export interface PageTemuFinanceSettlementVO {
	records?: TemuFinanceSettlementVO[];
	total?: number;
	size?: number;
	current?: number;
	orders?: OrderItem[];
	optimizeCountSql?: boolean;
	searchCount?: boolean;
	optimizeJoinOfCountSql?: boolean;
	maxLimit?: number;
	countId?: string;
}

export interface PageTemuExpenseDetailVO {
	records?: TemuExpenseDetailVO[];
	total?: number;
	size?: number;
	current?: number;
	orders?: OrderItem[];
	optimizeCountSql?: boolean;
	searchCount?: boolean;
	optimizeJoinOfCountSql?: boolean;
	maxLimit?: number;
	countId?: string;
}

export interface PageTemuFinanceDetailVO {
	records?: TemuFinanceDetailVO[];
	total?: number;
	size?: number;
	current?: number;
	orders?: OrderItem[];
	optimizeCountSql?: boolean;
	searchCount?: boolean;
	optimizeJoinOfCountSql?: boolean;
	maxLimit?: number;
	countId?: string;
}

export interface RPageTemuFinanceSettlementVO {
	code?: number;
	msg?: string;
	data?: PageTemuFinanceSettlementVO;
}

export interface RTemuFinanceSettlementVO {
	code?: number;
	msg?: string;
	data?: TemuFinanceSettlementVO;
}

export interface RPageTemuExpenseDetailVO {
	code?: number;
	msg?: string;
	data?: PageTemuExpenseDetailVO;
}

export interface RTemuExpenseDetailVO {
	code?: number;
	msg?: string;
	data?: TemuExpenseDetailVO;
}

export interface RPageTemuFinanceDetailVO {
	code?: number;
	msg?: string;
	data?: PageTemuFinanceDetailVO;
}

export interface RTemuFinanceDetailVO {
	code?: number;
	msg?: string;
	data?: TemuFinanceDetailVO;
}

export interface RListString {
	code?: number;
	msg?: string;
	data?: string[];
}

/** 导入结果 VO */
export interface ExcelImportResultVO {
	totalCount?: number;
	successCount?: number;
	failCount?: number;
	failInfos?: string[];
	failFileName?: string;
	failFileUrl?: string;
}

/** 导入结果出参 */
export interface RExcelImportResultVO {
	code?: number;
	msg?: string;
	data?: ExcelImportResultVO;
}

/** 无数据出参 */
export interface RVoid {
	code?: number;
	msg?: string;
	data?: null;
}

/**
 * Temu 财务结算分页查询
 * 对应接口：GET /finance/temu/finance/settlement/page
 */
export function getTemuFinanceSettlementPage(data?: { [key: string]: any }) {
	return httpService.post<RPageTemuFinanceSettlementVO>(
		'/finance/temu/settlement/page',
		data,
		{
			mockConfig: {
				enable: false,
				data: getTemuFinanceSettlementPageMock,
			},
		}
	);
}

/**
 * Temu 支出明细分页查询
 * 对应接口：GET /finance/temu/expenseDetail/page
 */
export function getTemuExpenseDetailPage(data?: { [key: string]: any }) {
	return httpService.post<RPageTemuExpenseDetailVO>(
		'/finance/temu/expenseDetail/page',
		data,
		{
			mockConfig: {
				enable: false,
				data: getTemuExpenseDetailPageMock,
			},
		}
	);
}

/**
 * Temu 财务明细分页查询
 * 对应接口：GET /finance/temu/detail/page
 */
export function getTemuFinanceDetailPage(data?: { [key: string]: any }) {
	return httpService.post<RPageTemuFinanceDetailVO>(
		'/finance/temu/detail/page',
		data,
		{
			mockConfig: {
				enable: false,
				data: getTemuFinanceDetailPageMock,
			},
		}
	);
}

/**
 * Temu 查询店铺名称下拉框
 * 对应接口：GET /finance/temu/detail/getShopOptions
 */
export function getTemuFinanceShopOptions() {
	return httpService.get<RListString>('/finance/temu/detail/getShopOptions');
}

/**
 * 导出结算账单
 * 对应接口：GET /finance/temu/settlement/exportSettlementReport
 */
export function getTemuFinanceSettlementExport(data?: { [key: string]: any }) {
	return httpService.post(
		'/finance/temu/settlement/exportSettlementReport',
		data,
		{
			responseType: 'blob',
		}
	);
}

/**
 * 导出支出明细
 * 对应接口：GET /finance/temu/expenseDetail/exportExpenseDetailReport
 */
export function getTemuExpenseDetailExport(data?: { [key: string]: any }) {
	return httpService.post(
		'/finance/temu/expenseDetail/exportExpenseDetailReport',
		data,
		{
			responseType: 'blob',
		}
	);
}

/**
 * 导出财务明细
 * 对应接口：GET /finance/temu/detail/exportDetailReport
 */
export function getTemuFinanceDetailExport(data?: { [key: string]: any }) {
	return httpService.post('/finance/temu/detail/exportDetailReport', data, {
		responseType: 'blob',
	});
}
