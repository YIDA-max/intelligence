/**
 * 仟易供应商选择器配置
 */

import type { TreeSelectInputSettings } from '../../TreeSelectInputApi/types';
import { getSupplierInfoList } from '/@/api/purchase/supplierSku';

export const defaultConfigData: Partial<TreeSelectInputSettings> = {
	getTreeData: getSupplierInfoList,
	text: '',
	code: 'supplierCode',
	width: '280px',
	selectTreeProps: {
		value: 'supplierNo',
		label: 'name',
		// prefixKey: 'supplierNo',
	},
	prefixKey: 'supplierNo',
	separator: '-',
};

export function preConfigDefault(
	configData: Partial<TreeSelectInputSettings>,
	props: Record<string, any>
) {
	if (!props) return configData;
	return configData;
}
