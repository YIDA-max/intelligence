/*
 * @Author: wuyueqin wuyueqin@merach.com
 * @Date: 2026-02-13 17:08:01
 * @LastEditors: wuyueqin wuyueqin@merach.com
 * @LastEditTime: 2026-02-13 17:25:39
 * @FilePath: \qianyi-ui\src\componentsApi\customCascaderApi\confige\siteStoreId.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import type { CustomCascaderSettings } from '../types';
import { getGroupStoreByPlatform } from '/@/api/base/store/index';

export const defaultConfigData: Partial<CustomCascaderSettings> = {
	code: 'storeIds',
	text: '站点/店铺',
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
 * 获取站点/店铺数据
 * @param params - 查询参数，可选传入 platformChannelCode 等参数
 * @returns 返回格式化后的站点店铺树形数据，失败或无数据返回空数组
 */
export async function getData(params?: Record<string, any>): Promise<any[]> {
	try {
		const res = await getGroupStoreByPlatform(params || {});
		if (!res?.data || !Array.isArray(res.data)) {
			return [];
		}
		return res.data.map((item: any) => ({
			id: item.siteCode,
			name: item.siteCode,
			children:
				item.stores?.map((val: any) => ({
					id: val.id,
					name: val.storeName,
				})) || [],
		}));
	} catch (error) {
		return [];
	}
}
