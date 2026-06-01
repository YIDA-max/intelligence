/*
 * @Author: YIDA zhuhansong@merach.com
 * @Date: 2026-04-11 18:56:29
 * @LastEditors: YIDA zhuhansong@merach.com
 * @LastEditTime: 2026-04-13 14:47:43
 * @FilePath: \qianyi-ui\src\api\integrations\warehouseOperation\platformWarehouseInventory\index.ts
 * @Description:
 *
 * Copyright (c) 2026 by ${git_name_email}, All Rights Reserved.
 */
import { httpService } from '/@/utils/request';

/**
 * 列表分页查询
 */
export function getPlatformWarehouseInventoryKingdeePage(data?: any) {
	return httpService.post('/kingdee/inventoryCountDiffKingdee/pageList', data);
}

/**
 * 导出平台仓盘点金蝶单据
 */
export function getPlatformWarehouseInventoryKingdeeExport(data?: any) {
	return httpService.post('/kingdee/inventoryCountDiffKingdee/export', data, {
		responseType: 'blob',
	});
}

/**
 * 生成金蝶单据
 */
export function postPlatformWarehouseInventoryPushKingdee(params?: {
	[key: string]: any;
}) {
	return httpService.post(
		'/kingdee/inventoryCountDiffKingdee/pushKingdee',
		params
	);
}

/**
 * 更新
 */
export function postPlatformWarehouseInventoryKingdeeUpdata(params?: {
	[key: string]: any;
}) {
	return httpService.post(
		'/kingdee/inventoryCountDiffKingdee/updateBatch',
		params
	);
}
