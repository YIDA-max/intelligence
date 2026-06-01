<!--
 * @Author: YIDA 3136271519@qq.com
 * @Date: 2025-10-09 17:58:38
 * @LastEditors: YIDA 3136271519@qq.com
 * @LastEditTime: 2025-12-09 14:54:26
 * @FilePath: \qianyi-ui\src\views\product\product-info\sku\components\all-edit-sku\components\model-info\purchase-info\purchaseLeadTimeUnit.vue
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
	purchaseLeadTime: string;
	purchaseLeadTimeUnit: string;
}>({
	purchaseLeadTime: '', // 采购交期
	purchaseLeadTimeUnit: '', // 采购交期单位
});
const formRef = ref<any>(null);
// 表单校验
const rules = ref({
	purchaseLeadTime: [
		{ required: false, message: '请选择采购交期', trigger: 'blur' },
	],
});
const init = () => {
	// 重置数据
	formData.value = {
		purchaseLeadTime: '', // 采购交期
		purchaseLeadTimeUnit: '', // 采购交期单位
	};
	// 默认选中单位的第一项
	if (
		dictMap?.value.purchaseLeadTimeUnit &&
		dictMap?.value.purchaseLeadTimeUnit.length > 0
	) {
		formData.value.purchaseLeadTimeUnit =
			dictMap?.value.purchaseLeadTimeUnit[0].value;
	}
};
// 获取提交值
const validateForm = async () => {
	await formRef.value.validate();
	const getFormData = {
		purchaseLeadTime: formData.value.purchaseLeadTime,
		purchaseLeadTimeUnit: formData.value.purchaseLeadTimeUnit,
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
					<el-form-item :label="t('采购交期')" prop="purchaseLeadTime">
						<el-input
							v-model="formData.purchaseLeadTime"
							:placeholder="$t('请输入')"
							:style="{ width: '300px' }"
						>
							<template #append>
								<el-form-item prop="purchaseLeadTimeUnit">
									<el-select
										v-model="formData.purchaseLeadTimeUnit"
										filterable
										placeholder="请选择"
										:style="{
											width: '100px',
										}"
										class="el-select-background"
									>
										<el-option
											v-for="item in dictMap.purchaseLeadTimeUnit"
											:key="item.value"
											:label="item.label"
											:value="item.value"
										/>
									</el-select>
								</el-form-item>
							</template>
						</el-input>
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
