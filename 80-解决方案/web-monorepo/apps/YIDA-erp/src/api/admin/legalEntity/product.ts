import request from '/@/utils/request';

export const getAllSpu = () => {
	return request({
		url: '/product/spu/getAllSpu',
		method: 'get',
	});
};
