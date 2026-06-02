/*
 * @Author: YIDA 3136271519@qq.com
 * @Date: 2025-07-07 10:17:26
 * @LastEditors: wuyueqin wuyueqin@merach.com
 * @LastEditTime: 2026-05-21 17:20:14
 * @FilePath: \qianyi-ui\src\utils\request.ts
 * @Description: HTTP 请求服务类 - 封装常用请求方法，支持 Mock 数据
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */

import service from '/@/utils/api/request';
import type { AxiosRequestConfig } from 'axios';
import type { IResponse } from '/@/utils/api/hooks/config';
import { BUSINESS_CODE } from '/@/utils/api/hooks/config';

// Mock 配置接口
export interface IMockConfig {
	enable?: boolean; // 是否启用 Mock
	data?: any; // Mock 数据
}

// 扩展 Axios 请求配置类型，添加 Mock 配置
declare module 'axios' {
	export interface AxiosRequestConfig {
		mockConfig?: IMockConfig;
	}
}

// 导出 service 实例（用于直接调用）
export default service;

/**
 * 自动解包辅助类型：
 * 若调用方误将完整响应结构 { code, msg, data: D } 作为泛型 T 传入，
 * 自动提取内层 data 类型 D；否则 T 原样作为数据类型。
 * 这样 httpService.get<Xxx[]> 和 httpService.get<{code,msg,data:Xxx[]}> 均可正确推断。
 */
type UnwrapApiData<T> = T extends { code: number; msg: string; data: infer D }
	? D
	: T;

/**
 * HTTP 请求服务类
 * - 封装常用的 GET/POST/PUT/DELETE 方法
 * - 支持 Mock 数据（开发调试用）
 * - 统一错误处理
 * - 返回统一格式 { code, data, msg }
 */
class HttpService {
	/**
	 * 检查是否启用 Mock，并返回 Mock 数据
	 * @param config - 请求配置
	 * @returns Mock 数据或 null
	 */
	private getMockData<T = any>(
		config?: AxiosRequestConfig
	): IResponse<UnwrapApiData<T>> | null {
		if (config?.mockConfig?.enable && config.mockConfig.data !== undefined) {
			return {
				code: BUSINESS_CODE.SUCCESS,
				data: config.mockConfig.data,
				msg: 'Mock 数据返回成功',
			};
		}
		return null;
	}

	/**
	 * 统一的错误处理函数
	 * @param error - 错误对象
	 * @returns 统一格式的错误响应
	 */
	private handleError(error: any): IResponse<null> {
		// 如果错误已经是统一格式（来自拦截器），直接返回
		if (
			error &&
			typeof error === 'object' &&
			'code' in error &&
			'msg' in error
		) {
			return error as IResponse<null>;
		}

		// 否则包装成统一格式
		return {
			code: BUSINESS_CODE.UNKNOWN_ERROR,
			data: null,
			msg: (error as Error)?.message || '请求失败',
		};
	}
	/**
	 * GET 请求
	 * @param url - 请求地址
	 * @param config - 请求配置（可选）
	 * @returns Promise<IResponse<T>> - 统一格式的响应
	 */
	async get<T = any>(
		url: string,
		config?: AxiosRequestConfig
	): Promise<IResponse<UnwrapApiData<T>>> {
		try {
			// 2. 发起真实请求（响应拦截器会返回 response.data）
			const response = await service.get(url, { ...config });
			// 1. 检查是否启用 Mock
			const mockResult = this.getMockData<T>(config);
			if (mockResult) {
				return mockResult;
			}
			return response as unknown as IResponse<UnwrapApiData<T>>;
		} catch (error) {
			// 3. 统一错误处理（拦截器已处理，这里是兜底）
			return this.handleError(error) as IResponse<UnwrapApiData<T>>;
		}
	}
	/**
	 * POST 请求
	 * @param url - 请求地址
	 * @param data - 请求数据（可选）
	 * @param config - 请求配置（可选）
	 * @returns Promise<IResponse<T>> - 统一格式的响应
	 */
	async post<T = any>(
		url: string,
		data?: any,
		config?: AxiosRequestConfig
	): Promise<IResponse<UnwrapApiData<T>>> {
		// 1. 检查是否启用 Mock
		const mockResult = this.getMockData<T>(config);
		if (mockResult) {
			return mockResult;
		}

		try {
			// 2. 发起真实请求（响应拦截器会返回 response.data）
			const response = await service.post(url, data, config);
			return response as unknown as IResponse<UnwrapApiData<T>>;
		} catch (error) {
			// 3. 统一错误处理（拦截器已处理，这里是兜底）
			return this.handleError(error) as IResponse<UnwrapApiData<T>>;
		}
	}
	/**
	 * PUT 请求
	 * @param url - 请求地址
	 * @param data - 请求数据（可选）
	 * @param config - 请求配置（可选）
	 * @returns Promise<IResponse<T>> - 统一格式的响应
	 */
	async put<T = any>(
		url: string,
		data?: any,
		config?: AxiosRequestConfig
	): Promise<IResponse<UnwrapApiData<T>>> {
		// 1. 检查是否启用 Mock
		const mockResult = this.getMockData<T>(config);
		if (mockResult) {
			return mockResult;
		}

		try {
			// 2. 发起真实请求（响应拦截器会返回 response.data）
			const response = await service.put(url, data, config);
			return response as unknown as IResponse<UnwrapApiData<T>>;
		} catch (error) {
			// 3. 统一错误处理（拦截器已处理，这里是兜底）
			return this.handleError(error) as IResponse<UnwrapApiData<T>>;
		}
	}
	/**
	 * DELETE 请求
	 * @param url - 请求地址
	 * @param config - 请求配置（可选）
	 * @returns Promise<IResponse<T>> - 统一格式的响应
	 */
	async delete<T = any>(
		url: string,
		config?: AxiosRequestConfig
	): Promise<IResponse<UnwrapApiData<T>>> {
		// 1. 检查是否启用 Mock
		const mockResult = this.getMockData<T>(config);
		if (mockResult) {
			return mockResult;
		}

		try {
			// 2. 发起真实请求（响应拦截器会返回 response.data）
			const response = await service.delete(url, { ...config });
			return response as unknown as IResponse<UnwrapApiData<T>>;
		} catch (error) {
			// 3. 统一错误处理（拦截器已处理，这里是兜底）
			return this.handleError(error) as IResponse<UnwrapApiData<T>>;
		}
	}

	/**
	 * PATCH 请求
	 * @param url - 请求地址
	 * @param data - 请求数据（可选）
	 * @param config - 请求配置（可选）
	 * @returns Promise<IResponse<T>> - 统一格式的响应
	 */
	async patch<T = any>(
		url: string,
		data?: any,
		config?: AxiosRequestConfig
	): Promise<IResponse<UnwrapApiData<T>>> {
		// 1. 检查是否启用 Mock
		const mockResult = this.getMockData<T>(config);
		if (mockResult) {
			return mockResult;
		}

		try {
			// 2. 发起真实请求（响应拦截器会返回 response.data）
			const response = await service.patch(url, data, config);
			return response as unknown as IResponse<UnwrapApiData<T>>;
		} catch (error) {
			// 3. 统一错误处理（拦截器已处理，这里是兜底）
			return this.handleError(error) as IResponse<UnwrapApiData<T>>;
		}
	}
}

// 导出单例实例（推荐）或类本身
const httpService = new HttpService();

export { httpService };
