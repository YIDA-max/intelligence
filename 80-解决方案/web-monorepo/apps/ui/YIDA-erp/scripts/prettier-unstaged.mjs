/* eslint-disable no-console */
/*
 * @Author: YIDA 3136271519@qq.com
 * @Date: 2026-01-20
 * @LastEditors: YIDA 3136271519@qq.com
 * @LastEditTime: 2026-01-20
 * @FilePath: \qianyi-ui\scripts\prettier-unstaged.mjs
 * @Description: 使用 Prettier 格式化所有未提交的文件
 *
 * Copyright (c) 2026 by ${git_name_email}, All Rights Reserved.
 */

import { execSync } from 'child_process';
import { existsSync } from 'fs';

/**
 * 执行 shell 命令并返回结果
 * @param {string} command - 要执行的命令
 * @returns {string} 命令输出
 */
function execCommand(command) {
	try {
		return execSync(command, { encoding: 'utf-8', stdio: 'pipe' }).trim();
	} catch (error) {
		return '';
	}
}

/**
 * 获取所有未提交的文件列表
 * @returns {string[]} 文件路径数组
 */
function getUnstagedFiles() {
	const files = new Set();

	// 获取已修改但未暂存的文件
	const modified = execCommand('git diff --name-only --diff-filter=ACMR');
	if (modified) {
		modified.split('\n').forEach((file) => {
			if (file && existsSync(file)) {
				files.add(file);
			}
		});
	}

	// 获取已暂存但未提交的文件
	const staged = execCommand('git diff --cached --name-only --diff-filter=ACMR');
	if (staged) {
		staged.split('\n').forEach((file) => {
			if (file && existsSync(file)) {
				files.add(file);
			}
		});
	}

	// 获取未跟踪的文件
	const untracked = execCommand('git ls-files --others --exclude-standard');
	if (untracked) {
		untracked.split('\n').forEach((file) => {
			if (file && existsSync(file)) {
				files.add(file);
			}
		});
	}

	return Array.from(files);
}

/**
 * 过滤需要格式化的文件（根据 prettier 支持的文件类型）
 * @param {string[]} files - 文件路径数组
 * @returns {string[]} 过滤后的文件路径数组
 */
function filterPrettierFiles(files) {
	const prettierExtensions = [
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

	return files.filter((file) => {
		return prettierExtensions.some((ext) => file.endsWith(ext));
	});
}

/**
 * 使用 Prettier 格式化文件
 * @param {string[]} files - 要格式化的文件路径数组
 */
function formatFiles(files) {
	if (files.length === 0) {
		console.log('✅ 没有需要格式化的未提交文件');
		return;
	}

	console.log(`📝 找到 ${files.length} 个未提交的文件需要格式化:`);
	files.forEach((file) => {
		console.log(`   - ${file}`);
	});

	try {
		console.log('\n🎨 正在格式化文件...');
		execSync(`npx prettier --write ${files.map((f) => `"${f}"`).join(' ')}`, {
			stdio: 'inherit',
			shell: process.platform === 'win32',
		});
		console.log('\n✅ 格式化完成！');
	} catch (error) {
		console.error('\n❌ 格式化失败:', error.message);
		process.exit(1);
	}
}

/**
 * 主函数
 */
function main() {
	console.log('🔍 正在查找未提交的文件...\n');
	const unstagedFiles = getUnstagedFiles();
	const prettierFiles = filterPrettierFiles(unstagedFiles);
	formatFiles(prettierFiles);
}

// 执行主流程
main();
