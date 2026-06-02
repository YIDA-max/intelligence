<!--
 * @Author: YIDA 3136271519@qq.com
 * @Date: 2026-01-29 18:30:00
 * @LastEditors: wuyueqin wuyueqin@merach.com
 * @LastEditTime: 2026-04-07 16:24:13
 * @FilePath: \qianyi-ui\src\views\integrations\baseAssociationConfig\inventoryOrgRelation\components\addOrEdit\index.vue
 * @Description: 添加/库存组织关系组件
 * 
 * Copyright (c) 2026 by ${git_name_email}, All Rights Reserved. 
-->
<script setup lang="ts">
import { computed } from 'vue';
import type { FormRules } from 'element-plus';
import {
	addInventoryOrgRelation,
	updateInventoryOrgRelation,
	getInventoryOrgRelationDetail,
	getWarehouseIistByOrgId,
	getDeptIistByOrgId,
} from '/@/api/integrations/baseAssociationConfig/index';
import SelectInputApi from '/@/componentsApi/SelectInputApi';
import { useFormDialog } from './hooks/index';
import { ref } from 'vue';

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

const kingdeeWarehouseOptions = ref<any[]>([]);
const kingdeeDeptOptions = ref<any[]>([]);

const kingdeeWarehouseSelectOptions = computed(() => {
	return kingdeeWarehouseOptions.value.map((item: any) => ({
		label: `${item.kingdeeWareCode}-${item.kingdeeWareName}`,
		value: item.kingdeeWareCode,
	}));
});

const kingdeeDeptSelectOptions = computed(() => {
	return kingdeeDeptOptions.value.map((item: any) => ({
		label: `${item.kingdeeDeptCode}-${item.kingdeeDeptName}`,
		value: item.kingdeeDeptCode,
	}));
});

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
		warehouseCode: '', // 仟易仓库代码
		kingdeeInventoryOrgCode: '', // 金蝶库存组织
		kingdeeWarehouseCode: '', // 金蝶仓库名称
		kingdeeVirtualTransitWhCode: '', // 金蝶虚拟在途仓名称
		kingdeeHkVirtualOrgCode: '', // 香港虚拟仓库存组织编码
	}),
	// 表单验证规则
	formRules: {
		warehouseCode: [
			{ required: true, message: '请选择仟易仓库', trigger: 'change' },
		],
		kingdeeInventoryOrgCode: [
			{ required: true, message: '请选择金蝶库存组织', trigger: 'change' },
		],
		kingdeeWarehouseCode: [
			{ required: true, message: '请选择金蝶仓库', trigger: 'change' },
		],
		kingdeeVirtualTransitWhCode: [
			{
				required: true,
				message: '请选择金蝶虚拟在途仓',
				trigger: 'change',
			},
		],
	} as FormRules,
	// API 接口
	addApi: addInventoryOrgRelation,
	updateApi: updateInventoryOrgRelation,
	getDetailApi: getInventoryOrgRelationDetail,
	// 成功回调
	onSuccess: () => {
		emit('getDataList');
	},
});

// 打开弹窗（适配组件使用方式）
const handleOpen = async () => {
	await openDialog(props.type, props.row);
	// 编辑模式下，加载详情后需要根据金蝶库存组织加载对应的金蝶数据
	if (props.type === 'edit' && formData.value.kingdeeInventoryOrgCode) {
		await handleOrgChange(false);
	}
};

// 提交表单（适配组件使用方式）
const onSubmit = () => {
	submitForm(props.type, props.row);
};

// 计算弹窗标题
const title = computed(() => getTitle(props.type));

// 仟易仓库和金蝶库存组织是否都有值
const canSelectOthers = computed(() => {
	return !!(
		formData.value.warehouseCode && formData.value.kingdeeInventoryOrgCode
	);
});

// 处理仟易仓库或金蝶库存组织变化
const handleOrgChange = async (clearFields = true) => {
	const kingdeeInventoryOrgCode = formData.value.kingdeeInventoryOrgCode;

	if (kingdeeInventoryOrgCode) {
		const [whRes, deptRes] = await Promise.all([
			getWarehouseIistByOrgId({ orgId: kingdeeInventoryOrgCode }),
			getDeptIistByOrgId({ orgId: kingdeeInventoryOrgCode }),
		]);

		kingdeeWarehouseOptions.value = whRes.data || [];
		kingdeeDeptOptions.value = deptRes.data || [];
	} else {
		kingdeeWarehouseOptions.value = [];
		kingdeeDeptOptions.value = [];
	}

	// 只在用户手动切换时清空字段，详情加载时不清空
	if (clearFields) {
		formData.value.kingdeeWarehouseCode = '';
		formData.value.kingdeeVirtualTransitWhCode = '';
		// formData.value.kingdeeHkVirtualWareCode = '';
		formData.value.kingdeeHkVirtualOrgCode = '';
		formData.value.kingdeeDeptCode = '';
	}
};

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
							<el-form-item prop="warehouseCode" label="仟易仓库">
								<SelectInputApi
									v-model="formData.warehouseCode"
									componentType="warehouseQianyi"
									:getDataParams="{
										warehouseTypes: [0, 1, 3],
										status: 1,
									}"
									:disabled="type === 'edit'"
									@change="handleOrgChange"
								/>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row :gutter="20" class="mb-3">
						<el-col :span="24">
							<el-form-item prop="kingdeeInventoryOrgCode" label="金蝶库存组织">
								<SelectInputApi
									v-model="formData.kingdeeInventoryOrgCode"
									componentType="kingdeeOrg"
									:disabled="type === 'edit'"
									@change="handleOrgChange"
								/>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row :gutter="20" class="mb-3">
						<el-col :span="24">
							<el-form-item prop="kingdeeWarehouseCode" label="金蝶仓库">
								<el-select-v2
									v-model="formData.kingdeeWarehouseCode"
									placeholder="请选择"
									clearable
									filterable
									:disabled="!canSelectOthers"
									style="width: 100%"
									:options="kingdeeWarehouseSelectOptions"
								/>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row :gutter="20" class="mb-3">
						<el-col :span="24">
							<el-form-item
								prop="kingdeeVirtualTransitWhCode"
								label="金蝶虚拟在途仓"
							>
								<el-select-v2
									v-model="formData.kingdeeVirtualTransitWhCode"
									placeholder="请选择"
									clearable
									filterable
									:disabled="!canSelectOthers"
									style="width: 100%"
									:options="kingdeeWarehouseSelectOptions"
								/>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row :gutter="20" class="mb-3">
						<el-col :span="24">
							<el-form-item prop="kingdeeDeptCode" label="金蝶部门">
								<el-select-v2
									v-model="formData.kingdeeDeptCode"
									placeholder="请选择"
									clearable
									filterable
									:disabled="!canSelectOthers"
									style="width: 100%"
									:options="kingdeeDeptSelectOptions"
								/>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row :gutter="20" class="mb-3">
						<el-col :span="24">
							<el-form-item
								prop="kingdeeHkVirtualWareCode"
								label="金蝶香港虚拟在途仓"
							>
								<SelectInputApi
									v-model="formData.kingdeeHkVirtualWareCode"
									componentType="warehouseInfoKingdee"
									placeholder="请选择"
								/>
								<!-- <el-select-v2
									v-model="formData.kingdeeHkVirtualWareCode"
									placeholder="请选择"
									clearable
									filterable
									:disabled="!canSelectOthers"
									style="width: 100%"
									:options="kingdeeWarehouseSelectOptions"
								/> -->
							</el-form-item>
						</el-col>
					</el-row>
					<el-row :gutter="20" class="mb-3">
						<el-col :span="24">
							<el-form-item
								prop="kingdeeHkVirtualOrgCode"
								label="香港虚拟仓库存组织"
							>
								<SelectInputApi
									v-model="formData.kingdeeHkVirtualOrgCode"
									componentType="kingdeeOrg"
									placeholder="请选择"
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
