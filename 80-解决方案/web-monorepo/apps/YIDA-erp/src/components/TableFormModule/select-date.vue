<!--
 * @Author: 朱寒松 3136271519@qq.com
 * @Date: 2025-07-10 11:00:33
 * @LastEditors: wuyueqin wuyueqin@merach.com
 * @LastEditTime: 2026-04-07 11:53:06
 * @FilePath: \qianyi-ui\src\components\TableFormModule\select-date.vue
 * @Description: 
 * 
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved. 
-->
<template>
	<div class="flex items-center">
		<el-select
			v-model="selectTime"
			placeholder="请选择"
			:style="{
				width: props.settings.selectStyle.width,
			}"
			@change="
				() => {
					changeCreatedIsUpdate();
				}
			"
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
			:type="props.dateType"
			:style="{ width: props.settings.dateStyle?.width || '220px' }"
			:placeholder="getStartPlaceholder()"
			:value-format="getValueFormat"
			@change="
				() => {
					changeTimeRange();
				}
			"
		></el-date-picker>
		<el-date-picker
			v-model="timeRange[1]"
			:type="props.dateType"
			:style="{ width: props.settings.dateStyle?.width || '220px' }"
			:placeholder="getEndPlaceholder()"
			:value-format="getValueFormat"
			@change="
				() => {
					changeTimeRange();
				}
			"
		></el-date-picker>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import dayjs from 'dayjs';
import { ElMessage } from 'element-plus';

// 根据 dateType 获取 value-format
const getValueFormat = computed(() => {
	const type = props.dateType;
	if (type === 'month' || type === 'months') return 'YYYY-MM';
	if (type === 'year') return 'YYYY';
	return 'YYYY-MM-DD';
});

type SearchType = {
	label: string;
	value: string;
	isAddHMS: boolean;
	dateStart: string;
	dateEnd: string;
	dateStartText?: string;
	dateEndText?: string;
	defaultDaysAgo?: number;
	defaultMonthsAgo?: number;
	defaultYear?: number | 'current';
	defaultCurrentMonth?: boolean; //选择的类型为月份
	autoInit?: boolean; // 是否自动初始化到 queryForm（在 setup 阶段立即执行）
	[k: string]: any;
};
const props = defineProps({
	settings: {
		type: Object as () => {
			selectStyle: {
				width: string;
			};
			dateStyle?: {
				width: string;
			};
			[key: string]: any;
		},
		default: () => ({
			selectStyle: {
				width: '150px',
			},
		}),
		required: true,
	},
	dateType: {
		type: String,
		default: 'date', // el-date-picker 的 type，默认 date
	},
	searchTypes: {
		type: Array as () => SearchType[],
		default: () => [],
		required: true,
	},
	queryForm: {
		type: Object as () => {
			[key: string]: any;
		},
		default: () => ({}),
	},
	getDataList: {
		type: Function,
		default: () => () => {},
	},
	//搜索的方法，功能同getDataList，为了和其他组件的搜索触发保持一致
	searchFn: {
		type: Function,
		default: () => () => {},
	},
});

const emits = defineEmits(['update:queryForm']);

// 根据 dateType 获取默认开始占位文字
const getDefaultStartText = () => {
	const type = props.dateType;
	if (type === 'month' || type === 'months') return '开始月';
	if (type === 'week') return '开始周';
	return '开始日期';
};

// 根据 dateType 获取默认结束占位文字
const getDefaultEndText = () => {
	const type = props.dateType;
	if (type === 'month' || type === 'months') return '结束月';
	if (type === 'week') return '结束周';
	return '结束日期';
};

const getStartPlaceholder = () => {
	const current = props.searchTypes.find(
		(item) => item.value === selectTime.value
	);
	return current?.dateStartText || getDefaultStartText();
};

const getEndPlaceholder = () => {
	const current = props.searchTypes.find(
		(item) => item.value === selectTime.value
	);
	return current?.dateEndText || getDefaultEndText();
};
// 时间存储
const timeRange = ref<[string | null, string | null]>([null, null]);
// 当前查询的是什么时间
const selectTime = ref<any>(props.searchTypes[0]?.value);

// 存储初始默认值，用于重置
const initialValues = ref<{ dateStart: string; dateEnd: string } | null>(null);

const localQueryForm = computed({
	get: () => {
		return props.queryForm;
	},
	set: (val) => {
		// 更新 localQueryForm 的值
		emits('update:queryForm', val);
	},
});

watch(
	() => props.queryForm,
	(newVal) => {
		// 获取当前选中的时间类型配置（包含字段名和是否需要加时分秒）
		const currentType = props.searchTypes.find(
			(item) => item.value === selectTime.value
		);
		if (
			!newVal[currentType?.dateStart || ''] &&
			!newVal[currentType?.dateEnd || '']
		) {
			// 如果没有值，则重置 timeRange
			timeRange.value = [null, null];
		}
	},
	{
		deep: true,
	}
);
// 辅助：根据 isAddHMS 处理边界
const edgeStart = (d: dayjs.Dayjs, withHMS: boolean) =>
	withHMS ? d.startOf('day') : d;
const edgeEnd = (d: dayjs.Dayjs, withHMS: boolean) =>
	withHMS ? d.endOf('day') : d;

/**
 * 根据 dateType 获取显示格式
 */
const getDisplayFormat = () => {
	const type = props.dateType;
	if (type === 'month' || type === 'months') return 'YYYY-MM';
	if (type === 'year') return 'YYYY';
	return 'YYYY-MM-DD';
};

/**
 * 根据配置计算默认时间范围
 * @param st SearchType 配置
 * @param applyToQueryForm 是否应用到 queryForm（setup 阶段初始化时为 true）
 */
function applyDefaultTimeByType(
	st?: SearchType,
	applyToQueryForm: boolean = true
) {
	if (!st) return null;

	let start: dayjs.Dayjs | null = null;
	let end: dayjs.Dayjs | null = null;

	// 优先年，其次回溯月
	if (st.defaultCurrentMonth) {
		start = dayjs().startOf('month');
		end = dayjs().endOf('month');
	} else if (typeof st.defaultYear !== 'undefined' && st.defaultYear !== null) {
		const y = st.defaultYear === 'current' ? dayjs().year() : st.defaultYear;
		start = dayjs().year(y).startOf('year');
		end = dayjs().year(y).endOf('year');
	} else if (typeof st.defaultMonthsAgo === 'number') {
		end = dayjs();
		start = dayjs().subtract(st.defaultMonthsAgo, 'month');
	} else if (typeof st.defaultDaysAgo === 'number') {
		end = dayjs();
		start = dayjs().subtract(st.defaultDaysAgo, 'day');
	}

	if (!start || !end) return null;

	// 根据 isAddHMS 决定是否补 00:00:00 / 23:59:59
	const s = edgeStart(start, st.isAddHMS);
	const e = edgeEnd(end, st.isAddHMS);

	// 给查询参数用：按需带不带时分秒，月份类型时不带日
	const isMonthType =
		props.dateType === 'month' ||
		props.dateType === 'months' ||
		st.defaultCurrentMonth;
	const fmt = st.isAddHMS
		? 'YYYY-MM-DD HH:mm:ss'
		: isMonthType
		? 'YYYY-MM'
		: 'YYYY-MM-DD';
	const displayFormat = getDisplayFormat();

	const result = {
		dateStart: s.format(fmt),
		dateEnd: e.format(fmt),
		displayStart: s.format(displayFormat),
		displayEnd: e.format(displayFormat),
	};

	if (applyToQueryForm) {
		// 1) 给日期组件用：根据 dateType 格式化
		timeRange.value = [result.displayStart, result.displayEnd];
		// 2) 给查询参数用
		localQueryForm.value[st.dateStart] = result.dateStart;
		localQueryForm.value[st.dateEnd] = result.dateEnd;
	}

	return result;
}

/**
 * 重置到初始默认值
 */
function resetToDefault() {
	const currentType = props.searchTypes.find(
		(i) => i.value === selectTime.value
	);

	if (currentType && initialValues.value) {
		const displayFormat = getDisplayFormat();
		// 恢复到初始值
		timeRange.value = [
			dayjs(initialValues.value.dateStart).format(displayFormat),
			dayjs(initialValues.value.dateEnd).format(displayFormat),
		];
		localQueryForm.value[currentType.dateStart] = initialValues.value.dateStart;
		localQueryForm.value[currentType.dateEnd] = initialValues.value.dateEnd;
	} else {
		// 如果没有初始值，清空
		if (currentType) {
			timeRange.value = [null, null];
			localQueryForm.value[currentType.dateStart] = null;
			localQueryForm.value[currentType.dateEnd] = null;
		}
	}
}

// 暴露重置方法给父组件
defineExpose({
	resetToDefault,
});

// ===== setup 阶段立即初始化（在 useTable 查询前） =====
const currentType = props.searchTypes.find((i) => i.value === selectTime.value);
if (currentType?.autoInit) {
	const result = applyDefaultTimeByType(currentType, true);
	if (result) {
		// 保存初始值用于重置
		initialValues.value = {
			dateStart: result.dateStart,
			dateEnd: result.dateEnd,
		};
	}
}

onMounted(() => {
	const currentType = props.searchTypes.find(
		(i) => i.value === selectTime.value
	);

	// 如果没有 autoInit，则在 onMounted 时处理
	if (!currentType?.autoInit) {
		// 检查 queryForm 中是否已有值（外部初始化）
		if (
			currentType &&
			localQueryForm.value[currentType.dateStart] &&
			localQueryForm.value[currentType.dateEnd]
		) {
			// 如果外部已经初始化了值，同步到 timeRange 显示
			const startVal = localQueryForm.value[currentType.dateStart];
			const endVal = localQueryForm.value[currentType.dateEnd];
			const displayFormat = getDisplayFormat();

			// 提取日期部分（根据 dateType 格式化）
			timeRange.value = [
				startVal ? dayjs(startVal).format(displayFormat) : null,
				endVal ? dayjs(endVal).format(displayFormat) : null,
			];
		} else {
			// 否则使用默认时间配置
			const result = applyDefaultTimeByType(currentType, true);
			if (result) {
				initialValues.value = {
					dateStart: result.dateStart,
					dateEnd: result.dateEnd,
				};
			}
		}
	}
	// 如果有 autoInit，setup 阶段已经初始化，这里不需要再处理
});
/*
 * 切换创建时间或更新时间
 * 当切换创建时间或更新时间时，重置时间范围
 */
const changeCreatedIsUpdate = () => {
	// 当切换创建时间或更新时间时，重置时间范围
	timeRange.value = [null, null];
	// 清空所有的时间查询字段
	Object.values(props.searchTypes).forEach((item) => {
		if (!item.dateStart || !item.dateEnd) return;
		localQueryForm.value[item.dateStart] = null;
		localQueryForm.value[item.dateEnd] = null;
	});
};
// 工具函数：格式化日期为 "yyyy-MM-dd HH:mm:ss"
const formatDateTime = (date: Date): string => {
	const pad = (n: number) => n.toString().padStart(2, '0');
	return (
		`${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
			date.getDate()
		)} ` +
		`${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(
			date.getSeconds()
		)}`
	);
};

/**
 * 失焦时处理时间查询字段
 * - 根据当前选中的时间类型，确定对应的起始字段名
 * - 如果配置了 isAddHMS，则将时间范围格式化为完整的 yyyy-MM-dd HH:mm:ss 格式（含 00:00:00 ~ 23:59:59）
 * - 否则直接使用原始时间值
 * - 设置到 localQueryForm 中对应字段后，触发 props.getDataList() 拉取数据
 */
const changeTimeRange = () => {
	// 获取当前选中的时间类型配置（包含字段名和是否需要加时分秒）
	const currentType = props.searchTypes.find(
		(item) => item.value === selectTime.value
	);
	if (!currentType) return;

	const { dateStart, dateEnd, isAddHMS } = currentType;

	// 获取用户选择的时间范围（数组：[开始时间, 结束时间]）
	const [start, end] = timeRange.value || [];

	// 🚨 新增：校验开始时间不能晚于结束时间（当两者都存在时）
	if (start && end) {
		// 注意：timeRange 是字符串数组（如 ['2025-12-01', '2025-11-30']）
		// 直接比较字符串即可（因为格式是 YYYY-MM-DD，字典序 = 时间序）
		if (start > end) {
			ElMessage.warning('开始日期不能晚于结束日期');
			// 可选：清空或重置 timeRange
			timeRange.value = ['', ''];
			localQueryForm.value[dateStart] = null;
			localQueryForm.value[dateEnd] = null;
			return; // 阻止后续赋值和请求
		}
	}

	if (isAddHMS) {
		// 如果需要添加时分秒，则将起始时间分别设为 00:00:00 和 23:59:59
		const startDate = start
			? new Date(new Date(start).setHours(0, 0, 0, 0))
			: null;

		// dateType 为 month 时，结束时间取当月最后一天 23:59:59
		let endDate: Date | null = null;
		if (end) {
			if (props.dateType === 'month') {
				endDate = dayjs(end).endOf('month').toDate();
			} else {
				endDate = new Date(new Date(end).setHours(23, 59, 59, 999));
			}
		}

		// 设置格式化后的时间字符串（yyyy-MM-dd HH:mm:ss）
		localQueryForm.value[dateStart] = startDate
			? formatDateTime(startDate)
			: null;
		localQueryForm.value[dateEnd] = endDate ? formatDateTime(endDate) : null;
	} else {
		// 否则直接保存原始日期值
		localQueryForm.value[dateStart] = start || null;
		localQueryForm.value[dateEnd] = end || null;
	}

	// 拉取数据
	props.getDataList();
	props?.searchFn();
};
</script>

<style lang="scss" scoped></style>
