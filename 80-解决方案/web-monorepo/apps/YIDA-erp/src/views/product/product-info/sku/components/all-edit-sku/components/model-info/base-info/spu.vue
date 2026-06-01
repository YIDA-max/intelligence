<!--
 * @Author: YIDA 3136271519@qq.com
 * @Date: 2025-10-09 17:58:38
 * @LastEditors: YIDA 3136271519@qq.com
 * @LastEditTime: 2025-12-17 14:33:10
 * @FilePath: \qianyi-ui\src\views\product\product-info\sku\components\all-edit-sku\components\model-info\base-info\spu.vue
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
	spuCode: string;
}>({
	spuCode: '', // SPU
});
const formRef = ref<any>(null);
// 表单校验
const rules = ref({
	spuCode: [{ required: false, message: '请选择SPU', trigger: 'blur' }],
});
const init = () => {
	// 重置数据
	formData.value = {
		spuCode: '', // SPU
	};
};
// 获取提交值
const validateForm = async () => {
	await formRef.value.validate();
	const getFormData = {
		spuCode: formData.value.spuCode,
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
					<el-form-item :label="t('SPU')" prop="spuCode">
						<el-select
							v-model="formData.spuCode"
							filterable
							placeholder="请选择"
							:style="{ width: '300px' }"
						>
							<el-option
								v-for="item in dictMap.spuInfo"
								:key="item.spuName"
								:label="`${item.spuCode} - ${item.spuName}`"
								:value="item.spuCode"
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
