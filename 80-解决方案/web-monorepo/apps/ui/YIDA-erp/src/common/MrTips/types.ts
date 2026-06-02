/**
 * MrTips 组件的类型定义
 */

/**
 * 组件 Props 类型
 */
export interface MrTipsProps {
	/** 显示的标签文本 */
	label?: string | number;
	/** 提示信息内容 */
	tips?: string;
	/** 图标大小 */
	iconSize?: string | number;
	/** 图标颜色 */
	iconColor?: string;
	/** 是否必填（显示红色*号） */
	required?: boolean;
	/** Tooltip 效果类型 */
	effect?: 'dark' | 'light';
	/** Tooltip 出现位置 */
	placement?:
		| 'top'
		| 'top-start'
		| 'top-end'
		| 'bottom'
		| 'bottom-start'
		| 'bottom-end'
		| 'left'
		| 'left-start'
		| 'left-end'
		| 'right'
		| 'right-start'
		| 'right-end';
}

/**
 * Tooltip 位置类型
 */
export type TooltipPlacement =
	| 'top'
	| 'top-start'
	| 'top-end'
	| 'bottom'
	| 'bottom-start'
	| 'bottom-end'
	| 'left'
	| 'left-start'
	| 'left-end'
	| 'right'
	| 'right-start'
	| 'right-end';

/**
 * Tooltip 效果类型
 */
export type TooltipEffect = 'dark' | 'light';

