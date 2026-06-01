<!--
 * @Author: YIDA 3136271519@qq.com
 * @Date: 2025-10-09 17:58:38
 * @LastEditors: YIDA 3136271519@qq.com
 * @LastEditTime: 2025-10-13 16:21:08
 * @FilePath: \qianyi-ui\src\views\fbm\orderRule\orderConfirmRule\components\rule-model\model-info\order\productCategoryFilter\index.vue
 * @Description: 
 * 
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved. 
-->
<script setup lang="ts">
import { inject, Ref } from 'vue';
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
const dictMap = inject<Ref<any>>('dictMap');

// 表单数据
const formData = ref<Record<string, any>>({
	category: [], // 订单品类
	isBelong: '1',
});
const formRef = ref<any>(null);
// 表单校验
const rules = ref({
	category: [{ required: true, message: '请选择订单品类', trigger: 'blur' }],
});
const init = () => {
	// 重置数据
	formData.value = {
		category: [], // 订单品类
		isBelong: '1',
	};
};

// 获取提交值
const validateForm = async () => {
	await formRef.value.validate();
	if (formData.value.isBelong === '1') {
		const getFormData = {
			category: `category in [${formData.value.category?.map((item: string) => `'${item}'`)}]`,
		};
		return getFormData;
	} else if (formData.value.isBelong === '2') {
		const getFormData = {
			category: `!(category in [${formData.value.category?.map((item: string) => `'${item}'`)}])`,
		};
		return getFormData;
	}
};
// 设置回显值
const setFormData = (data: Record<string, any>) => {
	// 设置数据
	if (!data || !data.category) {
		return '错误：无效的数据格式';
	}
	// 用于匹配是否排除的正则表达式(需要优先匹配 排除)
	const excludeMatch = data.category.match(/!\(category in \[([^\]]+)\]\)/);
	if (excludeMatch) {
		formData.value.isBelong = '2';
		formData.value.category = excludeMatch[1]
			.split(',') // 切割字符串
			.map((item: string) => item.trim().replace(/'/g, '')); // 去除空格和引号
		return '成功设置数据';
	}
	// 用于匹配是否包含指定的正则表达式
	const match = data.category.match(/category in \[([^\]]+)\]/);
	if (match) {
		formData.value.isBelong = '1';
		formData.value.category = match[1]
			.split(',') // 切割字符串
			.map((item: string) => item.trim().replace(/'/g, '')); // 去除空格和引号
		return '成功设置数据';
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
					<el-form-item :label="t('订单品类')" prop="category">
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
								<el-tree-select
									:show-all-levels="false"
									v-model="formData.category"
									filterable
									collapse-tags
									:max-collapse-tags="5"
									clearable
									multiple
									:checkStrictly="true"
									placeholder="订单品类"
									:data="dictMap.categoryCode"
									:props="{ value: 'id', label: 'name', children: 'children', emitPath: false, checkStrictly: true }"
									:style="{ width: '100%' }"
								></el-tree-select>
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
