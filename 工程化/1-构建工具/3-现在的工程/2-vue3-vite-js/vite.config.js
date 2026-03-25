import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { fileURLToPath, URL } from 'node:url';
export default defineConfig({
	// 插件
	plugins: [
		// 解析vue文件
		vue(),
	],
	// 开发服务器配置
	server: {
		port: 3001,
		open: true,
	},
	// 构建配置
	build: {
		// 打包输出目录
		outDir: 'dist',
	},
	// 解析路径
	resolve: {
		// 路径别名
		alias: {
			'@': fileURLToPath(new URL('./src', import.meta.url)),
		},
	},
});
