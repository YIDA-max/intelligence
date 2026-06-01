/* eslint-disable no-console */
import { spawn } from 'child_process';
import prompts from 'prompts';
import { deploy, formatDuration } from './deploy.mjs';

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
	spinner(text) {
		const frames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
		let i = 0;
		const timer = setInterval(() => {
			process.stdout.write(
				`\r${color.cyan}${frames[(i = (i + 1) % frames.length)]}${
					color.reset
				} ${text} `
			);
		}, 80);
		return () => {
			clearInterval(timer);
			process.stdout.write('\r');
		};
	},
};

const COMMANDS = [
	{
		key: 'dev',
		group: 'dev',
		title: '🚀 启动开发环境',
		description: 'node ./scripts/dev.mjs',
		run: ['node', './scripts/dev.mjs'],
		persistent: true,
	},
	{
		key: 'preview',
		group: 'dev',
		title: '👀 启动预览环境',
		description: 'node ./scripts/preview.mjs',
		run: ['node', './scripts/preview.mjs'],
		persistent: true,
	},
	{
		key: 'build',
		group: 'build',
		title: '📦 构建生产包',
		description: 'npm run build',
		run: ['npm', ['run', 'build']],
	},
	{
		key: 'buildProd',
		group: 'build',
		title: '📦 构建生产环境（prod）',
		description: 'npm run build -- prod',
		run: ['npm', ['run', 'build', '--', 'prod']],
	},
	{
		key: 'buildAnalyze',
		group: 'build',
		title: '📊 构建并分析体积',
		description: 'npm run build:analyze',
		run: ['npm', ['run', 'build:analyze']],
	},
	{
		key: 'lint',
		group: 'quality',
		title: '🧹 代码检查',
		description: 'npm run lint',
		run: ['npm', ['run', 'lint']],
	},
	{
		key: 'lintFix',
		group: 'quality',
		title: '🛠️ 代码检查并修复',
		description: 'npm run lint:fix',
		run: ['npm', ['run', 'lint:fix']],
	},
	{
		key: 'prettier',
		group: 'quality',
		title: '✨ 格式化全项目',
		description: 'npm run prettier',
		run: ['npm', ['run', 'prettier']],
	},
	{
		key: 'prettierUnstaged',
		group: 'quality',
		title: '🎯 格式化未暂存文件',
		description: 'npm run p',
		run: ['npm', ['run', 'p']],
	},
	{
		key: 'deploy',
		group: 'release',
		title: '🚚 部署到测试服（SCP）',
		action: 'deploy',
	},
	{
		key: 'buildAndDeploy',
		group: 'release',
		title: '📦🚚 打包并推送服务器',
		description: '先 npm run build，再上传 html/ 到测试服',
		action: 'buildAndDeploy',
	},
	{
		key: 'gitStatus',
		group: 'git',
		title: '📋 查看 Git 状态',
		description: 'git status -sb',
		run: ['git', ['status', '-sb']],
	},
	{
		key: 'gitPull',
		group: 'git',
		title: '📥 拉取远端更新',
		description: 'git pull',
		run: ['git', ['pull']],
	},
	{
		key: 'gitPush',
		group: 'git',
		title: '📤 推送当前分支',
		description: 'git push',
		run: ['git', ['push']],
	},
	{
		key: 'gitLog',
		group: 'git',
		title: '🕘 查看最近提交',
		description: 'git log --oneline -n 12',
		run: ['git', ['log', '--oneline', '-n', '12']],
	},
	{
		key: 'gitCommit',
		group: 'git',
		title: '✅ 提交（Commitizen）',
		description: 'npm run commit',
		run: ['npm', ['run', 'commit']],
	},
	{
		key: 'gitReviewAndCommit',
		group: 'git',
		title: '🧭 先看 Diff 再提交',
		description: 'git status + git diff --stat + git diff，再确认提交',
		action: 'gitReviewAndCommit',
	},
	{
		key: 'deepseek',
		group: 'ai',
		title: '🤖 启动 DeepSeek AI',
		description: 'node ./scripts/deepseek.mjs',
		run: ['node', ['./scripts/deepseek.mjs']],
		persistent: true,
	},
	{
		key: 'deepseekReview',
		group: 'quality',
		title: '🔍 DeepSeek 代码审查（Staged）',
		description: 'node ./scripts/deepseek.mjs --review',
		run: ['node', ['./scripts/deepseek.mjs', '--review']],
		persistent: true,
	},
];

const GROUPS = [
	{
		key: 'dev',
		title: '🧪 开发',
		description: '开发与预览相关命令',
	},
	{
		key: 'build',
		title: '🏗️ 构建',
		description: '构建与产物分析',
	},
	{
		key: 'quality',
		title: '✅ 质量',
		description: 'Lint 与格式化',
	},
	{
		key: 'release',
		title: '🚀 发布',
		description: '部署相关命令',
	},
	{
		key: 'git',
		title: '🌿 Git',
		description: '提交、拉取、推送、日志',
	},
	{
		key: 'ai',
		title: '🤖 AI',
		description: 'DeepSeek AI 相关命令',
	},
];

function resolveCommandParts(commandDef) {
	if (commandDef.run.length === 2 && Array.isArray(commandDef.run[1])) {
		return [commandDef.run[0], commandDef.run[1]];
	}
	if (commandDef.run.length === 2 && typeof commandDef.run[1] === 'string') {
		return [commandDef.run[0], [commandDef.run[1]]];
	}
	return [commandDef.run[0], []];
}

function spawnCommand(commandDef) {
	const [cmd, args] = resolveCommandParts(commandDef);
	return spawn(cmd, args, {
		stdio: 'inherit',
		shell: process.platform === 'win32',
		env: process.env,
	});
}

async function runOnce(commandDef) {
	fx.section(`执行命令：${commandDef.title}`);
	fx.info(commandDef.description);
	console.log('');

	const disableSpinner = commandDef.disableSpinner === true;
	let stop = null;
	if (!disableSpinner) {
		stop = fx.spinner('命令执行中...');
	}
	const child = spawnCommand(commandDef);

	return new Promise((resolve) => {
		child.on('error', (err) => {
			if (stop) stop();
			fx.fail(`命令启动失败：${err.message}`);
			resolve(false);
		});

		child.on('close', (code) => {
			if (stop) stop();
			if (code === 0 || code === null) {
				fx.ok('命令执行完成');
				resolve(true);
			} else {
				fx.fail(`命令执行失败，退出码: ${code}`);
				resolve(false);
			}
		});
	});
}

async function runPersistent(commandDef) {
	fx.section(`启动：${commandDef.title}`);
	fx.info(commandDef.description);
	fx.info('该命令会持续运行，按 Ctrl + C 停止');
	console.log('');

	const child = spawnCommand(commandDef);
	child.on('error', (err) => {
		fx.fail(`启动失败：${err.message}`);
		process.exit(1);
	});
	child.on('close', (code) => {
		fx.warn(`进程已退出，退出码: ${code}`);
	});
}

async function runGitReviewAndCommit() {
	fx.section('Git 变更预览');
	fx.info('第 1 步：查看 git status');
	await runOnce({
		title: 'Git 状态',
		description: 'git status -sb',
		run: ['git', ['status', '-sb']],
	});
	console.log('');

	fx.info('第 2 步：查看 diff 统计');
	await runOnce({
		title: 'Diff 统计',
		description: 'git diff --stat',
		run: ['git', ['diff', '--stat']],
		disableSpinner: true,
	});
	console.log('');

	fx.info('第 3 步：查看完整 diff');
	await runOnce({
		title: '完整 Diff',
		description: 'git diff',
		run: ['git', ['diff']],
		disableSpinner: true,
	});
	console.log('');

	const answer = await prompts({
		type: 'confirm',
		name: 'confirmCommit',
		message: '是否继续执行提交（npm run commit）？',
		initial: false,
	});

	if (!answer.confirmCommit) {
		fx.warn('已取消提交，返回菜单');
		return;
	}

	await runOnce({
		title: '提交（Commitizen）',
		description: 'npm run commit',
		run: ['npm', ['run', 'commit']],
	});
}

async function main() {
	fx.title('🎛️ Run All 命令中心');
	fx.info('先选分组，再选命令；支持返回上一级。');

	let isRunning = true;
	while (isRunning) {
		const groupChoices = GROUPS.map((item) => ({
			title: `${item.title}  ${color.dim}(${item.description})${color.reset}`,
			value: item.key,
			description: item.description,
		}));
		groupChoices.push({
			title: '❌ 退出',
			value: '__exit__',
			description: '退出命令中心',
		});

		const groupAnswer = await prompts({
			type: 'select',
			name: 'group',
			message: '请选择命令分组',
			choices: groupChoices,
			initial: 0,
		});

		if (groupAnswer.group === undefined || groupAnswer.group === '__exit__') {
			fx.ok('已退出命令中心');
			isRunning = false;
			break;
		}

		const commandChoices = COMMANDS.filter(
			(item) => item.group === groupAnswer.group
		).map((item) => ({
			title: `${item.title}  ${color.dim}(${item.description})${color.reset}`,
			value: item.key,
			description: item.description,
		}));
		commandChoices.push({
			title: '↩️ 返回分组选择',
			value: '__back__',
			description: '返回上一级菜单',
		});
		commandChoices.push({
			title: '❌ 退出',
			value: '__exit__',
			description: '退出命令中心',
		});

		const commandAnswer = await prompts({
			type: 'select',
			name: 'task',
			message: '请选择要执行的命令',
			choices: commandChoices,
			initial: 0,
		});

		if (commandAnswer.task === undefined || commandAnswer.task === '__exit__') {
			fx.ok('已退出命令中心');
			isRunning = false;
			break;
		}
		if (commandAnswer.task === '__back__') {
			console.log('');
			continue;
		}

		const commandDef = COMMANDS.find((item) => item.key === commandAnswer.task);
		if (!commandDef) {
			fx.fail('未知命令，已跳过');
			continue;
		}

		if (commandDef.action === 'gitReviewAndCommit') {
			await runGitReviewAndCommit();
			console.log('');
			continue;
		}

		if (commandDef.action === 'deploy') {
			fx.section(`执行命令：${commandDef.title}`);
			fx.info(commandDef.description);
			console.log('');
			try {
				await deploy();
				fx.ok('部署完成');
			} catch (err) {
				const dur =
					err && typeof err.deployElapsedMs === 'number'
						? `（耗时 ${formatDuration(err.deployElapsedMs)}）`
						: '';
				fx.fail(`${err?.message || String(err)} ${dur}`.trim());
			}
			console.log('');
			continue;
		}

		if (commandDef.action === 'buildAndDeploy') {
			fx.section(`执行命令：${commandDef.title}`);
			fx.info(commandDef.description);
			console.log('');
			const buildOk = await runOnce({
				title: '构建生产包',
				description: 'npm run build',
				run: ['npm', ['run', 'build']],
			});
			if (!buildOk) {
				fx.fail('构建失败，已跳过部署');
				console.log('');
				continue;
			}
			try {
				await deploy();
				fx.ok('打包并部署完成');
			} catch (err) {
				const dur =
					err && typeof err.deployElapsedMs === 'number'
						? `（耗时 ${formatDuration(err.deployElapsedMs)}）`
						: '';
				fx.fail(`${err?.message || String(err)} ${dur}`.trim());
			}
			console.log('');
			continue;
		}

		if (commandDef.persistent) {
			await runPersistent(commandDef);
			return;
		}

		await runOnce(commandDef);
		console.log('');
	}
}

main().catch((err) => {
	fx.fail(`命令中心异常：${err?.message || err}`);
	process.exit(1);
});
