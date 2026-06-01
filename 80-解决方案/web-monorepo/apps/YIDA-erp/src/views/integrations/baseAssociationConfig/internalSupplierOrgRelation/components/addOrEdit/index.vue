<!--
 * @Author: YIDA 3136271519@qq.com
 * @Date: 2026-01-29 18:30:00
 * @LastEditors: wuyueqin wuyueqin@merach.com
 * @LastEditTime: 2026-03-19 15:06:22
 * @FilePath: \qianyi-ui\src\views\integrations\baseAssociationConfig\internalSupplierOrgRelation\components\addOrEdit\index.vue
 * @Description: 添加/编辑内部供应商与组织关系组件
 * 
 * Copyright (c) 2026 by ${git_name_email}, All Rights Reserved. 
-->
<script setup lang="ts">
import { computed, nextTick } from 'vue';
import type { FormRules } from 'element-plus';
import {
	addInternalSupplierOrgRelation,
	updateInternalSupplierOrgRelation,
	getInternalSupplierOrgRelationDetail,
} from '/@/api/integrations/baseAssociationConfig/internalSupplierOrgRelation/index';
import { useFormDialog } from './hooks/index';
import SelectInputApi from '/@/componentsApi/SelectInputApi/index.vue';

interface Props {
	type?: 'add' | 'edit';
	row?: { id: string };
}

const props = withDefaults(defineProps<Props>(), {
	type: 'add',
	row: () => ({ id: '' }),
});

const emit = defineEmits<{
	(e: 'getDataList'): void;
}>();

// 使用表单管理 Hook
const {
	visible,
	loading,
	formRef,
	formData,
	rules,
	handleOpen: openDialog,
	handleClose,
	onSubmit: submitForm,
	getTitle,
} = useFormDialog({
	// 初始表单数据
	initialFormData: () => ({
		legalPersonId: '', // 仟易主体ID
		kingdeeOrgCode: '',
		kingdeeSupplierCode: '',
	}),
	// 表单验证规则
	formRules: {
		legalPersonId: [
			{ required: true, message: '请选择仟易主体', trigger: 'change' },
		],
		kingdeeOrgCode: [
			{
				required: true,
				message: '请选择供应商对应的金蝶组织',
				trigger: 'change',
			},
		],
		kingdeeSupplierCode: [
			{ required: true, message: '请输入金蝶内部供应商', trigger: 'blur' },
		],
	} as FormRules,
	// API 接口
	addApi: addInternalSupplierOrgRelation,
	updateApi: updateInternalSupplierOrgRelation,
	getDetailApi: getInternalSupplierOrgRelationDetail,
	// 成功回调
	onSuccess: () => {
		emit('getDataList');
	},
});

// 打开弹窗（适配组件使用方式）
const handleOpen = () => {
	nextTick(() => {
		openDialog(props.type, props.row);
	});
};

// 提交表单（适配组件使用方式）
const onSubmit = () => {
	submitForm(props.type, props.row);
};

// 计算弹窗标题
const title = computed(() => getTitle(props.type));

// 暴露方法供外部调用
defineExpose({
	handleOpen,
	handleClose,
});
</script>
<template>
	<div>
		<!-- 具名插槽：如果传入了插槽内容，使用传入的内容，否则使用默认按钮 -->
		<slot name="trigger" :openDialog="handleOpen">
			<!-- 默认按钮：添加模式 -->
			<el-button
				v-if="type === 'add'"
				type="primary"
				@click="handleOpen"
				class="mr10"
			>
				{{ $t('common.addBtn') }}
			</el-button>
			<!-- 默认按钮：编辑模式 -->
			<el-link
				v-else
				type="primary"
				underline="never"
				@click="handleOpen"
				class="mr10"
			>
				{{ $t('common.editBtn') }}
			</el-link>
		</slot>

		<!-- 弹窗 -->
		<el-dialog
			v-model="visible"
			:close-on-click-modal="false"
			:title="title"
			width="800px"
			@close="handleClose"
			:append-to-body="true"
			draggable
		>
			<div class="dialog-container" v-loading="loading">
				<el-form
					label-width="160px"
					ref="formRef"
					:model="formData"
					:rules="rules"
				>
					<el-row :gutter="20" class="mb-3">
						<el-col :span="24">
							<el-form-item
								prop="legalPersonId"
								label-width="180"
								label="仟易主体"
							>
								<SelectInputApi
									v-model="formData.legalPersonId"
									componentType="legalEntity"
									:disabled="type === 'edit'"
								/>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row :gutter="20" class="mb-3">
						<el-col :span="24">
							<el-form-item
								prop="kingdeeSupplierCode"
								label-width="180"
								label="金蝶内部供应商"
							>
								<SelectInputApi
									v-model="formData.kingdeeSupplierCode"
									componentType="kingdeeSupplier"
								/>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row :gutter="20" class="mb-3">
						<el-col :span="24">
							<el-form-item
								prop="kingdeeOrgCode"
								label-width="180"
								label="供应商对应的金蝶组织"
							>
								<SelectInputApi
									v-model="formData.kingdeeOrgCode"
									componentType="kingdeeOrg"
								/>
							</el-form-item>
						</el-col>
					</el-row>
				</el-form>
			</div>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="handleClose">{{
						$t('common.cancelButtonText')
					}}</el-button>
					<el-button type="primary" @click="onSubmit">{{
						$t('common.confirmButtonText')
					}}</el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>

<style lang="scss" scoped>
.dialog-container {
	padding: 0 20px;
	max-height: 60vh;
	overflow: auto;
}
</style>
