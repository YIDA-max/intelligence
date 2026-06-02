<template>
	<el-dialog
		v-model="visible"
		title="财务审核"
		width="60%"
		:close-on-click-modal="false"
		@close="close"
	>
		<el-table :data="auditData" border :height="400">
			<el-table-column label="申请单号" width="150">
				<template #default="{ row }">
					<span>{{ row.applyOrderNo }}</span>
				</template>
			</el-table-column>
			<el-table-column label="请款单号" width="150">
				<template #default="{ row }">
					<span>{{ row.paymentRequestNo }}</span>
				</template>
			</el-table-column>
			<el-table-column label="费用项" width="150">
				<template #default="{ row }">
					<span>{{ row.costItem }}</span>
				</template>
			</el-table-column>
			<el-table-column label="应付对象类型" width="150">
				<template #default="{ row }">
					<span>{{ row.payableObject }}</span>
				</template>
			</el-table-column>
			<el-table-column label="申请人员" width="150">
				<template #default="{ row }">
					<span>{{ row.applicantId }}</span>
				</template>
			</el-table-column>
		</el-table>
		<el-form :model="form" class="mt20" ref="formRef">
			<el-form-item label="" prop="remark">
				<el-input
					v-model="form.remark"
					type="textarea"
					:rows="4"
					placeholder="审核备注，驳回必填"
				/>
			</el-form-item>
		</el-form>
		<template #footer>
			<el-button @click="handleSubmit(false)">审核驳回</el-button>
			<el-button type="primary" @click="handleSubmit(true)">审核通过</el-button>
		</template>
	</el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import type { FormInstance } from 'element-plus';
import { ElMessage } from 'element-plus';

interface IAuditData {
	applyOrderNo?: string;
	paymentRequestNo?: string;
	costItem?: string;
	payableObject?: string;
	applicant?: string;
}

interface Emits {
	(e: 'confirm', passed: boolean, remark: string): void;
}

const emit = defineEmits<Emits>();

const visible = ref(false);
const formRef = ref<FormInstance>();
const auditData = ref<IAuditData>({});
const form = reactive({
	remark: '',
});

/**
 * 打开弹窗
 */
const open = (data: IAuditData) => {
	Object.assign(auditData.value, data);
	visible.value = true;
};

/**
 * 关闭弹窗
 */
const close = () => {
	visible.value = false;
	form.remark = '';
	formRef.value?.resetFields();
	Object.keys(auditData.value).forEach((key) => {
		delete auditData.value[key as keyof IAuditData];
	});
};

/**
 * 提交审核
 */
const handleSubmit = async (passed: boolean) => {
	if (!formRef.value) return;
	if (!passed && !form.remark) {
		ElMessage.error('驳回时审核备注不能为空');
		return;
	}
	await formRef.value.validate((valid) => {
		if (valid) {
			emit('confirm', passed, form.remark);
			close();
		}
	});
};

defineExpose({
	open,
	close,
});
</script>

<style lang="scss" scoped>
.audit-info {
	padding: 20px;
	background-color: #f5f7fa;
	border-radius: 4px;

	.info-row {
		display: flex;
		margin-bottom: 12px;
		font-size: 14px;

		&:last-child {
			margin-bottom: 0;
		}

		.label {
			font-weight: 500;
			color: #606266;
			min-width: 120px;
		}

		span:not(.label) {
			color: #303133;
		}
	}
}

.mt20 {
	margin-top: 20px;
}
</style>
