<script setup lang="ts">
import { ref, watch } from 'vue';
import type { FormInstance } from 'element-plus';

/**
 * 接收父组件传递的属性
 * @property {string} dialogType - 弹窗类型：add | edit | copy | detail
 * @property {object} data - 初始化数据
 */
const props = defineProps({
	dialogType: {
		type: String,
		default: 'add',
	},
	data: {
		type: Object,
		default: () => ({}),
	},
	dictMap: {
		type: Object,
		default: () => ({}),
	},
});

const formRef = ref<FormInstance>();
const formData = ref({
	type: '',
	amount: '',
	currency: '',
	date: '',
	refundNo: '', // 退款单号
});

const rules = {
	type: [
		{ required: true, message: '请选择退款类型', trigger: ['blur', 'change'] },
	],
	amount: [
		{ required: true, message: '请输入退款金额', trigger: ['blur', 'change'] },
	],
	currency: [
		{ required: true, message: '请选择币种', trigger: ['blur', 'change'] },
	],
	date: [
		{ required: true, message: '请选择退款日期', trigger: ['blur', 'change'] },
	],
};

/**
 * 设置表单数据
 * @param {object} data - 包含退款信息的数据对象
 */
const setData = (data: any) => {
	// data is already mapped
	formData.value = data;
};

// 监听 props.data 变化，自动设置数据
watch(
	() => props.data,
	(val) => {
		if (val && Object.keys(val).length > 0) {
			setData(val);
		}
	},
	{ immediate: true, deep: true }
);

/**
 * 获取表单数据并进行验证
 * @returns {Promise<object>} 返回验证通过后的退款数据对象
 */
const getData = async () => {
	if (!formRef.value) return Promise.reject('Form not initialized');
	await formRef.value.validate();
	return {
		refundType: formData.value.type, // 1:部分, 2:全额
		refundAmount: Number(formData.value.amount),
		currency: formData.value.currency,
		refundDate: formData.value.date,
		refundNo: formData.value.refundNo,
	};
};

defineExpose({ setData, getData });
</script>

<template>
	<div class="mb-4">
		<div class="border-l-4 border-blue-500 pl-2 font-bold mb-4 text-base">
			退款信息
		</div>
		<el-form ref="formRef" :model="formData" :rules="rules" label-width="100px">
			<el-row :gutter="18">
				<el-col :span="6">
					<el-form-item label="退款类型" prop="type">
						<el-select
							v-model="formData.type"
							placeholder="请选择"
							class="w-full"
							:disabled="props.dialogType === 'detail'"
						>
							<el-option label="部分" :value="1" />
							<el-option label="全额" :value="2" />
							<el-option label="超额" :value="3" />
						</el-select>
					</el-form-item>
				</el-col>
				<el-col :span="6">
					<el-form-item label="退款金额" prop="amount">
						<el-input
							v-model="formData.amount"
							placeholder="请输入"
							type="number"
							:disabled="props.dialogType === 'detail'"
						/>
					</el-form-item>
				</el-col>
				<el-col :span="6">
					<el-form-item label="币种" prop="currency">
						<el-select
							v-model="formData.currency"
							placeholder="请选择"
							class="w-full"
							:disabled="props.dialogType === 'detail'"
						>
							<el-option
								v-for="item in props.dictMap.currencyOptions"
								:key="item.currencyCode"
								:label="item.currencyCode"
								:value="item.currencyCode"
							/>
						</el-select>
					</el-form-item>
				</el-col>
				<el-col :span="6">
					<el-form-item label="退款日期" prop="date">
						<el-date-picker
							v-model="formData.date"
							type="datetime"
							value-format="YYYY-MM-DD HH:mm:ss"
							placeholder="请选择"
							class="w-full"
							:disabled="props.dialogType === 'detail'"
						/>
					</el-form-item>
				</el-col>
			</el-row>
		</el-form>
	</div>
</template>
