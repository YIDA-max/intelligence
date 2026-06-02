import type { TreeSelectInputSettings } from '../../TreeSelectInputApi/types';
import { getFeeWarehouseBaseList } from '/@/api/fee/index';

export const defaultConfigData: Partial<TreeSelectInputSettings> = {
	getTreeData: getFeeWarehouseBaseList,
	text: '费用系统仓库',
	code: 'feeWarehouseId',
	width: '280px',
	selectTreeProps: {
		value: 'warehouseId',
		label: 'warehouseName',
	},
	getIdsCode: 'warehouseId',
};

export function preConfigDefault(
	configData: Partial<TreeSelectInputSettings>,
	props: Record<string, any>
) {
	if (!props) return configData;
	return configData;
}
