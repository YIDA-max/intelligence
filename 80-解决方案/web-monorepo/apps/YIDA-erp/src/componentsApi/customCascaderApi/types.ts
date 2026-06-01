export interface CustomCascaderSettings {
	code?: string;
	text?: string;
	width?: string;
	props?: {
		value?: string;
		label?: string;
		children?: string;
	};
	maxTagsToShow?: number;
	showSelectAll?: boolean;
	checkStrictly?: boolean;
	emitPath?: boolean;
	onSearch?: (keyword: string) => Promise<{ code: number; data: any[] }>;
	getDataParams?: Record<string, any>; // 获取数据的查询参数
	searchFn?: (data: any) => Promise<void>;
}

export interface CustomCascaderApiProps {
	queryForm: {
		[key: string]: any;
	};
	componentType?: string;
	settings?: Partial<CustomCascaderSettings>;
	// 以下参数既可以在 prop 一级使用，也可以在 settings 中使用
	// prop 一级的优先级更高
	text?: string;
	code?: string;
	data?: any[]; // 数据源（可选，如果不传则自动调用 getData）
	/**
	 * 自定义数据加载方法（可选）
	 * 优先级高于 componentType 对应配置文件里的 getData
	 */
	getData?: (params?: Record<string, any>) => Promise<any[]>;
	showError?: boolean;
	getDataParams?: Record<string, any>; // 获取数据的查询参数，prop 优先级高于 settings
	searchFn?: (data: any) => Promise<void>;
}
