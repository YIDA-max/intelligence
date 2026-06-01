<!--
 * @Author: 朱寒松 3136271519@qq.com
 * @Date: 2025-07-18 11:24:22
 * @LastEditors: YIDA 3136271519@qq.com
 * @LastEditTime: 2025-08-22 18:39:30
 * @FilePath: \qianyi-ui\src\components\fileUpload\showResult.vue
 * @Description: 
 * 
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved. 
-->
<template>
	<el-dialog
		:title="title"
		v-model="dialogVisible"
		:close-on-click-modal="false"
		draggable
		@close="close"
		:append-to-body="true"
		@closed="emit('closed')"
	>
		<!-- <div class="errorTotal">
			<div class="items-total">
				<div class="fail-circle"></div>
				总数{{ result?.totalCount }}
			</div>
			<div class="items-total">
				<div class="fail-circle green"></div>
				成功{{ result?.successCount }}
			</div>
			<div class="items-total">
				<div class="fail-circle red"></div>
				失败{{ result?.failCount }}
			</div>
		</div> -->
		<div class="error-reason">
			<el-icon class="error-icon" style="color: #eb4d65; margin-right: 4px"><Warning /></el-icon>
			<div>{{ t('失败原因') }}</div>
		</div>
		<el-table :data="result?.failInfos?.map((item) => ({ info: item }))" style="width: 100%">
			<el-table-column prop="info" show-overflow-tooltip></el-table-column>
		</el-table>
		<template #footer>
			<el-button @click="close">{{ t('common.cancelButtonText') }}</el-button>
		</template>
	</el-dialog>
</template>

<script setup>
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { Warning } from '@element-plus/icons-vue'; // ✅ 别忘了导入图标
const emit = defineEmits(['closed']); // ✅ 定义 closed 事件
const dialogVisible = ref(false);
const { t } = useI18n(); // 👈 获取 t 函数

// 展示的标头
const title = ref('结果');
// 需要展示的结果
const result = ref({});
// 显示对话框
const show = () => {
	dialogVisible.value = true;
};
// 设置错误数据
const setData = ({ data = {}, title: dialogTitle = '结果' }) => {
	result.value = data;
	title.value = dialogTitle;
};

// 关闭对话框
const close = () => {
	dialogVisible.value = false;
	result.value = {};
};

defineExpose({
	show,
	setData,
	close,
});
</script>
<style lang="scss" scoped>
.errorTotal {
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
	margin: 20px 5px;
	font-size: 16px;
	border-top: 1px solid #f0f0f0;
	border-bottom: 1px solid #f0f0f0;
	padding: 10px;
}
.fail-circle {
	width: 5px;
	height: 5px;
	border-radius: 50%;
	background-color: #000;
	margin-right: 10px;
}
.items-total {
	display: flex;
	flex-direction: row;
	align-items: center;
}
.green {
	background-color: #94d394;
}
.green {
	background-color: #94d394;
}
.red {
	background-color: #eb4d65;
}
.error-reason {
	display: flex;
	flex-direction: row;
	align-items: center;
}
</style>
