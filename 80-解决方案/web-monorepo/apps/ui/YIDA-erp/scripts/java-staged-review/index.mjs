#!/usr/bin/env node
/* eslint-disable no-console */
import { execSync, execFileSync } from 'node:child_process';
import { resolve, dirname } from 'node:path';
import fs from 'node:fs';
import dotenv from 'dotenv';
import { buildJavaPerfPrompt } from './prompt.mjs';

const JAVA_PATH_RE = /\.(java|kt|kts|xml|yml|yaml|properties|sql|gradle|groovy)$/i;
const SEVERITY_RANK = { critical: 4, high: 3, medium: 2, low: 1 };

function loadEnv() {
	const root = process.cwd();
	const baseEnvFiles = ['.env', '.env.development'];
	const localEnvFiles = ['.env.local', '.env.development.local'];
	for (const file of baseEnvFiles) {
		const p = resolve(root, file);
		if (fs.existsSync(p)) dotenv.config({ path: p, override: false, quiet: true });
	}
	for (const file of localEnvFiles) {
		const p = resolve(root, file);
		if (fs.existsSync(p)) dotenv.config({ path: p, override: true, quiet: true });
	}
}

function parseArgs() {
	const args = process.argv.slice(2);
	const get = (name, short) => {
		const idx = args.findIndex((x) => x === name || (short && x === short));
		return idx >= 0 ? args[idx + 1] : null;
	};
	return {
		help: args.includes('--help') || args.includes('-h'),
		model: get('--model', '-m'),
		maxChars: (() => {
			const v = Number(get('--max-chars'));
			if (Number.isFinite(v) && v > 2000) return v;
			const envV = Number(process.env.DEEPSEEK_STAGED_MAX_CHARS || 120000);
			return Number.isFinite(envV) && envV > 2000 ? envV : 120000;
		})(),
		outDir: get('--out-dir') || 'analysis/java-staged-review',
		failOn: (get('--fail-on') || 'none').toLowerCase(),
		noSave: args.includes('--no-save'),
	};
}

function printHelp() {
	console.log(`用法:
  node scripts/java-staged-review/index.mjs
  node scripts/java-staged-review/index.mjs --fail-on high
  node scripts/java-staged-review/index.mjs --model deepseek-chat --max-chars 150000

说明:
  - 仅审查暂存区中的 Java/后端相关文件（.java/.kt/.xml/.yml/.sql/...）
  - 使用 DeepSeek 输出结构化 JSON 审查结果
  - 支持按严重等级阻断提交（--fail-on）

参数:
  -m, --model        模型名称（默认 DEEPSEEK_MODEL 或 deepseek-chat）
      --max-chars    diff 最大字符数（默认 120000）
      --out-dir      报告输出目录（默认 analysis/java-staged-review）
      --fail-on      none|low|medium|high|critical（默认 none）
      --no-save      不落盘报告，仅终端输出

环境变量:
  DEEPSEEK_API_KEY   必填
  DEEPSEEK_BASE_URL  可选，默认 https://api.deepseek.com
  DEEPSEEK_MODEL     可选，默认 deepseek-chat
`);
}

function getStagedFiles() {
	const output = execSync('git diff --cached --name-only --diff-filter=ACMR', {
		encoding: 'utf8',
		stdio: ['ignore', 'pipe', 'pipe'],
	}).trim();
	return output ? output.split('\n').filter(Boolean) : [];
}

function getStagedDiffByFiles(files) {
	if (!files.length) return '';
	const args = ['diff', '--cached', '--no-color', '--', ...files];
	return execFileSync('git', args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
}

function trimDiffText(text, maxChars) {
	if (text.length <= maxChars) return { text, trimmed: false };
	return {
		text: `${text.slice(0, maxChars)}\n\n... [DIFF TOO LARGE, TRUNCATED] ...\n`,
		trimmed: true,
	};
}

async function streamModelReply(resp) {
	const reader = resp.body?.getReader();
	if (!reader) return await resp.text();
	const decoder = new TextDecoder('utf-8');
	let buffer = '';
	let finalText = '';
	process.stdout.write('🤖 DeepSeek 回复中...\n');
	while (true) {
		const { value, done } = await reader.read();
		if (done) break;
		buffer += decoder.decode(value, { stream: true });
		const lines = buffer.split('\n');
		buffer = lines.pop() || '';
		for (const line of lines) {
			const s = line.trim();
			if (!s.startsWith('data:')) continue;
			const payload = s.slice(5).trim();
			if (!payload || payload === '[DONE]') continue;
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

function extractJson(text) {
	const raw = (text || '').trim();
	if (!raw) return null;
	try {
		return JSON.parse(raw);
	} catch {}
	const m = raw.match(/```json\s*([\s\S]*?)```/i) || raw.match(/```([\s\S]*?)```/);
	if (m?.[1]) {
		try {
			return JSON.parse(m[1].trim());
		} catch {}
	}
	return null;
}

function toMdReport(result, files, trimmed) {
	const findings = Array.isArray(result?.findings) ? result.findings : [];
	return `# Java 暂存区性能审查结果

- 时间: ${new Date().toLocaleString('zh-CN', { hour12: false })}
- 暂存文件数: ${files.length}
- 审查文件数: ${files.length}
- diff 是否截断: ${trimmed ? '是' : '否'}

## 总体结论
${result?.summary || '(无)'}

## Findings（${findings.length}）
${findings
	.map(
		(f, i) => `### ${i + 1}. [${f?.severity || 'unknown'}] ${f?.title || '(无标题)'}
- rule_id: ${f?.rule_id || '(无)'}
- file: ${f?.file || '(无)'}
- line: ${f?.line || '(无)'}
- confidence: ${f?.confidence || '(无)'}
- need_manual_check: ${String(!!f?.need_manual_check)}
- evidence: ${f?.evidence || '(无)'}
- impact: ${f?.impact || '(无)'}
- fix: ${f?.fix || '(无)'}
`
	)
	.join('\n')}
`;
}

function shouldFail(findings, failOn) {
	if (!failOn || failOn === 'none') return false;
	const threshold = SEVERITY_RANK[failOn];
	if (!threshold) return false;
	return findings.some((f) => {
		const rank = SEVERITY_RANK[(f?.severity || '').toLowerCase()] || 0;
		return rank >= threshold;
	});
}

function writeFileSafe(filePath, content) {
	const dir = dirname(filePath);
	if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
	fs.writeFileSync(filePath, content, 'utf8');
}

function nowStamp() {
	const d = new Date();
	const pad = (n) => String(n).padStart(2, '0');
	return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${pad(d.getHours())}${pad(
		d.getMinutes()
	)}${pad(d.getSeconds())}`;
}

async function main() {
	loadEnv();
	const args = parseArgs();
	if (args.help) return printHelp();
	const apiKey = process.env.DEEPSEEK_API_KEY;
	const baseUrl = (process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com').replace(/\/+$/, '');
	const model = args.model || process.env.DEEPSEEK_MODEL || 'deepseek-chat';
	if (!apiKey) {
		console.error('❌ 缺少 DEEPSEEK_API_KEY');
		process.exit(1);
	}

	const staged = getStagedFiles();
	const javaFiles = staged.filter((f) => JAVA_PATH_RE.test(f));
	if (!javaFiles.length) {
		console.log('ℹ 暂存区没有 Java/后端相关文件，跳过审查。');
		return;
	}
	const diff = getStagedDiffByFiles(javaFiles);
	if (!diff.trim()) {
		console.log('ℹ 目标文件无可审查 diff。');
		return;
	}

	const trimmedDiff = trimDiffText(diff, args.maxChars);
	const prompt = buildJavaPerfPrompt({
		files: javaFiles,
		diffText: trimmedDiff.text,
		trimmed: trimmedDiff.trimmed,
	});

	console.log(`🔍 Java 审查文件数: ${javaFiles.length}`);
	console.log(`📦 diff 字符数: ${diff.length}${trimmedDiff.trimmed ? `（已截断至 ${args.maxChars}）` : ''}`);
	console.log('📡 正在发送请求到 DeepSeek...');

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
		console.error(`❌ 请求失败: HTTP ${resp.status}`);
		console.error(await resp.text());
		process.exit(1);
	}

	console.log('\n===== Java 暂存区性能审查（AI） =====\n');
	const raw = await streamModelReply(resp);
	const parsed = extractJson(raw);
	if (!parsed || !Array.isArray(parsed.findings)) {
		console.error('\n❌ 模型输出不是有效 JSON，无法结构化记录。');
		if (!args.noSave) {
			const stamp = nowStamp();
			const rawPath = resolve(process.cwd(), args.outDir, `java-review-${stamp}.raw.txt`);
			writeFileSafe(rawPath, raw || '');
			console.error(`原始输出已保存: ${rawPath}`);
		}
		process.exit(1);
	}

	const findings = parsed.findings;
	const blocked = shouldFail(findings, args.failOn);

	if (!args.noSave) {
		const stamp = nowStamp();
		const jsonPath = resolve(process.cwd(), args.outDir, `java-review-${stamp}.json`);
		const mdPath = resolve(process.cwd(), args.outDir, `java-review-${stamp}.md`);
		writeFileSafe(jsonPath, JSON.stringify(parsed, null, 2));
		writeFileSafe(mdPath, toMdReport(parsed, javaFiles, trimmedDiff.trimmed));
		console.log(`\n💾 JSON 报告: ${jsonPath}`);
		console.log(`💾 MD 报告:   ${mdPath}`);
	}

	console.log(`\n✅ finding 数量: ${findings.length}`);
	if (blocked) {
		console.error(`❌ 命中阻断阈值（--fail-on ${args.failOn}），请先修复后再提交。`);
		process.exit(1);
	}
}

main().catch((err) => {
	console.error(`❌ 脚本异常: ${err?.message || err}`);
	process.exit(1);
});
