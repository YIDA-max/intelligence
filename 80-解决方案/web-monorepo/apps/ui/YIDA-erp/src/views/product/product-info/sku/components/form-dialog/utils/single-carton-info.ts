import { cartonUnitConvert } from '/@/api/product/sku';
import { ref } from 'vue';

/*
 * @Author: YIDA 3136271519@qq.com
 * @Date: 2025-12-09 15:31:05
 * @LastEditors: YIDA 3136271519@qq.com
 * @LastEditTime: 2025-12-11 10:49:00
 * @FilePath: \qianyi-ui\src\views\product\product-info\sku\components\all-edit-sku\components\model-info\carton-info\utils\cartonInfo.ts
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */

export function useUnitConverter() {
	// 缓存结构：map[unitType][inputKey] = { length, width, height }
	const conversionCache = ref<Record<string, any[]>>({
		'1': [],
		'2': [],
	});

	/**
	 * 根据单位类型自动转换指定字段的值
	 * @param {string} newVal - '1' 表示公制，'2' 表示英制
	 * @param {Ref} tableData - 表格数据的响应式引用
	 */
	async function autoConvertUnitFields(newVal: string, tableData: any) {
		// 构建查询参数
		const isMetric = newVal === '1';
		const fromUnit = isMetric ? '2' : '1'; // 原单位
		const toUnit = isMetric ? '1' : '2'; // 目标单位

		// 先检查缓存是否有值，如果有则直接使用缓存
		if (conversionCache.value[newVal]?.length > 0) {
			const cachedData = conversionCache.value[newVal];
			tableData.value.forEach((item: any, index: number) => {
				if (cachedData[index]) {
					Object.assign(item, cachedData[index]);
				}
			});
			return true;
		}

		// 缓存当前值（转换前的值）
		const oppositeUnit = newVal === '1' ? '2' : '1';
		conversionCache.value[oppositeUnit] = tableData.value.map((item: any) => ({
			outCartonSpecLength: item.outCartonSpecLength,
			outCartonSpecWidth: item.outCartonSpecWidth,
			outCartonSpecHeight: item.outCartonSpecHeight,
			cartonGrossWeight: item.cartonGrossWeight,
			cartonNetWeight: item.cartonNetWeight,
			outCartonSpecUnit: item.outCartonSpecUnit,
			cartonGrossWeightUnit: item.cartonGrossWeightUnit,
			cartonNetWeightUnit: item.cartonNetWeightUnit,
		}));

		// 构建请求参数
		const payload: Record<string, string | Array<Record<string, any>>> = {
			cartonSpecs: tableData.value.map((item: any) => ({
				cartonGrossWeight: item.cartonGrossWeight,
				cartonNetWeight: item.cartonNetWeight,
				outCartonSpecHeight: item.outCartonSpecHeight,
				outCartonSpecLength: item.outCartonSpecLength,
				outCartonSpecWidth: item.outCartonSpecWidth,
			})),
			fromCartonUnitType: fromUnit,
			toCartonUnitType: toUnit,
		};

		// 发送请求进行单位转换
		try {
			const res = await cartonUnitConvert(payload);
			if (res?.code !== 0) {
				return false;
			}

			// 成功后，将 res.data 中的 cartonSpecs 写回表格数据
			if (res.data && Array.isArray(res.data.cartonSpecs)) {
				const convertedSpecs = res.data.cartonSpecs;
				tableData.value.forEach((item: any, index: number) => {
					if (convertedSpecs[index]) {
						Object.assign(item, convertedSpecs[index]);
					}
					// 更新单位字段
					item.outCartonSpecUnit = isMetric ? 'cm' : 'inch';
					item.cartonGrossWeightUnit = isMetric ? 'kg' : 'lbs';
					item.cartonNetWeightUnit = isMetric ? 'kg' : 'lbs';
				});

				// 缓存转换后的值
				conversionCache.value[newVal] = tableData.value.map((item: any) => ({
					outCartonSpecLength: item.outCartonSpecLength,
					outCartonSpecWidth: item.outCartonSpecWidth,
					outCartonSpecHeight: item.outCartonSpecHeight,
					cartonGrossWeight: item.cartonGrossWeight,
					cartonNetWeight: item.cartonNetWeight,
					outCartonSpecUnit: item.outCartonSpecUnit,
					cartonGrossWeightUnit: item.cartonGrossWeightUnit,
					cartonNetWeightUnit: item.cartonNetWeightUnit,
				}));
			}

			return true;
		} catch (error) {
			return false;
		}
	}

	/**
	 * 清除转换缓存
	 * 当数据发生修改时调用此方法
	 */
	const clearConversionCache = () => {
		conversionCache.value = {
			'1': [],
			'2': [],
		};
	};

	/**
	 * 失去焦点时比对是否变化，变化则清除缓存
	 * @param {string} currentUnitType - 当前单位类型 '1' 或 '2'
	 * @param {any} newValue - 新值
	 * @param {string} fieldName - 字段名
	 * @param {number} rowIndex - 行索引
	 */
	const handleBlurClearCache = (
		currentUnitType: string,
		newValue: any,
		fieldName: string,
		rowIndex: number
	) => {
		const cachedData = conversionCache.value[currentUnitType];
		if (cachedData && cachedData[rowIndex]) {
			const cachedValue = cachedData[rowIndex][fieldName];
			// 如果值发生了变化，清除缓存
			if (cachedValue !== undefined && cachedValue !== newValue) {
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
