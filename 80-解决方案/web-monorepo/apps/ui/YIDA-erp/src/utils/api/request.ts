/*
 * @Author: YIDA 3136271519@qq.com
 * @Date: 2025-11-11 20:20:16
 * @LastEditors: wuyueqin wuyueqin@merach.com
 * @LastEditTime: 2026-04-21 10:18:44
 * @FilePath: \qianyi-ui\src\utils\api\request.ts
 * @Description: Axios 请求实例配置 - 统一封装 HTTP 请求
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
import axios, {
	AxiosInstance,
	AxiosResponse,
	InternalAxiosRequestConfig,
	AxiosRequestConfig,
} from 'axios';
import qs from 'qs';
import { useMessage } from '/@/hooks/message';
import {
	useLoadingInterceptors,
	useDebounceInterceptors,
	useDownload,
	useConfig,
	useRequestBodyToQueryParameters,
} from '/@/utils/api/hooks';
import type { ILoadingConfig } from '/@/utils/api/hooks/loading';
import type { IDebounceConfig } from '/@/utils/api/hooks/pending';

// 扩展 Axios 请求配置类型，添加自定义配置
declare module 'axios' {
	export interface InternalAxiosRequestConfig {
		loadingConfig?: ILoadingConfig; // Loading 配置
		debounceConfig?: IDebounceConfig; // 防抖配置
	}
}

// 请求超时时间常量
const REQUEST_TIMEOUT = 600000; // 10分钟

/**
 * ============================================
 * 初始化所有拦截器
 * ============================================
 */

// 1. Loading 加载状态拦截器
const {
	loadingRequestInterceptors,
	loadingResponseInterceptors,
	loadingErrorInterceptors,
} = useLoadingInterceptors();

// 2. 防抖拦截器（防止重复请求）
const {
	debounceRequestInterceptors,
	debounceResponseInterceptors,
	debounceErrorInterceptors,
} = useDebounceInterceptors();

// 3. 文件下载拦截器
const { downloadFile } = useDownload();

// 4. 通用配置拦截器（认证、加密、错误处理等）
const {
	requestInterceptors,
	responseInterceptors,
	responseErrorInterceptors,
	handleErrorCode,
} = useConfig();

// 特殊的请求拦截
const { requestBodyToQueryParametersRequestInterceptors } =
	useRequestBodyToQueryParameters();
/**
 * ============================================
 * 创建 Axios 实例
 * ============================================
 */
const service: AxiosInstance = axios.create({
	baseURL: import.meta.env.VITE_API_URL, // API 基础地址
	timeout: REQUEST_TIMEOUT, // 全局超时时间
	// 参数序列化配置（GET 请求）
	paramsSerializer: {
		serialize: (params: any) => {
			// 使用 repeat 格式：ids=1&ids=2&ids=3
			return qs.stringify(params, { arrayFormat: 'repeat' });
		},
	},
});

/**
 * ============================================
 * 请求拦截器
 * ============================================
 * 处理流程（按顺序执行）：
 * 1. 通用配置（添加 Token、租户 ID、加密参数等）
 * 2. Loading 状态（显示加载动画）
 * 3. 防抖处理（短时间内复用重复请求结果）
 */
service.interceptors.request.use(
	(config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
		// GET 请求参数过长拦截
		if (config.method?.toLowerCase() === 'get' && config.params) {
			const queryString = qs.stringify(config.params, {
				arrayFormat: 'repeat',
			});
			if (queryString.length > 3000) {
				useMessage().warning('请求过长，请减少查询条件');
				return Promise.reject(new Error('请求参数过长被拦截')) as any;
			}
		}

		// 处理请求参数转换为query参数(特殊的请求拦截器,后台要求的)
		requestBodyToQueryParametersRequestInterceptors(
			config as AxiosRequestConfig
		);

		// 1. 处理通用请求配置
		//    - 添加 Authorization 和 TENANT-ID 请求头
		//    - 加密请求参数
		//    - 适配单体/微服务架构 URL
		requestInterceptors(config);

		// 2. 处理 Loading 加载状态
		//    - 根据 loadingConfig 显示全局 loading
		loadingRequestInterceptors(config);

		// 3. 处理防抖
		//    - 根据 debounceConfig 复用短时间内重复请求的结果
		const processedConfig = debounceRequestInterceptors(config);

		return processedConfig;
	},
	(error: any): Promise<never> => {
		// 请求配置阶段出错（极少见）
		loadingErrorInterceptors(error);
		debounceErrorInterceptors(error);
		return Promise.reject(error);
	}
);

/**
 * ============================================
 * 响应拦截器 - 成功处理
 * ============================================
 * 处理流程（按顺序执行）：
 * 1. 通用响应处理（错误提示、解密数据等）
 * 2. 文件下载处理
 * 3. 关闭 Loading 状态
 * 4. 清理防抖记录
 * 5. 返回响应数据
 *
 * @param response - Axios 响应对象
 * @returns 响应数据（response.data）
 */
const handleResponse = (response: AxiosResponse<any>): any => {
	// 1. 通用响应处理
	//    - 全局错误信息拦截（code !== 0）
	//    - 解密响应数据
	responseInterceptors(response);

	// 2. 文件下载处理
	//    - 检测 Blob 响应并触发下载
	downloadFile(response);

	// 3. 关闭 Loading 加载状态
	loadingResponseInterceptors(response);

	// 4. 清理防抖记录
	const finalResponse = debounceResponseInterceptors(response);

	// 5. 返回响应数据
	return finalResponse.data;
};

/**
 * ============================================
 * 响应拦截器 - 错误处理
 * ============================================
 * 处理流程（按顺序执行）：
 * 1. 特殊状态码处理（423/424/426）
 * 2. 关闭 Loading 状态
 * 3. 清理防抖记录
 * 4. 统一错误码处理（返回 { code, data, msg }）
 *
 * @param error - 错误对象
 * @returns Promise<IResponse> - 统一格式的错误响应
 */
const handleResponseError = async (error: any): Promise<any> => {
	try {
		// 1. 特殊状态码处理
		//    - 423: 演示模式
		//    - 424: Token 过期
		//    - 426: 租户过期
		responseErrorInterceptors(error);

		// 2. 关闭 Loading 加载状态
		loadingErrorInterceptors(error);

		// 3. 清理防抖记录
		debounceErrorInterceptors(error);

		// 4. 统一错误码处理
		//    - 4xx: 客户端错误（warning 提示）
		//    - 5xx: 服务端错误（error 提示）
		//    - 网络错误、超时等
		//    - 返回统一格式：{ code, data, msg }
		return await handleErrorCode(error);
	} catch (err) {
		// 极端兜底：防止错误处理器自身崩溃
		return Promise.reject(err);
	}
};

/**
 * ============================================
 * 注册响应拦截器
 * ============================================
 */
service.interceptors.response.use(handleResponse, handleResponseError);

// 导出 axios 实例
export default service;
