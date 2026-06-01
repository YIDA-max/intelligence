#!/usr/bin/env node
/* eslint-disable no-console */
import { execSync } from 'node:child_process';
import { resolve, dirname } from 'node:path';
import fs from 'node:fs';
import dotenv from 'dotenv';

function loadEnv() {
	const root = process.cwd();
	const baseEnvFiles = ['.env', '.env.development'];
	const localEnvFiles = ['.env.local', '.env.development.local'];
	baseEnvFiles.forEach((file) => {
		const p = resolve(root, file);
		if (fs.existsSync(p)) dotenv.config({ path: p, override: false, quiet: true });
	});
	localEnvFiles.forEach((file) => {
		const p = resolve(root, file);
		if (fs.existsSync(p)) dotenv.config({ path: p, override: true, quiet: true });
	});
}

function parseArgs() {
	const args = process.argv.slice(2);
	return {
		help: args.includes('--help') || args.includes('-h'),
		save: !args.includes('--no-save'),
		out: (() => {
			const i = args.findIndex((x) => x === '--out');
			return i >= 0 ? args[i + 1] : null;
		})(),
		model: (() => {
			const i = args.findIndex((x) => x === '--model' || x === '-m');
			return i >= 0 ? args[i + 1] : null;
		})(),
		maxChars: (() => {
			const i = args.findIndex((x) => x === '--max-chars');
			const raw = i >= 0 ? Number(args[i + 1]) : Number(process.env.DEEPSEEK_STAGED_MAX_CHARS || 120000);
			return Number.isFinite(raw) && raw > 2000 ? raw : 120000;
		})(),
	};
}

function printHelp() {
	console.log(`用法:
  npm run deepseek:staged
  npm run deepseek:staged -- --model deepseek-chat
  npm run deepseek:staged -- --max-chars 150000

说明:
  - 自动读取当前 git 暂存区（git diff --cached）的全部变更
  - 调用 DeepSeek 输出代码审查结果（风险、缺陷、改进建议）

参数:
  -m, --model     指定模型（默认 DEEPSEEK_MODEL 或 deepseek-chat）
      --max-chars 限制发送给模型的 diff 最大字符数（默认 120000）
      --out       指定审查结果输出文件路径（默认自动生成）
      --no-save   不保存审查结果到文件

环境变量:
  DEEPSEEK_API_KEY           必填
  DEEPSEEK_BASE_URL          可选，默认 https://api.deepseek.com
  DEEPSEEK_MODEL             可选，默认 deepseek-chat
  DEEPSEEK_STAGED_MAX_CHARS  可选，默认 120000
`);
}

function getStagedFiles() {
	const output = execSync('git diff --cached --name-only --diff-filter=ACMR', {
		encoding: 'utf8',
		stdio: ['ignore', 'pipe', 'pipe'],
	}).trim();
	return output ? output.split('\n').filter(Boolean) : [];
}

function getStagedDiff() {
	return execSync('git diff --cached --no-color', {
		encoding: 'utf8',
		stdio: ['ignore', 'pipe', 'pipe'],
	});
}

function trimDiffText(text, maxChars) {
	if (text.length <= maxChars) {
		return { text, trimmed: false };
	}
	return {
		text: `${text.slice(0, maxChars)}\n\n... [DIFF TOO LARGE, TRUNCATED] ...\n`,
		trimmed: true,
	};
}

function buildReviewPrompt({ files, diffText, trimmed }) {
	return `你是资深前端/全栈代码审查专家。请审查以下“git 暂存区”代码变更，并用中文输出。

审查目标（按优先级）：
1) 严重问题：会导致 bug、崩溃、安全风险、数据错误、接口不兼容、明显逻辑错误
2) 中等问题：边界条件、可维护性差、潜在性能问题、可读性和可测试性问题
3) 低优先建议：风格一致性、命名、注释、重复代码优化

输出格式要求：
- 先给“总体结论”（1-3 句）
- 然后分级列出问题：严重 / 中等 / 建议
- 每条问题都要包含：文件路径、问题描述、原因、建议修改
- 如果没有发现问题，明确写“未发现明显问题”，并给出仍需人工关注的点

已暂存文件：
${files.map((f) => `- ${f}`).join('\n')}

${trimmed ? '注意：本次 diff 过大，内容已被截断，请在结论里提示“审查可能不完整”。' : ''}

以下是 git diff --cached 内容：
${diffText}
`;
}

async function streamModelReply(resp) {
	const reader = resp.body?.getReader();
	if (!reader) {
		const text = await resp.text();
		return text;
	}
	const decoder = new TextDecoder('utf-8');
	let buffer = '';
	let finalText = '';
	process.stdout.write('🤖 DeepSeek 回复中...\n\n');
	while (true) {
		const { value, done } = await reader.read();
		if (done) break;
		buffer += decoder.decode(value, { stream: true });
		const lines = buffer.split('\n');
		buffer = lines.pop() || '';
		for (const line of lines) {
			const trimmed = line.trim();
			if (!trimmed || !trimmed.startsWith('data:')) continue;
			const payload = trimmed.slice(5).trim();
			if (payload === '[DONE]') continue;
			let obj;
			try {
				obj = JSON.parse(payload);
			} catch {
				continue;
			}
			const delta = obj?.choices?.[0]?.delta?.content;
			if (typeof delta === 'string' && delta) {
				finalText += delta;
				process.stdout.write(delta);
			}
		}
	}
	process.stdout.write('\n');
	return finalText;
}

function getDefaultOutputPath() {
	const now = new Date();
	const pad = (n) => String(n).padStart(2, '0');
	const ts = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}-${pad(
		now.getHours()
	)}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
	return resolve(process.cwd(), 'analysis', `deepseek-staged-review-${ts}.md`);
}

function writeReviewFile(outPath, content, files) {
	const dir = dirname(outPath);
	if (!fs.existsSync(dir)) {
		fs.mkdirSync(dir, { recursive: true });
	}
	const text = `# DeepSeek 暂存区审查结果

- 时间: ${new Date().toLocaleString('zh-CN', { hour12: false })}
- 文件数: ${files.length}

## 暂存文件
${files.map((f) => `- ${f}`).join('\n')}

## 审查内容

${content || '(空)'}
`;
	fs.writeFileSync(outPath, text, 'utf8');
}

async function main() {
	loadEnv();
	const args = parseArgs();
	if (args.help) {
		printHelp();
		return;
	}

	const apiKey = process.env.DEEPSEEK_API_KEY;
	const baseUrl = (process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com').replace(/\/+$/, '');
	const model = args.model || process.env.DEEPSEEK_MODEL || 'deepseek-chat';

	if (!apiKey) {
		console.error('❌ 缺少 DEEPSEEK_API_KEY，请先配置到 .env.local');
		process.exit(1);
	}

	let files;
	let diff;
	try {
		files = getStagedFiles();
		diff = getStagedDiff();
	} catch (err) {
		console.error(`❌ 获取暂存区变更失败: ${err?.message || err}`);
		process.exit(1);
	}

	if (!files.length || !diff.trim()) {
		console.log('ℹ 当前没有暂存变更（staged）。请先 git add 后再执行。');
		return;
	}

	console.log(`🔍 检查暂存区文件数: ${files.length}`);
	const trimmedDiff = trimDiffText(diff, args.maxChars);
	if (trimmedDiff.trimmed) {
		console.log(`⚠ diff 过大，已截断到 ${args.maxChars} 字符`);
	}
	console.log(`📦 暂存区 diff 字符数: ${diff.length}`);
	console.log('📡 正在发送审查请求到 DeepSeek...');

	const prompt = buildReviewPrompt({
		files,
		diffText: trimmedDiff.text,
		trimmed: trimmedDiff.trimmed,
	});

	const resp = await fetch(`${baseUrl}/chat/completions`, {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${apiKey}`,
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			model,
			stream: true,
			messages: [{ role: 'user', content: prompt }],
		}),
	});

	if (!resp.ok) {
		const text = await resp.text();
		console.error(`❌ DeepSeek 请求失败: HTTP ${resp.status}`);
		console.error(text);
		process.exit(1);
	}
	console.log('✅ 已连接，开始接收流式结果');
	console.log('\n===== DeepSeek 暂存区审查结果 =====\n');
	const content = await streamModelReply(resp);
	if (!content || !content.trim()) {
		console.log('⚠ 未收到有效审查内容，请重试。');
		return;
	}

	if (args.save) {
		const outPath = resolve(process.cwd(), args.out || getDefaultOutputPath());
		writeReviewFile(outPath, content, files);
		console.log(`\n💾 审查结果已保存: ${outPath}`);
	}
}

main().catch((err) => {
	console.error(`❌ 脚本异常: ${err?.message || err}`);
	process.exit(1);
});
