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
});

const formRef = ref<FormInstance>();
const formData = ref({
	date: '',
	trackingNo: '',
});

const rules = {
	date: [
		{ required: true, message: '请选择退货日期', trigger: ['blur', 'change'] },
	],
};

/**
 * 设置表单数据
 * @param {object} data - 包含退货信息的数据对象
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
 * @returns {Promise<object>} 返回验证通过后的退货数据对象
 */
const getData = async () => {
	if (!formRef.value) return Promise.reject('Form not initialized');
	await formRef.value.validate();
	return {
		returnDate: formData.value.date,
		returnTrackingNo: formData.value.trackingNo,
	};
};

defineExpose({ setData, getData });
</script>

<template>
	<div class="mb-4">
		<div class="border-l-4 border-blue-500 pl-2 font-bold mb-4 text-base">
			退货信息
		</div>
		<el-form ref="formRef" :model="formData" :rules="rules" label-width="100px">
			<el-row :gutter="20">
				<el-col :span="8">
					<el-form-item label="退货日期" prop="date">
						<el-date-picker
							v-model="formData.date"
							type="datetime"
							value-format="YYYY-MM-DD HH:mm:ss"
							placeholder="请选择日期"
							class="w-full"
							:disabled="props.dialogType === 'detail'"
						/>
					</el-form-item>
				</el-col>
				<el-col :span="8">
					<el-form-item label="退货跟踪号" prop="trackingNo">
						<el-input
							v-model="formData.trackingNo"
							maxlength="50"
							show-word-limit
							placeholder="请输入"
							:disabled="props.dialogType === 'detail'"
						/>
					</el-form-item>
				</el-col>
			</el-row>
		</el-form>
	</div>
</template>
