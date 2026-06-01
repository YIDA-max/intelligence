/**
 * 物控人员选择器配置
 */
import type { TreeSelectInputSettings } from '../../TreeSelectInputApi/types';
import { getUsersByDepartment } from '/@/api/product/category';

export const defaultConfigData: Partial<TreeSelectInputSettings> = {
	getTreeData: getUsersByDepartment,
	text: '物控负责人',
	code: 'mcpIds',
	width: '220px',
	selectTreeProps: {
		value: 'userId',
		label: 'name',
		children: 'children',
	},
	getIdsCode: 'userId',
};

export function preConfigDefault(
	configData: Partial<TreeSelectInputSettings>,
	props: Record<string, any>
) {
	if (!props) return configData;
	return configData;
}
