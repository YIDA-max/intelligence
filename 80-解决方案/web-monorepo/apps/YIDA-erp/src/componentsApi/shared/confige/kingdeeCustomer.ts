/**
 * 金蝶内部客户选择器配置
 */

import type { TreeSelectInputSettings } from '../../TreeSelectInputApi/types';
import { getKingdeeCustomerList } from '/@/api/integrations/common';

export const defaultConfigData: Partial<TreeSelectInputSettings> = {
	getTreeData: getKingdeeCustomerList,
	text: '',
	code: 'internalCustomerCode',
	width: '280px',
	selectTreeProps: {
		value: 'kingdeeCustomerCode',
		label: 'kingdeeCustomerName',
	},
	prefixKey: 'kingdeeCustomerCode',
	separator: '-',
};

export function preConfigDefault(
	configData: Partial<TreeSelectInputSettings>,
	props: Record<string, any>
) {
	if (!props) return configData;
	return configData;
}
