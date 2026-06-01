/*
 * @Author: wuyueqin wuyueqin@merach.com
 * @Date: 2026-03-05 20:40:25
 * @LastEditors: wuyueqin wuyueqin@merach.com
 * @LastEditTime: 2026-03-06 15:27:12
 * @FilePath: \qianyi-ui-copy\src\api\integrations\purchaseInbound\jingciPurchaseInbound\index.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { httpService } from '/@/utils/request';

/**
 * 京赐采购入库查询参数
 */
export interface JingciPurchaseInboundQuery {
	total?: number;
	size?: number;
	current?: number;
	'orders[0].column'?: string;
	'orders[0].asc'?: boolean;
	optimizeCountSql?: boolean;
	searchCount?: boolean;
	optimizeJoinOfCountSql?: boolean;
	maxLimit?: number;
	countId?: string;
	ids?: number[];
	orderContainerNos?: string[];
	deliveryNos?: string[];
	skuCodes?: string[];
	generateKingdeeDocNos?: string[];
	kingdeeInventoryOrgCodes?: string[];
	createIds?: number[];
	generateKingdeeDocTimeStart?: string;
	generateKingdeeDocTimeEnd?: string;
	createTimeStart?: string;
	createTimeEnd?: string;
	[key: string]: any;
}

/**
 * 京赐采购入库 VO
 */
export interface JingciPurchaseInboundVO {
	id?: number;
	billNo?: string;
	orderContainerNo?: string;
	deliveryNo?: string;
	skuCode?: string;
	skuName?: string;
	kingdeeMaterialCode?: string;
	inboundQuantity?: number;
	inboundDate?: string;
	qianyiWarehouseCode?: string;
	qianyiWarehouseName?: string;
	kingdeeInventoryOrgCode?: string;
	kingdeeInventoryOrgName?: string;
	createTime?: string;
	generateKingdeeDocName?: string;
	generateKingdeeDocNo?: string;
	generateKingdeeDocTime?: string;
	kingdeeDocCreateId?: number;
	kingdeeDocCreateName?: string;
	pushErrorReason?: string;
	[key: string]: any;
}

/**
 * 列表分页查询
 */
export function getJingciPurchaseInboundPage(data: JingciPurchaseInboundQuery) {
	return httpService.post('/kingdee/orderContainerKingdee/page', data);
}

/**
 * 导出京赐采购入库
 */
export function getJingciPurchaseInboundExport(
	data: JingciPurchaseInboundQuery
) {
	return httpService.post('/kingdee/orderContainerKingdee/export', data, {
		responseType: 'blob',
	});
}

/**
 * 生成金蝶单据
 */
export function generateJingciPurchaseInboundBill(params?: {
	[key: string]: any;
}) {
	return httpService.post('/kingdee/orderContainerKingdee/pushKingdee', params);
}
