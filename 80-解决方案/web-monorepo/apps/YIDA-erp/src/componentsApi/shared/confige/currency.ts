/**
 * 币种选择器配置
 */
import type { TreeSelectInputSettings } from '../../TreeSelectInputApi/types';
import { getListByCondition } from '/@/api/purchase/supplierSku';

export const defaultConfigData: Partial<TreeSelectInputSettings> = {
	getTreeData: getListByCondition,
	text: '币种',
	code: 'currencyList',
	width: '220px',
	selectTreeProps: {
		value: 'currencyCode',
		label: 'currencyCode',
		children: 'children',
	},
	getIdsCode: 'currencyCode',
};

export function preConfigDefault(
	configData: Partial<TreeSelectInputSettings>,
	props: Record<string, any>
) {
	if (!props) return configData;
	return configData;
}
