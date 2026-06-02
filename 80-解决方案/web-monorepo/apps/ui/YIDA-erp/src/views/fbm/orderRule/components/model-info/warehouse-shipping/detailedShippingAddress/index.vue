<!--
 * @Author: YIDA 3136271519@qq.com
 * @Date: 2025-10-09 16:51:25
 * @LastEditors: YIDA 3136271519@qq.com
 * @LastEditTime: 2025-10-13 15:47:19
 * @FilePath: \qianyi-ui\src\views\fbm\orderRule\orderConfirmRule\components\rule-model\model-info\warehouse-shipping\platformWarehouseIdFilter\index.vue
 * @Description: 
 * 
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved. 
-->
<script setup lang="ts">
import { useI18n } from 'vue-i18n';
const { t } = useI18n();

// 表单数据
const formData = ref<Record<string, any>>({
	platformWareId: [], // 平台仓库ID
	isBelong: '1', // 是否属于
});
const formRef = ref<any>(null);
// 表单校验
const rules = ref({
	platformWareId: [{ required: true, message: '请选择平台仓库ID', trigger: 'blur' }],
});
const init = () => {
	// 重置数据
	formData.value = {
		platformWareId: [], // 平台仓库ID
		isBelong: '1', // 是否属于
	};
};
// 处理输入框失去焦点事件
const handleBlur = async () => {
	// 等待渲染完成
	await nextTick();
	// 如果有逗号分隔的项，进行拆分并去重
	const valuesArr = Array.from(formData.value.platformWareId) as string[];
	if (valuesArr && valuesArr.length > 0) {
		const newValues = valuesArr
			.map((item: string) => item.split(',')) // 按逗号拆分
			.flat() // 展平数组
			.map((item: string) => item.trim()) // 去除前后空格
			.filter((item: string) => item !== ''); // 过滤空字符串
		// 去重
		formData.value.platformWareId = Array.from(new Set(newValues));
	} else {
		formData.value.platformWareId = [];
	}
};

// 获取提交值
const validateForm = async () => {
	await formRef.value.validate();
	if (formData.value.isBelong === '1') {
		const getFormData = {
			platformWareId: `platformWareId in [${formData.value.platformWareId}]`,
		};
		return getFormData;
	} else if (formData.value.isBelong === '2') {
		const getFormData = {
			platformWareId: `!(platformWareId in [${formData.value.platformWareId}])`,
		};
		return getFormData;
	}
};
// 设置回显值
const setFormData = (data: Record<string, any>) => {
	// 设置数据
	if (!data || !data.platformWareId) {
		return '错误：无效的数据格式';
	}
	// 用于匹配是否排除的正则表达式(需要优先匹配 排除)
	const excludeMatch = data.platformWareId.match(/!\(platformWareId in \[([^\]]+)\]\)/);
	if (excludeMatch) {
		formData.value.isBelong = '2';
		formData.value.platformWareId = excludeMatch[1].split(',').map((item: string) => item.trim());
		return '成功设置数据';
	}
	// 用于匹配是否包含指定的正则表达式
	const match = data.platformWareId.match(/platformWareId in \[([^\]]+)\]/);
	if (match) {
		formData.value.isBelong = '1';
		formData.value.platformWareId = match[1].split(',').map((item: string) => item.trim());
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
					<el-form-item :label="t('详细收货地址')" prop="platformWareId">
						<el-row style="width: 100%">
							<el-col :span="24">
								支持批量复制不同分项按逗号分隔,按回车(Enter)键或点击鼠标完成输入 (已填写{{ formData.platformWareId.length }} 项)
							</el-col>
						</el-row>
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
								<el-input-tag v-model="formData.platformWareId" trigger="Enter" @blur="handleBlur" />
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
