import axios, { AxiosInstance } from 'axios';
import qs from 'qs';

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
const downService: AxiosInstance = axios.create({
	timeout: 50000, // 全局超时时间
	paramsSerializer: {
		serialize: (params: any) => {
			return qs.stringify(params, { arrayFormat: 'repeat' });
		},
	},
});

// 导出 axios 实例
export default downService;
