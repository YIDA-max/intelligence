import axios, {
	AxiosInstance,
	AxiosResponse,
	InternalAxiosRequestConfig,
} from 'axios';
import { Session } from '/@/utils/storage';
import { useMessage, useMessageBox } from '/@/hooks/message';
import qs from 'qs';
import other from './other';
import { handleBlobFile } from '/@/utils/other';
import { wrapEncryption, encryptRequestParams, apiDecrypt } from './apiCrypto';
import { ElLoading } from 'element-plus';
// 定义扩展类型：AxiosInstance + loading 属性

let loading: ReturnType<typeof ElLoading.service> | null = null;
let url: string = '';
// 常用header
export enum CommonHeaderEnum {
	'TENANT_ID' = 'TENANT-ID',
	'ENC_FLAG' = 'Enc-Flag',
	'AUTHORIZATION' = 'Authorization',
	'VERSION' = 'VERSION',
}

/**
 * 创建并配置一个 Axios 实例对象
 */
const service: AxiosInstance = axios.create({
	baseURL: import.meta.env.VITE_API_URL,
	timeout: 120000, // 全局超时时间
	paramsSerializer: {
		serialize: (params: any) => {
			return qs.stringify(params, { arrayFormat: 'repeat' });
		},
	},
});

/**
 * Axios请求拦截器，对请求进行处理
 * 1. 序列化get请求参数
 * 2. 统一增加Authorization和TENANT-ID请求头
 * 3. 自动适配单体、微服务架构不同的URL
 * @param config AxiosRequestConfig对象，包含请求配置信息
 */
service.interceptors.request.use(
	(config: InternalAxiosRequestConfig) => {
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

		// 添加全局loading
		if (config.headers.loading && !url) {
			url = config?.url ? config?.url : '';
			loading = ElLoading.service({
				lock: true,
				text: 'Loading',
				background: 'rgba(255, 255, 255, 0.7)',
			});
			// 最多10秒，防止某些请求没有响应，loading一直存在
			setTimeout(() => {
				loading?.close();
				url = '';
			}, 10000);
		}

		// 处理完毕，返回config对象
		return config;
	},
	(error) => {
		// 对请求错误进行处理
		return Promise.reject(error);
	}
);

/**
 * 响应拦截器处理函数
 * @param response 响应结果
 * @returns 如果响应成功，则返回响应的data属性；否则，抛出错误或者执行其他操作
 */
const handleResponse = (response: AxiosResponse<any>) => {
	// if (response.data.code === 1) {
	// 	throw response.data;
	// }

	// 针对如果有的loading的请求,必须在最前面查询并且关闭
	if (url && response.config.url === url) {
		// 说明找到了对应的请求
		loading?.close();
		loading = null;
		url = '';
	}
	if (response?.data?.code && response?.data?.code !== 0) {
		useMessage().error(response?.data?.msg || '请求失败，请联系管理员解决');
		return response.data;
	}

	// 针对密文返回解密
	if (response.data.encryption) {
		response.data = apiDecrypt(response.data.encryption);
		return response.data;
	}
	// 判断这个请求是不是下载请求
	if (response.request.responseType === 'blob') {
		const contentDisposition = response.headers['content-disposition'];
		let fileName = '请联系管理员'; // 默认文件名
		// 提取文件名
		if (contentDisposition) {
			const matches = contentDisposition.match(/filename\*=utf-8''(.+)/);
			if (matches && matches[1]) {
				fileName = decodeURIComponent(matches[1]);
			} else {
				// 如果没有 utf-8 编码的文件名，尝试直接从 filename 中提取
				const filenameMatch = contentDisposition.match(/filename=(.+)/);
				if (filenameMatch && filenameMatch[1]) {
					fileName = decodeURIComponent(filenameMatch[1]);
				}
			}
		}
		// 处理下载逻辑
		handleBlobFile(response.data, fileName);
		return response.data; // 返回数据以便后续处理
	}

	return response.data;
};

/**
 * 添加 Axios 的响应拦截器，用于全局响应结果处理
 */
service.interceptors.response.use(handleResponse, (error) => {
	const status = Number(error.response.status) || 200;
	if (status === 423) {
		return Promise.reject({ msg: '"演示环境，仅供预览"' });
	}

	if (status === 424) {
		useMessageBox()
			.confirm('令牌状态已过期，请点击重新登录')
			.then(() => {
				Session.clear(); // 清除浏览器全部临时缓存
				window.location.href = '/'; // 去登录页
				return;
			});
	}

	if (status === 426) {
		useMessageBox()
			.confirm('租户状态已过期，请联系管理员')
			.then(() => {
				Session.clear(); // 清除浏览器全部临时缓存
				return;
			});
	}

	// 进行服务器异常拦截
	if (status === 500) {
		// 避免 error.response 为 undefined 的情况
		const errorMessage = error.response?.data?.msg || '接口异常，请稍后再试';
		useMessage().error(errorMessage);
		// 返回 reject，传递原始错误数据（可选，但推荐）
		return Promise.reject(error?.response?.data);
	}

	// 针对密文返回解密
	if (error.response?.data?.encryption) {
		error.response.data = apiDecrypt(error.response?.data.encryption);
	}
	// 针对如果有的loading的请求
	if (url && error.response.config.url === url) {
		// 说明找到了对应的请求
		loading?.close();
		loading = null;
		url = '';
	}
	return Promise.reject(error?.response?.data);
});

// 导出 axios 实例
export default service;
