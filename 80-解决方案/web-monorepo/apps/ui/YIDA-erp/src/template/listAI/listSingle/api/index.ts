import { httpService } from '/@/utils/request';

/**
 * 列表查询参数接口
 */
export interface ListPageQuery {
	/** 分页参数 */
	current?: number;
	size?: number;
	/** 排序参数 */
	ascs?: string[];
	descs?: string[];
	/** 业务查询参数 - 根据实际需求添加 */
	// fieldName?: string;
	[key: string]: any;
}

/**
 * 列表数据项接口
 */
export interface ListItemVO {
	/** ID */
	id?: number;
	/** 业务字段 - 根据实际需求添加 */
	// fieldName?: string;
	/** 创建时间 */
	createTime?: string;
	[key: string]: any;
}

/**
 * 分页响应接口
 */
export interface ListPageResponse {
	code?: number;
	msg?: string;
	data?: {
		records?: ListItemVO[];
		total?: number;
		size?: number;
		current?: number;
	};
}

/**
 * 列表分页查询
 */
export function getListPage(params?: ListPageQuery) {
	return httpService.get<ListPageResponse>('/api/module/page', {
		params,
	});
}

/**
 * 列表导出
 */
export function postListExport(data?: ListPageQuery) {
	return httpService.post('/api/module/export', data, {
		responseType: 'blob',
	});
}

/**
 * 删除
 */
export function deleteListItem(data?: { id: number }) {
	return httpService.post('/api/module/delete', data);
}
