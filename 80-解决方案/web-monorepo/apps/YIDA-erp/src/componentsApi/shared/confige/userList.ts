/*
 * @Author: wuyueqin wuyueqin@merach.com
 * @Date: 2026-02-13 15:16:27
 * @LastEditors: wuyueqin wuyueqin@merach.com
 * @LastEditTime: 2026-02-24 17:14:17
 * @FilePath: \qianyi-ui\src\componentsApi\TreeSelectInputApi\confige\userList.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

/**
 * 创建人
 */
import type { TreeSelectInputSettings } from '../../TreeSelectInputApi/types';
import { getUserListByCondition } from '/@/api/admin/user';

export const defaultConfigData: Partial<TreeSelectInputSettings> = {
	getTreeData: getUserListByCondition,
	text: '创建人',
	code: 'createNames',
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
