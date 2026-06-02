import { httpService } from '/@/utils/request';

/** 导入接口 URL（供 ImportDialog 等直接传 excelUploadApi 使用，不经过封装函数） */
export const TAKEALOT_IMPORT_URL = '/stock/platformTakealotInventoryJxc/init';

/** 导入模板文件URL */
export const TAKEALOT_TEMPLATE_URL =
	'/files/import-template/Takealot进销存初始化数据模板.xlsx';

export interface takealotInventoryReportQuery {
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
export function getTakealotInventoryReportPage(
	data?: takealotInventoryReportQuery
) {
	return httpService.post('/stock/platformTakealotInventoryJxc/page', data, {});
}

/** 导出 */
export function postTakealotInventoryReportExport(
	data?: takealotInventoryReportQuery
) {
	return httpService.post('/stock/platformTakealotInventoryJxc/export', data, {
		responseType: 'blob',
	});
}
