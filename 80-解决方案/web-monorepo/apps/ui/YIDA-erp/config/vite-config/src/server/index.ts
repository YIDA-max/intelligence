import { env } from 'process';
import type { ServerOptions } from 'vite';

export const defaultServer = (
	port: string | number,
	playPath: string,
	_isChangeOrigin: boolean,
	isSecure: boolean,
	options: { customServer?: Partial<ServerOptions> }
): ServerOptions => {
	const server: ServerOptions = {
		host: '0.0.0.0', // 服务器地址
		port: port as unknown as number, // 服务器端口号
		open: env.VITE_OPEN === 'true', // 是否自动打开浏览器
		hmr: true, // 启用热更新
		...options.customServer, // 允许自定义服务器配置
		proxy: {
			'/api': {
				target: playPath, // 目标服务器地址（可能无协议也没关系）
				ws: true, // 是否启用 WebSocket
				changeOrigin: true, // 是否修改请求源 // alb是需要进行验证的所以是ture
				secure: isSecure, // 忽略证书验证 // 如果是正式环境就需要改为false
				rewrite: (path) => {
					const t = String(playPath || '');
					const is8888 = /(?:^|:)(8888)(?:\/|$)/.test(t); // 目标地址端口是否为 8888
					return is8888 ? path : path.replace(/^\/api(?=\/|$)/, '');
				},
			},

			'^/ws/info/.*': {
				target: playPath, // 目标服务器地址
				ws: true, // 是否启用 WebSocket
				changeOrigin: true,
			},
			// 允许添加自定义代理
			...(options.customServer?.proxy || {}),
		},
	};
	return server;
};
