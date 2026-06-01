<template>
	<el-select
		class="select-input"
		v-model="innerValue"
		:multiple="isMultiple"
		:disabled="props.disabled"
		:clearable="props.clearable"
		:filterable="props.filterable"
		:remote="hasRemote"
		:remote-method="hasRemote ? handleRemote : undefined"
		:loading="state.loading"
		:placeholder="currentPlaceholder"
		v-bind="$attrs"
		@focus="handleFocus"
		@change="handleVisibleChange"
		@clear="handleClear"
	>
		<template #empty>
			<span class="select-input__empty">{{
				state.loading ? '加载中...' : '暂无数据'
			}}</span>
		</template>
		<el-option
			v-for="item in state.options"
			:key="item.value"
			:label="item.label"
			:value="item.value"
		/>
	</el-select>
</template>

<script setup lang="ts">
import { computed, nextTick, reactive, ref, watch } from 'vue';
import { ElOption, ElSelect } from 'element-plus';
import {
	selectInputDefaultConfig,
	selectInputProps,
	type SelectInputConfig,
	type SelectInputOption,
	type SelectInputSearchType,
} from './seting/props';
import { mergeObjects, getData } from './seting/index';

defineOptions({
	components: {
		ElSelect,
		ElOption,
	},
});
const props = defineProps(selectInputProps);
const arr: string[] = [];
arr.push(1);
const emits = defineEmits<{
	(e: 'update:modelValue', value: any): void;
	(
		e: 'change',
		payload: { key: string; value: any; options: SelectInputOption[] }
	): void;
	(e: 'select', payload: SelectInputOption | SelectInputOption[] | null): void;
	(e: 'fetch', payload: SelectInputOption[]): void;
	(e: 'fetchError', error: unknown): void;
}>();

const state = reactive({
	options: [] as SelectInputOption[],
	loading: false,
	fetched: false,
});

const optionRegistry = ref<Map<any, SelectInputOption>>(new Map());
const mergedConfig = ref<SelectInputConfig>(
	mergeObjects(selectInputDefaultConfig as any, {} as any) as SelectInputConfig
);
const configFromFile = ref<Partial<SelectInputConfig>>({});

const activeSearchType = computed<SelectInputSearchType | null>(
	() => props.searchTypes?.[0] ?? null
);
const activeSearchKey = computed<string>(
	() => activeSearchType.value?.value ?? ''
);

const isMultiple = computed<boolean>(() => {
	if (props.multiple !== null) return Boolean(props.multiple);
	if (typeof activeSearchType.value?.multiple === 'boolean')
		return activeSearchType.value.multiple;
	return mergedConfig.value.multiple;
});

const currentPlaceholder = computed<string>(() => {
	if (getData(props.placeholder) !== undefined) return props.placeholder;
	if (getData(activeSearchType.value?.placeholder) !== undefined) {
		return activeSearchType.value?.placeholder ?? '';
	}
	if (
		getData(mergedConfig.value.placeholder) !== undefined &&
		mergedConfig.value.placeholder
	) {
		return mergedConfig.value.placeholder;
	}
	return '请选择';
});

const toArray = (value: any) => {
	if (Array.isArray(value)) return value;
	if (value === undefined || value === null || value === '') return [];
	return [value];
};

const toScalar = (value: any) => {
	if (Array.isArray(value)) return value[0] ?? '';
	return value ?? '';
};

const innerValue = computed<any>({
	get: () => {
		const currentValue = props.modelValue;
		return isMultiple.value ? toArray(currentValue) : toScalar(currentValue);
	},
	set: (val) => {
		const key = activeSearchKey.value;
		const normalized = isMultiple.value ? toArray(val) : toScalar(val);
		if (key) {
			const nextForm = {
				[key]: normalized,
			};
			queryFormRef.value = nextForm;
		}
		emits('update:modelValue', normalized);
		const selectedValues = isMultiple.value
			? normalized
			: normalized === '' || normalized === null || normalized === undefined
			? []
			: [normalized];
		const selectedOptions = selectedValues
			.map((value) => optionRegistry.value.get(value))
			.filter((item): item is SelectInputOption => Boolean(item));
		emits(
			'select',
			isMultiple.value ? selectedOptions : selectedOptions[0] ?? null
		);
		emits('change', {
			key,
			value: normalized,
			options: selectedOptions,
		});
		if (typeof props.getDataList === 'function') {
			props.getDataList();
		}
	},
});

const hasRemote = computed<boolean>(() =>
	Boolean(mergedConfig.value.request?.getApi)
);

const applyConfig = (
	externalConfig: Partial<SelectInputConfig> = configFromFile.value
) => {
	const baseClone = mergeObjects(
		selectInputDefaultConfig as any,
		externalConfig as any
	) as SelectInputConfig;
	const withOverrides = mergeObjects(
		baseClone as any,
		props.configOverrides as any
	) as SelectInputConfig;
	const immediate =
		props.fetchOnMounted === null
			? withOverrides.request.immediate
			: Boolean(props.fetchOnMounted);

	const multiple =
		props.multiple === null
			? typeof activeSearchType.value?.multiple === 'boolean'
				? activeSearchType.value.multiple
				: withOverrides.multiple
			: Boolean(props.multiple);

	const overrideSource: Partial<SelectInputConfig> = {
		optionLabelKey:
			getData(props.labelKey) !== undefined
				? props.labelKey
				: withOverrides.optionLabelKey,
		optionValueKey:
			getData(props.valueKey) !== undefined
				? props.valueKey
				: withOverrides.optionValueKey,
		optionFormatter:
			getData(props.optionFormatter) !== undefined
				? props.optionFormatter
				: withOverrides.optionFormatter,
		multiple,
		placeholder:
			getData(props.placeholder) !== undefined
				? props.placeholder
				: withOverrides.placeholder,
		request: {
			...withOverrides.request,
			getApi:
				getData(props.getApi) !== undefined
					? (props.getApi as any)
					: withOverrides.request.getApi,
			params: mergeObjects(
				withOverrides.request.params || {},
				props.apiParams || {}
			) as Record<string, any>,
			immediate,
		},
	};

	mergedConfig.value = mergeObjects(
		withOverrides as any,
		overrideSource as any
	) as SelectInputConfig;
};

const buildOption = (item: any): SelectInputOption => {
	if (typeof props.optionFormatter === 'function') {
		const formatted = props.optionFormatter(item);
		return {
			...formatted,
			raw: item,
		};
	}
	if (typeof mergedConfig.value.optionFormatter === 'function') {
		const formatted = mergedConfig.value.optionFormatter(item, {
			config: mergedConfig.value,
			props,
		});
		return {
			...formatted,
			raw: item,
		};
	}
	const labelKey = mergedConfig.value.optionLabelKey;
	const valueKey = mergedConfig.value.optionValueKey;
	return {
		label: item?.[labelKey] ?? '',
		value: item?.[valueKey],
		raw: item,
	};
};

const parseResponse = (response: any, keyword: string) => {
	const transformer = mergedConfig.value.request.transform;
	if (typeof transformer === 'function') {
		return transformer(response, {
			keyword,
			searchKey: activeSearchKey.value,
			props,
		});
	}
	return Array.isArray(response) ? response : [];
};

const fetchOptions = async (keyword = '') => {
	const requestConfig = mergedConfig.value.request;
	if (!requestConfig?.getApi) return;
	state.loading = true;
	try {
		const payload: Record<string, any> = {
			...(requestConfig.params || {}),
			...(props.apiParams || {}),
		};
		const searchKey = activeSearchKey.value;
		if (searchKey) {
			payload.searchKey = searchKey;
		}
		const keywordKey = requestConfig.keywordKey ?? 'keyword';
		if (keywordKey) {
			payload[keywordKey] = keyword;
		}
		const response = await requestConfig.getApi(payload);
		const list = parseResponse(response, keyword);
		optionRegistry.value = new Map();
		const formatted = (list ?? []).map((item: any) => {
			const option = buildOption(item);
			optionRegistry.value.set(option.value, option);
			return option;
		});
		state.options = formatted;
		state.fetched = true;
		emits('fetch', formatted);
	} catch (error) {
		emits('fetchError', error);
	} finally {
		state.loading = false;
	}
};

const resetOptions = () => {
	state.options = [];
	optionRegistry.value = new Map();
	state.fetched = false;
};

const handleFocus = async () => {
	if (!props.requestOnFocus) return;
	if (!state.fetched || mergedConfig.value.request.refreshOnFocus) {
		await fetchOptions('');
	}
};

const handleVisibleChange = async (visible: boolean) => {
	if (!visible) return;
	if (!props.requestOnFocus) return;
	if (props.filterable && !hasRemote.value) return;

	if (!state.fetched || mergedConfig.value.request.refreshOnFocus) {
		await fetchOptions('');
	}
};

const handleRemote = async (query: string) => {
	await fetchOptions(query);
};

const handleClear = () => {
	innerValue.value = isMultiple.value ? [] : '';
};

const hydrateConfig = async (dialogType: string) => {
	try {
		const module = await import(`./confige/${dialogType}.ts`);
		const configData = module?.defaultConfigData ?? {};
		const handler = module?.preConfigDefault ?? ((data: any) => data);
		configFromFile.value = handler(configData, props) ?? {};
	} catch (error) {
		configFromFile.value = {};
		emits('fetchError', error);
	} finally {
		applyConfig(configFromFile.value);
		resetOptions();
		await nextTick();
		if (mergedConfig.value.request.immediate) {
			await fetchOptions('');
		}
	}
};

watch(
	() => props.searchTypes,
	() => {
		resetOptions();
		applyConfig(configFromFile.value);
	},
	{ deep: true, immediate: true }
);

watch(
	() => props.dialogType,
	(val) => {
		if (!val) return;
		hydrateConfig(val);
	},
	{ immediate: true }
);

watch(
	() => ({
		labelKey: props.labelKey,
		valueKey: props.valueKey,
		getApi: props.getApi,
		apiParams: props.apiParams,
		optionFormatter: props.optionFormatter,
		multiple: props.multiple,
		placeholder: props.placeholder,
		configOverrides: props.configOverrides,
		fetchOnMounted: props.fetchOnMounted,
	}),
	() => {
		applyConfig(configFromFile.value);
		resetOptions();
	},
	{ deep: true }
);

watch(
	() => props.apiParams,
	() => {
		resetOptions();
	},
	{ deep: true }
);
</script>
<style lang="scss" scoped>
@import './index.scss';
</style>
