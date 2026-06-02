/*
 * @Author: YIDA 3136271519@qq.com
 * @Date: 2025-11-28 16:37:38
 * @LastEditors: YIDA 3136271519@qq.com
 * @LastEditTime: 2025-11-28 16:55:05
 * @FilePath: \qianyi-ui\config\vite-config\src\utils\params.ts
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
import { ConfigEnv, loadEnv } from 'vite';

import dns from 'node:dns';
dns.setDefaultResultOrder('verbatim');
/**
 *  获取环境参数
 * @param mode ConfigEnv
 * @returns
 */
export const getParams = (mode: ConfigEnv): { [key: string]: any } => {
	// 加载环境变量
	const env = loadEnv(mode.mode, process.cwd());

	// 如果是开发就不需要改请求源
	const isChangeOrigin = mode.mode === 'development' ? false : true;
	// 如果是生产就不需要校验证书
	const isSecure = mode.mode === 'development' ? false : true;

	// 解析代理配置，假设 VITE_ADMIN_PROXY_INFO 是一个包含代理配置的 JSON 字符串
	const adminProxyInfo = JSON.parse(env.VITE_ADMIN_PROXY_INFO || '[]');
	const portArg = process.argv[3]; // 获取端口号，比如 8888
	const info = adminProxyInfo.find(
		(item: any) => item.port === Number(portArg)
	);

	// 判断是否开发环境
	const isDev = mode.mode === 'development' ? true : false;
	const args = process.argv.slice(2);
	const isAnalyze = args.includes('analyze') || args.includes('report');
	const modeName =
		mode.mode === 'development'
			? '开发环境'
			: mode.mode === 'production'
			? '打包环境'
			: mode.mode === 'analyze'
			? '打包分析环境'
			: mode.mode === 'docker'
			? 'Docker 生产环境'
			: '未知环境';

	console.log('==================== 环境变量 ====================');
	console.log('mode:', mode.mode);
	console.log('当前环境:', modeName);
	console.log('是否开启打包分析', isAnalyze);
	console.log('当前传入的参数', args);
	console.log('当前执行的 npm 脚本命令', process.env.npm_lifecycle_event);
	console.log('传入的端口号:', portArg ? portArg : '无');
	console.log('当前匹配的值:', info ? info : '无');

	// 根据传入的端口号和匹配信息决定使用哪个配置，没有传入则使用默认配置
	const port = portArg && info ? info.port : env.VITE_PORT;
	const playPath = portArg && info ? info.path : env.VITE_ADMIN_PROXY_PATH;
	return {
		isDev,
		isAnalyze,
		modeName,
		args,
		port,
		playPath,
		isChangeOrigin,
		isSecure,
		adminProxyInfo,
		info,
		env,
	};
};
