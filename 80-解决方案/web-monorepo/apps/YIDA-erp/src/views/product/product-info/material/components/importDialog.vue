<!--
 * @Author: 朱寒松 3136271519@qq.com
 * @Date: 2025-07-18 11:24:22
 * @LastEditors: 朱寒松 3136271519@qq.com
 * @LastEditTime: 2025-07-18 16:57:24
 * @FilePath: \qianyi-ui\src\views\product\product-info\material\components\importDialog.vue
 * @Description: 
 * 
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved. 
-->
<template>
	<el-dialog title="文件导入" v-model="dialogVisible" :close-on-click-modal="false" draggable>
		<FileUploader
			ref="uploaderRef"
			v-model="uploadedFile"
			accept=".xlsx,.xls,.zip"
			:autoUpload="false"
			:drag="true"
			tipText="支持Excel和压缩文件格式"
			:templateUrl="templateUrl"
			@success="handleSuccess"
			@error="handleError"
		/>

		<template #footer>
			<el-button @click="dialogVisible = false">{{ $t('common.cancelButtonText') }}</el-button>
			<el-button type="primary" @click="submitFileForm">{{ $t('导入') }}</el-button>
		</template>
	</el-dialog>
</template>

<script setup>
import { ref } from 'vue';
import FileUploader from '/@/components/fileUpload/index.vue';
// import { useMessage } from '/@/hooks/message';

// const props = defineProps({
// 	templateUrl: {
// 		type: String,
// 		default: '',
// 	},
// });
const dialogVisible = ref(false);
const uploadedFile = ref(null);
const uploaderRef = ref(null);

// 提交表单，触发上传
const submitFileForm = () => {
	uploaderRef.value.submitUpload();
};

// 上传成功处理
const handleSuccess = () => {
	dialogVisible.value = false;
};
// 上传出错处理
const handleError = () => {
	// 已经在组件内显示了错误弹窗，这里可以做额外处理
	// console.log('上传出错:', response);
};
// 显示对话框
const show = () => {
	dialogVisible.value = true;
};

defineExpose({
	show,
});
</script>
