/* eslint-disable no-console */
/*
 * @Description: 预览本地构建产物（Vite preview）
 *
 * 设计要点：
 * - 构建产物目录是 html/（见 scripts/build.mjs），因此 preview 也以 html/ 为准
 * - 代理/API：复用 .env.development 的 VITE_ADMIN_PROXY_INFO，让你通过 prompts 选择后端代理
 * - 端口兼容：config/vite-config/src/utils/params.ts 通过 process.argv[3] 读取端口号
 *   因此这里必须保证命令形如：vite --port <port> preview ...（让 <port> 落在 argv[3]）
 */
import { spawn } from 'child_process';
import prompts from 'prompts';
import { resolve } from 'node:path';
import dotenv from 'dotenv';
import fs from 'node:fs';

// -------------------- 终端“特效”工具（无额外依赖） --------------------
const color = {
	reset: '\x1b[0m',
	bold: '\x1b[1m',
	dim: '\x1b[2m',
	red: '\x1b[31m',
	green: '\x1b[32m',
	yellow: '\x1b[33m',
	blue: '\x1b[34m',
	cyan: '\x1b[36m',
};

const fx = {
	title(text) {
		console.log(`\n${color.bold}${color.cyan}${text}${color.reset}\n`);
	},
	section(text) {
		console.log(`${color.dim}────────────────────────────────────────${color.reset}`);
		console.log(`${color.bold}${text}${color.reset}`);
	},
	info(text) {
		console.log(`${color.blue}ℹ${color.reset}  ${text}`);
	},
	ok(text) {
		console.log(`${color.green}✓${color.reset}  ${text}`);
	},
	warn(text) {
		console.log(`${color.yellow}⚠${color.reset}  ${text}`);
	},
	fail(text) {
		console.log(`${color.red}✗${color.reset}  ${text}`);
	},
	spinner(text) {
		const frames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
		let i = 0;
		const timer = setInterval(() => {
			process.stdout.write(
				`\r${color.cyan}${frames[(i = (i + 1) % frames.length)]}${color.reset} ${text} `
			);
		}, 80);
		return () => {
			clearInterval(timer);
			process.stdout.write('\r');
		};
	},
};

function getPortFromArgs() {
	return process.argv[2] || '4173';
}

function loadProxyInfo() {
	try {
		// 复用开发环境的代理配置（VITE_ADMIN_PROXY_INFO）
		// 注意：preview 运行时也需要把“后端代理目标”传给 Vite 配置（通过环境变量）
		const envPath = resolve(process.cwd(), '.env.development');
		dotenv.config({ path: envPath });
		const adminProxyInfo = JSON.parse(
			process.env.VITE_ADMIN_PROXY_INFO || '[]'
		);
		return Array.isArray(adminProxyInfo) ? adminProxyInfo : null;
	} catch (error) {
		console.warn('⚠️  读取代理配置失败:', error.message);
		return null;
	}
}

async function ensureBuildExists() {
	// 项目构建产物目录为 html/（见 scripts/build.mjs）
	const outDir = resolve(process.cwd(), 'html');
	if (fs.existsSync(outDir)) return;

	fx.warn('未检测到 html/，需要先构建才能预览。');
	const { runBuild } = await prompts({
		type: 'confirm',
		name: 'runBuild',
		message: '是否先执行构建（npm run build）？',
		initial: true,
	});

	if (!runBuild) {
		fx.fail('预览已取消');
		process.exit(0);
	}

	const stop = fx.spinner('正在执行构建（npm run build）...');
	const child = spawn('npm', ['run', 'build'], {
		stdio: 'inherit',
		shell: process.platform === 'win32',
		env: process.env,
	});

	await new Promise((res, rej) => {
		child.on('error', rej);
		child.on('close', (code) => {
			stop();
			if (code === 0) {
				fx.ok('构建完成，已生成 html/');
				res();
			} else {
				rej(new Error(`build failed with code ${code}`));
			}
		});
	});
}

async function selectServer() {
	const proxyInfo = loadProxyInfo();
	if (!proxyInfo || proxyInfo.length === 0) return null;

	// 如果命令行已传参，跳过交互
	const cliPort = getPortFromArgs();
	if (cliPort && cliPort !== '4173') {
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

	fx.title('👀 预览服务器配置向导');

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
		message: '选择需要代理的后端（用于 /api 等请求）',
		choices: serverChoices,
		initial: 0,
	});

	if (serverResponse.serverIndex === undefined) {
		console.log('\n❌ 预览已取消');
		process.exit(0);
	}

	const selectedProxy = proxyInfo[serverResponse.serverIndex];

	const hostResponse = await prompts({
		type: 'select',
		name: 'host',
		message: '服务器监听地址',
		choices: [
			{ title: 'localhost (仅本机访问)', value: 'localhost' },
			{ title: '0.0.0.0 (局域网可访问)', value: '0.0.0.0' },
		],
		initial: 1,
	});

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

function startVitePreviewServer(
	port,
	proxyPath,
	host = '0.0.0.0',
	open = false
) {
	fx.section('预览配置');
	fx.info(`端口: ${port}`);
	fx.info(`监听地址: ${host}`);
	fx.info(`自动打开浏览器: ${open ? '是' : '否'}`);
	if (proxyPath) fx.info(`代理路径: ${proxyPath}`);
	console.log('');

	const env = {
		...process.env,
		VITE_OPEN: open ? 'true' : 'false',
		VITE_SERVER_HOST: host,
		// 供 Vite 配置读取：用于把前端请求代理到选中的后端地址（/api 等）
		...(proxyPath && { VITE_ADMIN_PROXY_PATH: proxyPath }),
	};

	// 关键：把端口作为第三个参数，让 params.ts 的 process.argv[3] 能读到端口号
	// 同时显式指定 outDir=html，确保预览的是 html/ 目录
	// 形如：vite --port 4173 preview --host 0.0.0.0 --outDir html
	const viteArgs = [
		'vite',
		'--port',
		port,
		'preview',
		'--host',
		host,
		'--outDir',
		'html',
	];
	if (open) viteArgs.push('--open');

	return spawn('npx', viteArgs, {
		stdio: 'inherit',
		shell: process.platform === 'win32',
		env,
	});
}

function attachProcessListeners(child) {
	child.on('error', (err) => {
		fx.fail(`启动子进程失败: ${err.message}`);
		process.exit(1);
	});

	child.on('close', (code) => {
		fx.info(`Vite preview 进程退出，退出码: ${code}`);
		if (code !== 0 && code !== null) process.exit(1);
	});
}

async function main() {
	fx.title('🚀 Preview 启动器');
	await ensureBuildExists();

	const serverInfo = await selectServer();

	let port, proxyPath, host, open;
	if (serverInfo) {
		port = serverInfo.port;
		proxyPath = serverInfo.proxyPath;
		host = serverInfo.host;
		open = serverInfo.open;
	} else {
		port = getPortFromArgs();
		proxyPath = undefined;
		host = '0.0.0.0';
		open = process.env.VITE_OPEN === 'true';
	}

	const child = startVitePreviewServer(port, proxyPath, host, open);
	attachProcessListeners(child);
}

main().catch((err) => {
	fx.fail(`预览启动失败: ${err?.message || err}`);
	process.exit(1);
});
