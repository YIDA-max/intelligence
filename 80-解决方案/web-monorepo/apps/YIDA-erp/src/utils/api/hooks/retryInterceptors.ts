/*
 * @Author: YIDA 3136271519@qq.com
 * @Date: 2025-11-13 17:57:24
 * @LastEditors: YIDA 3136271519@qq.com
 * @LastEditTime: 2025-11-13 18:10:09
 * @FilePath: \qianyi-ui\src\utils\api\hooks\retryInterceptors.ts
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
// src/utils/api/hooks/useRetryInterceptors.ts
import { AxiosRequestConfig } from 'axios';

interface RetryConfig {
	maxRetries: number;
	retryDelay: number;
	retryCondition?: (error: any) => boolean;
}

declare module 'axios' {
	interface AxiosRequestConfig {
		retryConfig?: RetryConfig;
		_retries?: number;
	}
}

// 默认重试配置
const defaultRetryConfig: RetryConfig = {
	maxRetries: 31,
	retryDelay: 1000,
	retryCondition: (error) => {
		// 默认只对网络错误或5xx服务器错误进行重试
		return !error.response || error.response.status >= 500;
	},
};

export function useRetryInterceptors() {
	/**
	 * 请求拦截器 - 初始化重试计数
	 */
	const retryRequestInterceptors = (config: AxiosRequestConfig) => {
		// 初始化重试次数
		if (config.retryConfig && !config._retries) {
			config._retries = 0;
		}
		return config;
	};

	/**
	 * 响应错误拦截器 - 处理重试逻辑
	 */
	const retryErrorInterceptors = async (error: any): Promise<any> => {
		const config = error.config;
		if (!config || !config.retryConfig) {
			return Promise.reject(error);
		}

		const retryConfig = { ...defaultRetryConfig, ...config.retryConfig };
		const retries = config._retries || 0;

		// 检查是否满足重试条件且未达到最大重试次数
		if (
			retries < retryConfig.maxRetries &&
			retryConfig.retryCondition!(error)
		) {
			config._retries = retries + 1;

			// 延迟重试
			await new Promise((resolve) =>
				setTimeout(resolve, retryConfig.retryDelay)
			);

			// 重新发起请求
			return Promise.resolve(config);
		}

		return Promise.reject(error);
	};

	return {
		retryRequestInterceptors,
		retryErrorInterceptors,
	};
}
