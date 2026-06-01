<!--
 * @Author: YIDA 3136271519@qq.com
 * @Date: 2025-07-07 10:17:26
 * @LastEditors: YIDA 3136271519@qq.com
 * @LastEditTime: 2025-11-25 13:56:43
 * @FilePath: \qianyi-ui\src\views\login\index.vue
 * @Description: 
 * 
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved. 
-->
<template>
	<div class="flex items-center justify-center min-h-screen px-5 py-5 bg-gray-100 dark:bg-slate-900 min-w-screen">
		<!-- 右上角控制组件 -->
		<Control />

		<div
			class="w-full overflow-hidden bg-white border border-gray-200 shadow-lg dark:bg-slate-800 rounded-3xl dark:border-slate-700"
			style="max-width: 1000px"
		>
			<div class="w-full md:flex">
				<!-- 左侧插图区域 -->
				<div
					class="hidden w-[55%] bg-gradient-to-br from-blue-400 via-blue-300 to-blue-200 dark:from-slate-800 dark:via-slate-700 dark:to-slate-900/95 md:flex md:items-center md:justify-center"
				>
					<img
						class="w-[85%] h-auto max-h-[650px] object-contain opacity-100 dark:opacity-75 transition-opacity duration-300 hover:opacity-90"
						:src="!themeConfig.background ? illustration : baseURL + themeConfig.background"
						alt="Login illustration"
					/>
				</div>

				<!-- 右侧登录表单区域 -->
				<LoginModeSwitch />
			</div>
		</div>

		<!-- 小程序二维码 -->
		<Qrcode />

		<!-- Footer 组件 -->
		<Footer />
	</div>
</template>

<script setup lang="ts" name="loginIndex">
import { useThemeConfig } from '/@/stores/themeConfig';
import illustration from '/@/assets/login/login_bg.svg';

// 引入组件

const Control = defineAsyncComponent(() => import('./component/control.vue'));
const Qrcode = defineAsyncComponent(() => import('./component/qrcode.vue'));
const Footer = defineAsyncComponent(() => import('./component/footer.vue'));
const LoginModeSwitch = defineAsyncComponent(() => import('./component/login-mode-switch.vue'));

// 定义变量内容
const storesThemeConfig = useThemeConfig();
const { themeConfig } = storeToRefs(storesThemeConfig);
</script>
