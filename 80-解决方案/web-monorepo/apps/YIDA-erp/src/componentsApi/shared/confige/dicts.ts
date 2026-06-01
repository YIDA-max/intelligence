/*
 * @Author: wuyueqin wuyueqin@merach.com
 * @Date: 2026-02-13 15:16:27
 * @LastEditors: wuyueqin wuyueqin@merach.com
 * @LastEditTime: 2026-02-13 16:55:38
 * @FilePath: \qianyi-ui\src\componentsApi\TreeSelectInputApi\confige\dicts.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import type { TreeSelectInputSettings } from '../../TreeSelectInputApi/types';
import { getDicts } from '/@/api/admin/dict';

export const defaultConfigData: Partial<TreeSelectInputSettings> = {
	getTreeData: getDicts,
	getTreeDataParams: '', // 需要在使用时通过 prop 或 settings 传入具体的字典类型
	text: '请选择',
	code: 'values',
	width: '220px',
	selectTreeProps: {
		value: 'value',
		label: 'label',
		children: 'children',
	},
	getIdsCode: 'value', //选中的字段，用于选中回显
};

export function preConfigDefault(
	configData: Partial<TreeSelectInputSettings>,
	props: Record<string, any>
) {
	if (!props) return configData;
	return configData;
}
