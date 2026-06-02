<!--
 * @Author: YIDA 3136271519@qq.com
 * @Date: 2025-10-09 17:43:46
 * @LastEditors: YIDA 3136271519@qq.com
 * @LastEditTime: 2025-10-15 17:38:16
 * @FilePath: \qianyi-ui\src\views\fbm\orderRule\orderMergeRule\components\rule-model\model-info\set-action\index.vue
 * @Description: 
 * 
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved. 
-->
<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
// 表单数据
const formData = ref<Record<string, any>>({
	type: 1, // 1:物流下单成功后 2:仓库发货完成后 3:无需标发
});
// 表单引用
const formRef = ref<any>(null);
// 表单校验
const rules = ref({
	type: [{ required: true, message: '请选择发货确认方式', trigger: 'blur' }],
});
const init = () => {
	formData.value = {
		type: 1, // 1:物流下单成功后 2:仓库发货完成后 3:无需标发
	};
};
// 导出给父组件的方法
// 获取表单数据
const validateForm = async () => {
	await formRef.value.validate();
	const getFormData = {
		type: formData.value.type,
	};
	return getFormData;
};
// 设置表单数据
const setFormData = (data: Record<string, any>) => {
	formData.value = {
		...formData.value,
		...data,
	};
}; // 暴露给父组件的方法
defineExpose({
	validateForm,
	init,
	setFormData,
});
</script>
<template>
	<div class="box">
		<el-form :model="formData" ref="formRef" label-width="150px" :rules="rules">
			<el-row class="title">
				<el-col :span="24">
					{{ t('设定动作') }}
				</el-col>
			</el-row>
			<el-row class="base-info" :gutter="20">
				<el-col :span="24">
					<el-form-item label="执行动作" prop="auto">
						<template #label>
							<span
								:style="{
									color: '#f78c8c',
									marginRight: '3px',
								}"
								>*
							</span>
							<span>{{ t('执行动作') }}</span>
						</template>
						<el-row style="width: 100%">
							<el-col :span="24">
								<el-radio-group v-model="formData.type">
									<el-radio :value="1" size="small">合并订单</el-radio>
								</el-radio-group>
							</el-col>
						</el-row>
					</el-form-item>
				</el-col>
			</el-row>
		</el-form>
	</div>
</template>

<style scoped lang="scss">
.box {
	border-radius: 5px;
	.title {
		font-size: 16px;
		font-weight: 500;
	}
}
</style>
