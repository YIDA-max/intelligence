<template>
	<CustomCascader
		v-if="isReady"
		v-model:queryForm="localQueryForm"
		:settings="mergedSettings"
		:data="localData"
		:showError="showError"
		v-bind="$attrs"
		@change="handleChange"
	/>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import CustomCascader from '/@/components/TreeSelectInput/custom-cascader.vue';
import type { CustomCascaderSettings } from './types';
import { defaultSettings } from './default/defaultConfig';
import { deepMerge } from '/@/utils/common/deepMerge';

defineOptions({
	name: 'CustomCascaderApi',
});

interface CustomCascaderApiProps {
	queryForm: {
		[key: string]: any;
	};
	componentType?: string;
	settings?: Partial<CustomCascaderSettings>;
	// 以下参数既可以在 prop 一级使用，也可以在 settings 中使用
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
	blacklist?: (string | number)[]; //黑名单,传第一级的id的取值
}

const props = withDefaults(defineProps<CustomCascaderApiProps>(), {
	componentType: '',
	settings: () => ({}),
	showError: false,
	data: () => [],
	blacklist: () => [],
});

const emits = defineEmits<{
	(e: 'update:queryForm', value: any): void;
	(e: 'change', value: any): void;
}>();

const configFromFile = ref<Partial<CustomCascaderSettings>>({});
const isReady = ref(false);
const localData = ref<any[]>([]);
const getDataFunction = ref<
	((params?: Record<string, any>) => Promise<any[]>) | null
>(null);

const localQueryForm = computed({
	get: () => props.queryForm,
	set: (val) => {
		emits('update:queryForm', val);
	},
});

// 合并 getDataParams，prop 优先级高于 settings
const mergedGetDataParams = computed(() => {
	if (props.getDataParams !== undefined) {
		return props.getDataParams;
	}
	if (props.settings?.getDataParams !== undefined) {
		return props.settings.getDataParams;
	}
	return {};
});

// Merge settings: default -> config file -> props.settings -> props (text/code)
const mergedSettings = computed<CustomCascaderSettings>(() => {
	// Start with default settings
	let merged = { ...defaultSettings };

	// Merge with config file settings
	if (Object.keys(configFromFile.value).length > 0) {
		merged = deepMerge(merged, configFromFile.value);
	}

	// Merge with props.settings (highest priority for settings object)
	if (Object.keys(props.settings).length > 0) {
		merged = deepMerge(merged, props.settings);
	}

	// Override with prop-level values (highest priority)
	if (props.text !== undefined) {
		merged.text = props.text;
	}

	if (props.code !== undefined) {
		merged.code = props.code;
	}

	if (props.searchFn !== undefined) {
		merged.searchFn = props.searchFn;
	}

	return merged as CustomCascaderSettings;
});

// 加载数据
const loadData = async () => {
	// 如果外部传入了 data，直接使用
	if (props.data && props.data.length > 0) {
		localData.value = filterTreeByBlacklist(props.data, props.blacklist);
		return;
	}

	// 如果外部传入了 getData 方法，则优先调用
	if (props.getData) {
		try {
			const data = await props.getData(mergedGetDataParams.value);
			localData.value = filterTreeByBlacklist(data, props.blacklist);
		} catch (error) {
			localData.value = [];
		}
		return;
	}

	// 如果配置文件中有 getData 方法，则调用
	if (getDataFunction.value) {
		try {
			const data = await getDataFunction.value(mergedGetDataParams.value);
			localData.value = filterTreeByBlacklist(data, props.blacklist);
		} catch (error) {
			localData.value = [];
		}
	} else {
		localData.value = [];
	}
};

// Load config file based on componentType
const loadConfig = async (componentType: string) => {
	if (!componentType) {
		configFromFile.value = {};
		getDataFunction.value = null;
		isReady.value = true;
		await loadData();
		return;
	}

	try {
		const module = await import(`./confige/${componentType}.ts`);
		const configData = module?.defaultConfigData ?? {};
		const handler = module?.preConfigDefault ?? ((data: any) => data);
		configFromFile.value = handler(configData, props) ?? {};

		// 获取 getData 方法
		getDataFunction.value = module?.getData ?? null;

		// 配置加载完成后，标记为就绪
		isReady.value = true;

		// 加载数据
		await loadData();
	} catch (error) {
		// eslint-disable-next-line no-console
		console.warn(
			`Failed to load config for componentType: ${componentType}`,
			error
		);
		configFromFile.value = {};
		getDataFunction.value = null;
		isReady.value = true;
		await loadData();
	}
};

// 级联树过滤函数
const filterTreeByBlacklist = (tree: any[], blacklist: (string | number)[]) => {
	if (!blacklist?.length) return tree;

	const set = new Set(blacklist);

	return tree.filter((node) => !set.has(node.id));
};

// Handle change event
const handleChange = (value: any) => {
	emits('change', value);

	// 如果配置了 searchFn，则触发搜索
	if (mergedSettings.value.searchFn) {
		mergedSettings.value.searchFn(value);
	}
};

// Watch componentType changes
watch(
	() => props.componentType,
	async (val) => {
		await loadConfig(val);
	},
	{ immediate: true }
);

// Watch data changes
watch(
	() => props.data,
	async () => {
		await loadData();
	},
	{ deep: true }
);

// Watch getData changes
watch(
	() => props.getData,
	async () => {
		// 只有在没有外部传入 data 时才重新加载
		if (!props.data || props.data.length === 0) {
			await loadData();
		}
	}
);

// Watch getDataParams changes
watch(
	mergedGetDataParams,
	async () => {
		// 只有在没有外部传入 data 时才重新加载
		if (!props.data || props.data.length === 0) {
			await loadData();
		}
	},
	{ deep: true }
);

// Watch settings changes
watch(
	() => props.settings,
	() => {
		// Settings will be automatically merged via computed property
	},
	{ deep: true }
);
</script>
