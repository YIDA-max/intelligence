import { httpService } from '/@/utils/request';

export interface ThirdWarehouseInventoryReportQuery {
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
export function getThirdWarehouseInventoryReportPage(
	data?: ThirdWarehouseInventoryReportQuery
) {
	return httpService.post(
		'/stock/thirdPartyWarehouseInventoryJxc/page',
		data,
		{}
	);
}

/** 导出 */
export function postThirdWarehouseInventoryReportExport(
	data?: ThirdWarehouseInventoryReportQuery
) {
	return httpService.post(
		'/stock/thirdPartyWarehouseInventoryJxc/export',
		data,
		{
			responseType: 'blob',
		}
	);
}
