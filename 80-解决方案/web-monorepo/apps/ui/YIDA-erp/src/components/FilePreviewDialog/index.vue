<!--
 * @Author: YIDA zhuhansong@merach.com
 * @Date: 2026-04-29 10:36:33
 * @LastEditors: YIDA zhuhansong@merach.com
 * @LastEditTime: 2026-05-07 15:00:26
 * @FilePath: \qianyi-ui\src\components\FilePreviewDialog\index.vue
 * @Description:  
 * 
 * Copyright (c) 2026 by ${git_name_email}, All Rights Reserved. 
-->
<template>
	<el-dialog
		v-model="visible"
		width="880"
		append-to-body
		destroy-on-close
		:draggable="true"
		:overflow="true"
		class="file-preview-dialog"
		:title="'文件预览'"
		@closed="close"
	>
		<div class="file-preview-dialog__wrap">
			<el-image
				v-if="kind === 'image'"
				:src="previewSrc"
				alt=""
				class="file-preview-dialog__image"
			/>
			<video
				v-else-if="kind === 'video'"
				:src="previewSrc"
				class="file-preview-dialog__video"
				controls
				playsinline
			/>

			<div v-else-if="kind === 'pdf'" class="file-preview-dialog__pdf">
				<VuePdfEmbed v-if="previewSrc" :source="previewSrc" />
			</div>

			<div
				v-else-if="kind === 'excel'"
				class="file-preview-dialog__excel"
				v-html="excelPreviewHtml"
			/>
			<div
				v-else-if="kind === 'word'"
				class="file-preview-dialog__word"
				v-html="wordPreviewHtml"
			/>
			<el-empty v-else description="当前文件暂不支持内嵌预览，请手动打开" />
			<div class="file-preview-dialog__toolbar">
				<el-button type="primary" link @click="downloadFile(previewSrc ?? '')">
					下载
				</el-button>
			</div>
		</div>
	</el-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { ElMessage } from 'element-plus';
import { getFullFileUrl } from '/@/utils/fileUrl';
import {
	getPdfPreviewUrlByFileUrl,
	getExcelPreviewHtml,
	getWordPreviewHtml,
	downloadFile,
} from './util';
const VuePdfEmbed = defineAsyncComponent(() => import('vue-pdf-embed'));
// 是否显示
const visible = ref(false);
// 预览源
const previewSrc = ref<string>();
// 文件类型
const kind = ref('');
// Excel 首张表 HTML（xlsx/xls）
const excelPreviewHtml = ref('');
// Word（docx）HTML（mammoth）
const wordPreviewHtml = ref('');

// 确定文件类型和预览URL
const determineFileAndPreviewUrl = async (src: string, suffixName: string) => {
	excelPreviewHtml.value = '';
	wordPreviewHtml.value = '';
	try {
		if (suffixName === 'pdf') {
			kind.value = 'pdf';
			previewSrc.value = await getPdfPreviewUrlByFileUrl(src);
		} else if (['docx'].includes(suffixName)) {
			kind.value = 'word';
			wordPreviewHtml.value = await getWordPreviewHtml(src);
		} else if (['doc'].includes(suffixName)) {
			kind.value = '';
			ElMessage.warning(
				'暂不支持 .doc 预览，请下载后本地打开或将文件另存为 .docx 后再试'
			);
		} else if (['xlsx', 'xls'].includes(suffixName)) {
			kind.value = 'excel';
			excelPreviewHtml.value = await getExcelPreviewHtml(src);
		} else if (['png', 'jpg', 'jpeg', 'gif'].includes(suffixName)) {
			kind.value = 'image';
		} else if (['mp4', 'webm', 'ogg', 'mov'].includes(suffixName)) {
			kind.value = 'video';
		} else {
			kind.value = '';
		}
	} catch (error) {
		kind.value = '';
		excelPreviewHtml.value = '';
		wordPreviewHtml.value = '';
		ElMessage.error('预览失败，请尝试下载查看');
	}
};

// 关闭对话框
const close = () => {
	excelPreviewHtml.value = '';
	wordPreviewHtml.value = '';
	visible.value = false;
};

// 打开对话框
const show = async (src: string) => {
	visible.value = true;
	// 确定预览源
	previewSrc.value = getFullFileUrl(src);
	// 与 fileUrl.ts 一致：后缀需过滤 URL 查询参数
	const suffixName =
		previewSrc.value.split('.').pop()?.split('?')[0].toLowerCase() ?? '';
	await determineFileAndPreviewUrl(previewSrc.value, suffixName);
};
defineExpose({
	close,
	show,
});
</script>

<style scoped lang="scss">
.file-preview-dialog__wrap {
	display: flex;
	flex-direction: column;
	gap: 8px;
	height: 600px;
}

.file-preview-dialog__pdf {
	width: 100%;
	height: 600px;
	min-height: 0;
	overflow: auto;
	border: none;
	background: var(--el-fill-color-light);

	:deep(.vue-pdf-embed) {
		display: block;
	}
}

.file-preview-dialog__excel {
	width: 100%;
	height: 600px;
	overflow: auto;
	background: var(--el-bg-color);
	padding: 8px;
	font-size: 12px;

	:deep(table) {
		border-collapse: collapse;
		width: 100%;
	}

	:deep(td),
	:deep(th) {
		border: 1px solid var(--el-border-color);
		padding: 4px 8px;
	}

	:deep(.excel-preview-empty) {
		margin: 0;
		padding: 16px;
		color: var(--el-text-color-secondary);
	}
}

.file-preview-dialog__word {
	width: 100%;
	height: 600px;
	overflow: auto;
	background: var(--el-bg-color);
	padding: 12px 16px;
	font-size: 13px;
	line-height: 1.6;

	:deep(img) {
		max-width: 100%;
		height: auto;
	}

	:deep(p) {
		margin: 0 0 0.75em;
	}

	:deep(.word-preview-empty) {
		margin: 0;
		color: var(--el-text-color-secondary);
	}
}

.file-preview-dialog__image {
	max-width: 100%;
	height: 600px;
	object-fit: contain;
	margin: 0 auto;
	display: block;
}

.file-preview-dialog__video {
	width: 100%;
	height: 600px;
}

.file-preview-dialog__toolbar {
	display: flex;
	justify-content: flex-end;
	padding-top: 4px;
}
</style>
