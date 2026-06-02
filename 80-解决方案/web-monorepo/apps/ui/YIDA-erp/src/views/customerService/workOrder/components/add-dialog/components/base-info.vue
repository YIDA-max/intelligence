<script setup lang="ts">
import { ref } from 'vue';
import type { FormInstance } from 'element-plus';

/**
 * 接收父组件传递的属性
 * @property {string} dialogType - 弹窗类型：add(新增) | edit(编辑) | copy(复制) | detail(详情)
 * @property {object} dicMap - 字典映射表
 */
const props = defineProps({
	dialogType: {
		type: String,
		default: 'add',
	},
	dicMap: {
		type: Object,
		default: () => ({}),
	},
});

const formRef = ref<FormInstance>();
const formData = ref({
	orderType: 2, // 工单类型
	createName: '',
	createTime: '',
});

// 表单验证规则
const rules = {
	orderType: [{ required: true, message: '请选择工单类型', trigger: 'change' }],
};

/**
 * 设置表单数据
 * @param {object} data - 包含 orderType 等字段的数据对象
 */
const setData = (data: any) => {
	// data is already mapped in utils/index.ts
	formData.value = { ...formData.value, ...data };
};

/**
 * 获取表单数据并进行验证
 * @returns {Promise<object>} 返回验证通过后的表单数据对象
 */
const getData = async () => {
	if (!formRef.value) return Promise.reject('Form not initialized');
	await formRef.value.validate();
	return { orderType: formData.value.orderType };
};

defineExpose({
	setData,
	getData,
});
</script>

<template>
	<div class="mb-4">
		<div class="border-l-4 border-blue-500 pl-2 font-bold mb-4 text-base">
			基本信息
		</div>
		<el-form ref="formRef" :model="formData" :rules="rules" label-width="100px">
			<el-row :gutter="20">
				<el-col :span="8">
					<el-form-item label="工单类型" prop="orderType">
						<el-select
							v-model="formData.orderType"
							placeholder="请选择"
							class="w-full"
							:disabled="props.dialogType === 'detail'"
						>
							<el-option label="售前" :value="1" />
							<el-option label="售后" :value="2" />
						</el-select>
					</el-form-item>
				</el-col>
				<el-col :span="8">
					<el-form-item
						v-if="props.dialogType === 'detail'"
						label="登记人"
						prop="createName"
					>
						<el-input v-model="formData.createName" disabled />
					</el-form-item>
				</el-col>
				<el-col v-if="props.dialogType === 'detail'" :span="8">
					<el-form-item label="创建时间" prop="createTime">
						<el-input v-model="formData.createTime" disabled />
					</el-form-item>
				</el-col>
			</el-row>
		</el-form>
	</div>
</template>
