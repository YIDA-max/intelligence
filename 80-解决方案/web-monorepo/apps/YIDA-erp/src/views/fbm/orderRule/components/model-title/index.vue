<!--
 * @Author: YIDA 3136271519@qq.com
 * @Date: 2025-10-09 11:16:40
 * @LastEditors: YIDA 3136271519@qq.com
 * @LastEditTime: 2025-10-13 17:11:04
 * @FilePath: \qianyi-ui\src\views\fbm\orderRule\components\model-title\index.vue
 * @Description: 
 * 
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved. 
-->
<script setup lang="ts">
const props = defineProps({
	modelTitle: {
		type: String,
		default: '接单规则',
	}, // 规则类型标题
});
// 表单数据
const formData = ref<Record<string, any>>({
	name: '', // 规则名称
	status: 1, // 规则状态
	effectiveTime: '', // 规则生效时间
	description: '', // 规则描述
});
const formRef = ref<any>(null);
// 表单校验
const rules = ref({
	name: [{ required: true, message: '请输入规则名称', trigger: 'blur' }],
	status: [{ required: true, message: '请选择规则状态', trigger: 'change' }],
	effectiveTime: [{ required: true, message: '请选择规则生效时间', trigger: 'blur' }],
	description: [{ required: true, message: '请输入规则描述', trigger: 'blur' }],
});
// 校验表单并返回数据
const validateForm = async () => {
	await formRef.value.validate();
	return formData.value;
};
// 初始化表单数据
const init = () => {
	// 重置表单
	formRef.value.resetFields();
	formData.value = {
		name: '', // 规则名称
		status: 1, // 规则状态
		effectiveTime: '', // 规则生效时间
		description: '', // 规则描述
	};
};
// 设置表单数据
const setFormData = (data: Record<string, any>) => {
	formData.value = { ...formData.value, ...data };
};
// 暴露给父组件的方法
defineExpose({
	validateForm,
	init,
	setFormData,
});
</script>

<template>
	<div>
		<el-form :model="formData" ref="formRef" label-width="110px" :rules="rules">
			<el-row class="mb18">
				<el-col :span="4">
					<el-form-item label="规则名称" prop="name">
						<el-input
							v-model="formData.name"
							placeholder="请输入规则名称"
							:maxlength="32"
							:style="{
								width: '100%',
							}"
						/>
					</el-form-item>
				</el-col>
				<el-col :span="3">
					<el-form-item label="规则类型" prop="warehouseNo">
						{{ props.modelTitle }}
					</el-form-item>
				</el-col>
				<el-col :span="3">
					<el-form-item label="规则状态" prop="status">
						<!-- '状态 0:禁用  1:启用' -->
						<el-switch v-model="formData.status" :active-value="1" :inactive-value="0" active-text="启用" inactive-text="禁用" inline-prompt />
					</el-form-item>
				</el-col>
				<el-col :span="4">
					<el-form-item label="规则生效时间" prop="effectiveTime">
						<el-date-picker v-model="formData.effectiveTime" type="datetime" placeholder="选择日期时间" value-format="YYYY-MM-DD HH:mm:ss" />
					</el-form-item>
				</el-col>
				<el-col :span="10">
					<el-form-item label="规则描述" prop="description">
						<el-input v-model="formData.description" placeholder="请输入规则描述" :maxlength="500" />
					</el-form-item>
				</el-col>
			</el-row>
		</el-form>
	</div>
</template>

<style scoped></style>
