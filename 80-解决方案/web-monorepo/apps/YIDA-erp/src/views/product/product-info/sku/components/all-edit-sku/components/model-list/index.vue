<!--
 * @Author: YIDA 3136271519@qq.com
 * @Date: 2025-12-05 16:00:06
 * @LastEditors: YIDA zhuhansong@merach.com
 * @LastEditTime: 2026-04-02 17:45:26
 * @FilePath: \qianyi-ui\src\views\product\product-info\sku\components\all-edit-sku\components\model-list\index.vue
 * @Description: 
 * 
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved. 
-->
<script setup lang="ts">
const checkList = ref<string[]>([]);
const props = defineProps<{
	optionGroups: Array<{
		title: string;
		options: Array<{ label: string; value: string; isShow?: boolean }>;
	}>;
	skuList: Array<{ id: string; name: string }>;
}>();

// 设置emit
const emit = defineEmits(['setCheckList']);
const activeNames = ref<string | number | Array<string | number>>([]);
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
	// // 默认展开第一个分组
	// if (props.optionGroups.length > 0) {
	// 	activeNames.value = props.optionGroups[0].title;
	// }
	// 默认展开所有分组
	activeNames.value = props.optionGroups.map((group) => group.title);
};
defineExpose({
	setCheckList,
	init,
});
</script>

<template>
	<div class="model-list">
		<div>已选择: {{ skuList?.length }} 个产品</div>
		<el-collapse v-model="activeNames">
			<el-collapse-item
				v-for="group in props.optionGroups"
				:key="group.title"
				:name="group.title"
				:title="group.title"
				v-show="group.options.some((item) => item.isShow)"
			>
				<el-checkbox-group v-model="checkList">
					<el-row :gutter="20" class="list-box">
						<el-col v-for="item in group.options" :key="item.value" :span="12">
							<el-checkbox
								:label="item.label"
								:value="item.value"
								v-show="item.isShow"
							/>
						</el-col>
					</el-row>
				</el-checkbox-group>
			</el-collapse-item>
		</el-collapse>
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
