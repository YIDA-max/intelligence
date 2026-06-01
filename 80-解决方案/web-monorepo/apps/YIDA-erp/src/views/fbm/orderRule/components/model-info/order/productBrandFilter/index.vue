<!--
 * @Author: YIDA 3136271519@qq.com
 * @Date: 2025-10-09 17:58:38
 * @LastEditors: YIDA 3136271519@qq.com
 * @LastEditTime: 2025-10-13 16:19:28
 * @FilePath: \qianyi-ui\src\views\fbm\orderRule\orderConfirmRule\components\rule-model\model-info\order\productBrandFilter\index.vue
 * @Description: 
 * 
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved. 
-->
<script setup lang="ts">
import { inject, Ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { isInToValidateForm, isInToSetFormData } from '/@/views/fbm/orderRule/components/utils/index';
const { t } = useI18n();
const dictMap = inject<Ref<any>>('dictMap');

// 表单数据
const formData = ref<Record<string, any>>({
	brand: [], // 产品品牌
	isBelong: '1',
});
const formRef = ref<any>(null);
// 表单校验
const rules = ref({
	brand: [{ required: true, message: '请选择产品品牌', trigger: 'blur' }],
});
const init = () => {
	// 重置数据
	formData.value = {
		brand: [], // 产品品牌
		isBelong: '1',
	};
};

// 获取提交值
const validateForm = async () => {
	await formRef.value.validate();
	return isInToValidateForm(formData.value.isBelong, 'brand', formData.value.brand);
};
// 设置回显值
const setFormData = (data: Record<string, any>) => {
	// 设置数据
	return isInToSetFormData(data, 'brand', formData);
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
					<el-form-item :label="t('产品品牌')" prop="brand">
						<el-row style="width: 100%">
							<el-col :span="4">
								<el-select v-model="formData.isBelong" placeholder="是否属于" style="width: 100%">
									<el-option
										v-for="item in [
											{
												id: '1',
												label: '属于',
												value: '1',
											},
											{
												id: '2',
												label: '不属于',
												value: '2',
											},
										]"
										:key="item.id"
										:label="item.label"
										:value="item.value"
									/>
								</el-select>
							</el-col>
							<el-col :span="20">
								<el-select
									collapse-tags
									:max-collapse-tags="5"
									v-model="formData.brand"
									clearable
									filterable
									multiple
									placeholder="产品品牌"
									style="width: 100%"
								>
									<el-option
										v-for="item in dictMap.brandCode"
										:key="item.value"
										:label="`${item.brandCode}-${item.brandName}`"
										:value="item.brandCode"
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
