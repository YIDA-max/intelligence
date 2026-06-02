import type { Ref } from 'vue';
import { purchaseUnitConvert } from '/@/api/product/sku';

/*
 * @Author: YIDA 3136271519@qq.com
 * @Date: 2025-12-09 15:31:05
 * @LastEditors: YIDA 3136271519@qq.com
 * @LastEditTime: 2025-12-11 10:44:54
 * @FilePath: \qianyi-ui\src\views\product\product-info\sku\components\all-edit-sku\components\model-info\purchase-info\utils\packSpec.ts
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
type SpecField = 'packSpecLength' | 'packSpecWidth' | 'packSpecHeight';
/**
 * 根据单位类型自动转换指定字段的值
 * @param {string} newVal - '1' 表示公制，'2' 表示英制
 * @param {string[]} fieldNames - 要转换的字段名数组，如 ['packSpecLength', 'packSpecWidth', 'packSpecHeight']
 * @param {Object} formData - 表单数据对象（需包含 .value）
 */
export async function autoConvertUnitFields(
	newVal: string,
	fieldNames: SpecField[],
	formData: Ref<{
		packSpecLength: string;
		packSpecWidth: string;
		packSpecHeight: string;
		packSpecUnit: string;
	}>
) {
	const isMetric = newVal === '1';
	formData.value.packSpecUnit = isMetric ? 'cm' : 'inch';

	// 1. 构建请求参数：从 formData.value 中提取字段值
	const payload: Record<string, string> = {};
	for (const field of fieldNames) {
		payload[field] = formData.value[field] ?? null; // 容错：空值默认为 null
	}

	// 2. 设置转换方向
	payload.fromPuchaseUnitType = isMetric ? '2' : '1'; // 原单位
	payload.toPuchaseUnitType = isMetric ? '1' : '2'; // 目标单位

	try {
		const res = await purchaseUnitConvert(payload);

		if (res?.code !== 0) {
			// console.error('单位转换失败:', res);
			return false;
		}

		// 3. 成功后，将 res.data 中对应字段写回 formData.value
		for (const field of fieldNames) {
			if (res.data.hasOwnProperty(field)) {
				formData.value[field] = res.data[field];
			}
		}

		return true;
		// eslint-disable-next-line no-unused-vars
	} catch (error) {
		// console.error('单位转换请求异常:', error);
		return false;
	}
}
export function useUnitConverter() {
	// 缓存结构：map[unitType][inputKey] = { length, width, height }
	const conversionCache = ref<any>({
		'1': {} as Record<string, Record<string, string>>,
		'2': {} as Record<string, Record<string, string>>,
	});
	/**
	 * 根据单位类型自动转换指定字段的值
	 * @param {string} newVal - '1' 表示公制，'2' 表示英制
	 * @param {string[]} fieldNames - 要转换的字段名数组，如 ['packSpecLength', 'packSpecWidth', 'packSpecHeight']
	 * @param {Object} formData - 表单数据对象（需包含 .value）
	 */
	async function autoConvertUnitFields(
		newVal: string,
		fieldNames: SpecField[],
		formData: Ref<{
			packSpecLength: string;
			packSpecWidth: string;
			packSpecHeight: string;
			packSpecUnit: string;
		}>
	) {
		const isMetric = newVal === '1';
		formData.value.packSpecUnit = isMetric ? 'cm' : 'inch';

		// 先检查缓存是否有值
		if (
			conversionCache.value[newVal] &&
			Object.keys(conversionCache.value[newVal]).length
		) {
			if (newVal === '1') {
				formData.value.packSpecLength =
					conversionCache.value['1'].packSpecLength;
				formData.value.packSpecWidth = conversionCache.value['1'].packSpecWidth;
				formData.value.packSpecHeight =
					conversionCache.value['1'].packSpecHeight;
			} else if (newVal === '2') {
				formData.value.packSpecLength =
					conversionCache.value['2'].packSpecLength;
				formData.value.packSpecWidth = conversionCache.value['2'].packSpecWidth;
				formData.value.packSpecHeight =
					conversionCache.value['2'].packSpecHeight;
			}
			return;
		}

		// 1. 构建请求参数：从 formData.value 中提取字段值
		const payload: Record<string, string> = {};
		for (const field of fieldNames) {
			payload[field] = formData.value[field] ?? null; // 容错：空值默认为 null
		}

		// 2. 设置转换方向
		payload.fromPuchaseUnitType = isMetric ? '2' : '1'; // 原单位
		payload.toPuchaseUnitType = isMetric ? '1' : '2'; // 目标单位

		try {
			// 根据 newVal 判断转换方向，先缓存当前值，再发起转换请求 请求完成之后再缓存转换后的值
			// 然后只要不清除缓存，下次切换就能直接用缓存的值
			if (newVal === '1') {
				conversionCache.value['2'] = {
					packSpecLength: formData.value.packSpecLength,
					packSpecWidth: formData.value.packSpecWidth,
					packSpecHeight: formData.value.packSpecHeight,
				};
				const res = await purchaseUnitConvert(payload);

				if (res?.code !== 0) {
					// console.error('单位转换失败:', res);
					return false;
				}

				// 3. 成功后，将 res.data 中对应字段写回 formData.value
				for (const field of fieldNames) {
					if (res.data.hasOwnProperty(field)) {
						formData.value[field] = res.data[field];
					}
				}

				conversionCache.value['1'] = {
					packSpecLength: formData.value.packSpecLength,
					packSpecWidth: formData.value.packSpecWidth,
					packSpecHeight: formData.value.packSpecHeight,
				};
				return true;
			} else if (newVal === '2') {
				conversionCache.value['1'] = {
					packSpecLength: formData.value.packSpecLength,
					packSpecWidth: formData.value.packSpecWidth,
					packSpecHeight: formData.value.packSpecHeight,
				};
				const res = await purchaseUnitConvert(payload);

				if (res?.code !== 0) {
					// console.error('单位转换失败:', res);
					return false;
				}

				// 3. 成功后，将 res.data 中对应字段写回 formData.value
				for (const field of fieldNames) {
					if (res.data.hasOwnProperty(field)) {
						formData.value[field] = res.data[field];
					}
				}

				conversionCache.value['2'] = {
					packSpecLength: formData.value.packSpecLength,
					packSpecWidth: formData.value.packSpecWidth,
					packSpecHeight: formData.value.packSpecHeight,
				};
				return true;
			}

			// eslint-disable-next-line no-unused-vars
		} catch (error) {
			// console.error('单位转换请求异常:', error);
			return false;
		}
	}
	/**
	 * 清除转换缓存
	 * 一般情况下是只要输入的值变化了，就需要清除缓存
	 * 但是现在做的是只要是失焦就视为输入完成，所以失焦时清除缓存
	 */
	const clearConversionCache = () => {
		conversionCache.value = {
			'1': {} as Record<string, Record<string, string>>,
			'2': {} as Record<string, Record<string, string>>,
		};
	};
	/**
	 * 失去焦点比对是否变化，变化则清除缓存
	 */
	const handleBlurClearCache = (
		type: string,
		value: any,
		key: string | number
	) => {
		if (type === '1') {
			if (conversionCache.value['1'][key] !== value) {
				clearConversionCache();
			}
		} else if (type === '2') {
			if (conversionCache.value['2'][key] !== value) {
				clearConversionCache();
			}
		}
	};
	return {
		autoConvertUnitFields,
		clearConversionCache,
		handleBlurClearCache,
	};
}
