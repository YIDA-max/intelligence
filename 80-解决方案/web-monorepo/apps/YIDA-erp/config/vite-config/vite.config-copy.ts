/// <reference path="../../src/types/external.d.ts" />
/* eslint-disable no-console */
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';
import { defineConfig, loadEnv, ConfigEnv, Plugin, ResolvedConfig } from 'vite';
import vueSetupExtend from 'vite-plugin-vue-setup-extend';
import AutoImport from 'unplugin-auto-import/vite';
import topLevelAwait from 'vite-plugin-top-level-await';
import {
	createStyleImportPlugin,
	VxeTableResolve,
} from 'vite-plugin-style-import';
import viteCompression from 'vite-plugin-compression';
// @ts-ignore
import { svgBuilder } from '/@/components/IconSelector/index';
import { visualizer } from 'rollup-plugin-visualizer';
import { createWriteStream, existsSync, rmSync, readdirSync } from 'node:fs';
import dns from 'node:dns';
dns.setDefaultResultOrder('verbatim');

const pathResolve = (dir: string) => {
	return resolve(__dirname, '.', dir);
};

const zipAfterBuildPlugin = (): Plugin => {
	let resolvedConfig: ResolvedConfig | null = null;

	return {
		name: 'zip-after-build',
		apply: 'build',
		configResolved(config) {
			resolvedConfig = config;
		},
		async closeBundle() {
			if (!resolvedConfig) return;
			const { root, build } = resolvedConfig;
			const outDir = build.outDir || 'dist';
			const outputDir = resolve(root, outDir);
			if (!existsSync(outputDir)) {
				console.warn(`[zip-after-build] 构建目录不存在: ${outputDir}`);
				return;
			}
			const pad = (value: number) => value.toString().padStart(2, '0');
			const now = new Date();
			const timestamp = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(
				now.getDate()
			)}-${pad(now.getHours())}${pad(now.getMinutes())}${pad(
				now.getSeconds()
			)}`;
			const zipFileName = `${outDir}-${timestamp}.zip`;
			const zipPath = resolve(root, zipFileName);
			const existingZips = readdirSync(root).filter(
				(file) => file.startsWith(`${outDir}`) && file.endsWith('.zip')
			);
			for (const file of existingZips) {
				const filePath = resolve(root, file);
				if (existsSync(filePath)) {
					rmSync(filePath);
				}
			}
			const archiverModule = await import('archiver');
			const archiverFactory =
				(
					archiverModule as typeof import('archiver') & {
						default?: typeof import('archiver');
					}
				).default ?? archiverModule;

			await new Promise<void>((resolvePromise, rejectPromise) => {
				const output = createWriteStream(zipPath);
				const archive = archiverFactory('zip', { zlib: { level: 9 } });
				output.on('close', () => resolvePromise());
				output.on('error', rejectPromise);
				archive.on('error', rejectPromise);
				archive.pipe(output);
				archive.directory(outputDir, false);
				archive.finalize();
			});

			console.log(`打包目录已压缩: ${zipPath}`);
		},
	};
};

const alias: Record<string, string> = {
	'/@': pathResolve('./src/'),
	'vue-i18n': 'vue-i18n/dist/vue-i18n.cjs.js',
};

const viteConfig = defineConfig((mode: ConfigEnv) => {
	// 加载环境变量
	const env = loadEnv(mode.mode, process.cwd());
	// 如果是开发就不需要改请求源
	const isChangeOrigin = mode.mode === 'development' ? false : true;
	// 如果是生产就不需要校验证书
	const isSecure = mode.mode === 'development' ? false : true;
	// 解析代理配置，假设 VITE_ADMIN_PROXY_INFO 是一个包含代理配置的 JSON 字符串
	const adminProxyInfo = JSON.parse(env.VITE_ADMIN_PROXY_INFO || '[]');
	const portArg = process.argv[3]; // 获取端口号，比如 8888
	const info = adminProxyInfo.find(
		(item: any) => item.port === Number(portArg)
	);
	// 判断是否开发环境
	const isDev = mode.mode === 'development' ? true : false;
	const args = process.argv.slice(2);
	const isAnalyze = args.includes('analyze') || args.includes('report');
	const modeName =
		mode.mode === 'development'
			? '开发环境'
			: mode.mode === 'production'
			? '生产环境'
			: mode.mode === 'analyze'
			? '打包分析环境'
			: mode.mode === 'docker'
			? 'Docker 生产环境'
			: '未知环境';
	console.log('==================== 环境变量 ====================');
	console.log('mode:', mode.mode);
	console.log('当前环境:', modeName);
	console.log('是否开启打包分析', isAnalyze);
	console.log('当前传入的参数', args);
	console.log('当前执行的 npm 脚本命令', process.env.npm_lifecycle_event);
	console.log('传入的端口号:', portArg);
	console.log('当前匹配的值:', info);
	// 根据传入的端口号和匹配信息决定使用哪个配置，没有传入则使用默认配置
	const port = portArg && info ? info.port : env.VITE_PORT;
	const playPath = portArg && info ? info.path : env.VITE_ADMIN_PROXY_PATH;
	return {
		plugins: [
			vue(), // Vue 插件
			svgBuilder('./src/assets/icons/'), // 将 SVG 文件转换成 Vue 组件
			vueSetupExtend(), // setup语法糖增强插件
			AutoImport({
				imports: ['vue', 'vue-router', 'pinia'], // 自动导入的依赖库数组
				dts: './auto-imports.d.ts', // 自动导入类型定义文件路径
			}),
			createStyleImportPlugin({
				resolves: [VxeTableResolve()], // 配置vxetable 按需加载
			}),
			topLevelAwait({
				promiseExportName: '__tla', // TLA Promise 变量名
				promiseImportName: (i) => `__tla_${i}`, // TLA Promise 导入名
			}),
			viteCompression({
				deleteOriginFile: false, // 压缩后删除原来的文件
			}),
			zipAfterBuildPlugin(),
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
		resolve: { alias }, // 路径别名配置
		base: mode.command === 'serve' ? './' : env.VITE_PUBLIC_PATH,
		optimizeDeps: {
			include: [
				'element-plus/es/locale/lang/zh-cn',
				'element-plus/es/locale/lang/en',
				'dayjs',
			],
		},
		server: {
			host: '0.0.0.0', // 服务器地址
			port: port as unknown as number, // 服务器端口号
			open: env.VITE_OPEN === 'true', // 是否自动打开浏览器
			hmr: true, // 启用热更新
			proxy: {
				'/api': {
					target: playPath, // 目标服务器地址（可能无协议也没关系）
					ws: true, // 是否启用 WebSocket
					changeOrigin: isChangeOrigin, // 是否修改请求源 // 如果是正式环境就需要改为false
					secure: isSecure, // 忽略证书验证 // 如果是正式环境就需要改为false
					rewrite: (path) => {
						const t = String(playPath || '');
						const is8888 = /(?:^|:)(8888)(?:\/|$)/.test(t); // 目标地址端口是否为 8888
						return is8888 ? path : path.replace(/^\/api(?=\/|$)/, '');
					},
				},

				'^/ws/info/.*': {
					target: playPath, // 目标服务器地址
					ws: true, // 是否启用 WebSocket
					changeOrigin: true,
				},
			},
		},
		build: {
			outDir: 'html', // 打包输出目录
			chunkSizeWarningLimit: 1500, // 代码分包阈值
			// 开发使用 esbuild 更快，生产环境打包使用 terser 可以删除更多注释
			minify: (isDev ? 'esbuild' : 'terser') as 'terser' | 'esbuild',
			terserOptions: {
				compress: {
					drop_console: true, // 删除 console
					drop_debugger: true, // 删除 debugger
				},
				format: {
					comments: false, // 删除所有注释
				},
			},
			rollupOptions: {
				output: {
					entryFileNames: `assets/[name].[hash].js`,
					chunkFileNames: `assets/[name].[hash].js`,
					assetFileNames: `assets/[name].[hash].[ext]`,
					compact: true,
					manualChunks: {
						vue: ['vue', 'vue-router', 'pinia'],
						echarts: ['echarts'],
					},
				},
			},
		},
		css: {
			devSourcemap: isDev,
			preprocessorOptions: { css: { charset: false } },
		},
		define: {
			__VUE_I18N_LEGACY_API__: JSON.stringify(false),
			__VUE_I18N_FULL_INSTALL__: JSON.stringify(false),
			__INTLIFY_PROD_DEVTOOLS__: JSON.stringify(false),
			__VERSION__: JSON.stringify(process.env.npm_package_version),
			__NEXT_NAME__: JSON.stringify(process.env.npm_package_name),
		},
	};
});

export default viteConfig;
