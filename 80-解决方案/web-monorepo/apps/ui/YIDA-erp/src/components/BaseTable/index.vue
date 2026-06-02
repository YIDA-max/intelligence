<!--
 * @Author: YIDA 3136271519@qq.com
 * @Date: 2026-01-15 17:43:19
 * @LastEditors: YIDA zhuhansong@merach.com
 * @LastEditTime: 2026-04-20 15:43:10
 * @FilePath: \qianyi-ui\src\components\BaseTable\index.vue
 * @Description: 
 * 
 * Copyright (c) 2026 by ${git_name_email}, All Rights Reserved. 
-->
<!-- eslint-disable vue/no-v-for-template-key -->
<template>
	<div class="basic-table" ref="basicTableRef">
		<!-- 顶部工具栏插槽 -->
		<div v-if="$slots.toolbar" class="toolbar" ref="toolbarRef">
			<slot name="toolbar"></slot>
		</div>
		<el-row ref="toolBarRowRef">
			<ToolBar
				@handleRefresh="props?.register?.state?.toolBarConfig?.handleRefresh"
				@handleExport="props?.register?.state?.toolBarConfig?.handleExport"
				v-bind="props.register.state.toolBarConfig"
				:register="props.register"
				@setColumns="
					(columns:any[]) => {
            props.register.setColumns(columns);
					}
				"
				:columns="props.register.unmodifiedColumns"
				:isShowExport="props?.register?.state?.toolBarConfig?.isShowExport"
			>
				<!-- 工具栏左侧插槽 -->
				<template #left-tool>
					<slot name="left-tool"></slot>
				</template>
				<!-- 工具栏右侧插槽 -->
				<template #right-tool>
					<slot name="right-tool"></slot>
				</template>
			</ToolBar>
		</el-row>

		<div v-if="$slots.bottombar" class="bottombar" ref="bottombarRef">
			<slot name="bottombar"></slot>
		</div>
		<MrTableVxe
			:data="props.register.state.dataList"
			@sort-change="register.sortChangeHandle"
			style="width: 100%"
			v-loading="register.state.loading"
			border
			:row-config="{
				keyField: props.register.state.keyField || 'id',
				isHover: true,
			}"
			:footer-method="finalSummaryMethod"
			:show-footer="showFooter"
			:customConfig="{
				isAllRowDrag: true,
				isAllColumnDrag: true,
				isDblclickAutoWidth: true,
				resizable: true,
			}"
			:tooltip-config="{
				enterable: true,
			}"
			:virtual-y-config="{
				enabled: true,
				gt: 30,
			}"
			:checkbox-config="{ highlight: true, range: true, trigger: 'row' }"
			v-bind="mergedAttrs"
			ref="tableRef"
			native-scrollbar
		>
			<MrTableColumnVxe
				v-for="(column, index) in columns"
				:key="`${index}`"
				:label="t(`${column.title}`)"
				showOverflow="title"
				resizable
				v-bind="column"
			>
				<!-- 1. 兼容 default (内容) 插槽 -->
				<!-- 暂不兼容type类型 -->
				<template #default="scope" v-if="!column.type">
					<!-- 优先级 1: 外部自定义的 [field] 插槽 -->
					<slot
						v-if="$slots[column.field]"
						:name="column.field"
						v-bind="scope"
						:text="scope.row[column.field]"
						:record="scope.row"
						:index="scope.$index"
						:editState="column.editable"
					/>
					<!-- 优先级 2: 外部原生的 #default 插槽 -->
					<slot v-else-if="$slots.default" name="default" v-bind="scope" />
					<!--  -->
					<template v-else-if="column.slotName == 'RowValueLink'">
						<RowValueLink
							:row="scope.row"
							:valueKey="column.field"
							v-bind="column.slotAttrs"
						></RowValueLink
					></template>
					<!-- 优先级 3: 默认兜底显示 -->
					<template v-else>
						<span :title="formatData(column, scope.row) ?? undefined">
							{{ formatData(column, scope.row) }}
						</span>
					</template>
				</template>

				<!-- 2. 兼容 header (表头) 插槽 -->
				<!-- 暂不兼容type类型 -->
				<template #header="scope" v-if="!column.type">
					<!-- 优先级 1: 外部自定义的 [field-header] 插槽 -->
					<slot
						v-if="$slots[`${column.field}-header`]"
						:name="`${column.field}-header`"
						v-bind="scope"
					/>
					<!-- 优先级 2: 外部原生的 #header 插槽 -->
					<slot v-else-if="$slots.header" name="header" v-bind="scope" />
					<!-- 优先级 如果都没有，则显示 title -->
					<template v-else-if="column.title">
						<template v-if="column.tips">
							<mr-tips :label="column.title" :tips="column.tips" />
						</template>
						<template v-else>
							{{ column.title }}
						</template>
					</template>
					<!-- 优先级 4: 默认显示原有的东西 -->
				</template>
				<!-- 3. 兼容 filter-icon 插槽 (2.7.8+) -->
				<template #filter-icon="scope">
					<!-- 优先级 1: [field-filter-icon] -->
					<slot
						v-if="$slots[`${column.field}-filter-icon`]"
						:name="`${column.field}-filter-icon`"
						v-bind="scope"
					/>
					<!-- 优先级 2: 原生 #filter-icon -->
					<slot v-else name="filter-icon" v-bind="scope" />
				</template>

				<!-- 4. 兼容 expand 插槽 (2.10.0+) -->
				<!-- 注意：expand 通常只在 type="expand" 的列生效 -->
				<template #content="scope">
					<!-- 优先级 1: [field-expand] -->
					<slot
						v-if="$slots[`${column.field}-expand`]"
						:name="`${column.field}-expand`"
						v-bind="scope"
					/>
					<!-- 优先级 2: 原生 #expand -->
					<slot v-else name="expand" v-bind="scope" />
				</template>
			</MrTableColumnVxe>
		</MrTableVxe>
		<pagination
			@current-change="props.register.currentChangeHandle"
			@size-change="props.register.sizeChangeHandle"
			v-bind="props.register.state.pagination"
			v-if="props.register.state.isShowpagination"
			ref="paginationRef"
		/>
	</div>
</template>

<script setup lang="ts">
import {
	computed,
	ref,
	onMounted,
	onUnmounted,
	nextTick,
	watch,
	useAttrs,
} from 'vue';
import { useI18n } from 'vue-i18n';
import { useFormatter } from '/@/hooks/useFormatter';
import { useTableSummary } from '/@/hooks/useTableSummary';

const MrTips = defineAsyncComponent(() => import('/@/common/MrTips/index.vue'));

const tableRef = ref();
const basicTableRef = ref();
const toolbarRef = ref();
const toolBarRowRef = ref();
const bottombarRef = ref();
const paginationRef = ref();

const props = defineProps({
	register: {
		type: Object,
		default: () => ({}),
	},
	/**
	 * 表格属性
	 * 透传这个对象下所有属性到表格组件
	 */
	tableAttrs: {
		type: Object,
		default: () => ({}),
	},
});
// 计算属性：表格列配置  可以做任何操作
const columns = computed(() => {
	return props.register?.state?.columns || [];
});
// 国际化
const { t } = useI18n();
// 格式化数据
const { formatData } = useFormatter();

// 获取合计方法（传入空数组，因为 sumList 会在 summaryMethod 中动态传入）
const { getSummariesVxe } = useTableSummary([]);

/**
 * 判断是否为函数
 */
const isFunction = (value: unknown): value is Function =>
	typeof value === 'function';
/**
 * 本次 BaseTable 合计能力改造说明：
 * 1. 支持外部传入自定义 summaryMethod（页面可覆盖默认 sumList 合计）。
 * 2. 支持多入口识别 summaryMethod，兼容历史页面不同写法。
 * 3. 当检测到外部 summaryMethod 时，showFooter 自动开启，避免“方法传了但不显示合计行”。
 * 4. 统一由 finalSummaryMethod 做分发与兜底，外部异常不影响页面可用性。
 * 5. checkbox-change / checkbox-all 等事件通过 attrs + v-bind 默认透传。
 * 获取外部传入的合计方法
 * 兼容来源：
 * 1. tableAttrs.footerMethod / tableAttrs['footer-method']
 * 2. 组件 attrs.footerMethod / attrs['footer-method']
 * 3. register.summaryMethod
 * 4. register.state.summaryMethod（页面通常挂在 state 上）
 */
const getExternalSummaryMethod = () => {
	const tableAttrs = (props.tableAttrs || {}) as Record<string, any>;
	const attrsObj = attrs as Record<string, any>;
	const registerObj = (props.register || {}) as Record<string, any>;
	const registerStateObj = (props.register?.state || {}) as Record<string, any>;

	// 多来源兼容：谁先命中就使用谁，优先级从左到右
	return (
		tableAttrs.footerMethod ||
		tableAttrs['footer-method'] ||
		attrsObj.footerMethod ||
		attrsObj['footer-method'] ||
		registerObj.summaryMethod ||
		registerStateObj.summaryMethod
	);
};

// 计算属性：控制是否显示底部合计行
const showFooter = computed(() => {
	// 兼容：如果外部传入了自定义 summaryMethod，也允许显示合计行
	if (isFunction(getExternalSummaryMethod())) {
		return true;
	}
	return props.register?.sumList?.length > 0 ? true : false;
});

/**
 * 最终合计方法优先级：
 * tableAttrs/footer-method > attrs/footer-method > register.summaryMethod > 内置默认
 */
const finalSummaryMethod = (param: { columns: any[]; data: any[] }) => {
	const externalMethod = getExternalSummaryMethod();
	if (!isFunction(externalMethod)) {
		// 未传外部方法时，走内置默认合计逻辑
		return summaryMethod(param);
	}

	try {
		const result = externalMethod(param);
		// 外部方法返回空值时，兜底内置合计逻辑，避免表尾丢失
		return result ?? summaryMethod(param);
	} catch (error) {
		// 外部方法异常时不中断渲染，回退到内置合计
		return summaryMethod(param);
	}
};
// 合计方法：从表格数据中计算合计值
const summaryMethod = (param: { columns: any[]; data: any[] }) => {
	if (!param || !param.columns || !param.data) return [['合计']];

	const { columns, data } = param;

	// 获取需要合计的字段列表（sumList 在 register 对象上）
	const sumList = props.register?.sumList || [];

	// 使用 useTableSummary 的 getSummariesVxe 方法计算合计
	const sums = getSummariesVxe({
		columns,
		data,
		sumList,
	});

	return [sums];
};

// 获取所有未被 props 声明的 attribute（包括事件、class、style 等）
const attrs = useAttrs();

// 计算自适应高度
const tableHeight = ref<number | string | undefined>(undefined);

// 计算表格可用高度
const calculateTableHeight = () => {
	// 如果外部传入了 height，则使用外部传入的
	const externalHeight = attrs.height;
	if (
		externalHeight !== undefined &&
		externalHeight !== null &&
		typeof externalHeight !== 'object'
	) {
		tableHeight.value = externalHeight as number | string;
		return;
	}

	nextTick(() => {
		try {
			// 获取窗口高度
			const windowHeight = window.innerHeight;

			// 获取 BaseTable 组件距离页面顶部的距离
			const basicTableRect = basicTableRef.value?.getBoundingClientRect();
			if (!basicTableRect) return;

			// 计算其他元素的高度
			let otherHeight = 0;

			// 工具栏插槽高度
			if (toolbarRef.value) {
				otherHeight += toolbarRef.value.offsetHeight || 0;
			}

			// 工具栏行高度
			if (toolBarRowRef.value?.$el) {
				otherHeight += toolBarRowRef.value.$el.offsetHeight || 0;
			}

			// 底部插槽高度
			if (bottombarRef.value) {
				const bottomH = bottombarRef.value.offsetHeight || 0;
				// 额外+20补偿内部组件（如Tabs）自带的上下margin导致的高度塌陷
				otherHeight += bottomH > 0 ? bottomH + 20 : 0;
			}

			// 分页组件高度
			if (paginationRef.value?.$el) {
				otherHeight += paginationRef.value.$el.offsetHeight || 0;
			}
			const titleHeight = props.register?.state?.isDialog ? 70 : 0; //弹窗内的表格时去掉标题高度
			// 计算可用高度 = 窗口高度 - BaseTable 距离顶部距离 - 其他元素高度 - 底部边距
			const padding = 30; // 底部和顶部边距
			const availableHeight =
				windowHeight - basicTableRect.top - otherHeight - padding - titleHeight;

			// 设置最小高度，避免表格太小
			if (availableHeight > 200) {
				tableHeight.value = availableHeight;
			} else {
				tableHeight.value = 200; // 最小高度
			}
		} catch (error) {
			// 计算表格高度失败时，使用默认值
			tableHeight.value = undefined;
		}
	});
};

// 监听窗口大小变化
let resizeObserver: ResizeObserver | null = null;
const handleResize = () => {
	calculateTableHeight();
};

// 合并 attrs，如果外部没有传入 height，则使用计算出的高度
const mergedAttrs = computed(() => {
	const propsAttrs = props?.tableAttrs ? { ...props.tableAttrs } : {};
	const merged = { ...attrs, ...propsAttrs };
	// footer-method 由 finalSummaryMethod 统一分发，避免多入口直接覆盖
	delete (merged as Record<string, any>).footerMethod;
	delete (merged as Record<string, any>)['footer-method'];
	// 如果外部没有传入 height，且计算出了高度，则使用计算出的高度
	const externalHeight = attrs.height;
	if (
		(externalHeight === undefined ||
			externalHeight === null ||
			typeof externalHeight === 'object') &&
		tableHeight.value !== undefined
	) {
		merged.height = tableHeight.value;
	}
	return merged;
});

// 监听数据变化，重新计算高度（因为分页组件高度可能会变化）
watch(
	() => props.register?.state?.pagination,
	() => {
		calculateTableHeight();
	},
	{ deep: true }
);

// 监听数据加载完成，重新计算高度
watch(
	() => props.register?.state?.loading,
	(newVal, oldVal) => {
		// 从加载中变为加载完成时，重新计算高度
		if (oldVal === true && newVal === false) {
			nextTick(() => {
				calculateTableHeight();
			});
		}
	}
);

onMounted(() => {
	calculateTableHeight();

	// 监听窗口大小变化
	window.addEventListener('resize', handleResize);

	// 使用 ResizeObserver 监听容器大小变化
	if (basicTableRef.value) {
		resizeObserver = new ResizeObserver(() => {
			calculateTableHeight();
		});
		resizeObserver.observe(basicTableRef.value);
	}
});

onUnmounted(() => {
	window.removeEventListener('resize', handleResize);
	if (resizeObserver) {
		resizeObserver.disconnect();
		resizeObserver = null;
	}
});

defineExpose({
	tableRef,
});
</script>
<style scoped lang="scss">
.basic-table {
	--vxe-ui-table-row-checkbox-checked-background-color: rgba(59 130 246 / 0.1);
}
</style>
