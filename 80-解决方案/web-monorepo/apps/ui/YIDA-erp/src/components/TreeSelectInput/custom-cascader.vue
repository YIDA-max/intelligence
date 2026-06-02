<template>
	<div
		:id="cascaderId"
		class="custom-cascader"
		:style="{ width: props.settings.width || '280px' }"
	>
		<!-- 选中值展示区域 -->
		<div
			class="tags-display"
			:class="{ 'is-error': props.showError }"
			v-if="confirmedTags.length > 0"
			@click="showPanel"
		>
			<el-tooltip
				v-for="(tag, index) in visibleTags"
				:key="index"
				:content="tag.label"
				placement="top"
				:show-after="300"
				:disabled="!tag.label || tag.label.length < 15"
			>
				<el-tag
					closable
					size="small"
					class="selected-tag"
					@close.stop="removeTag(tag.id)"
				>
					{{ tag.label }}
				</el-tag>
			</el-tooltip>
			<el-tag
				v-if="confirmedTags.length > maxTagsToShow"
				size="small"
				class="more-tag"
				@click.stop="showPanel"
			>
				+{{ confirmedTags.length - maxTagsToShow }}
			</el-tag>
		</div>

		<!-- 空状态输入框 -->
		<div v-else class="empty-input" @click="showPanel">
			<el-input
				readonly
				:placeholder="$t(props.settings.text || '请选择')"
				class="trigger-input"
				suffix-icon="ArrowDown"
				:class="{ 'is-error': props.showError }"
			/>
		</div>

		<!-- 级联选择器面板 - 使用el-cascader-panel直接显示 -->
		<div class="cascader-dropdown" v-show="panelVisible" @click.stop>
			<div class="search-box">
				<el-input
					v-model="searchKeyword"
					:placeholder="`搜索${$t(props.settings.text || '')}`"
					prefix-icon="Search"
					clearable
					@input="handleSearchInput"
					@clear="clearSearch"
				/>
			</div>

			<div class="panel-container">
				<!-- 搜索模式下显示扁平化结果列表 -->
				<div v-if="searchKeyword" class="search-results-list">
					<div class="search-header" v-if="searchResults.length > 0">
						<el-checkbox
							v-model="checkAll"
							:indeterminate="isIndeterminate"
							@change="handleCheckAllChange"
						>
							全选
						</el-checkbox>
					</div>
					<div
						v-for="(node, index) in searchResults"
						:key="index"
						class="search-result-item"
						@click="toggleNodeSelection(node.value)"
					>
						<el-checkbox
							v-model="node.checked"
							@change="(val) => handleCheckboxChange(node.value, val)"
							@click.stop
						></el-checkbox>
						<el-tooltip
							:content="node.pathLabel"
							placement="top-start"
							:show-after="300"
							:disabled="!node.pathLabel || node.pathLabel.length < 20"
						>
							<span class="node-label">{{ node.pathLabel }}</span>
						</el-tooltip>
					</div>
					<div v-if="searchResults.length === 0" class="empty-text">
						无匹配数据
					</div>
				</div>
				<!-- 非搜索模式下显示正常级联面板 -->
				<div v-else>
					<!-- 全选功能（可配置） -->
					<div
						class="select-all-header"
						v-if="props.settings.showSelectAll && cascaderData.length > 0"
					>
						<el-checkbox
							v-model="checkAll"
							:indeterminate="isIndeterminate"
							@change="handleCheckAllChange"
						>
							全选
						</el-checkbox>
					</div>
					<el-cascader-panel
						v-model="draftSelectedValues"
						:options="cascaderData"
						:props="cascaderProps"
						ref="cascaderPanelRef"
					>
						<template #default="{ node }">
							<el-tooltip
								:content="node.label"
								placement="top-start"
								:show-after="300"
								:disabled="!node.label || node.label.length < 10"
							>
								<span>{{ node.label }}</span>
							</el-tooltip>
						</template>
					</el-cascader-panel>
				</div>
			</div>

			<!-- 底部按钮 -->
			<div class="footer-btns">
				<el-button size="small" @click="handleCancel">{{
					$t('取消')
				}}</el-button>
				<el-button size="small" type="primary" @click="handleConfirm">{{
					$t('确定')
				}}</el-button>
			</div>
		</div>
	</div>
</template>

<script setup>
/**
 * 多选级联选择器组件
 * 功能：
 * 1. 支持后端搜索（带防抖）
 * 2. 支持多选和全选
 * 3. 支持标签展示和限制
 * 4. 支持确认和取消操作
 *
 * @props
 * - settings: 配置对象
 *   - getTreeData: 获取树形数据的方法
 *   - onSearch: 搜索回调方法，用于后端搜索
 *   - code: 双向绑定的字段名
 *   - text: 占位文本
 *   - props: 字段映射配置
 *   - maxTagsToShow: 最大显示标签数
 * - queryForm: 表单对象，用于双向绑定
 *
 * @emits
 * - update:queryForm: 更新表单值
 * - change: 选中值变化
 */

import { useMessage } from '/@/hooks/message';
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue';
defineOptions({
	name: 'CustomCascader',
});
const cascaderId = 'custom-cascader-' + Math.random().toString(36).slice(2, 10);
// 防抖函数
const debounce = (fn, delay) => {
	let timer = null;
	return (...args) => {
		if (timer) clearTimeout(timer);
		timer = setTimeout(() => {
			fn.apply(null, args);
		}, delay);
	};
};
// 响应式数据
const cascaderPanelRef = ref(null);
const draftSelectedValues = ref([]); // 临时选中值，确认后才会更新到外部
const confirmedTags = ref([]); // 已确认的标签
const searchKeyword = ref(''); // 搜索关键字
const panelVisible = ref(false);
const cascaderData = ref([]);
const checkAll = ref(false);
const isIndeterminate = ref(false);
const nodesMap = ref({}); // 节点映射，用于快速查找和构建路径

// props & emits
const props = defineProps({
	settings: {
		type: Object,
		default: () => ({
			width: '280px',
			text: '请选择',
			code: 'categoryCodes',
			props: {
				value: 'id',
				label: 'name',
				children: 'children',
			},
			maxTagsToShow: 1,
			showSelectAll: false, // 是否显示全选功能
			onSearch: null, // 搜索回调函数（可选）
		}),
	},
	queryForm: {
		type: Object,
		default: () => ({}),
	},
	showError: {
		type: Boolean,
		default: false,
	},
	// 级联选择器的数据源（由父组件传入）
	data: {
		type: Array,
		default: () => [],
	},
});

const emit = defineEmits(['update:queryForm', 'change', 'input']);

// 计算属性
const cascaderProps = computed(() => {
	return {
		multiple: true,
		checkStrictly: props.settings.checkStrictly ?? false,
		emitPath: props.settings.emitPath ?? false,
		value: props.settings.props?.value || 'id',
		label: props.settings.props?.label || 'name',
		children: props.settings.props?.children || 'children',
		lazy: props.settings.lazy || false,
		lazyLoad: props.settings.lazyLoad,
	};
});

const valueKey = computed(() => props.settings.props?.value || 'id');
const labelKey = computed(() => props.settings.props?.label || 'name');
const childrenKey = computed(
	() => props.settings.props?.children || 'children'
);
const maxTagsToShow = computed(() => props.settings.maxTagsToShow || 1);

const searchResults = computed(() => {
	if (!searchKeyword.value) return [];
	const results = getFilteredNodes(cascaderData.value);
	// 为每个结果添加选中状态，但不影响实际选中值
	return results.map((node) => ({
		...node,
		checked: draftSelectedValues.value.includes(node.value),
	}));
});

const visibleTags = computed(() => {
	if (confirmedTags.value.length === 0) return [];
	// 只返回第一个标签
	return [confirmedTags.value[0]];
});

// 本地 queryForm 代理
const localQueryForm = computed({
	get: () => props.queryForm,
	set: (val) => {
		emit('update:queryForm', val);
	},
});

// 方法定义
const buildNodeMap = (nodes) => {
	nodesMap.value = {};
	function traverse(nodes, path = []) {
		if (!nodes || !nodes.length) return;
		for (const node of nodes) {
			const valueField = valueKey.value;
			const labelField = labelKey.value;
			const childrenField = childrenKey.value;
			const currentPath = [...path, node[labelField]];
			const id = node[valueField];

			// 只有叶子节点（没有子节点）才添加到 nodesMap
			const hasChildren = node[childrenField] && node[childrenField].length > 0;
			if (!hasChildren) {
				nodesMap.value[id] = {
					id,
					label: currentPath.join(' / '),
					path: currentPath,
				};
			}

			// 如果有子节点，继续遍历
			if (hasChildren) {
				traverse(node[childrenField], currentPath);
			}
		}
	}
	traverse(nodes);
};

// 点击确认后更新已确认标签
const updateConfirmedTags = () => {
	const tags = [];
	const confirmedValues =
		localQueryForm.value[props.settings.code || 'categoryCodes'] || [];
	const addedParentIds = new Set(); // 记录已添加的父节点ID

	for (const value of confirmedValues) {
		const nodeInfo = nodesMap.value[value];
		if (nodeInfo) {
			// 如果该节点有子节点，且所有子节点都被选中，则只显示父节点
			if (nodeInfo.childIds && nodeInfo.childIds.length > 0) {
				const allChildrenSelected = nodeInfo.childIds.every((childId) =>
					confirmedValues.includes(childId)
				);
				if (allChildrenSelected && !addedParentIds.has(value)) {
					// 所有子节点都被选中，只显示父节点
					tags.push(nodeInfo);
					addedParentIds.add(value);
					// 标记所有子节点为已处理，避免重复显示
					nodeInfo.childIds.forEach((childId) => addedParentIds.add(childId));
				} else if (!addedParentIds.has(value)) {
					// 部分子节点被选中，显示父节点
					tags.push(nodeInfo);
					addedParentIds.add(value);
				}
			} else if (!addedParentIds.has(value)) {
				// 叶子节点，直接添加
				tags.push(nodeInfo);
				addedParentIds.add(value);
			}
		} else if (!addedParentIds.has(value)) {
			// 节点信息不存在，显示 ID
			tags.push({
				id: value,
				label: `ID: ${value}`,
				path: [`ID: ${value}`],
			});
			addedParentIds.add(value);
		}
	}
	confirmedTags.value = tags;
};

// 收集所有节点ID
// const collectAllNodeIds = (nodes) => {
// 	const ids = [];
// 	const valueField = valueKey.value;
// 	const childrenField = childrenKey.value;
// 	function traverse(nodes) {
// 		if (!nodes) return;
// 		for (const node of nodes) {
// 			ids.push(node[valueField]);
// 			if (node[childrenField] && node[childrenField].length) {
// 				traverse(node[childrenField]);
// 			}
// 		}
// 	}
// 	traverse(nodes);
// 	return ids;
// };

// 收集所有叶子节点ID（只收集最底层的子节点）
const collectLeafNodeIds = (nodes) => {
	const leafIds = [];
	const valueField = valueKey.value;
	const childrenField = childrenKey.value;
	function traverse(nodes) {
		if (!nodes) return;
		for (const node of nodes) {
			// 如果没有子节点或子节点为空，则为叶子节点
			if (!node[childrenField] || node[childrenField].length === 0) {
				leafIds.push(node[valueField]);
			} else {
				// 否则继续遍历子节点
				traverse(node[childrenField]);
			}
		}
	}
	traverse(nodes);
	return leafIds;
};

// 更新选中状态
const updateSelectionState = () => {
	if (!cascaderData.value || cascaderData.value.length === 0) return;

	// 在搜索模式下，根据搜索结果来更新全选状态
	if (searchKeyword.value && searchResults.value.length > 0) {
		const checkedCount = searchResults.value.filter(
			(node) => node.checked
		).length;
		checkAll.value = checkedCount === searchResults.value.length;
		isIndeterminate.value =
			checkedCount > 0 && checkedCount < searchResults.value.length;
		return;
	}

	// 非搜索模式下：只比较叶子节点
	const allLeafIds = collectLeafNodeIds(cascaderData.value);
	const selectedIds = draftSelectedValues.value;
	if (selectedIds.length === 0) {
		checkAll.value = false;
		isIndeterminate.value = false;
	} else if (selectedIds.length === allLeafIds.length) {
		checkAll.value = true;
		isIndeterminate.value = false;
	} else {
		checkAll.value = false;
		isIndeterminate.value = true;
	}
};

// 获取过滤后的节点（扁平化）搜索时扁平化显示
const getFilteredNodes = (nodes, ancestors = [], ancestorLabels = []) => {
	const keyword = searchKeyword.value.toLowerCase();
	const valueField = valueKey.value;
	const labelField = labelKey.value;
	const childrenField = childrenKey.value;
	let result = [];
	if (!nodes) return result;
	// 收集某个节点下所有叶子节点，并返回带完整路径信息的对象
	const collectLeafsWithPath = (node, labels) => {
		const leafs = [];
		if (!node[childrenField] || node[childrenField].length === 0) {
			leafs.push({
				...node,
				value: node[valueField],
				pathLabel: labels.join(' / '),
				childIds: [], // 叶子节点没有子节点
			});
			return leafs;
		}
		for (const child of node[childrenField]) {
			const childLabels = [...labels, child[labelField]];
			leafs.push(...collectLeafsWithPath(child, childLabels));
		}
		return leafs;
	};
	for (const node of nodes) {
		const currentLabels = [...ancestorLabels, node[labelField]];
		const nodeLabel = String(node[labelField]).toLowerCase();
		const matched = nodeLabel.includes(keyword);

		// 如果当前节点匹配关键字
		if (matched) {
			// 如果有子节点：不要把父节点单独显示，取其所有叶子节点并加入结果
			if (node[childrenField] && node[childrenField].length) {
				const leafs = collectLeafsWithPath(node, currentLabels);
				result = result.concat(leafs);
			} else {
				// 叶子节点匹配则直接加入
				result.push({
					...node,
					value: node[valueField],
					pathLabel: currentLabels.join(' / '),
					childIds: [], // 叶子节点没有子节点
				});
			}
		}

		// 继续递归子节点，确保子节点自身的匹配也会被包含
		if (node[childrenField] && node[childrenField].length) {
			const childResults = getFilteredNodes(
				node[childrenField],
				[...ancestors, node],
				currentLabels
			);
			result = result.concat(childResults);
		}
	}
	// 根据 value 去重（保留首个出现项）
	const map = new Map();
	for (const item of result) {
		map.set(item.value, item);
	}
	return Array.from(map.values());
};

// 全选/取消全选 - 搜索模式下处理搜索结果
const handleCheckAllChange = (value) => {
	checkAll.value = value;
	isIndeterminate.value = false;

	// 在搜索模式下，处理搜索结果
	if (searchKeyword.value) {
		// 更新搜索结果的显示状态
		searchResults.value.forEach((node) => {
			node.checked = value;
		});

		if (value) {
			// 选中全选：只收集叶子节点（父子分离）
			const valuesToAdd = searchResults.value.reduce((acc, node) => {
				// 如果节点有子节点，只添加子节点ID，不添加父节点
				if (node.childIds && node.childIds.length) {
					acc.push(...node.childIds);
				} else {
					// 如果是叶子节点，添加节点自身的值
					acc.push(node.value);
				}
				return acc;
			}, []);
			// 使用Set去重，然后更新选中值
			draftSelectedValues.value = [
				...new Set([...draftSelectedValues.value, ...valuesToAdd]),
			];
		} else {
			// 取消全选：移除所有搜索结果的值和它们的子节点ID
			const valuesToRemove = searchResults.value.reduce((acc, node) => {
				// 添加节点自身的值
				acc.push(node.value);
				// 添加子节点ID（如果有）
				if (node.childIds && node.childIds.length) {
					acc.push(...node.childIds);
				}
				return acc;
			}, []);
			// 过滤掉要移除的值
			draftSelectedValues.value = draftSelectedValues.value.filter(
				(value) => !valuesToRemove.includes(value)
			);
		}
		return;
	}

	// 非搜索模式下：只选中叶子节点（父子分离）
	const leafIds = collectLeafNodeIds(cascaderData.value);
	draftSelectedValues.value = value ? leafIds : [];
};

// 切换节点选择状态
const toggleNodeSelection = (value) => {
	const searchResult = searchResults.value.find((r) => r.value === value);
	const index = draftSelectedValues.value.indexOf(value);

	if (index > -1) {
		// 取消选中时，同时取消所有子节点
		if (searchResult && searchResult.childIds) {
			draftSelectedValues.value = draftSelectedValues.value.filter(
				(v) => v !== value && !searchResult.childIds.includes(v)
			);
		} else {
			draftSelectedValues.value.splice(index, 1);
		}
	} else {
		// 选中时，同时选中所有子节点
		if (searchResult && searchResult.childIds) {
			const newValues = [value, ...searchResult.childIds];
			draftSelectedValues.value = [
				...new Set([...draftSelectedValues.value, ...newValues]),
			];
		} else {
			draftSelectedValues.value.push(value);
		}
	}
	updateSelectionState();
};

// 处理复选框变化
const handleCheckboxChange = (value, checked) => {
	const searchResult = searchResults.value.find((r) => r.value === value);
	if (!searchResult) return;

	// 更新搜索结果中的选中状态
	searchResult.checked = checked;

	// 更新实际选中值
	if (checked) {
		// 选中时添加节点值和所有子节点ID
		const valuesToAdd = [value];
		if (searchResult.childIds && searchResult.childIds.length) {
			valuesToAdd.push(...searchResult.childIds);
		}
		draftSelectedValues.value = [
			...new Set([...draftSelectedValues.value, ...valuesToAdd]),
		];
	} else {
		// 取消选中时移除节点值和所有子节点ID
		const valuesToRemove = [value];
		if (searchResult.childIds && searchResult.childIds.length) {
			valuesToRemove.push(...searchResult.childIds);
		}
		draftSelectedValues.value = draftSelectedValues.value.filter(
			(v) => !valuesToRemove.includes(v)
		);
	}

	updateSelectionState();
};

// 移除标签
const removeTag = (value) => {
	// 找到要删除的值的索引
	const index = draftSelectedValues.value.indexOf(value);
	if (index > -1) {
		// 删除当前值
		draftSelectedValues.value.splice(index, 1);
		// 更新确认的标签
		updateConfirmedTags();
	}
	saveToQueryForm();
};

// 保存
const saveToQueryForm = () => {
	// 获取每个选中路径的最后一个节点
	const lastNodeValues = draftSelectedValues.value.map((value) => {
		// 如果是数组（完整路径），取最后一个值
		if (Array.isArray(value)) {
			return value[value.length - 1];
		}
		// 如果已经是单个值，直接返回
		return value;
	});

	localQueryForm.value[props.settings.code || 'categoryCodes'] = lastNodeValues;
	// 触发 change 事件，通知父组件值已改变（用于表单校验）
	emit('change', lastNodeValues);
	// 触发 input 事件（Element Plus 表单校验需要）
	emit('input', lastNodeValues);
};
// 处理搜索输入（带防抖）
const doSearch = async (keyword) => {
	if (props.settings.onSearch) {
		try {
			const res = await props.settings.onSearch(keyword);
			if (res.code === 0) {
				cascaderData.value = res.data;
				buildNodeMap(cascaderData.value);
				updateSelectionState();
			}
		} catch (error) {
			useMessage.error(error.message);
		}
	}
};

// 使用防抖包装搜索函数
const debouncedSearch = debounce(doSearch, 300);

// 监听搜索输入
const handleSearchInput = () => {
	debouncedSearch(searchKeyword.value);
};

// 清除搜索
const clearSearch = () => {
	searchKeyword.value = '';
	// 清空搜索时重新加载全部数据
	loadData();
};
// 取消
const handleCancel = () => {
	draftSelectedValues.value = [
		...(localQueryForm.value[props.settings.code || 'categoryCodes'] || []),
	];
	updateConfirmedTags();
	updateSelectionState();
	hidePanel();
};
// 确认
const handleConfirm = () => {
	saveToQueryForm();
	updateConfirmedTags();
	hidePanel();
};
// 显示面板
const showPanel = () => {
	panelVisible.value = true;
};
// 隐藏面板
const hidePanel = () => {
	panelVisible.value = false;
};

const handleClickOutside = (e) => {
	const cascaderEl = document.getElementById(cascaderId);
	if (cascaderEl && !cascaderEl.contains(e.target) && panelVisible.value) {
		hidePanel();
	}
};
/**
 * 加载数据（从 props.data 中获取）
 */
const loadData = () => {
	// 使用父组件传入的数据
	cascaderData.value = props.data || [];
	buildNodeMap(cascaderData.value);

	// 应用初始选中值（同步 queryForm 中的值）
	const selectedValues =
		localQueryForm.value[props.settings.code || 'categoryCodes'];
	if (selectedValues && selectedValues.length > 0) {
		draftSelectedValues.value = [...selectedValues];
	} else {
		// 如果 queryForm 中没有值，也清空 draftSelectedValues
		draftSelectedValues.value = [];
	}

	updateConfirmedTags();
	updateSelectionState();
};

// 监听器
watch(
	() => localQueryForm.value[props.settings.code || 'categoryCodes'],
	(newVal) => {
		if (Array.isArray(newVal)) {
			draftSelectedValues.value = [...newVal];
			updateConfirmedTags();
			updateSelectionState();
		} else {
			draftSelectedValues.value = [];
			confirmedTags.value = [];
			checkAll.value = false;
			isIndeterminate.value = false;
		}
	},
	{ immediate: true, deep: true }
);

watch(
	() => cascaderData.value,
	() => {
		if (cascaderData.value && cascaderData.value.length > 0) {
			buildNodeMap(cascaderData.value);
			updateConfirmedTags();
		}
	},
	{ deep: true }
);

// 监听 props.data 变化，重新加载数据
watch(
	() => props.data,
	(newData) => {
		if (newData && Array.isArray(newData)) {
			loadData();
		}
	},
	{ deep: true }
);

const setSelectedOptions = (data) => {
	// mountedSelectdValues.value = data;
	draftSelectedValues.value = data;
	localQueryForm.value[props.settings.code || 'categoryCodes'] = data;
	updateConfirmedTags();
};

// 生命周期钩子
onMounted(() => {
	document.addEventListener('click', handleClickOutside);
	loadData();
	emit('mounted');
});

onBeforeUnmount(() => {
	document.removeEventListener('click', handleClickOutside);
});

/**
 * 清空级联选择器的数据和选中值
 * 用于父组件需要手动清空时调用
 */
const clearData = () => {
	// 清空级联数据
	cascaderData.value = [];
	// 清空选中值
	draftSelectedValues.value = [];
	confirmedTags.value = [];
	// 重置全选状态
	checkAll.value = false;
	isIndeterminate.value = false;
	// 清空节点映射
	nodesMap.value = {};
	// 清空搜索关键字
	searchKeyword.value = '';
	// 同步清空 queryForm 中的数据
	localQueryForm.value[props.settings.code || 'categoryCodes'] = [];
};

// 向父组件暴露方法
defineExpose({
	cascaderPanelRef,
	showPanel,
	hidePanel,
	loadData,
	updateConfirmedTags,
	clearData, // 暴露清空方法
	setSelectedOptions,
});
</script>

<style>
.custom-cascader {
	display: inline-block;
	position: relative;
	width: 100%;
}

.tags-display {
	min-height: 32px;
	padding: 4px 8px;
	border: 1px solid #dcdfe6;
	border-radius: 4px;
	cursor: pointer;
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	gap: 4px;
}

.tags-display.is-error {
	border-color: var(--el-color-danger);
}

.selected-tag {
	margin: 2px 0;
	max-width: 100%;
	text-overflow: ellipsis;
	white-space: nowrap;
	overflow: hidden;
}

.more-tag {
	background-color: #f4f4f5;
	border-color: #e9e9eb;
}

.empty-input {
	width: 100%;
}

.trigger-input {
	width: 100%;
}

/* 级联下拉面板 - 可控制显示/隐藏 */
.cascader-dropdown {
	position: absolute;
	top: calc(100% + 5px);
	left: 0;
	min-width: 320px;
	background-color: #fff;
	border-radius: 4px;
	box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
	z-index: 2001;
	border: 1px solid #e4e7ed;
	padding: 12px;
}

/* 搜索框样式 */
.search-box {
	margin-bottom: 8px;
}

/* 面板容器 */
.panel-container {
	max-height: 300px;
	overflow-y: auto;
	border: 1px solid #e4e7ed;
	border-radius: 4px;
	margin-bottom: 8px;
}

/* 搜索结果列表 */
.search-results-list {
	padding: 5px 0;
}

.search-header {
	padding: 8px 12px;
	border-bottom: 1px solid #ebeef5;
	margin-bottom: 5px;
}

/* 全选头部样式 */
.select-all-header {
	padding: 8px 12px;
	border-bottom: 1px solid #ebeef5;
	margin-bottom: 5px;
	background-color: #f5f7fa;
}

.search-result-item {
	padding: 8px 12px;
	cursor: pointer;
	display: flex;
	align-items: center;
	gap: 8px;
}

.search-result-item:hover {
	background-color: #f5f7fa;
}

.node-label {
	color: #606266;
	font-size: 14px;
}

.empty-text {
	color: #909399;
	padding: 10px;
	text-align: center;
	font-size: 14px;
}

/* 按钮样式 */
.footer-btns {
	display: flex;
	justify-content: flex-end;
	gap: 8px;
	margin-top: 10px;
	padding-top: 8px;
	border-top: 1px solid #ebeef5;
}
</style>
