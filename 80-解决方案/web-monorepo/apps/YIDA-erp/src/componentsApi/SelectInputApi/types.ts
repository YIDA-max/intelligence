import type { ApiSelectBaseSettings } from '../shared/apiSelect';

export interface SelectInputSettings extends ApiSelectBaseSettings {
	optionLabelFormatter?: (item: any) => string;
	optionValueFormatter?: (item: any) => any;
	optionDisabledFormatter?: (item: any) => boolean;
}

export interface SelectInputApiProps {
	modelValue?: any;
	componentType?: string;
	settings?: Partial<SelectInputSettings>;
	text?: string;
	code?: string;
	prefixKey?: string;
	searchFn?: (data: any) => Promise<void>;
	dictType?: string;
	remoteParams?:
		| {
				[key: string]: any;
		  }
		| string;
	autoLoad?: boolean;
}

export interface SelectOption {
	label: string;
	value: any;
	disabled?: boolean;
	raw?: any;
	[key: string]: any;
}
