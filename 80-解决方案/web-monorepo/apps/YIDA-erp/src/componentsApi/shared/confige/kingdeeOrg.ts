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
 * 金蝶组织机构
 */

import type { TreeSelectInputSettings } from '../../TreeSelectInputApi/types';
import { getKingdeeOrgList } from '/@/api/integrations/common';
export const defaultConfigData: Partial<TreeSelectInputSettings> = {
	getTreeData: getKingdeeOrgList,
	text: '金蝶库存组织',
	code: 'createNames',
	width: '220px',
	selectTreeProps: {
		value: 'kingdeeOrgCode',
		label: 'kingdeeOrgName',
		children: 'children',
	},
	prefixKey: 'kingdeeOrgCode',
	separator: '-',
	getIdsCode: 'kingdeeOrgCode',
};

export function preConfigDefault(
	configData: Partial<TreeSelectInputSettings>,
	props: Record<string, any>
) {
	if (!props) return configData;
	return configData;
}
