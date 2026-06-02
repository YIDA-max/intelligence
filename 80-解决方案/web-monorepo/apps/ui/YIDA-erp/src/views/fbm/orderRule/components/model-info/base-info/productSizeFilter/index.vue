<!--
 * @Author: YIDA 3136271519@qq.com
 * @Date: 2025-10-09 17:58:38
 * @LastEditors: YIDA 3136271519@qq.com
 * @LastEditTime: 2025-10-13 15:22:24
 * @FilePath: \qianyi-ui\src\views\fbm\orderRule\orderConfirmRule\components\rule-model\model-info\base-info\productSizeFilter\index.vue
 * @Description: 
 * 
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved. 
-->
<script setup lang="ts">
import { useI18n } from 'vue-i18n';
// 公式编辑器
const BaseFormulaEditor = defineAsyncComponent(() => import('/@/components/BaseFormulaEditor/index.vue'));
const { t } = useI18n();

// 表单数据
const formData = ref<Record<string, any>>({
	productSize: '', // 产品尺寸
	productSizeHtml: '', // 产品尺寸公式html
	testResult: '', // 测试结果
});
const formRef = ref<any>(null);
const BaseFormulaEditorRef = ref<any>(null);
// 表单校验
const rules = ref({});
const init = () => {
	// 重置数据
	formData.value = {
		productSize: '', // 产品尺寸
		productSizeHtml: '', // 产品尺寸公式html
		testResult: '', // 测试结果
	};
};

// 获取提交值
const validateForm = async () => {
	await formRef.value.validate();
	if (!formData.value.productSize) {
		return new Promise((resolve, reject) => {
			reject('错误：请填写产品尺寸公式');
		});
	} else {
		const getFormData = {
			productSize: formData.value.productSize || '',
			productSizeHtml: formData.value.productSizeHtml || '',
		};
		return getFormData;
	}
};
// 设置回显值
const setFormData = (data: Record<string, any>) => {
	// 设置数据
	if (!data || !data.productSize) {
		return '错误：无效的数据格式';
	}
	if (data.productSize !== undefined) {
		formData.value.productSize = data.productSize;
	}
	if (data.productSizeHtml !== undefined) {
		formData.value.productSizeHtml = data.productSizeHtml;
	}
	return '错误：无法解析数据格式';
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
					<el-form-item :label="t('产品尺寸')">
						<template #label>
							<span
								:style="{
									color: '#f78c8c',
									marginRight: '3px',
								}"
								>*
							</span>
							<span>{{ t('产品尺寸') }}</span>
						</template>
						<div v-html="formData.productSizeHtml" class="mr-4"></div>
						<!-- 显示公式的原始字符串 -->
						<div class="mr-4">公式: {{ formData.productSize }}</div>
						<!-- 显示测试结果 -->
						<!-- <div>测试结果: {{ formData.testResult }}</div> -->
						<el-row style="width: 100%">
							<el-col :span="24">
								<el-link
									type="primary"
									underline="never"
									@click="
										() => {
											BaseFormulaEditorRef.show();
										}
									"
								>
									添加公式
								</el-link>
								<BaseFormulaEditor
									ref="BaseFormulaEditorRef"
									@submit="(e: any) => {
										formData.productSizeHtml = e.html;
										formData.productSize = e.formula;
										formData.testResult = e.testResult;
									}"
									:defaultValue="formData?.productSizeHtml"
								/>
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
