import { httpService } from '/@/utils/request';
import { BUSINESS_CODE } from '/@/utils/api/hooks/config';
import mammoth from 'mammoth';
import * as XLSX from 'xlsx';

/**
 * Axios 封装在成功后返回的是二进制本体（拦截器已对 response.data 解包），
 * 出错时则会返回带 code/msg 的统一结构，不会是 fetch 那种带 .arrayBuffer() 的对象。
 */
function unwrapHttpServiceArrayBuffer(
	raw: unknown,
	fallbackMsg: string
): ArrayBuffer {
	if (raw instanceof ArrayBuffer) {
		return raw;
	}
	if (raw !== null && typeof raw === 'object') {
		const envelope = raw as {
			code?: number;
			msg?: string;
			data?: unknown;
		};
		if (
			typeof envelope.code === 'number' &&
			envelope.code !== BUSINESS_CODE.SUCCESS
		) {
			throw new Error(envelope.msg || fallbackMsg);
		}
		if (envelope.data instanceof ArrayBuffer) {
			return envelope.data;
		}
	}
	throw new Error(fallbackMsg);
}

/**
 * 根据文件地址获取pdf预览URL
 * @param fileUrl 文件地址
 */
export async function getPdfPreviewUrlByFileUrl(fileUrl: string) {
	let objectUrl: string | null = null;

	const raw = await httpService.get<ArrayBuffer>(fileUrl, {
		responseType: 'arraybuffer',
	});
	const arrayBuffer = unwrapHttpServiceArrayBuffer(raw, '获取文件失败');

	const mimeType = 'application/pdf';

	const previewBlob = new Blob([arrayBuffer], { type: mimeType });
	objectUrl = URL.createObjectURL(previewBlob) + '#toolbar=1&view=FitH';
	return objectUrl;
}

/**
 * 拉取 xlsx/xls 并转为首张工作表的 HTML，供对话框内预览
 */
export async function getExcelPreviewHtml(fileUrl: string): Promise<string> {
	const raw = await httpService.get<ArrayBuffer>(fileUrl, {
		responseType: 'arraybuffer',
	});
	const arrayBuffer = unwrapHttpServiceArrayBuffer(raw, '读取 Excel 失败');

	const workbook = XLSX.read(arrayBuffer, { type: 'array' });
	const firstName = workbook.SheetNames[0];
	if (!firstName) {
		return '<p class="excel-preview-empty">工作簿为空</p>';
	}
	const sheet = workbook.Sheets[firstName];
	return XLSX.utils.sheet_to_html(sheet);
}

/**
 * 拉取 docx，用 mammoth 转为 HTML。.doc（OLE 二进制旧格式）浏览器端无法稳健解析，需下载本地打开。
 */
export async function getWordPreviewHtml(fileUrl: string): Promise<string> {
	const extGuess = fileUrl.split('.').pop()?.split('?')[0]?.toLowerCase() ?? '';
	if (extGuess === 'doc') {
		throw new Error(
			'.doc（旧二进制格式）暂不支持预览，请下载后使用 Word 打开；可改用 .docx'
		);
	}

	const raw = await httpService.get<ArrayBuffer>(fileUrl, {
		responseType: 'arraybuffer',
	});
	const arrayBuffer = unwrapHttpServiceArrayBuffer(raw, '读取 Word 失败');

	const { value } = await mammoth.convertToHtml({
		arrayBuffer,
	});

	if (!value?.trim()) {
		return '<p class="word-preview-empty">文档无正文内容或格式无法解析</p>';
	}
	return value;
}

/**
 * 在新标签页打开文件地址（由浏览器决定对 PDF/图片等资源是预览还是下载）
 */
export function downloadFile(url: string) {
	const trimmed = url.trim();
	if (!trimmed) {
		return;
	}
	window.open(trimmed, '_blank', 'noopener,noreferrer');
}
