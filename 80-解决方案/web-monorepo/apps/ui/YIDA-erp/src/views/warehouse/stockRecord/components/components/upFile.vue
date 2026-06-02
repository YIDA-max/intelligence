<template>
	<confirm-dialog
		ref="dialogRef"
		title="上传标签"
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
		<el-form
			:model="formData"
			ref="formRef"
			:inline="false"
			label-position="left"
		>
			<el-row class="mb18">
				<el-col :span="24">
					<el-form-item label="箱唛附件">
						<upload-file
							:limit="1"
							:fileSize="20"
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
							:autoUpload="true"
							@change="() => {}"
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
					<el-form-item label="条码附件">
						<upload-file
							:limit="1"
							:fileSize="20"
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
							:autoUpload="true"
							@change="() => {}"
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
				v-if="props.currentInType === 'enter_platform_warehouse'"
			>
				<el-col :span="24">
					<el-form-item label="透明计划标签">
						<upload-file
							:limit="1"
							:fileSize="20"
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
							:autoUpload="true"
							@change="() => {}"
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
					<el-form-item label="其他附件">
						<upload-file
							:limit="1"
							:fileSize="20"
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
							v-model="formData.otherAttachments"
							:isShowTip="false"
							:uploadFileUrl="'/admin/sys-file/upload'"
							type="simple"
							:autoUpload="true"
							@change="() => {}"
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
	width: { type: String, default: '500px' },
	showIcon: { type: Boolean, default: false },
	iconType: { type: String as () => IconType, default: 'info' },
	cancelButtonText: { type: String, default: '取消' },
	confirmButtonText: { type: String, default: '确认' },
	confirmButtonType: { type: String, default: 'primary' },
	currentInType: { type: String, default: 'enter_platform_warehouse' },
});

const emit = defineEmits(['cancel', 'confirm', 'closed']);

const formData = reactive<Record<string, any>>({
	shippingMarkAttachments: [],
	barcodeAttachments: [],
	transparencyAttachments: [],
	otherAttachments: [],
});
const formRef = ref(null);
const dialogRef = ref<InstanceType<typeof ConfirmDialog> | null>(null);

const resetForm = () => {
	formData.shippingMarkAttachments = [];
	formData.barcodeAttachments = [];
	formData.transparencyAttachments = [];
	formData.otherAttachments = [];
};

const handleOpened = () => {
	nextTick(() => resetForm());
};

const handleCancel = () => {
	emit('cancel');
};

const handleConfirm = () => {
	emit('confirm', { ...formData });
};

const handleClosed = () => {
	emit('closed');
};

const show = () => dialogRef.value?.show();
const hide = () => dialogRef.value?.hide();

defineExpose({ show, hide });
</script>
