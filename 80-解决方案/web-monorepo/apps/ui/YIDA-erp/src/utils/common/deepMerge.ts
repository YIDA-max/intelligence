/*
 * @Author: wuyueqin wuyueqin@merach.com
 * @Date: 2026-02-14 14:14:00
 * @LastEditors: wuyueqin wuyueqin@merach.com
 * @LastEditTime: 2026-04-22 10:35:12
 * @FilePath: \qianyi-ui\src\utils\common\deepMerge.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
/**
 * 深度合并两个对象，source 的属性会覆盖 target 的同名属性。
 * 与 Object.assign / 展开运算符不同，遇到两边都是普通对象的属性时会递归合并，
 * 而不是直接用 source 的值整体替换 target 的值。
 *
 * 处理规则：
 *  - 普通对象（非数组、非函数）：递归深合并
 *  - 数组、函数、基本类型：source 直接覆盖 target
 *  - source 中值为 undefined 的属性：保留 target 原值，不覆盖
 *
 * @param target 目标对象（基础值）
 * @param source 来源对象（优先级更高，其属性会覆盖 target）
 * @returns 合并后的新对象（不修改原始 target）
 */
export function deepMerge<T extends Record<string, any>>(
	target: T,
	source: Partial<T>
): T {
	// 浅拷贝 target，避免直接修改原对象
	const result = { ...target };

	for (const key in source) {
		// 只处理 source 自身的属性，跳过原型链上的属性
		if (Object.prototype.hasOwnProperty.call(source, key)) {
			const sourceValue = source[key];
			const targetValue = result[key];

			// 判断两边的值是否都是"普通对象"（排除 null、数组、函数）
			// 满足条件时递归合并，保留 target 中 source 未覆盖的嵌套属性
			if (
				sourceValue &&
				typeof sourceValue === 'object' &&
				!Array.isArray(sourceValue) && // 数组直接覆盖，不递归
				!isFunction(sourceValue) && // 函数直接覆盖，不递归
				targetValue &&
				typeof targetValue === 'object' &&
				!Array.isArray(targetValue) &&
				!isFunction(targetValue)
			) {
				// 两边都是普通对象 → 递归深合并
				result[key] = deepMerge(targetValue, sourceValue);
			} else if (sourceValue !== undefined) {
				// source 有明确值（非 undefined）→ 直接覆盖
				// undefined 则跳过，保留 target 原值
				result[key] = sourceValue as any;
			}
		}
	}

	return result;
}

function isFunction(value: any): boolean {
	return typeof value === 'function';
}
