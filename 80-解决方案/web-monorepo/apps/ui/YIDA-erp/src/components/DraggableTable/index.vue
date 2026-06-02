<template>
	<div class="draggable-table-wrapper">
		<el-table
			v-bind="$attrs"
			:data="dataList"
			@sort-change="handleSortChange"
			style="width: 100%"
			v-loading="loading"
			border
			ref="tableRef"
			:row-key="rowKey"
			:cell-style="cellStyle"
			:header-cell-style="headerCellStyle"
			@selection-change="handleSelectionChange"
			:max-height="tableMaxHeight"
		>
			<!-- 可选：选择列（在拖拽图标前） -->
			<el-table-column
				v-if="showSelection"
				align="center"
				type="selection"
				width="40"
				reserve-selection
				fixed="left"
			/>
			<!-- 拖拽图标列 -->
			<el-table-column
				v-if="showDragHandle"
				align="center"
				width="100"
				fixed="left"
			>
				<template #header>
					<span>优先级</span>
				</template>
				<template #default>
					<div class="drag-handle" :title="props.dragHandleTitle">
						<el-icon>
							<Rank />
						</el-icon>
					</div>
				</template>
			</el-table-column>
			<el-table-column
				label="生效顺序"
				align="center"
				min-width="110"
				fixed="left"
			>
				<template #default="{ $index }">
					{{ $index + 1 }}
				</template>
			</el-table-column>

			<!-- 其他列通过插槽传递 -->
			<slot></slot>
		</el-table>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick, computed } from 'vue';
import { Rank } from '@element-plus/icons-vue';
import Sortable from 'sortablejs';
import { useMessage } from '/@/hooks/message';

interface Props {
	// 表格数据
	dataList: any;
	// 是否显示拖拽图标
	showDragHandle?: boolean;
	// 是否显示选择列
	showSelection?: boolean;
	// 行键
	rowKey?: string;
	// 加载状态
	loading?: boolean;
	// 单元格样式
	cellStyle?: any;
	// 表头单元格样式
	headerCellStyle?: any;
	// 是否禁用拖拽
	disabled?: boolean;
	// 拖拽图标标题
	dragHandleTitle?: string;
	// 拖拽动画时长
	animation?: number;
	// 表格最大高度
	maxHeight?: number;
}

const props = withDefaults(defineProps<Props>(), {
	showDragHandle: true,
	showSelection: true,
	rowKey: 'id',
	loading: false,
	cellStyle: () => ({}),
	headerCellStyle: () => ({}),
	disabled: false,
	dragHandleTitle: '拖拽排序',
	animation: 150,
	maxHeight: 600,
});

const emit = defineEmits<{
	sortChange: [sortData: any];
	selectionChange: [selection: any[]];
	dragEnd: [
		newDataList: any[],
		originalDataList: any[],
		oldIndex: number,
		newIndex: number
	];
	dragStart: [event: any];
}>();

// 表格引用
const tableRef = ref();
// Sortable 实例
let sortableInstance: Sortable | null = null;
const isDragging = ref(false);

// 计算表格最大高度
const tableMaxHeight = computed(() => {
	return typeof props.maxHeight === 'number'
		? props.maxHeight
		: parseInt(props.maxHeight || '500');
});

// 屏蔽 SortableJS 偶发的空引用错误（不影响功能与其它错误）
const sortableErrorHandler = (e: ErrorEvent) => {
	const msg = String(e?.message || '');
	const file = String((e as any)?.filename || '');
	if (file.includes('sortable') && msg.includes("reading 'options'")) {
		e.preventDefault?.();
		return false;
	}
};
if (typeof window !== 'undefined') {
	window.addEventListener('error', sortableErrorHandler, true);
}

// 处理排序变化
const handleSortChange = (sortData: any) => {
	emit('sortChange', sortData);
};

// 处理选择变化
const handleSelectionChange = (selection: any[]) => {
	emit('selectionChange', selection);
};

// 初始化拖拽功能
const initSortable = () => {
	if (!props.showDragHandle || props.disabled) return;

	// 先销毁已有的实例
	destroySortable();

	// 使用 nextTick 确保DOM已渲染
	nextTick(() => {
		setTimeout(() => {
			const tbody = tableRef.value?.$el?.querySelector('tbody');
			if (!tbody) {
				return;
			}

			// 检查拖拽图标是否存在
			const dragHandles = tbody.querySelectorAll('.drag-handle');
			if (dragHandles.length === 0) {
				return;
			}
			// 防御性：若 tbody 内已存在由之前创建的 Sortable 占位元素，先清理
			const prevSortableEl = (tbody as any)._sortable;
			if (prevSortableEl && typeof prevSortableEl.destroy === 'function') {
				try {
					prevSortableEl.destroy();
				} catch (error: any) {
					useMessage().error(error?.msg || '错误');
				}
			}

			sortableInstance = Sortable.create(tbody, {
				handle: '.drag-handle',
				animation: props.animation,
				ghostClass: 'sortable-ghost',
				chosenClass: 'sortable-chosen',
				dragClass: 'sortable-drag',
				forceFallback: false,
				draggable: 'tr',
				// 忽略空行/隐藏行，避免索引错乱
				filter: '.el-table__row--empty, .is-hidden',
				preventOnFilter: false,
				onStart: (evt) => {
					isDragging.value = true;
					emit('dragStart', evt);
				},
				onEnd: (evt) => {
					const { oldIndex, newIndex } = evt as any;
					if (
						oldIndex !== newIndex &&
						oldIndex !== undefined &&
						newIndex !== undefined
					) {
						const newDataList = [...(props.dataList || [])];
						const draggedItem = newDataList.splice(oldIndex, 1)[0];
						newDataList.splice(newIndex, 0, draggedItem);
						emit('dragEnd', newDataList, props.dataList, oldIndex, newIndex);
					}
					// 释放拖拽状态
					nextTick(() => {
						isDragging.value = false;
					});
				},
			});
		}, 100);
	});
};

// 销毁拖拽功能
const destroySortable = () => {
	if (sortableInstance) {
		sortableInstance.destroy();
		sortableInstance = null;
	}
};

// 监听数据变化，重新初始化拖拽
watch(
	() => props.dataList,
	(newData, oldData) => {
		// 只有当数据长度发生变化时才重新初始化
		if (newData?.length !== oldData?.length) {
			if (!isDragging.value) {
				destroySortable();
				initSortable();
			}
		}
	},
	{ flush: 'post' }
);

// 监听禁用状态变化
watch(
	() => props.disabled,
	(disabled) => {
		if (disabled) {
			destroySortable();
		} else {
			initSortable();
		}
	}
);

onMounted(() => {
	// 延迟初始化，确保表格完全渲染
	setTimeout(() => {
		initSortable();
	}, 300);
});

onUnmounted(() => {
	destroySortable();
	if (typeof window !== 'undefined') {
		window.removeEventListener('error', sortableErrorHandler, true);
	}
});

// 暴露表格方法
defineExpose({
	tableRef,
	clearSelection: () => tableRef.value?.clearSelection(),
	getSelectionRows: () => tableRef.value?.getSelectionRows(),
	toggleRowExpansion: (row: any, expanded?: boolean) =>
		tableRef.value?.toggleRowExpansion(row, expanded),
	// 拖拽相关方法
	initSortable,
	destroySortable,
	// 拖拽状态
	isDragging: () => sortableInstance?.toArray() !== undefined,
});
</script>

<style lang="scss" scoped>
.draggable-table-wrapper {
	// 表格容器样式
	:deep(.el-table) {
		// 滚动条样式优化
		.el-table__body-wrapper {
			// 确保滚动条可见
			overflow-y: auto !important;

			&::-webkit-scrollbar {
				width: 8px;
				height: 8px;
			}

			&::-webkit-scrollbar-track {
				background: #f1f1f1;
				border-radius: 4px;
			}

			&::-webkit-scrollbar-thumb {
				background: #c1c1c1;
				border-radius: 4px;

				&:hover {
					background: #a8a8a8;
				}
			}
		}
	}

	.drag-handle {
		cursor: move;
		color: #999;
		font-size: 16px;
		display: flex;
		align-items: center;
		justify-content: center;
		height: 100%;
		transition: color 0.2s;
		user-select: none;

		&:hover {
			color: #409eff;
		}
	}

	.drag-handle-icon {
		color: #999;
		font-size: 16px;
	}
}

// 拖拽样式 - 全局样式，不需要 scoped
:deep(.sortable-ghost) {
	opacity: 0.5;
	background: #f5f7fa;
}

:deep(.sortable-chosen) {
	background: #ecf5ff;
}

:deep(.sortable-drag) {
	background: #fff;
	box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
</style>
