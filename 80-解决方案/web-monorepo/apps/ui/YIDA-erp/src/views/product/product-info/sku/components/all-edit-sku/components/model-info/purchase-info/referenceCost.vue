<!--
 * @Author: YIDA 3136271519@qq.com
 * @Date: 2025-10-09 17:58:38
 * @LastEditors: YIDA 3136271519@qq.com
 * @LastEditTime: 2025-12-09 14:59:58
 * @FilePath: \qianyi-ui\src\views\product\product-info\sku\components\all-edit-sku\components\model-info\purchase-info\referenceCost.vue
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
	referenceCost: string;
	referenceCostUnit: string;
}>({
	referenceCost: '', // 单品规格
	referenceCostUnit: '', // 单品规格单位
});
const formRef = ref<any>(null);
// 表单校验
const rules = ref({
	referenceCost: [
		{ required: false, message: '请选择单品规格', trigger: 'blur' },
	],
});
const init = () => {
	// 重置数据
	formData.value = {
		referenceCost: '', // 单品规格
		referenceCostUnit: '', // 单品规格单位
	};
	// 默认选中单位的第一项
	if (
		dictMap?.value.referenceCostUnit &&
		dictMap?.value.referenceCostUnit.length > 0
	) {
		formData.value.referenceCostUnit =
			dictMap?.value.referenceCostUnit[0].value;
	}
};
// 获取提交值
const validateForm = async () => {
	await formRef.value.validate();
	const getFormData = {
		referenceCost: formData.value.referenceCost,
		referenceCostUnit: formData.value.referenceCostUnit,
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
					<el-form-item :label="t('参考成本')" prop="referenceCost">
						<el-input
							v-model="formData.referenceCost"
							:placeholder="$t('请输入')"
							:style="{ width: '300px' }"
						>
							<template #append>
								<el-form-item prop="referenceCostUnit">
									<el-select
										v-model="formData.referenceCostUnit"
										filterable
										placeholder="请选择"
										:style="{
											width: '100px',
										}"
										class="el-select-background"
									>
										<el-option
											v-for="item in dictMap.referenceCostUnit"
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
