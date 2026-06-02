/*
 * @Author: wuyueqin wuyueqin@merach.com
 * @Date: 2026-04-08 17:45:38
 * @LastEditors: wuyueqin wuyueqin@merach.com
 * @LastEditTime: 2026-04-08 18:50:14
 * @FilePath: \qianyi-ui-copy\src\componentsApi\shared\confige\deptLast.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
/**
 * 运营组
 */

import type { TreeSelectInputSettings } from '../../TreeSelectInputApi/types';
import { getDeptLastDeptByCondition } from '/@/api/admin/dept';
export const defaultConfigData: Partial<TreeSelectInputSettings> = {
	getTreeData: getDeptLastDeptByCondition,
	text: '运营组',
	code: 'operationGroups',
	width: '220px',
	selectTreeProps: {
		value: 'deptId',
		label: 'name',
		children: 'children',
	},
	getIdsCode: 'deptId',
};

export function preConfigDefault(
	configData: Partial<TreeSelectInputSettings>,
	props: Record<string, any>
) {
	if (!props) return configData;
	return configData;
}
