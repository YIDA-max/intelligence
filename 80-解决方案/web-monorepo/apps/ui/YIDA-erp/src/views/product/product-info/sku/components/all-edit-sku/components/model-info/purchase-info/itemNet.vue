<!--
 * @Author: YIDA 3136271519@qq.com
 * @Date: 2025-10-09 17:58:38
 * @LastEditors: YIDA 3136271519@qq.com
 * @LastEditTime: 2025-12-09 15:48:31
 * @FilePath: \qianyi-ui\src\views\product\product-info\sku\components\all-edit-sku\components\model-info\purchase-info\itemNet.vue
 * @Description: 
 * 
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved. 
-->
<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useUnitConverter } from '/@/views/product/product-info/sku/components/all-edit-sku/components/model-info/purchase-info/utils/itemNet';
const { t } = useI18n();
const { autoConvertUnitFields, handleBlurClearCache } = useUnitConverter();
const props = defineProps({
	purchaseInfoUnitSystem: {
		type: String,
		default: '1', // 1 公制，2 英制
	},
});
// 表单数据
const formData = ref<{
	itemNetWeight: string;
	itemNetWeightUnit: string;
}>({
	itemNetWeight: '', // 单品净重
	itemNetWeightUnit: '', // 单品净重单位
});
const formRef = ref<any>(null);
const currentSpecUnits = computed(() => {
	// 根据单位制选择规格单位
	if (props.purchaseInfoUnitSystem === '1') {
		// 公制
		return [{ label: 'kg', value: 'kg' }];
	} else {
		// 英制
		return [{ label: 'lbs', value: 'lbs' }];
	}
});
// 表单校验
const rules = ref({
	itemNetWeight: [
		{ required: false, message: '请选择单品净重', trigger: 'blur' },
	],
});

// 监听单位制变化，更新规格单位
watch(
	() => props.purchaseInfoUnitSystem,
	async (newVal) => {
		// 转换单位
		await autoConvertUnitFields(newVal, ['itemNetWeight'], formData);
	}
);

const init = () => {
	// 重置数据
	formData.value = {
		itemNetWeight: '', // 单品净重
		itemNetWeightUnit: '', // 单品净重单位
	};
	// 默认选中单位的第一项
	if (currentSpecUnits.value && currentSpecUnits.value.length > 0) {
		formData.value.itemNetWeightUnit = currentSpecUnits.value[0].value;
	}
};
// 获取提交值
const validateForm = async () => {
	await formRef.value.validate();
	const getFormData = {
		itemNetWeight: formData.value.itemNetWeight,
		itemNetWeightUnit: formData.value.itemNetWeightUnit,
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
					<el-form-item :label="t('单品净重')" prop="itemNetWeight">
						<template #label>
							<span
								:style="{
									color: '#f78c8c',
									marginRight: '3px',
								}"
								>*
							</span>
							{{ $t('单品净重') }}
						</template>
						<el-input
							v-model="formData.itemNetWeight"
							:placeholder="$t('请输入')"
							:style="{ width: '300px' }"
							@blur="
								handleBlurClearCache(
									props.purchaseInfoUnitSystem,
									formData.itemNetWeight,
									'itemNetWeight'
								)
							"
						>
							<template #append>
								<el-form-item prop="itemNetWeightUnit">
									<el-select
										v-model="formData.itemNetWeightUnit"
										filterable
										placeholder="请选择"
										:style="{
											width: '100px',
										}"
										class="el-select-background"
									>
										<el-option
											v-for="item in currentSpecUnits"
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
