<template>
	<el-dialog
		class="qy-confirm-dialog"
		draggable
		v-model="dialogVisible"
		:width="width"
		:close-on-click-modal="false"
		:close-on-press-escape="false"
		@closed="handleClosed"
		@opened="emit('opened')"
	>
		<!-- 头部插槽 -->
		<template #header>
			<div class="dialog-header">
				<el-icon :class="['dialog-icon', iconClass]" :size="24" v-if="showIcon">
					<component :is="icon" />
				</el-icon>
				<div class="dialog-title">
					{{ title }}
				</div>
			</div>
		</template>
		<div class="confirm-dialog-content">
			<!-- 内容插槽 -->
			<slot></slot>
		</div>

		<!-- 底部按钮插槽 -->
		<template #footer>
			<slot name="footer">
				<span class="dialog-footer">
					<el-button @click="handleCancel" v-if="showCancelButton">{{
						cancelButtonText
					}}</el-button>
					<el-button
						:type="confirmButtonType"
						@click="handleConfirm"
						v-if="showConfirmButton"
						:disabled="props.disabled"
					>
						{{ confirmButtonText }}</el-button
					>
				</span>
			</slot>
		</template>
	</el-dialog>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, computed, ref } from 'vue';
import {
	InfoFilled,
	WarningFilled,
	CircleCheckFilled,
	CircleCloseFilled,
} from '@element-plus/icons-vue';

// 定义图标类型
export type IconType = 'info' | 'warning' | 'success' | 'error' | 'warn';

const props = defineProps({
	// 基础配置
	title: {
		type: String,
		default: '提示',
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
	// 是否显示按钮
	showCancelButton: {
		type: Boolean,
		default: true,
	},
	showConfirmButton: {
		type: Boolean,
		default: true,
	},
	disabled: {
		type: Boolean,
		default: false,
	},
});

const emit = defineEmits(['cancel', 'confirm', 'closed', 'opened']);

// 弹窗显示状态 - 完全由组件内部控制
const dialogVisible = ref(false);

// 根据iconType确定使用的图标组件
const icon = computed(() => {
	const iconMap = {
		info: InfoFilled,
		warning: WarningFilled,
		success: CircleCheckFilled,
		error: CircleCloseFilled,
		warn: WarningFilled,
	};

	return iconMap[props.iconType as keyof typeof iconMap] || InfoFilled;
});

// 根据iconType设置图标颜色类
const iconClass = computed(() => {
	const iconClassMap = {
		info: 'icon-info',
		warning: 'icon-warning',
		success: 'icon-success',
		error: 'icon-error',
		warn: 'icon-warn',
	};

	return (
		iconClassMap[props.iconType as keyof typeof iconClassMap] || 'icon-info'
	);
});

/**
 * 取消操作处理函数
 * 关闭弹窗并触发cancel事件
 */
const handleCancel = () => {
	emit('cancel');
};

/**
 * 确认操作处理函数
 * 触发confirm事件
 */
const handleConfirm = () => {
	emit('confirm');
};

/**
 * 弹窗关闭后的回调
 * 触发closed事件
 */
const handleClosed = () => {
	emit('closed');
};

/**
 * 打开弹窗方法
 * 供父组件调用
 */
const show = () => {
	dialogVisible.value = true;
};

/**
 * 关闭弹窗方法
 * 供父组件调用
 */
const hide = () => {
	dialogVisible.value = false;
};

defineExpose({
	show,
	hide,
	handleClosed,
});
</script>

<style lang="scss" scoped>
.dialog-header {
	display: flex;
	align-items: center;

	.dialog-icon {
		margin-right: 10px;

		&.icon-info {
			color: #409eff;
		}

		&.icon-warning {
			color: #e6a23c;
		}

		&.icon-success {
			color: #67c23a;
		}

		&.icon-error {
			color: #f56c6c;
		}

		&.icon-warn {
			color: #f56c6c;
		}
	}

	.dialog-title {
		font-size: 16px;
		font-weight: 500;
	}
}
.confirm-dialog-content {
	font-size: 16px;
	padding: 0 20px;
}

/* 让 scoped 样式能够作用到 Teleport 渲染的元素上。 */
:global(.qy-confirm-dialog .el-dialog__header) {
	padding-bottom: 0 !important;
}

::deep(.el-dialog__footer) {
	padding: 15px 20px;
	border-top: 1px solid #ebeef5;
}
</style>
