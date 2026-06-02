/*
 * @Author: wuyueqin wuyueqin@merach.com
 * @Date: 2026-04-08 18:49:43
 * @LastEditors: wuyueqin wuyueqin@merach.com
 * @LastEditTime: 2026-04-08 18:50:34
 * @FilePath: \qianyi-ui-copy\src\componentsApi\shared\confige\brand.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
/**
 * 品牌
 */

import type { TreeSelectInputSettings } from '../../TreeSelectInputApi/types';
import { getBrandAllList } from '/@/api/product/brand';
export const defaultConfigData: Partial<TreeSelectInputSettings> = {
	getTreeData: getBrandAllList,
	text: '品牌',
	code: 'operationGroups',
	width: '220px',
	selectTreeProps: {
		value: 'brandCode',
		label: 'brandName',
		children: 'children',
	},
	getIdsCode: 'brandCode',
	prefixKey: 'brandCode',
};

export function preConfigDefault(
	configData: Partial<TreeSelectInputSettings>,
	props: Record<string, any>
) {
	if (!props) return configData;
	return configData;
}
