import type { TreeSelectInputSettings } from '../../TreeSelectInputApi/types';
import { getCategoryTree } from '/@/api/product/category';

export const defaultConfigData: Partial<TreeSelectInputSettings> = {
	getTreeData: getCategoryTree,
	text: '类目',
	code: 'categoryCodes',
	width: '220px',
	selectTreeProps: {
		value: 'id',
		label: 'name',
		children: 'children',
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
