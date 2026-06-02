<!--
 * @Author: YIDA 3136271519@qq.com
 * @Date: 2026-01-29 18:30:00
 * @LastEditors: wuyueqin wuyueqin@merach.com
 * @LastEditTime: 2026-02-26 11:31:44
 * @FilePath: \qianyi-ui\src\views\integrations\baseAssociationConfig\orderPromotion\components\addOrEdit\index.vue
 * @Description: 添加/订单推送关系组件
 * 
 * Copyright (c) 2026 by ${git_name_email}, All Rights Reserved. 
-->
<script setup lang="ts">
import { computed } from 'vue';
import { ElMessage, type FormRules } from 'element-plus';
import {
	addOrderPushRelation,
	updateOrderPushRelation,
	getOrderPushRelationDetail,
} from '/@/api/integrations/baseAssociationConfig/index';
import { getSupplierInfoList } from '/@/api/purchase/supplierSku/index';
import { useFormDialog } from './hooks/index';
import { getDicts } from '/@/api/admin/dict';
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
			key: 'integrationBillList',
			fetchFn: getDicts,
			params: 'kingdee_base_integration_module',
		},
		{
			key: 'platformChannel',
			fetchFn: getDicts,
			params: 'platform_channel',
		},
		{
			key: 'supplierList',
			fetchFn: getSupplierInfoList,
			params: {},
		}, // 仟易供应商列表（作为平台数据来源）
		{
			key: 'kingdeeBillTypeList',
			fetchFn: getDicts,
			params: 'kingdee_base_Kingdee_bill_type',
		}, // 金蝶单据名称列表
		//
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
		integrationModule: '', // 集成单据
		platformChannelCode: '', // 平台
		kingdeeBillType: '', // 金蝶单据名称
		effectTime: '', // 生效时间
		expireTime: '', // 失效时间
	}),
	// 表单验证规则
	formRules: {
		integrationModule: [
			{ required: true, message: '请选择集成单据', trigger: 'change' },
		],
		platformChannelCode: [
			{ required: true, message: '请选择平台', trigger: 'change' },
		],
		kingdeeBillType: [
			{ required: true, message: '请选择金蝶单据名称', trigger: 'change' },
		],
		effectTime: [
			{ required: true, message: '请选择生效时间', trigger: 'change' },
		],
	} as FormRules,
	// API 接口
	addApi: addOrderPushRelation,
	updateApi: updateOrderPushRelation,
	getDetailApi: getOrderPushRelationDetail,
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
	if (formData.value.expireTime && formData.value.effectTime) {
		if (
			new Date(formData.value.expireTime).getTime() <=
			new Date(formData.value.effectTime).getTime()
		) {
			ElMessage.warning('失效时间必须大于生效时间');
			return;
		}
	}
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
			width="600px"
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
							<el-form-item prop="integrationModule" label="集成单据">
								<el-select
									v-model="formData.integrationModule"
									placeholder="请选择"
									clearable
									filterable
									style="width: 100%"
									:disabled="type === 'edit'"
								>
									<el-option
										v-for="item in dictMap.integrationBillList || []"
										:key="item.value"
										:label="item.label"
										:value="item.value"
									/>
								</el-select>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row :gutter="20" class="mb-3">
						<el-col :span="24">
							<el-form-item prop="platformChannelCode" label="平台">
								<el-select
									v-model="formData.platformChannelCode"
									placeholder="请选择"
									clearable
									filterable
									style="width: 100%"
									:disabled="type === 'edit'"
								>
									<el-option
										v-for="item in dictMap.platformChannel || []"
										:key="item.value"
										:label="item.label"
										:value="item.value"
									/>
								</el-select>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row :gutter="20" class="mb-3">
						<el-col :span="24">
							<el-form-item prop="kingdeeBillType" label="金蝶单据名称">
								<el-select
									v-model="formData.kingdeeBillType"
									placeholder="请选择"
									clearable
									filterable
									style="width: 100%"
								>
									<el-option
										v-for="item in dictMap.kingdeeBillTypeList || []"
										:key="item.value"
										:label="item.label"
										:value="item.value"
									/>
								</el-select>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row :gutter="20" class="mb-3">
						<el-col :span="24">
							<el-form-item prop="effectTime" label="生效时间">
								<el-date-picker
									v-model="formData.effectTime"
									type="datetime"
									placeholder="请选择生效时间"
									value-format="YYYY-MM-DD HH:mm:ss"
									style="width: 100%"
								/>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row :gutter="20" class="mb-3">
						<el-col :span="24">
							<el-form-item prop="expireTime" label="失效时间">
								<el-date-picker
									v-model="formData.expireTime"
									type="datetime"
									placeholder="请选择失效时间"
									value-format="YYYY-MM-DD HH:mm:ss"
									style="width: 100%"
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
