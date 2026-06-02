import { deepMerge } from '/@/utils/common/deepMerge';

const configModules = import.meta.glob(
	'/src/componentsApi/shared/confige/*.ts'
);

export interface ApiSelectFieldProps {
	value?: string;
	label?: string;
	children?: string;
	prefixKey?: string;
	suffixKey?: string;
	separator?: string;
}

export interface ApiSelectBaseSettings {
	getTreeData: (
		params?:
			| {
					[key: string]: any;
			  }
			| any,
		options?: any
	) =>
		| Promise<{ code: number; data: any[] | Record<string, any> }>
		| {
				code: number;
				data: any[] | Record<string, any>;
		  };
	getTreeDataParams?:
		| {
				[key: string]: any;
		  }
		| string;
	getTreeDataOptions?: any;
	width?: string;
	text?: string;
	code?: string;
	searchFn?: (data: any) => Promise<void>;
	selectTreeProps?: ApiSelectFieldProps;
	getIdsCode: string;
	renderData?: (data: any) => any;
	prefixKey?: string;
	separator?: string;
	sortFn?: (a: any, b: any) => number;
}

export interface ApiSelectConfigModule<
	TSettings extends ApiSelectBaseSettings
> {
	defaultConfigData?: Partial<TSettings>;
	preConfigDefault?: (
		configData: Partial<TSettings>,
		props: Record<string, any>
	) => Partial<TSettings>;
}

export async function loadApiSelectConfig<
	TSettings extends ApiSelectBaseSettings
>(componentType: string, props: Record<string, any>) {
	if (!componentType) {
		return {};
	}

	const modulePath = `/src/componentsApi/shared/confige/${componentType}.ts`;
	const importer = configModules[modulePath];

	if (!importer) {
		throw new Error(`Config module not found: ${modulePath}`);
	}

	const module = (await importer()) as ApiSelectConfigModule<TSettings>;
	const configData = module?.defaultConfigData ?? {};
	const handler =
		module?.preConfigDefault ?? ((data: Partial<TSettings>) => data);

	return handler(configData, props) ?? {};
}

export function mergeApiSelectSettings<TSettings extends ApiSelectBaseSettings>(
	defaultSettings: TSettings,
	configFromFile: Partial<TSettings>,
	propSettings: Partial<TSettings>,
	propOverrides: Partial<TSettings> = {}
) {
	let merged = { ...defaultSettings };

	if (Object.keys(configFromFile || {}).length > 0) {
		merged = deepMerge(merged, configFromFile);
	}

	if (Object.keys(propSettings || {}).length > 0) {
		merged = deepMerge(merged, propSettings);
	}

	if (Object.keys(propOverrides || {}).length > 0) {
		merged = deepMerge(merged, propOverrides);
	}

	return merged as TSettings;
}

export function normalizeApiList<T = any>(
	response: { code?: number; data?: any },
	renderData?: (data: any) => T[]
) {
	const rawData = response?.data;
	let sourceList: T[] = [];

	if (Array.isArray(rawData)) {
		sourceList = rawData as T[];
	} else if (Array.isArray(rawData?.records)) {
		sourceList = rawData.records as T[];
	}

	return renderData ? renderData(sourceList) : sourceList;
}
