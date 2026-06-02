<!--
 * @Author: YIDA 3136271519@qq.com
 * @Date: 2026-01-29 18:30:00
 * @LastEditors: wuyueqin wuyueqin@merach.com
 * @LastEditTime: 2026-02-05 11:44:51
 * @FilePath: \qianyi-ui\src\views\integrations\baseAssociationConfig\currencyCorrespondenceRelation\components\addOrEdit\index.vue
 * @Description: 添加/编辑币种对照关系组件
 * 
 * Copyright (c) 2026 by ${git_name_email}, All Rights Reserved. 
-->
<script setup lang="ts">
import { computed } from 'vue';
import type { FormRules } from 'element-plus';
import {
	addCurrencyCorrespondenceRelation,
	updateCurrencyCorrespondenceRelation,
	getCurrencyCorrespondenceRelationDetail,
} from '/@/api/integrations/baseAssociationConfig/currencyCorrespondenceRelation/index';
import { useFormDialog } from './hooks/index';
import { useMultipleDicts } from '/@/hooks/multipleDicts';
import { getCurrencyOption } from '/@/api/product/sku';
import { getKingdeeCurrencyList } from '/@/api/integrations/common';

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
			key: 'currencyOption',
			fetchFn: getCurrencyOption,
			params: {},
		}, // 仟易币种
		{
			key: 'kingdeeCurrencyList',
			fetchFn: getKingdeeCurrencyList,
			params: '',
		}, // 金蝶币种
	],
	{
		isAuto: false,
	}
);

const currencyOptions = computed(() => {
	return (dictMap.value.currencyOption || []).map((item: any) => ({
		label: `${item.currencyCode || item.code}-${
			item.currencyName || item.name
		}`,
		value: item.currencyCode || item.code,
	}));
});

const kingdeeCurrencyOptions = computed(() => {
	return (dictMap.value.kingdeeCurrencyList || []).map((item: any) => ({
		label: `${item.currencyCode}-${item.currencyName}`,
		value: item.currencyCode,
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
		currencyCode: '',
		kingdeeCurrencyCode: '',
	}),
	// 表单验证规则
	formRules: {
		currencyCode: [
			{ required: true, message: '请选择仟易币种', trigger: 'change' },
		],
		kingdeeCurrencyCode: [
			{ required: true, message: '请选择金蝶币种', trigger: 'change' },
		],
	} as FormRules,
	// API 接口
	addApi: addCurrencyCorrespondenceRelation,
	updateApi: updateCurrencyCorrespondenceRelation,
	getDetailApi: getCurrencyCorrespondenceRelationDetail,
	// 成功回调
	onSuccess: () => {
		emit('getDataList');
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
							<el-form-item prop="currencyCode" label="仟易币种">
								<el-select-v2
									v-model="formData.currencyCode"
									placeholder="请选择"
									clearable
									filterable
									style="width: 100%"
									:disabled="type === 'edit'"
									:options="currencyOptions"
								/>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row :gutter="20" class="mb-3">
						<el-col :span="24">
							<el-form-item prop="kingdeeCurrencyCode" label="金蝶币种">
								<el-select-v2
									v-model="formData.kingdeeCurrencyCode"
									placeholder="请选择"
									clearable
									filterable
									style="width: 100%"
									:options="kingdeeCurrencyOptions"
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
