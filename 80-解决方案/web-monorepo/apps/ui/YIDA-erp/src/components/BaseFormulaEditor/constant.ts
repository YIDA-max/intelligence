/*
 * @Author: YIDA 3136271519@qq.com
 * @Date: 2025-10-10 15:29:49
 * @LastEditors: YIDA 3136271519@qq.com
 * @LastEditTime: 2025-10-10 16:20:02
 * @FilePath: \qianyi-ui\src\components\BaseFormulaEditor\constant.ts
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
//luHaiMin  opt函数选项，需要对应的函数放开即可

export const conditionsData = () => [
	{ label: '大于', id: '>' },
	{ label: '小于', id: '<' },
	{ label: '大于等于', id: '>=' },
	{ label: '小于等于', id: '<=' },
	{ label: '等于', id: '=' },
	{ label: '不等于', id: '<>' },
];

//
const opt = [
	{
		label: '常用函数',
		children: ['DATE', 'DATEDIF', 'IF', 'MAPX', 'SUM'],
	},
	{
		label: '数学函数',
		children: [
			'ABS',
			'AVERAGE',
			'CEILING',
			'COUNT',
			'COUNTIF',
			'FIXED',
			'FLOOR',
			'INT',
			'LARGE',
			'LOG',
			'MAX',
			'MIN',
			'MOD',
			'POWER',
			'PRODUCT',
			'RAND',
			'ROUND',
			'SMALL',
			'SQRT',
			'SUM',
			'SUMPRODUCT',
		],
	},
	{
		label: '文本函数',
		children: [
			'CONCATENATE',
			'CHAR',
			'EXACT',
			'IP',
			'ISEMPTY',
			'LEFT',
			'LEN',
			'LOWER',
			'MID',
			'REPLACE',
			'REPT',
			'RIGHT',
			'SEARCH',
			'SPLIT',
			'TEXT',
			'TRIM',
			'UNION',
			'UPPER',
			'VALUE',
		],
	},
	{
		label: '日期函数',
		children: [
			'DATE',
			'DATEDELTA',
			'DATEDIF',
			'DAY',
			'DAYS',
			'DAYS360',
			'HOUR',
			'ISOWEEKNUM',
			'MINUTE',
			'MONTH',
			'NETWORKDAYS',
			'NOW',
			'SECOND',
			'SYSTIME',
			'TIME',
			'TIMESTAMP',
			'TODAY',
			'WEEKNUM',
			'WORKDAY',
			'YEAR',
		],
	},

	{
		label: '逻辑函数',
		children: ['AND', /*'FALSE', 'IF', 'IFS', 'NOT',*/ 'OR' /*'TRUE', 'XOR',*/],
	},

	{
		label: '高级函数',
		children: ['GETUSERNAME', 'MAPX', 'RECNO', 'TEXTUSER', 'UUID'],
	},
];

/**
 * 方法选项项类型
 */
interface MethodOption {
	label: string;
	children: Array<{
		label: string;
		id: string;
		type?: 'condition'; // 可选类型，仅条件类型有
	}>;
}

/**
 * 获取方法选项
 * @description 包含常用条件和函数
 * @returns {MethodOption[]} 方法选项数组
 */
export const methodsOptionsFn = (): MethodOption[] => {
	let result: MethodOption[] = [];

	/**
	 * 过滤选项并格式化
	 * @param children 原始选项数据
	 */
	const filterOpt = (children: Array<{ label: string; children: string[] }>): void => {
		children.forEach((val) => {
			let item: MethodOption = {
				label: val.label,
				children: val.children.map((v) => ({ label: v, id: v })),
			};
			result.push(item);
		});
	};

	// 条件选项
	const conditionOpt: MethodOption = {
		label: '常用条件',
		children: conditionsData().map((v) => ({ ...v, type: 'condition' })),
	};

	filterOpt(opt);

	return [conditionOpt, ...result];
};
// 字段列表
export const fieldList = [
	{
		fieldCode: 'length',
		fieldName: '长度',
		fieldType: 'number',
		fieldTitle: '包裹的长度',
	},
	{
		fieldCode: 'width',
		fieldName: '宽度',
		fieldType: 'number',
		fieldTitle: '包裹的宽度',
	},
	{
		fieldCode: 'height',
		fieldName: '高度',
		fieldType: 'number',
		fieldTitle: '包裹的高度',
	},
	{
		fieldCode: 'grossWeight',
		fieldName: '实重',
		fieldType: 'number',
		fieldTitle: '包裹的毛重',
	},
	{
		fieldCode: 'volumeWeight',
		fieldName: '体积重',
		fieldType: 'number',
		fieldTitle: '包裹的体积重量',
	},
];
