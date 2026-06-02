<script setup lang="ts">
/**
 * QueryField（操作符 + 数值筛选）
 *
 * 设计说明：
 * 1. 通过 `searchTypes` 驱动渲染（single / range / empty），后续新增类型时按同分区扩展即可。
 * 2. 组件统一维护 `queryForm[typeKey]`（操作符）和 `queryForm[valuesKey]`（值数组）。
 * 3. 查询触发规则：
 *    - single：输入框失焦触发查询
 *    - range：仅当最小值和最大值都有效时，失焦触发查询
 *    - empty：仅筛选空值，不展示可输入值
 */
import { computed, onMounted } from 'vue';

type QueryForm = Record<string, any>;

export type OperatorInputMode = 'single' | 'range' | 'empty';

export interface IOperatorOption {
	/** 输入模式：单值 / 范围 / 空值 */
	type: OperatorInputMode;
	/** 展示文本 */
	label: string;
	/** 选中后写入 `queryForm[typeKey]` 的唯一值（如后端 DTO 枚举），须与表单里存的值一致 */
	value: string | number;
}

/**
 * 操作符 + 数值筛选（v-model:queryForm）
 *
 * 约定：组件不做任何“字段加工/映射”，只按你传入的 `searchTypes` 渲染输入形态，
 * 并把结果写回到 `queryForm[typeKey]`（选中项的 `value`；字段名默认 `type`）与 `queryForm[valuesKey]`（输入值数组，默认 `value`）。
 *
 * - 操作符选中值：`typeKey` 指定字段（默认 `type`）
 * - 数值数组：`valuesKey` 指定字段（默认 `value`）
 *   - single：[v]
 *   - range：[min,max]
 *   - empty：[]
 *
 * 切换操作符时会重置数值数组形态，避免残留；切换操作符本身不触发 getDataList。
 * 区间为「最小值～最大值」时，失焦后仅当两端都有有效数值才发起列表请求。
 */
const props = withDefaults(
	defineProps<{
		queryForm: QueryForm;
		label: string;
		searchTypes: IOperatorOption[];
		getDataList?: () => void;
		precision?: number;
		disabled?: boolean;
		selectWidth?: string;
		inputWidth?: string;
		labelWidth?: string;
		/** queryForm 上存操作符选中值的字段名（与选项 `value` 一致），默认 `type` */
		typeKey?: string;
		/** queryForm 上存放数值数组的字段名，默认 `value` */
		valuesKey?: string;
	}>(),
	{
		queryForm: () => ({}),
		label: '',
		searchTypes: () => [],
		getDataList: undefined,
		precision: 4,
		disabled: false,
		selectWidth: '120px',
		inputWidth: undefined,
		labelWidth: '64px',
		typeKey: 'type',
		valuesKey: 'value',
	}
);

const resolveTypeKey = () => props.typeKey ?? 'type';
const resolveValuesKey = () => props.valuesKey ?? 'value';

const emits = defineEmits(['update:queryForm']);

/** 代理 v-model:queryForm，内部统一通过它读写父层查询对象 */
const localQueryForm = computed({
	get: () => props.queryForm,
	set: (val: QueryForm) => emits('update:queryForm', val),
});

/** ==================== 通用读写 ==================== */
const getStoredOperator = () =>
	localQueryForm.value[resolveTypeKey()] as string | number | undefined | null;

/** 按 value 查找 searchTypes 下标，便于统一复用 */
const findSearchTypeIndexByValue = (v: string | number | undefined | null) => {
	if (v === undefined || v === null) return -1;
	return props.searchTypes.findIndex((opt) => opt.value === v);
};

/** 当前选中项下标；未命中时回退到第 0 项，保证渲染稳定 */
const getSelectedSearchTypeIndex = (): number => {
	const list = props.searchTypes;
	if (!list.length) return 0;
	const ix = findSearchTypeIndexByValue(getStoredOperator());
	return ix >= 0 ? ix : 0;
};

/** 获取操作符 */
const getOperator = (): string | number | undefined => {
	const stored = getStoredOperator();
	return findSearchTypeIndexByValue(stored) >= 0
		? (stored as string | number)
		: undefined;
};

/** 读取数值数组（single: [v], range: [min,max], empty: []） */
const getValueArray = (): any[] => {
	const k = resolveValuesKey();
	return (localQueryForm.value[k] ?? []) as any[];
};

/** 根据当前操作符推导渲染模式 */
const getMode = (): OperatorInputMode => {
	const i = getSelectedSearchTypeIndex();
	return props.searchTypes[i]?.type ?? 'single';
};

/** 统一写 values 字段，避免各处重复拼 key */
const setValues = (values: Array<number | undefined>) => {
	localQueryForm.value[resolveValuesKey()] = values;
};

/** 触发搜索 */
const triggerSearch = () => {
	props.getDataList?.();
};

/** ==================== single 模式 ==================== */
/** single 初始化：保留一个输入位 */
const initSingleValues = () => setValues([undefined]);

/** single 值变化，仅更新 values[0] */
const onSingleChange = (v: number | null) => {
	if (props.disabled) return;
	setValues([v ?? undefined]);
};

/** ==================== range 模式 ==================== */
/** range 初始化：固定两个输入位 [min,max] */
const initRangeValues = () => setValues([undefined, undefined]);

/** range 局部更新：只改指定索引，另一个值保持不变 */
const patchRange = (idx: 0 | 1, v: number | null) => {
	if (props.disabled) return;
	const current = getValueArray();
	const arr: [number | undefined, number | undefined] = [
		current?.[0],
		current?.[1],
	];
	arr[idx] = v ?? undefined;
	setValues(arr);
};

const onRangeMinChange = (v: number | null) => patchRange(0, v);
const onRangeMaxChange = (v: number | null) => patchRange(1, v);

/** range 查询门禁：两端都是有效数字时才触发查询 */
const triggerSearchIfRangeComplete = () => {
	if (props.disabled || getMode() !== 'range') return;
	const arr = getValueArray();
	const min = arr[0];
	const max = arr[1];
	const isRangeComplete =
		typeof min === 'number' &&
		!Number.isNaN(min) &&
		typeof max === 'number' &&
		!Number.isNaN(max);
	if (isRangeComplete) triggerSearch();
};

/** ==================== empty 模式 ==================== */
/** empty 模式无输入值，直接置空数组 */
const initEmptyValues = () => setValues([]);

/**
 * ==================== 统一入口 ====================
 * 切换操作符：写入 queryForm[typeKey]，并根据模式初始化 values。
 */
const onOperatorChange = (v: string | number) => {
	if (props.disabled) return;
	const list = props.searchTypes;
	const idx = findSearchTypeIndexByValue(v);
	if (idx < 0) return;
	const mode = list[idx]?.type ?? 'single';

	const tk = resolveTypeKey();
	localQueryForm.value[tk] = v;

	// 不同模式归拢在这里初始化，后续扩展新模式时直接在此分支追加
	if (mode === 'empty') {
		initEmptyValues();
	} else if (mode === 'range') {
		initRangeValues();
	} else {
		initSingleValues();
	}
	// 切换条件类型不自动查询，等用户改完数值后再查（由输入框 @change 触发）
};

// 避免在 template 里写箭头函数，保持事件绑定简洁
/** 下拉选项变化（参数为对应项的 `value`） */
const onSelectChange = (v: string | number) => onOperatorChange(v);
/** 挂载默认选中第一项，确保 queryForm 中始终有合法模式 */
onMounted(() => {
	const list = props.searchTypes;
	if (!list.length) return;
	onOperatorChange(list[0].value);
});
</script>

<template>
	<div class="query-field flex items-center">
		<!-- <span
			class="mr-2 text-sm text-gray-500 whitespace-nowrap text-right"
			:style="{ width: props.labelWidth }"
			>{{ props.label }}</span
		> -->

		<el-select
			class="qy-qf__select"
			:model-value="getOperator()"
			:disabled="props.disabled"
			:style="{ width: props.selectWidth || '120px' }"
			placeholder="条件"
			@change="onSelectChange"
		>
			<el-option
				v-for="(opt, idx) in props.searchTypes"
				:key="idx"
				:label="opt.label"
				:value="opt.value"
			/>
		</el-select>

		<template v-if="getMode() === 'single'">
			<el-input-number
				class="qy-qf__input"
				:model-value="getValueArray()?.[0]"
				:disabled="props.disabled"
				controls-position="right"
				align="left"
				placeholder="费用差额"
				:precision="props.precision ?? 4"
				:style="{ width: props.inputWidth || '140px' }"
				@update:model-value="onSingleChange"
				@blur="triggerSearch"
			/>
		</template>

		<template v-else-if="getMode() === 'range'">
			<el-input-number
				class="qy-qf__input qy-qf__input--first"
				:model-value="getValueArray()?.[0]"
				:disabled="props.disabled"
				controls-position="right"
				align="left"
				placeholder="费用差额"
				:precision="props.precision ?? 4"
				:style="{ width: props.inputWidth || '140px' }"
				@update:model-value="onRangeMinChange"
				@blur="triggerSearchIfRangeComplete"
			/>
			<!-- <span class="qy-qf__sep text-gray-400">~</span> -->
			<el-input-number
				class="qy-qf__input qy-qf__input--last"
				:model-value="getValueArray()?.[1]"
				:disabled="props.disabled"
				controls-position="right"
				align="left"
				:precision="props.precision ?? 4"
				:style="{ width: props.inputWidth || '140px' }"
				placeholder="费用差额"
				@update:model-value="onRangeMaxChange"
				@blur="triggerSearchIfRangeComplete"
			/>
		</template>

		<template v-else>
			<el-input
				class="qy-qf__input"
				:disabled="true"
				:style="{ width: props.inputWidth || '140px' }"
				placeholder="仅筛选空值"
			/>
		</template>
	</div>
</template>

<style scoped lang="scss">
.query-field {
	/* 让控件看起来一体化：不留空隙，边框不双线 */
}

.qy-qf__select :deep(.el-select__wrapper) {
	border-top-right-radius: 0;
	border-bottom-right-radius: 0;
}

.qy-qf__input {
	margin-left: -1px; /* 盖住相邻边框，避免双线/空隙 */
}

.qy-qf__input :deep(.el-input__wrapper),
.qy-qf__input :deep(.el-input-number__decrease),
.qy-qf__input :deep(.el-input-number__increase) {
	border-top-left-radius: 0;
	border-bottom-left-radius: 0;
}

.qy-qf__sep {
	margin-left: -1px;
	margin-right: -1px;
	padding: 0 6px;
	line-height: 32px;
	border-top: 1px solid var(--el-border-color);
	border-bottom: 1px solid var(--el-border-color);
	background: var(--el-fill-color-blank);
}
</style>
