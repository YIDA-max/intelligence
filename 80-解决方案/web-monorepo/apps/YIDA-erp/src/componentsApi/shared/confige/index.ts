// /**
//  * TreeSelectInputApi 配置注册中心
//  * 集中管理所有配置，避免配置文件爆炸
//  */
// import type { TreeSelectInputSettings } from '../types';
// import { createEntityConfig } from './factory';
// import { validateAllConfigs } from './_alidator';

// // ==================== API 导入 ====================
// // 用户相关
// import { getUserListByCondition } from '/@/api/admin/user';

// // 字典相关
// import { getDicts } from '/@/api/admin/dict';

// // 组织架构相关
// // import { getDeptTree } from '/@/api/admin/dept';
// // import { getRoleList } from '/@/api/admin/role';

// // 业务实体相关
// // import { getWarehouseList } from '/@/api/warehouse';
// // import { getPlatformList } from '/@/api/platform';
// // import { getStoreList } from '/@/api/store';
// // import { getSupplierList } from '/@/api/supplier';

// // ==================== 配置注册表 ====================

// /**
//  * 配置注册表
//  * 所有可用的 componentType 配置都在这里定义
//  */
// export const configRegistry: Record<
// 	string,
// 	Partial<TreeSelectInputSettings>
// > = {
// 	// ==================== 用户相关 ====================

// 	/**
// 	 * 用户列表选择器
// 	 * API: getUserListByCondition
// 	 * 字段映射: name/name/children
// 	 * 默认参数: { lockFlag: 0 } (只显示未锁定用户)
// 	 */
// 	userList: createEntityConfig({
// 		api: getUserListByCondition,
// 		text: '用户',
// 		code: 'userIds',
// 		fieldMapping: {
// 			value: 'name',
// 			label: 'name',
// 			children: 'children',
// 		},
// 		getIdsCode: 'name',
// 		defaultParams: {
// 			lockFlag: 0,
// 		},
// 	}),

// 	/**
// 	 * 金蝶单据创建人选择器
// 	 * API: getUserListByCondition
// 	 * 字段映射: name/name/children
// 	 */
// 	createUser: createEntityConfig({
// 		api: getUserListByCondition,
// 		text: '金蝶单据创建人',
// 		code: 'createNames',
// 		fieldMapping: {
// 			value: 'name',
// 			label: 'name',
// 			children: 'children',
// 		},
// 		getIdsCode: 'name',
// 		defaultParams: {
// 			lockFlag: 0,
// 		},
// 	}),

// 	// ==================== 字典相关 ====================

// 	/**
// 	 * 字典选择器（通用）
// 	 * API: getDicts
// 	 * 字段映射: value/label/children
// 	 * 使用方式：通过 settings.getTreeDataParams 传入字典类型
// 	 * 示例：
// 	 *   <TreeSelectInputApi
// 	 *     componentType="dicts"
// 	 *     :settings="{ getTreeDataParams: 'bill_status', text: '单据状态', code: 'billStatuses' }"
// 	 *   />
// 	 */
// 	dicts: {
// 		getTreeData: getDicts,
// 		getTreeDataParams: '', // 需要在使用时通过 settings 传入具体的字典类型
// 		text: '请选择',
// 		code: 'values',
// 		width: '220px',
// 		selectTreeProps: {
// 			value: 'value',
// 			label: 'label',
// 			children: 'children',
// 		},
// 		getIdsCode: 'label',
// 		renderData: (data: any) => data,
// 	},

// 	// ==================== 组织架构相关 ====================

// 	/**
// 	 * 部门选择器
// 	 * API: getDeptTree
// 	 * 字段映射: id/deptName/children
// 	 */
// 	// department: createEntityConfig({
// 	// 	api: getDeptTree,
// 	// 	text: '部门',
// 	// 	code: 'deptIds',
// 	// 	fieldMapping: {
// 	// 		value: 'id',
// 	// 		label: 'deptName',
// 	// 		children: 'children',
// 	// 	},
// 	// }),

// 	/**
// 	 * 角色选择器
// 	 * API: getRoleList
// 	 * 字段映射: id/roleName/children
// 	 */
// 	// role: createEntityConfig({
// 	// 	api: getRoleList,
// 	// 	text: '角色',
// 	// 	code: 'roleIds',
// 	// 	fieldMapping: {
// 	// 		value: 'id',
// 	// 		label: 'roleName',
// 	// 		children: 'children',
// 	// 	},
// 	// }),

// 	// ==================== 业务实体相关 ====================

// 	/**
// 	 * 仓库选择器
// 	 * API: getWarehouseList
// 	 * 字段映射: id/name/children
// 	 */
// 	// warehouse: createEntityConfig({
// 	// 	api: getWarehouseList,
// 	// 	text: '仓库',
// 	// 	code: 'warehouseIds',
// 	// }),

// 	/**
// 	 * 平台选择器
// 	 * API: getPlatformList
// 	 * 字段映射: id/name/children
// 	 */
// 	// platform: createEntityConfig({
// 	// 	api: getPlatformList,
// 	// 	text: '平台',
// 	// 	code: 'platformIds',
// 	// }),

// 	/**
// 	 * 店铺选择器
// 	 * API: getStoreList
// 	 * 字段映射: id/name/children
// 	 */
// 	// store: createEntityConfig({
// 	// 	api: getStoreList,
// 	// 	text: '店铺',
// 	// 	code: 'storeIds',
// 	// }),

// 	/**
// 	 * 供应商选择器
// 	 * API: getSupplierList
// 	 * 字段映射: id/name/children
// 	 */
// 	// supplier: createEntityConfig({
// 	// 	api: getSupplierList,
// 	// 	text: '供应商',
// 	// 	code: 'supplierIds',
// 	// }),
// };

// // ==================== 配置元数据 ====================

// /**
//  * 配置元数据
//  * 用于生成文档和提供开发提示
//  */
// export const configMetadata: Record<
// 	string,
// 	{
// 		description: string;
// 		apiParams?: string[];
// 		example: string;
// 		notes?: string;
// 	}
// > = {
// 	userList: {
// 		description: '用户列表选择器',
// 		apiParams: ['lockFlag', 'deptId', 'postCodeList'],
// 		example: `<TreeSelectInputApi
//   v-model:queryForm="queryForm"
//   componentType="userList"
//   :searchFn="handleSearch"
// />`,
// 		notes: '默认只显示未锁定用户 (lockFlag: 0)',
// 	},

// 	createUser: {
// 		description: '金蝶单据创建人选择器',
// 		apiParams: ['lockFlag'],
// 		example: `<TreeSelectInputApi
//   v-model:queryForm="queryForm"
//   componentType="createUser"
//   :searchFn="handleSearch"
// />`,
// 	},

// 	dicts: {
// 		description: '字典选择器（通用）',
// 		apiParams: ['dictType (通过 getTreeDataParams 传入)'],
// 		example: `<TreeSelectInputApi
//   v-model:queryForm="queryForm"
//   componentType="dicts"
//   :searchFn="handleSearch"
//   :settings="{
//     getTreeDataParams: 'bill_status',
//     text: '单据状态',
//     code: 'billStatuses'
//   }"
// />`,
// 		notes: '需要通过 settings.getTreeDataParams 传入具体的字典类型',
// 	},

// 	// department: {
// 	// 	description: '部门选择器',
// 	// 	apiParams: ['status', 'parentId'],
// 	// 	example: `<TreeSelectInputApi componentType="department" />`,
// 	// },

// 	// warehouse: {
// 	// 	description: '仓库选择器',
// 	// 	apiParams: ['status', 'type', 'regionId'],
// 	// 	example: `<TreeSelectInputApi componentType="warehouse" />`,
// 	// },
// };

// // ==================== 配置分组 ====================

// /**
//  * 配置分组
//  * 便于管理和查找
//  */
// export const configGroups = {
// 	user: ['userList', 'createUser'],
// 	dict: ['dicts'],
// 	// organization: ['department', 'role'],
// 	// business: ['warehouse', 'platform', 'store', 'supplier'],
// };

// // ==================== 开发环境验证 ====================

// // 在开发环境下验证所有配置
// validateAllConfigs(configRegistry);

// // ==================== 导出 ====================

// /**
//  * 获取配置
//  * @param componentType 配置类型
//  * @returns 配置对象
//  */
// export function getConfig(
// 	componentType: string
// ): Partial<TreeSelectInputSettings> | null {
// 	return configRegistry[componentType] || null;
// }

// /**
//  * 获取所有可用的配置类型
//  * @returns 配置类型数组
//  */
// export function getAvailableTypes(): string[] {
// 	return Object.keys(configRegistry);
// }

// /**
//  * 检查配置类型是否存在
//  * @param componentType 配置类型
//  * @returns 是否存在
//  */
// export function hasConfig(componentType: string): boolean {
// 	return componentType in configRegistry;
// }
