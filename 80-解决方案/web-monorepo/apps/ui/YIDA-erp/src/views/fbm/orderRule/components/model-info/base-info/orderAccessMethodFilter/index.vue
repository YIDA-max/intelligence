<!--
 * @Author: YIDA 3136271519@qq.com
 * @Date: 2025-10-09 17:58:38
 * @LastEditors: YIDA 3136271519@qq.com
 * @LastEditTime: 2025-11-07 11:39:33
 * @FilePath: \qianyi-ui\src\views\fbm\orderRule\components\model-info\base-info\orderAccessMethodFilter\index.vue
 * @Description: 
 * 
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved. 
-->
<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { isInToValidateForm, isInToSetFormData } from '/@/views/fbm/orderRule/components/utils/index';
const { t } = useI18n();
// 表单数据
const formData = ref<Record<string, any>>({
	orderFrom: [], // 接入方式
	isBelong: '1', // 是否属于
});
const formRef = ref<any>(null);
// 表单校验
const rules = ref({
	orderFrom: [{ required: true, message: '请选择接入方式', trigger: 'blur' }],
});
const init = () => {
	// 重置数据
	formData.value = {
		orderFrom: [], // 接入方式
		isBelong: '1', // 是否属于
	};
};
// 获取提交值
const validateForm = async () => {
	await formRef.value.validate();
	return isInToValidateForm(formData.value.isBelong, 'orderFrom', formData.value.orderFrom);
};
// 设置回显值
const setFormData = (data: Record<string, any>) => {
	// 设置数据
	return isInToSetFormData(data, 'orderFrom', formData);
};
// 完善的数据设置函数

// 暴露方法给父组件
defineExpose({
	init,
	validateForm,
	setFormData,
});
</script>
<template>
	<div class="box">
		<el-form :model="formData" ref="formRef" label-width="150px" :rules="rules">
			<el-row class="base-info" :gutter="20">
				<el-col :span="24">
					<el-form-item :label="t('订单接入方式')" prop="orderFrom">
						<el-row style="width: 100%">
							<el-col :span="24">
								<el-checkbox-group v-model="formData.orderFrom">
									<el-checkbox
										v-for="(item, index) in [
											{
												label: t('手工'),
												value: 1,
											},
											{
												label: t('接口'),
												value: 2,
											},
											{
												label: t('开放接口'),
												value: 3,
											},
											{
												label: t('导入'),
												value: 4,
											},

											{
												label: t('积加同步'),
												value: 5,
											},
										]"
										:key="index"
										:label="item.label"
										:value="item.value"
									/>
								</el-checkbox-group>
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
	padding: 10px;
	border-radius: 5px;
	.span {
		margin: 0 8px;
	}
}
</style>
