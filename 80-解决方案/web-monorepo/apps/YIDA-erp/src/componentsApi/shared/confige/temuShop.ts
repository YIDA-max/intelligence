import type { TreeSelectInputSettings } from '../../TreeSelectInputApi/types';
import { getTemuFinanceShopOptions } from '/@/api/board/temu/index';

export const defaultConfigData: Partial<TreeSelectInputSettings> = {
	getTreeData: getTemuFinanceShopOptions,
	text: '店铺',
	code: 'shopList',
	width: '220px',
	selectTreeProps: {
		value: 'value',
		label: 'label',
		children: 'children',
	},
	getIdsCode: 'value',
	renderData: (data: any) => {
		if (!data) return [];
		return (data || []).map((item: any) => ({
			value: item,
			label: item || '',
		}));
	},
};

export function preConfigDefault(
	configData: Partial<TreeSelectInputSettings>,
	props: Record<string, any>
) {
	if (!props) return configData;
	return configData;
}
