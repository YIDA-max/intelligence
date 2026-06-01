<!--
 * @Author: YIDA 3136271519@qq.com
 * @Date: 2025-10-23 19:54:24
 * @LastEditors: YIDA 3136271519@qq.com
 * @LastEditTime: 2025-10-24 13:45:03
 * @FilePath: \qianyi-ui\src\views\fbm\selfOrder\components\message\index.vue
 * @Description: 
 * 
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved. 
-->
<script setup lang="ts">
const props = defineProps({
	title: {
		type: String,
		default: '创建标签',
	},
});
const inputValue = ref<any>('');
const popoverRef = ref<null | any>(null);
const visible = ref(false);
const emit = defineEmits(['submit', 'init']);
/**
 * 初始化
 */
const init = () => {
	visible.value = true;
	inputValue.value = '';
	emit('init');
};
/**
 * 提交新增
 */
const submit = async () => {
	emit('submit', inputValue.value);
	visible.value = false;
};

// 暴露 inputValue 给插槽使用
defineExpose({
	inputValue,
});
</script>
<template>
	<el-popover
		placement="right"
		trigger="click"
		:visible="visible"
		width="300"
		ref="popoverRef"
	>
		<template #default>
			<el-row class="mb-2">
				<div>
					<strong>{{ props.title }}</strong>
				</div>
			</el-row>
			<el-row class="mb-2">
				<!-- 如果提供了 input 插槽，使用插槽内容 -->
				<template v-if="$slots.input">
					<slot name="input" :inputValue="inputValue" />
				</template>
				<!-- 否则使用默认的 textarea -->
				<el-input
					v-else
					type="textarea"
					:rows="4"
					v-model="inputValue"
					placeholder="请输入内容"
					maxlength="1000"
				></el-input>
			</el-row>
			<el-row class="flex" style="justify-content: flex-end; gap: 8px">
				<el-button
					@click="
						() => {
							visible = false;
						}
					"
					>取消</el-button
				>
				<el-button
					type="primary"
					@click="
						() => {
							submit();
						}
					"
				>
					确定
				</el-button>
			</el-row>
		</template>
		<template #reference>
			<span>
				<el-link underline="never" type="primary" @click="init">
					批量填写
				</el-link>
			</span>
		</template>
	</el-popover>
</template>

<style scoped></style>
