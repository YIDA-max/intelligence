<template>
	<selectInputV2All
		v-if="isReady"
		v-model:queryForm="localQueryForm"
		:settings="mergedSettings"
		:disabled="disabled"
		:enableMultiple="enableMultiple"
		:showInputSearch="showInputSearch"
		@blur="handleBlur"
		v-bind="$attrs"
	/>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import selectInputV2All from '/@/components/TableFormModule/select-input-v2-all.vue';
import { defaultSettings } from './default/defaultConfig';
import type { TreeSelectInputSettings } from './types';
import {
	loadApiSelectConfig,
	mergeApiSelectSettings,
} from '../shared/apiSelect';

defineOptions({
	name: 'TreeSelectInputApi',
	inheritAttrs: false, // 禁用自动继承，手动控制透传
});

interface TreeSelectInputApiProps {
	queryForm: {
		[key: string]: any;
	};
	componentType?: string;
	// 以下参数既可以在 prop 一级使用，也可以在 settings 中使用
	settings?: Partial<TreeSelectInputSettings>;
	text?: string;
	code?: string;
	searchFn?: (data: any) => Promise<void>;
	dictType?: string; // 字典类型参数（仅用于 componentType="dicts" 时）
	disabled?: boolean;
	showInputSearch?: boolean;
	enableMultiple?: boolean;
	prefixKey?: string;
	separator?: string;
	getTreeDataOptions?: any;
}

const props = withDefaults(defineProps<TreeSelectInputApiProps>(), {
	disabled: false,
	showInputSearch: true,
	enableMultiple: true,
	componentType: '',
	settings: () => ({}),
});

const emits = defineEmits<{
	(e: 'update:queryForm', value: any): void;
	(e: 'blur', event: FocusEvent, value: Record<string, any>): void;
}>();

const configFromFile = ref<Partial<TreeSelectInputSettings>>({});
const isReady = ref(false);

const localQueryForm = computed({
	get: () => props.queryForm,
	set: (val) => {
		emits('update:queryForm', val);
	},
});

const mergedSettings = computed(() => {
	const propOverrides: Partial<TreeSelectInputSettings> = {};

	if (props.text !== undefined) {
		propOverrides.text = props.text;
	}

	if (props.code !== undefined) {
		propOverrides.code = props.code;
	}

	if (props.searchFn !== undefined) {
		propOverrides.searchFn = props.searchFn;
	}

	if (props.dictType !== undefined) {
		propOverrides.getTreeDataParams = props.dictType;
	}

	if (props.prefixKey !== undefined) {
		propOverrides.selectTreeProps = {
			...(propOverrides.selectTreeProps || {}),
			prefixKey: props.prefixKey,
		};
	}

	if (props.separator !== undefined) {
		propOverrides.selectTreeProps = {
			...(propOverrides.selectTreeProps || {}),
			separator: props.separator,
		};
	}

	if (props.getTreeDataOptions !== undefined) {
		propOverrides.getTreeDataOptions = props.getTreeDataOptions;
	}

	return mergeApiSelectSettings(
		defaultSettings,
		configFromFile.value,
		props.settings,
		propOverrides
	) as TreeSelectInputSettings;
});

const loadConfig = async (componentType: string) => {
	if (!componentType) {
		configFromFile.value = {};
		isReady.value = true;
		return;
	}

	try {
		configFromFile.value = await loadApiSelectConfig<TreeSelectInputSettings>(
			componentType,
			props as Record<string, any>
		);
	} catch (error) {
		// eslint-disable-next-line no-console
		console.warn(
			`Failed to load config for componentType: ${componentType}`,
			error
		);
		configFromFile.value = {};
	} finally {
		isReady.value = true;
	}
};

watch(
	() => props.componentType,
	async (val) => {
		await loadConfig(val);
	},
	{ immediate: true }
);

watch(
	() => props.settings,
	() => {
		// settings are merged in computed
	},
	{ deep: true }
);

const handleBlur = (event: FocusEvent, value: Record<string, any>) => {
	emits('blur', event, value);
};
</script>
