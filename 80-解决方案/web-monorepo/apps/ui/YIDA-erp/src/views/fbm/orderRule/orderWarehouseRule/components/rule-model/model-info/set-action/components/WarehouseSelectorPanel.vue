<!--
 * 仓库选择面板组件
 * 功能：提供仓库选择功能，支持多选、搜索、Tab分类和拖拽排序
 * 特点：
 * - 左侧显示可选的仓库列表，支持搜索和Tab分类
 * - 右侧显示已选仓库，支持拖拽排序和删除
 * - 支持通过Tab切换不同类别的仓库
 * - 支持搜索过滤仓库列表
 * - 支持多选和批量操作
 -->
<template>
	<!-- 组件根容器 -->
	<div class="warehouse-selector-panel">
		<el-row :gutter="20">
			<!-- 左侧面板：仓库列表 -->
			<el-col :span="14">
				<div class="left-panel">
					<!-- Tab标签页，用于分类显示不同类型的仓库 -->
					<el-tabs
						v-show="tabsList.length > 0 && showTab"
						v-model="activeTab"
						class="selector-tabs"
					>
						<el-tab-pane
							v-for="tab in tabsList"
							:key="tab.key"
							:label="tab.label"
							:name="tab.key"
						/>
					</el-tabs>

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

					<!-- 复选框组，显示可选的仓库列表 -->
					<div class="checkbox-container">
						<el-checkbox-group
							v-model="leftChecked"
							@change="handleCheckboxChange"
						>
							<div
								v-for="item in filteredItems"
								:key="getItemValue(item)"
								class="checkbox-item"
							>
								<el-checkbox
									:label="getItemValue(item)"
									:value="getItemValue(item)"
								>
									{{ getItemLabel(item) }}
								</el-checkbox>
							</div>
						</el-checkbox-group>
					</div>
				</div>
			</el-col>

			<!-- 右侧面板：已选仓库列表 -->
			<el-col :span="10">
				<div class="right-panel">
					<!-- 已选列表组件 -->
					<selected-item-list
						v-model="selectedItemsProxy"
						:title="selectedTitle"
						:empty-text="emptyText"
						:sortable="sortable"
						:props-config="{
							value: propsConfig.value,
							label: propsConfig.label,
						}"
						@remove="handleRemove"
						@reorder="handleReorder"
					/>
				</div>
			</el-col>
		</el-row>
	</div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { Search } from '@element-plus/icons-vue';
// 导入已选项列表组件
import SelectedItemList from './SelectedItemList.vue';

// Tab配置接口
interface TabConfig {
	key: string; // Tab的唯一标识
	label: string; // Tab的显示文本
}

// 属性配置接口
interface PropsConfig {
	value: string; // 值字段名，用于唯一标识每个仓库项
	label: string; // 显示文本字段名，用于展示仓库名称
	type?: string; // 类型字段名，用于区分不同Tab类型
	children?: string; // 子节点字段名，用于嵌套数据结构
}

// 组件属性接口
interface Props {
	modelValue?: Array<Record<string, any>>; // 选中的仓库列表，使用v-model双向绑定
	data?: Array<Record<string, any>>; // 仓库数据源，包含所有可选的仓库项
	tabs?: TabConfig[]; // 自定义Tab配置，如果不提供则从data中自动生成
	propsConfig?: PropsConfig; // 字段配置，用于自定义字段名
	defaultActiveTab?: string; // 默认激活的Tab的key
	showSearch?: boolean; // 是否显示搜索框，默认true
	searchPlaceholder?: string; // 搜索框占位文本
	sortable?: boolean; // 是否允许拖拽排序已选项，默认true
	selectedTitle?: string; // 右侧已选面板的标题
	emptyText?: string; // 没有选中项时的提示文本
	showTab: boolean; // 是否显示Tab标签页
}

// 设置组件属性的默认值
const props = withDefaults(defineProps<Props>(), {
	modelValue: () => [], // 默认选中的仓库列表为空数组
	data: () => [], // 默认数据源为空数组
	propsConfig: () => ({
		// 默认字段配置
		value: 'id', // 默认值字段名为'id'
		label: 'name', // 默认显示文本字段名为'name'
		type: 'type', // 默认类型字段名为'type'
		children: 'children', // 默认子节点字段名为'children'
	}),
	defaultActiveTab: '', // 默认没有激活的Tab
	showSearch: true, // 默认显示搜索框
	searchPlaceholder: '输入仓库名称', // 默认搜索框占位符
	sortable: true, // 默认允许拖拽排序
	selectedTitle: '已选仓库', // 默认右侧面板标题
	emptyText: '请从左侧选择仓库', // 默认空状态提示文本
	showTab: false, // 默认不显示Tab标签页
});

// 定义组件发出的事件
const emit = defineEmits<{
	// v-model更新事件，用于双向绑定选中的仓库列表
	'update:modelValue': [value: Array<Record<string, any>>];
	// 选中项变化事件，当选中项发生变化时触发
	change: [value: Array<Record<string, any>>];
	// 重新排序事件，当拖拽排序后触发
	reorder: [value: Array<Record<string, any>>];
}>();

// 当前激活的Tab
const activeTab = ref('');

// 计算属性：获取Tab列表
const tabsList = computed(() => {
	// 如果props中提供了tabs配置，则直接使用
	if (props.tabs && props.tabs.length > 0) return props.tabs;

	// 从propsConfig中获取类型字段名
	const typeKey = props.propsConfig.type;
	if (!typeKey) return [];

	// 使用Map去重，确保每个类型只出现一次
	const uniqueMap = new Map<string, string>();

	// 遍历数据源，提取所有不同的类型
	props.data.forEach((item) => {
		const key = item[typeKey];
		if (key && !uniqueMap.has(key)) {
			// 使用label字段作为显示文本，如果没有则使用key
			uniqueMap.set(key, item[props.propsConfig.label] || key);
		}
	});

	// 将Map转换为TabConfig数组
	return Array.from(uniqueMap.entries()).map(([key, label]) => ({
		key,
		label,
	}));
});

// 监听defaultActiveTab属性变化，更新当前激活的Tab
watch(
	() => props.defaultActiveTab,
	(newVal) => {
		// 当defaultActiveTab有值且与当前activeTab不同时更新
		if (newVal && newVal !== activeTab.value) {
			activeTab.value = newVal;
		}
	},
	{ immediate: true } // 立即执行一次
);

// 监听tabsList变化，确保当前激活的Tab有效
watch(tabsList, (newTabs) => {
	// 如果没有激活的Tab，则设置为第一个Tab
	if (!activeTab.value) {
		activeTab.value = newTabs[0]?.key || '';
	}
	// 如果当前激活的Tab不在新的tabsList中，则重置为第一个Tab
	else if (
		newTabs.length > 0 &&
		!newTabs.some((tab) => tab.key === activeTab.value)
	) {
		activeTab.value = newTabs[0].key;
	}
});

// 搜索关键词
const searchKeyword = ref('');

// 计算属性：获取类型字段名，默认为'type'
const typeKey = computed(() => props.propsConfig.type || 'type');

// 计算属性：获取子节点字段名，默认为'children'
const childrenKey = computed(() => props.propsConfig.children || 'children');

/**
 * 计算属性：获取当前Tab下过滤后的仓库列表
 */
const filteredItems = computed(() => {
	// 获取当前激活的Tab类型
	const currentType = activeTab.value;
	let items: Record<string, any>[] = [];

	// 如果配置了childrenKey，则从当前分组的子节点获取数据
	if (childrenKey.value) {
		// 查找当前类型对应的分组
		const currentGroup = props.data.find(
			(group) =>
				group[typeKey.value] === currentType || group.key === currentType
		);
		// 获取分组下的子节点，如果没有则返回空数组
		items = currentGroup?.[childrenKey.value] || [];
	}
	// 如果没有配置childrenKey，则直接从data中过滤出当前类型的项
	else {
		items = props.data.filter((item) => item[typeKey.value] === currentType);
	}

	// 如果没有搜索关键词，直接返回所有项
	if (!searchKeyword.value) return items;

	// 根据搜索关键词过滤项（不区分大小写）
	const keyword = searchKeyword.value.toLowerCase();
	return items.filter((item) =>
		String(getItemLabel(item)).toLowerCase().includes(keyword)
	);
});

/**
 * 计算属性：处理v-model双向绑定
 */
const selectedItemsProxy = computed({
	// 获取选中的仓库列表
	get: () => props.modelValue || [],
	// 设置选中的仓库列表，并触发更新事件
	set: (value) => {
		const newValue = value || [];
		// 更新v-model绑定的值
		emit('update:modelValue', newValue);
		// 触发change事件
		emit('change', newValue);
	},
});

// 左侧已选中的复选框值
const leftChecked = ref<string[]>([]);

/**
 * 获取项目的值
 * @param item 项目对象
 * @returns 项目的值
 */
const getItemValue = (item: Record<string, any>) =>
	item[props.propsConfig.value];

/**
 * 获取项目的显示文本
 * @param item 项目对象
 * @returns 项目的显示文本
 */
const getItemLabel = (item: Record<string, any>) =>
	item[props.propsConfig.label];

/**
 * 处理复选框变化事件
 * @param checkedIds 当前选中的复选框值数组
 */
const handleCheckboxChange = (checkedIds: string[]) => {
	// 获取当前激活的Tab类型
	const currentType = activeTab.value;
	// 获取当前显示的仓库项
	const currentItems = filteredItems.value;

	// 创建值到项目的映射，便于快速查找
	const itemMap = new Map(
		currentItems.map((item) => [getItemValue(item), item])
	);

	// 根据选中的ID获取对应的项目，并添加上类型信息
	const selectedForCurrent = checkedIds
		.map((id) => itemMap.get(id)) // 根据ID获取项目
		.filter(Boolean) // 过滤掉未找到的项
		.map((item) => ({
			...item,
			[typeKey.value]: currentType, // 添加类型信息
		}));

	// 获取其他类型中已选中的项目
	const otherSelected = selectedItemsProxy.value.filter(
		(item) => item[typeKey.value] !== currentType
	);

	// 合并其他类型的已选项和当前类型的新选项
	const newSelectedItems = [...otherSelected, ...selectedForCurrent];

	// 触发更新事件
	emit('update:modelValue', newSelectedItems);
	emit('change', newSelectedItems);
};

/**
 * 处理搜索框输入事件
 * 注意：实际的过滤逻辑由filteredItems计算属性处理
 */
const handleSearch = () => {
	// 搜索逻辑由filteredItems计算属性自动处理
	// 这里可以添加防抖或节流逻辑，如果搜索性能需要优化
};

/**
 * 同步左侧复选框的选中状态
 * 根据当前选中的仓库列表和当前激活的Tab，更新左侧复选框的选中状态
 */
const syncLeftChecked = () => {
	const currentType = activeTab.value;
	// 获取当前类型下已选中的项目值
	leftChecked.value = selectedItemsProxy.value
		.filter((item) => item[typeKey.value] === currentType) // 筛选当前类型的项目
		.map((item) => item[props.propsConfig.value]); // 提取项目的值
};

// 监听选中的仓库列表变化，同步左侧复选框状态
watch(selectedItemsProxy, syncLeftChecked, {
	immediate: true, // 立即执行一次
	deep: true, // 深度监听，确保能检测到数组内部变化
});

// 监听激活的Tab变化
watch(activeTab, () => {
	// 同步左侧复选框状态
	syncLeftChecked();
	// 清空搜索关键词
	searchKeyword.value = '';
});

/**
 * 处理删除已选项
 * @param item 要删除的项
 */
const handleRemove = (item: Record<string, any>) => {
	// 过滤掉要删除的项
	const newSelectedItems = selectedItemsProxy.value.filter(
		(selected) =>
			selected[props.propsConfig.value] !== item[props.propsConfig.value]
	);

	// 触发更新事件
	emit('update:modelValue', newSelectedItems);
	emit('change', newSelectedItems);

	// 同步左侧复选框状态
	syncLeftChecked();
};

/**
 * 获取当前选中的仓库列表
 * @returns 当前选中的仓库数组
 */
const getSelectedItems = () => {
	return selectedItemsProxy.value;
};

/**
 * 处理重新排序事件
 * @param reorderedItems 重新排序后的仓库数组
 */
const handleReorder = (reorderedItems: Array<Record<string, any>>) => {
	// 更新v-model绑定的值
	emit('update:modelValue', reorderedItems);
	// 触发change事件
	emit('change', reorderedItems);
	// 触发reorder事件
	emit('reorder', reorderedItems);
};

// 暴露方法给父组件
defineExpose({
	getSelectedItems, // 获取当前选中的仓库列表
	syncLeftChecked, // 同步左侧复选框状态
});
</script>

<style scoped lang="scss">
.warehouse-selector-panel {
	width: 80%;
	.left-panel {
		border: 1px solid #dcdfe6;
		border-radius: 4px;
		padding: 16px;
		height: 400px;
		display: flex;
		flex-direction: column;
	}

	.selector-tabs {
		margin-bottom: 16px;

		:deep(.el-tabs__header) {
			margin: 0;
		}

		:deep(.el-tabs__item) {
			padding: 0 16px;
			font-size: 14px;
		}
	}

	.search-box {
		margin-bottom: 16px;
	}

	.checkbox-container {
		flex: 1;
		overflow-y: auto;

		.checkbox-item {
			:deep(.el-checkbox) {
				width: 100%;
			}
		}
	}

	.right-panel {
		border: 1px solid #dcdfe6;
		border-radius: 4px;
		padding: 16px;
		height: 400px;
		display: flex;
		flex-direction: column;
	}
}
</style>
