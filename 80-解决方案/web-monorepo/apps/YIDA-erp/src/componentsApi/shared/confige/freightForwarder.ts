/**
 *  货代管理列表
 */

import type { TreeSelectInputSettings } from '../../TreeSelectInputApi/types';
import { getFreightForwarderListByCondition } from '/@/api/materialFlow/headerTracker/index';

export const defaultConfigData: Partial<TreeSelectInputSettings> = {
	getTreeData: getFreightForwarderListByCondition,
	text: '货代',
	code: 'portCodes',
	width: '280px',
	selectTreeProps: {
		value: 'forwarderName',
		label: 'forwarderName',
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
