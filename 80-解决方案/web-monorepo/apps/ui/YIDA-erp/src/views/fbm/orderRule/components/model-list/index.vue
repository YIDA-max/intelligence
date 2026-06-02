<script setup lang="ts">
const checkList = ref<string[]>([]);
const props = defineProps<{
	optionGroups: Array<{
		title: string;
		options: Array<{ label: string; value: string }>;
	}>;
}>();

// 设置emit
const emit = defineEmits(['setCheckList']);
// 监听选中值变化
watch(
	() => checkList.value,
	(val) => {
		emit('setCheckList', val);
	},
	{ immediate: true }
);
// 设置回显的数据
const setCheckList = (val: string[]) => {
	checkList.value = val;
};
// 初始化数据
const init = () => {
	checkList.value = [];
};
defineExpose({
	setCheckList,
	init,
});
</script>

<template>
	<div class="model-list">
		<el-row>
			<el-col :span="24">
				<span class="list-title">可选条件</span>
			</el-col>
		</el-row>
		<div v-for="group in props.optionGroups" :key="group.title">
			<el-row>
				<el-col :span="24">
					<div class="list-box-title">{{ group.title }}</div>
				</el-col>
			</el-row>
			<el-checkbox-group v-model="checkList">
				<el-row :gutter="20" class="list-box">
					<el-col v-for="item in group.options" :key="item.value" :span="12">
						<el-checkbox :label="item.label" :value="item.value" />
					</el-col>
				</el-row>
			</el-checkbox-group>
		</div>
	</div>
</template>

<style scoped lang="scss">
.model-list {
	padding: 16px;
	background: #fff;
	border-radius: 8px;
	box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.1);
	height: 600px;
	overflow: auto;
	.list-title {
		font-size: 14px;
	}
	.list-box-title {
		font-weight: 600;
		margin: 8px 0;
	}
	.list-box {
		border-bottom: 1px solid #f0f0f0;
	}
}
</style>
