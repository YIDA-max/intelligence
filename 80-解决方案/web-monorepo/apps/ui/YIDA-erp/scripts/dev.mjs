/* eslint-disable no-console */
/*
 * @Author: YIDA 3136271519@qq.com
 * @Date: 2025-09-22 20:00:38
 * @LastEditors: YIDA 3136271519@qq.com
 * @LastEditTime: 2025-11-27 11:20:23
 * @FilePath: \qianyi-ui\scripts\dev.mjs
 * @Description: 启动本地开发服务器（Vite）
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */

import { spawn } from 'child_process';
import prompts from 'prompts';
import { resolve } from 'node:path';
import dotenv from 'dotenv';

/**
 * 从命令行参数中获取端口号，默认为 8888
 * @returns {string} 端口号字符串
 */
function getPortFromArgs() {
	return process.argv[2] || '8888';
}

/**
 * 加载代理配置信息
 * @returns {Array<{port: number, path: string, name?: string}> | null}
 */
function loadProxyInfo() {
	try {
		// 加载 .env.development 文件
		const envPath = resolve(process.cwd(), '.env.development');
		dotenv.config({ path: envPath });

		// 解析代理配置，参考 params.ts 的逻辑
		const adminProxyInfo = JSON.parse(
			process.env.VITE_ADMIN_PROXY_INFO || '[]'
		);
		return Array.isArray(adminProxyInfo) ? adminProxyInfo : null;
	} catch (error) {
		console.warn('⚠️  读取代理配置失败:', error.message);
		return null;
	}
}

/**
 * 交互式选择服务器和配置选项
 * @returns {Promise<{port: string, proxyPath: string, host: string, open: boolean} | null>}
 */
async function selectServer() {
	const proxyInfo = loadProxyInfo();

	// 如果没有代理配置，返回 null，使用默认端口
	if (!proxyInfo || proxyInfo.length === 0) {
		return null;
	}

	// 如果命令行已传参，跳过交互
	const cliPort = getPortFromArgs();
	if (cliPort && cliPort !== '8888') {
		const matchedProxy = proxyInfo.find((p) => String(p.port) === cliPort);
		if (matchedProxy) {
			return {
				port: cliPort,
				proxyPath: matchedProxy.path,
				host: '0.0.0.0',
				open: process.env.VITE_OPEN === 'true',
			};
		}
		return null;
	}

	console.log('\n🚀 开发服务器配置向导\n');

	// 选择服务器
	const serverChoices = proxyInfo.map((proxy, index) => {
		const serverName = proxy.name ? ` [${proxy.name}]` : '';
		return {
			title: `端口 ${proxy.port}${serverName} - ${proxy.path}`,
			value: index,
			description: proxy.path,
		};
	});

	const serverResponse = await prompts({
		type: 'select',
		name: 'serverIndex',
		message: '选择服务器',
		choices: serverChoices,
		initial: 0,
	});

	// 如果用户按 Ctrl+C 取消
	if (serverResponse.serverIndex === undefined) {
		console.log('\n❌ 启动已取消');
		process.exit(0);
	}

	const selectedProxy = proxyInfo[serverResponse.serverIndex];

	// 选择 Host 配置
	const hostResponse = await prompts({
		type: 'select',
		name: 'host',
		message: '服务器监听地址',
		choices: [
			{ title: 'localhost (仅本机访问)', value: 'localhost' },
			{ title: '0.0.0.0 (局域网可访问)', value: '0.0.0.0' },
		],
		initial: 1, // 默认 0.0.0.0
	});

	// 选择是否自动打开浏览器
	const openResponse = await prompts({
		type: 'confirm',
		name: 'open',
		message: '是否自动打开浏览器？',
		initial: process.env.VITE_OPEN === 'true',
	});

	return {
		port: String(selectedProxy.port),
		proxyPath: selectedProxy.path,
		host: hostResponse.host || '0.0.0.0',
		open: openResponse.open ?? false,
	};
}

/**
 * 启动 Vite 开发服务器子进程
 * @param {string} port - 要监听的端口
 * @param {string} [proxyPath] - 代理路径（可选）
 * @param {string} [host] - 服务器监听地址（可选，默认 0.0.0.0）
 * @param {boolean} [open] - 是否自动打开浏览器（可选，默认 false）
 * @returns {import('child_process').ChildProcess} 子进程实例
 */
function startViteDevServer(port, proxyPath, host = '0.0.0.0', open = false) {
	// 显示详细的启动信息
	console.log('\n==================== 启动配置 ====================');
	console.log('🚀 正在启动 Vite 开发服务器');
	console.log(`   端口: ${port}`);
	console.log(`   监听地址: ${host}`);
	console.log(`   自动打开浏览器: ${open ? '是' : '否'}`);
	if (proxyPath) {
		console.log(`   代理路径: ${proxyPath}`);
	}
	console.log('================================================\n');

	// 设置环境变量，供 Vite 配置使用
	const env = {
		...process.env,
		VITE_OPEN: open ? 'true' : 'false',
		VITE_SERVER_HOST: host, // 设置服务器监听地址环境变量
		...(proxyPath && { VITE_ADMIN_PROXY_PATH: proxyPath }),
	};

	// 构建 Vite 启动参数
	// 注意：端口需要作为第三个参数传递，以便 params.ts 的 process.argv[3] 能读取到
	const viteArgs = ['vite', '--port', port, '--host', host];
	if (open) {
		viteArgs.push('--open');
	}

	return spawn('npx', viteArgs, {
		stdio: 'inherit',
		shell: process.platform === 'win32', // 仅 Windows 需要 shell
		env,
	});
}

/**
 * 绑定子进程的错误与退出事件监听器
 * @param {import('child_process').ChildProcess} child - 子进程
 */
function attachProcessListeners(child) {
	child.on('error', (err) => {
		console.error('❌ 启动子进程失败:', err.message);
		process.exit(1);
	});

	child.on('close', (code) => {
		console.log(`\nVite 进程退出，退出码: ${code}`);
		// 若非正常退出（如 Ctrl+C 是 0 或 null），可根据需要决定是否 exit(1)
		if (code !== 0 && code !== null) {
			process.exit(1);
		}
	});
}

/**
 * 主函数：协调整个开发服务器启动流程
 */
async function main() {
	// 交互式选择服务器和配置
	const serverInfo = await selectServer();

	let port, proxyPath, host, open;
	if (serverInfo) {
		// 使用选择的服务器信息
		port = serverInfo.port;
		proxyPath = serverInfo.proxyPath;
		host = serverInfo.host;
		open = serverInfo.open;
	} else {
		// 使用默认端口或命令行参数
		port = getPortFromArgs();
		proxyPath = undefined;
		host = '0.0.0.0';
		open = process.env.VITE_OPEN === 'true';
	}

	// 启动 Vite 开发服务器
	const child = startViteDevServer(port, proxyPath, host, open);
	// 绑定子进程事件监听器
	attachProcessListeners(child);
}

// 执行主流程
main();
