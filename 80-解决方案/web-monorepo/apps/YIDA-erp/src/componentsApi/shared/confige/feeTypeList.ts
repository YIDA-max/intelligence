/**
 * 费用类型
 */
import type { TreeSelectInputSettings } from '../../TreeSelectInputApi/types';
import { feeConfig } from '/@/api/materialFlow/firstMileLogistics';

export const defaultConfigData: Partial<TreeSelectInputSettings> = {
	getTreeData: feeConfig,
	text: '费用类型名称',
	code: 'feeType',
	width: '220px',
	selectTreeProps: {
		value: 'id',
		label: 'feeItem',
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
