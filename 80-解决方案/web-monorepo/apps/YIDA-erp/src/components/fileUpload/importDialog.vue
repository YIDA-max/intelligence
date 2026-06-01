<!--
 * @Author: 朱寒松 3136271519@qq.com
 * @Date: 2025-07-18 11:24:22
 * @LastEditors: YIDA 3136271519@qq.com
 * @LastEditTime: 2026-01-16 15:32:13
 * @FilePath: \qianyi-ui\src\components\fileUpload\importDialog.vue
 * @Description: 
 * 
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved. 
-->
<template>
	<el-dialog
		title="文件导入"
		v-model="dialogVisible"
		:close-on-click-modal="false"
		draggable
	>
		<FileUploader
			ref="uploaderRef"
			v-model="uploadedFile"
			:autoUpload="false"
			:drag="true"
			tipText="支持Excel和压缩文件格式"
			@success="handleSuccess"
			@error="handleError"
			@progress="onUploadProgress"
			:excelUploadApi="props.excelUploadApi"
			:imageUploadApi="props.imageUploadApi"
			:archiveUploadApi="props.archiveUploadApi"
			:defaultUploadApi="props.defaultUploadApi"
			:listType="props.listType"
			:buttonType="props.buttonType"
			:uploadText="props.uploadText"
			:showTip="props.showTip"
			:accept="props.accept"
			:templateUrl="props.templateUrl"
			:uploadTips="props.uploadTips"
			:showExpandTip="props.showExpandTip"
			@downloadTemplate="downloadTemplate"
			:useProgressDialog="useProgressDialog"
		/>
		<template #footer>
			<el-button @click="dialogVisible = false">{{
				$t('common.cancelButtonText')
			}}</el-button>
			<el-button type="primary" @click="submitFileForm">{{
				$t('导入')
			}}</el-button>
		</template>
	</el-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import FileUploader from '/@/components/fileUpload/index.vue';
import { useMessage } from '/@/hooks/message';
const emit = defineEmits([
	'update:modelValue',
	'refreshDataList',
	'downloadTemplate',
	'progress',
]);
// 默认组件名称
defineOptions({
	name: 'ImportDialog',
});
const dialogVisible = ref(false);
const uploadedFile = ref<string | unknown[] | Record<string, any> | undefined>(
	undefined
);
const uploaderRef = ref<any>(null);
// =====================================
// Props 定义
// =====================================
const props = defineProps({
	// v-model绑定值 - 可以是字符串(URL)、对象或数组
	modelValue: {
		type: [String, Array, Object],
		default: null,
	},

	// 上传配置
	accept: { type: String, default: '' }, // 接受的文件类型
	autoUpload: { type: Boolean, default: false }, // 是否自动上传
	drag: { type: Boolean, default: false }, // 是否允许拖拽上传
	listType: { type: String, default: '' }, // 列表类型，不传会自动判断
	buttonType: { type: String, default: 'primary' }, // 按钮类型
	uploadText: { type: String, default: '' }, // 上传按钮文字
	showTip: { type: Boolean, default: true }, // 是否显示提示

	// 模板配置
	templateUrl: { type: String, default: '' }, // 模板下载URL
	downLoadTemplateName: { type: String, default: 'template' }, // 模板下载名称

	// API配置 - 根据文件类型自动选择
	excelUploadApi: { type: String, default: '/product/sku/import' }, // Excel上传API
	imageUploadApi: { type: String, default: '' }, // 图片上传API
	archiveUploadApi: { type: String, default: '' }, // 压缩包上传API
	defaultUploadApi: { type: String, default: '' }, // 默认上传API

	// 提示信息的配置
	uploadTips: {
		type: Array,
		default: () => [
			'建议每次导入都使用最新的导入模板，避免出现不必要的错误',
			'仅支持xls/xlsx格式',
			'行数不超过5000条，文件大小不超过5M',
			'同一个记录代码存在多条记录时，以第一条为准',
		],
	},
	// 下载模板旁提示信息
	showExpandTip: { type: String, default: '' },
	// 是否在上传时展示进度弹窗
	useProgressDialog: { type: Boolean, default: true },
});
// 提交表单，触发上传
const submitFileForm = () => {
	// 校验是否已选择文件
	if (!uploaderRef.value?.getFileData()) {
		useMessage().error('请先上传文件');
		return;
	}
	uploaderRef.value.submitUpload();
	if (props.useProgressDialog) {
		uploaderRef.value?.openProgressDialog?.();
	}
};

// 上传进度事件（可选处理）
const onUploadProgress = (response: any, file: any) => {
	emit('progress', response, file);
};

// 上传成功处理（进度条由 FileUploader 内部自动关闭）
const handleSuccess = () => {
	dialogVisible.value = false;
	emit('refreshDataList');
};
// 上传出错处理
const handleError = () => {
	// 已经在组件内显示了错误弹窗，这里可以做额外处理
	// 关闭进度弹窗（如果有）
	if (props.useProgressDialog) {
		uploaderRef.value?.closeProgressDialog?.();
	}
	// console.log('上传出错:', response);
	emit('refreshDataList');
};
// 显示对话框
const show = () => {
	dialogVisible.value = true;
	// 清空文件列表
	uploadedFile.value = undefined;
	uploaderRef.value?.clearFiles();
};

const downloadTemplate = () => {
	emit('downloadTemplate');
};

defineExpose({
	show,
});
</script>
