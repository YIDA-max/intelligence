/*
 * @Author: wuyueqin wuyueqin@merach.com
 * @Date: 2026-03-30 14:09:24
 * @LastEditors: YIDA zhuhansong@merach.com
 * @LastEditTime: 2026-04-11 15:40:49
 * @FilePath: \qianyi-ui\src\api\warehouse\stockManage\fbaInventoryReport\index.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { httpService } from '/@/utils/request';

export interface FbaInventoryReportQuery {
	current?: number;
	size?: number;
	ascs?: string[];
	descs?: string[];
	/** 仓库（Amazon店铺虚拟仓） */
	warehouseCodes?: string[];
	/** 日期开始 */
	dateStart?: string;
	/** 日期结束 */
	dateEnd?: string;
	/** SKU */
	skuCodes?: string[];
	/** MSKU */
	mskuCodes?: string[];
	/** ASIN */
	asins?: string[];
	/** 产品名称 */
	productNames?: string[];
	[key: string]: any;
}

export interface FbaInventoryReportVO {
	/** 仓库 */
	warehouseName?: string;
	/** 店铺 */
	storeName?: string;
	/** 站点 */
	siteCode?: string;
	/** 店铺站点（拼接字段） */
	shopSite?: string;
	/** SKU */
	skuCode?: string;
	/** 产品名称 */
	productName?: string;
	/** MSKU */
	mskuCode?: string;
	/** ASIN */
	asin?: string;
	/** 期初库存 */
	openingStock?: number;
	/** 货件收货 */
	shipmentReceived?: number;
	/** 订单发货 */
	orderShipped?: number;
	/** 买家退货 */
	buyerReturn?: number;
	/** 找回 */
	recovered?: number;
	/** 丢失 */
	lost?: number;
	/** 损坏 */
	damaged?: number;
	/** 弃置 */
	disposed?: number;
	/** 其他 */
	other?: number;
	/** 已移除 */
	removed?: number;
	/** 仓库转入/转出 */
	warehouseTransfer?: number;
	/** 仓库间转运中 */
	warehouseTransiting?: number;
	/** 未知事件 */
	unknownEvent?: number;
	/** 期末仓库 */
	closingStock?: number;
	/** ERP在途 */
	erpInTransit?: number;
	[key: string]: any;
}

/** 分页查询 */
export function getFbaInventoryReportPage(data?: FbaInventoryReportQuery) {
	return httpService.post('/stock/fbaInventoryDetail/page', data, {});
}

/** 导出 */
export function postFbaInventoryReportExport(data?: FbaInventoryReportQuery) {
	return httpService.post('/stock/fbaInventoryDetail/export', data, {
		responseType: 'blob',
	});
}
