<!--
 * @Author: YIDA 3136271519@qq.com
 * @Date: 2025-10-09 16:51:25
 * @LastEditors: YIDA 3136271519@qq.com
 * @LastEditTime: 2025-10-13 15:51:34
 * @FilePath: \qianyi-ui\src\views\fbm\orderRule\orderConfirmRule\components\rule-model\model-info\warehouse-shipping\phoneMobileFilter\index.vue
 * @Description: 
 * 
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved. 
-->
<script setup lang="ts">
import { useI18n } from 'vue-i18n';
const { t } = useI18n();

// 表单数据
const formData = ref<Record<string, any>>({
	phone: '1', // 电话号/手机号
});
const formRef = ref<any>(null);
// 表单校验
const rules = ref({
	phone: [{ required: true, message: '请选择电话号/手机号', trigger: 'blur' }],
});
const init = () => {
	// 重置数据
	formData.value = {
		phone: '1', // 电话号/手机号
	};
};

// 获取提交值
const validateForm = async () => {
	await formRef.value.validate();
	if (formData.value.isBelong === '1') {
		const getFormData = {
			platformWareId: `platformWareId in [${formData.value.platformWareId}]`,
		};
		return getFormData;
	} else if (formData.value.isBelong === '2') {
		const getFormData = {
			platformWareId: `!(platformWareId in [${formData.value.platformWareId}])`,
		};
		return getFormData;
	}
};
// 设置回显值
const setFormData = (data: Record<string, any>) => {
	// 设置数据
	if (!data || !data.platformWareId) {
		return '错误：无效的数据格式';
	}
	// 用于匹配是否排除的正则表达式(需要优先匹配 排除)
	const excludeMatch = data.platformWareId.match(/!\(platformWareId in \[([^\]]+)\]\)/);
	if (excludeMatch) {
		formData.value.isBelong = '2';
		formData.value.platformWareId = excludeMatch[1].split(',').map((item: string) => item.trim());
		return '成功设置数据';
	}
	// 用于匹配是否包含指定的正则表达式
	const match = data.platformWareId.match(/platformWareId in \[([^\]]+)\]/);
	if (match) {
		formData.value.isBelong = '1';
		formData.value.platformWareId = match[1].split(',').map((item: string) => item.trim());
		return '成功设置数据';
	}
	return '错误：无法解析数据格式';
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
					<el-form-item :label="t('电话号/手机号')" prop="phone">
						<el-row style="width: 100%">
							<el-col :span="4">
								<el-select v-model="formData.phone" clearable filterable placeholder="状态" style="width: 100%">
									<el-option
										v-for="item in [
											{
												id: '1',
												label: '全部为空',
												value: '1',
											},
											{
												id: '2',
												label: '全部不为空',
												value: '2',
											},
											{
												id: '3',
												label: '其中一项不为空',
												value: '3',
											},
										]"
										:key="item.id"
										:label="item.label"
										:value="item.value"
									/>
								</el-select>
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
}
</style>
