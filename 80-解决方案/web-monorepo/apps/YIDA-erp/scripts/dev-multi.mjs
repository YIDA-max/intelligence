/* eslint-disable no-console */
/*
 * @Author: YIDA 3136271519@qq.com
 * @Date: 2025-09-19 18:00:56
 * @LastEditors: YIDA 3136271519@qq.com
 * @LastEditTime: 2025-09-19 18:14:43
 * @FilePath: \qianyi-ui\scripts\dev-multi.js
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
// scripts/start-multi.js
import { spawn } from 'child_process';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url'; // 新增：用于转换 URL 到文件路径
// ------------------------------------
// 获取 __dirname（ES 模块中没有 __dirname，需要手动获取）
// ------------------------------------
// 获取当前文件的绝对路径（ES 模块兼容方式）
const currentFilePath = fileURLToPath(import.meta.url);
// 获取当前文件所在目录的绝对路径（替代 __dirname）
const __dirname = path.dirname(currentFilePath);

// --------------------------
// 1. 加载 .env 文件（关键步骤）
// --------------------------
// 配置 dotenv：指定 .env 文件路径（根据你的实际路径调整）
const envPath = path.resolve(__dirname, '../.env.development'); // 你的 .env 文件路径
dotenv.config({ path: envPath });

// --------------------------
// 2. 读取并解析 VITE_ADMIN_PROXY_INFO
// --------------------------
try {
	// 从环境变量中获取原始值（可能是字符串或未定义）
	const proxyInfoRaw = process.env.VITE_ADMIN_PROXY_INFO;

	if (!proxyInfoRaw) {
		throw new Error('VITE_ADMIN_PROXY_INFO 未在 .env 文件中定义');
	}

	// 解析 JSON（注意：确保 .env 中的值是合法 JSON，无外层引号）
	const VITE_ADMIN_PROXY_INFO = JSON.parse(proxyInfoRaw);

	// 校验是否为数组（防止用户错误配置）
	if (!Array.isArray(VITE_ADMIN_PROXY_INFO)) {
		throw new Error('VITE_ADMIN_PROXY_INFO 必须是 JSON 数组');
	}

	// 校验每个元素是否包含必要字段（如 port）
	VITE_ADMIN_PROXY_INFO.forEach((item, index) => {
		if (!item.port) {
			throw new Error(`第 ${index + 1} 个元素缺少 "port" 字段`);
		}
	});

	// --------------------------
	// 3. 启动所有 Vite 服务
	// --------------------------
	const childProcesses = [];

	VITE_ADMIN_PROXY_INFO.forEach((config, index) => {
		const { port } = config;
		console.log(`🚀 开始启动第 ${index + 1} 个服务，端口: ${port}...`);

		// 启动 Vite 子进程（关键参数说明见下方注释）
		const child = spawn('npx', ['vite', '--port', port], {
			stdio: 'inherit', // 继承父进程终端，实时显示 Vite 日志
			shell: true, // Windows 下需要 shell 支持 npx
			env: { ...process.env }, // 保留当前环境变量（可选）
		});

		// 记录子进程到数组（用于后续关闭）
		childProcesses.push(child);

		// 监听子进程错误（如 Vite 启动失败）
		child.on('error', (err) => {
			console.error(`❌ 第 ${index + 1} 个服务（端口 ${port}）启动失败:`, err.message);
			console.error('可能原因：端口被占用、Vite 未安装或配置文件错误');
		});

		// 监听子进程退出（正常退出码为 0，非 0 表示异常）
		child.on('close', (code) => {
			console.log(`\n第 ${index + 1} 个服务（端口 ${port}）退出，退出码: ${code}`);
		});
	});

	// --------------------------
	// 4. 监听全局退出信号（如 Ctrl+C），终止所有子进程
	// --------------------------
	process.on('SIGINT', () => {
		console.log('\n🔒 接收到退出信号，正在终止所有 Vite 服务...');
		childProcesses.forEach((child) => child.kill());
		process.exit(0);
	});

	console.log('\n✅ 所有 Vite 服务已启动，请访问对应端口查看服务状态');
} catch (err) {
	// 捕获并打印所有错误（如文件不存在、JSON 解析失败等）
	console.error('❌ 启动失败:', err.message);
	process.exit(1); // 退出脚本，避免继续执行无效逻辑
}
