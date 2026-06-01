<!--
 * MrSelect — 二封下拉：传入 options 数组即可渲染选项。
 *
 * - options：每项可为任意「大对象」，只需包含用于选项的值/文案字段（默认 value、label，与 el-option 一致）；
 *   其余字段可保留，组件不读取。
 * - value-key / label-key / disabled-key：映射字段名，按需覆盖默认值。
 * - 未声明的属性与事件：与 el-select 一致，透传给内部 BaseSelect（placeholder、clearable、multiple、filterable、style、@change 等）。
 * - 插槽：#option="{ item, index }" 自定义每一项展示（仍建议对象上有 label 供选中态展示）；#empty、#prefix 等同 el-select。
 -->
<template>
	<BaseSelect
		ref="baseSelectRef"
		v-model="model"
		v-bind="$attrs"
		:multiple="props.multiple"
		:filterable="props.filterable"
		:clearable="props.clearable"
		:style="{ width: props.width }"
	>
		<BaseOption
			v-for="(item, index) in options"
			:key="index"
			:label="item[props.mappingFields.label]"
			:value="item[props.mappingFields.value]"
			:disabled="item[props.mappingFields.disabled]"
		>
			<template v-if="$slots.option">
				<slot name="option" :item="item" :index="index" />
			</template>
		</BaseOption>
	</BaseSelect>
</template>
<script setup lang="ts">
import { ref, computed } from 'vue';
import BaseSelect from './base/baseSelect.vue';
import BaseOption from './base/baseOption.vue';
defineOptions({
	name: 'MrSelect',
	inheritAttrs: false,
});
// 事件
const emit = defineEmits(['setModelValue']);
// 本地维护的v-model
const model = ref<any>(null);
// 内部 el-select 实例
const baseSelectRef = ref<InstanceType<typeof BaseSelect> | null>(null);
// 内部 el-select 实例（与 BaseSelect.selectRef 一致）
const selectRef = computed(() => baseSelectRef.value?.selectRef ?? null);
// 属性
const props = withDefaults(
	defineProps<{
		/** 选项列表（每项可为任意大对象） */
		options?: Record<string, unknown>[];
		//  映射字段对象
		mappingFields: {
			value: string;
			label: string;
			disabled: string;
		};
		// 单选还是多选
		multiple: boolean;
		// 宽度
		width: string;
		// 如果是多选，最多的tag数量
		maxTags: number;
		// 是否可以搜索
		filterable: boolean;
		// 是否可以清空
		clearable: boolean;
		// 单选是否需要转换为数组
		isSingle: boolean;
	}>(),
	{
		options: () => [],
		mappingFields: () => ({
			value: 'value',
			label: 'label',
			disabled: 'disabled',
		}),
		multiple: false,
		width: '200px',
		maxTags: 1,
		filterable: true,
		clearable: true,
		isSingle: false,
	}
);
// 监听内部的值的变化
watch(model, (newVal) => {
	// 首先需要判断是否是单选转换为数组
	if (props.isSingle && !Array.isArray(newVal) && !props.multiple) {
		emit('setModelValue', [newVal]);
	} else {
		emit('setModelValue', newVal);
	}
});
// 暴露方法
defineExpose({
	baseSelectRef,
	selectRef,
	focus: () => baseSelectRef.value?.focus(),
	blur: () => baseSelectRef.value?.blur(),
});
</script>
