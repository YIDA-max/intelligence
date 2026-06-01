/*
 * @Author: wuyueqin wuyueqin@merach.com
 * @Date: 2026-05-14 15:02:03
 * @LastEditors: wuyueqin wuyueqin@merach.com
 * @LastEditTime: 2026-05-14 18:04:49
 * @FilePath: \qianyi-ui\src\componentsApi\shared\confige\payableObject.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import type { TreeSelectInputSettings } from '../../TreeSelectInputApi/types';
import { getPayableObjectList } from '/@/api/financial/transactionManagement/paymentRequestPool/index';

export const defaultConfigData: Partial<TreeSelectInputSettings> = {
	getTreeData: getPayableObjectList,
	text: '应付对象',
	code: 'payableObject',
	width: '280px',
	selectTreeProps: {
		value: 'code',
		label: 'name',
	},
	getIdsCode: 'code',
};

export function preConfigDefault(configData: Partial<TreeSelectInputSettings>) {
	return configData;
}
