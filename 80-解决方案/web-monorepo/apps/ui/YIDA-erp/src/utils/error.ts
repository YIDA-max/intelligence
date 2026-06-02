import { ElMessageBox } from 'element-plus';

/*
 * @Author: YIDA 3136271519@qq.com
 * @Date: 2025-12-05 15:40:10
 * @LastEditors: YIDA 3136271519@qq.com
 * @LastEditTime: 2025-12-05 15:41:25
 * @FilePath: \qianyi-ui\src\utils\error.ts
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
/**
 * 处理全局错误
 * 如果是模块加载失败、CSS 预加载失败、HTML 预加载失败，则提示用户刷新页面
 * @param error
 */
export const errorHandler = (error: Error) => {
	// 过滤目标错误类型（模块加载失败 或 CSS 预加载失败 或 HTML 预加载失败）
	const isModuleLoadError = error.message.includes(
		'Failed to fetch dynamically imported module'
	);
	const isCssError = error.message.includes('Unable to preload CSS');
	const isHtmlError = error.message.includes(
		'Expected a JavaScript-or-Wasm module script but the server responded with a MIME type of "text/html"'
	);

	if (isModuleLoadError || isCssError || isHtmlError) {
		// 记录错误日志（开发调试用）
		// console.error('资源加载失败:', error);
		// 弹窗提示用户，并提供刷新选项
		ElMessageBox({
			title: '加载失败',
			message: '当前页面资源（组件/CSS/HTML）加载失败，请尝试重新刷新页面',
			type: 'warning', // 警告样式
			showCancelButton: true, // 显示取消按钮（可选）
			confirmButtonText: '重新刷新', // 确认按钮文本
			cancelButtonText: '取消', // 取消按钮文本（可选）
			beforeClose: (action, instance, done) => {
				// 用户点击确认按钮时触发刷新
				if (action === 'confirm') {
					// 延迟关闭弹窗并刷新（可选，确保用户看到提示）
					setTimeout(() => {
						window.location.reload(); // 强制刷新页面
						done(); // 关闭弹窗
					}, 500);
				} else {
					done(); // 点击取消时直接关闭弹窗
				}
			},
		});
	}
};
