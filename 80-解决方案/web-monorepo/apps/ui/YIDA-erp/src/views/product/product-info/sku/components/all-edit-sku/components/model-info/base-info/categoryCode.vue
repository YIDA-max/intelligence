<!--
 * @Author: YIDA 3136271519@qq.com
 * @Date: 2025-10-09 17:58:38
 * @LastEditors: YIDA 3136271519@qq.com
 * @LastEditTime: 2025-12-17 14:32:03
 * @FilePath: \qianyi-ui\src\views\product\product-info\sku\components\all-edit-sku\components\model-info\base-info\categoryCode.vue
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
	categoryCode: string;
}>({
	categoryCode: '', // 类目
});
const formRef = ref<any>(null);
// 表单校验
const rules = ref({
	categoryCode: [{ required: true, message: '请选择类目', trigger: 'blur' }],
});
const init = () => {
	// 重置数据
	formData.value = {
		categoryCode: '', // 类目
	};
};
// 获取提交值
const validateForm = async () => {
	await formRef.value.validate();
	const getFormData = {
		categoryCode: formData.value.categoryCode,
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
					<el-form-item :label="t('类目')" prop="categoryCode">
						<el-row style="width: 100%">
							<el-col :span="22">
								<el-tree-select
									:show-all-levels="false"
									v-model="formData.categoryCode"
									filterable
									:checkStrictly="true"
									placeholder="请选择"
									:data="dictMap.categoryCode"
									:props="{
										value: 'id',
										label: 'name',
										children: 'children',
										emitPath: false,
										checkStrictly: true,
									}"
									:style="{ width: '300px' }"
								>
								</el-tree-select>
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
