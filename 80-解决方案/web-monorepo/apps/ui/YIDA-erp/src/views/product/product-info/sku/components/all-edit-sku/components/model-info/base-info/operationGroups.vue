<!--
 * @Author: YIDA 3136271519@qq.com
 * @Date: 2025-10-09 17:58:38
 * @LastEditors: YIDA 3136271519@qq.com
 * @LastEditTime: 2025-12-08 11:52:54
 * @FilePath: \qianyi-ui\src\views\product\product-info\sku\components\all-edit-sku\components\model-info\base-info\operationGroups.vue
 * @Description: 
 * 
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved. 
-->
<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { getDeptLastDeptByCondition } from '/@/api/admin/dept';
const { t } = useI18n();
const TreeSelectInput = defineAsyncComponent(
	() => import('/@/components/TableFormModule/tree-select-input.vue')
);

// 表单数据
const formData = ref<{
	operationGroups: string;
}>({
	operationGroups: '', // 运营组
});
const formRef = ref<any>(null);
// 表单校验
const rules = ref({
	operationGroups: [
		{ required: false, message: '请选择运营组', trigger: 'blur' },
	],
});
const init = () => {
	// 重置数据
	formData.value = {
		operationGroups: '', // 运营组
	};
};
// 获取提交值
const validateForm = async () => {
	await formRef.value.validate();
	const getFormData = {
		operationGroups: formData.value.operationGroups,
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
					<el-form-item :label="t('运营组')" prop="operationGroups">
						<el-row style="width: 100%">
							<el-col :span="22">
								<TreeSelectInput
									v-model:queryForm="formData"
									:style="{ width: '300px' }"
									:settings="{
										getTreeData: getDeptLastDeptByCondition,
										getTreeDataParams: {
											deptName: '运营中心',
										},
										text: '运营组',
										width: '100%',
										code: 'operationGroups',
										selectTreeProps: {
											value: 'deptId',
											label: 'name',
											children: 'children',
										},
										getIdsCode: 'deptId',
									}"
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
