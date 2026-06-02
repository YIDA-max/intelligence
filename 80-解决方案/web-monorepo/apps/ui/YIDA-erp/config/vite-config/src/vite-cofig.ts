/*
 * @Author: YIDA 3136271519@qq.com
 * @Date: 2025-11-27 13:39:14
 * @LastEditors: YIDA zhuhansong@merach.com
 * @LastEditTime: 2026-03-19 18:19:50
 * @FilePath: \qianyi-ui\config\vite-config\src\vite-cofig.ts
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
/*
 * @Author: YIDA 3136271519@qq.com
 * @Date: 2025-11-27 13:39:14
 * @LastEditors: YIDA 3136271519@qq.com
 * @LastEditTime: 2025-11-27 14:23:12
 * @FilePath: \qianyi-ui\config\vite-config\src\vite-cofig.ts
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
/* eslint-disable no-console */
import vue from '@vitejs/plugin-vue';
import {
	ConfigEnv,
	Plugin,
	type UserConfig,
	defineConfig,
	// splitVendorChunkPlugin,
} from 'vite';
import vueSetupExtend from 'vite-plugin-vue-setup-extend';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import {
	createStyleImportPlugin,
	VxeTableResolve,
} from 'vite-plugin-style-import';
import viteCompression from 'vite-plugin-compression';
import { svgBuilder } from '../../../src/components/IconSelector/index';
import { visualizer } from 'rollup-plugin-visualizer';
import { getParams } from './utils/params';
import { getAlias } from './utils/alias';
import { defaultServer } from './server';
import { defaultBuild } from './build';
import { zipAfterBuildPlugin } from './plugins/zipAfterBuildPlugin';
import dns from 'node:dns';
// import basicSsl from '@vitejs/plugin-basic-ssl';

dns.setDefaultResultOrder('verbatim');

// 假设这些是你已有的配置
interface CustomPluginOptions {
	additionalPlugins?: Plugin[];
	customAlias?: Record<string, string>;
	customDefine?: Record<string, any>;
	customOptimizeDeps?: UserConfig['optimizeDeps'];
	customServer?: Partial<UserConfig['server']>;
	customBuild?: Partial<UserConfig['build']>;
	customCss?: Partial<UserConfig['css']>;
}

export const getConfig = (
	mode: ConfigEnv,
	options: CustomPluginOptions = {}
): UserConfig => {
	// 加载环境变量
	const { isDev, isAnalyze, port, playPath, isChangeOrigin, isSecure, env } =
		getParams(mode);
	// 获取路径别名
	const defaultAlias = getAlias({ customAlias: options.customAlias || {} });
	// 获取服务器配置
	const server = defaultServer(
		port,
		playPath,
		isChangeOrigin,
		isSecure,
		options
	);
	// 获取构建配置
	const build = defaultBuild(isDev, { customBuild: options.customBuild || {} });
	return {
		plugins: [
			// basicSsl(),
			vue(), // Vue 插件
			svgBuilder('./src/assets/icons/'), // 将 SVG 文件转换成 Vue 组件
			vueSetupExtend(), // setup语法糖增强插件
			AutoImport({
				imports: ['vue', 'vue-router', 'pinia'], // 自动导入的依赖库数组
				dts: './auto-imports.d.ts', // 自动导入类型定义文件路径
				...options.customDefine, // 允许自定义 AutoImport 配置
			}),
			Components({
				// 自动导入组件
				dirs: ['src/components', 'src/common'], // 指定组件所在目录
				// 使用扫描级过滤，排除示例文件和冲突来源组件
				globs: ['src/components/**/*.vue', 'src/common/**/*.vue'],
				globsExclude: [
					'src/common/**/example.vue',
					'src/components/Material/picker.vue',
					'src/components/TreeSelectInput/tree-select-input.vue',
					'src/components/Wechat/fileUpload/index.vue',
				],
				extensions: ['vue'], // 组件的有效文件扩展名
				dts: './components.d.ts', // 生成类型声明文件
				deep: true, // 搜索子目录
				resolvers: [], // 自定义解析器
			}),
			createStyleImportPlugin({
				resolves: [VxeTableResolve()], // 配置vxetable 按需加载
			}),
			viteCompression({
				deleteOriginFile: false, // 压缩后删除原来的文件
				verbose: false, // 隐藏压缩输出信息
			}),
			// 分包插件
			// splitVendorChunkPlugin({
			// 	include: ['vue', 'vue-router', 'pinia'],
			// 	exclude: ['vue-i18n'],
			// }),
			// 可以在这里添加更多插件
			...(options.additionalPlugins || []),
			isAnalyze &&
				visualizer({
					open: false, // 自动打开打包分析报告
					gzipSize: true, // 显示 gzip 大小
					brotliSize: true, // 显示 brotli 大小
					// 🎯 关键：指定图表类型（reporter）
					// 可选值：'treemap'（默认） | 'sunburst' | 'raw' 等
					// reporter: 'sunburst', // 或 'sunburst'
					// 可选：自定义输出文件名（默认是 stats.html）
					filename: './analysis/bundle-report.html',
				}),
		],
		root: process.cwd(), // 项目根目录
		resolve: {
			alias: defaultAlias, // 路径别名配置
		},
		base: mode.command === 'serve' ? './' : env.VITE_PUBLIC_PATH,
		optimizeDeps: {
			include: [
				'element-plus/es/locale/lang/zh-cn',
				'element-plus/es/locale/lang/en',
				'dayjs',
				...(options.customOptimizeDeps?.include || []),
			],
			...options.customOptimizeDeps,
		},
		server: server,
		build: build,
		css: {
			devSourcemap: isDev,
			preprocessorOptions: {
				scss: {
					silenceDeprecations: ['import', 'global-builtin', 'color-functions'],
				},
			},
			...options.customCss, // 允许自定义 CSS 配置
		},
		define: {
			__VUE_I18N_LEGACY_API__: JSON.stringify(false),
			__VUE_I18N_FULL_INSTALL__: JSON.stringify(false),
			__INTLIFY_PROD_DEVTOOLS__: JSON.stringify(false),
			__VERSION__: JSON.stringify(process.env.npm_package_version),
			__NEXT_NAME__: JSON.stringify(process.env.npm_package_name),
			...options.customDefine, // 允许自定义全局变量
		},
	};
};
