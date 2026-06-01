import { httpService } from '/@/utils/request';

export interface SelfOperatedInventoryReportQuery {
	current?: number;
	size?: number;
	ascs?: string[];
	descs?: string[];
	/** 仓库（Cdiscount店铺虚拟仓） */
	warehouseCodes?: string[];
	/** 日期（月份） */
	dateStart?: string;
	dateEnd?: string;
	/** SKU */
	skuCodes?: string[];
	/** MSKU */
	mskuCodes?: string[];
	/** 产品名称 */
	productNames?: string[];
	[key: string]: any;
}

/** 分页查询 */
export function getSelfOperatedInventoryReportPage(
	data?: SelfOperatedInventoryReportQuery
) {
	return httpService.post(
		'/stock/selfOperatedWarehouseInventoryJxc/page',
		data,
		{}
	);
}

/** 导出 */
export function postSelfOperatedInventoryReportExport(
	data?: SelfOperatedInventoryReportQuery
) {
	return httpService.post(
		'/stock/selfOperatedWarehouseInventoryJxc/export',
		data,
		{
			responseType: 'blob',
		}
	);
}
