/**
 * MrTable 组件的类型定义
 * 
 * 提供完整的 TypeScript 类型支持
 */

import type { TableInstance, TableColumnInstance } from 'element-plus';

/**
 * MrTable 实例类型
 * 继承自 Element Plus 的 TableInstance
 */
export type MrTableInstance = TableInstance;

/**
 * MrTableColumn 实例类型
 * 继承自 Element Plus 的 TableColumnInstance
 */
export type MrTableColumnInstance = TableColumnInstance;

/**
 * 表格列配置接口
 */
export interface MrTableColumn {
	/** 列的字段名 */
	prop?: string;
	/** 列的标题 */
	label?: string;
	/** 列的宽度 */
	width?: string | number;
	/** 列的最小宽度 */
	minWidth?: string | number;
	/** 列是否固定 */
	fixed?: boolean | 'left' | 'right';
	/** 是否可排序 */
	sortable?: boolean | 'custom';
	/** 对齐方式 */
	align?: 'left' | 'center' | 'right';
	/** 表头对齐方式 */
	headerAlign?: 'left' | 'center' | 'right';
	/** 列的类型 */
	type?: 'selection' | 'index' | 'expand';
	/** 是否显示 tooltip */
	showOverflowTooltip?: boolean;
	/** 格式化函数 */
	formatter?: (row: any, column: any, cellValue: any, index: number) => any;
	/** 自定义类型（用于业务扩展） */
	customType?: string;
}

/**
 * 表格数据行接口（泛型）
 */
export interface MrTableRow<T = any> {
	[key: string]: T;
}

/**
 * 表格配置接口
 */
export interface MrTableConfig {
	/** 表格数据 */
	data?: any[];
	/** 是否显示边框 */
	border?: boolean;
	/** 是否显示斑马纹 */
	stripe?: boolean;
	/** 表格大小 */
	size?: 'large' | 'default' | 'small';
	/** 表格高度 */
	height?: string | number;
	/** 表格最大高度 */
	maxHeight?: string | number;
	/** 是否显示加载状态 */
	loading?: boolean;
	/** 空数据时显示的文本 */
	emptyText?: string;
	/** 是否高亮当前行 */
	highlightCurrentRow?: boolean;
	/** 默认排序 */
	defaultSort?: {
		prop: string;
		order: 'ascending' | 'descending';
	};
}

/**
 * 表格事件类型
 */
export interface MrTableEvents {
	/** 选择项发生变化时触发 */
	'selection-change'?: (selection: any[]) => void;
	/** 用户手动勾选数据行时触发 */
	select?: (selection: any[], row: any) => void;
	/** 用户手动勾选全选时触发 */
	'select-all'?: (selection: any[]) => void;
	/** 单元格点击时触发 */
	'cell-click'?: (row: any, column: any, cell: any, event: Event) => void;
	/** 行点击时触发 */
	'row-click'?: (row: any, column: any, event: Event) => void;
	/** 行双击时触发 */
	'row-dblclick'?: (row: any, column: any, event: Event) => void;
	/** 行右键点击时触发 */
	'row-contextmenu'?: (row: any, column: any, event: Event) => void;
	/** 表头点击时触发 */
	'header-click'?: (column: any, event: Event) => void;
	/** 排序时触发 */
	'sort-change'?: (params: { column: any; prop: string; order: string }) => void;
	/** 筛选时触发 */
	'filter-change'?: (filters: any) => void;
	/** 当前行变化时触发 */
	'current-change'?: (currentRow: any, oldCurrentRow: any) => void;
}

/**
 * 未来可能的扩展配置（预留）
 */
export interface MrTableExtendConfig {
	/** 是否启用全局加载状态管理 */
	autoLoading?: boolean;
	/** 是否启用全局分页 */
	pagination?: boolean | MrTablePaginationConfig;
	/** 是否启用列配置缓存 */
	saveColumnConfig?: boolean;
	/** 列配置缓存的 key */
	columnConfigKey?: string;
	/** 自定义全局格式化器 */
	formatters?: Record<string, (value: any) => any>;
	/** 权限控制 */
	auth?: boolean;
}

/**
 * 分页配置接口（预留）
 */
export interface MrTablePaginationConfig {
	/** 当前页码 */
	current?: number;
	/** 每页条数 */
	size?: number;
	/** 总条数 */
	total?: number;
	/** 每页条数选项 */
	pageSizes?: number[];
	/** 分页组件布局 */
	layout?: string;
}

/**
 * 导出所有类型
 */
export type {
	TableInstance as ElTableInstance,
	TableColumnInstance as ElTableColumnInstance,
} from 'element-plus';

