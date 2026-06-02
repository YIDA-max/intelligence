import type { TreeSelectInputSettings } from '../../TreeSelectInputApi/types';
import { getSpInfoList } from '/@/api/warehouse/spInfo/index';

export const defaultConfigData: Partial<TreeSelectInputSettings> = {
	getTreeData: getSpInfoList,
	text: '服务商',
	code: 'spId',
	width: '280px',
	selectTreeProps: {
		value: 'id',
		label: 'spName',
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
