/*
 * @Author: YIDA 3136271519@qq.com
 * @Date: 2025-07-07 10:17:26
 * @LastEditors: YIDA 3136271519@qq.com
 * @LastEditTime: 2025-12-04 19:48:05
 * @FilePath: \qianyi-ui\src\types\axios.d.ts
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
/* eslint-disable */
import * as axios from 'axios';

// 扩展 axios 数据返回类型，可自行扩展
declare module 'axios' {
	// 扩展 AxiosResponse 接口，定义统一的响应数据格式
	export interface AxiosResponse<T = any> {
		code: number;
		data: T;
		message: string;
		type?: string;
		[key: string]: T;
	}
	// 扩展 AxiosRequestConfig 接口，添加防抖配置
	export interface AxiosRequestConfig {
		debounceConfig?: {
			// 防抖配置
			enable: boolean; // 是否启用防抖
			delay: number; // 防抖延迟时间(ms)
		};
		loadingConfig?: {
			loading: boolean; // 是否开启loading效果
			text?: string; // loading文案
			background?: string; // loading背景色
		};
		mockConfig?: {
			enable: boolean; // 是否开启mock
			url?: string; // mock接口地址
			data: unknown; // mock数据
		};
	}
}
