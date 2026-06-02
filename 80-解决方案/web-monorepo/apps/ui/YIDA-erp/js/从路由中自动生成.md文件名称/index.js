/**
 * 从 /admin/menu 获取菜单树，生成本地目录与 .md 检查清单。
 *
 * 功能：
 * 1) 递归解析树结构，构建所有本地目录映射。
 * 2) 将结果维护到当前目录的 1.json。
 * 3) 对 path 以 /index 结尾的路由，检查 src/views 对应目录是否存在 .md 文件。
 *
 * 使用方式（PowerShell）：
 *   node "js/计算工具/从路由中自动生成.md文件名称/index.js"
 *
 * 请求配置可直接在本文件顶部修改（REQUEST_CONFIG）。
 */
/* eslint-disable no-console */
const fs = require('node:fs/promises');
const path = require('node:path');
const readline = require('node:readline');

const REQUEST_CONFIG = {
	// 直接写死请求地址（按你的环境改这里）
	baseUrl: 'http://192.168.200.218:8889/api',
	// 直接写死 token（不需要可留空）
	token: 'Bearer 0a1dc53a-98cc-43c9-a1cd-026b1a817085',
	// 直接写死租户（不需要可留空）
	tenantId: '',
};
const BASE_URL = REQUEST_CONFIG.baseUrl.replace(/\/$/, '');
const MENU_TOKEN = REQUEST_CONFIG.token;
const MENU_TENANT_ID = REQUEST_CONFIG.tenantId;

const PROJECT_ROOT = path.resolve(__dirname, '../../..');
const SRC_VIEWS_ROOT = path.join(PROJECT_ROOT, 'src', 'views');
const OUTPUT_JSON_PATH = path.join(__dirname, '1.json');
const OUTPUT_MISSING_MD_TXT_PATH = path.join(__dirname, '缺少md清单.txt');

const isObject = (val) =>
	Object.prototype.toString.call(val) === '[object Object]';

const normalizePath = (routePath) => {
	if (typeof routePath !== 'string') return '';
	return routePath.trim();
};

const toLocalDir = (routePath) => {
	const normalized = normalizePath(routePath);
	if (!normalized || !normalized.startsWith('/')) return '';
	const withoutLeadingSlash = normalized.replace(/^\//, '');
	if (withoutLeadingSlash.endsWith('/index')) {
		return path.join(
			SRC_VIEWS_ROOT,
			withoutLeadingSlash.slice(0, -'/index'.length)
		);
	}
	return path.join(SRC_VIEWS_ROOT, withoutLeadingSlash);
};

const isIndexRoute = (routePath) => normalizePath(routePath).endsWith('/index');

const dirExists = async (dirPath) => {
	try {
		const stat = await fs.stat(dirPath);
		return stat.isDirectory();
	} catch {
		return false;
	}
};

const readMdFiles = async (dirPath) => {
	try {
		const files = await fs.readdir(dirPath, { withFileTypes: true });
		return files
			.filter(
				(item) => item.isFile() && item.name.toLowerCase().endsWith('.md')
			)
			.map((item) => item.name);
	} catch {
		return [];
	}
};

const sanitizeFileName = (name) => {
	return String(name || '')
		.trim()
		.replace(/[\\/:*?"<>|]/g, '_');
};

const hasChinese = (value) => /[\u4e00-\u9fa5]/.test(String(value || ''));

const getExpectedMdName = (routeName, dirPath) => {
	const preferred = sanitizeFileName(routeName);
	if (preferred) return `${preferred}.md`;
	const dirName = sanitizeFileName(path.basename(dirPath || '')) || 'unknown';
	return `${dirName}.md`;
};

const askShouldCreateMdFiles = async () => {
	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout,
	});
	try {
		const answer = await new Promise((resolve) => {
			rl.question('是否要直接生成缺失的 .md 文件？(y/N): ', resolve);
		});
		const normalized = String(answer || '')
			.trim()
			.toLowerCase();
		return normalized === 'y' || normalized === 'yes';
	} finally {
		rl.close();
	}
};

const createMissingMdFiles = async (missingMdRoutes) => {
	let created = 0;
	let skipped = 0;
	const createdFiles = [];

	for (const item of missingMdRoutes) {
		const localDir = item?.localDir;
		if (!localDir) {
			skipped += 1;
			continue;
		}
		const mdName = getExpectedMdName(item.name, localDir);
		const targetFile = path.join(localDir, mdName);
		const fileContent = `# ${item.name || mdName.replace(/\.md$/i, '')}\n\n`;
		try {
			await fs.mkdir(localDir, { recursive: true });
			await fs.writeFile(targetFile, fileContent, {
				flag: 'wx',
				encoding: 'utf8',
			});
			created += 1;
			createdFiles.push(targetFile);
		} catch (error) {
			// 文件已存在时跳过，其它异常也不中断批量处理
			skipped += 1;
		}
	}

	return { created, skipped, createdFiles };
};

const fetchMenuTree = async () => {
	const headers = {};
	if (MENU_TOKEN) {
		headers.Authorization = MENU_TOKEN.startsWith('Bearer ')
			? MENU_TOKEN
			: `Bearer ${MENU_TOKEN}`;
	}
	if (MENU_TENANT_ID) {
		headers['TENANT-ID'] = MENU_TENANT_ID;
	}

	const response = await fetch(`${BASE_URL}/admin/menu`, {
		method: 'GET',
		headers,
	});

	if (!response.ok) {
		throw new Error(`请求失败：${response.status} ${response.statusText}`);
	}

	const payload = await response.json();
	if (Array.isArray(payload)) return payload;
	if (isObject(payload) && Array.isArray(payload.data)) return payload.data;
	throw new Error('接口返回结构异常：未找到菜单树数组');
};

const flattenMenuTree = (tree) => {
	const result = [];
	const walk = (nodes, level = 0) => {
		if (!Array.isArray(nodes)) return;
		for (const node of nodes) {
			const routePath = normalizePath(node?.path);
			const localDir = toLocalDir(routePath);
			result.push({
				id: node?.id ?? null,
				parentId: node?.parentId ?? null,
				name: node?.name ?? '',
				menuType: node?.menuType ?? '',
				path: routePath,
				level,
				localDir,
				isIndexRoute: isIndexRoute(routePath),
			});
			walk(node?.children, level + 1);
		}
	};
	walk(tree);
	return result;
};

const buildReport = async (flatList) => {
	const uniqueDirList = Array.from(
		new Set(flatList.map((item) => item.localDir).filter(Boolean))
	);

	const localDirectories = await Promise.all(
		uniqueDirList.map(async (dirPath) => ({
			dirPath,
			exists: await dirExists(dirPath),
		}))
	);

	const indexRoutesRaw = flatList.filter(
		(item) => item.isIndexRoute && item.localDir
	);
	const indexRoutes = await Promise.all(
		indexRoutesRaw.map(async (route) => {
			const exists = await dirExists(route.localDir);
			const mdFiles = exists ? await readMdFiles(route.localDir) : [];
			const expectedMdName = getExpectedMdName(route.name, route.localDir);
			const isChineseMdName = hasChinese(expectedMdName);
			return {
				id: route.id,
				name: route.name,
				path: route.path,
				menuType: route.menuType,
				localDir: route.localDir,
				expectedMdName,
				isChineseMdName,
				localDirExists: exists,
				mdExists: mdFiles.length > 0,
				mdFiles,
			};
		})
	);

	const missingMdRoutes = indexRoutes.filter(
		(item) => item.isChineseMdName && (!item.localDirExists || !item.mdExists)
	);
	const chineseIndexRoutes = indexRoutes.filter((item) => item.isChineseMdName);

	return {
		generatedAt: new Date().toISOString(),
		baseUrl: BASE_URL,
		stats: {
			totalMenus: flatList.length,
			totalLocalDirectories: localDirectories.length,
			totalIndexRoutes: indexRoutes.length,
			totalChineseIndexRoutes: chineseIndexRoutes.length,
			missingMdCount: missingMdRoutes.length,
		},
		localDirectories,
		indexRoutes,
		missingMdRoutes,
	};
};

const main = async () => {
	try {
		const menuTree = await fetchMenuTree();
		const flatList = flattenMenuTree(menuTree);
		const report = await buildReport(flatList);

		await fs.writeFile(
			OUTPUT_JSON_PATH,
			`${JSON.stringify(report, null, 2)}\n`,
			'utf8'
		);

		// 自动生成缺少 .md 的文本清单（便于直接处理）
		const missingLines = [
			'缺少.md清单',
			`总数: ${report.stats.missingMdCount}`,
			'',
			...report.missingMdRoutes.map(
				(item, index) =>
					`${index + 1}. ${item.path} -> ${item.localDir} -> ${
						item.expectedMdName
					}`
			),
		];
		await fs.writeFile(
			OUTPUT_MISSING_MD_TXT_PATH,
			`${missingLines.join('\n')}\n`,
			'utf8'
		);

		console.log(`已生成：${OUTPUT_JSON_PATH}`);
		console.log(`已生成：${OUTPUT_MISSING_MD_TXT_PATH}`);
		console.log(
			`菜单总数: ${report.stats.totalMenus}，中文Index路由: ${report.stats.totalChineseIndexRoutes}，缺少.md: ${report.stats.missingMdCount}`
		);

		if (report.stats.missingMdCount > 0) {
			const shouldCreate = await askShouldCreateMdFiles();
			if (shouldCreate) {
				const result = await createMissingMdFiles(report.missingMdRoutes);
				console.log(
					`已尝试生成缺失.md：创建 ${result.created}，跳过 ${result.skipped}`
				);
			} else {
				console.log('已跳过自动生成 .md 文件');
			}
		}
	} catch (error) {
		console.error('[生成失败]', error?.message || error);
		process.exitCode = 1;
	}
};

main();
