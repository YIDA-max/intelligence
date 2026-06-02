/*
 * @Author: YIDA 3136271519@qq.com
 * @Date: 2025-07-29 17:26:52
 * @LastEditors: YIDA 3136271519@qq.com
 * @LastEditTime: 2025-09-05 15:00:05
 * @FilePath: \qianyi-ui\src\hooks\nextTick.ts
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
import { nextTick, Ref } from 'vue';

/**
 * 等待所有 ref.value 挂载完成（非 undefined），直到超时
 * @param refs 要监听的 ref 列表
 * @param timeout 超时时间（毫秒），默认 5000ms
 * @param interval 检查间隔时间（毫秒），默认 30ms
 * @returns Promise<boolean> 是否在超时前全部准备好
 */
export const useWaitForRefsReady = async (refs: Ref<any>[], timeout = 5000, interval = 30): Promise<boolean> => {
	const start = Date.now();
	while (Date.now() - start < timeout) {
		await nextTick();
		const allReady = refs.every((r) => r.value !== undefined && r.value !== null);
		if (allReady) return true;

		await new Promise((resolve) => setTimeout(resolve, interval));
	}

	return false; // 超时未完成
};
