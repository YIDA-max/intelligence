/**
 * 订单标签
 */
import type { TreeSelectInputSettings } from '../../TreeSelectInputApi/types';
import { getTagAllList } from '/@/api/components/editTag';

export const defaultConfigData: Partial<TreeSelectInputSettings> = {
	getTreeData: getTagAllList,
	text: '订单标签',
	code: 'tags',
	width: '220px',
	selectTreeProps: {
		value: 'id',
		label: 'name',
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
