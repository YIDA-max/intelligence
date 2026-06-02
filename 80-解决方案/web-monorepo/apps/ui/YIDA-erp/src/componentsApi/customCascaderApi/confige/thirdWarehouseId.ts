// 服务商-三方仓-层级结构
import type { CustomCascaderSettings } from '../types';
import { searchThirdWarehouse } from '/@/api/fbm/logisticsChannel/thirdWarehouseLogistics';

export const defaultConfigData: Partial<CustomCascaderSettings> = {
	code: 'thirdWarehouseIds',
	text: '三方仓',
	width: '190px',
	props: {
		value: 'id',
		label: 'name',
		children: 'children',
	},
	checkStrictly: false,
	showSelectAll: false,
};

export function preConfigDefault(
	configData: Partial<CustomCascaderSettings>,
	props: Record<string, any>
) {
	if (!props) return configData;
	return configData;
}

/**
 * 获取服务商/三方仓数据
 * @param params - 查询参数，可选传入 warehouseName 等参数
 * @returns 返回格式化后的站点店铺树形数据，失败或无数据返回空数组
 */
export async function getData(params?: Record<string, any>): Promise<any[]> {
	try {
		const res = await searchThirdWarehouse(params || {});
		if (!res?.data || !Array.isArray(res.data)) {
			return [];
		}
		return res.data.map((item: any) => ({
			id: item.id,
			name: item.spName,
			children:
				item.warehouseInfoList?.map((val: any) => ({
					id: val.warehouseCode,
					name: val.warehouseName,
				})) || [],
		}));
	} catch (error) {
		return [];
	}
}
