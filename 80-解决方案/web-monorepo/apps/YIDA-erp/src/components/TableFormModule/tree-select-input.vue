<!--
 * @Author: 朱寒松 3136271519@qq.com
 * @Date: 2025-07-10 11:00:33
 * @LastEditors: wuyueqin wuyueqin@merach.com
 * @LastEditTime: 2026-04-29 16:48:11
 * @FilePath: \qianyi-ui\src\components\TableFormModule\tree-select-input.vue
 * @Description: 
 * 
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved. 
-->
<template>
	<div :style="{}">
		<el-tree-select
			ref="treeSelectRef"
			v-model="localQueryForm[props.settings.code || 'categoryCodes']"
			:placeholder="$t(props.settings.text || '')"
			:render-after-expand="false"
			:data="treeData"
			:disabled="disabled"
			:props="{
				value: props.settings.selectTreeProps?.value || 'value',
				label: props.settings.selectTreeProps?.label || 'label',
				children: props.settings.selectTreeProps?.children || 'children',
			}"
			:node-key="props.settings.selectTreeProps?.value || 'value'"
			show-checkbox
			fit-input-width
			clearable
			check-strictly
			:multiple="props.enableMultiple"
			collapse-tags
			:max-collapse-tags="1"
			@change="
				() => {
					handleTreeSelectChange();
				}
			"
			:style="{
				border: '0px',
				width: props.settings.width || '280px',
			}"
			:render-content="renderContent"
		>
			<template #header>
				<div
					:style="{
						display: 'flex',
						alignItems: 'flex-start',
						flexDirection: 'column',
					}"
				>
					<el-input
						v-if="props.showInputSearch"
						v-model="inputValue"
						:placeholder="`搜索${props.settings.text || ''}`"
						prefix-icon="Search"
						:style="{
							width: '100%',
							border: '0px',
						}"
						@blur="
							() => {
								handleInputSearch();
							}
						"
						@keyup.enter="
							() => {
								handleInputSearch();
							}
						"
						@click:suffix="
							() => {
								handleInputSearch();
							}
						"
						@input="debouncedHandleInputSearch"
					/>
					<el-checkbox
						v-model="checkAll"
						:indeterminate="isIndeterminate"
						@change="handleCheckAllChange"
						v-if="enableMultiple"
					>
						全选
					</el-checkbox>
				</div>
			</template>
			<template #footer>
				<div class="flex justify-end">
					<el-button
						@click="
							() => {
								handleCancel();
							}
						"
						plain
						size="small"
						>{{ $t('取消') }}
					</el-button>
					<el-button
						@click="
							() => {
								props.settings.searchFn &&
									props.settings.searchFn(
										localQueryForm[props.settings.code || 'categoryCodes']
									);
								treeSelectRef.blur();
							}
						"
						type="primary"
						plain
						size="small"
						>{{ $t('确定') }}
					</el-button>
				</div>
			</template>
		</el-tree-select>
	</div>
</template>

<script setup lang="ts">
import { RenderContentFunction, ElButton, ElTooltip } from 'element-plus';
import { computed } from 'vue';
import { ref, onMounted } from 'vue';
import {
	collectAllNodeIds,
	filterTreeWithFullSubtreeOnParentMatch,
} from '/@/utils/arrayTree';
// 声明名称
defineOptions({
	name: 'TreeSelectInput',
});
const props = defineProps({
	settings: {
		type: Object as () => {
			getTreeData: (
				params?:
					| {
							[key: string]: any; // 用于传递查询参数的对象
					  }
					| any
			) => Promise<{ code: number; data: any[] }> | { code: number; data: any }; // 用于获取树形数据的方法
			getTreeDataParams?:
				| {
						[key: string]: any; // 用于传递查询参数的对象
				  }
				| string; // 用于获取树形数据时的参数，可以是一个对象或字符串
			width?: string; // 用于设置 el-tree-select 的宽度
			text?: string; // 用于显示的文本
			code?: string; // 用于绑定到 localQueryForm 的键名
			searchFn?: (data: any) => Promise<void>; // 用于搜索时调用的函数
			prefixKey?: string;
			separator?: string;
			selectTreeProps?: {
				// 用于 el-tree-select 的 props
				value?: string;
				label?: string;
				children?: string;
			};
			getIdsCode: string; // 用于获取选中节点的 ID 是什么字段 是id 还是 code 还是其他 其实selectTreeProps的value是什么他就是什么
			renderData?: (data: any) => any; // 自定义渲染树结构的函数
		},
		default: () => ({
			getTreeData: async () => {
				// 默认的获取树形数据方法
				return { code: 0, data: [] };
			},
			getTreeDataParams: {},
			width: '280px',
			text: '类目',
			code: 'categoryCodes',
			searchFn: () => Promise.resolve(),
			prefixKey: '',
			separator: '-',
			selectTreeProps: {
				value: 'value',
				label: 'label',
				children: 'children',
			},
			getIdsCode: 'id', // 默认使用 id 作为选中节点的 ID
			renderData: (data: any) => data, // 默认的渲染函数，直接返回数据
		}),
	},
	queryForm: {
		type: Object as () => {
			categoryCodes?: number[];
			[key: string]: any; // 其他可能的查询参数
		},
		default: () => ({}),
	},
	disabled: {
		type: Boolean,
		default: false,
	},
	// 是否显示搜索框
	showInputSearch: {
		type: Boolean,
		default: true,
	},
	// 是否多选搜索框
	enableMultiple: {
		type: Boolean,
		default: true,
	},
});
const treeSelectRef = ref();
const treeData = ref<any[]>([]);
const inputValue = ref('');
const checkAll = ref(false);
const isIndeterminate = ref(false);
// 用于备份原始树形数据，以便在搜索时恢复
const originalTreeData = ref<Array<any>>([]);
const emits = defineEmits(['update:queryForm']);
const localQueryForm = computed({
	get: () => {
		return props.queryForm;
	},
	set: (val) => {
		// 更新 localQueryForm 的值
		emits('update:queryForm', val);
	},
});

// 用于在树形数据节点中加上前缀
const formatTreeDataLabel = (data: any[]): any[] => {
	const prefixKey = props.settings?.prefixKey;
	if (!prefixKey) return data;

	const separator = props.settings?.separator || '-';
	const labelKey = props.settings.selectTreeProps?.label || 'label';
	const childrenKey = props.settings.selectTreeProps?.children || 'children';

	const formatNodes = (nodes: any[]): any[] => {
		return nodes.map((node) => {
			const newNode = { ...node };
			const prefixValue = newNode[prefixKey];
			const originalLabel = newNode[labelKey];

			if (
				prefixValue !== undefined &&
				prefixValue !== null &&
				prefixValue !== '' &&
				originalLabel !== undefined &&
				originalLabel !== null &&
				originalLabel !== ''
			) {
				if (newNode.originalLabel === undefined) {
					newNode.originalLabel = originalLabel;
				}
				newNode[
					labelKey
				] = `${prefixValue}${separator}${newNode.originalLabel}`;
			} else {
				if (newNode.originalLabel === undefined) {
					newNode.originalLabel = originalLabel;
				}
			}

			if (newNode[childrenKey] && Array.isArray(newNode[childrenKey])) {
				newNode[childrenKey] = formatNodes(newNode[childrenKey]);
			}
			return newNode;
		});
	};

	return formatNodes(data);
};

const fetchTreeData = async () => {
	const res = await props.settings.getTreeData(
		props.settings.getTreeDataParams || {}
	);
	if (res.code === 0) {
		let processedData: any[] = [];
		if (res.data && Array.isArray(res.data)) {
			processedData = props.settings.renderData
				? props.settings.renderData(res.data)
				: res.data;
		} else if (
			res.data &&
			typeof res.data === 'object' &&
			res.data.records &&
			Array.isArray(res.data.records)
		) {
			processedData = props.settings.renderData
				? props.settings.renderData(res.data.records)
				: res.data.records;
		}
		return formatTreeDataLabel(processedData);
	}
	return [];
};

onMounted(async () => {
	const processedData = await fetchTreeData();
	treeData.value = processedData;
	// 保存原始数据备份，用于搜索时恢复
	originalTreeData.value = [...processedData];
});

const renderContent: RenderContentFunction = (h, { node }) => {
	return h(
		'div',
		{
			style: {
				display: 'flex',
				alignItems: 'center',
			},
		},
		[
			h(
				ElTooltip,
				{ content: node.label, placement: 'right-start' },
				{
					default: () =>
						h(
							'span',
							{
								style: {
									overflow: 'hidden',
									textOverflow: 'ellipsis',
									whiteSpace: 'nowrap',
									display: 'inline-block',
								},
							},
							node.label
						),
				}
			),
		]
	);
};

// 全选，考虑所有层级的节点
const handleCheckAllChange = (value: boolean) => {
	checkAll.value = value;
	isIndeterminate.value = false;

	// 获取当前已选中的节点ID
	const currentSelectedIds = (localQueryForm.value[
		props.settings.code as keyof typeof localQueryForm.value
	] ?? []) as any[];

	// 获取当前显示的树节点ID（可能是搜索后的结果）
	const currentTreeNodeIds = collectAllNodeIds(
		treeData.value,
		props.settings.getIdsCode
	);

	if (value) {
		// 全选时：将当前显示的所有节点ID添加到已选列表（去重）
		const mergedIds = [
			...new Set([...currentSelectedIds, ...currentTreeNodeIds]),
		];
		localQueryForm.value[
			props.settings.code as keyof typeof localQueryForm.value
		] = mergedIds;
	} else {
		// 取消全选时：从已选列表中移除当前显示的节点ID
		const remainingIds = currentSelectedIds.filter(
			(id) => !currentTreeNodeIds.includes(id)
		);
		localQueryForm.value[
			props.settings.code as keyof typeof localQueryForm.value
		] = remainingIds;
	}
};

// 处理树形选择变化,多选和全选的样式
const handleTreeSelectChange = () => {
	// 更新全选和半选状态
	updateCheckAllState();

	// 重新刷新数据
	props.settings.searchFn &&
		props.settings.searchFn(
			localQueryForm.value[props.settings.code || 'categoryCodes']
		);
};

// 防抖定时器
let searchTimer: ReturnType<typeof setTimeout> | null = null;
const debouncedHandleInputSearch = () => {
	if (searchTimer) clearTimeout(searchTimer);
	searchTimer = setTimeout(() => {
		handleInputSearch();
	}, 300);
};

// 输入框搜索
// 输入框搜索（兼容子节点）
const handleInputSearch = async () => {
	// 1. 获取当前输入框的搜索值，并标准化（去空格 + 转小写）
	const searchValue = inputValue.value.trim().toLowerCase();

	// 2. 如果搜索值为空，恢复为完整的原始树数据
	if (!searchValue) {
		if (originalTreeData.value && originalTreeData.value.length > 0) {
			// 如果已有原始数据备份，直接使用
			treeData.value = [...originalTreeData.value];
		} else {
			// 如果没有原始数据（比如首次加载），则重新请求完整树数据
			const newTreeData = await fetchTreeData();
			treeData.value = newTreeData;
			// 同时保存一份原始数据用于后续搜索（只在首次获取时保存）
			originalTreeData.value = [...treeData.value];
		}
		// 恢复完整树后，更新全选/半选状态
		updateCheckAllState();
		return;
	}

	// 3. 确保我们拥有完整的原始树数据（用于每次搜索都从源头开始）
	let fullTreeData = originalTreeData.value;

	// 如果尚未缓存原始数据（例如组件初始化后直接输入搜索），先获取完整数据
	if (!fullTreeData || fullTreeData.length === 0) {
		const newTreeData = await fetchTreeData();
		if (newTreeData && newTreeData.length > 0) {
			fullTreeData = newTreeData;
			// 缓存原始完整树数据，供后续搜索复用
			originalTreeData.value = [...fullTreeData];
		} else {
			// 请求失败，清空树并提前返回
			treeData.value = [];
			return;
		}
	}

	// 4. 基于完整的原始树数据进行递归过滤
	//    过滤逻辑：只要节点 label 匹配，或其任意子节点匹配，则保留该节点及其完整子树路径
	treeData.value = filterTreeWithFullSubtreeOnParentMatch(
		fullTreeData,
		searchValue,
		{
			label: props.settings.selectTreeProps?.label || 'name', // 节点显示字段名，默认 'name'
			children: props.settings.selectTreeProps?.children || 'children', // 子节点字段名，默认 'children'
		}
	);

	// 搜索完成后，更新全选/半选状态（基于过滤后的树和已选节点）
	updateCheckAllState();
};

// 更新全选和半选状态（不改变已选择的值）
const updateCheckAllState = () => {
	// 获取当前已选中的节点ID
	const currentSelectedIds = (localQueryForm.value[
		props.settings.code as keyof typeof localQueryForm.value
	] ?? []) as any[];

	// 获取当前显示的树节点ID（可能是搜索后的结果）
	const currentTreeNodeIds = collectAllNodeIds(
		treeData.value,
		props.settings.getIdsCode
	);

	// 计算当前显示的节点中有多少被选中
	const selectedInCurrentTree = currentSelectedIds.filter((id) =>
		currentTreeNodeIds.includes(id)
	);

	const selectedCount = selectedInCurrentTree.length;
	const totalCount = currentTreeNodeIds.length;

	// 更新全选和半选状态（基于当前显示的树）
	if (selectedCount === 0) {
		checkAll.value = false;
		isIndeterminate.value = false;
	} else if (selectedCount === totalCount && totalCount > 0) {
		checkAll.value = true;
		isIndeterminate.value = false;
	} else {
		checkAll.value = false;
		isIndeterminate.value = true;
	}
};
// 取消按钮
const handleCancel = () => {
	// 清空数据
	localQueryForm.value[
		props.settings.code as keyof typeof localQueryForm.value
	] = [];
	checkAll.value = false;
	isIndeterminate.value = false;
	// 失去焦点
	treeSelectRef?.value ? treeSelectRef.value.blur() : null;
};

defineExpose({
	treeSelectRef,
});
</script>

<style lang="scss" scoped></style>
