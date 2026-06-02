/*
 * @Author: YIDA 3136271519@qq.com
 * @Date: 2025-10-13 19:26:24
 * @LastEditors: YIDA 3136271519@qq.com
 * @LastEditTime: 2025-10-25 14:58:24
 * @FilePath: \qianyi-ui\src\views\fbm\orderRule\components\utils\index.ts
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */

import { isNaN } from 'lodash';

/**
 * 关于使用in的获取到validateForm的值
 * @param value
 */
export const isInToValidateForm = (isBelong: string, code: string, formRefValue: Array<string>) => {
	// 属于
	if (isBelong === '1') {
		const getFormData = {
			[`${code}`]: `${code} in [${formRefValue.map((item) => (isNaN(Number(item)) ? `'${item}'` : item))}]`,
		};
		return getFormData;
	} else if (isBelong === '2') {
		// 不属于
		const getFormData = {
			[`${code}`]: `!(${code} in [${formRefValue.map((item) => (isNaN(Number(item)) ? `'${item}'` : item))}])`,
		};
		return getFormData;
	}
};

/**
 * 关于使用in的设置回显值
 * @param value
 */
export const isInToSetFormData = (data: Record<string, any>, code: string, formData: Record<string, any>) => {
	// 设置数据
	if (!data || !data[code]) {
		return '错误：无效的数据格式';
	}
	// 用于匹配是否排除指定平台的正则表达式(需要优先匹配 排除平台)
	const regex = new RegExp(`!\\(${code} in \\[([^\\]]+)\\]\\)`);
	const excludeMatch = data[code].match(regex);
	if (excludeMatch) {
		formData.value.isBelong = '2';
		formData.value[code] = excludeMatch[1]
			.split(',') // 切割字符串
			.map((item: string) => item.trim().replace(/'/g, '')) // 去除空格和引号
			.map((item: string) => (isNaN(Number(item)) ? item : Number(item))); // 转换为数字（如果可能）
		return '成功设置数据：排除指定平台';
	}
	// 用于匹配是否包含指定平台的正则表达式
	const regexInclude = new RegExp(`${code} in \\[([^\\]]+)\\]`);
	const match = data[code].match(regexInclude);
	if (match) {
		formData.value.isBelong = '1';
		formData.value[code] = match[1]
			.split(',') // 切割字符串
			.map((item: string) => item.trim().replace(/'/g, '')) // 去除空格和引号
			.map((item: string) => (isNaN(Number(item)) ? item : Number(item))); // 转换为数字（如果可能）
		return '成功设置数据：包含指定平台';
	}
	return '错误：无法解析数据格式';
};
