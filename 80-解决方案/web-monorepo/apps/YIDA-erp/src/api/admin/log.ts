import request from '/@/utils/request';

export const pageList = (params?: object) => {
	return request({
		url: '/admin/log/page',
		method: 'get',
		params,
	});
};

export const delObj = (ids: object) => {
	return request({
		url: '/admin/log',
		method: 'delete',
		data: ids,
	});
};

export const getSum = (params?: object) => {
	return request({
		url: '/admin/log/sum',
		method: 'get',
		params,
	});
};
