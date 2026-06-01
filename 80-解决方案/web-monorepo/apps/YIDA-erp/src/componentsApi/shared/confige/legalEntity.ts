/*
 * @Author: wuyueqin wuyueqin@merach.com
 * @Date: 2026-03-19 14:53:55
 * @LastEditors: wuyueqin wuyueqin@merach.com
 * @LastEditTime: 2026-03-19 17:30:16
 * @FilePath: \qianyi-ui-copy\src\componentsApi\TreeSelectInputApi\confige\legalEntity.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
/**
 * 法人主体选择器配置
 */

import type { TreeSelectInputSettings } from '../../TreeSelectInputApi/types';

import { getLegalEntitySelect } from '/@/api/admin/legalEntity/index';

export const defaultConfigData: Partial<TreeSelectInputSettings> = {
	getTreeData: getLegalEntitySelect,
	text: '',
	code: 'legalPersonId',
	width: '280px',
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
