/*
 * @Author: YIDA 3136271519@qq.com
 * @Date: 2025-11-12 09:52:03
 * @LastEditors: YIDA 3136271519@qq.com
 * @LastEditTime: 2026-01-20 15:22:01
 * @FilePath: \qianyi-ui\src\utils\api\hooks\download.ts
 * @Description: 文件下载处理钩子
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
import { AxiosResponse } from 'axios';
import { handleBlobFile } from '/@/utils/other';
import { useMessage } from '/@/hooks/message';
import { BUSINESS_CODE, type IResponse } from './config';

// 文件名提取结果接口
interface IFileNameResult {
	fileName: string;
	success: boolean;
}

const useDownload = () => {
	/**
	 * 从 Content-Disposition 响应头中提取文件名
	 * @param contentDisposition - Content-Disposition 响应头的值
	 * @returns 提取结果，包含文件名和是否成功
	 */
	const extractFileName = (
		contentDisposition: string | undefined
	): IFileNameResult => {
		if (!contentDisposition) {
			return { fileName: '未命名文件', success: false };
		}

		// 优先尝试提取 UTF-8 编码的文件名 (RFC 5987)
		// 格式: filename*=utf-8''%E6%96%87%E4%BB%B6%E5%90%8D.xlsx
		const utf8Match = contentDisposition.match(/filename\*=utf-8''(.+)/i);
		if (utf8Match && utf8Match[1]) {
			try {
				const fileName = decodeURIComponent(utf8Match[1]);
				return { fileName, success: true };
			} catch (error) {
				// UTF-8 解码失败，尝试其他方式
			}
		}

		// 尝试提取普通文件名
		// 格式: filename="文件名.xlsx" 或 filename=文件名.xlsx
		const normalMatch = contentDisposition.match(
			/filename=["']?([^"';]+)["']?/i
		);
		if (normalMatch && normalMatch[1]) {
			try {
				const fileName = decodeURIComponent(normalMatch[1]);
				return { fileName, success: true };
			} catch (error) {
				// 解码失败，直接使用原始文件名
				return { fileName: normalMatch[1], success: true };
			}
		}

		return { fileName: '未命名文件', success: false };
	};

	/**
	 * 检查 Blob 响应是否为 JSON 错误响应
	 * @param blob - Blob 对象
	 * @param contentType - Content-Type 响应头
	 * @returns 如果是错误响应则返回错误信息，否则返回 null
	 */
	const checkBlobError = async (
		blob: Blob,
		contentType: string
	): Promise<IResponse | null> => {
		// 如果 Content-Type 是 application/json，说明可能是错误响应
		if (!contentType.includes('application/json')) {
			return null;
		}

		try {
			const text = await blob.text();
			const jsonData = JSON.parse(text);

			// 检查是否为错误响应（code !== 0）
			if (
				jsonData?.code !== undefined &&
				jsonData.code !== BUSINESS_CODE.SUCCESS
			) {
				const errorMsg = jsonData?.msg || '文件下载失败，请联系管理员';
				useMessage().error(errorMsg);
				return {
					code: jsonData.code,
					data: null,
					msg: errorMsg,
				};
			}
		} catch (error) {
			// JSON 解析失败，说明不是 JSON 格式，按正常文件处理
		}
		return null;
	};

	/**
	 * 处理文件下载响应
	 * - 自动检测是否为 Blob 下载请求
	 * - 处理 JSON 错误响应（如果后端返回错误）
	 * - 自动提取文件名并触发下载
	 * - 返回统一格式 { code, data, msg }
	 *
	 * @param response - Axios 响应对象
	 * @returns Promise<IResponse | void> - 如果是错误则返回错误信息，否则返回 void
	 */
	const downloadFile = async (
		response: AxiosResponse
	): Promise<IResponse | void> => {
		// 判断是否为 Blob 下载请求
		if (response.request.responseType !== 'blob') {
			return;
		}

		// 确保响应数据是 Blob 类型
		if (!(response.data instanceof Blob)) {
			// 响应类型为 blob 但数据不是 Blob 对象
			return;
		}

		const contentType = response.headers['content-type'] || '';
		const contentDisposition = response.headers['content-disposition'];

		// 检查是否为 JSON 错误响应
		const errorResponse = await checkBlobError(response.data, contentType);
		if (errorResponse) {
			return errorResponse;
		}

		// 提取文件名
		const { fileName } = extractFileName(contentDisposition);

		// 触发文件下载
		try {
			handleBlobFile(response.data, fileName);
		} catch (error) {
			useMessage().error('文件下载失败，请重试');
			return {
				code: BUSINESS_CODE.UNKNOWN_ERROR,
				data: null,
				msg: '文件下载失败',
			};
		}
	};

	return { downloadFile };
};

export { useDownload };
