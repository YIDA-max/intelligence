<template>
	<confirm-dialog
		ref="dialogRef"
		:title="title"
		:message="message"
		:show-icon="showIcon"
		:icon-type="iconType"
		:cancel-button-text="cancelButtonText"
		:confirm-button-text="confirmButtonText"
		:confirm-button-type="confirmButtonType"
		:width="width"
		@cancel="handleCancel"
		@confirm="handleConfirm"
		@closed="handleClosed"
		@opened="handleOpened"
	>
		{{ message }}
		<el-form :model="formData" ref="formRef" :inline="false" label-position="left">
			<el-form-item :label="dateLabel" :prop="dateProp">
				<el-date-picker
					v-model="formData[dateProp]"
					:type="dateType"
					:placeholder="datePlaceholder"
					style="width: 100%"
					:value-format="valueFormat"
				/>
			</el-form-item>
		</el-form>
		<slot></slot>
	</confirm-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, defineProps, defineEmits, watch, nextTick } from 'vue';
import ConfirmDialog, { IconType } from './index.vue';

const props = defineProps({
	// 基础配置
	title: {
		type: String,
		default: '提示',
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
	// 日期选择器配置
	dateLabel: {
		type: String,
		default: '',
	},
	dateProp: {
		type: String,
		default: 'date',
	},
	datePlaceholder: {
		type: String,
		default: '请选择日期',
	},
	dateType: {
		type: String,
		default: 'date', // date, datetime, month, year
	},
	valueFormat: {
		type: String,
		default: 'YYYY-MM-DD', // date, datetime, month, year
	},
	// 初始值
	modelValue: {
		type: [String, Date],
		default: '',
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
	// 设置新的初始值
	formData[props.dateProp] = props.modelValue;
};

// 监听表单值变化
watch(
	() => formData[props.dateProp],
	(newVal) => {
		emit('update:modelValue', newVal);
	}
);

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
	emit('cancel');
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
