/*
 * @Author: wuyueqin wuyueqin@merach.com
 * @Date: 2025-12-14 23:14:40
 * @LastEditors: wuyueqin wuyueqin@merach.com
 * @LastEditTime: 2025-12-15 11:56:20
 * @FilePath: \qianyi-ui\scripts\vite-chunk-split.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
/**
 * Vite 分包策略配置
 * 根据 src/views 下的一级目录自动分割 chunk
 */

/**
 * 从文件路径中提取 views 下的一级目录名称
 * @param id 文件路径
 * @returns 一级目录名称或 null（返回 null 表示该模块应留在主包中）
 */
function extractViewsModule(id: string): string | null {
	// 标准化路径分隔符
	const normalizedId = id.replace(/\\/g, '/');

	// 匹配 src/views/xxx/ 格式
	const match = normalizedId.match(/\/src\/views\/([^/]+)\//);

	if (!match) {
		return null;
	}

	const moduleName = match[1];

	// 这些目录应留在主包中，不进行分包
	const mainPackageModules = ['error', 'tools', 'login'];

	if (mainPackageModules.includes(moduleName)) {
		return null; // 返回 null 表示不分包，留在主包
	}

	return moduleName;
}

/**
 * 生成 manualChunks 配置函数
 * 实现按路由模块分包，类似 Vue2 的 webpackChunkName
 * 确保全局依赖（vue-i18n 等）在主包中，避免子包加载时找不到 $t
 */
export function createManualChunks() {
	return (id: string): string | undefined => {
		// 优先处理：Vue 核心框架分包（包含 vue-i18n，确保全局依赖在主包）
		// vue-i18n 必须和 vue-core 一起，否则子包加载时找不到 $t
		if (
			id.includes('node_modules/vue') ||
			id.includes('node_modules/vue-router') ||
			id.includes('node_modules/pinia') ||
			id.includes('node_modules/vue-i18n')
		) {
			return 'vue-core';
		}

		// ECharts 分包
		if (id.includes('node_modules/echarts')) {
			return 'echarts';
		}

		// 业务代码按 views 目录分包（实现路由懒加载）
		// 注意：只分割业务代码，不分割全局依赖
		const viewsModule = extractViewsModule(id);
		if (viewsModule) {
			return `views-${viewsModule}`;
		}

		// 确保 i18n 配置、main.ts 等全局文件不被分割
		// 这些文件应该在主包中
		if (
			id.includes('/src/i18n/') ||
			id.includes('/src/main.ts') ||
			id.includes('/src/App.vue')
		) {
			return undefined; // 留在主包
		}

		// 其他业务代码不分包，使用默认策略
		return undefined;
	};
}
