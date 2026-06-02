/*
 * @Author: wuyueqin wuyueqin@merach.com
 * @Date: 2026-04-23 15:26:20
 * @LastEditors: wuyueqin wuyueqin@merach.com
 * @LastEditTime: 2026-04-23 15:28:27
 * @FilePath: \qianyi-ui-copy\src\componentsApi\shared\confige\yesNo.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// 是否枚举（0否，1是）- 静态数据，无需接口请求
import type { TreeSelectInputSettings } from '../../TreeSelectInputApi/types';

export const defaultConfigData: Partial<TreeSelectInputSettings> = {
	getTreeData: () => ({
		code: 0,
		data: [
			{ label: '是', value: 1 },
			{ label: '否', value: 0 },
		],
	}),
	text: '是否',
	code: 'value',
	width: '160px',
	selectTreeProps: {
		value: 'value',
		label: 'label',
	},
	getIdsCode: 'value',
};

export function preConfigDefault(
	configData: Partial<TreeSelectInputSettings>,
	props: Record<string, any>
) {
	if (!props) return configData;
	return configData;
}
