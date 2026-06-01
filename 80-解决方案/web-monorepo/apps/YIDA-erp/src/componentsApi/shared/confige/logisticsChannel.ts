/**
 * 物流渠道
 */
import type { TreeSelectInputSettings } from '../../TreeSelectInputApi/types';
import { getLogisticsChannelList } from '/@/api/fbm/selfOrder/index';

export const defaultConfigData: Partial<TreeSelectInputSettings> = {
	getTreeData: getLogisticsChannelList,
	getTreeDataParams: { current: 1, size: 1000000000000 },
	text: '物流渠道',
	code: 'logisticsCodes',
	width: '220px',
	selectTreeProps: {
		value: 'logisticsChannelCode',
		label: 'logisticsChannelName',
	},
	getIdsCode: 'logisticsChannelCode',
};

export function preConfigDefault(
	configData: Partial<TreeSelectInputSettings>,
	props: Record<string, any>
) {
	if (!props) return configData;
	return configData;
}
