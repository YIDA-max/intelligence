/*
 * @Author: wuyueqin wuyueqin@merach.com
 * @Date: 2026-01-04 14:23:55
 * @LastEditors: wuyueqin wuyueqin@merach.com
 * @LastEditTime: 2026-02-03 11:06:49
 * @FilePath: \qianyi-ui\src\hooks\useFormatter.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
//类型
type FormatType =
	| 'text'
	| 'number'
	| 'price'
	| 'percent'
	| 'datetime'
	| 'boolean';

interface FormatOptions {
	valueType?: FormatType; //类型，默认text
	emptyText?: string;
	digits?: number;
	unit?: string;
	field?: string;
	formatter?: (row?: any, value?: any) => any;
	prefixObj?: {
		//前缀对象
		field: string; //前缀字段
		connectStr?: string; //连接符
	};
}

// 统一空值判断
function isEmpty(val: any) {
	return (
		val === null ||
		val === undefined ||
		val === '' ||
		(Array.isArray(val) && val.length === 0)
	);
}

function formatDate(val: any) {
	const date = new Date(val);
	if (isNaN(date.getTime())) return '---';
	return date.toLocaleString();
}

export function useFormatter() {
	const formatValue = (value?: any, options: FormatOptions = {}, row?: any) => {
		const {
			valueType = 'text',
			emptyText = '---',
			digits = 2,
			unit = '',
			field,
			formatter,
		} = options;

		// 1️⃣ value 未传时，用 field + row 兜底
		const finalValue =
			value !== undefined ? value : field && row ? row[field] : undefined;

		// 2️⃣ 自定义 formatter 最高优先
		if (formatter) {
			return formatter(row);
		}

		// 5️⃣ 前缀处理
		if (options?.prefixObj) {
			const { field: prefixField, connectStr = ' - ' } = options.prefixObj;
			const prefixValue = row?.[prefixField];

			if (!isEmpty(prefixValue)) {
				return `${prefixValue}${connectStr}${finalValue}`;
			}
		}

		// 3️⃣ 空值统一兜底
		if (isEmpty(finalValue)) {
			return emptyText;
		}

		// 4️⃣ 内建类型处理
		switch (valueType) {
			case 'number':
				return Number(finalValue).toFixed(digits);

			case 'price':
				return `${Number(finalValue).toFixed(digits)}${unit || '¥'}`;

			case 'percent':
				return `${Number(finalValue).toFixed(digits)}%`;

			case 'datetime':
				return formatDate(finalValue);

			case 'boolean':
				return finalValue ? '是' : '否';

			case 'text':
			default:
				return finalValue;
		}
	};
	//不需使用value
	const formatData = (options: FormatOptions = {}, row?: any) => {
		return formatValue(
			options?.field ? undefined : row?.[options?.field],
			options,
			row
		);
	};

	/**
	 * 格式化数组或字符串
	 * @param data 要格式化的数据（可以是数组或字符串）
	 * @param options 配置选项
	 * @returns 格式化后的字符串
	 */
	const formatArrayOrString = (
		data: any,
		options: {
			separator?: string; // 数组连接符，默认空格
			emptyText?: string; // 空值显示文本，默认 '---'
		} = {}
	): string => {
		const { separator = ' ', emptyText = '---' } = options;

		if (!data) return emptyText;

		if (Array.isArray(data)) {
			return data.length > 0 ? data.join(separator) : emptyText;
		}

		return data;
	};

	return {
		formatValue,
		formatData,
		formatArrayOrString,
	};
}
