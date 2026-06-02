<!--
 * @Author: YIDA 3136271519@qq.com
 * @Date: 2025-10-09 17:58:38
 * @LastEditors: YIDA 3136271519@qq.com
 * @LastEditTime: 2025-10-11 17:40:54
 * @FilePath: \qianyi-ui\src\views\fbm\orderRule\orderConfirmRule\components\rule-model\model-info\base-info\orderTotalWeightFilter\index.vue
 * @Description: 
 * 
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved. 
-->
<script setup lang="ts">
import { useI18n } from 'vue-i18n';
const { t } = useI18n();

// 表单数据
const formData = ref<Record<string, any>>({
	minPrice: '', // 最小值
	maxPrice: '', // 最大值
});
const formRef = ref<any>(null);
// 表单校验
const rules = ref({});
const init = () => {
	// 重置数据
	formData.value = {
		minPrice: '', // 最小值
		maxPrice: '', // 最大值
	};
};

// weight
// 获取提交值
const validateForm = async () => {
	await formRef.value.validate();
	if (Number(formData.value.minPrice) > Number(formData.value.maxPrice) && formData.value.maxPrice && formData.value.minPrice) {
		return new Promise((resolve, reject) => {
			reject('错误：最小值不能大于最大值');
		});
	} else if (!formData.value.minPrice && !formData.value.maxPrice) {
		return new Promise((resolve, reject) => {
			reject('错误：请至少填写一项范围');
		});
	} else if (formData.value.minPrice && formData.value.maxPrice) {
		const getFormData = {
			weight: `weight >= ${formData.value.minPrice} && weight <= ${formData.value.maxPrice}`,
		};
		return getFormData;
	} else if (formData.value.minPrice && !formData.value.maxPrice) {
		const getFormData = {
			weight: `weight >= ${formData.value.minPrice}`,
		};
		return getFormData;
	} else if (!formData.value.minPrice && formData.value.maxPrice) {
		const getFormData = {
			weight: `weight <= ${formData.value.maxPrice}`,
		};
		return getFormData;
	}
};
// 设置回显值
const setFormData = (data: Record<string, any>) => {
	if (!data || !data.weight) {
		return '错误：无效的数据格式，缺少 weight 字段';
	}

	const priceStr = data.weight;

	// 使用正则表达式解析范围
	const regex = /weight\s*([><]=?)\s*([\d.]+)(?:\s*&&\s*weight\s*([><]=?)\s*([\d.]+))?/;
	const match = priceStr.match(regex);

	if (!match) {
		return '错误：无法解析范围格式';
	}
	// 重置表单数据
	formData.value.minPrice = '';
	formData.value.maxPrice = '';

	// 解析匹配结果
	const operator1 = match[1];
	const value1 = parseFloat(match[2]);
	const operator2 = match[3];
	const value2 = match[4] ? parseFloat(match[4]) : '';
	// 根据操作符设置表单数据
	if (operator1 === '>=' || operator1 === '>') {
		formData.value.minPrice = value1.toString();
	} else if (operator1 === '<=' || operator1 === '<') {
		formData.value.maxPrice = value1.toString();
	}
	if (operator2) {
		if (operator2 === '<=' || operator2 === '<') {
			formData.value.maxPrice = value2.toString();
		} else if (operator2 === '>=' || operator2 === '>') {
			formData.value.minPrice = value2.toString();
		}
	}
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
					<el-form-item :label="t('订单总重量')">
						<template #label>
							<span
								:style="{
									color: '#f78c8c',
									marginRight: '3px',
								}"
								>*
							</span>
							<span>{{ t('订单总重量') }}</span>
						</template>
						<el-row style="width: 100%">
							<el-col :span="22">
								<el-input type="number" v-model="formData.minPrice" style="width: 220px" placeholder="(含)最小值">
									<template #append>g</template>
								</el-input>
								~
								<el-input type="number" v-model="formData.maxPrice" style="width: 220px" placeholder="(含)最大值">
									<template #append>g</template>
								</el-input>
								<span class="span">至少填写一项</span>
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
