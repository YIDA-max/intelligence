<template>
	<el-form size="large" class="login-content-form" ref="loginFormRef">
		<div class="text-center text-gray-600 font16 mt10 login-animation1 login-msg">{{ $t('feishu.user') }}</div>
		<el-form-item class="mt-4 login-animation2">
			<el-button type="primary" class="rounded-lg h-14 login-content-submit" v-waves @click="handleClick(SocialLoginEnum.FEISHU)">
				<el-icon><Promotion /></el-icon> <span class="font-normal">{{ $t('feishu.text') }}</span>
			</el-button>
		</el-form-item>
		<div class="mt-1 text-center font12 login-animation3 login-msg text-slate-600">{{ $t('feishu.jumpTo') }}</div>
		<!-- 分割线 -->
		<div class="flex items-center justify-center mt-12 mb-4 space-x-3 login-animation4">
			<span class="w-20 h-[1.5px] bg-gray-200 dark:bg-slate-600"></span>
			<span class="text-gray-600 dark:text-slate-600">{{ $t('feishu.else') }}</span>
			<span class="w-20 h-[1.5px] bg-gray-200 dark:bg-slate-600"></span>
		</div>
		<el-button type="" class="login-animation4" v-waves @click="handleChangeType">
			<el-icon><Monitor /></el-icon> <span class="font-normal">{{ $t('feishu.passwordLogin') }}</span>
		</el-button>
	</el-form>
</template>

<script setup lang="ts" name="loginSocial">
import Cookies from 'js-cookie';
import other from '/@/utils/other';
import { getLoginAppList } from '/@/api/admin/social';
import { useMessage } from '/@/hooks/message';
import { useI18n } from 'vue-i18n';
import { validateNull } from '/@/utils/validate';
import { SocialLoginEnum } from '/@/api/login';
// 使用i18n
const { t } = useI18n();

/**
 * 执行跳转事件的函数。
 * @event signInSuccess
 */
const emit = defineEmits(['signInSuccess', 'changeType']);

/**
 * 存储弹出窗口实例的 Ref 对象。
 */
const winOpen = ref();

/**
 * 计时器对象，用于检查弹出窗口是否关闭。
 */
const timer = ref();

/**
 * 点击按钮触发事件的回调函数，用于打开第三方登录授权页面。
 * @param thirdpart - 第三方平台类型
 */
const handleClick = async (thirdpart: SocialLoginEnum) => {
	// 获取租户配置的账号信息
	const { data } = await getLoginAppList();
	const result = data.find((item: any) => item.type === thirdpart);
	if (validateNull(result)) {
		useMessage().error(t('scan.appErrorTip'));
		return;
	}

	// 拼接授权回调地址
	let url: string = '';
	const redirect_uri = encodeURIComponent(window.location.origin + '/#/authredirect');

	// 企业微信登录
	if (thirdpart === SocialLoginEnum.WEIXIN_CP) {
		url = `https://open.work.weixin.qq.com/wwopen/sso/qrConnect?appid=${result.appId}&agentid=${result.ext}&redirect_uri=${redirect_uri}&state=${SocialLoginEnum.WEIXIN_CP}-LOGIN`;
	}

	// 钉钉登录
	if (thirdpart === SocialLoginEnum.DINGTALK) {
		url = `https://login.dingtalk.com/oauth2/auth?redirect_uri=${redirect_uri}&response_type=code&client_id=${result.appId}&scope=openid&state=${SocialLoginEnum.DINGTALK}-LOGIN&prompt=consent`;
	}

	// 飞书登录
	if (thirdpart === SocialLoginEnum.FEISHU) {
		url = `https://passport.feishu.cn/suite/passport/oauth/authorize?client_id=${result.appId}&redirect_uri=${redirect_uri}&response_type=code&state=${SocialLoginEnum.FEISHU}-LOGIN&scope=contact:user.phone,contact:user.email,contact:user.base`;
	}

	// 打开授权窗口并存储实例
	winOpen.value = other.openWindow(url, thirdpart, 540, 540);
};

/**
 * 页面加载后执行的函数，用于检查窗口是否关闭。
 */
onMounted(() => {
	// 动态获取所属租户的企业微信应用信息和钉钉应用信息

	timer.value = window.setInterval(() => {
		// 检查弹出窗口是否已关闭
		if (winOpen.value && winOpen.value.closed == true) {
			// 停止计时器
			window.clearInterval(timer.value);
			if (Cookies.get('token')) {
				emit('signInSuccess');
			}
		}
	}, 500);
});

/**
 * 切换到密码登录模式的函数。
 */
const handleChangeType = () => {
	emit('changeType', 'password');
};
</script>

<style scoped lang="sass">
// .handwritten {
// 	font-family: 'Brush Script MT', cursive
// }
</style>
