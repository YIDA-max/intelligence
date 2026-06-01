<!--
 * @Author: YIDA 3136271519@qq.com
 * @Date: 2025-10-09 16:51:25
 * @LastEditors: YIDA 3136271519@qq.com
 * @LastEditTime: 2025-10-13 15:35:48
 * @FilePath: \qianyi-ui\src\views\fbm\orderRule\orderConfirmRule\components\rule-model\model-info\warehouse-shipping\shipToCityFilter\index.vue
 * @Description: 
 * 
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved. 
-->
<script setup lang="ts">
import { useI18n } from 'vue-i18n';
const { t } = useI18n();

// 表单数据
const formData = ref<Record<string, any>>({
	recipientDoorCode: '0', // 收货门牌号
});
const formRef = ref<any>(null);
// 表单校验
const rules = ref({
	recipientDoorCode: [
		{ required: true, message: '请选择收货门牌号', trigger: 'blur' },
	],
});
const init = () => {
	// 重置数据
	formData.value = {
		recipientDoorCode: '0', // 收货门牌号
	};
};
// 获取提交值
const validateForm = async () => {
	await formRef.value.validate();
	if (formData.value.recipientDoorCode === '0') {
		const getFormData = {
			recipientDoorCode: `recipientDoorCode == null`,
		};
		return getFormData;
	} else if (formData.value.recipientDoorCode === '1') {
		const getFormData = {
			recipientDoorCode: `recipientDoorCode != null`,
		};
		return getFormData;
	}
};
// 设置回显值
const setFormData = (data: Record<string, any>) => {
	if (!data || !data.recipientDoorCode) {
		return '错误：无效的数据格式，缺少 recipientDoorCode 字段';
	}
	formData.value.recipientDoorCode =
		data.recipientDoorCode === 'recipientDoorCode != null' ? '1' : '0';
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
					<el-form-item :label="t('收货门牌号')" prop="recipientDoorCode">
						<el-row style="width: 100%">
							<el-col :span="4">
								<el-switch
									v-model="formData.recipientDoorCode"
									active-value="1"
									inactive-value="0"
									active-text="为空"
									inactive-text="不为空"
									inline-prompt
								/>
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
