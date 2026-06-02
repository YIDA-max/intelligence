/*
 * @Author: YIDA 3136271519@qq.com
 * @Date: 2025-12-01 20:30:18
 * @LastEditors: YIDA 3136271519@qq.com
 * @LastEditTime: 2025-12-02 17:28:28
 * @FilePath: \qianyi-ui\config\vite-config\src\plugins\zipAfterBuildPlugin.ts
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
/// <reference path="../../../../src/types/external.d.ts" />
/* eslint-disable no-console */
import { Plugin, ResolvedConfig } from 'vite';
// @ts-ignore
import { createWriteStream, existsSync, rmSync, readdirSync } from 'node:fs';
import dns from 'node:dns';
import { resolve, join } from 'node:path';
import {
	existsSync,
	readdirSync,
	rmSync,
	mkdirSync,
	createWriteStream,
	cpSync, // 👈 用于递归拷贝
} from 'node:fs';
dns.setDefaultResultOrder('verbatim');
export const zipAfterBuildPlugin = (): Plugin => {
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

			// 使用 VITE_APP_ENV 判断环境
			const appEnv = process.env.VITE_APP_ENV || '';
			const isProd = appEnv.includes('prod');
			const modeSuffix = isProd ? '-prod' : '-dev';

			const zipFileName = `${outDir}-${timestamp}${modeSuffix}.zip`;
			const zipPath = resolve(root, zipFileName);

			// 清理旧 ZIP
			const existingZips = readdirSync(root).filter(
				(file) => file.startsWith(`${outDir}-`) && file.endsWith('.zip')
			);
			for (const file of existingZips) {
				const filePath = resolve(root, file);
				if (existsSync(filePath)) {
					rmSync(filePath);
				}
			}

			// 👇 创建临时目录结构：.temp-zip-xxx/html/
			const tempBaseDir = resolve(root, `.temp-zip-${Date.now()}`);
			const htmlDirInZip = join(tempBaseDir, 'html');

			try {
				// 创建临时父目录和 html 子目录
				mkdirSync(htmlDirInZip, { recursive: true });
				// 递归拷贝 outputDir → htmlDirInZip
				cpSync(outputDir, htmlDirInZip, { recursive: true });

				// 👇 添加以下调试代码：查看临时目录内容
				console.log(`[ZIP DEBUG] 临时目录内容 (htmlDirInZip):`);
				const files = readdirSync(htmlDirInZip, { withFileTypes: true });
				files.forEach((file) => {
					const type = file.isDirectory() ? '📁' : '📄';
					console.log(`  ${type} ${file.name}`);

					// 如果是文件夹，可以进一步查看内部内容（可选）
					if (file.isDirectory()) {
						const subFiles = readdirSync(join(htmlDirInZip, file.name));
						console.log(`    子内容: ${subFiles.length} 个文件`);
					}
				});

				// 动态导入 archiver
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

					// ⚠️ 关键：压缩 tempBaseDir（里面只有 html/ 目录）
					// 第二个参数 false 表示不保留 tempBaseDir 自身，只压入其内容（即 html/）
					archive.directory(tempBaseDir, false);

					archive.finalize();
				});

				console.log(`打包目录已压缩: ${zipPath}`);
			} finally {
				// 清理临时目录（即使出错也清理）
				if (existsSync(tempBaseDir)) {
					rmSync(tempBaseDir, { recursive: true, force: true });
				}
			}
		},
	};
};
