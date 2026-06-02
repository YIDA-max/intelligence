import { cartonUnitConvert } from '/@/api/product/sku';

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
/**
 * 根据单位类型自动转换指定字段的值
 * @param {string} newVal - '1' 表示公制，'2' 表示英制

 */
export async function autoConvertUnitFields(
	newVal: string,
	getTableData: () => Array<any>,
	setTableData: (data: Array<any>) => void
) {
	// 构建查询参数
	const isMetric = newVal === '1';
	const fromUnit = isMetric ? '2' : '1'; // 原单位
	const toUnit = isMetric ? '1' : '2'; // 目标单位

	// 构建请求参数
	const payload: Record<string, string | Array<Record<string, any>>> = {
		cartonSpecs:
			getTableData().map((item) => {
				return {
					cartonGrossWeight: item.cartonGrossWeight,
					cartonNetWeight: item.cartonNetWeight,
					outCartonSpecHeight: item.outCartonSpecHeight,
					outCartonSpecLength: item.outCartonSpecLength,
					outCartonSpecWidth: item.outCartonSpecWidth,
				};
			}) || [],
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
			const updatedData = getTableData().map((item, index) => {
				return {
					...item,
					...res.data.cartonSpecs[index],
				};
			});
			// 更新单位字段
			updatedData.forEach((item) => {
				item.outCartonSpecUnit = isMetric ? 'cm' : 'inch';
				item.cartonGrossWeightUnit = isMetric ? 'kg' : 'lb';
				item.cartonNetWeightUnit = isMetric ? 'kg' : 'lb';
			});
			// 更新表格数据
			setTableData(updatedData);
		}

		return true;
		// oxlint-disable-next-line no-unused-vars
	} catch (error) {
		return false;
	}
}
export function useUnitConverter() {
	// 缓存结构：map[unitType][inputKey] = { length, width, height }
	const conversionCache = ref<any>({
		'1': [] as Record<string, Record<string, string>>[],
		'2': [] as Record<string, Record<string, string>>[],
	});
	/**
 * 根据单位类型自动转换指定字段的值
 * @param {string} newVal - '1' 表示公制，'2' 表示英制

 */
	async function autoConvertUnitFields(
		newVal: string,
		getTableData: () => Array<any>,
		setTableData: (data: Array<any>) => void
	) {
		// 构建查询参数
		const isMetric = newVal === '1';
		const fromUnit = isMetric ? '2' : '1'; // 原单位
		const toUnit = isMetric ? '1' : '2'; // 目标单位

		// 先检查缓存是否有值
		if (conversionCache.value[newVal]?.length) {
			if (newVal === '1') {
				const cachedData = conversionCache.value['1'];
				const updatedData = getTableData().map((item, index) => {
					return {
						...item,
						...cachedData[index],
						outCartonSpecUnit: 'cm',
						cartonGrossWeightUnit: 'kg',
						cartonNetWeightUnit: 'kg',
					};
				});
				setTableData(updatedData);
			} else if (newVal === '2') {
				const cachedData = conversionCache.value['2'];
				const updatedData = getTableData().map((item, index) => {
					return {
						...item,
						...cachedData[index],
						outCartonSpecUnit: 'inch',
						cartonGrossWeightUnit: 'lb',
						cartonNetWeightUnit: 'lb',
					};
				});
				setTableData(updatedData);
			}
			return true;
		}

		// 构建请求参数
		const payload: Record<string, string | Array<Record<string, any>>> = {
			cartonSpecs:
				getTableData().map((item) => {
					return {
						cartonGrossWeight: item.cartonGrossWeight,
						cartonNetWeight: item.cartonNetWeight,
						outCartonSpecHeight: item.outCartonSpecHeight,
						outCartonSpecLength: item.outCartonSpecLength,
						outCartonSpecWidth: item.outCartonSpecWidth,
					};
				}) || [],
			fromCartonUnitType: fromUnit,
			toCartonUnitType: toUnit,
		};

		// 发送请求进行单位转换
		try {
			// 根据 newVal 判断转换方向，先缓存当前值，再发起转换请求 请求完成之后再缓存转换后的值
			// 然后只要不清除缓存，下次切换就能直接用缓存的值

			if (newVal === '1') {
				conversionCache.value['2'] = getTableData().map((item) => ({
					...item,
				}));
				const res = await cartonUnitConvert(payload);
				if (res?.code !== 0) {
					return false;
				}

				// 成功后，将 res.data 中的 cartonSpecs 写回表格数据
				if (res.data && Array.isArray(res.data.cartonSpecs)) {
					const updatedData = getTableData().map((item, index) => {
						return {
							...item,
							...res.data.cartonSpecs[index],
						};
					});
					// 更新单位字段
					updatedData.forEach((item) => {
						item.outCartonSpecUnit = isMetric ? 'cm' : 'inch';
						item.cartonGrossWeightUnit = isMetric ? 'kg' : 'lb';
						item.cartonNetWeightUnit = isMetric ? 'kg' : 'lb';
					});
					// 更新表格数据
					setTableData(updatedData);
					// 缓存转换后的值
					conversionCache.value['1'] = updatedData.map((item) => ({
						...item,
					}));
				}

				return true;
			} else if (newVal === '2') {
				conversionCache.value['1'] = getTableData().map((item) => ({
					...item,
				}));
				const res = await cartonUnitConvert(payload);
				if (res?.code !== 0) {
					return false;
				}

				// 成功后，将 res.data 中的 cartonSpecs 写回表格数据
				if (res.data && Array.isArray(res.data.cartonSpecs)) {
					const updatedData = getTableData().map((item, index) => {
						return {
							...item,
							...res.data.cartonSpecs[index],
						};
					});
					// 更新单位字段
					updatedData.forEach((item) => {
						item.outCartonSpecUnit = isMetric ? 'cm' : 'inch';
						item.cartonGrossWeightUnit = isMetric ? 'kg' : 'lb';
						item.cartonNetWeightUnit = isMetric ? 'kg' : 'lb';
					});
					// 更新表格数据
					setTableData(updatedData);
					// 缓存转换后的值
					conversionCache.value['2'] = updatedData.map((item) => ({
						...item,
					}));
					return true;
				}
			}
			// oxlint-disable-next-line no-unused-vars
		} catch (error) {
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
			'1': [] as Record<string, Record<string, string>>[],
			'2': [] as Record<string, Record<string, string>>[],
		};
	};
	/**
	 * 失去焦点比对是否变化，变化则清除缓存
	 */
	const handleBlurClearCache = (
		type: string,
		value: any,
		key: string | number,
		index: string | number
	) => {
		if (type === '1') {
			const cachedValue = conversionCache.value['1'][index]?.[key];
			if (cachedValue !== undefined && cachedValue !== value) {
				clearConversionCache();
			}
		} else if (type === '2') {
			const cachedValue = conversionCache.value['2'][index]?.[key];
			if (cachedValue !== undefined && cachedValue !== value) {
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
