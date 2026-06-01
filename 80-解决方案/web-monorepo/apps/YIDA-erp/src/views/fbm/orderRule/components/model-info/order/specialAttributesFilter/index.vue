<!--
 * @Author: YIDA 3136271519@qq.com
 * @Date: 2025-10-09 17:58:38
 * @LastEditors: YIDA 3136271519@qq.com
 * @LastEditTime: 2025-10-29 19:15:16
 * @FilePath: \qianyi-ui\src\views\fbm\orderRule\components\model-info\order\specialAttributesFilter\index.vue
 * @Description: 
 * 
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved. 
-->
<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { Ref, inject } from 'vue';
const { t } = useI18n();
const dictMap = inject<Ref<any>>('dictMap');
// 表单数据
const formData = ref<Record<string, any>>({
	specialAttribute: [], // 特殊属性
	isBelong: '1',
});
const formRef = ref<any>(null);
// 表单校验
const rules = ref({
	specialAttribute: [{ required: true, message: '请选择特殊属性', trigger: 'blur' }],
});
const init = () => {
	// 重置数据
	formData.value = {
		specialAttribute: [], // 特殊属性
		isBelong: '1',
	};
};

// 获取提交值
const validateForm = async () => {
	await formRef.value.validate();
	const getFormData = {
		[`specialAttribute`]: `specialAttribute in [${formData.value.specialAttribute.map((item: any) => `${item}`)}]`,
	};
	return getFormData;
};
// 设置回显值
const setFormData = (data: Record<string, any>) => {
	// 用于匹配是否包含指定平台的正则表达式
	const regexInclude = new RegExp(`${`specialAttribute`} in \\[([^\\]]+)\\]`);
	const match = data[`specialAttribute`].match(regexInclude);
	if (match) {
		formData.value.isBelong = '1';
		formData.value[`specialAttribute`] = match[1]
			.split(',') // 切割字符串
			.map((item: string) => item.trim().replace(/'/g, '')) // 去除空格和引号
			.map((item: string) => String(item)); // 转换为字符串
		return '成功设置数据：包含指定平台';
	}
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
					<el-form-item :label="t('订单特殊属性')" prop="specialAttribute">
						<el-row style="width: 100%">
							<el-col :span="24">
								<el-checkbox-group v-model="formData.specialAttribute">
									<el-checkbox v-for="(item, index) in dictMap.specialAttribute" :key="index" :label="item.label" :value="String(item.value)" />
								</el-checkbox-group>
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
