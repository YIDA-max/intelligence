<!--
 * @Author: 朱寒松 3136271519@qq.com
 * @Date: 2025-07-16 09:58:38
 * @LastEditors: YIDA 3136271519@qq.com
 * @LastEditTime: 2026-01-08 20:50:11
 * @FilePath: \qianyi-ui\src\views\product\product-info\sku\components\associate-skuDepts.vue
 * @Description: 
 * 
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved. 
-->
<template>
	<el-dialog
		v-bind="$attrs"
		width="30%"
		:close-on-click-modal="false"
		draggable
		@open="init"
		:title="'分配运营组'"
	>
		<el-form
			ref="dataFormRef"
			:model="localFormData"
			label-width="100px"
			:rules="purchaseInfoRule"
		>
			<el-row class="mb18">
				<el-col :span="24">
					<el-form-item :label="$t('运营组')" prop="skuDepts">
						<TreeSelectInput
							v-model:queryForm="localFormData"
							:style="{ width: '100%' }"
							:settings="{
								getTreeData: getDeptLastDeptByCondition,
								getTreeDataParams: {
									deptName: '运营中心',
								},
								text: '运营组',
								width: '100%',
								searchFn: () => {},
								code: 'skuDepts',
								selectTreeProps: {
									value: 'deptId',
									label: 'name',
									children: 'children',
								},
								getIdsCode: 'deptId',
							}"
						/>
					</el-form-item>
				</el-col>
			</el-row>
		</el-form>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="closeDialog" :disabled="loading">{{
					$t('取消')
				}}</el-button>
				<el-button type="primary" @click="onSubmit" :disabled="loading">
					{{ $t('确定') }}
				</el-button>
			</span>
		</template>
	</el-dialog>
</template>

<script setup lang="ts">
import { useMessage } from '/@/hooks/message';
import { ref, reactive, defineAsyncComponent } from 'vue';
import { getDeptLastDeptByCondition } from '/@/api/admin/dept';
import { postSkuAssignOperationGroup } from '/@/api/product/sku';
const TreeSelectInput = defineAsyncComponent(
	() => import('/@/components/TableFormModule/tree-select-input.vue')
);
const emit = defineEmits(['closeDialog']);
const props = defineProps({
	selectedRows: {
		type: Array,
		default: () => [],
	},
});
const loading = ref(false);
const purchaseInfoRule = reactive({
	skuDepts: [{ required: true, message: '运营组不能为空', trigger: 'blur' }],
});
const localFormData = ref({
	skuDepts: [],
});
//  当前form的ref
const dataFormRef = ref();
const init = () => {
	// 初始化逻辑
	localFormData.value.skuDepts = [];
	loading.value = false;
	// 清除表单验证
	dataFormRef.value.clearValidate();
};
// 提交表单
const onSubmit = async () => {
	loading.value = true;
	const isValid = await dataFormRef.value.validate();
	if (!isValid) {
		useMessage().warning('请填写必填项');
		return;
	}
	try {
		const res = await postSkuAssignOperationGroup({
			skuCodes: props.selectedRows.map((item: any) => item.skuCode),
			skuDepts: localFormData.value.skuDepts.map((item: any) => {
				return {
					deptId: item,
					skuCode: '',
				};
			}),
		});
		if (res.code === 0) {
			loading.value = false;
			useMessage().success('分配成功');
			// 提交数据逻辑
			emit('closeDialog');
		}
	} catch (error: any) {
		useMessage().error(error.message || '分配失败');
		return;
	}
};
const closeDialog = () => {
	emit('closeDialog');
	// 关闭弹窗逻辑
};
</script>
<style scoped lang="scss"></style>
