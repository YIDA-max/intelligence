/*
 * @Author: YIDA 3136271519@qq.com
 * @Date: 2025-07-07 10:17:26
 * @LastEditors: YIDA zhuhansong@merach.com
 * @LastEditTime: 2026-06-01 16:44:06
 * @FilePath: \qianyi-ui\apps\qianyi-erp\vite.config.ts
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
/* eslint-disable no-console */
import { defineConfig, ConfigEnv } from 'vite';
// @ts-ignore
import dns from 'node:dns';
import { getConfig } from './config/vite-config/index.ts';
dns.setDefaultResultOrder('verbatim');

const viteConfig = defineConfig((mode: ConfigEnv) => {
	// 获取 Vite 配置
	const config = getConfig(mode, {});
	return config;
});

export default viteConfig;
