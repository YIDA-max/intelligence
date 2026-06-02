/**
 * 金蝶费用项目
 */
import type { TreeSelectInputSettings } from '../../TreeSelectInputApi/types';
import { getKingdeeFeeItemList } from '/@/api/integrations/common';

export const defaultConfigData: Partial<TreeSelectInputSettings> = {
	getTreeData: getKingdeeFeeItemList,
	text: '金蝶费用项目',
	code: 'kingdeeExpenseCodes',
	width: '220px',
	selectTreeProps: {
		value: 'kingdeeFeeCode',
		label: 'kingdeeFeeName',
		children: 'children',
	},
	prefixKey: 'kingdeeFeeCode',
	separator: '-',
	getIdsCode: 'kingdeeFeeCode',
};

export function preConfigDefault(
	configData: Partial<TreeSelectInputSettings>,
	props: Record<string, any>
) {
	if (!props) return configData;
	return configData;
}
