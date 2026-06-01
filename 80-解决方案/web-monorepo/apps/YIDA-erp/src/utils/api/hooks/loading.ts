/*
 * @Author: YIDA 3136271519@qq.com
 * @Date: 2025-11-11 20:20:16
 * @LastEditors: YIDA zhuhansong@merach.com
 * @LastEditTime: 2026-05-06 18:18:07
 * @FilePath: \qianyi-ui\src\utils\api\hooks\loading.ts
 * @Description: Loading 加载状态管理钩子
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
import { ElLoading } from 'element-plus';
import { AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { createApp, h } from 'vue';
import MrCurveLoader from '/@/common/MrCurveLoader';
import { CURVE_NAMES } from '/@/utils/curveLoader';

// Loading 配置接口
export interface ILoadingConfig {
	loading?: boolean; // 是否显示 loading
	text?: string; // loading 文案
	background?: string; // loading 背景色
}

// 请求 URL 映射表（用于追踪每个请求的 loading 状态）
interface ILoadingRequest {
	loadingInstance: ReturnType<typeof ElLoading.service>;
	timer: number | null;
	unmount?: () => void;
}
const useLoadingInterceptors = () => {
	// 使用 Map 管理多个并发请求的 loading 状态
	const loadingMap = new Map<string, ILoadingRequest>();
	// 最大超时时间（60秒），作为兜底方案防止 loading 永久存在
	const MAX_TIMEOUT = 60000;

	/**
	 * 将 MrCurveLoader 挂载到 ElLoading 的 spinner 容器中
	 */
	const mountCurveLoader = (args: {
		loadingInstance: ReturnType<typeof ElLoading.service>;
		text: string;
	}): (() => void) => {
		const rootEl = (args.loadingInstance as any)?.$el as
			| HTMLElement
			| undefined;
		const spinnerEl = rootEl?.querySelector?.('.el-loading-spinner') as
			| HTMLElement
			| undefined;
		if (!rootEl || !spinnerEl) {
			return () => undefined;
		}

		// 隐藏 Element Plus 默认的 spinner（避免与自定义组件叠加）
		const circularEl = spinnerEl.querySelector(
			'.circular'
		) as HTMLElement | null;
		if (circularEl) {
			circularEl.style.display = 'none';
		}

		// 若 ElLoading 传了 text，会生成 .el-loading-text，这里隐藏改由自定义内容渲染
		const defaultTextEl = spinnerEl.querySelector(
			'.el-loading-text'
		) as HTMLElement | null;
		if (defaultTextEl) {
			defaultTextEl.style.display = 'none';
		}

		const container = document.createElement('div');
		container.className = 'mr-curve-loading-container';
		container.style.display = 'flex';
		container.style.flexDirection = 'column';
		container.style.alignItems = 'center';
		container.style.justifyContent = 'center';
		container.style.gap = '10px';
		container.style.padding = '8px 12px';
		spinnerEl.appendChild(container);

		const app = createApp({
			render() {
				/**
				 * 随机取一个曲线样式（本次 loading 固定一次），避免每次渲染/动画帧都变化导致抖动
				 */
				const randomCurveName =
					CURVE_NAMES[Math.floor(Math.random() * CURVE_NAMES.length)];
				return h(
					'div',
					{
						style: {
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
							justifyContent: 'center',
							gap: '10px',
						},
					},
					[
						h(MrCurveLoader, {
							name: randomCurveName,
							size: 92,
							color: 'var(--el-color-primary)',
							showPath: true,
							pathOpacity: 0.08,
						}),
						h(
							'div',
							{
								style: {
									fontSize: '13px',
									lineHeight: '1.2',
									color: 'var(--el-text-color-regular)',
									textAlign: 'center',
								},
							},
							args.text
						),
					]
				);
			},
		});

		app.mount(container);

		return () => {
			app.unmount();
			container.remove();
		};
	};

	/**
	 * 生成请求的唯一标识
	 * @param config - 请求配置
	 * @returns 请求唯一标识
	 */
	const getRequestKey = (config: InternalAxiosRequestConfig): string => {
		const { method = 'get', url = '', params } = config;
		// 使用 method + url + 参数的 JSON 字符串作为唯一标识
		const paramsStr = params ? JSON.stringify(params) : '';
		return `${method.toUpperCase()}:${url}:${paramsStr}`;
	};

	/**
	 * 关闭指定请求的 loading
	 * @param requestKey - 请求唯一标识
	 */
	const closeLoading = (requestKey: string): void => {
		const loadingRequest = loadingMap.get(requestKey);
		if (loadingRequest) {
			// 清除超时定时器
			if (loadingRequest.timer) {
				clearTimeout(loadingRequest.timer);
			}
			loadingRequest.unmount?.();
			// 关闭 loading 实例
			loadingRequest.loadingInstance?.close();
			// 从 Map 中删除
			loadingMap.delete(requestKey);
		}
	};

	/**
	 * 请求拦截器 - 开启加载中效果
	 * - 支持多个并发请求各自的 loading
	 * - 自动添加超时保护，防止 loading 永久存在
	 *
	 * @param config - Axios 请求配置
	 * @returns 请求配置
	 */
	const loadingRequestInterceptors = (
		config: InternalAxiosRequestConfig
	): InternalAxiosRequestConfig => {
		// 检查是否需要显示 loading
		const loadingConfig = (config as any).loadingConfig as
			| ILoadingConfig
			| undefined;

		if (loadingConfig?.loading) {
			const requestKey = getRequestKey(config);

			// 如果该请求已经有 loading，先关闭旧的
			if (loadingMap.has(requestKey)) {
				closeLoading(requestKey);
			}

			// 创建新的 loading 实例
			const loadingInstance = ElLoading.service({
				lock: true,
				// 文案交由自定义组件渲染，避免 Element Plus 默认结构影响布局
				text: '',
				background: loadingConfig.background || 'rgba(255, 255, 255, 0.7)',
			});
			const unmount = mountCurveLoader({
				loadingInstance,
				text: loadingConfig.text || '加载中...',
			});

			// 设置超时保护（最坏情况：60秒后自动关闭）
			const timer = window.setTimeout(() => {
				closeLoading(requestKey);
			}, MAX_TIMEOUT);

			// 保存到 Map
			loadingMap.set(requestKey, {
				loadingInstance,
				timer,
				unmount,
			});
		}

		return config;
	};

	/**
	 * 响应拦截器 - 关闭加载中效果
	 * - 请求成功响应时立即关闭 loading
	 *
	 * @param response - Axios 响应对象
	 * @returns 响应对象
	 */
	const loadingResponseInterceptors = (
		response: AxiosResponse<any>
	): AxiosResponse<any> => {
		const requestKey = getRequestKey(response.config);
		// 请求结束，立即关闭对应的 loading
		closeLoading(requestKey);
		return response;
	};

	/**
	 * 请求错误拦截器 - 关闭加载中效果
	 * - 请求出错时也要关闭 loading
	 *
	 * @param error - 错误对象
	 */
	const loadingErrorInterceptors = (error: any): void => {
		// 处理错误响应的 loading 关闭
		if (error?.config) {
			const requestKey = getRequestKey(error.config);
			closeLoading(requestKey);
		} else if (error?.response?.config) {
			// 兼容不同的错误格式
			const requestKey = getRequestKey(error.response.config);
			closeLoading(requestKey);
		} else {
			// 最坏情况：关闭所有 loading
			loadingMap.forEach((_, key) => {
				closeLoading(key);
			});
		}
	};
	return {
		loadingRequestInterceptors,
		loadingResponseInterceptors,
		loadingErrorInterceptors,
	};
};
export { useLoadingInterceptors };
