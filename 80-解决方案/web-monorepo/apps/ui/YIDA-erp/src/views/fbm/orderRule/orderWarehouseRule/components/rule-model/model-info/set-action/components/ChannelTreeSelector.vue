<!--
 * 物流渠道树形选择组件
 * 功能：提供树形结构的物流渠道选择，支持搜索、单选/多选、显示已选项
 * 特点：
 * - 左侧树形展示所有渠道，支持搜索过滤
 * - 右侧显示已选项
 * - 支持仅选择叶子节点
 * - 支持父子节点联动
 -->
<template>
	<div class="channel-tree-selector">
		<el-row :gutter="20">
			<!-- 左侧树形面板 -->
			<el-col :span="14">
				<div class="left-panel">
					<!-- 搜索框 -->
					<div class="search-box" v-if="showSearch">
						<el-input
							v-model="searchKeyword"
							:placeholder="searchPlaceholder"
							clearable
							@input="handleSearch"
						>
							<template #prefix>
								<el-icon><Search /></el-icon>
							</template>
						</el-input>
					</div>

					<!-- 树形控件容器 -->
					<div class="tree-container">
						<el-tree
							ref="treeRef"
							:data="filteredTreeData"
							:props="treeProps"
							:node-key="nodeKey"
							show-checkbox
							@check="handleCheck"
						/>
					</div>
				</div>
			</el-col>

			<!-- 右侧已选面板 -->
			<el-col :span="10">
				<div class="right-panel">
					<selected-item-list
						v-model="selectedItemsProxy"
						:title="selectedTitle"
						:empty-text="emptyText"
						:sortable="false"
						:props-config="{
							value: propsConfig.value,
							label: propsConfig.label,
						}"
						@remove="handleRemove"
					/>
				</div>
			</el-col>
		</el-row>
	</div>
</template>

<script setup lang="ts">
import { computed, ref, watch, nextTick } from 'vue';
import { ElTree } from 'element-plus';
import { Search } from '@element-plus/icons-vue';
import SelectedItemList from './SelectedItemList.vue';

// 定义属性配置接口
interface PropsConfig {
	value: string; // 值字段名，默认为'id'
	label: string; // 显示文本字段名，默认为'name'
	children?: string; // 子节点字段名，默认为'children'
	parentId?: string; // 父节点ID字段名，默认为'parentId'
	warehouseCode?: string;
	code?: string;
	type?: string;
}

// 组件属性定义
interface Props {
	modelValue?: Array<Record<string, any>>; // 选中的值，用于v-model双向绑定
	data?: Array<Record<string, any>>; // 树形数据源
	propsConfig?: PropsConfig; // 字段配置对象
	showSearch?: boolean; // 是否显示搜索框，默认true
	searchPlaceholder?: string; // 搜索框占位文本
	nodeKey?: string; // 节点唯一标识字段，默认为'id'
	onlyLeafSelectable?: boolean; // 是否只能选择叶子节点，默认true
	selectedTitle?: string; // 右侧已选面板标题
	emptyText?: string; // 空数据时的提示文本
}

// 设置组件属性的默认值
const props = withDefaults(defineProps<Props>(), {
	modelValue: () => [], // 默认空数组
	data: () => [], // 默认空数组
	propsConfig: () => ({
		// 默认字段配置
		value: 'id', // 值字段名
		label: 'name', // 显示文本字段名
		children: 'children', // 子节点字段名
		parentId: 'parentId', // 父节点ID字段名
		warehouseCode: 'warehouseCode',
		code: 'code',
		type: 'type',
	}),
	showSearch: true, // 默认显示搜索框
	searchPlaceholder: '输入物流渠道名称', // 搜索框默认占位符
	nodeKey: 'id', // 默认节点唯一标识字段
	onlyLeafSelectable: true, // 默认只能选择叶子节点
	selectedTitle: '已选物流渠道', // 右侧面板默认标题
	emptyText: '请从左侧选择物流渠道', // 默认空数据提示
});

// 定义组件发出的事件
const emit = defineEmits<{
	// v-model更新事件，用于双向绑定
	'update:modelValue': [value: Array<Record<string, any>>];
	// 选中项变化事件
	change: [value: Array<Record<string, any>>];
	// 重新排序事件
	reorder: [value: Array<Record<string, any>>];
}>();

// 模板引用 - 引用el-tree组件实例
const treeRef = ref<InstanceType<typeof ElTree>>();
// 搜索关键词
const searchKeyword = ref('');

// 计算属性：获取配置的字段名，提供默认值
const childrenKey = computed(() => props.propsConfig.children || 'children'); // 子节点字段名
const labelKey = computed(() => props.propsConfig.label || 'name'); // 显示文本字段名
const valueKey = computed(() => props.propsConfig.value || 'id'); // 值字段名
const parentIdKey = computed(() => props.propsConfig.parentId || 'parentId'); // 父ID字段名
const warehouseCodeKey = computed(
	() => props.propsConfig.warehouseCode || 'warehouseCode'
);
const codeKey = computed(() => props.propsConfig.code || 'code');
const typeKey = computed(() => props.propsConfig.type || 'type');

// 树形控件属性配置
const treeProps = computed(() => ({
	label: labelKey.value, // 设置显示文本字段
	children: childrenKey.value, // 设置子节点字段
	isLeaf: (data: any) => {
		// 判断是否为叶子节点
		const children = data[childrenKey.value];
		return !children || children.length === 0;
	},
}));

// 处理树形数据，确保不为null或undefined
const treeData = computed(() => props.data || []);

// 根据搜索关键词过滤树形数据
const filteredTreeData = computed(() => {
	// 如果没有搜索关键词，返回完整数据
	if (!searchKeyword.value) return treeData.value;
	// 否则过滤数据
	const data = filterTree(treeData.value, searchKeyword.value.toLowerCase());
	return data;
});

/**
 * 递归过滤树形数据
 * @param nodes 要过滤的节点数组
 * @param keyword 搜索关键词（已转为小写）
 * @returns 过滤后的节点数组
 */
const filterTree = (nodes: any[], keyword: string) => {
	return nodes
		.map((node) => {
			// 创建节点副本
			const clone = { ...node };
			const children = node[childrenKey.value];

			// 递归处理子节点
			if (children && Array.isArray(children)) {
				clone[childrenKey.value] = filterTree(children, keyword);
			}

			// 检查当前节点是否匹配关键词
			const nodeLabel = String(node[labelKey.value] || '').toLowerCase();
			const matches = nodeLabel.includes(keyword);

			// 检查子节点是否有匹配项
			const hasMatchingChildren =
				clone[childrenKey.value] &&
				Array.isArray(clone[childrenKey.value]) &&
				clone[childrenKey.value].length > 0;

			// 如果当前节点或子节点匹配，则保留该节点
			return matches || hasMatchingChildren ? clone : null;
		})
		.filter(Boolean); // 过滤掉null值
};

// 选中的项目（双向绑定）
const selectedItemsProxy = computed({
	// 获取选中的项目
	get: () => props.modelValue || [],
	// 设置选中的项目，并触发更新事件
	set: (value) => {
		const newValue = value || [];
		emit('update:modelValue', newValue);
		emit('change', newValue);
	},
});

// 构建父子节点映射关系，用于快速查找父节点
const dependencyMap = computed(() => buildParentMap(treeData.value));

/**
 * 递归构建父子节点映射关系
 * @param nodes 当前层级的节点数组
 * @param parentId 父节点ID
 * @param map 存储映射关系的Map
 * @returns 完整的父子节点映射表
 */
const buildParentMap = (
	nodes: any[],
	parentId?: string,
	map: Map<string, string> = new Map()
) => {
	// 遍历当前层级的所有节点
	nodes.forEach((node) => {
		const currentId = node[valueKey.value];

		// 如果有父节点ID，则建立映射关系
		if (parentId) {
			map.set(String(currentId), String(parentId));
		}

		// 递归处理子节点
		const children = node[childrenKey.value];
		if (children && Array.isArray(children)) {
			// 将当前节点ID作为子节点的父节点ID传递
			buildParentMap(children, currentId, map);
		}
	});

	return map;
};

/**
 * 处理树节点选中/取消选中事件
 * @param _ 事件对象
 * @param param1 包含选中节点信息的对象
 */
const handleCheck = (_: any, { checkedNodes }: { checkedNodes: any[] }) => {
	// 1. 过滤出所有叶子节点（没有子节点的节点）
	const flattenLeaves = checkedNodes.filter((node: any) => {
		const children = node[childrenKey.value];
		return !(children && children.length > 0);
	});

	// 2. 格式化选中项数据
	const formatted = flattenLeaves.map((node: any) => {
		const nodeId = String(node[valueKey.value]);
		return {
			[valueKey.value]: node[valueKey.value], // 节点ID
			[labelKey.value]: node[labelKey.value], // 节点显示文本
			[parentIdKey.value]:
				dependencyMap.value.get(nodeId) || node[parentIdKey.value], // 父节点ID
			[warehouseCodeKey.value]: node[warehouseCodeKey.value],
			[codeKey.value]: node[codeKey.value],
			[typeKey.value]: node[typeKey.value],
		};
	});

	// 3. 更新选中的项目
	selectedItemsProxy.value = formatted;
};

/**
 * 处理搜索输入变化
 * 实际的搜索逻辑由filteredTreeData计算属性处理
 */
const handleSearch = () => {
	// 这里可以添加防抖等优化逻辑
};

/**
 * 处理移除已选项
 * @param item 要移除的项
 */
const handleRemove = (item: Record<string, any>) => {
	if (!item) return;

	const itemId = item[valueKey.value];

	// 1. 从已选项中过滤掉要移除的项
	const newSelectedItems = selectedItemsProxy.value.filter(
		(selected) => selected[valueKey.value] !== itemId
	);

	// 2. 更新选中的项目
	selectedItemsProxy.value = newSelectedItems;

	// 3. 在下一个DOM更新周期后，更新树形控件的选中状态
	nextTick(() => {
		if (treeRef.value) {
			// 取消选中对应的树节点
			treeRef.value.setChecked(itemId, false, true);
		}
	});
};

/**
 * 重新加载数据
 * 暴露给父组件调用，用于刷新树形数据
 */
const loadData = async () => {
	// 等待DOM更新
	await nextTick();

	// 这里可以添加重新加载数据的逻辑

	// 例如：
	// 1. 重新请求数据
	// 2. 重置搜索条件
	// 3. 恢复选中状态等
};

// 暴露给父组件的方法
defineExpose({
	/**
	 * 重新加载数据
	 */
	loadData,

	/**
	 * 设置选中的节点
	 * @param keys 要选中的节点key数组
	 */
	setCheckedKeys: (keys: string[]) => {
		if (treeRef.value) {
			treeRef.value.setCheckedKeys(keys);
		}
	},

	/**
	 * 获取树形组件实例
	 */
	getTreeRef: () => treeRef.value,
});

// 监听已选项变化，保持树形控件的选中状态同步
watch(
	selectedItemsProxy,
	(newVal) => {
		// 在下一个DOM更新周期后执行
		nextTick(() => {
			if (!treeRef.value) return;

			// 提取所有选中项的ID
			const ids = newVal.map((item) => item[valueKey.value]);

			// 更新树形控件的选中状态
			treeRef.value.setCheckedKeys(ids);
		});
	},
	{
		deep: true, // 深度监听，确保能检测到数组内部变化
		immediate: true, // 立即执行一次，初始化选中状态
	}
);
</script>

<style scoped lang="scss">
.channel-tree-selector {
	width: 80%;

	.left-panel {
		border: 1px solid #dcdfe6;
		border-radius: 4px;
		padding: 16px;
		height: 380px;
		display: flex;
		flex-direction: column;
	}

	.search-box {
		margin-bottom: 16px;
	}

	.tree-container {
		flex: 1;
		overflow-y: auto;
	}

	.right-panel {
		height: 100%;
		padding-left: 16px;
		border-left: 1px solid #f0f0f0;
	}
}
</style>
