<!--
 * @Author: YIDA 3136271519@qq.com
 * @Date: 2025-10-09 17:58:38
 * @LastEditors: YIDA 3136271519@qq.com
 * @LastEditTime: 2025-12-08 11:12:12
 * @FilePath: \qianyi-ui\src\views\product\product-info\sku\components\all-edit-sku\components\model-info\base-info\countryCodes.vue
 * @Description: 
 * 
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved. 
-->
<script setup lang="ts">
import { Ref } from 'vue';
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
const dictMap = inject<Ref<any>>('dictMap');
// 表单数据
const formData = ref<{
	countryCodes: string;
}>({
	countryCodes: '', // 销售国家
});
const formRef = ref<any>(null);
// 表单校验
const rules = ref({
	countryCodes: [
		{ required: false, message: '请选择销售国家', trigger: 'blur' },
	],
});
const init = () => {
	// 重置数据
	formData.value = {
		countryCodes: '', // 销售国家
	};
};
// 获取提交值
const validateForm = async () => {
	await formRef.value.validate();
	const getFormData = {
		countryCodes: formData.value.countryCodes,
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
					<el-form-item :label="t('销售国家')" prop="countryCodes">
						<el-select
							collapse-tags
							:max-collapse-tags="1"
							clearable
							filterable
							multiple
							v-model="formData.countryCodes"
							:style="{ width: '300px' }"
						>
							<el-option
								v-for="item in dictMap.countryList"
								:key="item.abbTwoCode"
								:label="`${item.abbTwoCode}-${item.chineseName}`"
								:value="item.abbTwoCode"
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
