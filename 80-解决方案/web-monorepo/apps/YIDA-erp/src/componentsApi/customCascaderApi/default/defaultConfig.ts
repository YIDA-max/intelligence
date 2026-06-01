import type { CustomCascaderSettings } from '../types';

export const defaultSettings: CustomCascaderSettings = {
	width: '280px',
	text: '请选择',
	code: 'categoryCodes',
	props: {
		value: 'id',
		label: 'name',
		children: 'children',
	},
	maxTagsToShow: 1,
	showSelectAll: false,
	checkStrictly: false,
	emitPath: false,
};
