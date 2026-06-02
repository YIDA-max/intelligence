<!--
 * @Author: YIDA 3136271519@qq.com
 * @Date: 2025-10-09 17:58:38
 * @LastEditors: YIDA 3136271519@qq.com
 * @LastEditTime: 2025-10-11 17:51:27
 * @FilePath: \qianyi-ui\src\views\fbm\orderRule\orderConfirmRule\components\rule-model\model-info\base-info\hasBuyerNoteFilter\index.vue
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
	color: string;
}>({
	color: '', // 颜色
});
const formRef = ref<any>(null);
// 表单校验
const rules = ref({
	color: [{ required: false, message: '请选择颜色', trigger: 'blur' }],
});
const init = () => {
	// 重置数据
	formData.value = {
		color: '', // 颜色
	};
};
// 获取提交值
const validateForm = async () => {
	await formRef.value.validate();
	const getFormData = {
		color: formData.value.color,
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
					<el-form-item :label="t('颜色')" prop="color">
						<el-select
							v-model="formData.color"
							filterable
							placeholder="请选择"
							:style="{ width: '300px' }"
						>
							<el-option
								v-for="item in dictMap.color"
								:key="item.value"
								:label="item.label"
								:value="item.value"
							/>
						</el-select>
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
