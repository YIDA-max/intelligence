/*
 * @Author: wuyueqin wuyueqin@merach.com
 * @Date: 2026-02-11 16:04:54
 * @LastEditors: wuyueqin wuyueqin@merach.com
 * @LastEditTime: 2026-02-14 14:15:28
 * @FilePath: \qianyi-ui\src\componentsApi\TreeSelectInputApi\defaultConfig.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import type { TreeSelectInputSettings } from '../types';

export const defaultSettings: TreeSelectInputSettings = {
	getTreeData: async () => {
		return { code: 0, data: [] };
	},
	getTreeDataParams: {},
	width: '280px',
	text: '类目',
	code: 'categoryCodes',
	searchFn: () => Promise.resolve(),
	selectTreeProps: {
		value: 'value',
		label: 'label',
		children: 'children',
	},
	getIdsCode: 'id',
	renderData: (data: any) => data,
};

export function preDefaultConfig(configData: Partial<TreeSelectInputSettings>) {
	return configData;
}
