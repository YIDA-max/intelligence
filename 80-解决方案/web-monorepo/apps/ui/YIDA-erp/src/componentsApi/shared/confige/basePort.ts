/**
 * 港口
 */

import type { TreeSelectInputSettings } from '../../TreeSelectInputApi/types';
import { getBasePortListByCondition } from '/@/api/all-base-data';

export const defaultConfigData: Partial<TreeSelectInputSettings> = {
	getTreeData: getBasePortListByCondition,
	text: '港口',
	code: 'portCodes',
	width: '280px',
	prefixKey: 'portCode',
	separator: '-',
	selectTreeProps: {
		value: 'portCode',
		label: 'portName',
	},
	getIdsCode: 'portCode',
};

export function preConfigDefault(
	configData: Partial<TreeSelectInputSettings>,
	props: Record<string, any>
) {
	if (!props) return configData;
	return configData;
}
