/*
 * @Author: YIDA 3136271519@qq.com
 * @Date: 2025-11-27 14:23:25
 * @LastEditors: YIDA 3136271519@qq.com
 * @LastEditTime: 2025-11-27 14:47:41
 * @FilePath: \qianyi-ui\config\vite-config\src\utils\alias.ts
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
import { resolve } from 'path';
// 路径解析
const pathResolve = (dir: string) => {
	return resolve(__dirname, '.', dir);
};
export const getAlias = (options: { customAlias: any }) => {
	return {
		'/@': pathResolve('../../../../src/'),
		'vue-i18n': 'vue-i18n/dist/vue-i18n.cjs.js',
		...options.customAlias, // 允许自定义覆盖
	};
};
