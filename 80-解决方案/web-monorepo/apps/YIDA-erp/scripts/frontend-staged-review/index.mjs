#!/usr/bin/env node
/* eslint-disable no-console */
import { execSync, execFileSync } from 'node:child_process';
import { resolve, dirname } from 'node:path';
import fs from 'node:fs';
import dotenv from 'dotenv';
import { buildFrontendPrompt } from './prompt.mjs';

const FE_PATH_RE =
	/\.(vue|ts|tsx|js|jsx|css|scss|less|sass|json|html|mdx?)$/i;
const SEVERITY_RANK = { critical: 4, high: 3, medium: 2, low: 1 };

function loadEnv() {
	const root = process.cwd();
	for (const file of ['.env', '.env.development']) {
		const p = resolve(root, file);
		if (fs.existsSync(p)) dotenv.config({ path: p, override: false, quiet: true });
	}
	for (const file of ['.env.local', '.env.development.local']) {
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
		outDir: get('--out-dir') || 'analysis/frontend-staged-review',
		failOn: (get('--fail-on') || 'none').toLowerCase(),
		noSave: args.includes('--no-save'),
		required: args.includes('--required'),
	};
}

function printHelp() {
	console.log(`用法:
  node scripts/frontend-staged-review/index.mjs
  node scripts/frontend-staged-review/index.mjs --fail-on high

参数:
  -m, --model        模型名称（默认 DEEPSEEK_MODEL 或 deepseek-chat）
      --max-chars    diff 最大字符数（默认 120000）
      --out-dir      报告目录（默认 analysis/frontend-staged-review）
      --fail-on      none|low|medium|high|critical
      --no-save      不保存报告
      --required     强制要求 DEEPSEEK_API_KEY，否则退出 1
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
	return execFileSync('git', ['diff', '--cached', '--no-color', '--', ...files], {
		encoding: 'utf8',
		stdio: ['ignore', 'pipe', 'pipe'],
	});
}

function trimDiffText(text, maxChars) {
	if (text.length <= maxChars) return { text, trimmed: false };
	return { text: `${text.slice(0, maxChars)}\n\n... [DIFF TOO LARGE, TRUNCATED] ...\n`, trimmed: true };
}

async function streamModelReply(resp) {
	const reader = resp.body?.getReader();
	if (!reader) return await resp.text();
	const decoder = new TextDecoder('utf-8');
	let buffer = '';
	let finalText = '';
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

function shouldFail(findings, failOn) {
	if (!failOn || failOn === 'none') return false;
	const threshold = SEVERITY_RANK[failOn];
	if (!threshold) return false;
	return findings.some((f) => (SEVERITY_RANK[(f?.severity || '').toLowerCase()] || 0) >= threshold);
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

function toMdReport(result, files, trimmed) {
	const findings = Array.isArray(result?.findings) ? result.findings : [];
	return `# 前端暂存区 AI 审查结果

- 时间: ${new Date().toLocaleString('zh-CN', { hour12: false })}
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

async function main() {
	loadEnv();
	const args = parseArgs();
	if (args.help) return printHelp();

	const staged = getStagedFiles();
	const feFiles = staged.filter((f) => FE_PATH_RE.test(f));
	if (!feFiles.length) {
		console.log('ℹ 暂存区没有前端相关文件，跳过前端 AI 审查。');
		return;
	}

	const apiKey = process.env.DEEPSEEK_API_KEY;
	if (!apiKey) {
		const msg = '⚠ 缺少 DEEPSEEK_API_KEY，跳过前端 AI 审查。';
		if (args.required) {
			console.error(msg);
			process.exit(1);
		}
		console.log(msg);
		return;
	}

	const baseUrl = (process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com').replace(/\/+$/, '');
	const model = args.model || process.env.DEEPSEEK_MODEL || 'deepseek-chat';
	const diff = getStagedDiffByFiles(feFiles);
	if (!diff.trim()) {
		console.log('ℹ 前端目标文件无可审查 diff。');
		return;
	}

	const trimmedDiff = trimDiffText(diff, args.maxChars);
	const prompt = buildFrontendPrompt({
		files: feFiles,
		diffText: trimmedDiff.text,
		trimmed: trimmedDiff.trimmed,
	});

	console.log(`🔍 前端审查文件数: ${feFiles.length}`);
	const resp = await fetch(`${baseUrl}/chat/completions`, {
		method: 'POST',
		headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
		body: JSON.stringify({ model, stream: true, messages: [{ role: 'user', content: prompt }] }),
	});
	if (!resp.ok) {
		console.error(`❌ 前端 AI 审查请求失败: HTTP ${resp.status}`);
		console.error(await resp.text());
		process.exit(1);
	}

	console.log('\n===== 前端暂存区 AI 审查结果 =====\n');
	const raw = await streamModelReply(resp);
	const parsed = extractJson(raw);
	if (!parsed || !Array.isArray(parsed.findings)) {
		console.error('\n❌ 模型输出不是有效 JSON。');
		process.exit(1);
	}
	const findings = parsed.findings;
	const blocked = shouldFail(findings, args.failOn);

	if (!args.noSave) {
		const stamp = nowStamp();
		const jsonPath = resolve(process.cwd(), args.outDir, `frontend-review-${stamp}.json`);
		const mdPath = resolve(process.cwd(), args.outDir, `frontend-review-${stamp}.md`);
		writeFileSafe(jsonPath, JSON.stringify(parsed, null, 2));
		writeFileSafe(mdPath, toMdReport(parsed, feFiles, trimmedDiff.trimmed));
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
