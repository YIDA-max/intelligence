import { httpService } from '/@/utils/request';

export function getWareHouseList(params?: object) {
	return httpService.get('/warehouse/warehouseInfo/options', {
		params,
		debounceConfig: {
			delay: 0,
			enable: false,
		},
	});
}
