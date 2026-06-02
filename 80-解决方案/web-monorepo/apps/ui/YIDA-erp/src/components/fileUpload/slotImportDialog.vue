<template>
	<el-dialog
		title="文件导入"
		v-model="dialogVisible"
		:close-on-click-modal="false"
		draggable
	>
		<!-- Configurable Form -->
		<el-form
			class="mb10"
			ref="formRef"
			:model="model"
			:rules="formRules"
			:label-width="labelWidth"
		>
			<el-row :gutter="20" class="mb10">
				<el-col
					:span="item.span || 12"
					class="mb10"
					v-for="(item, i) in formItems"
					:key="i"
				>
					<el-form-item :label="item.label" :prop="item.prop">
						<!-- Custom Slot -->
						<slot
							v-if="item.slotName"
							:name="item.slotName"
							:model="model"
							:item="item"
						></slot>
						<!-- Select Component -->
						<el-select
							v-else-if="item.type === 'select'"
							v-model="model[item.prop]"
							clearable
							filterable
							:placeholder="item.placeholder || `请选择${item.label}`"
							style="width: 100%"
							@change="(value: any) => handleFieldChange(item, value)"
						>
							<el-option
								v-for="option in item.options || []"
								:key="option[item.optionValue || 'value']"
								:label="option[item.optionLabel || 'label']"
								:value="option[item.optionValue || 'value']"
							/>
						</el-select>
					</el-form-item>
				</el-col>
			</el-row>
		</el-form>

		<slot name="form" :model="model"></slot>
		<!-- File Uploader -->
		<FileUploader
			ref="uploaderRef"
			v-model="uploadedFile"
			:autoUpload="false"
			:drag="drag"
			tipText="支持Excel和压缩文件格式"
			:extraData="model"
			@success="handleSuccess"
			@error="handleError"
			@progress="onUploadProgress"
			:excelUploadApi="excelUploadApi"
			:imageUploadApi="imageUploadApi"
			:archiveUploadApi="archiveUploadApi"
			:listType="listType"
			:buttonType="buttonType"
			:uploadText="uploadText"
			:showTip="showTip"
			:accept="accept"
			:templateUrl="templateUrl"
			:uploadTips="uploadTips"
			:showExpandTip="showExpandTip"
			@downloadTemplate="downloadTemplate"
			:useProgressDialog="useProgressDialog"
		/>

		<template #footer>
			<el-button @click="onCancel">{{
				$t('common.cancelButtonText')
			}}</el-button>
			<el-button type="primary" @click="submitFileForm">{{
				$t('导入')
			}}</el-button>
		</template>
	</el-dialog>
</template>

<script setup lang="ts">
import { ref, computed, type PropType } from 'vue';
import type { FormInstance, FormRules } from 'element-plus';
import FileUploader from '/@/components/fileUpload/index.vue';
import type { FormItem } from './types';
import { useMessage } from '/@/hooks/message';

const emit = defineEmits([
	'update:modelValue',
	'refreshDataList',
	'downloadTemplate',
	'progress',
]);

const props = defineProps({
	modelValue: {
		type: Object as PropType<Record<string, any>>,
		required: true,
	},
	formItems: {
		type: Array as PropType<FormItem[]>,
		default: () => [],
	},
	formRules: {
		type: Object as PropType<FormRules>,
		default: () => ({} as FormRules),
	},
	labelWidth: { type: String, default: '80px' },
	accept: { type: String, default: '' },
	drag: { type: Boolean, default: true },
	listType: { type: String, default: '' },
	buttonType: { type: String, default: 'primary' },
	uploadText: { type: String, default: '' },
	showTip: { type: Boolean, default: true },
	templateUrl: { type: String, default: '' },
	downLoadTemplateName: { type: String, default: 'template' },
	excelUploadApi: { type: String, default: '/product/sku/import' },
	imageUploadApi: { type: String, default: '' },
	archiveUploadApi: { type: String, default: '' },
	uploadTips: {
		type: Array as PropType<string[]>,
		default: () => [
			'建议每次导入都使用最新的导入模板，避免出现不必要的错误',
			'仅支持xls/xlsx格式',
			'同一个记录代码存在多条记录时，以第一条为准',
		],
	},
	showExpandTip: { type: String, default: '' },
	// 是否在上传时展示进度弹窗
	useProgressDialog: { type: Boolean, default: true },
});

const dialogVisible = ref(false);
const uploadedFile = ref<any>(null);
const uploaderRef = ref<any>(null);
const formRef = ref<FormInstance | null>(null);

// Computed property to proxy v-model
const model = computed({
	get: () => props.modelValue,
	set: (value) => {
		emit('update:modelValue', value);
	},
});

// Handle field changes and trigger onChange callback if provided
const handleFieldChange = (item: FormItem, value: any) => {
	if (item.onChange) {
		item.onChange(value, model.value);
	}
};

// 提交上传
const submitFileForm = async () => {
	formRef.value?.validate((valid) => {
		// 检查表单验证是否通过
		if (!valid) {
			useMessage().error('请填写完整表单');
			return;
		}

		// 检查是否有上传文件
		// uploadedFile 在文件选择时（handleFileChange）就会被更新
		const hasFile = !!uploadedFile.value;
		if (!hasFile) {
			useMessage().error('请上传文件');
			return;
		}

		// 验证通过且有文件，提交上传
		uploaderRef.value?.submitUpload?.();
		// 打开进度弹窗（如果启用且 uploader 提供接口）
		if (props.useProgressDialog) {
			uploaderRef.value?.openProgressDialog?.();
		}
	});
};

// 上传进度事件（可选处理）
const onUploadProgress = (response: any, file: any) => {
	emit('progress', response, file);
};

// 上传成功回调
const handleSuccess = () => {
	dialogVisible.value = false;
	emit('refreshDataList');
};

// 上传出错回调 由父组件决定是否弹窗，slotImportDialog 这里关闭进度窗并打开错误窗以展示错误信息（如果有）
const handleError = () => {
	// 关闭进度弹窗（如果有）
	if (props.useProgressDialog) {
		uploaderRef.value?.closeProgressDialog?.();
	}
	emit('refreshDataList');
};

// 打开弹窗
const show = () => {
	dialogVisible.value = true;
	uploadedFile.value = null;
	uploaderRef.value?.clearFiles?.();
	formRef.value?.resetFields?.();
};

// 取消/关闭
const onCancel = () => {
	dialogVisible.value = false;
};

const downloadTemplate = () => {
	emit('downloadTemplate');
};
// 对外暴露 show 方法和 uploader 控制（父组件可以通过 ref 调用）
defineExpose({
	show,
	uploaderRef,
});
</script>

<style scoped></style>
