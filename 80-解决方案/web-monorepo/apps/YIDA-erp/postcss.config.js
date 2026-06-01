/*
 * @Author: YIDA 3136271519@qq.com
 * @Date: 2025-07-07 10:17:26
 * @LastEditors: YIDA 3136271519@qq.com
 * @LastEditTime: 2025-11-26 09:51:05
 * @FilePath: \qianyi-ui\postcss.config.js
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
// eslint-disable-next-line no-console
console.log('PostCSS 配置已加载！'); // 启动 Vite 时观察终端是否输出此日志
module.exports = {
	plugins: {
		// 新增 postcss-pxtorem（px 转 rem）
		'postcss-pxtorem': {
			// 根元素字体大小
			rootValue: 15,
			// 需要转换的 CSS 属性（* 表示所有属性，可指定具体属性如 ['width', 'height']）
			propList: ['*'],
			// 忽略的选择器（正则匹配，不转换这些类中的 px）
			selectorBlackList: ['.norem', '.ant-', '.el-icon'], // 示例：.norem 类或 ant 开头的类不转换
			// 最小转换值（小于 12px 的 px 不转换）
			minPixelValue: 12,
			// 是否转换行内样式（如 style="width: 100px"）
			// inline: false,
			// exclude: /node_modules\/(?!element-plus|element-ui)/, // 仅排除非 Element 的第三方库（正则反向匹配）
			// 可选：处理媒体查询中的 px（默认 false）
			mediaQuery: false,
			// 可选：是否严格匹配选择器（默认 false，推荐保持 false）
			strict: false,
		},
		autoprefixer: {},
		tailwindcss: {},
	},
};
