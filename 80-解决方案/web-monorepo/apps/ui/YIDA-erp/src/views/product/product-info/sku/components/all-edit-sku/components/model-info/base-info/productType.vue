<!--
 * @Author: YIDA 3136271519@qq.com
 * @Date: 2025-10-09 17:58:38
 * @LastEditors: YIDA 3136271519@qq.com
 * @LastEditTime: 2025-12-17 14:33:00
 * @FilePath: \qianyi-ui\src\views\product\product-info\sku\components\all-edit-sku\components\model-info\base-info\productType.vue
 * @Description: 
 * 
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved. 
-->
<script setup lang="ts">
import { Ref } from 'vue';
import { useI18n } from 'vue-i18n';
import emitter from '/@/utils/mitt';
const { t } = useI18n();
const dictMap = inject<Ref<any>>('dictMap');
// 表单数据
const formData = ref<{
	productType: string;
}>({
	productType: '', // 产品类型
});
const formRef = ref<any>(null);
// 表单校验
const rules = ref({
	productType: [{ required: true, message: '请选择产品类型', trigger: 'blur' }],
});
const init = () => {
	// 重置数据
	formData.value = {
		productType: '', // 产品类型
	};
};
// 获取提交值
const validateForm = async () => {
	await formRef.value.validate();
	const getFormData = {
		productType: formData.value.productType,
	};
	return getFormData;
};
// 发送监听产品类型变化事件
watch(
	() => formData.value.productType,
	(newVal) => {
		emitter.emit('productTypeChange', newVal);
	}
);

// 暴露方法给父组件
defineExpose({
	init,
	validateForm,
	formData,
});
</script>
<template>
	<div class="box">
		<el-form :model="formData" ref="formRef" label-width="150px" :rules="rules">
			<el-row class="base-info" :gutter="20">
				<el-col :span="24">
					<el-form-item :label="t('产品类型')" prop="productType">
						<el-select
							v-model="formData.productType"
							filterable
							placeholder="请选择"
							:style="{ width: '300px' }"
						>
							<el-option
								v-for="item in dictMap.productType"
								:key="item.value"
								:label="item.label"
								:value="item.value"
							/>
						</el-select>
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
