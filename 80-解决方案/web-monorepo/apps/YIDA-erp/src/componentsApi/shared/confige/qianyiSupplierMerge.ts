/**
 * 仟易供应商选择器配置
 * 货代表、三方仓物流商、平台物流的物流商，这三个来源汇集为一张表，供应商选择器从这张表中获取数据
 */

import type { TreeSelectInputSettings } from '../../TreeSelectInputApi/types';
import { getSupplierMergeList } from '/@/api/integrations/baseAssociationConfig/supplierRelationTable';

export const defaultConfigData: Partial<TreeSelectInputSettings> = {
	getTreeData: getSupplierMergeList,
	text: '',
	code: 'supplierCode',
	width: '280px',
	selectTreeProps: {
		value: 'logisticsCode',
		label: 'logisticsName',
	},
	prefixKey: 'logisticsCode',
	separator: '-',
};

export function preConfigDefault(
	configData: Partial<TreeSelectInputSettings>,
	props: Record<string, any>
) {
	if (!props) return configData;
	return configData;
}
