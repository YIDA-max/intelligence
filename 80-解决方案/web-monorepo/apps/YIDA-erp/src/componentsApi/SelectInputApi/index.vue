<template>
	<el-select-v2
		ref="selectRef"
		v-model="internalValue"
		:options="options"
		:loading="loading"
		:placeholder="placeholder"
		:style="selectStyle"
		v-bind="$attrs"
		:clearable="clearable"
		:filterable="filterable"
		:collapse-tags="collapseTags"
		:max-collapse-tags="maxCollapseTags"
		:collapse-tags-tooltip="collapseTagsTooltip"
		:fit-input-width="fitInputWidth"
		:persistent="false"
		:multiple="multiple"
		@change="handleChange"
		@visible-change="handleVisibleChange"
		@remove-tag="handleRemoveTag"
		@clear="handleClear"
		@blur="handleBlur"
		@focus="handleFocus"
	>
		<template #default="{ item }">
			<el-tooltip
				:content="item.displayLabel"
				placement="right-start"
				:show-after="500"
			>
				<span class="select-v2-option-label">{{ item.displayLabel }}</span>
			</el-tooltip>
		</template>
	</el-select-v2>
</template>

<script setup lang="ts">
import { computed, ref, useAttrs, watch } from 'vue';
import type { CSSProperties, PropType } from 'vue';
import {
	loadApiSelectConfig,
	mergeApiSelectSettings,
	normalizeApiList,
} from '../shared/apiSelect';
import { defaultSettings } from './default/defaultConfig';
import type { SelectInputSettings, SelectOption } from './types';

defineOptions({
	name: 'SelectInputApi',
	inheritAttrs: false,
});

const props = defineProps({
	modelValue: {
		type: null as unknown as PropType<any>,
		default: undefined,
	},
	//组件类型，用于加载组件配置
	componentType: {
		type: String,
		default: '',
	},
	//
	settings: {
		type: Object as PropType<Partial<SelectInputSettings>>,
		default: () => ({}),
	},
	//显示文本
	text: {
		type: String,
		default: undefined,
	},
	//传入queryForm中的字段名，用于获取queryForm中的值
	code: {
		type: String,
		default: undefined,
	},
	//前缀key，用于拼接前缀
	prefixKey: {
		type: String,
		default: undefined,
	},
	//搜索函数，用于搜索数据
	searchFn: {
		type: Function as PropType<() => Promise<void>>,
		default: undefined,
	},
	//字典类型，用于加载字典数据
	dictType: {
		type: String,
		default: undefined,
	},
	//接口参数
	getDataParams: {
		type: [Object, String] as PropType<Record<string, any> | string>,
		default: undefined,
	},
	//接口参数-冗余getDataParams ，方便和TreeSelectInputApi组件统一
	getTreeDataParams: {
		type: [Object, String] as PropType<Record<string, any> | string>,
		default: undefined,
	},
	getTreeDataOptions: {
		type: Object,
		default: undefined,
	},

	autoLoad: {
		type: Boolean,
		default: true,
	},

	clearable: {
		type: Boolean,
		default: true,
	},
	filterable: {
		type: Boolean,
		default: true,
	},
	collapseTags: {
		type: Boolean,
		default: true,
	},
	maxCollapseTags: {
		type: Number,
		default: 1,
	},
	collapseTagsTooltip: {
		type: Boolean,
		default: true,
	},
	fitInputWidth: {
		type: Boolean,
		default: true,
	},
	multiple: {
		type: Boolean,
		default: false,
	},
});

const emit = defineEmits([
	'update:modelValue',
	'change',
	'visible-change',
	'remove-tag',
	'clear',
	'blur',
	'focus',
	'loaded',
	'load-error',
]);

const attrs = useAttrs();
const selectRef = ref();
const loading = ref(false);
const isReady = ref(false);
const options = ref<SelectOption[]>([]);
const rawData = ref<any[]>([]);
const configFromFile = ref<Partial<SelectInputSettings>>({});

const mergedSettings = computed<SelectInputSettings>(() => {
	const propOverrides: Partial<SelectInputSettings> = {};

	if (props.text !== undefined) {
		propOverrides.text = props.text;
	}

	if (props.code !== undefined) {
		propOverrides.code = props.code;
	}

	if (props.prefixKey !== undefined) {
		propOverrides.selectTreeProps = {
			...(propOverrides.selectTreeProps || {}),
			prefixKey: props.prefixKey,
		};
	}

	if (props.searchFn !== undefined) {
		propOverrides.searchFn = props.searchFn;
	}

	if (props.dictType !== undefined) {
		propOverrides.getTreeDataParams = props.dictType;
	}

	if (props.getDataParams !== undefined) {
		propOverrides.getTreeDataParams = props.getDataParams;
	}
	if (props.getTreeDataParams !== undefined) {
		propOverrides.getTreeDataParams = props.getTreeDataParams;
	}
	if (props.getTreeDataOptions !== undefined) {
		propOverrides.getTreeDataOptions = props.getTreeDataOptions;
	}

	return mergeApiSelectSettings(
		defaultSettings,
		configFromFile.value,
		props.settings,
		propOverrides
	);
});

const placeholder = computed(() => {
	const attrPlaceholder = attrs.placeholder;
	if (typeof attrPlaceholder === 'string' && attrPlaceholder) {
		return attrPlaceholder;
	}

	if (mergedSettings.value.text) {
		return `请选择${mergedSettings.value.text}`;
	}

	return '请选择';
});

const selectStyle = computed<CSSProperties | string>(() => {
	if (attrs.style) {
		return attrs.style as CSSProperties | string;
	}

	// return {
	// 	width: mergedSettings.value.width || '280px',
	// };
	return {};
});

const buildOptions = (list: any[]) => {
	const fieldProps = mergedSettings.value.selectTreeProps || {};
	const labelKey = fieldProps.label || 'label';
	const valueKey = fieldProps.value || 'value';
	const prefixKey = fieldProps.prefixKey ?? mergedSettings.value.prefixKey;
	const separator =
		fieldProps.separator ?? mergedSettings.value.separator ?? '-';

	return list.map((item: any) => {
		const originalLabel = item[labelKey];
		const value = mergedSettings.value.optionValueFormatter
			? mergedSettings.value.optionValueFormatter(item)
			: item?.[valueKey];
		const disabled = mergedSettings.value.optionDisabledFormatter
			? mergedSettings.value.optionDisabledFormatter(item)
			: item?.disabled;

		// 构建显示文本 (displayLabel)
		let displayLabel: string;
		if (mergedSettings.value.optionLabelFormatter) {
			displayLabel = mergedSettings.value.optionLabelFormatter(item);
		} else {
			const prefixValue = prefixKey ? item[prefixKey] : undefined;
			// 如果有前缀，拼接前缀和 label
			if (
				prefixValue !== undefined &&
				prefixValue !== null &&
				prefixValue !== '' &&
				originalLabel !== undefined &&
				originalLabel !== null &&
				originalLabel !== ''
			) {
				displayLabel = `${prefixValue}${separator}${originalLabel}`;
			} else {
				displayLabel = originalLabel;
			}
		}

		return {
			...item,
			label: displayLabel, // 用于搜索和显示
			displayLabel, // 用于显示
			originalLabel: originalLabel,
			value,
			disabled,
		};
	});
};

const loadConfig = async () => {
	if (!props.componentType) {
		configFromFile.value = {};
		isReady.value = true;
		return;
	}

	try {
		configFromFile.value = await loadApiSelectConfig<SelectInputSettings>(
			props.componentType,
			props as Record<string, any>
		);
	} catch (error) {
		// eslint-disable-next-line no-console
		console.warn(
			`Failed to load config for componentType: ${props.componentType}`,
			error
		);
		configFromFile.value = {};
	} finally {
		isReady.value = true;
	}
};

const loadOptions = async () => {
	if (!props.autoLoad) {
		return;
	}

	loading.value = true;

	try {
		const response = await mergedSettings.value.getTreeData(
			mergedSettings.value.getTreeDataParams || {},
			mergedSettings.value.getTreeDataOptions
		);
		const list = normalizeApiList(response, mergedSettings.value.renderData);
		const sortedList =
			typeof mergedSettings.value.sortFn === 'function'
				? [...list].sort(mergedSettings.value.sortFn)
				: list;

		rawData.value = sortedList;
		options.value = buildOptions(sortedList);
		emit('loaded', options.value, rawData.value);
	} catch (error) {
		options.value = [];
		rawData.value = [];
		emit('load-error', error);
	} finally {
		loading.value = false;
	}
};

const reload = async () => {
	await loadConfig();
	await loadOptions();
};

const internalValue = computed({
	get: () => {
		if (props.multiple) {
			if (Array.isArray(props.modelValue)) {
				return props.modelValue;
			}
			if (
				props.modelValue !== undefined &&
				props.modelValue !== null &&
				props.modelValue !== ''
			) {
				return String(props.modelValue).split(',');
			}
			return [];
		}
		return props.modelValue;
	},
	set: (val) => {
		emit('update:modelValue', val);
	},
});

const handleChange = (value: any) => {
	emit('change', value);
};

const handleVisibleChange = (visible: boolean) => {
	emit('visible-change', visible);
};

const handleRemoveTag = (value: any) => {
	emit('remove-tag', value);
};

const handleClear = () => {
	emit('clear');
	if (props.searchFn) {
		props?.searchFn();
	}
};

const handleBlur = (event: FocusEvent) => {
	emit('blur', event);
	if (props.searchFn) {
		props?.searchFn();
	}
};

const handleFocus = (event: FocusEvent) => {
	emit('focus', event);
};

watch(
	() => props.componentType,
	async () => {
		await reload();
	},
	{ immediate: true }
);

watch(
	() => [
		props.settings,
		props.dictType,
		props.getDataParams,
		props.getTreeDataParams,
	],
	async () => {
		if (!isReady.value) {
			return;
		}

		await loadOptions();
	},
	{ deep: true }
);

defineExpose({
	selectRef,
	reload,
	options,
	rawData,
	loading,
});
</script>

<style scoped>
.select-v2-option-label {
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	display: inline-block;
	max-width: 100%;
}
</style>
