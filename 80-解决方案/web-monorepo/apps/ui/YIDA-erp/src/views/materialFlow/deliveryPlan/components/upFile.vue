<template>
	<confirm-dialog
		ref="dialogRef"
		:title="props.title"
		:message="props.message"
		:show-icon="props.showIcon"
		:icon-type="props.iconType"
		:cancel-button-text="props.cancelButtonText"
		:confirm-button-text="props.confirmButtonText"
		:confirm-button-type="props.confirmButtonType"
		:width="props.width"
		@cancel="handleCancel"
		@confirm="handleConfirm"
		@closed="handleClosed"
		@opened="handleOpened"
	>
		{{ message }}
		<el-form
			:model="formData"
			ref="formRef"
			:inline="false"
			label-position="left"
		>
			<el-row class="mb18">
				<el-col :span="24">
					<el-form-item label="箱唛附件" prop="shippingMarkAttachments">
						<upload-file
							:limit="1"
							:fileSize="20"
							@change="() => {}"
							:fileType="[
								'zip',
								'pdf',
								'xlsx',
								'xls',
								'doc',
								'docx',
								'jpg',
								'png',
							]"
							v-model="formData.shippingMarkAttachments"
							:isShowTip="false"
							:uploadFileUrl="'/admin/sys-file/upload'"
							type="simple"
							:data="{}"
							:dir="''"
							:autoUpload="true"
							:disabled="false"
							@error="() => {}"
							@remove="() => {}"
							@preview="() => {}"
							@exceed="() => {}"
							@success="() => {}"
						/>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row class="mb18">
				<el-col :span="24">
					<el-form-item label="条码" prop="barcodeAttachments">
						<upload-file
							:limit="1"
							:fileSize="20"
							@change="() => {}"
							:fileType="[
								'zip',
								'pdf',
								'xlsx',
								'xls',
								'doc',
								'docx',
								'jpg',
								'png',
							]"
							v-model="formData.barcodeAttachments"
							:isShowTip="false"
							:uploadFileUrl="'/admin/sys-file/upload'"
							type="simple"
							:data="{}"
							:dir="''"
							:autoUpload="true"
							:disabled="false"
							@error="() => {}"
							@remove="() => {}"
							@preview="() => {}"
							@exceed="() => {}"
							@success="() => {}"
						/>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row
				class="mb18"
				v-if="props.currentRow?.platformChannelCode === 'Amazon'"
			>
				<el-col :span="24">
					<el-form-item label="透明计划标签" prop="transparencyAttachments">
						<upload-file
							:limit="1"
							:fileSize="20"
							@change="() => {}"
							:fileType="[
								'zip',
								'pdf',
								'xlsx',
								'xls',
								'doc',
								'docx',
								'jpg',
								'png',
							]"
							v-model="formData.transparencyAttachments"
							:isShowTip="false"
							:uploadFileUrl="'/admin/sys-file/upload'"
							type="simple"
							:data="{}"
							:dir="''"
							:autoUpload="true"
							:disabled="false"
							@error="() => {}"
							@remove="() => {}"
							@preview="() => {}"
							@exceed="() => {}"
							@success="() => {}"
						/>
					</el-form-item>
				</el-col>
			</el-row>
		</el-form>
	</confirm-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, nextTick } from 'vue';
import ConfirmDialog, { IconType } from '/@/components/ConfirmDialog/index.vue';

const props = defineProps({
	// 基础配置
	title: {
		type: String,
		default: '上传标签',
	},
	message: {
		type: String,
		default: '',
	},
	width: {
		type: String,
		default: '500px',
	},
	// 图标配置
	showIcon: {
		type: Boolean,
		default: false,
	},
	iconType: {
		type: String as () => IconType,
		default: 'info',
	},
	// 按钮配置
	cancelButtonText: {
		type: String,
		default: '取消',
	},
	confirmButtonText: {
		type: String,
		default: '确认',
	},
	confirmButtonType: {
		type: String,
		default: 'primary',
	},
	// 输入框配置
	inputLabel: {
		type: String,
		default: '',
	},
	inputPlaceholder: {
		type: String,
		default: '请输入',
	},
	inputType: {
		type: String,
		default: 'text', // text, textarea
	},
	inputRows: {
		type: Number,
		default: 4,
	},
	// 初始值
	modelValue: {
		type: [String, Number],
		default: '',
	},
	// 当前行数据
	currentRow: {
		type: Object,
		default: () => ({}),
	},
});

const emit = defineEmits(['cancel', 'confirm', 'closed', 'update:modelValue']);

// 表单数据
const formData = reactive<Record<string, any>>({});
const formRef = ref(null);
const dialogRef = ref<InstanceType<typeof ConfirmDialog> | null>(null);

// 初始化表单数据
const initFormData = () => {
	// 清空之前的数据
	Object.keys(formData).forEach((key) => {
		delete formData[key];
	});
};

/**
 * 弹窗打开时的处理函数
 * 确保数据被正确初始化
 */
const handleOpened = () => {
	// 弹窗完全打开后，确保数据初始化
	nextTick(() => {
		initFormData();
	});
};

/**
 * 取消操作处理函数
 */
const handleCancel = () => {
	emit('cancel', { ...formData });
};

/**
 * 确认操作处理函数
 */
const handleConfirm = () => {
	emit('confirm', { ...formData });
};

/**
 * 弹窗关闭后的回调
 */
const handleClosed = () => {
	emit('closed');
};

/**
 * 打开弹窗方法
 * 供父组件调用
 */
const show = () => {
	if (dialogRef.value) {
		dialogRef.value.show();
	}
};

/**
 * 关闭弹窗方法
 * 供父组件调用
 */
const hide = () => {
	if (dialogRef.value) {
		dialogRef.value.hide();
	}
};

// 暴露方法给父组件
defineExpose({
	show,
	hide,
	initFormData,
});
</script>
