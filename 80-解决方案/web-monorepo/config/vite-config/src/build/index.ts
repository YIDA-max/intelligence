/*
 * @Author: YIDA 3136271519@qq.com
 * @Date: 2025-11-27 14:14:53
 * @LastEditors: wuyueqin wuyueqin@merach.com
 * @LastEditTime: 2026-03-02 11:14:34
 * @FilePath: \qianyi-ui\config\vite-config\src\build\index.ts
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
import type { BuildOptions } from 'vite';
import { execSync } from 'child_process';

export const defaultBuild = (
	isDev: boolean,
	options: { customBuild: BuildOptions | any }
): BuildOptions => {
	const manualChunkMap = {
		vue: ['vue', 'vue-router', 'pinia'],
		element: ['element-plus'],
		'form-create': ['form-create-designer'],
		'v-calendar': ['v-calendar'],
		'vxe-table': ['vxe-table'],
		'vxe-pc-ui': ['vxe-pc-ui'],
		echarts: [
			'echarts/core',
			'echarts/charts',
			'echarts/components',
			'echarts/renderers',
		],
		lodash: ['lodash'],
		dayjs: ['dayjs'],
		i18n: ['vue-i18n'],
		wangeditor: ['@wangeditor/editor', '@wangeditor/editor-for-vue'],
		...(options.customBuild?.rollupOptions?.output?.manualChunks || {}),
	} as Record<string, string[]>;

	const manualChunks = (id: string) => {
		for (const [chunkName, packages] of Object.entries(manualChunkMap)) {
			if (
				packages.some((pkgName) => id.includes(`/node_modules/${pkgName}/`))
			) {
				return chunkName;
			}
		}
		return undefined;
	};

	// 构建时生成版本文件（在 Vite 构建开始前执行）
	if (!isDev) {
		try {
			// console.log('==================== 生成版本文件 ====================');
			execSync('node scripts/generate-version.js', { stdio: 'inherit' });
		} catch (error) {
			// console.error('❌ 生成版本文件失败:', error);
		}
	}
	const build: BuildOptions = {
		outDir: 'html', // 打包输出目录
		chunkSizeWarningLimit: 1500, // 代码分包阈值（降低以更早发现问题）
		reportCompressedSize: false, // 关键：隐藏压缩大小报告，减少内存占用
		// 降低内存：使用 esbuild 代替 terser（esbuild 内存占用更少，速度更快）
		// 现在为了降低内存占用，先使用esbuild
		minify: (isDev ? 'esbuild' : 'esbuild') as 'terser' | 'esbuild',
		cssMinify: 'esbuild',
		sourcemap: false, // 不生成 sourcemap，减少内存和磁盘占用
		// 注意：使用 esbuild 时，terserOptions 不会生效
		// 如果需要使用 terser，需要设置 minify: 'terser'
		// esbuild 会自动删除 console 和 debugger，无需额外配置
		// terserOptions先注释掉，后续再优化，现在为了降低内存占用，先使用esbuild
		// terserOptions: isDev
		// 	? undefined
		// 	: {
		// 			compress: {
		// 				drop_console: true, // 删除 console
		// 				drop_debugger: true, // 删除 debugger
		// 			},
		// 			format: {
		// 				comments: false, // 删除所有注释
		// 			},
		// 	  },
		// 自定义 Rollup 打包配置
		rollupOptions: {
			output: {
				// 自定义输出文件名和分包策略
				entryFileNames: `assets/[name].[hash].js`,
				chunkFileNames: `assets/[name].[hash].js`,
				assetFileNames: `assets/[name].[hash].[ext]`,
				manualChunks,
			},
		},
		...options.customBuild, // 允许完全自定义 build 配置
	};
	return build;
};
