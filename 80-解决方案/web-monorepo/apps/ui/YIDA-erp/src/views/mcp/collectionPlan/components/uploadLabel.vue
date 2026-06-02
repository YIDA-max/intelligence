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
			<el-row>
				<el-col :span="24">
					<el-form-item prop="shipmentLabelFileUrl">
						<upload-file
							:limit="1001"
							:fileSize="200"
							@change="() => {}"
							ref="uploadFileRef"
							:fileType="['pdf', 'jpg', 'png', 'zip']"
							v-model="formData.shipmentLabelFileUrl"
							:isShowTip="false"
							:uploadFileUrl="'/admin/sys-file/upload'"
							type="default"
							:data="{}"
							:dir="''"
							:autoUpload="true"
							:disabled="false"
							:uploadTips="uploadTips"
							validationType="replaceByZip"
							showProgressDialog
							:archiveFileSize="20"
							:showFileList="false"
							@error="() => {}"
							@remove="() => {}"
							@preview="() => {}"
							@exceed="() => {}"
							@success="() => {}"
						>
						</upload-file>
					</el-form-item>
				</el-col>
			</el-row>
			<div class="el-upload__tip" v-if="true">
				<div class="bg-[#dee8fc] py-[20px] px-[10px] rounded-lg">
					<div
						class="flex items-center"
						v-for="(tip, index) of props.uploadTips"
						:key="index"
					>
						<div class="circle"></div>
						<div>{{ tip }}</div>
					</div>
				</div>
				<div class="flex items-center mt10">
					<div class="ml10" v-if="showExpandTip" style="color: #eb4d65">
						{{ props.showExpandTip }}
					</div>
				</div>
			</div>
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
		default: '上传货件标签',
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
	uploadTips: {
		type: Array,
		default: () => [
			'附件命名必须为【提货单号-箱唛附件，提货单号-条码附件，提货单号-透明标签】格式,如：TG202604280001-箱唛附件',
			'必须一次性上传完成，箱唛、条码必传,透明标签非必传',
			'仅支持PDF、PNG、JPG格式附件',
		],
	},
	// 下载模板旁提示信息
	showExpandTip: { type: String, default: '' },
});

const emit = defineEmits(['cancel', 'confirm', 'closed', 'update:modelValue']);

type UploadFieldItem = string | Record<string, any>;
type UploadFieldValue = UploadFieldItem[] | string | null | undefined;

const uploadFieldKeys = ['shipmentLabelFileUrl'] as const;

const tripleFieldMap: Record<(typeof uploadFieldKeys)[number], string> = {
	shipmentLabelFileUrl: 'labelingPhotoFileTriple',
};

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
	uploadFieldKeys.forEach((key) => {
		formData[key] = [];
	});
};

// 回显值统一成 upload-file 可识别的数组
const normalizeUploadField = (value: UploadFieldValue): UploadFieldItem[] => {
	if (Array.isArray(value)) {
		return value.map((item) =>
			item && typeof item === 'object' ? { ...item } : item
		);
	}
	if (typeof value === 'string') {
		const trimmed = value.trim();
		if (!trimmed) return [];
		if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
			try {
				const parsed = JSON.parse(trimmed);
				return Array.isArray(parsed) ? normalizeUploadField(parsed) : [];
			} catch (error) {
				return [];
			}
		}
		return trimmed.includes(',')
			? trimmed.split(',').filter(Boolean)
			: [trimmed];
	}
	return [];
};

// 兼容对象数组/字符串数组，最终统一提交为加密文件名数组
const serializeUploadField = (value: UploadFieldValue): string[] => {
	const list = normalizeUploadField(value);
	return list
		.map((item) => {
			if (typeof item === 'string') return item;
			return (
				item?.encryptedFileName ||
				item?.fileName ||
				item?.code ||
				item?.name ||
				''
			);
		})
		.filter((item): item is string => !!item);
};

// 根据 currentRow 回显附件数据，优先使用 xxxTriple（包含原文件名，展示更友好）
const fillFormDataFromCurrentRow = () => {
	const row = props.currentRow || {};
	uploadFieldKeys.forEach((key) => {
		const tripleValue = row[tripleFieldMap[key]];
		const rawValue = row[key];
		formData[key] = normalizeUploadField(tripleValue ?? rawValue);
	});
};
const uploadFileRef = ref();
/**
 * 弹窗打开时的处理函数
 * 确保数据被正确初始化
 */
const handleOpened = () => {
	// 弹窗完全打开后，确保数据初始化
	nextTick(() => {
		initFormData();
		uploadFileRef.value.initLoading();
		fillFormDataFromCurrentRow();
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
	emit('confirm', {
		...formData,
		shipmentLabelFileUrl: serializeUploadField(formData.shipmentLabelFileUrl),
	});
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
