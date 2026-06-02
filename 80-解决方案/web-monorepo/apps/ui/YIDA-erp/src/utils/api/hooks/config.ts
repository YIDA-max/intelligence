/* eslint-disable no-console */
/*
 * @Author: YIDA 3136271519@qq.com
 * @Date: 2025-11-12 09:52:03
 * @LastEditors: YIDA zhuhansong@merach.com
 * @LastEditTime: 2026-04-13 15:45:33
 * @FilePath: \qianyi-ui\src\utils\api\hooks\config.ts
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
import { Session } from '/@/utils/storage';
import axios, { InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import other from '/@/utils/other';
import {
	wrapEncryption,
	encryptRequestParams,
	apiDecrypt,
} from '/@/utils/apiCrypto';
import { useMessage, useMessageBox } from '/@/hooks/message';

// 常用 Header 枚举
export enum CommonHeaderEnum {
	'TENANT_ID' = 'TENANT-ID',
	'ENC_FLAG' = 'Enc-Flag',
	'AUTHORIZATION' = 'Authorization',
	'VERSION' = 'VERSION',
}

// HTTP 状态码常量
export const HTTP_STATUS = {
	// 客户端错误 4xx
	BAD_REQUEST: 400, // 请求参数错误
	UNAUTHORIZED: 401, // 未授权
	FORBIDDEN: 403, // 禁止访问
	NOT_FOUND: 404, // 资源不存在
	METHOD_NOT_ALLOWED: 405, // 方法不允许
	REQUEST_TIMEOUT: 408, // 请求超时
	PAYLOAD_TOO_LARGE: 413, // 请求体过大
	TOO_MANY_REQUESTS: 429, // 请求过多
	// 特殊状态码
	DEMO_MODE: 423, // 演示模式
	TOKEN_EXPIRED: 424, // Token 过期
	TENANT_EXPIRED: 426, // 租户过期
	// 服务端错误 5xx
	SERVER_ERROR: 500, // 服务器错误
	BAD_GATEWAY: 502, // 网关错误
	SERVICE_UNAVAILABLE: 503, // 服务不可用
	GATEWAY_TIMEOUT: 504, // 网关超时
} as const;

// 业务状态码常量
export const BUSINESS_CODE = {
	SUCCESS: 0, // 成功
	// 客户端错误 4xx
	BAD_REQUEST: 400, // 请求参数错误
	UNAUTHORIZED: 401, // 未授权
	FORBIDDEN: 403, // 禁止访问
	NOT_FOUND: 404, // 资源不存在
	METHOD_NOT_ALLOWED: 405, // 方法不允许
	REQUEST_TIMEOUT: 408, // 请求超时
	PAYLOAD_TOO_LARGE: 413, // 请求体过大
	TOO_MANY_REQUESTS: 429, // 请求过多
	// 特殊状态码
	DEMO_MODE: 423, // 演示模式
	TOKEN_EXPIRED: 424, // Token 过期
	TENANT_EXPIRED: 426, // 租户过期
	// 服务端错误 5xx
	SERVER_ERROR: 500, // 服务器错误
	BAD_GATEWAY: 502, // 网关错误
	SERVICE_UNAVAILABLE: 503, // 服务不可用
	GATEWAY_TIMEOUT: 504, // 网关超时
	// 自定义错误码
	NETWORK_ERROR: -1, // 网络错误
	UNKNOWN_ERROR: -2, // 未知错误
	REQUEST_CANCELED: -3, // 请求取消
} as const;

// 统一响应数据接口
export interface IResponse<T = any> {
	code: number;
	data: T;
	msg: string;
	traceId?: string;
}

// 错误响应数据接口（用于内部错误处理）
export interface IErrorResponse {
	status: number | null;
	message: string;
	code?: number;
	msg?: string;
	error?: string;
	detail?: string;
	isNetworkError?: boolean;
	isConfigOrLogicError?: boolean;
	internal?: boolean;
	originalError?: any;
}
const useConfig = () => {
	/**
	 * 从响应数据中提取错误消息
	 * @param data - 响应数据
	 * @param defaultMsg - 默认错误消息
	 * @returns 错误消息字符串
	 */
	const extractErrorMessage = (data: any, defaultMsg: string): string => {
		if (typeof data === 'object' && data !== null) {
			return (
				data.msg || data.message || data.error || data.detail || defaultMsg
			);
		}
		if (typeof data === 'string') {
			return data || defaultMsg;
		}
		return defaultMsg;
	};

	/**
	 * 根据 HTTP 状态码获取友好的错误提示信息
	 * @param status - HTTP 状态码
	 * @returns 错误提示消息
	 */
	const getStatusMessage = (status: number): string => {
		const statusMessages: Record<number, string> = {
			// 4xx 客户端错误
			[HTTP_STATUS.BAD_REQUEST]: '请求参数错误，请检查输入',
			[HTTP_STATUS.UNAUTHORIZED]: '未授权，请先登录',
			[HTTP_STATUS.FORBIDDEN]: '没有权限访问该资源',
			[HTTP_STATUS.NOT_FOUND]: '请求的资源不存在',
			[HTTP_STATUS.METHOD_NOT_ALLOWED]: '不支持该请求方法',
			[HTTP_STATUS.REQUEST_TIMEOUT]: '请求超时，请稍后重试',
			[HTTP_STATUS.PAYLOAD_TOO_LARGE]: '请求数据过大',
			[HTTP_STATUS.TOO_MANY_REQUESTS]: '请求过于频繁，请稍后再试',
			// 5xx 服务端错误
			[HTTP_STATUS.SERVER_ERROR]: '服务器内部错误',
			[HTTP_STATUS.BAD_GATEWAY]: '网关错误',
			[HTTP_STATUS.SERVICE_UNAVAILABLE]: '服务暂时不可用',
			[HTTP_STATUS.GATEWAY_TIMEOUT]: '网关超时',
		};

		return statusMessages[status] || `请求失败 (${status})`;
	};

	/**
	 * 从 headers 中尽可能兼容地提取 traceId
	 */
	const getTraceIdFromHeaders = (headers: any): string => {
		if (!headers) return '';
		// axios v1 可能是 AxiosHeaders（有 get 方法），也可能是普通对象
		if (typeof headers.get === 'function') {
			return (
				headers.get('traceid') ||
				headers.get('traceId') ||
				headers.get('TraceId') ||
				headers.get('trace-id') ||
				headers.get('Trace-Id') ||
				''
			);
		}
		return (
			headers.traceid ??
			headers.traceId ??
			headers.TraceId ??
			headers['trace-id'] ??
			headers['Trace-Id'] ??
			''
		);
	};

	/**
	 * 从错误对象中提取 traceId（兼容 header / response.data）
	 */
	const extractTraceId = (error: any): string => {
		const fromHeaders = getTraceIdFromHeaders(error?.response?.headers);
		if (fromHeaders) return String(fromHeaders);
		const data = error?.response?.data;
		return (
			data?.traceId ??
			data?.traceid ??
			data?.TraceId ??
			data?.['trace-id'] ??
			''
		);
	};

	/**
	 * 请求拦截器
	 * - 添加认证 Token
	 * - 添加租户 ID
	 * - 添加灰度版本
	 * - 请求参数加密
	 * - URL 适配
	 */
	const requestInterceptors = (
		config: InternalAxiosRequestConfig
	): InternalAxiosRequestConfig => {
		config.headers['VERSION'] = 'A'; // 目标版本

		// 统一增加Authorization请求头, skipToken 跳过增加token
		const token = Session.getToken();
		if (token && !config.headers?.skipToken) {
			config.headers![CommonHeaderEnum.AUTHORIZATION] = `Bearer ${token}`;
		}

		// 统一增加TENANT-ID请求头
		const tenantId = Session.getTenant();
		if (tenantId) {
			config.headers![CommonHeaderEnum.TENANT_ID] = tenantId;
		}

		// 增加 gray_version 请求头
		const version = import.meta.env.VITE_GRAY_VERSION;
		if (version) {
			config.headers![CommonHeaderEnum.VERSION] = version;
		}

		// 请求报文加密 ，如果请求头中不包含 ENC_FLAG ： false 则加密
		if (config.data && !config.headers![CommonHeaderEnum.ENC_FLAG]) {
			config.data = wrapEncryption(config.data);
		}

		// 如果是 GET ，加密 config.param 的每一个参数，并URLencode
		if (config.method === 'get' && config.params) {
			config.params = encryptRequestParams(config.params);
		}

		// 自动适配单体和微服务架构不同的URL
		config.url = other.adaptationUrl(config.url);

		return config;
	};
	/**
	 * 响应拦截器
	 * - 全局错误信息拦截
	 * - 响应数据解密
	 */
	const responseInterceptors = (response: AxiosResponse): AxiosResponse => {
		// 全局错误信息拦截
		if (response?.data?.code && response?.data?.code !== 0) {
			useMessage().error(response?.data?.msg || '请求失败，请联系管理员解决');
		}
		// 针对密文返回解密
		if (response.data.encryption) {
			response.data = apiDecrypt(response.data.encryption);
		}

		return response;
	};
	/**
	 * 响应错误拦截器
	 * - 处理请求取消
	 * - 处理特殊状态码（423/424/426）
	 * - 响应数据解密
	 * - 返回统一格式 { code, data, msg }
	 */
	const responseErrorInterceptors = (error: any): Promise<IResponse> => {
		const traceId = extractTraceId(error);
		try {
			// 关键：判断错误是否为取消请求（CanceledError）
			if (axios.isCancel(error)) {
				// 如果是取消请求导致的错误，静默处理
				console.warn('防抖请求,请求被取消：', error.message);
				return Promise.resolve({
					code: BUSINESS_CODE.REQUEST_CANCELED,
					data: null,
					msg: '请求已取消',
					traceId: traceId || undefined,
				});
			}

			const status = Number(error?.response?.status) || 200;

			// 进行状态码拦截处理 - 演示模式
			if (status === HTTP_STATUS.DEMO_MODE) {
				return Promise.resolve({
					code: BUSINESS_CODE.DEMO_MODE,
					data: null,
					msg: '演示环境，仅供预览',
					traceId: traceId || undefined,
				});
			}

			// Token 过期
			if (status === HTTP_STATUS.TOKEN_EXPIRED) {
				useMessageBox()
					.confirm('令牌状态已过期，请点击重新登录')
					.then(() => {
						Session.clear(); // 清除浏览器全部临时缓存
						window.location.href = '/'; // 去登录页
					})
					.catch(() => {
						// 用户取消操作
					});
				return Promise.resolve({
					code: BUSINESS_CODE.TOKEN_EXPIRED,
					data: null,
					msg: '令牌状态已过期',
					traceId: traceId || undefined,
				});
			}

			// 租户过期
			if (status === HTTP_STATUS.TENANT_EXPIRED) {
				useMessageBox()
					.confirm('租户状态已过期，请联系管理员')
					.then(() => {
						Session.clear(); // 清除浏览器全部临时缓存
					})
					.catch(() => {
						// 用户取消操作
					});
				return Promise.resolve({
					code: BUSINESS_CODE.TENANT_EXPIRED,
					data: null,
					msg: '租户状态已过期',
					traceId: traceId || undefined,
				});
			}

			// 针对密文返回解密
			if (error.response?.data?.encryption) {
				error.response.data = apiDecrypt(error.response?.data.encryption);
			}

			// 继续传递错误到 handleErrorCode 统一处理
			return Promise.reject(error);
		} catch (err) {
			console.error('响应错误拦截器异常：', err);
			return Promise.resolve({
				code: BUSINESS_CODE.UNKNOWN_ERROR,
				data: null,
				msg: `意料之外的错误: ${err}`,
				traceId: traceId || undefined,
			});
		}
	};
	/**
	 * 统一处理 HTTP 错误码的函数
	 * - 对 4xx 客户端错误进行全局 warning 提示（如 400/401/403/404 等）
	 * - 对 5xx 服务端错误进行全局 error 提示
	 * - 网络错误、超时等特殊情况也会提示
	 * - 所有情况都返回统一格式 { code, data, msg }
	 *
	 * @param error - Axios 或其他请求库抛出的错误对象
	 * @returns Promise<IResponse> - 返回统一格式的错误信息
	 */
	const handleErrorCode = (error: any): Promise<IResponse> => {
		// 初始化默认状态码和消息
		let status: number | null = null;
		let errorMessage = '未知错误，请稍后再试';

		try {
			// 尝试从响应里面获取到 traceId（可能有，也可能没有）
			const traceId = extractTraceId(error);

			// 情况 1：Axios 请求收到响应（即服务器返回了 HTTP 响应）
			if (error?.response) {
				const { response } = error;
				status = response.status;

				// 尝试从响应体中获取错误消息
				errorMessage = extractErrorMessage(
					response.data,
					'服务器内部错误，请稍后再试'
				);

				// 如果后端已经返回了标准格式 { code, data, msg }，直接使用
				if (
					response.data &&
					typeof response.data === 'object' &&
					'code' in response.data &&
					'msg' in response.data
				) {
					// 仅对 5xx 或业务错误码非 0 进行全局提示
					if (
						(status !== null && status >= HTTP_STATUS.SERVER_ERROR) ||
						response.data.code !== 0
					) {
						useMessage().error(
							(response.data.msg || errorMessage) +
								(traceId ? `,Traceid:[${traceId}]` : '')
						);
					}
					return Promise.resolve({
						code: response.data.code,
						data: response.data.data || null,
						msg: response.data.msg || errorMessage,
						traceId: traceId || undefined,
					});
				}

				// 如果没有标准格式，构造统一格式
				if (!status) {
					console.error('无法获取响应状态码');
					return Promise.resolve({
						code: BUSINESS_CODE.UNKNOWN_ERROR,
						data: null,
						msg: '无法获取响应状态码',
						traceId: traceId || undefined,
					});
				}

				// 获取友好的状态码提示信息
				const statusMessage = getStatusMessage(status);
				// 优先使用后端返回的错误消息，如果没有则使用状态码对应的默认消息
				const finalMessage =
					(errorMessage !== '服务器内部错误，请稍后再试'
						? errorMessage
						: statusMessage) + (traceId ? `,Traceid:[${traceId}]` : '');
				// 对 5xx 服务端错误进行全局提示
				if (status >= HTTP_STATUS.SERVER_ERROR) {
					useMessage().error(finalMessage);
					return Promise.resolve({
						code: status,
						data: response.data || null,
						msg: finalMessage,
						traceId: traceId || undefined,
					});
				}

				// 对常见的 4xx 客户端错误也进行全局提示
				if (status >= 400 && status < 500) {
					// 使用 warning 级别提示 4xx 错误
					useMessage().warning(finalMessage);
					console.warn('客户端错误响应：', { status, message: finalMessage });
					return Promise.resolve({
						code: status,
						data: response.data || null,
						msg: finalMessage,
						traceId: traceId || undefined,
					});
				}

				// 其他状态码
				console.warn('错误响应：', { status, message: finalMessage });
				return Promise.resolve({
					code: status,
					data: response.data || null,
					msg: finalMessage,
					traceId: traceId || undefined,
				});
			}

			// 情况 2：请求发出但未收到响应（如网络错误、超时、DNS 失败等）
			if (error?.request) {
				console.warn('网络或超时错误：', error.message || error);
				errorMessage = '网络连接异常，请检查网络后重试';
				return Promise.resolve({
					code: BUSINESS_CODE.NETWORK_ERROR,
					data: null,
					msg: errorMessage,
					traceId: traceId || undefined,
				});
			}

			// 情况 3：其他非请求类错误（如配置错误、手动 throw 等）
			errorMessage = error?.message || '请求配置错误或未知异常';
			console.error('非请求类错误：', error);
			return Promise.resolve({
				code: BUSINESS_CODE.UNKNOWN_ERROR,
				data: null,
				msg: errorMessage,
				traceId: traceId || undefined,
			});
		} catch (unexpectedError) {
			// 极端兜底：防止 handleErrorCode 自身崩溃
			const fallbackMsg = `错误处理器内部异常: ${
				unexpectedError instanceof Error
					? unexpectedError.message
					: String(unexpectedError)
			}`;
			console.error(fallbackMsg, {
				originalError: error,
				internalError: unexpectedError,
			});
			useMessage().error('系统异常，请联系管理员');
			return Promise.resolve({
				code: BUSINESS_CODE.SERVER_ERROR,
				data: null,
				msg: '系统异常',
				traceId: undefined,
			});
		}
	};
	return {
		requestInterceptors,
		responseInterceptors,
		responseErrorInterceptors,
		handleErrorCode,
	};
};
export { useConfig };
