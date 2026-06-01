/*
 * @Description: 库存组织关系 API
 */
import { httpService } from '/@/utils/request';

/** 导入模板地址 */
export const INVENTORY_ORG_RELATION_IMPORT_TEMPLATE_URL =
	'/files/import-template/库存组织关系导入模板.xlsx';
/** 导入接口地址 */
export const INVENTORY_ORG_RELATION_IMPORT_URL =
	'/kingdee/inventoryOrgRelation/import';
import type { OrderItem } from '../types';

export interface InventoryOrgRelationVO {
	/** id */
	id?: number;
	/** warehouseCode */
	warehouseCode?: string;
	/** kingdeeInventoryOrgCode */
	kingdeeInventoryOrgCode?: string;
	/** kingdeeInventoryOrgName */
	kingdeeInventoryOrgName?: string;
	/** kingdeeWarehouseCode */
	kingdeeWarehouseCode?: string;
	/** kingdeeWarehouseName */
	kingdeeWarehouseName?: string;
	/** kingdeeVirtualTransitWhCode */
	kingdeeVirtualTransitWhCode?: string;
	/** kingdeeVirtualTransitWhName */
	kingdeeVirtualTransitWhName?: string;
	/** kingdeeDeptCode */
	kingdeeDeptCode?: string;
	/** kingdeeDeptName */
	kingdeeDeptName?: string;
	/** kingdeeBusinessLineCode */
	kingdeeBusinessLineCode?: string;
	/** kingdeeBusinessLineName */
	kingdeeBusinessLineName?: string;
	/** createName */
	createName?: string;
	/** createTime */
	createTime?: string;
	/** updateName */
	updateName?: string;
	/** updateTime */
	updateTime?: string;
}

export interface PageInventoryOrgRelationVO {
	records: InventoryOrgRelationVO[];
	total?: number;
	size?: number;
	current?: number;
	orders?: OrderItem[];
	optimizeCountSql?: boolean;
	searchCount?: boolean;
	optimizeJoinOfCountSql?: boolean;
	maxLimit?: number;
	countId?: string;
	/** 勾选的id列表  导出时使用 */
	ids?: number[];
	[key: string]: any;
}

export interface QueryInventoryOrgRelationPageParams {
	total?: number;
	size?: number;
	current?: number;
	optimizeCountSql?: boolean;
	searchCount?: boolean;
	optimizeJoinOfCountSql?: boolean;
	maxLimit?: number;
	countId?: string;
	/** 仟易仓库/平台(筛选用) */
	platformChannelCodes?: string[];
	/** 仟易仓库类型/店铺(筛选用) */
	warehouseTypeCodes?: (string | number)[];
	/** 仟易仓库代码 */
	warehouseCodes?: string[];
	/** 金蝶库存组织编码 */
	kingdeeInventoryOrgCodes?: string[];
	/** 金蝶仓库编码 */
	kingdeeWarehouseCodes?: string[];
	/** 金蝶虚拟在途仓编码 */
	kingdeeVirtualTransitWhCodes?: string[];
	/** 创建人ID集合 */
	createIds?: number[];
	/** 创建时间-开始 */
	createTimeStart?: string;
	/** 创建时间-结束 */
	createTimeEnd?: string;
	/** 勾选的id列表  导出时使用 */
	ids?: number[];
}

/** 分页查询库存组织关系 */
export function getInventoryOrgRelationPage(
	data: QueryInventoryOrgRelationPageParams
) {
	return httpService.post<PageInventoryOrgRelationVO>(
		'/kingdee/inventoryOrgRelation/page',
		data
	);
}

/** 新增库存组织关系 */
export function addInventoryOrgRelation(data: any) {
	return httpService.post<{ code: number; data: number; msg: string }>(
		'/kingdee/inventoryOrgRelation/add',
		data
	);
}

/** 编辑库存组织关系 */
export function updateInventoryOrgRelation(data: any) {
	return httpService.post<{ code: number; data: boolean; msg: string }>(
		'/kingdee/inventoryOrgRelation/update',
		data
	);
}

/** 获取库存组织关系详情 */
export function getInventoryOrgRelationDetail(params: { id: number }) {
	return httpService.get<{ code: number; data: any; msg: string }>(
		'/kingdee/inventoryOrgRelation/detail',
		{ params }
	);
}

/** 删除库存组织关系 */
export function deleteInventoryOrgRelation(data: { id: number }) {
	return httpService.post<{ code: number; data: boolean; msg: string }>(
		'/kingdee/inventoryOrgRelation/delete',
		data
	);
}

/** 导出库存组织关系 */
export function getExportInventoryOrgRelation(params?: any) {
	return httpService.post(
		'/kingdee/inventoryOrgRelation/export',
		params ?? {},
		{
			responseType: 'blob',
		}
	);
}

/** 金蝶仓库列表 */
export function getWarehouseIistByOrgId(params?: any) {
	return httpService.get('/kingdee/kingdeeWarehouse/listByOrgId', { params });
}

/** 金蝶部门列表 */
export function getDeptIistByOrgId(params?: any) {
	return httpService.get('/kingdee/kingdeeDept/listByOrgId', { params });
}
