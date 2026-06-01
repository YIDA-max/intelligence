<!--
 * @Author: YIDA 3136271519@qq.com
 * @Date: 2025-10-09 17:58:38
 * @LastEditors: YIDA 3136271519@qq.com
 * @LastEditTime: 2025-12-08 18:32:56
 * @FilePath: \qianyi-ui\src\views\product\product-info\sku\components\all-edit-sku\components\model-info\purchase-info\purchaseRemark.vue
 * @Description: 
 * 
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved. 
-->
<script setup lang="ts">
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
const formData = ref<{
	purchaseRemark: string;
}>({
	purchaseRemark: '', // 采购备注
});
const formRef = ref<any>(null);
// 表单校验
const rules = ref({
	purchaseRemark: [
		{ required: false, message: '请选择采购备注', trigger: 'blur' },
	],
});
const init = () => {
	// 重置数据
	formData.value = {
		purchaseRemark: '', // 采购备注
	};
};
// 获取提交值
const validateForm = async () => {
	await formRef.value.validate();
	const getFormData = {
		purchaseRemark: formData.value.purchaseRemark,
	};
	return getFormData;
};

// 暴露方法给父组件
defineExpose({
	init,
	validateForm,
});
</script>
<template>
	<div class="box">
		<el-form :model="formData" ref="formRef" label-width="150px" :rules="rules">
			<el-row class="base-info" :gutter="20">
				<el-col :span="24">
					<el-form-item :label="t('采购备注')" prop="purchaseRemark">
						<el-input
							v-model="formData.purchaseRemark"
							:rows="3"
							maxlength="500"
							show-word-limit
							type="textarea"
							placeholder="采购备注"
						/>
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
