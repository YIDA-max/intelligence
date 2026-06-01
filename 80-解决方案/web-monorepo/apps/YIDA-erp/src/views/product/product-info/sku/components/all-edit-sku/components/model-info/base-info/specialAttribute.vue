<!--
 * @Author: YIDA 3136271519@qq.com
 * @Date: 2025-10-09 17:58:38
 * @LastEditors: YIDA 3136271519@qq.com
 * @LastEditTime: 2025-12-08 13:53:24
 * @FilePath: \qianyi-ui\src\views\product\product-info\sku\components\all-edit-sku\components\model-info\base-info\specialAttribute.vue
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
	specialAttribute: string[];
	attributeDesc: string;
}>({
	specialAttribute: [], // 特殊属性
	attributeDesc: '', // 属性说明
});
const formRef = ref<any>(null);
// 表单校验
const rules = ref({
	specialAttribute: [
		{ required: false, message: '请选择特殊属性', trigger: 'blur' },
	],
});
const init = () => {
	// 重置数据
	formData.value = {
		specialAttribute: [], // 特殊属性
		attributeDesc: '', // 属性说明
	};
};
// 获取提交值
const validateForm = async () => {
	await formRef.value.validate();
	const getFormData = {
		specialAttribute: formData.value.specialAttribute?.join(',') || '',
		attributeDesc: formData.value.attributeDesc,
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
					<el-form-item :label="t('特殊属性')" prop="specialAttribute">
						<el-checkbox-group v-model="formData.specialAttribute">
							<el-checkbox
								v-for="item in dictMap.specialAttribute"
								:key="item.value"
								:label="item.label"
								:value="item.value"
							/>
						</el-checkbox-group>
					</el-form-item>
					<el-form-item
						:label="t('属性说明')"
						v-show="formData.specialAttribute.length > 0"
						prop="attributeDesc"
					>
						<el-input
							v-model="formData.attributeDesc"
							:rows="3"
							maxlength="500"
							show-word-limit
							type="textarea"
							placeholder="属性说明"
						/>
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
