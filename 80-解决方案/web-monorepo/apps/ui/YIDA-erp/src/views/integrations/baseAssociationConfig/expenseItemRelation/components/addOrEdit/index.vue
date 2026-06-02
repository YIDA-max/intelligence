<!--
 * @Author: YIDA 3136271519@qq.com
 * @Date: 2026-01-29 18:30:00
 * @LastEditors: YIDA 3136271519@qq.com
 * @LastEditTime: 2026-02-07 10:08:03
 * @FilePath: \qianyi-ui\src\views\integrations\baseAssociationConfig\expenseItemRelation\components\addOrEdit\index.vue
 * @Description: 添加/编辑费用项目关系组件
 * 
 * Copyright (c) 2026 by ${git_name_email}, All Rights Reserved. 
-->
<script setup lang="ts">
import { computed } from 'vue';
import type { FormRules } from 'element-plus';
import {
	addExpenseItemRelation,
	updateExpenseItemRelation,
	getExpenseItemRelationDetail,
} from '/@/api/integrations/baseAssociationConfig/expenseItemRelation/index';
import { getKingdeeFeeItemList } from '/@/api/integrations/common';
import { useFormDialog } from './hooks/index';
import { useMultipleDicts } from '/@/hooks/multipleDicts';
import { getDicts } from '/@/api/admin/dict';
import { feeConfig } from '/@/api/materialFlow/firstMileLogistics/index';

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

// 获取下拉选项数据
const { dictMap, reload } = useMultipleDicts(
	[
		{
			key: 'kingdeeBusinessModule',
			fetchFn: getDicts,
			params: 'kingdee_business_module',
		}, // 业务模块
		{
			key: 'kingdeeExpenseType',
			fetchFn: getDicts,
			params: 'kingdee_expense_type',
		}, // 费用类型
		{
			key: 'kingdeeFeeItem',
			fetchFn: getKingdeeFeeItemList,
		}, // 金蝶费用项目
		{
			key: 'feeConfig',
			fetchFn: feeConfig,
		}, // 费用项目配置
	],
	{
		isAuto: false,
	}
);

const kingdeeBusinessModuleOptions = computed(() => {
	return (dictMap.value.kingdeeBusinessModule || []).map((item: any) => ({
		label: item.label,
		value: item.value,
	}));
});

const kingdeeExpenseTypeOptions = computed(() => {
	return (dictMap.value.kingdeeExpenseType || []).map((item: any) => ({
		label: item.label,
		value: item.value,
	}));
});

const feeConfigOptions = computed(() => {
	return (dictMap.value.feeConfig || []).map((item: any) => ({
		label: item.label || item.feeItem,
		value: item.value || item.id,
	}));
});

const kingdeeFeeItemOptions = computed(() => {
	return (dictMap.value.kingdeeFeeItem || []).map((item: any) => ({
		label: `${item.kingdeeFeeCode}-${item.kingdeeFeeName}`,
		value: item.kingdeeFeeCode,
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
		businessModule: '',
		expenseType: '',
		expenseItemId: '',
		kingdeeExpenseCode: '',
	}),
	// 表单验证规则（所有字段都是可选的）
	formRules: {
		businessModule: [
			{ required: true, message: '请选择业务模块', trigger: 'change' },
		],
		expenseType: [
			{ required: true, message: '请选择费用类型', trigger: 'change' },
		],
		expenseItemId: [
			{ required: true, message: '请选择费用项目名称', trigger: 'change' },
		],
		kingdeeExpenseCode: [
			{ required: true, message: '请选择金蝶费用项目', trigger: 'change' },
		],
	} as FormRules,
	// API 接口
	addApi: addExpenseItemRelation,
	updateApi: updateExpenseItemRelation,
	getDetailApi: getExpenseItemRelationDetail,
	// 成功回调
	onSuccess: () => {
		emit('getDataList');
	},
	// 提交前的数据处理
	beforeSubmit: (data: any) => {
		return {
			...data,
			// 费用项目名称 因为后台的拿的比较的麻烦，就直接前端给了
			expenseItemName: dictMap.value.feeConfig.find(
				(item: any) => item.id === data.expenseItemId
			)?.feeItem,
		};
	},
});

// 打开弹窗（适配组件使用方式）
const handleOpen = () => {
	reload();
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
							<el-form-item label="业务模块" prop="businessModule">
								<el-select-v2
									v-model="formData.businessModule"
									placeholder="请选择"
									clearable
									filterable
									style="width: 100%"
									:disabled="type === 'edit'"
									:options="kingdeeBusinessModuleOptions"
								/>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row :gutter="20" class="mb-3">
						<el-col :span="24">
							<el-form-item label="费用类型" prop="expenseType">
								<el-select-v2
									v-model="formData.expenseType"
									placeholder="请选择"
									clearable
									filterable
									style="width: 100%"
									:disabled="type === 'edit'"
									:options="kingdeeExpenseTypeOptions"
								/>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row :gutter="20" class="mb-3">
						<el-col :span="24">
							<el-form-item label="费用项目名称" prop="expenseItemId">
								<el-select-v2
									v-model="formData.expenseItemId"
									placeholder="请选择"
									clearable
									filterable
									style="width: 100%"
									:disabled="type === 'edit'"
									:options="feeConfigOptions"
								/>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row :gutter="20" class="mb-3">
						<el-col :span="24">
							<el-form-item label="金蝶费用项目" prop="kingdeeExpenseCode">
								<el-select-v2
									v-model="formData.kingdeeExpenseCode"
									placeholder="请选择"
									clearable
									filterable
									style="width: 100%"
									:options="kingdeeFeeItemOptions"
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
