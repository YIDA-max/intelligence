/*
 * @Author: YIDA 3136271519@qq.com
 * @Date: 2025-11-11 20:20:16
 * @LastEditors: YIDA zhuhansong@merach.com
 * @LastEditTime: 2026-04-15 18:13:30
 * @FilePath: \qianyi-ui\src\utils\api\hooks\pending.ts
 * @Description: 请求防抖拦截器 - 防止短时间内重复请求
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */

import type {
	AxiosRequestConfig,
	AxiosResponse,
	InternalAxiosRequestConfig,
} from 'axios';
import { CanceledError } from 'axios';

// 防抖配置接口
export interface IDebounceConfig {
	enable?: boolean; // 是否启用防抖
	delay?: number; // 防抖延迟时间(ms)
	includeMethods?: string[]; // 包含的请求方法
}

// Pending 请求项接口
interface IPendingRequest {
	requestKey: string; // 请求唯一标识
	requestId: number; // 请求实例 ID，用于避免并发清理误删
	promise: Promise<AxiosResponse<any>>; // 存储“在途请求”的 Promise（供后续重复请求复用）
	resolve: (response: AxiosResponse<any>) => void;
	reject: (error: any) => void;
	timestamp: number;
}

interface IResolvedRequestCache {
	response: AxiosResponse<any>;
	timestamp: number;
}

type IDebounceInternalConfig = InternalAxiosRequestConfig & {
	// 内部标记：记录本次请求对应的 key/id，便于响应阶段精准清理
	__debounceRequestKey?: string;
	__debounceRequestId?: number;
};

// 默认防抖配置
const DEFAULT_DEBOUNCE_CONFIG: Required<IDebounceConfig> = {
	enable: false, // 是否启用防抖（仅当调用方明确开启才生效）
	delay: 500,
	includeMethods: ['get', 'post', 'put', 'delete', 'patch'],
};

const useDebounceInterceptors = () => {
	// 使用 Map 存储 pending 请求队列，key 为请求标识
	const pendingMap = new Map<string, IPendingRequest[]>();
	// 使用 Map 存储最近成功响应，用于短时间结果复用
	const resolvedMap = new Map<string, IResolvedRequestCache>();
	let requestIdSeed = 0;

	/**
	 * 创建可外部 resolve/reject 的 Promise
	 */
	const createDeferred = <T>() => {
		let resolve!: (value: T) => void;
		let reject!: (reason?: any) => void;
		const promise = new Promise<T>((res, rej) => {
			resolve = res;
			reject = rej;
		});
		return { promise, resolve, reject };
	};

	/**
	 * 获取指定 key 的最新 pending 请求
	 * 说明：同一个 key 可能有队列（例如超过 delay 后又发起了新请求）
	 */
	const getLatestPendingRequest = (
		requestKey: string
	): IPendingRequest | undefined => {
		const queue = pendingMap.get(requestKey);
		if (!queue?.length) {
			return undefined;
		}
		return queue[queue.length - 1];
	};

	/**
	 * 从队列中移除指定请求
	 * 说明：必须按 requestId 精准删除，避免并发场景下误删其他请求
	 */
	const removePendingRequest = (
		requestKey: string,
		requestId?: number
	): IPendingRequest | undefined => {
		const queue = pendingMap.get(requestKey);
		if (!queue?.length) {
			return undefined;
		}

		const index = queue.findIndex((item) => item.requestId === requestId);
		if (index < 0) {
			return undefined;
		}

		const [target] = queue.splice(index, 1);
		if (queue.length === 0) {
			pendingMap.delete(requestKey);
		} else {
			pendingMap.set(requestKey, queue);
		}

		return target;
	};

	/**
	 * 生成请求唯一标识
	 * @param config - 请求配置
	 * @returns 请求唯一标识字符串
	 * @description 格式: method&url&params&data
	 */
	const generateReqKey = (
		config: AxiosRequestConfig | InternalAxiosRequestConfig
	): string => {
		const { method, url, params, data } = config;
		return [
			method?.toLowerCase() || 'get',
			url || '',
			JSON.stringify(params || {}),
			JSON.stringify(data || {}),
		].join('&');
	};

	/**
	 * 请求拦截器 - 防抖处理
	 * - 在防抖时间窗口内复用已有请求 Promise（返回上一次结果）
	 * - 超出防抖窗口时创建新请求，不影响已在执行中的请求
	 * - 不再使用 abort 取消旧请求，而是通过 adapter 直接复用结果
	 * - 支持自定义防抖配置
	 *
	 * @param config - Axios 请求配置
	 * @returns 处理后的请求配置
	 */
	const debounceRequestInterceptors = (
		config: InternalAxiosRequestConfig
	): InternalAxiosRequestConfig => {
		// 只有调用方明确开启（enable === true）才启用“防重复/节流”逻辑
		const rawDebounceConfig = (config as any).debounceConfig as
			| IDebounceConfig
			| undefined;
		if (!rawDebounceConfig || rawDebounceConfig.enable !== true) {
			return config;
		}

		// 获取防抖配置，合并默认配置
		const debounceConfig: Required<IDebounceConfig> = {
			...DEFAULT_DEBOUNCE_CONFIG,
			...rawDebounceConfig,
			enable: true,
		};

		// 检查请求方法是否在包含列表中
		const method = config.method?.toLowerCase() || 'get';
		if (!debounceConfig.includeMethods.includes(method)) {
			return config;
		}

		const internalConfig = config as IDebounceInternalConfig;
		const requestKey = generateReqKey(config);
		const now = Date.now();

		// 命中最近成功缓存：直接返回上一次结果（覆盖串行重复请求场景）
		const resolvedCache = resolvedMap.get(requestKey);
		if (resolvedCache && now - resolvedCache.timestamp < debounceConfig.delay) {
			internalConfig.__debounceRequestKey = requestKey;
			// 关键：用自定义 adapter 截断真实 HTTP，下游拿到的是“伪造但合法”的 AxiosResponse Promise
			internalConfig.adapter = () => Promise.resolve(resolvedCache.response);
			return internalConfig;
		}

		// 检查是否存在相同的 pending 请求
		const existingRequest = getLatestPendingRequest(requestKey);
		if (existingRequest) {
			// 检查是否在防抖时间窗口内
			if (now - existingRequest.timestamp < debounceConfig.delay) {
				// 命中防抖窗口：复用已有请求 Promise，直接返回上一次请求结果
				internalConfig.__debounceRequestKey = requestKey;
				internalConfig.__debounceRequestId = existingRequest.requestId;
				// 关键：复用“在途请求 Promise”，不再触发第二次网络请求
				internalConfig.adapter = () => existingRequest.promise;
				return internalConfig;
			}
		}

		// 非复用场景：创建新的 Promise 挂载到 pendingMap
		const currentRequestId = ++requestIdSeed;
		const deferred = createDeferred<AxiosResponse<any>>();

		// 将新请求添加到 pendingMap
		const queue = pendingMap.get(requestKey) || [];
		queue.push({
			requestId: currentRequestId,
			promise: deferred.promise,
			resolve: deferred.resolve,
			reject: deferred.reject,
			timestamp: now,
			requestKey,
		});
		pendingMap.set(requestKey, queue);

		// 记录本次请求标记，供响应/错误阶段进行 requestId 级别的精准清理
		internalConfig.__debounceRequestKey = requestKey;
		internalConfig.__debounceRequestId = currentRequestId;
		return internalConfig;
	};

	/**
	 * 响应拦截器 - 清理已完成的请求
	 * - 请求成功响应后，从 pendingMap 中移除
	 *
	 * @param response - Axios 响应对象
	 * @returns 响应对象
	 */
	const debounceResponseInterceptors = (
		response: AxiosResponse<any>
	): AxiosResponse<any> => {
		const internalConfig = response.config as IDebounceInternalConfig;
		const requestKey =
			internalConfig.__debounceRequestKey || generateReqKey(response.config);
		const requestId = internalConfig.__debounceRequestId;

		const pendingRequest = removePendingRequest(requestKey, requestId);
		// 仅清理当前请求对应的记录，避免并发误删；同时唤醒复用该 Promise 的调用方
		if (pendingRequest) {
			pendingRequest.resolve(response);
		}
		// 成功结果写入短缓存：用于串行重复请求在 delay 时间内直接复用结果
		resolvedMap.set(requestKey, {
			response,
			timestamp: Date.now(),
		});

		return response;
	};

	/**
	 * 响应错误拦截器 - 清理错误请求
	 * - 请求失败或被取消时，从 pendingMap 中移除
	 *
	 * @param error - 错误对象
	 */
	const debounceErrorInterceptors = (error: any): void => {
		// 从 pendingMap 中删除失败的请求
		if (error?.config) {
			const internalConfig = error.config as IDebounceInternalConfig;
			const requestKey =
				internalConfig.__debounceRequestKey || generateReqKey(error.config);
			const requestId = internalConfig.__debounceRequestId;
			const pendingRequest = removePendingRequest(requestKey, requestId);

			if (pendingRequest) {
				// 错误也要透传给复用方，避免 Promise 悬挂
				pendingRequest.reject(error);
			}
		}

		// 注意：防抖取消的请求已在 config.ts 的 responseErrorInterceptors 中统一处理
		// 这里只负责清理 pendingMap
	};

	/**
	 * 手动清除所有 pending 请求
	 * - 取消所有正在进行的请求
	 * - 清空 pendingMap
	 * @description 可用于路由切换、用户登出等场景
	 */
	const clearAllPendingRequests = (): void => {
		pendingMap.forEach((queue) => {
			queue.forEach((request) => {
				try {
					// 主动 reject 统一为取消错误，兼容 axios.isCancel 分支
					request.reject(new CanceledError('手动取消所有 pending 请求'));
				} catch (error) {
					// 忽略取消请求时的错误
				}
			});
		});
		pendingMap.clear();
		// 同步清理短缓存，避免业务误读旧数据
		resolvedMap.clear();
	};

	/**
	 * 获取当前 pending 请求数量
	 * @returns pending 请求数量
	 */
	const getPendingCount = (): number => {
		return Array.from(pendingMap.values()).reduce(
			(total, queue) => total + queue.length,
			0
		);
	};

	/**
	 * 获取 pending 请求列表
	 * @returns 请求标识数组
	 */
	const getPendingRequests = (): string[] => {
		return Array.from(pendingMap.keys());
	};

	/**
	 * 取消指定的 pending 请求
	 * @param requestKey - 请求唯一标识
	 * @returns 是否成功取消
	 */
	const cancelPendingRequest = (requestKey: string): boolean => {
		const queue = pendingMap.get(requestKey);
		if (!queue?.length) {
			return false;
		}
		try {
			queue.forEach((pendingRequest) => {
				pendingRequest.reject(new CanceledError('手动取消指定请求'));
			});
			pendingMap.delete(requestKey);
			return true;
		} catch (error) {
			return false;
		}
	};

	/**
	 * 检查指定请求是否在 pending 中
	 * @param config - 请求配置
	 * @returns 是否在 pending 中
	 */
	const isPending = (
		config: AxiosRequestConfig | InternalAxiosRequestConfig
	): boolean => {
		const requestKey = generateReqKey(config);
		return pendingMap.has(requestKey);
	};

	return {
		// 拦截器
		debounceRequestInterceptors,
		debounceResponseInterceptors,
		debounceErrorInterceptors,
		// 工具方法
		clearAllPendingRequests,
		cancelPendingRequest,
		getPendingCount,
		getPendingRequests,
		isPending,
		generateReqKey,
	};
};

export { useDebounceInterceptors };
