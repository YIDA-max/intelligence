/*
 * @Author: YIDA 3136271519@qq.com
 * @Date: 2025-08-15 09:47:25
 * @LastEditors: YIDA zhuhansong@merach.com
 * @LastEditTime: 2026-04-11 16:34:24
 * @FilePath: \qianyi-ui\src\api\admin\legalEntity\index.ts
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
import request from '/@/utils/request';

/**
 * 法人主体分页列表
 * @param query
 * @returns
 */
export function getLegalEntityList(data?: object) {
	return request({
		url: '/admin/legalPerson/page',
		method: 'post',
		data,
	});
}
/**
 * 法人主体详情
 * @param id
 * @returns
 * */
export function getLegalEntityDetail(params: object) {
	return request({
		url: `/admin/legalPerson/detailInfo`,
		method: 'get',
		params: params,
	});
}
/**
 * 法人主体新增
 * @param data
 * @returns
 */
export function postLegalEntitySave(data: Object) {
	return request({
		url: '/admin/legalPerson/save',
		method: 'post',
		data: data,
		loadingConfig: {
			loading: true,
			text: '保存中...',
			background: 'rgba(255, 255, 255, 0.7)',
		},
	});
}
/**
 * 法人主体修改
 * @param data
 * @returns
 */
export function postLegalEntityUpdate(data: Object) {
	return request({
		url: '/admin/legalPerson/update',
		method: 'post',
		data: data,
		loadingConfig: {
			loading: true,
			text: '保存中...',
			background: 'rgba(255, 255, 255, 0.7)',
		},
	});
}
/**
 * 法人主体下拉框
 * @param id
 * @returns
 */

type DebounceConfig = {
	delay?: number;
	enable?: boolean;
};
export function getLegalEntitySelect(
	params: object,
	debounceConfig?: DebounceConfig
) {
	return request({
		url: '/admin/legalPerson/selectList',
		method: 'get',
		params: params,
		debounceConfig: {
			delay: 300,
			enable: true, // 默认开启防抖
			...debounceConfig, // 传了就覆盖
		},
	});
}
