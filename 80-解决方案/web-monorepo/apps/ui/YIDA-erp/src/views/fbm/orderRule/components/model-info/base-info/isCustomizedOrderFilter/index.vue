<!--
 * @Author: YIDA 3136271519@qq.com
 * @Date: 2025-10-09 17:58:38
 * @LastEditors: YIDA 3136271519@qq.com
 * @LastEditTime: 2025-10-13 15:09:26
 * @FilePath: \qianyi-ui\src\views\fbm\orderRule\orderConfirmRule\components\rule-model\model-info\base-info\isCustomizedOrderFilter\index.vue
 * @Description: 
 * 
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved. 
-->
<script setup lang="ts">
import { useI18n } from 'vue-i18n';
const { t } = useI18n();

// 表单数据
const formData = ref<Record<string, any>>({
	madeToOrder: '0', // 是否有买家备注
});
const formRef = ref<any>(null);
// 表单校验
const rules = ref({
	madeToOrder: [{ required: true, message: '请选择买家备注', trigger: 'blur' }],
});
const init = () => {
	// 重置数据
	formData.value = {
		madeToOrder: '0', // 是否有买家备注
	};
};

// 获取提交值
const validateForm = async () => {
	await formRef.value.validate();
	if (formData.value.madeToOrder === '0') {
		const getFormData = {
			madeToOrder: `madeToOrder == null`,
		};
		return getFormData;
	} else if (formData.value.madeToOrder === '1') {
		const getFormData = {
			madeToOrder: `madeToOrder != null`,
		};
		return getFormData;
	}
};
// 设置回显值
const setFormData = (data: Record<string, any>) => {
	if (!data || !data.madeToOrder) {
		return '错误：无效的数据格式，缺少 madeToOrder 字段';
	}
	formData.value.madeToOrder = data.madeToOrder === 'madeToOrder != null' ? '1' : '0';
};
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
					<el-form-item :label="t('是否定制化订单')" prop="madeToOrder">
						<el-row style="width: 100%">
							<el-col :span="22">
								<el-switch v-model="formData.madeToOrder" active-value="1" inactive-value="0" active-text="有" inactive-text="无" inline-prompt />
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
