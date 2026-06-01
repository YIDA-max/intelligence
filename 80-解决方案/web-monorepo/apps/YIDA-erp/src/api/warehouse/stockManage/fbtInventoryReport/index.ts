/*
 * @Author: wuyueqin wuyueqin@merach.com
 * @Date: 2026-03-30 14:09:24
 * @LastEditors: YIDA zhuhansong@merach.com
 * @LastEditTime: 2026-04-11 15:39:30
 * @FilePath: \qianyi-ui\src\api\warehouse\stockManage\fbtInventoryReport\index.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { httpService } from '/@/utils/request';

export interface FbtInventoryReportQuery {
	current?: number;
	size?: number;
	ascs?: string[];
	descs?: string[];
	/** 仓库 */
	warehouseCodes?: string[];
	/** 日期开始 */
	reportMonthStart?: string;
	/** 日期结束 */
	reportMonthEnd?: string;
	/** SKU */
	skuCodes?: string[];
	/** MSKU */
	mskuCodes?: string[];
	/** 商品ID */
	goodsIds?: string[];
	/** 产品名称 */
	productNames?: string[];
	[key: string]: any;
}

export interface FbtInventoryReportVO {
	/** 仓库名称 */
	warehouseName?: string;
	/** 店铺 */
	storeName?: string;
	/** 站点 */
	siteCode?: string;
	/** 店铺站点(前端拼接字段) */
	storeSite?: string;
	/** MSKU */
	mskuCode?: string;
	/** 商品ID */
	goodsId?: string;
	/** SKU */
	skuCode?: string;
	/** 产品名称 */
	skuName?: string;
	/** 期初库存 */
	beginningQuantity?: number;
	/** 货件收货 */
	inboundQuantity?: number;
	/** 订单发货 */
	consignmentQuantity?: number;
	/** 买家退货 */
	failedDeliveryQuantity?: number;
	/** 盘点 */
	inventoryAdjustmentQuantity?: number;
	/** 已移除 */
	removedQuantity?: number;
	/** 仓库间转运中 */
	transferQuantity?: number;
	/** 期末库存 */
	endingQuantity?: number;
	/** ERP在途 */
	inTransitQuantity?: number;
	[key: string]: any;
}

/** 分页查询 */
export function getFbtInventoryReportPage(data?: FbtInventoryReportQuery) {
	return httpService.post('/stock/platformTiktokInventoryJxc/page', data);
}

/** 导出 */
export function postFbtInventoryReportExport(data?: FbtInventoryReportQuery) {
	return httpService.post('/stock/platformTiktokInventoryJxc/export', data, {
		responseType: 'blob',
	});
}
