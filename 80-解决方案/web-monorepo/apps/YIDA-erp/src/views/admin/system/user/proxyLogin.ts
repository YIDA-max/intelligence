import { Session } from '/@/utils/storage';
import { initBackEndControlRoutes } from '/@/router/backEnd';
import { useUserInfo } from '/@/stores/userInfo';
import { useThemeConfig } from '/@/stores/themeConfig';
import Watermark from '/@/utils/wartermark';
import { formatAxis } from '/@/utils/formatTime';
import { useMessage } from '/@/hooks/message';
import { NextLoading } from '/@/utils/loading';
import request from '/@/utils/request';
const quickLoginApi = (userId: string) => {
	const token = Session.getToken();
	return request({
		url: 'admin/user/quickLogin',
		method: 'post',
		data: { id: userId },
		headers: {
			Authorization: `Bearer ${token}`,
			'Enc-Flag': 'false',
		},
	});
};

export const quickLogin = async (userId: string) => {
	//basicAuth
	const basicAuth =
		'Basic ' + window.btoa(import.meta.env.VITE_OAUTH2_PASSWORD_CLIENT);
	Session.set('basicAuth', basicAuth);

	// 代登录
	const res = await quickLoginApi(userId);

	if (res?.code !== 0) {
		throw new Error(res?.msg || '代登录失败');
	}

	//  覆盖token
	Session.set('token', res.data.accessToken.tokenValue);
	Session.set('refresh_token', res.data.refreshToken.tokenValue);

	// 原来的啥
	const isNoPower = await initBackEndControlRoutes();
	if (isNoPower) {
		Session.clear();
		throw new Error('抱歉，您没有登录权限');
	}

	// 水印
	const { themeConfig } = useThemeConfig();
	const username =
		useUserInfo().userInfos.user?.username || themeConfig.globalTitle;

	themeConfig.isWartermark ? Watermark.set(username) : Watermark.del();

	// 登录提示
	const timeText = formatAxis(new Date());
	useMessage().success(`${timeText}，登录成功`);

	//放行
	NextLoading.start();
};
