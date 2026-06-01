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
			<el-form-item label="备注" prop="remark">
				<el-input
					v-model="formData.remark"
					type="textarea"
					:rows="4"
					placeholder="请输入备注"
					maxlength="200"
					show-word-limit
				/>
			</el-form-item>
		</el-form>
	</confirm-dialog>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue';
import { useI18n } from 'vue-i18n';
import ConfirmDialog, { IconType } from '/@/components/ConfirmDialog/index.vue';
import { postUpdateLogisticsRemark } from '/@/api/materialFlow/deliveryPlan/index';

import { useMessage } from '/@/hooks/message';

const dialogRef = ref<InstanceType<typeof ConfirmDialog> | null>(null);

const props = defineProps({
	// 基础配置
	title: {
		type: String,
		default: '批量备注',
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
	// 当前选中的行
	selectedRows: {
		type: Array,
		default: () => [],
	},
});

const { t } = useI18n();

const emit = defineEmits(['cancel', 'confirm', 'closed']);

// 表单数据
const formData = ref({
	remark: '',
});
const formRef = ref<any>(null);
// 表单校验
const rules = ref({
	remark: [{ required: true, message: '备注不能为空', trigger: 'blur' }],
});

// 初始化表单数据
const initFormData = () => {
	formData.value.remark = '';
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
	const res = await postUpdateLogisticsRemark({
		ids,
		remark: formData.value.remark,
	});
	if (res?.code === 0) {
		useMessage().success(t('添加成功'));
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
