/*
 * @Author: wuyueqin wuyueqin@merach.com
 * @Date: 2026-04-07 16:21:40
 * @LastEditors: wuyueqin wuyueqin@merach.com
 * @LastEditTime: 2026-04-07 20:40:13
 * @FilePath: \qianyi-ui-copy\src\componentsApi\TreeSelectInputApi\confige\warehouseInfoKingdee.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

/**
 * 金蝶仓库
 */

import type { TreeSelectInputSettings } from '../../TreeSelectInputApi/types';
import { getKingdeeWarehouseList } from '/@/api/integrations/common';
export const defaultConfigData: Partial<TreeSelectInputSettings> = {
	getTreeData: getKingdeeWarehouseList,
	text: '金蝶仓库',
	code: 'kingdeeWareCode',
	width: '220px',
	selectTreeProps: {
		value: 'kingdeeWareCode',
		label: 'kingdeeWareName',
		children: 'children',
		prefixKey: 'kingdeeWareCode',
	},
	getIdsCode: 'kingdeeWareCode',
};

export function preConfigDefault(
	configData: Partial<TreeSelectInputSettings>,
	props: Record<string, any>
) {
	if (!props) return configData;
	return configData;
}
