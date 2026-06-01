#!/usr/bin/env node
/**
 * 只检查 lint-staged 传递的 TypeScript 文件
 * 原理：为提交的文件动态生成临时 tsconfig，再用 tsc --project 检查
 * 这样 tsc 只检查提交的文件，不会扫描整个项目
 */
import { execSync } from 'child_process';
import { writeFileSync, unlinkSync } from 'fs';
import { resolve, relative, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const rootDir = resolve(__dirname, '..');

// 获取 lint-staged 传递的文件路径，过滤出 .ts/.tsx 文件
const files = process.argv
	.slice(2)
	.filter((f) => /\.(ts|tsx)$/.test(f) && !/\.d\.ts$/.test(f))
	.map((f) => {
		// 转换为相对于项目根目录的路径，并统一使用正斜杠
		return relative(rootDir, resolve(f)).replace(/\\/g, '/');
	});

if (files.length === 0) {
	process.exit(0);
}

// 创建临时 tsconfig，只包含提交的文件 + 类型声明文件
const tempConfigPath = join(rootDir, 'tsconfig.lint.temp.json');
writeFileSync(
	tempConfigPath,
	JSON.stringify(
		{
			extends: './tsconfig.lint.json',
			compilerOptions: {
				// Vite 8 的类型导出依赖 package exports，staged 检查时强制使用 bundler 解析
				moduleResolution: 'bundler',
			},
			// files 精确指定要检查的文件，不会自动扫描其他文件
			files: files,
			// include 额外引入 .d.ts 声明文件，确保类型声明（如 *.vue 模块）可被识别
			include: [
				'src/**/*.d.ts',
				'src/types/**/*.ts',
				'auto-imports.d.ts',
				'components.d.ts',
			],
			exclude: ['node_modules', 'dist', '**/*.vue'],
		},
		null,
		2
	)
);

try {
	// 使用临时 tsconfig 检查类型，捕获输出，只显示提交文件的错误
	execSync(`pnpm exec tsc --noEmit --project "${tempConfigPath}"`, {
		cwd: rootDir,
		shell: true,
		encoding: 'utf-8',
		stdio: ['inherit', 'pipe', 'pipe'],
	});
} catch (error) {
	// 过滤输出：只显示提交的文件中的错误
	const allOutput = [error.stdout || '', error.stderr || ''].join('');

	// 过滤只属于提交文件的错误行
	const filteredLines = allOutput.split('\n').filter((line) => {
		// 错误行格式：src/xxx.ts(行,列): error TSxxxx: ...
		const match = line.match(/^([^(]+)\(\d+,\d+\)/);
		if (!match) return false;
		const filePath = match[1].trim().replace(/\//g, '\\').toLowerCase();
		return files.some((f) =>
			filePath.endsWith(f.replace(/\//g, '\\').toLowerCase())
		);
	});

	if (filteredLines.length > 0) {
		// eslint-disable-next-line no-console
		console.error(filteredLines.join('\n'));
		process.exit(1);
	}
	// 没有提交文件的错误，正常退出
	process.exit(0);
} finally {
	// 无论成功失败都清理临时文件
	try {
		unlinkSync(tempConfigPath);
	} catch (e) {
		// 忽略
	}
}
