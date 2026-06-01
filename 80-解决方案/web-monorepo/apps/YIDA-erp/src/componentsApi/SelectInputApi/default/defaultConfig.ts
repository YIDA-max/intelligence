import type { SelectInputSettings } from '../types';

export const defaultSettings: SelectInputSettings = {
	getTreeData: async () => {
		return { code: 0, data: [] };
	},
	getTreeDataParams: {},
	width: '280px',
	text: '请选择',
	code: 'value',
	searchFn: () => Promise.resolve(),
	selectTreeProps: {
		value: 'value',
		label: 'label',
		children: 'children',
	},
	getIdsCode: 'value',
	renderData: (data: any) => data,
	optionLabelFormatter: undefined,
	optionValueFormatter: undefined,
	optionDisabledFormatter: undefined,
};
