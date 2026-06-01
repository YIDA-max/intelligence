<!--
 * @Author: YIDA 3136271519@qq.com
 * @Date: 2025-10-09 16:51:25
 * @LastEditors: YIDA 3136271519@qq.com
 * @LastEditTime: 2025-10-13 15:30:18
 * @FilePath: \qianyi-ui\src\views\fbm\orderRule\orderConfirmRule\components\rule-model\model-info\warehouse-shipping\shipToCountryRegionFilter\index.vue
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
	recipientCountry: [], // 收货国家/地区
	isBelong: '1', // 是否属于
});
const formRef = ref<any>(null);
// 表单校验
const rules = ref({
	recipientCountry: [{ required: true, message: '请选择收货国家/地区', trigger: 'blur' }],
});
const init = () => {
	// 重置数据
	formData.value = {
		recipientCountry: [], // 订单国家
		isBelong: '1',
	};
};

// 获取提交值
const validateForm = async () => {
	await formRef.value.validate();
	return isInToValidateForm(formData.value.isBelong, 'recipientCountry', formData.value.recipientCountry);
};

// 设置回显值
const setFormData = (data: Record<string, any>) => {
	// 设置数据
	return isInToSetFormData(data, 'recipientCountry', formData);
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
					<el-form-item :label="t('收货国家/地区')" prop="recipientCountry">
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
									v-model="formData.recipientCountry"
									clearable
									filterable
									multiple
									placeholder="收货国家/地区"
									style="width: 100%"
								>
									<el-option
										v-for="item in dictMap.countryList"
										:key="item.abbTwoCode"
										:label="`${item.abbTwoCode}-${item.chineseName}`"
										:value="item.abbTwoCode"
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
