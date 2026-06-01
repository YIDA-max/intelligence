/*
 * @Description: 产品SKU关系 API
 */
import { httpService } from '/@/utils/request';

/** 导入模板地址 */
export const PRODUCT_SKU_RELATION_IMPORT_TEMPLATE_URL =
	'/files/import-template/产品SKU关系导入模板.xlsx';
/** 导入接口地址 */
export const PRODUCT_SKU_RELATION_IMPORT_URL =
	'/kingdee/productSkuRelation/import';
import type { OrderItem } from '../types';

export interface ProductSkuRelationVO {
	/** id */
	id?: number;
	/** skuCode */
	skuCode?: string;
	/** skuName */
	skuName?: string;
	/** kingdeeMaterialCode */
	kingdeeMaterialCode?: string;
	/** kingdeeMaterialName */
	kingdeeMaterialName?: string;
	/** createName */
	createName?: string;
	/** createTime */
	createTime?: string;
	/** updateName */
	updateName?: string;
	/** updateTime */
	updateTime?: string;
}

export interface PageProductSkuRelationVO {
	records: ProductSkuRelationVO[];
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

export interface QueryProductSkuRelationPageParams {
	total?: number;
	size?: number;
	current?: number;
	optimizeCountSql?: boolean;
	searchCount?: boolean;
	optimizeJoinOfCountSql?: boolean;
	maxLimit?: number;
	countId?: string;
	/** 仟易SKU编码 */
	skuCodes?: string[];
	/** 仟易SKU名称 */
	skuNames?: string[];
	/** 金蝶物料编码 */
	kingdeeMaterialCodes?: string[];
	/** 金蝶物料名称 */
	kingdeeMaterialNames?: string[];
	/** 创建人ID集合 */
	createIds?: number[];
	/** 创建时间-开始 */
	createTimeStart?: string;
	/** 创建时间-结束 */
	createTimeEnd?: string;
	/** 勾选的id列表  导出时使用 */
	ids?: number[];
}

/** 分页查询产品SKU关系 */
export function getProductSkuRelationPage(
	data: QueryProductSkuRelationPageParams
) {
	return httpService.post<PageProductSkuRelationVO>(
		'/kingdee/productSkuRelation/page',
		data
	);
}

/** 新增产品SKU关系 */
export function addProductSkuRelation(data: any) {
	return httpService.post<{ code: number; data: number; msg: string }>(
		'/kingdee/productSkuRelation/add',
		data
	);
}

/** 编辑产品SKU关系 */
export function updateProductSkuRelation(data: any) {
	return httpService.post<{ code: number; data: boolean; msg: string }>(
		'/kingdee/productSkuRelation/update',
		data
	);
}

/** 删除产品SKU关系 */
export function deleteProductSkuRelation(data: { id: number }) {
	return httpService.post<{ code: number; data: boolean; msg: string }>(
		'/kingdee/productSkuRelation/delete',
		data
	);
}

/** 获取产品SKU关系详情 */
export function getProductSkuRelationDetail(params: { id: number }) {
	return httpService.get<{ code: number; data: any; msg: string }>(
		'/kingdee/productSkuRelation/detail',
		{ params }
	);
}

/** 导出产品SKU关系 */
export function getExportProductSkuRelation(params?: any) {
	return httpService.post('/kingdee/productSkuRelation/export', params ?? {}, {
		responseType: 'blob',
	});
}
