/*
 * @Author: wuyueqin wuyueqin@merach.com
 * @Date: 2026-01-30 17:04:27
 * @LastEditors: wuyueqin wuyueqin@merach.com
 * @LastEditTime: 2026-03-05 15:13:09
 * @FilePath: \qianyi-ui\src\types\table\table.d.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
/*
 * @Description:
 */
// Element Plus 表格列配置接口
type FormatType =
	| 'text'
	| 'number'
	| 'price'
	| 'percent'
	| 'datetime'
	| 'boolean';
//内置插槽
type slotName = 'RowValueLink';

type PrefixObj = {
	field: string; //前缀字段
	connectStr?: string; //连接符
};
/**
 * 表格列配置接口，参考Element Plus TableColumn
 * 以下内容非Element Plus TableColumn的属性，是系统自定义的属性：
 * @param tips 系统自定义列头提示信息
 * @param valueType 系统自定义列类型：text(字符串)、number(数值)
 */
export interface TableColumn {
	prop?: string; // 对应列内容的字段名
	label?: string; // 显示的标题
	width?: number; // 列宽度
	align?: 'left' | 'right' | 'center'; // 对齐方式
	fixed?: 'left' | 'right' | false; // 列是否固定在左侧或者右侧
	type?: 'selection' | 'index' | 'expand' | 'checkbox'; // 列eltable的类型
	tips?: string; // 列头提示信息
	valueType?: FormatType; // 系统自定义列类型：不填默认text
	sortable?: boolean | 'custom'; // 是否可排序，参考 Element Plus TableColumn
	slotName?: slotName; // 系统自定义列插槽：不填默认显示文本
	slotAttrs?: Record<string, any>; // 系统自定义列插槽属性：不填默认无属性,配置组件需要的任何参数，这个对象内容用于往组件透传
	prefixObj?: PrefixObj; // 系统自定义列前缀对象：不填默认无前缀对象,配置组件需要的任何参数，这个对象内容用于往组件透传
	[propName: string]: any; // 系统自定义列其他属性：不填默认无其他属性,配置组件需要的任何参数，这个对象内容用于往组件透传
}
