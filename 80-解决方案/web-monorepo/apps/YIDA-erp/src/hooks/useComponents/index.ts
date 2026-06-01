/*
 * @Author: YIDA 3136271519@qq.com
 * @Date: 2026-01-07 18:47:18
 * @LastEditors: YIDA 3136271519@qq.com
 * @LastEditTime: 2026-01-08 10:02:13
 * @FilePath: \qianyi-ui\src\hooks\useComponents\index.ts
 * @Description:
 *
 * Copyright (c) 2026 by ${git_name_email}, All Rights Reserved.
 */
/**
 * 注册和管理全局组件的钩子
 * @returns
 */
const useComponents = () => {
	{
		// 这里可以添加一些逻辑来管理组件的注册或配置
		const registerComponent = (app: any, component: any) => {
			app.component(component.name, component);
		};
		/**
		 * 动态注册组件
		 */
		const dynamicRegisterComponent = (app: any, component: any) => {
			app.component(component.name, component);
		};
		return {
			registerComponent,
			dynamicRegisterComponent,
		};
	}
};
export { useComponents };
