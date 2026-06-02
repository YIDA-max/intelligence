/*
 * @Author: YIDA zhuhansong@merach.com
 * @Date: 2026-04-11 11:16:19
 * @LastEditors: YIDA zhuhansong@merach.com
 * @LastEditTime: 2026-04-11 11:25:20
 * @FilePath: \qianyi-ui\scripts\deploy.mjs
 * @Description: 将项目根目录 html/ 同步到远端 .../qianyi-ui/html/
 *
 * Copyright (c) 2026 by ${git_name_email}, All Rights Reserved.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import { Client } from 'node-scp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');
/** 从项目根 .env.local 读取 DEPLOY_HOST / DEPLOY_PORT / DEPLOY_USER / DEPLOY_PASSWORD */
dotenv.config({
	path: path.join(projectRoot, '.env.local'),
	quiet: true,
});

/** 始终指向仓库根目录下的 html，不依赖当前工作目录 */
const localHtmlDir = path.resolve(projectRoot, 'html');
const remoteDir = '/data/merach/qianyi/release/ui/qianyi-ui/html';

/** 耗时展示（供 CLI / run-all / 实时计时行复用） */
export function formatDuration(ms) {
	const rounded = Math.round(ms);
	if (rounded < 1000) {
		return `${rounded} ms`;
	}
	const s = rounded / 1000;
	if (s < 60) {
		return `${s.toFixed(1)} 秒`;
	}
	const m = Math.floor(s / 60);
	const sec = Math.round(s % 60);
	return `${m} 分 ${sec} 秒`;
}

function formatBytes(n) {
	if (n < 1024) {
		return `${n} B`;
	}
	if (n < 1024 * 1024) {
		return `${(n / 1024).toFixed(1)} KB`;
	}
	return `${(n / (1024 * 1024)).toFixed(2)} MB`;
}

function truncateMiddle(str, maxLen) {
	if (!str || str.length <= maxLen) {
		return str;
	}
	const keep = maxLen - 1;
	const head = Math.ceil(keep / 2);
	const tail = keep - head;
	return `${str.slice(0, head)}…${str.slice(str.length - tail)}`;
}

/** 递归统计待上传文件数与总字节（与 node-scp uploadDir 覆盖范围一致：仅普通文件） */
function scanLocalHtml(rootDir) {
	let fileCount = 0;
	let byteTotal = 0;
	function walk(dir) {
		const entries = fs.readdirSync(dir, { withFileTypes: true });
		for (const e of entries) {
			const full = path.join(dir, e.name);
			if (e.isDirectory()) {
				walk(full);
			} else if (e.isFile()) {
				fileCount += 1;
				byteTotal += fs.statSync(full).size;
			}
		}
	}
	walk(rootDir);
	return { fileCount, byteTotal };
}

/**
 * 与 node-scp uploadDir 等价的递归上传，并为每个文件传入 fastPut `step` 以更新总字节进度
 */
async function uploadTreeWithProgress(
	client,
	localRoot,
	srcDir,
	destRemote,
	progress
) {
	let bytesCompleted = 0;

	async function walk(src, dest) {
		const isExist = await client.exists(dest);
		if (!isExist) {
			await client.mkdir(dest);
		} else if (isExist !== 'd') {
			throw new Error(`远程路径已存在且非目录: ${dest}`);
		}

		const entries = fs.readdirSync(src, { withFileTypes: true });
		for (const e of entries) {
			const newSrc = path.join(src, e.name);
			const newDst = path.posix.join(dest, e.name);
			if (e.isDirectory()) {
				await walk(newSrc, newDst);
			} else if (e.isFile()) {
				const rel = path.relative(localRoot, newSrc).split(path.sep).join('/');
				const st = fs.statSync(newSrc);
				progress.currentRel = rel;
				await client.uploadFile(newSrc, newDst, {
					step(totalTransferred) {
						progress.bytesDone = bytesCompleted + totalTransferred;
					},
				});
				bytesCompleted += st.size;
				progress.bytesDone = bytesCompleted;
				progress.doneFiles += 1;
				progress.currentRel = '';
			}
		}
	}

	await walk(srcDir, destRemote);
}

function formatDeploySpinnerLine(baseText, t0, progress) {
	const elapsed = formatDuration(Math.round(performance.now() - t0));
	if (progress.phase === 'connecting') {
		return `${baseText} · 已用 ${elapsed} · 正在连接服务器…`;
	}

	let pct = 0;
	if (progress.totalBytes > 0) {
		pct = Math.min(
			100,
			Math.round((progress.bytesDone / progress.totalBytes) * 100)
		);
	} else if (progress.totalFiles > 0) {
		pct = Math.min(
			100,
			Math.round((progress.doneFiles / progress.totalFiles) * 100)
		);
	} else {
		pct = 100;
	}

	const filesPart =
		progress.totalFiles > 0
			? ` · 文件 ${progress.doneFiles}/${progress.totalFiles}`
			: '';
	const relPart = progress.currentRel
		? ` · ${truncateMiddle(progress.currentRel, 36)}`
		: '';
	return `${baseText} · 已用 ${elapsed} · 总进度 ${pct}%${filesPart}${relPart}`;
}

/** 与 run-all.mjs 中 fx.spinner 一致的终端动画 */
const term = {
	reset: '\x1b[0m',
	cyan: '\x1b[36m',
};

/**
 * @param getLine 返回当前整行文案（含已用时长、总进度等）
 * @returns 调用后停止动画并清行
 */
function createSpinner(getLine) {
	const frames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
	let i = 0;
	const tick = () => {
		const line = getLine();
		process.stdout.write(
			`\r${term.cyan}${frames[(i = (i + 1) % frames.length)]}${
				term.reset
			} ${line} `
		);
	};
	tick();
	const timer = setInterval(tick, 80);
	return () => {
		clearInterval(timer);
		process.stdout.write('\r\x1b[K');
	};
}

const SPINNER_BASE = '正在连接并上传 html（大目录可能需数分钟，请勿中断）';

/**
 * 上传本地 html/ 到远端（供 run-all 或 CLI 调用）
 */
export async function deploy() {
	const host = process.env.DEPLOY_HOST ?? '192.168.200.89';
	const port = Number(process.env.DEPLOY_PORT ?? 22);
	const username = process.env.DEPLOY_USER ?? 'root';
	const password = process.env.DEPLOY_PASSWORD;
	if (!password) {
		throw new Error(
			'请在项目根目录 .env.local 中配置 DEPLOY_PASSWORD（及可选的 DEPLOY_HOST 等）'
		);
	}

	if (!fs.existsSync(localHtmlDir)) {
		throw new Error(
			`本地目录不存在: ${localHtmlDir}，请先执行构建并生成 html 目录。`
		);
	}

	const { fileCount, byteTotal } = scanLocalHtml(localHtmlDir);
	const progress = {
		phase: 'connecting',
		totalFiles: fileCount,
		totalBytes: byteTotal,
		doneFiles: 0,
		bytesDone: 0,
		currentRel: '',
	};

	const t0 = performance.now();
	let client;
	let stopSpinner = null;
	try {
		stopSpinner = createSpinner(() =>
			formatDeploySpinnerLine(SPINNER_BASE, t0, progress)
		);

		client = await Client({
			host,
			port,
			username,
			password,
		});

		progress.phase = 'uploading';
		progress.bytesDone = 0;
		await uploadTreeWithProgress(
			client,
			localHtmlDir,
			localHtmlDir,
			remoteDir,
			progress
		);

		const elapsedMs = Math.round(performance.now() - t0);
		console.log(
			`部署成功：${localHtmlDir} -> ${remoteDir}（耗时 ${formatDuration(
				elapsedMs
			)} · 共 ${fileCount} 个文件 · ${formatBytes(byteTotal)}）`
		);
	} catch (err) {
		const elapsedMs = Math.round(performance.now() - t0);
		const e = err instanceof Error ? err : new Error(String(err));
		e.deployElapsedMs = elapsedMs;
		throw e;
	} finally {
		if (stopSpinner) stopSpinner();
		client?.close();
	}
}

const thisFile = fileURLToPath(import.meta.url);
const isMain =
	process.argv[1] && path.resolve(thisFile) === path.resolve(process.argv[1]);

if (isMain) {
	deploy().catch((e) => {
		const dur =
			e && typeof e.deployElapsedMs === 'number'
				? `（耗时 ${formatDuration(e.deployElapsedMs)}）`
				: '';
		console.error(`部署失败${dur}:`, e?.message || e);
		process.exit(1);
	});
}
