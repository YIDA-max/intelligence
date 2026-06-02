<!--
 * @Author: YIDA 3136271519@qq.com
 * @Date: 2025-09-25 18:26:24
 * @LastEditors: wuyueqin wuyueqin@merach.com
 * @LastEditTime: 2026-04-16 10:25:13
 * @FilePath: \qianyi-ui\src\views\fbm\selfOrder\components\info\index.vue
 * @Description: 
 * 
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved. 
-->
<script setup lang="ts">
import { ref } from 'vue';
// import { useI18n } from 'vue-i18n';
// const { t } = useI18n();
// 标题组件
const TitleComponent = defineAsyncComponent(
	() =>
		import('/@/views/fbm/selfOrder/components/info/components/title/index.vue')
);
// 进度条组件
const ProgressBarComponent = defineAsyncComponent(
	() =>
		import(
			'/@/views/fbm/selfOrder/components/info/components/progressBar/index.vue'
		)
);
// 信息展示组件
const MessageComponent = defineAsyncComponent(
	() =>
		import(
			'/@/views/fbm/selfOrder/components/info/components/message/index.vue'
		)
);
// 商品信息列表组件
const ProductListComponent = defineAsyncComponent(
	() =>
		import(
			'/@/views/fbm/selfOrder/components/info/components/productList/index.vue'
		)
);
const dialogVisible = ref(false);
// const titleInfo = ref({});
const dialogRef = ref<null | any>(null);

/**
 * 初始化
 */
const init = () => {};

/**
 * 弹窗关闭后的回调
 */
const closeDialog = () => {
	dialogVisible.value = false;
};
/**
 * 打开弹窗方法
 * 供父组件调用
 */
const show = () => {
	dialogVisible.value = true;
};

/**
 * 关闭弹窗方法
 * 供父组件调用
 */
const hide = () => {
	dialogVisible.value = false;
};

// 暴露方法给父组件
defineExpose({
	show,
	hide,
});
</script>
<template>
	<el-dialog
		draggable
		ref="dialogRef"
		v-model="dialogVisible"
		width="80%"
		:close-on-click-modal="false"
		:close-on-press-escape="false"
		:append-to-body="true"
		@open="init"
		@close="closeDialog"
		:style="{
			height: '90vh',
		}"
	>
		<template #header>
			<TitleComponent />
		</template>
		<div>
			<div class="progressBar">
				<ProgressBarComponent />
			</div>
			<div class="message">
				<MessageComponent />
			</div>
			<div class="message">
				<ProductListComponent />
			</div>
		</div>
	</el-dialog>
</template>

<style lang="scss" scoped></style>
