<script setup lang="ts">
import { PropType } from 'vue';

/**
 * 接收父组件传递的属性
 * @property {string[]} modelValue - 选中的模块值列表
 * @property {Array} options - 模块选项列表
 * @property {string} dialogType - 弹窗类型
 */
const props = defineProps({
	modelValue: {
		type: Array as PropType<string[]>,
		default: () => [],
	},
	options: {
		type: Array as PropType<{ label: string; value: string }[]>,
		required: true,
	},
	dialogType: {
		type: String,
		default: 'add',
	},
});

/**
 * 定义事件
 * @event update:modelValue - 更新选中值
 */
const emit = defineEmits(['update:modelValue']);

/**
 * 处理复选框变更
 * @param {string[]} val - 选中的值
 */
const handleChange = (val: string[]) => {
	emit('update:modelValue', val);
};
</script>

<template>
	<div class="flex justify-center mb-4">
		<el-checkbox-group :model-value="props.modelValue" @change="handleChange">
			<el-checkbox
				v-for="opt in options"
				:key="opt.value"
				:label="opt.value"
				:value="opt.value"
				:disabled="props.dialogType === 'detail'"
			>
				{{ opt.label }}
			</el-checkbox>
		</el-checkbox-group>
	</div>
</template>
