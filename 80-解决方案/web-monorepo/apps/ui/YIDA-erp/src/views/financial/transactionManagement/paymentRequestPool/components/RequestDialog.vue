<template>
	<el-dialog
		v-model="visible"
		title="请款信息"
		width="900px"
		:close-on-click-modal="false"
		@open="initForm"
		@close="handleClose"
	>
		<el-form :model="formData" label-width="110px" ref="formRef" :rules="rules">
			<!-- 基础信息 -->
			<div class="section-title">基础信息</div>
			<div class="section-block">
				<el-form-item label="紧急程度" prop="urgencyLevel">
					<SelectInputApi
						v-model="formData.urgencyLevel"
						componentType="dicts"
						getTreeDataParams="urgency_level"
						text="紧急程度"
					/>
				</el-form-item>
				<el-form-item label="期望付款日期" prop="expectedPaymentDate">
					<el-date-picker
						v-model="formData.expectedPaymentDate"
						type="date"
						placeholder="请选择期望付款日期"
						value-format="YYYY-MM-DD"
					/>
				</el-form-item>
			</div>

			<!-- 财务信息 -->
			<div class="section-title">财务信息</div>
			<div class="section-block">
				<el-form-item label="收款类型" prop="collectionType">
					<SelectInputApi
						v-model="formData.collectionType"
						componentType="dicts"
						getTreeDataParams="receipt_type"
						text="收款类型"
					/>
				</el-form-item>
				<el-form-item label="付款方式" prop="paymentMethod">
					<SelectInputApi
						v-model="formData.paymentMethod"
						componentType="dicts"
						getTreeDataParams="accountsReceiptType"
						text="付款方式"
					/>
				</el-form-item>
			</div>

			<!-- 明细信息 -->
			<div class="section-title">明细信息</div>
			<el-table :data="formData.details" border class="detail-table">
				<el-table-column label="业务源单信息" min-width="160">
					<template #default="{ row }">
						{{ row.orderInfo }}
					</template>
				</el-table-column>
				<el-table-column label="可请金额" prop width="150">
					<template #default="{ row }">
						{{ row.requestableAmount }}
					</template>
				</el-table-column>
				<el-table-column label="本次申请金额" width="150">
					<template #default="{ row }">
						{{ row.requestableAmount }}
					</template>
				</el-table-column>
				<el-table-column label="备注" min-width="140">
					<template #default="{ row }">
						<el-input v-model="row.remark" placeholder="请输入备注" />
					</template>
				</el-table-column>
				<el-table-column label="附件" min-width="200">
					<template #default="{ row }">
						<upload-file
							v-model="row.attachmentUrls"
							:limit="10"
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
							:uploadFileUrl="'/admin/sys-file/upload'"
							type="simple"
							:autoUpload="true"
						/>
					</template>
				</el-table-column>
			</el-table>
		</el-form>

		<template #footer>
			<el-button @click="handleClose">取消</el-button>
			<el-button :loading="loading" @click="handleSubmit('save')"
				>保存</el-button
			>
			<el-button
				type="primary"
				:loading="loading"
				@click="handleSubmit('confirm')"
				>确认</el-button
			>
		</template>
	</el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, computed, defineAsyncComponent } from 'vue';
import { dayjs } from 'element-plus';
import type { FormInstance, FormRules } from 'element-plus';
import { useMessage } from '/@/hooks/message';
import { confirmPaymentRequest } from '/@/api/financial/transactionManagement/paymentRequestPool/index';

const SelectInputApi = defineAsyncComponent(
	() => import('/@/componentsApi/SelectInputApi/index.vue')
);

interface IDetailRow {
	id: number;
	orderInfo: string;
	currentApplyAmount: number | undefined;
	remark: string;
	attachmentUrls: string[];
}

interface IForm {
	urgencyLevel: number;
	expectedPaymentDate: string;
	collectionType: number;
	paymentMethod: number;
	details: IDetailRow[];
}

const props = defineProps<{
	modelValue: boolean;
	rows: any[];
}>();

const emit = defineEmits<{
	(e: 'update:modelValue', val: boolean): void;
	(e: 'success'): void;
}>();

const message = useMessage();
const loading = ref(false);
const formRef = ref<FormInstance>();

const visible = computed({
	get: () => props.modelValue,
	set: (val) => emit('update:modelValue', val),
});

const formData = reactive<IForm>({
	urgencyLevel: 0,
	expectedPaymentDate: '',
	collectionType: 0,
	paymentMethod: 1,
	details: [],
});

const rules: FormRules = {
	urgencyLevel: [
		{ required: true, message: '请选择紧急程度', trigger: 'change' },
	],
	expectedPaymentDate: [
		{ required: true, message: '请选择期望付款日期', trigger: 'change' },
	],
	collectionType: [
		{ required: true, message: '请选择收款类型', trigger: 'change' },
	],
	paymentMethod: [
		{ required: true, message: '请选择付款方式', trigger: 'change' },
	],
};

const initForm = () => {
	const isEdit = props.rows.length === 1;
	const first = props.rows[0];

	// 编辑模式：回填表单头部字段
	if (isEdit) {
		formData.urgencyLevel = first.urgencyLevel;
		formData.collectionType = first.collectionType;
		formData.paymentMethod = first.paymentMethod;
	}
	formData.expectedPaymentDate =
		first.expectedPaymentDate || dayjs().format('YYYY-MM-DD');

	formData.details = props.rows.map((r) => ({
		...r,
		orderInfo:
			r.transferOrderNo || r.platformOrderNo || r.paymentRequestNo || '',
		currentApplyAmount: r.requestableAmount ?? r.currentApplyAmount,
		remark: r.remark || '',
		attachmentUrls: r.attachmentUrls || [],
	}));
};

const resetForm = () => {
	formRef.value?.resetFields();
	Object.assign(formData, {
		urgencyLevel: 0,
		expectedPaymentDate: '',
		collectionType: 0,
		paymentMethod: 1,
		details: [],
	});
};

const handleClose = () => {
	visible.value = false;
	resetForm();
};

const handleSubmit = async (type: 'save' | 'confirm') => {
	if (!formRef.value) return;
	const valid = await formRef.value.validate().catch(() => false);
	if (!valid) return;

	const { details, ...baseForm } = formData;
	const payload = details.map((d) => ({
		id: d.id,
		currentApplyAmount: d.currentApplyAmount,
		remark: d.remark,
		attachmentUrls: d.attachmentUrls.join(','),
		...baseForm,
	}));

	try {
		loading.value = true;
		const res = await confirmPaymentRequest(payload);
		if (res?.code === 0) {
			message.success(type === 'save' ? '保存成功' : '请款成功');
			handleClose();
			emit('success');
		}
	} finally {
		loading.value = false;
	}
};
</script>

<style lang="scss" scoped>
.section-title {
	font-size: 14px;
	font-weight: 600;
	color: #303133;
	padding: 8px 0 12px;
	border-bottom: 1px solid #ebeef5;
	margin-bottom: 16px;
}

.section-block {
	padding: 0 0 8px;
}

.detail-table {
	width: 100%;
	margin-bottom: 8px;
}
</style>
