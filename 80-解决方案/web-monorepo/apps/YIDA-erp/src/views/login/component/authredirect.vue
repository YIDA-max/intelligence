<script setup lang="ts" name="authredirect">
import request from '/@/utils/request';
import other from '/@/utils/other';
import { validateNull } from '/@/utils/validate';
import { Session } from '/@/utils/storage';
import { useUserInfo } from '/@/stores/userInfo';
import { useMessageBox } from '/@/hooks/message';

/**
 * 加载完成后执行的函数，用于处理授权回调。
 */
onMounted(async () => {
	// 获取 URL 参数，获取 code 参数，获取不到则换成 ticket
	// 兼容飞书，不动旧代码
	let url, code, state, type;
	url = window.location.href;
	state = other.getQueryString(url, 'state');
	type = state.split('-')[1];
	if (type.includes('#/authredirect')) {
		type = type.split('#')[0];
	}
	state = state.split('-')[0];
	code = other.getQueryString(url, 'code');
	if (type === 'FEISHU') {
		const search = window.location.search;
		url = `${window.location.origin}/#/authredirect${search}`;
	} else {
		url = window.location.href
			.replace('#/authredirect', '')
			.replaceAll('/', '');

		if (validateNull(code)) {
			code = other.getQueryString(url, 'ticket');
		}

		if (validateNull(code)) {
			code = other.getQueryString(url, 'authCode');
		}
	}

	// 发送登录请求，如果 type 为 LOGIN，则为登录操作，否则为绑定操作
	if (type === 'LOGIN') {
		Session.clear();
		const res = await useUserInfo().loginBySocial(state, code);
		if (res?.code && res?.code !== 0) {
			useMessageBox()
				.confirm('qianyi账号邮箱与飞书邮箱未匹配')
				.then(() => {
					Session.clear();
					window.close();
					window.location.href = '/';
					throw new Error(res?.msg || '登录失败');
				});
		} else {
			window.close();
		}
	} else {
		bind(state, code);
	}
});

/**
 * 绑定社交账号。
 * @param state - 登录参数
 * @param code - 授权码
 */
const bind = (state: string, code: string) => {
	request({
		url: '/admin/social/bind',
		method: 'post',
		params: { state, code },
	}).then(() => {
		useMessageBox()
			.confirm('社交账号绑定成功')
			.then(() => {
				window.close();
			});
	});
};
</script>
