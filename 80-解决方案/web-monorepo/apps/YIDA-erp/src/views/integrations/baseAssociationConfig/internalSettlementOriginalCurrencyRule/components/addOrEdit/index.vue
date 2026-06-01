<!--
 * @Author: YIDA 3136271519@qq.com
 * @Date: 2026-01-29 18:30:00
 * @LastEditors: YIDA 3136271519@qq.com
 * @LastEditTime: 2026-03-09 11:45:13
 * @FilePath: \qianyi-ui\src\views\integrations\baseAssociationConfig\internalSettlementOriginalCurrencyRule\components\addOrEdit\index.vue
 * @Description: 添加/内部结算原始币规则组件
 * 
 * Copyright (c) 2026 by ${git_name_email}, All Rights Reserved. 
-->
<script setup lang="ts">
import { computed } from 'vue';
import type { FormRules } from 'element-plus';
import {
	addInternalSettlementOriginalCurrencyRule,
	updateInternalSettlementOriginalCurrencyRule,
	getInternalSettlementOriginalCurrencyRuleDetail,
} from '/@/api/integrations/baseAssociationConfig/index';
import {
	getKingdeeOrgList,
	getKingdeeCurrencyList,
} from '/@/api/integrations/common/index';
import { useFormDialog } from './hooks/index';
import { useMultipleDicts } from '/@/hooks/multipleDicts';

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
			key: 'kingdeeOrgList',
			fetchFn: getKingdeeOrgList,
			params: '',
		}, // 金蝶销售组织/采购组织
		{
			key: 'currencyList',
			fetchFn: getKingdeeCurrencyList,
			params: '',
		}, // 金蝶组织核算本位币
	],
	{
		isAuto: false,
	}
);

const kingdeeOrgOptions = computed(() => {
	return (dictMap.value.kingdeeOrgList || []).map((item: any) => ({
		label: item.label ?? `${item.kingdeeOrgCode}-${item.kingdeeOrgName}`,
		value: item.kingdeeOrgCode,
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
		salesOrgCode: '', // 金蝶销售组织
		purchaseOrgCode: '', // 金蝶采购组织
		settlementCurrency: '', // 结算原币
	}),
	// 表单验证规则
	formRules: {
		salesOrgCode: [
			{ required: true, message: '请选择金蝶销售组织', trigger: 'change' },
		],
		purchaseOrgCode: [
			{ required: true, message: '请选择金蝶采购组织', trigger: 'change' },
		],
		settlementCurrency: [
			{ required: true, message: '请选择结算原币', trigger: 'change' },
		],
	} as FormRules,
	// API 接口
	addApi: addInternalSettlementOriginalCurrencyRule,
	updateApi: updateInternalSettlementOriginalCurrencyRule,
	getDetailApi: getInternalSettlementOriginalCurrencyRuleDetail,
	// 成功回调
	onSuccess: () => {
		emit('getDataList');
	},
});

// 打开弹窗（适配组件使用方式）
const handleOpen = () => {
	reload();
	openDialog(props.type, props.row);
};

// 提交表单（适配组件使用方式）
const onSubmit = () => {
	submitForm(props.type, props.row);
};

// 计算弹窗标题
const title = computed(() => getTitle(props.type));
// 获取金蝶组织核算本位币下拉选项（分组格式）
const settlementCurrencyOptions = computed(() => {
	// 获取到数据
	const currencyList = [...(dictMap.value.currencyList || [])];
	// 目前这三个规则还没用到，但是后续要用，先添加到最前面
	// 添加固定的三个规则选项在最前面
	currencyList.unshift(
		{
			currencyCode: 'WAREHOUSE_MARKET', // 取目的仓所属国家市场币种
			currencyName: '取目的仓所属国家市场币种',
		},
		{
			currencyCode: 'SALES_ORG', // 取销售组织本位币
			currencyName: '取销售组织本位币',
		},
		{
			currencyCode: 'PURCHASE_ORG', // 取采购组织本位币
			currencyName: '取采购组织本位币',
		}
	);
	return currencyList.map((item: any) => ({
		label: `${item.currencyCode}-${item.currencyName}`,
		value: item.currencyCode,
	}));
});
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
							<el-form-item prop="salesOrgCode" label="金蝶销售组织">
								<el-select-v2
									v-model="formData.salesOrgCode"
									placeholder="请选择"
									clearable
									filterable
									style="width: 100%"
									:disabled="type === 'edit'"
									:options="kingdeeOrgOptions"
								/>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row :gutter="20" class="mb-3">
						<el-col :span="24">
							<el-form-item prop="purchaseOrgCode" label="金蝶采购组织">
								<el-select-v2
									v-model="formData.purchaseOrgCode"
									placeholder="请选择"
									clearable
									filterable
									style="width: 100%"
									:disabled="type === 'edit'"
									:options="kingdeeOrgOptions"
								/>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row :gutter="20" class="mb-3">
						<el-col :span="24">
							<el-form-item prop="settlementCurrency" label="结算原币">
								<el-select-v2
									v-model="formData.settlementCurrency"
									placeholder="请选择"
									clearable
									filterable
									style="width: 100%"
									:options="settlementCurrencyOptions"
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
