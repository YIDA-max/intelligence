/*
 * @Author: wuyueqin wuyueqin@merach.com
 * @Date: 2026-03-19 14:53:55
 * @LastEditors: wuyueqin wuyueqin@merach.com
 * @LastEditTime: 2026-03-19 17:29:35
 * @FilePath: \qianyi-ui-copy\src\componentsApi\TreeSelectInputApi\confige\kingdeeSupplier.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
/**
 * 金蝶供应商选择器配置
 */

import type { TreeSelectInputSettings } from '../../TreeSelectInputApi/types';

import { getKingdeeSupplierList } from '/@/api/integrations/common';

export const defaultConfigData: Partial<TreeSelectInputSettings> = {
	getTreeData: getKingdeeSupplierList,
	text: '金蝶供应商',
	code: 'kingdeeSupplierCode',
	width: '280px',
	selectTreeProps: {
		value: 'supplierCode',
		label: 'supplierName',
	},
	prefixKey: 'supplierCode',
	separator: '-',
};

export function preConfigDefault(
	configData: Partial<TreeSelectInputSettings>,
	props: Record<string, any>
) {
	if (!props) return configData;
	return configData;
}
