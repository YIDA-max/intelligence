<template>
	<el-dialog :title="props.title" v-model="visible" width="400px" :close-on-click-modal="false" :close-on-press-escape="false" class="error-dialog">
		<div class="error-dialog-content">
			<div class="error-icon">
				<el-icon class="warning-icon"><warning-filled /></el-icon>
				<span>错误提醒</span>
			</div>
			<div class="error-message">{{ message }}</div>
			<div class="error-list" v-if="props.errorList.length > 0">
				<div v-for="(item, index) in props.errorList" :key="index" class="error-item">{{ item }}</div>
				<div v-if="props.errorList.length > 3" class="error-item">...</div>
			</div>
		</div>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="handleClose">{{ props.closeText }}</el-button>
			</span>
		</template>
	</el-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { WarningFilled } from '@element-plus/icons-vue';

interface Props {
	title?: string;
	message?: string;
	errorList?: string[];
	closeText?: string;
}

const props = withDefaults(defineProps<Props>(), {
	title: '',
	message: '',
	errorList: () => [],
	closeText: '关闭',
});

const visible = ref(false);
const emit = defineEmits(['close']);

const handleClose = () => {
	visible.value = false;
	emit('close');
};

const show = () => {
	visible.value = true;
};

const hide = () => {
	visible.value = false;
};

defineExpose({
	show,
	hide,
});
</script>

<style lang="scss" scoped>
.error-dialog {
	:deep(.el-dialog__body) {
		padding-top: 10px;
	}
}

.error-dialog-content {
	.error-icon {
		margin-bottom: 16px;
		display: flex;
		align-items: center;
		gap: 10px;

		.warning-icon {
			font-size: 24px;
			color: #f56c6c;
		}
	}

	.error-message {
		margin-bottom: 16px;
		color: #333;
		font-size: 14px;
	}

	.error-list {
		background-color: #f2f2f2;
		padding: 12px 16px;
		border-radius: 4px;
		max-height: 300px;
		overflow-y: auto;

		.error-item {
			line-height: 24px;
			color: #666;
			font-size: 14px;
		}
	}
}
</style>
