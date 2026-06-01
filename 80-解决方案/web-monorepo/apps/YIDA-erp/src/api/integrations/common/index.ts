/*
 * @Author: YIDA 3136271519@qq.com
 * @Date: 2026-02-02 14:09:51
 * @LastEditors: wuyueqin wuyueqin@merach.com
 * @LastEditTime: 2026-04-13 19:58:59
 * @FilePath: \qianyi-ui\src\api\integrations\common\index.ts
 * @Description:
 *
 * Copyright (c) 2026 by ${git_name_email}, All Rights Reserved.
 */
/*
 * @Description: 金蝶公共接口 API - 由 scripts/generate-kingdee-api.mjs 生成
 */
import { httpService } from '/@/utils/request';

// ==================== 类型定义 ====================

export interface KingdeeOrgVO {
	/** ID */
	id?: number;
	/** 金蝶采购组织编码 */
	kingdeeOrgCode?: string;
	/** 金蝶采购组织名称 */
	kingdeeOrgName?: string;
}

export interface KingdeeCurrencyVO {
	/** ID */
	id?: number;
	/** 币种编码 */
	currencyCode?: string;
	/** 币种名称 */
	currencyName?: string;
}

export interface KingdeeCustomerVO {
	/** ID */
	id?: number;
	/** 金蝶客户编码 */
	kingdeeCustomerCode?: string;
	/** 金蝶客户名称 */
	kingdeeCustomerName?: string;
}

export interface KingdeeWarehouseVO {
	/** ID */
	id?: number;
	/** 金蝶仓库编码 */
	kingdeeWareCode?: string;
	/** 金蝶仓库名称 */
	kingdeeWareName?: string;
}

/**
 * 金蝶费用项目 VO
 *
 * KingdeeFeeItemVO
 */
export interface KingdeeFeeItemVO {
	/**
	 * ID
	 */
	id?: number;
	/**
	 * 金蝶费用编码
	 */
	kingdeeFeeCode?: string;
	/**
	 * 金蝶费用名称
	 */
	kingdeeFeeName?: string;
	[property: string]: any;
}

/**
 * 金蝶供应商 VO
 *
 * KingdeeSupplierVO
 */
export interface KingdeeSupplierVO {
	/**
	 * ID
	 */
	id?: number;
	/**
	 * 金蝶供应商代码
	 */
	supplierCode?: string;
	/**
	 * 金蝶供应商名称
	 */
	supplierName?: string;
	[property: string]: any;
}
/**
 * 金蝶部门关系 VO
 *
 * KingdeeDeptVO
 */
export interface KingdeeDeptVO {
	/**
	 * ID
	 */
	id?: number;
	/**
	 * 金蝶采购部门编码
	 */
	kingdeeDeptCode?: string;
	/**
	 * 金蝶采购部门名称
	 */
	kingdeeDeptName?: string;
	[property: string]: any;
}

// ==================== 接口定义 ====================

/** 查询参数（预留，用于后续筛选扩展） */
export interface QueryListParams {
	[key: string]: any;
}

/** 查询所有 - 金蝶组织关系列表 */
export function getKingdeeOrgList(params?: QueryListParams) {
	return httpService.get<{ code: number; msg: string; data: KingdeeOrgVO[] }>(
		'/kingdee/kingdeeOrg/list',
		{
			params,
			debounceConfig: {
				delay: 0,
				enable: false,
			},
		}
	);
}

/** 查询所有 - 金蝶币种列表 */
export function getKingdeeCurrencyList(params?: QueryListParams) {
	return httpService.get<{
		code: number;
		msg: string;
		data: KingdeeCurrencyVO[];
	}>('/kingdee/kingdeeCurrency/list', { params });
}

/** 查询所有 - 金蝶客户列表 */
export function getKingdeeCustomerList(params?: QueryListParams) {
	return httpService.get<{
		code: number;
		msg: string;
		data: KingdeeCustomerVO[];
	}>('/kingdee/kingdeeCustomer/list', { params });
}

/** 查询所有 - 金蝶仓库列表 */
export function getKingdeeWarehouseList(params?: QueryListParams) {
	return httpService.get<{
		code: number;
		msg: string;
		data: KingdeeWarehouseVO[];
	}>('/kingdee/kingdeeWarehouse/list', {
		params,
		debounceConfig: {
			delay: 0,
			enable: false,
		},
	});
}
/**
 * 查询所有 - 金蝶费用项目列表
 * @param params
 * @returns
 */
export function getKingdeeFeeItemList(params?: QueryListParams) {
	return httpService.get<{
		code: number;
		msg: string;
		data: KingdeeFeeItemVO[];
	}>('/kingdee/kingdeeFeeItem/list', { params });
}
/**
 * 查询所有 - 金蝶供应商
 * @param params
 * @returns
 */
export function getKingdeeSupplierList(params?: QueryListParams) {
	return httpService.get<{
		code: number;
		msg: string;
		data: KingdeeSupplierVO[];
	}>('/kingdee/kingdeeSupplier/list', { params });
}
/**
 * 查询所有 - 金蝶部门关系列表
 * @param params
 * @returns
 */
export function getKingdeeDeptList(params?: QueryListParams) {
	return httpService.get<{
		code: number;
		msg: string;
		data: KingdeeDeptVO[];
	}>('/kingdee/kingdeeDept/list', { params });
}

/** 查询所有 - 金蝶物料列表 */
export function getKingdeeMaterialList(params?: QueryListParams) {
	return httpService.get<{
		code: number;
		msg: string;
		data: any[];
	}>('/kingdee/kingdeeMaterials/page', { params });
}
