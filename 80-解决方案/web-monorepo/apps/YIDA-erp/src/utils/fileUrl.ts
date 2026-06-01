/*
 * @Author: YIDA 3136271519@qq.com
 * @Date: 2025-10-27 20:35:54
 * @LastEditors: YIDA zhuhansong@merach.com
 * @LastEditTime: 2026-04-29 10:32:34
 * @FilePath: \qianyi-ui\src\utils\fileUrl.ts
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
import { fileTypeFromBuffer } from 'file-type';
/**
 * 将后端返回的文件标识或站内相对路径转为当前环境可访问的完整 URL（预览/下载）。
 *
 * 兼容输入：
 * - 完整 `http(s)://...`（原样返回）
 * - 协议相对 `//host/path`（补当前页面协议）
 * - 已带 `/api/...` 的站内路径（仅拼 `origin`，不重复加 `/api`）
 * - `api/...`、`admin/sys-file/oss/...` 等缺少首斜杠的常见写法
 * - `/admin/sys-file/oss/...`（自动补 `/api` 一次再拼 `origin`）
 * - 纯加密文件名或仅文件名（走 `.../file?fileName=`）
 */
export function getFullFileUrl(fileName: string): string {
	if (fileName == null || typeof fileName !== 'string') {
		return '';
	}
	const trimmed = fileName.trim();
	if (!trimmed) {
		return '';
	}

	// 完整 http(s)
	if (/^https?:\/\//i.test(trimmed)) {
		return trimmed;
	}

	// 协议相对：//example.com/...
	if (trimmed.startsWith('//')) {
		return `${window.location.protocol}${trimmed}`;
	}

	// blob / data 等浏览器内 URL
	if (/^(blob|data):/i.test(trimmed)) {
		return trimmed;
	}

	const origin = window.location.origin;

	// 统一站内路径：api/、admin/ 常见漏写前导 /
	let path = trimmed;
	if (!path.startsWith('/') && /^(api|admin)\//.test(path)) {
		path = `/${path}`;
	}

	// 站内 OSS：已带 /api 只拼 origin；仅 /admin/sys-file/oss 时补一层 /api（不重复加）
	if (path.startsWith('/api/') || path.startsWith('/admin/sys-file/oss')) {
		const finalPath = path.startsWith('/api/') ? path : `/api${path}`;
		return `${origin}${finalPath}`;
	}

	// 其余视为纯文件名或 fileName 参数值
	return `${origin}/api/admin/sys-file/oss/file?fileName=${encodeURIComponent(
		trimmed
	)}`;
}

/**
 * 在新标签页中预览文件
 * @param fileUrl 文件地址
 */
export async function previewFile(fileUrl: string) {
	let objectUrl: string | null = null;

	try {
		const response = await fetch(fileUrl);
		if (!response.ok) throw new Error('网络请求失败');

		const arrayBuffer = await response.arrayBuffer();

		// 1. 识别 MIME 类型
		const typeInfo = await fileTypeFromBuffer(arrayBuffer);
		let mimeType = typeInfo?.mime;

		// 如果二进制没识别出来，尝试用后缀名兜底
		if (!mimeType) {
			const extension = fileUrl.split('.').pop()?.split('?')[0].toLowerCase(); // 过滤 URL 参数
			const mimeMap: Record<string, string> = {
				pdf: 'application/pdf',
				png: 'image/png',
				jpg: 'image/jpeg',
				jpeg: 'image/jpeg',
				gif: 'image/gif',
			};
			mimeType = mimeMap[extension || ''];
		}

		// 2. 核心逻辑：如果类型未知或不支持预览，直接抛错走下载
		const supportedPreview = [
			'application/pdf',
			'image/png',
			'image/jpeg',
			'image/gif',
		];

		if (!mimeType || !supportedPreview.includes(mimeType)) {
			throw new Error('类型未知或不支持预览');
		}

		// 3. 尝试打开新窗口预览
		const previewBlob = new Blob([arrayBuffer], { type: mimeType });
		objectUrl = URL.createObjectURL(previewBlob);
		const newWindow = window.open(objectUrl, '_blank');

		if (!newWindow) {
			throw new Error('窗口被浏览器拦截');
		}

		// 4. 资源回收
		// 建议：对于新标签页预览，稍长一点的延迟更保险
		setTimeout(() => {
			if (objectUrl) URL.revokeObjectURL(objectUrl);
		}, 5000);
	} catch (error) {
		// 🚨 只要上方任何环节出错（包括类型匹配不到），均执行下载
		// console.warn('预览失败，转为下载:', error);
		downloadFile(fileUrl);
	}
}
/**
 * 触发下载的辅助函数
 * @param url 文件地址
 */
function downloadFile(url: string) {
	const a = document.createElement('a');
	a.href = url;
	// 如果知道文件名可以加上 a.download = 'filename';
	a.style.display = 'none';
	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);
}
