<template>
	<el-dialog
		v-model="visible"
		title="付款详情"
		width="600px"
		:close-on-click-modal="false"
		@close="close"
	>
		<el-form :model="form" label-width="120px" ref="formRef" :rules="rules">
			<el-form-item label="付款人" prop="payerId">
				<el-input v-model="form.payerId" placeholder="请输入付款人" />
			</el-form-item>
			<el-form-item label="付款金额" prop="paymentAmount">
				<el-input
					v-model="form.paymentAmount"
					placeholder="请输入付款金额"
					type="number"
				/>
			</el-form-item>
			<el-form-item label="付款时间" prop="paymentTime">
				<el-date-picker
					v-model="form.paymentTime"
					type="datetime"
					placeholder="选择付款时间"
					style="width: 100%"
					value-format="YYYY-MM-DD HH:mm:ss"
				/>
			</el-form-item>
		</el-form>
		<template #footer>
			<el-button @click="close">取消</el-button>
			<el-button type="primary" @click="handleSubmit">确认</el-button>
		</template>
	</el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import type { FormInstance, FormRules } from 'element-plus';

interface IPayForm {
	payerId: string;
	paymentAmount: string;
	paymentTime: string;
}

interface Emits {
	(e: 'confirm', formData: IPayForm): void;
}

const emit = defineEmits<Emits>();

const visible = ref(false);
const formRef = ref<FormInstance>();
const form = reactive<IPayForm>({
	payerId: '',
	paymentAmount: '',
	paymentTime: '',
});

const rules: FormRules = {
	payerId: [{ required: true, message: '请输入付款人', trigger: 'blur' }],
	paymentAmount: [
		{ required: true, message: '请输入付款金额', trigger: 'blur' },
	],
	paymentTime: [
		{ required: true, message: '请选择付款时间', trigger: 'change' },
	],
};

/**
 * 打开弹窗
 */
const open = () => {
	visible.value = true;
};

/**
 * 关闭弹窗
 */
const close = () => {
	visible.value = false;
	form.payerId = '';
	form.paymentAmount = '';
	form.paymentTime = '';
	formRef.value?.resetFields();
};

/**
 * 提交表单
 */
const handleSubmit = async () => {
	if (!formRef.value) return;
	await formRef.value.validate((valid) => {
		if (valid) {
			emit('confirm', { ...form });
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
:deep(.el-input-number) {
	width: 100%;
}
</style>
