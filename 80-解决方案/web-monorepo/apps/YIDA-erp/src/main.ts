/*
 * @Author: YIDA 3136271519@qq.com
 * @Date: 2025-07-07 10:17:26
 * @LastEditors: wuyueqin wuyueqin@merach.com
 * @LastEditTime: 2026-03-26 20:44:18
 * @FilePath: \qianyi-ui\src\main.ts
 * @Description:
 *
 * Copyright (c) 2026 by ${git_name_email}, All Rights Reserved.
 */
/*
 * @Description:
 */
import { createApp } from 'vue';
import pinia from '/@/stores/index';
import App from './App.vue';
import router from './router';
import { directive } from '/@/directive';
import Components from '/@/components';
import { i18n } from '/@/i18n';
import { properties } from '/@/utils/globalProperties';
import { initAntiDebug } from './utils/antiDebug';
import {
	initVersionManager,
	initGlobalErrorHandler,
} from '/@/utils/versionManager';

// Initialize anti-debug protection
initAntiDebug();
// Initialize version manager
initVersionManager();

// Initialize global error handler
initGlobalErrorHandler();

// 导入全局样式
import '/@/theme/tailwind.css';
import '/@/theme/index.scss';

const app = createApp(App);

// 全局自定方法挂载
properties(app);
// 全局自定义指令挂载
directive(app);

app
	.use(pinia) // pinia 存储
	.use(router) // 路由
	.use(Components) // 全局引入自定义的组件&第三方的组件
	.use(i18n) // 国际化
	.mount('#app');
