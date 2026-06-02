/* eslint-disable no-console */
/*
 * @Author: YIDA 3136271519@qq.com
 * @Date: 2026-01-20
 * @LastEditors: YIDA 3136271519@qq.com
 * @LastEditTime: 2026-01-20
 * @FilePath: \qianyi-ui\scripts\prettier-watch.mjs
 * @Description: 监听文件变化并自动使用 Prettier 格式化
 *
 * Copyright (c) 2026 by ${git_name_email}, All Rights Reserved.
 */

import { watch, statSync } from 'fs';
import { execSync } from 'child_process';
import { resolve, relative, extname } from 'path';
import { existsSync } from 'fs';

/**
 * Prettier 支持的文件扩展名
 */
const PRETTIER_EXTENSIONS = [
	'.js',
	'.jsx',
	'.ts',
	'.tsx',
	'.vue',
	'.json',
	'.md',
	'.css',
	'.scss',
	'.less',
	'.html',
	'.yml',
	'.yaml',
];

/**
 * 需要忽略的目录
 */
const IGNORE_DIRS = [
	'node_modules',
	'dist',
	'html',
	'.git',
	'.vscode',
	'.cursor',
	'analysis',
	'docker',
];

/**
 * 检查文件是否需要格式化
 * @param {string} filePath - 文件路径
 * @returns {boolean}
 */
function shouldFormat(filePath) {
	const ext = extname(filePath);
	if (!PRETTIER_EXTENSIONS.includes(ext)) {
		return false;
	}

	// 检查是否在忽略目录中
	const relativePath = relative(process.cwd(), filePath);
	return !IGNORE_DIRS.some((dir) => relativePath.includes(dir));
}

/**
 * 使用 Prettier 格式化文件
 * @param {string} filePath - 文件路径
 */
function formatFile(filePath) {
	if (!existsSync(filePath)) {
		return;
	}

	try {
		execSync(`npx prettier --write "${filePath}"`, {
			stdio: 'pipe',
			shell: process.platform === 'win32',
		});
		console.log(`✅ 已格式化: ${relative(process.cwd(), filePath)}`);
	} catch (error) {
		console.error(`❌ 格式化失败: ${relative(process.cwd(), filePath)}`);
		console.error(`   错误: ${error.message}`);
	}
}

/**
 * 监听目录变化
 * @param {string} dirPath - 要监听的目录路径
 */
function watchDirectory(dirPath) {
	console.log(`👀 开始监听目录: ${dirPath}`);
	console.log('💡 提示: 按 Ctrl+C 停止监听\n');

	// 用于去重，避免短时间内重复格式化同一个文件
	const pendingFiles = new Map();
	// 记录文件的最后修改时间，用于判断文件是否真的被修改
	const fileMtimes = new Map();

	const watcher = watch(
		dirPath,
		{ recursive: true },
		(eventType, filename) => {
			if (!filename) {
				return;
			}

			// 只处理文件修改事件，忽略创建和删除事件
			if (eventType !== 'change') {
				return;
			}

			const filePath = resolve(dirPath, filename);

			// 检查文件是否存在且是文件（不是目录）
			if (!existsSync(filePath)) {
				return;
			}

			let stats;
			try {
				stats = statSync(filePath);
				if (!stats.isFile()) {
					return;
				}
			} catch {
				// 如果无法获取文件信息，跳过
				return;
			}

			// 检查是否需要格式化
			if (!shouldFormat(filePath)) {
				return;
			}

			// 检查文件是否真的被修改了（通过比较修改时间）
			const lastMtime = fileMtimes.get(filePath);
			const currentMtime = stats.mtimeMs;

			// 如果修改时间没有变化，说明文件内容没有真正改变，跳过
			if (lastMtime !== undefined && lastMtime === currentMtime) {
				return;
			}

			// 更新文件的修改时间记录
			fileMtimes.set(filePath, currentMtime);

			// 去重：如果该文件已经在待处理队列中，清除之前的定时器
			if (pendingFiles.has(filePath)) {
				clearTimeout(pendingFiles.get(filePath));
			}

			// 延迟执行，避免文件正在写入时格式化
			const timer = setTimeout(() => {
				pendingFiles.delete(filePath);
				formatFile(filePath);
				// 格式化后更新修改时间（因为格式化会改变文件的 mtime）
				try {
					const newStats = statSync(filePath);
					fileMtimes.set(filePath, newStats.mtimeMs);
				} catch {
					// 忽略错误
				}
			}, 300);

			pendingFiles.set(filePath, timer);
		}
	);

	watcher.on('error', (error) => {
		console.error('❌ 监听错误:', error.message);
	});

	// 优雅退出
	process.on('SIGINT', () => {
		console.log('\n\n👋 停止监听');
		// 清除所有待处理的定时器
		pendingFiles.forEach((timer) => clearTimeout(timer));
		pendingFiles.clear();
		watcher.close();
		process.exit(0);
	});
}

/**
 * 主函数
 */
function main() {
	const targetDir = process.argv[2] || './src';
	const absolutePath = resolve(process.cwd(), targetDir);

	if (!existsSync(absolutePath)) {
		console.error(`❌ 目录不存在: ${absolutePath}`);
		process.exit(1);
	}

	watchDirectory(absolutePath);
}

// 执行主流程
main();
