#!/usr/bin/env node
/**
 * DeepSeek TUI 启动器
 *
 * 功能：
 *   1. 直接启动 DeepSeek TUI 交互会话
 *   2. 支持 --prompt / --file / --model 等参数透传
 *   3. 交互菜单模式（无参数时）
 */

/* eslint-disable no-console */
import { spawn, execSync } from 'child_process';
import { resolve } from 'node:path';
import fs from 'node:fs';
import dotenv from 'dotenv';
import prompts from 'prompts';

// ============================================================
//  环境变量加载
// ============================================================
function loadEnv() {
	const root = process.cwd();
	const files = [
		'.env',
		'.env.development',
		'.env.local',
		'.env.development.local',
	];
	files.forEach((file) => {
		const p = resolve(root, file);
		if (fs.existsSync(p))
			dotenv.config({ path: p, override: false, quiet: true });
	});
}

// ============================================================
//  终端颜色
// ============================================================
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
		console.log(
			`${color.dim}────────────────────────────────────────${color.reset}`
		);
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
};

// ============================================================
//  检测 DeepSeek CLI 是否可用
// ============================================================
function findDeepSeek() {
	// 优先使用全局安装的 deepseek / deepseek-tui
	const candidates = ['deepseek', 'deepseek-tui', 'npx deepseek-tui'];
	for (const cmd of candidates) {
		try {
			execSync(`${cmd} --version`, { stdio: 'ignore', timeout: 5000 });
			return cmd;
		} catch {
			/* 继续尝试 */
		}
	}
	return null;
}

// ============================================================
//  启动 TUI
// ============================================================
function launchTUI({ prompt, file, model, system, cwd }) {
	const cli = findDeepSeek();
	if (!cli) {
		fx.fail('未检测到 DeepSeek TUI，请先安装：npm install -g deepseek-tui');
		fx.info('或使用 npx：npx deepseek-tui');
		process.exit(1);
	}

	const args = [];
	if (prompt) args.push('-p', prompt);
	if (file) args.push('-f', resolve(cwd || process.cwd(), file));
	if (model) args.push('-m', model);
	if (system) args.push('-s', system);

	fx.section(`启动 DeepSeek TUI：${cli}`);
	if (prompt) fx.info(`Prompt: ${prompt}`);
	if (file) fx.info(`File: ${file}`);
	if (model) fx.info(`Model: ${model}`);
	console.log('');

	const child = spawn(cli, args, {
		stdio: 'inherit',
		shell: true,
		cwd: cwd || process.cwd(),
		env: process.env,
	});

	child.on('error', (err) => {
		fx.fail(`启动失败：${err.message}`);
		process.exit(1);
	});

	child.on('close', (code) => {
		if (code !== 0 && code !== null) {
			fx.warn(`DeepSeek TUI 已退出，退出码：${code}`);
		}
	});
}

// ============================================================
//  交互菜单（无参数时）
// ============================================================
async function interactiveMenu() {
	fx.title('🤖 DeepSeek TUI 启动器');

	const cli = findDeepSeek();
	if (!cli) {
		fx.fail('未检测到 DeepSeek TUI');
		fx.info('请运行：npm install -g deepseek-tui');
		process.exit(1);
	}
	fx.ok(`检测到 CLI：${cli}`);

	const answer = await prompts([
		{
			type: 'select',
			name: 'mode',
			message: '选择启动模式',
			choices: [
				{ title: '🚀 直接启动 TUI（在项目根目录）', value: 'tui' },
				{ title: '📝 带 Prompt 启动', value: 'prompt' },
				{ title: '📂 从文件读取 Prompt', value: 'file' },
				{ title: '💬 历史会话模式', value: 'history' },
				{ title: '📋 代码审查（Staged Diff）', value: 'review' },
				{ title: '🔍 查看版本信息', value: 'version' },
				{ title: '❌ 退出', value: 'exit' },
			],
			initial: 0,
		},
		{
			type: (prev) => (prev === 'prompt' ? 'text' : null),
			name: 'prompt',
			message: '输入 Prompt',
			validate: (v) => (v?.trim() ? true : '问题不能为空'),
		},
		{
			type: (prev) => (prev === 'file' ? 'text' : null),
			name: 'file',
			message: '输入文件路径（相对于项目根目录）',
		},
		{
			type: (prev) => (prev === 'prompt' || prev === 'file' ? 'select' : null),
			name: 'model',
			message: '选择模型',
			choices: [
				{ title: 'deepseek-chat (V3)', value: 'deepseek-chat' },
				{ title: 'deepseek-reasoner (R1)', value: 'deepseek-reasoner' },
				{ title: '默认（环境变量）', value: '' },
			],
		},
	]);

	if (!answer.mode || answer.mode === 'exit') {
		fx.ok('已退出');
		return;
	}

	switch (answer.mode) {
		case 'tui':
			launchTUI({});
			break;
		case 'prompt':
			launchTUI({ prompt: answer.prompt, model: answer.model || null });
			break;
		case 'file':
			launchTUI({ file: answer.file, model: answer.model || null });
			break;
		case 'history':
			launchTUI({ prompt: '--history' });
			break;
		case 'review': {
			// 生成 staged diff 作为 prompt
			try {
				const diff = execSync('git diff --cached', {
					encoding: 'utf8',
					cwd: process.cwd(),
				});
				if (!diff.trim()) {
					fx.warn('没有暂存的变更（git diff --cached 为空）');
					return;
				}
				const reviewPrompt = `请审查以下代码变更，指出潜在问题、安全隐患和改进建议：\n\n\`\`\`diff\n${diff.slice(
					0,
					8000
				)}\n\`\`\``;
				launchTUI({ prompt: reviewPrompt, model: 'deepseek-chat' });
			} catch (err) {
				fx.fail(`获取 diff 失败：${err.message}`);
			}
			break;
		}
		case 'version':
			execSync(cli + ' --version', { stdio: 'inherit' });
			break;
	}
}

// ============================================================
//  CLI 参数解析
// ============================================================
function parseArgs(argv) {
	const args = argv.slice(2);
	const out = {
		prompt: null,
		file: null,
		model: null,
		system: null,
		help: false,
		review: false,
	};

	for (let i = 0; i < args.length; i++) {
		const a = args[i];
		const take = () => {
			const v = args[i + 1];
			if (!v || v.startsWith('-')) return null;
			i++;
			return v;
		};

		if (a === '--help' || a === '-h') out.help = true;
		else if (a === '--prompt' || a === '-p') out.prompt = take();
		else if (a === '--file' || a === '-f') out.file = take();
		else if (a === '--model' || a === '-m') out.model = take();
		else if (a === '--system' || a === '-s') out.system = take();
		else if (a === '--review') out.review = true;
	}

	return out;
}

function printHelp() {
	console.log(`
${color.bold}DeepSeek TUI 启动器${color.reset}

用法:
  npm run ai                             交互菜单模式
  npm run ai -- --prompt "你好"          带 Prompt 启动
  npm run ai -- --file ./prompt.txt      从文件读取 Prompt
  npm run ai -- --review                 审查当前 staged diff
  npm run ai -- --model deepseek-reasoner 指定模型
  npm run ai -- -p "hello" -m deepseek-chat

参数:
  -p, --prompt   直接传入 prompt
  -f, --file     从文件读取 prompt
  -m, --model    模型名（deepseek-chat / deepseek-reasoner）
  -s, --system   system 提示词
      --review   审查 staged diff（git diff --cached）
  -h, --help     显示帮助

环境变量（可选）:
  DEEPSEEK_API_KEY   DeepSeek API Key
  DEEPSEEK_MODEL     默认模型
`);
}

// ============================================================
//  入口
// ============================================================
async function main() {
	loadEnv();
	const args = parseArgs(process.argv);

	if (args.help) {
		printHelp();
		return;
	}

	if (args.review) {
		try {
			const diff = execSync('git diff --cached', {
				encoding: 'utf8',
				cwd: process.cwd(),
			});
			if (!diff.trim()) {
				fx.warn('没有暂存的变更');
				return;
			}
			const reviewPrompt = `请审查以下代码变更，指出潜在问题、安全隐患和改进建议：\n\n\`\`\`diff\n${diff.slice(
				0,
				8000
			)}\n\`\`\``;
			launchTUI({ prompt: reviewPrompt, model: args.model || 'deepseek-chat' });
		} catch (err) {
			fx.fail(`获取 diff 失败：${err.message}`);
		}
		return;
	}

	if (args.prompt || args.file) {
		launchTUI(args);
		return;
	}

	// 无参数 → 交互菜单
	await interactiveMenu();
}

main().catch((err) => {
	console.error(`脚本异常: ${err?.message || err}`);
	process.exit(1);
});
