import type { IPageListResponse } from '/@/components/BaseTable/hooks/BaseTable';
import type { Columns } from '/@/types/table';
// 导入API - 根据实际路径修改
// import {
// 	getListPage,
// 	postListExport,
// 	deleteListItem,
// } from '/@/api/xxx/xxx/xxx/index';

// API配置
export const listApi = {
	getList: (_params?: any): Promise<IPageListResponse> =>
		Promise.resolve({ code: 0, msg: '', data: { records: [], total: 0 } }), // 替换为实际API: getListPage
	exportList: (_params?: any): Promise<any> => Promise.resolve(), // 替换为实际API: postListExport
	// deleteItem: deleteListItem, // 如需删除功能
};

// 模块key - 用于权限控制和设置存储
export const moduleKey = 'moduleName'; // 替换为实际模块名称

// 搜索配置
export const searchConfig: Array<{
	component: string;
	props: Record<string, any>;
}> = [
	// 字典类型示例
	// {
	// 	component: 'TreeSelectInputApi',
	// 	props: {
	// 		componentType: 'dicts',
	// 		settings: {
	// 			code: 'platforms', // 接口入参字段名，多选通常带s
	// 			text: '平台', // 显示名称
	// 			getTreeDataParams: 'platform_channel', // 字典类型必传
	// 		},
	// 	},
	// },
	// 仓库级联选择示例
	// {
	// 	component: 'customCascaderApi',
	// 	props: {
	// 		componentType: 'warehouseId',
	// 		settings: {
	// 			code: 'warehouseCodes',
	// 			text: '仓库',
	// 		},
	// 	},
	// },
	// 店铺/站点级联选择示例
	// {
	// 	component: 'customCascaderApi',
	// 	props: {
	// 		componentType: 'storeSiteId',
	// 		settings: {
	// 			code: 'storeSiteIds',
	// 			text: '店铺/站点',
	// 		},
	// 	},
	// },
	// 模糊搜索/多选搜索示例
	// {
	// 	component: 'SelectInput',
	// 	props: {
	// 		searchTypes: [
	// 			{
	// 				label: '订单号', // 搜索名称
	// 				value: 'orderNos', // 接口查询入参
	// 			},
	// 			{
	// 				label: 'SKU',
	// 				value: 'skuCodes',
	// 			},
	// 		],
	// 	},
	// },
	// 时间选择 - 默认放在所有搜索条件后面
	// {
	// 	component: 'SelectDate',
	// 	props: {
	// 		searchTypes: [
	// 			{
	// 				label: '创建时间',
	// 				value: 'createTime',
	// 				isAddHMS: true,
	// 				dateStart: 'createTimeStart', // 开始时间接口入参
	// 				dateEnd: 'createTimeEnd', // 结束时间接口入参
	// 			},
	// 		],
	// 	},
	// },
];

// 表格列配置
export const columns: Columns = [
	{
		type: 'checkbox', // 固定显示
		width: 60,
		align: 'center',
		fixed: 'left',
	},
	// 字段配置示例
	// {
	// 	title: '字段名称', // 对应需求中的字段名称
	// 	field: 'fieldName', // 接口字段名
	// 	width: 150,
	// },
	// 操作栏 - 如有操作按钮需求
	// {
	// 	title: '操作',
	// 	field: 'action', // 固定为action
	// 	width: 150,
	// 	fixed: 'right',
	// },
];

// 下拉菜单配置示例
// export const actionMenuList = [
// 	{
// 		label: '删除',
// 		value: 'delete',
// 		auth: `${moduleKey}-delete`,
// 	},
// ];
