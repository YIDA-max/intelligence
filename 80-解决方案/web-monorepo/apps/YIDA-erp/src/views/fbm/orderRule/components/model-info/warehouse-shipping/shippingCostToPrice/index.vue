<!--
 * @Author: YIDA 3136271519@qq.com
 * @Date: 2025-10-09 16:51:25
 * @LastEditors: YIDA zhuhansong@merach.com
 * @LastEditTime: 2026-05-25 10:21:51
 * @FilePath: \qianyi-ui\src\views\fbm\orderRule\components\model-info\warehouse-shipping\shippingCostToPrice\index.vue
 * @Description: 运费售价比上限 - 物流费用不可超过售价的指定百分比，提交字段 ruleConditionReview.shippingCostToPrice
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
-->
<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

// 表单数据
const formData = ref<Record<string, any>>({
	shippingCostToPrice: '', // 运费售价比上限（%）
});
// 表单引用
const formRef = ref<any>(null);
// 表单校验：百分比必填
const rules = ref({
	shippingCostToPrice: [
		{ required: true, message: '请填写运费售价比上限', trigger: 'blur' },
	],
});

/**
 * 初始化/重置表单（弹窗打开、新增规则时由 orderAuditRule/rule-model 调用）
 */
const init = () => {
	formData.value = {
		shippingCostToPrice: '',
	};
};

/**
 * 获取提交值
 * 物流费用不可超过售价 X% → 生成规则表达式 shippingCostToPrice <= X
 */
const validateForm = async () => {
	await formRef.value.validate();
	const percent = formData.value.shippingCostToPrice;
	// 1. 空值校验
	if (percent === '' || percent === null || percent === undefined) {
		return Promise.reject('错误：请填写运费售价比上限');
	}
	const num = Number(percent);
	// 2. 有效数字与负数校验
	if (Number.isNaN(num) || num < 0) {
		return Promise.reject('错误：请填写有效的百分比');
	}
	// 3. 【新增】最多两位小数校验
	// 使用正则检查字符串形式，防止 Number 类型在边界情况下的精度误差
	const reg = /^\d+(\.\d{1,2})?$/;
	if (!reg.test(String(percent))) {
		return Promise.reject('错误：运费售价比上限最多只能输入两位小数');
	}

	const getFormData = {
		shippingCostToPrice: `shippingCostToPrice <= ${percent}`,
	};
	return getFormData;
};

/**
 * 设置回显值（编辑/复制规则时调用）
 * 支持表达式 shippingCostToPrice <= 30 或纯数字 30
 */
const setFormData = (data: Record<string, any>) => {
	if (!data?.shippingCostToPrice) {
		return '错误：无效的数据格式，缺少 shippingCostToPrice 字段';
	}
	const priceStr = String(data.shippingCostToPrice).trim();
	// 解析表达式格式
	const match = priceStr.match(/shippingCostToPrice\s*<=?\s*([\d.]+)/);
	if (match) {
		formData.value.shippingCostToPrice = match[1];
		return;
	}
	// 兼容后端仅存纯数字的情况
	if (/^[\d.]+$/.test(priceStr)) {
		formData.value.shippingCostToPrice = priceStr;
		return;
	}
	return '错误：无法解析运费售价比上限格式';
};

// 暴露方法给 orderAuditRule/rule-model 父组件
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
					<!-- 物流费用不可超过售价【】% -->
					<el-form-item :label="t('运费售价比上限')" prop="shippingCostToPrice">
						<el-row style="width: 100%">
							<el-col :span="24" class="flex items-center">
								<span class="mr-2">
									{{ t('物流费用不可超过售价') }}
								</span>
								<el-input
									type="number"
									v-model="formData.shippingCostToPrice"
									style="width: 120px"
									placeholder="请输入"
									:min="0"
									:step="0.01"
								/>
								<span class="percent-suffix">%</span>
							</el-col>
							<el-col :span="24">
								<p class="form-hint">
									【{{ t('如没有比价结果，则算符合此条件') }}】
								</p>
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
.percent-suffix {
	margin-left: 8px;
}
.form-hint {
	margin: 4px 0 0;
	font-size: 12px;
	color: var(--el-text-color-secondary);
	line-height: 1.5;
}
</style>
