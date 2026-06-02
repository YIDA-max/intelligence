import { httpService } from '/@/utils/request';

export interface PlatformWarehouseInventoryQuery {
	current?: number;
	size?: number;
	ascs?: string[];
	descs?: string[];
	/** 状态 0未生成 1已生成 2生成失败 */
	status?: number;
	/** 仟易仓库 */
	warehouseCodes?: string[];
	/** 金蝶库存组织 */
	kingdeeInventoryOrgCodes?: string[];
	/** 移除订单号 */
	orderRemoveNos?: string[];
	/** SKU */
	skuCodes?: string[];
	/** 集成数据创建时间开始 */
	createTimeStart?: string;
	/** 集成数据创建时间结束 */
	createTimeEnd?: string;
	ids?: (string | number)[];
	[key: string]: any;
}

/** 分页查询 */
export function getPlatformWarehouseInventoryPage(
	params?: PlatformWarehouseInventoryQuery
) {
	return httpService.get('/integrations/platformWarehouseInventory/page', {
		params,
	});
}

/** 导出 */
export function getPlatformWarehouseInventoryExport(
	data?: PlatformWarehouseInventoryQuery
) {
	return httpService.post(
		'/integrations/platformWarehouseInventory/export',
		data,
		{
			responseType: 'blob',
		}
	);
}

/** 生成金蝶单据 */
export function generatePlatformWarehouseInventoryBill(
	data?: PlatformWarehouseInventoryQuery
) {
	return httpService.post(
		'/integrations/platformWarehouseInventory/generate',
		data
	);
}
