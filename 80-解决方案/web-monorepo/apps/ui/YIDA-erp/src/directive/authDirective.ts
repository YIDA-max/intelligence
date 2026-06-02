/*
 * @Author: YIDA zhuhansong@merach.com
 * @Date: 2025-07-07 10:17:26
 * @LastEditors: YIDA zhuhansong@merach.com
 * @LastEditTime: 2026-03-31 11:49:58
 * @FilePath: \qianyi-ui\src\directive\authDirective.ts
 * @Description:
 *
 * Copyright (c) 2026 by ${git_name_email}, All Rights Reserved.
 */
/*
 * @Description:
 */
import type { App } from 'vue';
import { useUserInfo } from '/@/stores/userInfo';
import { judementSameArr } from '/@/utils/arrayOperation';

/**
 * 用户权限指令
 * @directive 单个权限验证（v-auth="xxx"）
 * @directive 多个权限验证，满足一个则显示（v-auths="[xxx,xxx]"）
 * @directive 多个权限验证，全部满足则显示（v-auth-all="[xxx,xxx]"）
 */
export function authDirective(app: App) {
	// 单个权限验证（v-auth="xxx"）
	app.directive('auth', {
		mounted(el, binding) {
			const stores = useUserInfo();
			if (
				!stores.userInfos.authBtnList.some((v: string) => v === binding.value)
			)
				// 不直接删除元素，而是隐藏元素
				el.style.display = 'none';
		},
	});
	// 多个权限验证，满足一个则显示（v-auths="[xxx,xxx]"）
	app.directive('auths', {
		mounted(el, binding) {
			let flag = false;
			const stores = useUserInfo();
			stores.userInfos.authBtnList.map((val: string) => {
				binding.value.map((v: string) => {
					if (val === v) flag = true;
				});
			});
			// 不直接删除元素，而是隐藏元素
			if (!flag) el.style.display = 'none';
		},
	});
	// 多个权限验证，全部满足则显示（v-auth-all="[xxx,xxx]"）
	app.directive('auth-all', {
		mounted(el, binding) {
			const stores = useUserInfo();
			const flag = judementSameArr(binding.value, stores.userInfos.authBtnList);
			// 不直接删除元素，而是隐藏元素
			if (!flag) el.style.display = 'none';
		},
	});
}
