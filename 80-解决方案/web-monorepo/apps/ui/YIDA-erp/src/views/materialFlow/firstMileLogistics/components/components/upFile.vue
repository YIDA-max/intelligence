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
			:rules="rules"
			label-width="100px"
			:validate-on-rule-change="false"
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
					<el-form-item label="条码附件" prop="barcodeAttachments">
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
			<el-row class="mb18">
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
			<el-row class="mb18">
				<el-col :span="24">
					<el-form-item label="其他" prop="otherAttachments">
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
							v-model="formData.otherAttachments"
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
import { useMessage } from '/@/hooks/message';

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
	// 当前的是入平台仓还是入一件代发仓
	currentInType: {
		type: String,
		default: () => 'enter_platform_warehouse',
	},
	currentRow: {
		type: Object,
		default: () => ({}),
	},
});

const emit = defineEmits(['cancel', 'confirm', 'closed', 'update:modelValue']);

// 表单数据
const formData = reactive<Record<string, any>>({});
const formRef = ref<any>(null);
const dialogRef = ref<InstanceType<typeof ConfirmDialog> | null>(null);
const rules = ref({
	shippingMarkAttachments: [
		{ required: false, message: '请上传箱唛附件', trigger: 'change' },
	],
	barcodeAttachments: [
		{ required: false, message: '请上传条码附件', trigger: 'change' },
	],
	transparencyAttachments: [
		{ required: false, message: '请上传透明计划标签', trigger: 'change' },
	],
});

// 按增值服务动态校验附件（与 secondMile.vue 同口径）
const hasAttachment = (value: any) =>
	Array.isArray(value) ? value.length > 0 : !!value;
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

		// 1) 默认：全部附件非必填
		rules.value.shippingMarkAttachments = [
			{ required: false, message: '请上传箱唛附件', trigger: 'change' },
		];
		rules.value.barcodeAttachments = [
			{ required: false, message: '请上传条码附件', trigger: 'change' },
		];
		rules.value.transparencyAttachments = [
			{ required: false, message: '请上传透明计划标签', trigger: 'change' },
		];

		// 2) 根据增值服务动态设置必填项（direct_label 不校验附件）
		const addedService = Array.isArray(props.currentRow?.addedService)
			? props.currentRow.addedService
			: [];

		if (addedService.length > 0) {
			if (!addedService.includes('direct_label')) {
				rules.value.shippingMarkAttachments = [
					{
						required: addedService.includes('shipping_mark_label'),
						message: '请上传箱唛附件',
						trigger: 'change',
					},
				];
				rules.value.barcodeAttachments = [
					{
						required: addedService.includes('barcode_label'),
						message: '请上传条码附件',
						trigger: 'change',
					},
				];
				rules.value.transparencyAttachments = [
					{
						required: addedService.includes('transparency_label'),
						message: '请上传透明计划标签',
						trigger: 'change',
					},
				];
			}
		} else {
			// 3) 如果当前行没传 addedService，则兼容旧逻辑：入平台仓时箱唛/条码必填
			if (props.currentInType === 'enter_platform_warehouse') {
				rules.value.shippingMarkAttachments = [
					{
						required: true,
						message: '请上传箱唛附件',
						trigger: 'change',
					},
				];
				rules.value.barcodeAttachments = [
					{
						required: true,
						message: '请上传条码附件',
						trigger: 'change',
					},
				];
			}
		}

		if (
			props.currentRow.shippingMarkAttachments ||
			props.currentRow.barcodeAttachments ||
			props.currentRow.transparencyAttachments ||
			props.currentRow.otherAttachments
		) {
			formData.shippingMarkAttachments =
				props.currentRow.shippingMarkAttachments || [];
			formData.barcodeAttachments = props.currentRow.barcodeAttachments || [];
			formData.transparencyAttachments =
				props.currentRow.transparencyAttachments || [];
			formData.otherAttachments = props.currentRow.otherAttachments || [];
		}
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
const handleConfirm = async () => {
	// 增值服务缺失提示（比表单通用提示更贴业务）
	const addedService = Array.isArray(props.currentRow?.addedService)
		? props.currentRow.addedService
		: [];
	if (!addedService.includes('direct_label')) {
		let missingAttachmentType = '';
		if (
			addedService.includes('shipping_mark_label') &&
			!hasAttachment(formData.shippingMarkAttachments)
		) {
			missingAttachmentType = '箱唛';
		} else if (
			addedService.includes('barcode_label') &&
			!hasAttachment(formData.barcodeAttachments)
		) {
			missingAttachmentType = '条码';
		} else if (
			addedService.includes('transparency_label') &&
			!hasAttachment(formData.transparencyAttachments)
		) {
			missingAttachmentType = '透明码';
		}

		if (missingAttachmentType) {
			const deliveryNo = props.currentRow?.deliveryNo;
			useMessage().warning(
				deliveryNo
					? `发货单号 ${deliveryNo} 选择了贴${missingAttachmentType}，请先上传对应附件`
					: `选择了贴${missingAttachmentType}，请先上传对应附件`
			);
			return;
		}
	}

	const valid = await formRef.value.validate();
	if (!valid) {
		useMessage().warning('请上传必须项');
		return;
	}
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
