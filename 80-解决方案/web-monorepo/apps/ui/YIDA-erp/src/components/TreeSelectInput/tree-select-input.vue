<!--
 * @Author: 朱寒松 3136271519@qq.com
 * @Date: 2025-07-10 11:00:33
 * @LastEditors: wuyueqin wuyueqin@merach.com
 * @LastEditTime: 2026-02-14 14:28:16
 * @FilePath: \qianyi-ui\src\components\TreeSelectInput\tree-select-input.vue
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
			multiple
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
			@blur="handleBlur"
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
					/>
					<el-checkbox
						v-model="checkAll"
						:indeterminate="isIndeterminate"
						@change="handleCheckAllChange"
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
import { computed } from 'vue';
import { ref, onMounted } from 'vue';
import {
	collectAllNodeIds,
	filterTreeWithFullSubtreeOnParentMatch,
} from '/@/utils/arrayTree';
defineOptions({
	name: 'CustomTreeSelectInput',
});
const props = defineProps({
	settings: {
		type: Object as () => {
			getTreeData: (
				params?:
					| {
							[key: string]: any; // 用于传递查询参数的对象
					  }
					| string
					| any
			) => Promise<{ code: number; data: any[] }> | { code: number; data: any }; // 用于获取树形数据的方法
			getTreeDataParams?:
				| {
						[key: string]: any; // 用于传递查询参数的对象
				  }
				| string
				| any; // 用于获取树形数据时的参数，可以是一个对象或字符串
			width?: string; // 用于设置 el-tree-select 的宽度
			text?: string; // 用于显示的文本
			code?: string; // 用于绑定到 localQueryForm 的键名
			searchFn?: (data: any) => Promise<void>; // 用于搜索时调用的函数
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
		type: Object as () => Record<string, any>,
		default: () => ({}),
	},
	showInputSearch: {
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
const emits = defineEmits<{
	(e: 'update:queryForm', value: Record<string, any>): void;
	(e: 'blur', event: FocusEvent, value: Record<string, any>): void;
}>();
const localQueryForm = computed({
	get: () => {
		return props.queryForm;
	},
	set: (val) => {
		// 更新 localQueryForm 的值
		emits('update:queryForm', val);
	},
});

onMounted(async () => {
	setTimeout(() => {}, 1000);

	const res = await props.settings.getTreeData(
		props.settings.getTreeDataParams || {}
	);
	if (res.code === 0) {
		// 初始化树形数据
		// 如果返回的数据格式不符合预期，可以在这里进行转换
		if (res.data && Array.isArray(res.data)) {
			// 如果返回的数据是数组，可以进行进一步处理
			treeData.value = props.settings.renderData
				? props.settings.renderData(res.data)
				: res.data;
		} else if (
			res.data &&
			typeof res.data === 'object' &&
			res.data.records &&
			Array.isArray(res.data.records)
		) {
			// 如果返回的数据是分页格式，提取 records
			treeData.value = props.settings.renderData
				? props.settings.renderData(res.data.records)
				: res.data.records;
		} else {
			treeData.value = [];
		}
	}
});
const handleBlur = (event: FocusEvent) => {
	if (props.settings.searchFn) {
		props.settings?.searchFn(
			localQueryForm.value[props.settings.code || 'categoryCodes']
		);
		emits(
			'blur',
			event,
			localQueryForm.value[props.settings.code || 'categoryCodes']
		);
	}
};

// 全选，考虑所有层级的节点
const handleCheckAllChange = (value: boolean) => {
	checkAll.value = value;
	isIndeterminate.value = false;
	if (value) {
		// 选中时，递归收集所有节点的 ID（包括子节点）
		localQueryForm.value[
			props.settings.code as keyof typeof localQueryForm.value
		] = collectAllNodeIds(treeData.value, props.settings.getIdsCode);
	} else {
		// 取消选中时，清空已选
		localQueryForm.value[
			props.settings.code as keyof typeof localQueryForm.value
		] = [];
	}
};

// 处理树形选择变化,多选和全选的样式
const handleTreeSelectChange = () => {
	isIndeterminate.value =
		(
			localQueryForm.value[
				props.settings.code as keyof typeof localQueryForm.value
			] ?? []
		).length > 0 &&
		(
			localQueryForm.value[
				props.settings.code as keyof typeof localQueryForm.value
			] ?? []
		).length < collectAllNodeIds(treeData.value).length;
	checkAll.value =
		(
			localQueryForm.value[
				props.settings.code as keyof typeof localQueryForm.value
			] ?? []
		).length === collectAllNodeIds(treeData.value).length;
};
// 输入框搜索
// 输入框搜索（兼容子节点）
const handleInputSearch = async () => {
	// 清空选择的节点和全选状态
	localQueryForm.value[
		props.settings.code as keyof typeof localQueryForm.value
	] = [];
	checkAll.value = false;
	isIndeterminate.value = false;
	const searchValue = inputValue.value.trim().toLowerCase();
	if (!searchValue) {
		// 如果搜索值为空，恢复原始数据
		if (originalTreeData.value) {
			treeData.value = [...originalTreeData.value];
		} else {
			// 如果没有原始数据备份，重新获取
			const res = await props.settings.getTreeData(
				props.settings.getTreeDataParams || {}
			);
			if (res.code === 0) {
				treeData.value = res.data || [];
			}
		}
		return;
	}
	// 递归过滤树形数据，保留所有包含匹配项的路径
	if (!originalTreeData.value.length) {
		// 如果没有原始数据备份，保存当前树形数据
		originalTreeData.value = [...treeData.value];
	}
	treeData.value = filterTreeWithFullSubtreeOnParentMatch(
		treeData.value,
		searchValue,
		{
			label: props.settings.selectTreeProps?.label || 'name', // 使用 label 或默认的 'name'
			children: props.settings.selectTreeProps?.children || 'children', // 使用 children 或默认的 'children'
		}
	);
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
