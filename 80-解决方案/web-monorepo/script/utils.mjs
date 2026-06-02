/* eslint-disable no-console */
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';
import prompts from 'prompts';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');

const WORKSPACE_DIRS = ['apps/ui', 'packages', 'services/ui','apps/web', 'packages', 'services/web'];

/**
 * 扫描 monorepo 工作区，找出包含指定 npm script 的包
 * @param {string} scriptName - package.json scripts 中的键名
 */
export function discoverPackages(scriptName) {
	const packages = [];

	for (const wsDir of WORKSPACE_DIRS) {
		const base = join(ROOT, wsDir);
		if (!existsSync(base)) continue;

		for (const entry of readdirSync(base, { withFileTypes: true })) {
			if (!entry.isDirectory()) continue;

			const pkgDir = join(base, entry.name);
			const pkgPath = join(pkgDir, 'package.json');
			if (!existsSync(pkgPath)) continue;

			let pkg;
			try {
				pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
			} catch {
				console.warn(`⚠️  跳过无效 package.json: ${pkgPath}`);
				continue;
			}

			if (!pkg.scripts?.[scriptName]) continue;

			packages.push({
				name: pkg.name || entry.name,
				path: pkgDir,
				relativePath: `${wsDir}/${entry.name}`,
			});
		}
	}

	return packages.sort((a, b) => a.relativePath.localeCompare(b.relativePath));
}

/**
 * 交互式选择要启动的工作区包
 * @param {string} scriptName
 * @param {string} actionLabel - 如「开发」或「构建」
 */
export async function selectPackage(scriptName, actionLabel) {
	const packages = discoverPackages(scriptName);

	if (packages.length === 0) {
		console.error(`\n❌ 未找到包含 "${scriptName}" 脚本的工作区包\n`);
		process.exit(1);
	}

	if (packages.length === 1) {
		const only = packages[0];
		console.log(`\n📦 仅有一个可${actionLabel}的项目: ${only.relativePath}\n`);
		return only;
	}

	console.log(`\n🚀 选择要${actionLabel}的项目\n`);

	const response = await prompts({
		type: 'select',
		name: 'index',
		message: `选择项目（将在此目录执行 npm run ${scriptName}）`,
		choices: packages.map((pkg, index) => ({
			title: pkg.relativePath,
			description: pkg.name,
			value: index,
		})),
		initial: 0,
	});

	if (response.index === undefined) {
		console.log('\n❌ 已取消');
		process.exit(0);
	}

	return packages[response.index];
}

/**
 * 在指定包目录下执行 npm run <script>
 * @param {string} pkgDir
 * @param {string} scriptName
 * @param {string[]} extraArgs - 透传给 npm 的额外参数
 */
export function runNpmScript(pkgDir, scriptName, extraArgs = []) {
	const args = ['run', scriptName, ...extraArgs];

	console.log('\n==================== 启动 ====================');
	console.log(`📁 目录: ${pkgDir}`);
	console.log(`▶️  命令: npm ${args.join(' ')}`);
	console.log('==============================================\n');

	const child = spawn('npm', args, {
		cwd: pkgDir,
		stdio: 'inherit',
		shell: process.platform === 'win32',
		env: process.env,
	});

	child.on('error', (err) => {
		console.error('❌ 启动失败:', err.message);
		process.exit(1);
	});

	child.on('close', (code) => {
		if (code !== 0 && code !== null) {
			process.exit(code);
		}
	});

	return child;
}
