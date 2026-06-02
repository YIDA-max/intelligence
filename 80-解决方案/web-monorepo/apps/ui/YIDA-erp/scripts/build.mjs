#!/usr/bin/env node
/* eslint-disable no-console */

import { build } from 'vite';
import { resolve, join } from 'node:path';
import {
	existsSync,
	readdirSync,
	rmSync,
	mkdirSync,
	createWriteStream,
} from 'node:fs';
import { cpSync } from 'node:fs';
/**
 * 在构建完成后，将输出目录打包为 zip 文件，内部结构为 html/...
 *
 * @param root 项目根目录（通常是 process.cwd()）
 * @param outDir Vite 输出目录名（如 'dist'）
 */
async function zipBuildOutput(root, outDir) {
	const outputDir = resolve(root, outDir);
	if (!existsSync(outputDir)) {
		console.warn(`[zip-after-build] 构建目录不存在: ${outputDir}`);
		return;
	}

	// 格式化时间戳：YYYYMMDD-HHMMSS
	const pad = (value) => value.toString().padStart(2, '0');
	const now = new Date();
	const timestamp = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(
		now.getDate()
	)} ${pad(now.getHours())}-${pad(now.getMinutes())}-${pad(now.getSeconds())}`;

	// 判断是否为生产环境
	const appEnv = process.env.VITE_APP_ENV || '';
	console.log(process.env.VITE_APP_ENV);
	const isProd = appEnv.includes('prod');
	const modeSuffix = isProd ? '-prod' : '-dev';

	const zipFileName = `${outDir}-${timestamp}${modeSuffix}.zip`;
	const zipPath = resolve(root, zipFileName);

	// 清理旧的 ZIP 文件（同前缀）
	const existingZips = readdirSync(root).filter(
		(file) => file.startsWith(`${outDir}-`) && file.endsWith('.zip')
	);
	for (const file of existingZips) {
		const filePath = resolve(root, file);
		if (existsSync(filePath)) {
			rmSync(filePath);
		}
	}

	// 创建临时目录：.temp-zip-xxx/html/
	const tempBaseDir = resolve(root, `.temp-zip-${Date.now()}`);
	const htmlDirInZip = join(tempBaseDir, 'html');

	try {
		// 创建临时目录结构
		mkdirSync(htmlDirInZip, { recursive: true });

		// 拷贝构建输出到临时 html 目录
		cpSync(outputDir, htmlDirInZip, { recursive: true });

		// 👇 调试：打印临时目录内容（可选，上线时可注释）
		console.log(`[ZIP DEBUG] 临时目录内容 (htmlDirInZip):`);
		const files = readdirSync(htmlDirInZip, { withFileTypes: true });
		files.forEach((file) => {
			const type = file.isDirectory() ? '📁' : '📄';
			console.log(`  ${type} ${file.name}`);
			if (file.isDirectory()) {
				const subFiles = readdirSync(join(htmlDirInZip, file.name));
				console.log(`    子内容: ${subFiles.length} 个文件`);
			}
		});

		// 动态导入 archiver（避免顶层 import 导致非必要依赖加载）
		const archiverModule = await import('archiver');
		const archiverFactory = archiverModule.default ?? archiverModule;

		await new Promise((resolve, reject) => {
			const output = createWriteStream(zipPath);
			const archive = archiverFactory('zip', { zlib: { level: 9 } });

			output.on('close', () => resolve());
			output.on('error', reject);
			archive.on('error', reject);
			archive.pipe(output);

			// 关键：压缩 tempBaseDir 的内容（即 html/ 目录）
			archive.directory(tempBaseDir, false); // false 表示不包含 tempBaseDir 自身

			archive.finalize();
		});

		console.log(`✅ 打包目录已压缩: ${zipPath}`);
	} finally {
		// 确保清理临时目录
		if (existsSync(tempBaseDir)) {
			rmSync(tempBaseDir, { recursive: true, force: true });
		}
	}
}

/**
 * 解析命令行传入的环境参数
 * @returns {'dev' | 'prod' | string}
 */
function getEnvironmentFromArgs() {
	return process.argv[2] || 'dev';
}

/**
 * 根据环境字符串映射为 Vite 模式值
 * @param {string} env - 命令行传入的环境标识
 * @returns {'development' | 'production'}
 */
function mapToViteMode(env) {
	switch (env) {
		case 'dev':
			return 'development';
		case 'prod':
			return 'production';
		default:
			return 'development';
	}
}

/**
 * 设置必要的环境变量
 * @param {string} mode - Vite 构建模式
 */
function setEnvironmentVariables(mode) {
	process.env.VITE_APP_ENV = mode;
	process.env.NODE_OPTIONS = '--max-old-space-size=4096';
}

/**
 * 创建 Vite 构建配置对象
 * @param {string} mode - 构建模式
 * @returns {import('vite').BuildOptions}
 */
function createViteConfig(mode, buildOptions = {}) {
	return {
		mode,
		build: {
			// 可在此扩展自定义构建选项
			...buildOptions,
		},
	};
}

/**
 * 打印构建开始信息
 * @param {string} cliEnv - 命令行传入的环境（如 'dev'）
 * @param {string} mode - 对应的 Vite 模式（如 'development'）
 */
function logBuildStart(cliEnv, mode) {
	console.log(`📦 开始打包... 环境: ${cliEnv} (${mode})`);
	console.log(`🔧 执行构建...`);
}

/**
 * 打印构建成功信息
 * @param {string} cliEnv - 命令行传入的环境
 * @param {number} startTime - Date.now() 开始时间
 * @param {number} startTimestamp - performance.now() 开始时间
 */
function logBuildSuccess(cliEnv, startTime, startTimestamp) {
	const endTime = Date.now();
	const endTimestamp = performance.now();
	const durationMs = Math.round(endTimestamp - startTimestamp);
	const durationSeconds = ((endTime - startTime) / 1000).toFixed(2);

	console.log(`✅ 打包成功完成！环境: ${cliEnv}`);
	console.log(`⏱️  构建耗时: ${durationMs}ms (${durationSeconds}s)`);
}

/**
 * 主构建函数
 */
async function main() {
	// 解析命令行参数
	const cliEnv = getEnvironmentFromArgs();
	// 映射为 Vite 模式
	const mode = mapToViteMode(cliEnv);
	// 设置环境变量
	setEnvironmentVariables(mode);
	// 打印构建开始信息
	logBuildStart(cliEnv, mode);
	// 创建 Vite 构建配置
	const viteConfig = createViteConfig(mode);
	// 记录开始时间
	const startTime = Date.now();
	const startTimestamp = performance.now();
	try {
		// 执行构建
		await build(viteConfig);
		// 打印构建成功信息
		logBuildSuccess(cliEnv, startTime, startTimestamp);
		// 👇 新增：构建完成后压缩 html 文件夹
		const projectRoot = process.cwd();
		await zipBuildOutput(projectRoot, 'html');
	} catch (error) {
		console.error('❌ 打包失败:', error);
		process.exit(1);
	}
}

// 启动构建流程
main();
