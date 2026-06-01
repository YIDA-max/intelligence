import { httpService } from '/@/utils/request';

/** 导入接口 URL（供 ImportDialog 等直接传 excelUploadApi 使用，不经过封装函数） */
export const MERCADOLIBRE_IMPORT_URL =
	'/stock/platformMercadolibreInventoryJxc/import';

/** 导入模板文件URL */
export const MERCADOLIBRE_TEMPLATE_URL =
	'/files/import-template/美客多平台进销存月报表初始化数据模板.xlsx';

export interface MercadolibreInventoryReportQuery {
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
export function getMercadolibreInventoryReportPage(
	data?: MercadolibreInventoryReportQuery
) {
	return httpService.post(
		'/stock/platformMercadolibreInventoryJxc/page',
		data,
		{}
	);
}

/** 导出 */
export function postMercadolibreInventoryReportExport(
	data?: MercadolibreInventoryReportQuery
) {
	return httpService.post(
		'/stock/platformMercadolibreInventoryJxc/export',
		data,
		{
			responseType: 'blob',
		}
	);
}
