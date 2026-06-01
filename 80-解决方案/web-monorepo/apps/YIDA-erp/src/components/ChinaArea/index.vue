<template>
	<el-cascader :options="areas" :disabled="disabled" :props="optionProps" v-model="selectedOptions" filterable @change="handleChange">
		<template #default="{ data }">
			<span>{{ data.name }}</span>

			<!-- 图标 -->
			<svg
				v-if="data.hot === '1'"
				t="1708145002710"
				class="ml-4 icon"
				viewBox="0 0 1024 1024"
				version="1.1"
				xmlns="http://www.w3.org/2000/svg"
				p-id="6040"
				width="12"
				height="12"
			>
				<path
					d="M760.591059 332.739765L681.682824 409.6s0-307.2-263.107765-409.539765c0 0-26.262588 281.6-157.816471 383.939765-131.553882 102.460235-394.721882 409.6 131.433412 639.939765 0 0-263.168-281.6 78.908235-486.27953 0 0-26.322824 102.339765 105.231059 204.8 131.614118 102.4 0 281.6 0 281.6s631.506824-153.6 184.32-691.260235z"
					fill="#EA322B"
					p-id="6041"
				></path>
			</svg>
		</template>
	</el-cascader>
</template>

<script lang="ts" setup>
import { fetchTree } from '/@/api/admin/sysArea';
import { CascaderProps } from 'element-plus';

const emit = defineEmits(['update:modelValue', 'change']);

const props = defineProps({
	modelValue: {
		type: Array,
		default: () => [],
	},
	type: { type: Number, default: 4 },
	disabled: { type: Boolean, default: false },
	plus: { type: Boolean, default: false },
});

const optionProps: CascaderProps = {
	checkStrictly: props.plus,
	label: 'name',
	value: 'id',
};

let areas = ref([]);

const selectedOptions = computed({
	get: () => props.modelValue,
	set: (val) => {
		emit('update:modelValue', val);
	},
});

const handleChange = (value) => {
	emit('change', value);
};

onMounted(async () => {
	const { data } = await fetchTree();
	areas.value = data;
});
</script>
