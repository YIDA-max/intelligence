import type { AxiosInstance } from 'axios';
import type { DefineComponent } from 'vue';

declare module 'vue' {
	interface ComponentCustomProperties {
		baseURL: string;
		$http: AxiosInstance;
		$message: any; // 或更精确的类型
		$t: (key: string, ...args: any[]) => string;
	}
}
// 声明文件，*.vue 后缀的文件交给 vue 模块来处理
declare module '*.vue' {
	const component: DefineComponent<{}, {}, any>;
	export default component;
}
