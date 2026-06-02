import { httpService } from '/@/utils/request';

/** 导入接口 URL（供 ImportDialog 等直接传 excelUploadApi 使用，不经过封装函数） */
export const NOON_IMPORT_URL = '/stock/platformNoonInventoryJxc/init';

/** 导入模板文件URL */
export const NOON_TEMPLATE_URL =
	'/files/import-template/NOON进销存初始化数据模板.xlsx';

export interface NoonInventoryReportQuery {
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
export function getNoonInventoryReportPage(data?: NoonInventoryReportQuery) {
	return httpService.post('/stock/platformNoonInventoryJxc/page', data, {});
}

/** 导出 */
export function postNoonInventoryReportExport(data?: NoonInventoryReportQuery) {
	return httpService.post('/stock/platformNoonInventoryJxc/export', data, {
		responseType: 'blob',
	});
}
