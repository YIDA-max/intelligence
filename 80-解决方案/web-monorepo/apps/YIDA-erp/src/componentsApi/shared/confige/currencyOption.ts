/**
 * 仟易币种
 */
import type { TreeSelectInputSettings } from '../../TreeSelectInputApi/types';
import { getCurrencyOption } from '/@/api/product/sku';

export const defaultConfigData: Partial<TreeSelectInputSettings> = {
	getTreeData: getCurrencyOption,
	text: '仟易币种',
	code: 'currencyCodes',
	width: '220px',
	selectTreeProps: {
		value: 'currencyCode',
		label: 'currencyName',
		children: 'children',
	},
	prefixKey: 'currencyCode',
	separator: '-',
	getIdsCode: 'currencyCode',
};

export function preConfigDefault(
	configData: Partial<TreeSelectInputSettings>,
	props: Record<string, any>
) {
	if (!props) return configData;
	return configData;
}
