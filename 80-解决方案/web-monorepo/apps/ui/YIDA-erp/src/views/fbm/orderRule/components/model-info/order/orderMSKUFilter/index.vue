<!--
 * @Author: YIDA 3136271519@qq.com
 * @Date: 2025-10-09 16:51:25
 * @LastEditors: YIDA 3136271519@qq.com
 * @LastEditTime: 2025-10-11 18:24:35
 * @FilePath: \qianyi-ui\src\views\fbm\orderRule\orderConfirmRule\components\rule-model\model-info\order\orderMSKUFilter\index.vue
 * @Description: 
 * 
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved. 
-->
<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { isInToValidateForm, isInToSetFormData } from '/@/views/fbm/orderRule/components/utils/index';
const { t } = useI18n();

// 表单数据
const formData = ref<Record<string, any>>({
	mskuCode: [], // 订单MSKU
	isBelong: '1', // 是否属于
});
const formRef = ref<any>(null);
// 表单校验
const rules = ref({
	mskuCode: [{ required: true, message: '请选择订单MSKU', trigger: 'blur' }],
});
const init = () => {
	// 重置数据
	formData.value = {
		mskuCode: [], // 订单MSKU
		isBelong: '1', // 是否属于
	};
};
// 处理输入框失去焦点事件
const handleBlur = async () => {
	// 等待渲染完成
	await nextTick();
	// 如果有逗号分隔的项，进行拆分并去重
	const valuesArr = Array.from(formData.value.mskuCode) as string[];
	if (valuesArr && valuesArr.length > 0) {
		const newValues = valuesArr
			.map((item: string) => item.split(',')) // 按逗号拆分
			.flat() // 展平数组
			.map((item: string) => item.trim()) // 去除前后空格
			.filter((item: string) => item !== ''); // 过滤空字符串
		// 去重
		formData.value.mskuCode = Array.from(new Set(newValues));
	} else {
		formData.value.mskuCode = [];
	}
};

// 获取提交值
const validateForm = async () => {
	await formRef.value.validate();
	return isInToValidateForm(formData.value.isBelong, 'mskuCode', formData.value.mskuCode);
};
// 设置回显值
const setFormData = (data: Record<string, any>) => {
	// 设置数据
	return isInToSetFormData(data, 'mskuCode', formData);
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
					<el-form-item :label="t('订单MSKU')" prop="mskuCode">
						<el-row style="width: 100%">
							<el-col :span="24"> 支持批量复制不同分项按逗号分隔,按回车(Enter)键或点击鼠标完成输入 (已填写{{ formData.mskuCode.length }} 项) </el-col>
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
								<el-input-tag v-model="formData.mskuCode" trigger="Enter" @blur="handleBlur" />
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
