/*
 * @Author: YIDA 3136271519@qq.com
 * @Date: 2025-11-12 18:25:12
 * @LastEditors: YIDA 3136271519@qq.com
 * @LastEditTime: 2025-11-12 18:32:36
 * @FilePath: \qianyi-ui\src\utils\getImageUrl.ts
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
// 1. 定义允许的键名类型（根据你的实际值修改）
type ImageKey = 'avatar' | 'logo' | 'banner' | 'success_icon' | 'error_icon';

// 2. 创建键到图片路径的映射对象
const ImagePathMap: Record<ImageKey, string> = {
	avatar: '/@/src/assets/images/avatar.png',
	logo: '/@/src/assets/images/logo.png',
	banner: '/@/src/assets/images/home/banner.jpg',
	success_icon: '/@/src/assets/icons/status/success.svg',
	error_icon: '/@/src/assets/icons/status/error.svg',
} as const; // 'as const' 确保路径是字面量类型

// 3. 核心函数：根据键获取图片URL
function getImageUrl(key: ImageKey): string {
	// 使用 Vite 推荐的方式动态构造 URL [1,4](@ref)
	return new URL(ImagePathMap[key], import.meta.url).href;
}

// 导出函数和类型，方便在其他文件中使用
export { getImageUrl, type ImageKey };
