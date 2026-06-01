// Type definitions for form item configuration
export interface FormItemOption {
	[key: string]: any;
}

export interface FormItem {
	type: 'select' | 'input' | 'custom'; // Supported types
	label: string;
	prop: string;
	options?: FormItemOption[];
	placeholder?: string;
	span?: number;
	slotName?: string; // For custom slot rendering
	optionValue?: string; // Custom key for option value
	optionLabel?: string; // Custom key for option label
	onChange?: (value: any, model: Record<string, any>) => void; // Callback for value changes
}
