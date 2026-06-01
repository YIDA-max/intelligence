/*
 * @Author: YIDA zhuhansong@merach.com
 * @Date: 2026-04-11 17:07:05
 * @LastEditors: YIDA zhuhansong@merach.com
 * @LastEditTime: 2026-04-11 19:55:48
 * @FilePath: \qianyi-ui\src\utils\api\hooks\requestBodyToQueryParameters\index.ts
 * @Description:
 *
 * Copyright (c) 2026 by ${git_name_email}, All Rights Reserved.
 */
import type { AxiosRequestConfig } from 'axios';
const useRequestBodyToQueryParameters = () => {
	/**
	 * 请求拦截器 - 将请求参数转换为query参数
	 */
	const requestBodyToQueryParametersRequestInterceptors = (
		config: AxiosRequestConfig
	) => {
		//  如果是post请求，并且请求参数是对象，并且里面有ascs或者descs，则将他们转换为query参数
		//   如果是post请求，并且请求参数是对象，并且里面有current或者size，则将他们转换为query参数
		if (
			(config.method === 'post' &&
				config.data &&
				typeof config.data === 'object' &&
				(config.data?.ascs || config.data?.descs)) ||
			config.data?.current ||
			config.data?.size
		) {
			config.url = `${config.url}?ascs=${config.data?.ascs ?? ''}&descs=${
				config.data?.descs ?? ''
			}&current=${config.data?.current ?? 1}&size=${config.data?.size ?? 10}`;
		}
	};
	return {
		requestBodyToQueryParametersRequestInterceptors,
	};
};
export { useRequestBodyToQueryParameters };
