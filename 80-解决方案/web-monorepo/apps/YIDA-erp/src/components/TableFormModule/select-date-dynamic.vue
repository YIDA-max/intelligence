<template>
	<div class="flex items-center">
		<el-select
			v-model="selectTime"
			placeholder="请选择"
			:style="{ width: props.settings.selectStyle?.width || '150px' }"
			@change="handleSearchTypeChange"
		>
			<el-option
				v-for="item in props.searchTypes"
				:key="item.value"
				:label="item.label"
				:value="item.value"
			/>
		</el-select>
		<el-date-picker
			v-model="timeRange[0]"
			:type="currentDateType"
			:style="{ width: props.settings.dateStyle?.width || '160px' }"
			:placeholder="getStartPlaceholder()"
			:value-format="currentValueFormat"
			@change="changeTimeRange"
		/>
		<el-date-picker
			v-model="timeRange[1]"
			:type="currentDateType"
			:style="{ width: props.settings.dateStyle?.width || '160px' }"
			:placeholder="getEndPlaceholder()"
			:value-format="currentValueFormat"
			:disabled-date="endMonthDisabled"
			@change="changeTimeRange"
		/>
	</div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import dayjs from 'dayjs';
import { ElMessage } from 'element-plus';

type SearchType = {
	label: string;
	value: string;
	dateType?: 'date' | 'month';
	isAddHMS: boolean;
	dateStart: string;
	dateEnd: string;
	dateStartText?: string;
	dateEndText?: string;
	defaultMonthsAgo?: number;
	defaultYear?: number | 'current';
	defaultCurrentMonth?: boolean;
	/** 月份模式时，结束月份下拉只允许选和第一个相同的月份 */
	singleMonth?: boolean;
	autoInit?: boolean;
	[k: string]: any;
};

const props = defineProps({
	settings: {
		type: Object as () => {
			selectStyle?: { width: string };
			dateStyle?: { width: string };
			[key: string]: any;
		},
		default: () => ({ selectStyle: { width: '150px' } }),
	},
	searchTypes: {
		type: Array as () => SearchType[],
		default: () => [],
		required: true,
	},
	queryForm: {
		type: Object as () => Record<string, any>,
		default: () => ({}),
	},
	getDataList: {
		type: Function,
		default: () => () => {},
	},
	searchFn: {
		type: Function,
		default: () => () => {},
	},
});

const emits = defineEmits(['update:queryForm']);

const selectTime = ref<any>(props.searchTypes[0]?.value);
const timeRange = ref<[string | null, string | null]>([null, null]);

// 当前选中的 searchType 配置
const currentSearchType = computed(() =>
	props.searchTypes.find((i) => i.value === selectTime.value)
);

const currentDateType = computed(
	() => currentSearchType.value?.dateType ?? 'date'
);

const isSingleMonth = computed(
	() =>
		currentSearchType.value?.dateType === 'month' &&
		currentSearchType.value?.singleMonth
);

const currentValueFormat = computed(() => {
	const type: string = currentDateType.value;
	if (type === 'month' || type === 'months') return 'YYYY-MM';
	if (type === 'year') return 'YYYY';
	return 'YYYY-MM-DD';
});

const localQueryForm = computed({
	get: () => props.queryForm,
	set: (val) => emits('update:queryForm', val),
});

watch(
	() => props.queryForm,
	(newVal) => {
		const st = currentSearchType.value;
		if (!st) return;
		if (!newVal[st.dateStart] && !newVal[st.dateEnd]) {
			timeRange.value = [null, null];
		}
	},
	{ deep: true }
);

const getStartPlaceholder = () =>
	currentSearchType.value?.dateStartText ||
	(currentDateType.value === 'month' ? '开始月' : '开始日期');

const getEndPlaceholder = () =>
	currentSearchType.value?.dateEndText ||
	(currentDateType.value === 'month' ? '结束月' : '结束日期');

const endMonthDisabled = (date: Date) => {
	if (!isSingleMonth.value || !timeRange.value[0]) return false;
	return !dayjs(date).isSame(dayjs(timeRange.value[0]), 'month');
};

// 根据选中类型计算默认时间，更新表单和日期选择器显示
function applyDefaultTimeByType(st?: SearchType, applyToQueryForm = true) {
	if (!st) return;

	const isMonth = st.dateType === 'month';

	let start: dayjs.Dayjs;
	let end: dayjs.Dayjs;

	if (isMonth) {
		start =
			typeof st.defaultMonthsAgo === 'number'
				? dayjs().subtract(st.defaultMonthsAgo, 'month').startOf('month')
				: dayjs().startOf('month');
		end = start;
	} else if (st.defaultCurrentMonth) {
		start = dayjs().startOf('month');
		end = dayjs();
	} else if (st.defaultYear != null) {
		const y = st.defaultYear === 'current' ? dayjs().year() : st.defaultYear;
		start = dayjs().year(y).startOf('year');
		end = dayjs().year(y).endOf('year');
	} else if (typeof st.defaultMonthsAgo === 'number') {
		end = dayjs();
		start = dayjs().subtract(st.defaultMonthsAgo, 'month');
	} else {
		start = dayjs();
		end = dayjs();
	}

	const storageFormat = isMonth
		? 'YYYY-MM'
		: st.isAddHMS
		? 'YYYY-MM-DD HH:mm:ss'
		: 'YYYY-MM-DD';

	const dateStartValue = isMonth
		? start.format('YYYY-MM')
		: st.isAddHMS
		? start.startOf('day').format(storageFormat)
		: start.format(storageFormat);

	const dateEndValue = isMonth
		? end.format('YYYY-MM')
		: st.isAddHMS
		? end.endOf('day').format(storageFormat)
		: end.format(storageFormat);

	if (applyToQueryForm) {
		timeRange.value = [
			start.format(currentValueFormat.value),
			end.format(currentValueFormat.value),
		];
		localQueryForm.value[st.dateStart] = dateStartValue;
		localQueryForm.value[st.dateEnd] = dateEndValue;
	}

	return { dateStart: dateStartValue, dateEnd: dateEndValue };
}

// 重置当前类型到默认值（供父组件调用）
function resetToDefault() {
	const st = currentSearchType.value;
	if (!st) return;
	applyDefaultTimeByType(st, true);
}

defineExpose({ resetToDefault });

// 切换左侧选项时的处理
function handleSearchTypeChange() {
	const st = currentSearchType.value;
	if (!st) return;

	// 先清空日期选择器显示，再清除表单字段，防止类型切换时旧数据残留
	timeRange.value = [null, null];
	props.searchTypes.forEach((item) => {
		if (item.dateStart) localQueryForm.value[item.dateStart] = null;
		if (item.dateEnd) localQueryForm.value[item.dateEnd] = null;
	});

	const shouldInit =
		st.autoInit ||
		st.defaultCurrentMonth ||
		(st.dateType === 'month' && typeof st.defaultMonthsAgo === 'number');

	if (shouldInit) {
		applyDefaultTimeByType(st, true);
	}

	props.getDataList();
	props.searchFn?.();
}

// 初始化默认值
function initDefaults() {
	const st = currentSearchType.value;
	if (!st) return;

	const shouldInit =
		st.autoInit ||
		st.defaultCurrentMonth ||
		(st.dateType === 'month' && typeof st.defaultMonthsAgo === 'number');

	if (shouldInit) {
		applyDefaultTimeByType(st, true);
		return;
	}

	const startVal = localQueryForm.value[st.dateStart];
	const endVal = localQueryForm.value[st.dateEnd];
	if (startVal && endVal) {
		timeRange.value = [
			dayjs(startVal).format(currentValueFormat.value),
			dayjs(endVal).format(currentValueFormat.value),
		];
	} else {
		applyDefaultTimeByType(st, true);
	}
}

initDefaults();

function changeTimeRange() {
	const st = currentSearchType.value;
	if (!st) return;

	const { dateStart, dateEnd, isAddHMS } = st;

	if (isSingleMonth.value) {
		timeRange.value = [timeRange.value[0], timeRange.value[0]];
	}

	const [start, end] = timeRange.value || [];

	// 清空其他类型的时间字段，避免提交时混入无关参数
	props.searchTypes.forEach((item) => {
		if (item.value === selectTime.value) return;
		if (item.dateStart) localQueryForm.value[item.dateStart] = null;
		if (item.dateEnd) localQueryForm.value[item.dateEnd] = null;
	});

	if (start && end && start > end) {
		ElMessage.warning('开始日期不能晚于结束日期');
		timeRange.value = [null, null];
		localQueryForm.value[dateStart] = null;
		localQueryForm.value[dateEnd] = null;
		return;
	}

	if (isAddHMS) {
		localQueryForm.value[dateStart] = start
			? dayjs(start).startOf('day').format('YYYY-MM-DD HH:mm:ss')
			: null;
		localQueryForm.value[dateEnd] = end
			? currentDateType.value === 'month'
				? dayjs(end).endOf('month').format('YYYY-MM-DD HH:mm:ss')
				: dayjs(end).endOf('day').format('YYYY-MM-DD HH:mm:ss')
			: null;
	} else {
		localQueryForm.value[dateStart] = start || null;
		localQueryForm.value[dateEnd] = end || null;
	}

	props.getDataList();
	props.searchFn?.();
}
</script>

<style lang="scss" scoped></style>
