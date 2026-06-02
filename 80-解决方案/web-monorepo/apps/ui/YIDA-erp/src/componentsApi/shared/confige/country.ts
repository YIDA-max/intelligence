/**
 * 国家表
 */

import type { TreeSelectInputSettings } from '../../TreeSelectInputApi/types';
import { sysCountryList } from '/@/api/materialFlow/track';
import { getMapSort } from './utils/sort';
export const defaultConfigData: Partial<TreeSelectInputSettings> = {
	getTreeData: sysCountryList,
	text: '国家',
	code: 'countryCodes',
	width: '220px',
	prefixKey: 'abbTwoCode',
	separator: '-',
	selectTreeProps: {
		value: 'abbTwoCode',
		label: 'chineseName',
	},
	sortFn: getMapSort('country'),
	getIdsCode: 'abbTwoCode',
};

export function preConfigDefault(
	configData: Partial<TreeSelectInputSettings>,
	props: Record<string, any>
) {
	if (!props) return configData;
	return configData;
}
