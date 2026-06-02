<!--
 * @Author: YIDA 3136271519@qq.com
 * @Date: 2025-11-25 11:53:41
 * @LastEditors: YIDA 3136271519@qq.com
 * @LastEditTime: 2025-11-27 11:40:27
 * @FilePath: \qianyi-ui\src\views\login\component\login-mode-switch.vue
 * @Description: 
 * 
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved. 
-->
<script setup lang="ts">
import { useThemeConfig } from '/@/stores/themeConfig';
import { NextLoading } from '/@/utils/loading';
import { useI18n } from 'vue-i18n';
import { formatAxis } from '/@/utils/formatTime';
import { useMessage } from '/@/hooks/message';
import { Session } from '/@/utils/storage';
import { initBackEndControlRoutes } from '/@/router/backEnd';
import { LoginTypeEnum } from '/@/api/login';
import { Monitor } from '@element-plus/icons-vue';
import Watermark from '/@/utils/wartermark';

import { useUserInfo } from '/@/stores/userInfo';
const Tenant = defineAsyncComponent(() => import('./tenant.vue'));
const Register = defineAsyncComponent(() => import('./register.vue'));
const Password = defineAsyncComponent(() => import('./password.vue'));
const Mobile = defineAsyncComponent(() => import('./mobile.vue'));
const Social = defineAsyncComponent(() => import('./social.vue'));
const Expire = defineAsyncComponent(() => import('./expire.vue'));
// 定义变量内容
const storesThemeConfig = useThemeConfig();
const { themeConfig } = storeToRefs(storesThemeConfig);
const { t } = useI18n();
const route = useRoute();
const router = useRouter();

// 登录方式
const loginType = ref(LoginTypeEnum.PASSWORD);
// 用户名
const username = ref('');
// 当前登录模式 是飞书还是用户名密码 登录
const switchLoginMode = ref<'feishu' | 'password'>('password');

// 修改登录类型
const changeLoginType = (type: LoginTypeEnum, name?: string) => {
	loginType.value = type;
	if (name) {
		username.value = name;
	}
};

// 获取布局配置信息
const getThemeConfig = computed(() => {
	return themeConfig.value;
});
// 开启水印
const setIsWartermark = () => {
	const watermarkUsername = useUserInfo().userInfos.user?.username || getThemeConfig.value.globalTitle;
	getThemeConfig.value.isWartermark ? Watermark.set(watermarkUsername) : Watermark.del();
};
// 登录成功后的跳转处理事件
const signInSuccess = async () => {
	const isNoPower = await initBackEndControlRoutes();
	if (isNoPower) {
		useMessage().warning('抱歉，您没有登录权限');
		Session.clear();
	} else {
		setIsWartermark();
		// 初始化登录成功时间问候语
		let currentTimeInfo = formatAxis(new Date());
		if (route.query?.redirect) {
			router.push({
				path: <string>route.query?.redirect,
				query: Object.keys(<string>route.query?.params).length > 0 ? JSON.parse(<string>route.query?.params) : '',
			});
		} else {
			router.push('/');
		}
		// 登录成功提示
		const signInText = t('signInText');
		useMessage().success(`${currentTimeInfo}，${signInText}`);
		// 添加 loading，防止第一次进入界面时出现短暂空白
		NextLoading.start();
	}
};
// 页面加载时初始化语言
onMounted(() => {
	NextLoading.done();
	// 判断当前是开发环境还是生产环境，开发环境不启用水印
	// 在任意 .js / .ts / .vue 文件中
	if (import.meta.env.VITE_APP_ENV === 'development') {
		switchLoginMode.value = 'password';
	} else if (import.meta.env.VITE_APP_ENV === 'production') {
		switchLoginMode.value = 'feishu';
	}
});
// 点击切换登录模式
const toggleLoginMode = () => {
	if (switchLoginMode.value === 'feishu') {
		switchLoginMode.value = 'password';
	} else {
		switchLoginMode.value = 'feishu';
	}
};
</script>

<template>
	<div class="password-label"></div>
	<div class="w-full px-5 py-12 md:w-[45%] md:px-12 relative">
		<div class="absolute top-0 right-0 flex items-center justify-between mb-12">
			<!-- 切换登录方式 -->
			<div class="icon-wrapper" @click="toggleLoginMode">
				<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" class="" v-if="switchLoginMode === 'password'">
					<path
						d="M17 29C21 29 25 26.9339 28 23.4065C36 14 41.4242 16.8166 44 17.9998C38.5 20.9998 40.5 29.6233 33 35.9998C28.382 39.9259 23.4945 41.014 19 41C12.5231 40.9799 6.86226 37.7637 4 35.4063V16.9998"
						stroke="#3370FF"
						stroke-width="4"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
					<path
						d="M5.3808 15.8669C5.02231 14.9567 3.77715 14.7261 2.86694 15.3519C1.95673 15.9777 1.72615 17.2228 2.35192 18.1331L5.64808 15.8669ZM36.0021 35.7309C36.958 35.1774 37.2843 33.9539 36.7309 32.9979C36.1774 32.042 34.9539 31.7157 33.9979 32.2691L36.0021 35.7309ZM2.35192 18.1331C5.2435 22.339 10.7992 28.144 16.8865 32.2239C19.9345 34.2667 23.217 35.946 26.449 36.7324C29.6946 37.522 33.0451 37.4428 36.0021 35.7309L33.9979 32.2691C32.2049 33.3072 29.9929 33.478 27.3947 32.8458C24.783 32.2103 21.9405 30.7958 19.1135 28.9011C13.4508 25.106 8.2565 19.661 5.64808 15.8669L2.35192 18.1331Z"
						fill="#3370FF"
					/>
					<path
						d="M33.5947 17C32.84 14.7027 30.8551 9.94054 27.5947 7H11.5947C15.2174 10.6757 23.0002 16 27.0002 24"
						stroke="#3370FF"
						stroke-width="4"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
				</svg>
				<Monitor class="w-12 h-12 text-blue-500" v-else />
			</div>
		</div>
		<div v-if="switchLoginMode === 'feishu'" class="h-96 login-content-form">
			<div class="mb-12 text-center">
				<h1 class="text-4xl font-bold text-gray-900 dark:text-white tracking-wide font-['Inter']">{{ getThemeConfig.globalTitle }}</h1>
				<!-- 租户选择 -->
				<div class="mt-6">
					<tenant class="shadow-sm" />
				</div>
				<!-- 社交登录 -->
				<social @signInSuccess="signInSuccess" @changeType="toggleLoginMode" />
			</div>
		</div>
		<div v-if="switchLoginMode === 'password'" class="h-96 login-content-form">
			<div class="mb-12 text-center">
				<h1 class="text-4xl font-bold text-gray-900 dark:text-white tracking-wide font-['Inter']">{{ getThemeConfig.globalTitle }}</h1>
				<!-- 租户选择 -->
				<div class="mt-6">
					<tenant class="shadow-sm" />
				</div>
			</div>
			<div class="w-full px-5">
				<!-- 登录表单组件 -->
				<register v-if="loginType === LoginTypeEnum.REGISTER" @change="changeLoginType" />
				<password v-if="loginType === LoginTypeEnum.PASSWORD" @signInSuccess="signInSuccess" @change="changeLoginType" />
				<mobile v-if="loginType === LoginTypeEnum.MOBILE" @signInSuccess="signInSuccess" @change="changeLoginType" />
				<expire v-if="loginType === LoginTypeEnum.EXPIRE" :username="username" @change="changeLoginType" />
			</div>
		</div>
	</div>
</template>

<style scoped lang="scss">
.icon-wrapper {
	display: flex;
	align-items: center;
	justify-content: center;
	background: #f0f5ff;
	width: 80px;
	height: 80px;
	/* 裁剪左下角 */
	clip-path: polygon(0% 0%, 100% 0%, 100% 100%);
	/* 可选：加个阴影增强折叠感 */
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
	position: relative;
	// 移入效果
	transition: all 0.3s ease-in-out;
	&:hover {
		// transform: scale(1.1);
		box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
		background: #e6f0ff;
	}
	svg {
		width: 55px;
		height: 55px;
		position: absolute;
		right: 0px;
		top: 0px;
	}
}
</style>
