<template>
	<el-select-v2
		ref="selectRef"
		v-model="localQueryForm[props.settings.code || 'categoryCodes']"
		:placeholder="$t(props.settings.text || '')"
		:options="optionList"
		:props="selectProps"
		:disabled="disabled"
		:filterable="showInputSearch"
		:filter-method="handleFilterMethod"
		:multiple="enableMultiple"
		:collapse-tags="collapseTags"
		:max-collapse-tags="maxCollapseTags"
		:collapse-tags-tooltip="collapseTagsTooltip"
		:clearable="clearable"
		:fit-input-width="fitInputWidth"
		:persistent="false"
		:style="{ width: props.settings.width || '280px' }"
		v-bind="attrsWithoutChange"
		@change="handleChange"
		@clear="handleClear"
		@blur="handleBlur"
	>
		<!-- 全选 header -->
		<template #header>
			<el-checkbox
				v-if="enableMultiple"
				v-model="checkAll"
				:indeterminate="isIndeterminate"
				@change="handleCheckAllChange"
			>
				全选
			</el-checkbox>
		</template>

		<!-- 自定义选项，带 tooltip 防止文字截断 -->
		<template #default="{ item }">
			<el-tooltip
				:content="item[labelKey]"
				placement="right-start"
				:show-after="500"
			>
				<span class="select-v2-option-label">{{ item[labelKey] }}</span>
			</el-tooltip>
		</template>

		<!-- 确定/关闭 footer -->
		<template #footer>
			<div class="flex justify-end gap-1">
				<el-button plain size="small" @click="handleCancel">
					{{ $t('关闭') }}
				</el-button>
				<el-button type="primary" plain size="small" @click="handleConfirm">
					{{ $t('确定') }}
				</el-button>
			</div>
		</template>
	</el-select-v2>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, useAttrs } from 'vue';

defineOptions({
	name: 'SelectInputV2All',
	inheritAttrs: false,
});

const props = defineProps({
	settings: {
		type: Object as () => {
			getTreeData: (
				params?: Record<string, any> | any,
				options?: any
			) => Promise<{ code: number; data: any }> | { code: number; data: any };
			getTreeDataParams?: Record<string, any> | string;
			getTreeDataOptions?: any;
			width?: string;
			text?: string;
			code?: string;
			searchFn?: (data: any) => Promise<void>;
			selectTreeProps?: {
				value?: string;
				label?: string;
				children?: string;
				prefixKey?: string;
				separator?: string;
			};
			getIdsCode: string;
			renderData?: (data: any) => any;
		},
		default: () => ({
			getTreeData: async () => ({ code: 0, data: [] }),
			getTreeDataParams: {},
			width: '280px',
			text: '类目',
			code: 'categoryCodes',
			searchFn: () => Promise.resolve(),
			selectTreeProps: { value: 'value', label: 'label', children: 'children' },
			getIdsCode: 'id',
			renderData: (data: any) => data,
		}),
	},
	queryForm: {
		type: Object as () => { categoryCodes?: number[]; [key: string]: any },
		default: () => ({}),
	},
	disabled: {
		type: Boolean,
		default: false,
	},
	// 映射为是否开启内置 filterable
	showInputSearch: {
		type: Boolean,
		default: true,
	},
	enableMultiple: {
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
	clearable: {
		type: Boolean,
		default: true,
	},
	fitInputWidth: {
		type: Boolean,
		default: true,
	},
});

const emits = defineEmits(['update:queryForm', 'blur']);

// ---- 计算 value/label 字段名 ----
const valueKey = computed(
	() => props.settings.selectTreeProps?.value || 'value'
);
const labelKey = computed(
	() => props.settings.selectTreeProps?.label || 'label'
);

// el-select-v2 的 props 映射配置
const selectProps = computed(() => ({
	value: valueKey.value,
	label: labelKey.value,
}));

// ---- 数据 ----
const allOptions = ref<any[]>([]); // 完整数据，不随搜索变化
const optionList = ref<any[]>([]); // 实际传给组件的数据（搜索时为过滤后的子集）

onMounted(async () => {
	const res = await props.settings.getTreeData(
		props.settings.getTreeDataParams || {},
		props.settings.getTreeDataOptions
	);
	if (res.code === 0) {
		let data: any[] = [];
		if (Array.isArray(res.data)) {
			data = res.data;
		} else if (res.data?.records && Array.isArray(res.data.records)) {
			data = res.data.records;
		}
		const processed = props.settings.renderData
			? props.settings.renderData(data)
			: data;

		const prefixKey =
			props.settings.selectTreeProps?.prefixKey ??
			(props.settings as any).prefixKey;
		const separator =
			props.settings.selectTreeProps?.separator ??
			(props.settings as any).separator ??
			'-';

		const mappedProcessed = processed.map((item: any) => {
			const originalLabel = item[labelKey.value];
			let displayLabel = originalLabel;

			const prefixValue = prefixKey ? item[prefixKey] : undefined;
			if (
				prefixValue !== undefined &&
				prefixValue !== null &&
				prefixValue !== '' &&
				originalLabel !== undefined &&
				originalLabel !== null &&
				originalLabel !== ''
			) {
				displayLabel = `${prefixValue}${separator}${originalLabel}`;
			}

			return {
				...item,
				[labelKey.value]: displayLabel,
				_originalLabel: originalLabel,
			};
		});

		const sorted =
			typeof (props.settings as any).sortFn === 'function'
				? [...mappedProcessed].sort((props.settings as any).sortFn)
				: mappedProcessed;

		allOptions.value = sorted;
		optionList.value = sorted;
	}
});

// ---- 双向绑定 ----
const localQueryForm = computed({
	get: () => props.queryForm,
	set: (val) => emits('update:queryForm', val),
});

// ---- 全选状态 ----
const checkAll = ref(false);
const isIndeterminate = ref(false);

const updateCheckAllState = (selectedIds: any[]) => {
	// 基于当前 optionList（可能是过滤后的）计算全选状态
	const currentIds = optionList.value.map((item) => item[valueKey.value]);
	const selectedInCurrent = selectedIds.filter((id) => currentIds.includes(id));
	const selectedCount = selectedInCurrent.length;
	const totalCount = currentIds.length;

	if (selectedCount === 0 || totalCount === 0) {
		checkAll.value = false;
		isIndeterminate.value = false;
	} else if (selectedCount === totalCount) {
		checkAll.value = true;
		isIndeterminate.value = false;
	} else {
		checkAll.value = false;
		isIndeterminate.value = true;
	}
};

// ---- 内置搜索过滤 ----
const handleFilterMethod = (query: string) => {
	const q = query.trim().toLowerCase();
	optionList.value = q
		? allOptions.value.filter((item) =>
				String(item[labelKey.value] ?? '')
					.toLowerCase()
					.includes(q)
		  )
		: allOptions.value;

	// 搜索后重新计算全选状态
	const currentSelected = (localQueryForm.value[
		props.settings.code || 'categoryCodes'
	] ?? []) as any[];
	updateCheckAllState(currentSelected);
};

// ---- change 事件：合并内部逻辑 + 透传上层 onChange ----
const attrs = useAttrs();
const attrsWithoutChange = computed(() => {
	const { ...rest } = attrs as Record<string, any>;
	return rest;
});

const handleChange = (val: any) => {
	// 更新全选状态
	updateCheckAllState(Array.isArray(val) ? val : val ? [val] : []);
	// 透传上层 onChange
	(attrs.onChange as ((...args: any[]) => void) | undefined)?.(val);
};

// ---- 全选 ----
const handleCheckAllChange = (value: boolean) => {
	checkAll.value = value;
	isIndeterminate.value = false;

	const currentSelected = (localQueryForm.value[
		props.settings.code || 'categoryCodes'
	] ?? []) as any[];
	const currentIds = optionList.value.map((item) => item[valueKey.value]);

	if (value) {
		// 合并已选 + 当前列表所有项（去重）
		localQueryForm.value[props.settings.code || 'categoryCodes'] = [
			...new Set([...currentSelected, ...currentIds]),
		];
	} else {
		// 移除当前列表中的项
		localQueryForm.value[props.settings.code || 'categoryCodes'] =
			currentSelected.filter((id) => !currentIds.includes(id));
	}
};

// ---- 清空 ----
const handleClear = () => {
	checkAll.value = false;
	isIndeterminate.value = false;
	// 清空后触发查询
	props.settings.searchFn?.(
		localQueryForm.value[props.settings.code || 'categoryCodes']
	);
	// 透传上层 onClear
	(attrs.onClear as ((...args: any[]) => void) | undefined)?.();
};

// ---- 失去焦点 ----
const handleBlur = () => {
	props.settings.searchFn?.(
		localQueryForm.value[props.settings.code || 'categoryCodes']
	);
	emits('blur', localQueryForm.value[props.settings.code || 'categoryCodes']);
};
// ---- 确定 ----
const selectRef = ref();
const handleConfirm = () => {
	props.settings.searchFn?.(
		localQueryForm.value[props.settings.code || 'categoryCodes']
	);
	selectRef.value?.blur();
};

// ---- 取消 ----
const handleCancel = () => {
	//原关闭逻辑是清空所有数据并清空
	// localQueryForm.value[props.settings.code || 'categoryCodes'] = []
	// checkAll.value = false
	// isIndeterminate.value = false
	props.settings.searchFn?.(
		localQueryForm.value[props.settings.code || 'categoryCodes']
	);
	selectRef.value?.blur();
};

defineExpose({ selectRef });
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
