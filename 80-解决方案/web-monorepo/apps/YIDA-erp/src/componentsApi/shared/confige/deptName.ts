/*
 * @Author: wuyueqin wuyueqin@merach.com
 * @Date: 2026-02-24 17:13:43
 * @LastEditors: wuyueqin wuyueqin@merach.com
 * @LastEditTime: 2026-02-24 18:53:54
 * @FilePath: \qianyi-ui\src\componentsApi\TreeSelectInputApi\confige\KingdeeOrg.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
/*
 * @Author: wuyueqin wuyueqin@merach.com
 * @Date: 2026-02-13 15:16:27
 * @LastEditors: wuyueqin wuyueqin@merach.com
 * @LastEditTime: 2026-02-24 18:26:43
 * @FilePath: \qianyi-ui\src\componentsApi\TreeSelectInputApi\confige\userList.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
/**
 * 部门和小组
 */

import type { TreeSelectInputSettings } from '../../TreeSelectInputApi/types';
import { deptTree } from '/@/api/admin/dept';
export const defaultConfigData: Partial<TreeSelectInputSettings> = {
	getTreeData: deptTree,
	text: '部门和小组',
	code: 'deptIds',
	width: '220px',
	selectTreeProps: {
		value: 'id',
		label: 'name',
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
