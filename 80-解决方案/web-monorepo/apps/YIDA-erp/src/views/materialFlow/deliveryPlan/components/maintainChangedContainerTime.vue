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
		<el-form :model="formData" ref="formRef" label-width="80px" :rules="rules">
			<el-form-item
				label="变更后预计装柜时间"
				prop="changedEstimatedLoadingTime"
				label-width="150px"
			>
				<el-date-picker
					v-model="formData.changedEstimatedLoadingTime"
					type="datetime"
					clearable
					value-format="YYYY-MM-DD HH:mm:ss"
					placeholder="年/月/日"
				/>
			</el-form-item>
		</el-form>
	</confirm-dialog>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue';
import { useI18n } from 'vue-i18n';
import ConfirmDialog, { IconType } from '/@/components/ConfirmDialog/index.vue';
import { postMaintainChangedContainerTime } from '/@/api/materialFlow/deliveryPlan/index';
import { useMessage } from '/@/hooks/message';
import { useResultDialog } from '/@/hooks/useResultDialog';

const dialogRef = ref<InstanceType<typeof ConfirmDialog> | null>(null);

const props = defineProps({
	// 基础配置
	title: {
		type: String,
		default: '维护变更后预计装柜时间',
	},
	message: {
		type: String,
		default: '',
	},
	width: {
		type: String,
		default: '600px',
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
	// 当前选中的行
	selectedRows: {
		type: Array,
		default: () => [],
	},
});

const { t } = useI18n();
const { open } = useResultDialog();

const emit = defineEmits(['cancel', 'confirm', 'closed']);

// 表单数据
const formData = ref({
	changedEstimatedLoadingTime: '',
});
const formRef = ref<any>(null);
// 表单校验
const rules = ref({
	changedEstimatedLoadingTime: [
		{ required: true, message: '变更后预计装柜时间不能为空', trigger: 'blur' },
	],
});

// 初始化表单数据
const initFormData = () => {
	formData.value.changedEstimatedLoadingTime = '';
};

/**
 * 弹窗打开时的处理函数
 */
const handleOpened = () => {
	nextTick(() => {
		initFormData();
		if (formRef.value) {
			formRef.value.clearValidate();
		}
	});
};

/**
 * 取消操作处理函数
 */
const handleCancel = () => {
	emit('cancel');
};

/**
 * 确认操作处理函数
 */
const handleConfirm = async () => {
	await formRef.value.validate();
	const ids = props.selectedRows.map((item: any) => item.id);
	const res: any = await postMaintainChangedContainerTime({
		ids,
		changedEstimatedLoadingTime: formData.value.changedEstimatedLoadingTime,
	});
	if (res?.code === 0) {
		if (res?.data?.failCount > 0) {
			open({
				title: t('错误提示'),
				data: res.data,
			});
		} else {
			useMessage().success(t('添加成功'));
		}
		emit('confirm', { ...formData.value });
	}
};

/**
 * 弹窗关闭后的回调
 */
const handleClosed = () => {
	emit('closed');
};

/**
 * 打开弹窗方法
 */
const show = () => {
	if (dialogRef.value) {
		dialogRef.value.show();
	}
};

/**
 * 关闭弹窗方法
 */
const hide = () => {
	if (dialogRef.value) {
		dialogRef.value.hide();
	}
};

defineExpose({
	show,
	hide,
});
</script>
