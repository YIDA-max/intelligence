/**
 * 国家表
 */

import type { TreeSelectInputSettings } from '../../TreeSelectInputApi/types';
import { getListByCondition } from '/@/api/product/sku';
export const defaultConfigData: Partial<TreeSelectInputSettings> = {
	getTreeData: getListByCondition,
	text: '店铺/站点',
	code: 'storeId',
	width: '280px',
	prefixKey: 'storeName',
	separator: '/',
	selectTreeProps: {
		value: 'id',
		label: 'siteCode',
	},
	getIdsCode: 'id',
};

export function preConfigDefault(
	configData: Partial<TreeSelectInputSettings>,
	props: Record<string, any>
) {
	if (!props) return configData;
	return configData;
}
