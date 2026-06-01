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
			<el-form-item label="物流人员" prop="logisticsUserId">
				<SelectInputApi
					componentType="userList"
					v-model="formData.logisticsUserId"
					:settings="{
						text: '下拉单选，所有头程物流专员',
						getTreeData: pageList,
						getTreeDataParams: {
							deptIds: 54, //54对应的是头程物流组的部门id
							size: 10000,
							current: 1,
						},
						selectTreeProps: {
							value: 'userId',
							label: 'name',
						},
						getIdsCode: 'userId',
					}"
				/>
			</el-form-item>
		</el-form>
	</confirm-dialog>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue';
import { useI18n } from 'vue-i18n';
import ConfirmDialog, { IconType } from '/@/components/ConfirmDialog/index.vue';
import { postMaintainLogisticsStaff } from '/@/api/materialFlow/deliveryPlan/index';
import { pageList } from '/@/api/admin/user';
import { useMessage } from '/@/hooks/message';
const SelectInputApi = defineAsyncComponent(
	() => import('/@/componentsApi/SelectInputApi/index.vue')
);
const dialogRef = ref<InstanceType<typeof ConfirmDialog> | null>(null);

const props = defineProps({
	// 基础配置
	title: {
		type: String,
		default: '维护物流人员',
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

const emit = defineEmits(['cancel', 'confirm', 'closed']);

// 表单数据
const formData = ref({
	logisticsUserId: '',
});
const formRef = ref<any>(null);
// 表单校验
const rules = ref({
	logisticsUserId: [
		{ required: true, message: '物流人员不能为空', trigger: 'blur' },
	],
});

// 初始化表单数据
const initFormData = () => {
	formData.value.logisticsUserId = '';
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
	const res = await postMaintainLogisticsStaff({
		ids,
		logisticsUserId: formData.value.logisticsUserId,
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
