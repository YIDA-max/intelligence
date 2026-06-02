/*
 * @Author: wuyueqin wuyueqin@merach.com
 * @Date: 2026-04-01 16:34:28
 * @LastEditors: YIDA zhuhansong@merach.com
 * @LastEditTime: 2026-04-11 15:41:21
 * @FilePath: \qianyi-ui\src\api\warehouse\stockManage\wfsInventoryReport\index.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { httpService } from '/@/utils/request';

export interface WfsInventoryReportQuery {
	current?: number;
	size?: number;
	ascs?: string[];
	descs?: string[];
	/** 仓库编码（多选） */
	warehouseCodes?: string[];
	/** 开始月份（兼容范围选择） */
	startMonth?: string;
	/** 结束月份（兼容范围选择） */
	endMonth?: string;
	/** SKU */
	skuCodes?: string[];
	/** MSKU */
	mskuCodes?: string[];
	/** SKU名称 */
	skuNames?: string[];
	[key: string]: any;
}

export interface WfsInventoryReportVO {
	/** 仓库code */
	warehouseCode?: string;
	/** 月份 格式：yyyy-MM */
	month?: string;
	/** 店铺名称 */
	storeName?: string;
	/** 店铺站点 */
	siteCode?: string;
	/** MSKU */
	mskuCode?: string;
	/** SKU */
	skuCode?: string;
	/** 产品名称 */
	skuName?: string;
	/** 期初库存 */
	openingStock?: number;
	/** 货件收货 */
	shipmentReceived?: number;
	/** 订单发货 */
	orderShipped?: number;
	/** 买家退货 */
	buyerReturn?: number;
	/** 丢失 */
	lost?: number;
	/** 找回 */
	recovered?: number;
	/** 已移除 */
	removed?: number;
	/** 期末库存 */
	closingStock?: number;
	/** ERP在途 */
	erpInTransit?: number;
	[key: string]: any;
}

/** 分页查询 */
export function getWfsInventoryReportPage(data?: WfsInventoryReportQuery) {
	return httpService.post('/stock/platformWalmartInventoryJxc/page', data, {});
}

/** 导出 */
export function postWfsInventoryReportExport(data?: WfsInventoryReportQuery) {
	return httpService.post('/stock/platformWalmartInventoryJxc/export', data, {
		responseType: 'blob',
	});
}

/** 导入接口路径（接口待后端提供） */
export const WFS_IMPORT_URL = '/stock/platformWalmartInventoryJxc/import';

/** 导入模板下载地址（模板待后端提供） */
export const WFS_IMPORT_TEMPLATE_URL =
	'/files/import-template/导入沃尔玛美国站库存对账报告.xlsx';
