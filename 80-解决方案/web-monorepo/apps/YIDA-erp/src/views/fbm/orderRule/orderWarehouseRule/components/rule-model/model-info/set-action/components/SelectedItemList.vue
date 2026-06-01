<!--
 * 通用右侧选中项列表组件
 * 功能：显示已选中的项目列表，支持拖拽排序和删除操作
 * 特点：
 * - 显示已选项列表，可配置是否可排序
 * - 支持删除单个项目
 * - 支持自定义空状态提示
 * - 支持自定义字段映射
 -->
<template>
	<!-- 组件根容器 -->
	<div class="selected-panel">
		<!-- 标题区域 -->
		<div class="selected-header">
			<!-- 标题 -->
			<span class="selected-title">{{ title }}</span>
			<!-- 数量统计 -->
			<span class="selected-count">({{ items.length }})</span>
			<!-- 额外插槽，用于在标题右侧添加自定义内容 -->
			<slot name="extra" />
		</div>

		<!-- 列表容器 -->
		<div class="selected-list" :class="{ 'is-sortable': sortable }">
			<!-- 循环渲染已选项 -->
			<div
				v-for="(item, index) in items"
				:key="getItemValue(item)"
				class="selected-item"
				:draggable="sortable"
				@dragstart="onDragStart($event, index)"
				@dragover="onDragOver"
				@drop="onDrop($event, index)"
			>
				<!-- 拖拽手柄 -->
				<div class="drag-handle" v-if="sortable">
					<el-icon><Rank /></el-icon>
				</div>
				<!-- 项目标签 -->
				<span class="item-label">{{ getItemLabel(item) }}</span>
				<!-- 删除按钮 -->
				<el-button
					link
					size="small"
					@click="removeItem(index)"
					class="remove-btn"
					:disabled="!removable"
				>
					<el-icon><Close /></el-icon>
				</el-button>
			</div>

			<!-- 空状态提示 -->
			<div v-if="items.length === 0" class="empty-state">
				{{ emptyText }}
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
// 导入Vue组合式API
import { computed, ref } from 'vue';
// 导入Element Plus图标
import { Rank, Close } from '@element-plus/icons-vue';

// 属性配置接口
interface PropsConfig {
	value: string; // 值字段名，默认为'id'
	label: string; // 显示文本字段名，默认为'name'
}

// 组件属性接口
interface Props {
	modelValue: Array<Record<string, any>>; // 选中的项目列表，使用v-model绑定
	title?: string; // 列表标题，默认'已选项'
	emptyText?: string; // 空状态提示文本，默认'暂无选中项'
	sortable?: boolean; // 是否可拖拽排序，默认false
	removable?: boolean; // 是否显示删除按钮，默认true
	propsConfig?: PropsConfig; // 字段配置，用于自定义字段名
}

// 设置组件属性的默认值
const props = withDefaults(defineProps<Props>(), {
	modelValue: () => [], // 默认空数组
	title: '已选项', // 默认标题
	emptyText: '暂无选中项', // 默认空状态提示
	sortable: false, // 默认不可排序
	removable: true, // 默认可删除
	propsConfig: () => ({
		value: 'id', // 默认值字段名
		label: 'name', // 默认显示文本字段名
	}),
});

// 定义组件发出的事件
const emit = defineEmits<{
	// v-model更新事件，用于双向绑定
	'update:modelValue': [value: Array<Record<string, any>>];
	// 删除项目事件，返回被删除的项和索引
	remove: [item: Record<string, any>, index: number];
	// 重新排序事件，返回排序后的数组
	reorder: [value: Array<Record<string, any>>];
}>();

// 计算属性：处理v-model双向绑定
const items = computed({
	// 获取选中的项目列表
	get: () => props.modelValue || [],
	// 设置选中的项目列表，并触发更新事件
	set: (value) => {
		const newValue = value || [];
		emit('update:modelValue', newValue);
	},
});

/**
 * 获取项目的值
 * @param item 项目对象
 * @returns 项目的值
 */
const getItemValue = (item: Record<string, any>): string => {
	if (!item) return '';
	return String(item[props.propsConfig.value] || '');
};

/**
 * 获取项目的显示文本
 * @param item 项目对象
 * @returns 项目的显示文本
 */
const getItemLabel = (item: Record<string, any>): string => {
	if (!item) return '';
	return String(item[props.propsConfig.label] || '');
};

// 拖拽相关状态
const draggedIndex = ref(-1); // 当前被拖拽的项索引

/**
 * 处理拖拽开始事件
 * @param event 拖拽事件对象
 * @param index 被拖拽项的索引
 */
const onDragStart = (event: DragEvent, index: number) => {
	// 如果不可排序，直接返回
	if (!props.sortable) return;

	// 记录当前拖拽的索引
	draggedIndex.value = index;

	// 设置拖拽数据
	if (event.dataTransfer) {
		// 存储拖拽项的索引
		event.dataTransfer.setData('text/plain', String(index));
		// 设置拖拽效果为移动
		event.dataTransfer.effectAllowed = 'move';
	}
};

/**
 * 处理拖拽悬停事件
 * @param event 拖拽事件对象
 */
const onDragOver = (event: DragEvent) => {
	// 如果不可排序，直接返回
	if (!props.sortable) return;

	// 阻止默认行为以允许放置
	event.preventDefault();

	// 设置拖拽效果为移动
	if (event.dataTransfer) {
		event.dataTransfer.dropEffect = 'move';
	}
};

/**
 * 处理放置事件
 * @param event 拖拽事件对象
 * @param dropIndex 放置位置的索引
 */
const onDrop = (event: DragEvent, dropIndex: number) => {
	// 如果不可排序，直接返回
	if (!props.sortable) return;

	// 阻止默认行为
	event.preventDefault();

	// 获取拖拽项的原始索引
	const fromIndex = draggedIndex.value;

	// 验证索引有效性
	if (fromIndex === -1 || fromIndex === dropIndex) {
		return; // 如果位置没有变化，直接返回
	}

	// 创建新数组（避免直接修改props）
	const newList = [...items.value];

	// 移动项目
	const [moved] = newList.splice(fromIndex, 1); // 从原位置移除
	newList.splice(dropIndex, 0, moved); // 插入到新位置

	// 更新数据
	items.value = newList;

	// 触发重新排序事件
	emit('reorder', [...newList]);

	// 重置拖拽索引
	draggedIndex.value = -1;
};

/**
 * 删除指定索引的项目
 * @param index 要删除的项索引
 */
const removeItem = (index: number) => {
	// 如果不可删除，直接返回
	if (!props.removable) return;

	// 检查索引是否有效
	if (index < 0 || index >= items.value.length) return;

	// 获取要删除的项
	const removed = items.value[index];
	if (!removed) return;

	// 创建新数组（不包含要删除的项）
	const newList = items.value.filter((_, i) => i !== index);

	// 更新数据
	items.value = newList;

	// 触发删除事件，传递被删除的项和索引
	emit('remove', { ...removed }, index);
};

// 暴露给父组件的方法和属性
defineExpose({
	/**
	 * 删除指定索引的项
	 */
	removeItem,

	/**
	 * 当前选中的项目列表（响应式）
	 */
	items,

	/**
	 * 获取项目的显示文本
	 */
	getItemLabel,

	/**
	 * 获取项目的值
	 */
	getItemValue,

	/**
	 * 更新项目列表
	 * @param newItems 新的项目数组
	 */
	updateItems: (newItems: Array<Record<string, any>>) => {
		items.value = [...(newItems || [])];
	},
});
</script>

<style scoped lang="scss">
.selected-panel {
	display: flex;
	flex-direction: column;
	height: 100%;
}

.selected-header {
	display: flex;
	align-items: center;
	margin-bottom: 16px;

	.selected-title {
		font-weight: 500;
		color: #303133;
	}

	.selected-count {
		margin-left: 8px;
		color: #909399;
		font-size: 14px;
	}
}

.selected-list {
	flex: 1;
	overflow-y: auto;

	&.is-sortable {
		.selected-item {
			cursor: move;
		}
	}
}

.selected-item {
	display: flex;
	align-items: center;
	margin-bottom: 8px;
	&:hover {
		background-color: #ecf5ff;
	}

	.drag-handle {
		margin-right: 8px;
		color: #909399;
		cursor: move;
	}

	.item-label {
		flex: 1;
	}

	.remove-btn {
		margin-left: 8px;
		color: #f56c6c;

		&:hover {
			color: #f78989;
		}
	}
}

.empty-state {
	text-align: center;
	color: #909399;
	padding: 40px 0;
}
</style>
