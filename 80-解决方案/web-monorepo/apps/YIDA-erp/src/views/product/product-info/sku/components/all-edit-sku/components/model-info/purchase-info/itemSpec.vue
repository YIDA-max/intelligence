<!--
 * @Author: YIDA 3136271519@qq.com
 * @Date: 2025-10-09 17:58:38
 * @LastEditors: YIDA 3136271519@qq.com
 * @LastEditTime: 2025-12-09 22:11:16
 * @FilePath: \qianyi-ui\src\views\product\product-info\sku\components\all-edit-sku\components\model-info\purchase-info\itemSpec.vue
 * @Description: 
 * 
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved. 
-->
<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useUnitConverter } from '/@/views/product/product-info/sku/components/all-edit-sku/components/model-info/purchase-info/utils/itemSpec';
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
	itemSpecLength: string;
	itemSpecWidth: string;
	itemSpecHeight: string;
	itemSpecUnit: string;
}>({
	itemSpecLength: '', // 单品规格长度
	itemSpecWidth: '', // 单品规格宽度
	itemSpecHeight: '', // 单品规格高度
	itemSpecUnit: '', // 单品规格单位
});
const formRef = ref<any>(null);
const currentSpecUnits = computed(() => {
	// 根据单位制选择规格单位
	if (props.purchaseInfoUnitSystem === '1') {
		// 公制
		return [{ label: 'cm', value: 'cm' }];
	} else {
		// 英制
		return [{ label: 'inch', value: 'inch' }];
	}
});
// 表单校验
const rules = ref({
	itemSpecLength: [
		{ required: false, message: '请选择单品规格', trigger: 'blur' },
	],
});

// 监听单位制变化，更新规格单位
watch(
	() => props.purchaseInfoUnitSystem,
	async (newVal) => {
		await autoConvertUnitFields(
			newVal,
			['itemSpecLength', 'itemSpecWidth', 'itemSpecHeight'],
			formData
		);
	}
);

const init = () => {
	// 重置数据
	formData.value = {
		itemSpecLength: '', // 单品规格长度
		itemSpecWidth: '', // 单品规格宽度
		itemSpecHeight: '', // 单品规格高度
		itemSpecUnit: 'cm', // 单品规格单位
	};
	// 默认选中单位的第一项
	if (currentSpecUnits.value && currentSpecUnits.value.length > 0) {
		formData.value.itemSpecUnit = currentSpecUnits.value[0].value;
	}
};
// 获取提交值
const validateForm = async () => {
	await formRef.value.validate();
	const getFormData = {
		itemSpecLength: formData.value.itemSpecLength,
		itemSpecWidth: formData.value.itemSpecWidth,
		itemSpecHeight: formData.value.itemSpecHeight,
		itemSpecUnit: formData.value.itemSpecUnit,
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
			<el-form-item>
				<template #label>
					<span
						:style="{
							color: '#f78c8c',
							marginRight: '3px',
						}"
						>*
					</span>
					{{ $t('单品规格') }}
				</template>
				<el-row class="base-info" :gutter="0">
					<el-col :span="6">
						<el-form-item prop="itemSpecLength">
							<el-input
								v-model="formData.itemSpecLength"
								:placeholder="t('长')"
								@blur="
									handleBlurClearCache(
										props.purchaseInfoUnitSystem,
										formData.itemSpecLength,
										'itemSpecLength'
									)
								"
							></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="6">
						<el-form-item prop="itemSpecWidth">
							<el-input
								v-model="formData.itemSpecWidth"
								:placeholder="t('宽')"
								@blur="
									handleBlurClearCache(
										props.purchaseInfoUnitSystem,
										formData.itemSpecWidth,
										'itemSpecWidth'
									)
								"
							></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="6">
						<el-form-item prop="itemSpecHeight">
							<el-input
								v-model="formData.itemSpecHeight"
								:placeholder="t('高')"
								@blur="
									handleBlurClearCache(
										props.purchaseInfoUnitSystem,
										formData.itemSpecHeight,
										'itemSpecHeight'
									)
								"
							></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="6">
						<el-form-item prop="itemSpecUnit">
							<el-select
								v-model="formData.itemSpecUnit"
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
					</el-col>
				</el-row>
			</el-form-item>
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
