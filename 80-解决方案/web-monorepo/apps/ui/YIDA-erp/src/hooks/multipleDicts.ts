/*
 * @Author: 朱寒松 3136271519@qq.com
 * @Date: 2025-07-11 10:07:28
 * @LastEditors: wuyueqin wuyueqin@merach.com
 * @LastEditTime: 2026-03-27 14:26:28
 * @FilePath: \qianyi-ui\src\hooks\multipleDicts.ts
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
// composables/useMultipleDicts.ts
import { ref, onMounted } from 'vue';
import { useIntersectionObserver } from '@vueuse/core';
import debounce from 'lodash/debounce';
import type { DebouncedFunc } from 'lodash';
type DictFetchConfig = {
	key: string; // 返回结果的字段名
	fetchFn: ((params?: any) => Promise<any>) | (() => Promise<any>); // 接口请求函数，支持有参和无参
	params?: any; // 接口参数（可选，如果 fetchFn 需要参数时使用）
	callback?: (data: any[]) => any[]; // 可选的数据处理回调函数
};
/**
 * 用于批量获取字典数据的组合式函数
 * @param configs 字典配置数组
 * @param configs[].key 返回结果的字段名
 * @returns
 */
export function useMultipleDicts(
	configs: DictFetchConfig[],
	options?: {
		isAuto?: boolean; // 是否自动加载，默认true
		tableRef?: any; // 可选的表格引用
	}
) {
	const loading = ref(false);
	const dictMap = ref<Record<string, any[]>>({});
	const fetchAll = async () => {
		loading.value = true;
		const result: Record<string, any[]> = {};
		await Promise.all(
			configs.map(async ({ key, fetchFn, params, callback }) => {
				try {
					const res = await fetchFn(params);
					if (res.code === 0) {
						result[key] = res.data || [];
						if (callback) {
							result[key] = callback(res.data) || [];
						}
					} else {
						result[key] = [];
					}
				} catch (err) {
					result[key] = [];
				}
			})
		);
		dictMap.value = result;
		loading.value = false;
	};
	/** 防抖：适合输入/筛选等高频触发场景 */
	const fetchAllDebounced: DebouncedFunc<() => void> = debounce(
		() => {
			void fetchAll(); // lodash 包装后不返回 Promise，这里用 void 吞掉
		},
		1000,
		{ leading: false, trailing: true } // 最常用配置：只在停止触发后执行一次
	);
	if (!(options?.isAuto === false)) {
		// ✅ 改为创建时立即执行（不依赖外部生命周期）
		fetchAllDebounced();
	}
	onMounted(() => {
		if (options?.tableRef?.value) {
			// 监听表格是否进入可视区域，进入则触发加载数据
			useIntersectionObserver(
				options?.tableRef?.value ? options.tableRef.value : null,
				([entry]) => {
					if (entry.isIntersecting) {
						fetchAllDebounced();
					}
				}
			);
		}
	});
	/**
	 *
	 * @param key 字典的key
	 * @returns 字典的值 或者 null
	 */
	const getDictMapValueByKey = async (key: string) => {
		if (dictMap.value[key]) {
			return dictMap.value[key];
		} else {
			await new Promise<void>((resolve) => {
				let attemptCount = 0;
				const maxAttempts = 10;
				const intervalId = setInterval(() => {
					attemptCount++;
					if (dictMap.value[key]) {
						clearInterval(intervalId);
						resolve();
					} else if (attemptCount >= maxAttempts) {
						// 达到最大尝试次数，停止等待
						clearInterval(intervalId);
						resolve();
					}
				}, 500);
			});
			// 返回数据，如果10次后还没有则返回 undefined
			return dictMap.value[key] || null;
		}
	};
	return {
		loading,
		dictMap,
		reload: fetchAllDebounced,
		getDictMapValueByKey,
	};
}
