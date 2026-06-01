/*
 * @Author: 朱寒松 3136271519@qq.com
 * @Date: 2025-07-30 11:14:09
 * @LastEditors: 朱寒松 3136271519@qq.com
 * @LastEditTime: 2025-07-30 17:35:35
 * @FilePath: \qianyi-ui\src\api\purchase\entity\index.ts
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
import request from '/@/utils/request';

// 分页查询
export function getEntityPage(params?: object) {
	return request({
		url: '/purchase/entity/page',
		method: 'get',
		params,
	});
}

// 新增
export function postEntitySave(data: Object) {
	return request({
		url: '/purchase/entity/save',
		method: 'post',
		data,
	});
}

// 修改
export function postEntityUpdate(data: Object) {
	return request({
		url: '/purchase/entity/update',
		method: 'post',
		data,
	});
}

// 删除
export function postEntityDelete(data: Object) {
	return request({
		url: '/purchase/entity/delete',
		method: 'post',
		data,
	});
}

// 查询详情
export function getEntityDetailInfo(data: Object) {
	return request({
		url: '/purchase/entity/detailInfo',
		method: 'get',
		params: data,
	});
}
