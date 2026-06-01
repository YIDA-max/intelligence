<!--
 * @Author: YIDA 3136271519@qq.com
 * @Date: 2026-01-29 18:30:00
 * @LastEditors: wuyueqin wuyueqin@merach.com
 * @LastEditTime: 2026-02-05 11:39:34
 * @FilePath: \qianyi-ui\src\views\integrations\baseAssociationConfig\purchaseOrgRelation\components\addOrEdit\index.vue
 * @Description: 添加/采购组织关系组件
 * 
 * Copyright (c) 2026 by ${git_name_email}, All Rights Reserved. 
-->
<script setup lang="ts">
import { computed } from 'vue';
import type { FormRules } from 'element-plus';
import {
	addPurchaseOrgRelation,
	updatePurchaseOrgRelation,
	getPurchaseOrgRelationDetail,
} from '/@/api/integrations/baseAssociationConfig/index';
import {
	getKingdeeOrgList,
	getKingdeeCurrencyList,
} from '/@/api/integrations/common/index';
import { getLegalEntitySelect } from '/@/api/admin/legalEntity/index';
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
			key: 'entityList',
			fetchFn: getLegalEntitySelect,
			params: '',
		}, // 法人主体
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
		legalPersonId: '', // 仟易采购主体ID
		kingdeeOrgCode: '', // 金蝶采购组织编码
		kingdeeCurrency: '', // 金蝶组织核算本位币
		overseasFlag: '', // 是否境外公司
	}),
	// 表单验证规则
	formRules: {
		legalPersonId: [
			{ required: true, message: '请选择仟易采购主体', trigger: 'change' },
		],
		kingdeeOrgCode: [
			{ required: true, message: '请选择金蝶采购组织', trigger: 'change' },
		],
		kingdeeCurrency: [
			{
				required: true,
				message: '请选择金蝶组织核算本位币',
				trigger: 'change',
			},
		],
		overseasFlag: [
			{ required: true, message: '请选择是否境外公司', trigger: 'change' },
		],
	} as FormRules,
	// API 接口
	addApi: addPurchaseOrgRelation,
	updateApi: updatePurchaseOrgRelation,
	getDetailApi: getPurchaseOrgRelationDetail,
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
							<el-form-item prop="legalPersonId" label="仟易采购主体">
								<el-select
									v-model="formData.legalPersonId"
									placeholder="请选择"
									clearable
									filterable
									style="width: 100%"
									:disabled="type === 'edit'"
								>
									<el-option
										v-for="item in dictMap.entityList || []"
										:key="item.id"
										:label="item.name"
										:value="item.id"
									/>
								</el-select>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row :gutter="20" class="mb-3">
						<el-col :span="24">
							<el-form-item prop="kingdeeOrgCode" label="金蝶采购组织">
								<el-select
									v-model="formData.kingdeeOrgCode"
									placeholder="请选择"
									clearable
									filterable
									style="width: 100%"
								>
									<el-option
										v-for="item in dictMap.kingdeeOrgList || []"
										:key="item.id"
										:label="`${item.kingdeeOrgCode}-${item.kingdeeOrgName}`"
										:value="item.kingdeeOrgCode"
									/>
								</el-select>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row :gutter="20" class="mb-3">
						<el-col :span="24">
							<el-form-item prop="kingdeeCurrency" label="金蝶组织核算本位币">
								<el-select
									v-model="formData.kingdeeCurrency"
									placeholder="请选择"
									clearable
									filterable
									style="width: 100%"
								>
									<el-option
										v-for="item in dictMap.currencyList || []"
										:key="item.id"
										:label="item.currencyName"
										:value="item.currencyCode"
									/>
								</el-select>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row :gutter="20" class="mb-3">
						<el-col :span="24">
							<el-form-item prop="overseasFlag" label="是否境外公司">
								<el-select
									v-model="formData.overseasFlag"
									placeholder="请选择"
									clearable
									filterable
									style="width: 100%"
								>
									<el-option label="否" :value="0" />
									<el-option label="是" :value="1" />
								</el-select>
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
