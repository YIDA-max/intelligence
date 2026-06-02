<!--
 * @Author: YIDA 3136271519@qq.com
 * @Date: 2026-01-29 18:30:00
 * @LastEditors: wuyueqin wuyueqin@merach.com
 * @LastEditTime: 2026-03-05 16:46:21
 * @FilePath: \qianyi-ui\src\views\integrations\baseAssociationConfig\productSkuRelation\components\addOrEdit\index.vue
 * @Description: 添加/商品SKU关系组件
 * 
 * Copyright (c) 2026 by ${git_name_email}, All Rights Reserved. 
-->
<script setup lang="ts">
import { computed } from 'vue';
import type { FormRules } from 'element-plus';
import {
	addProductSkuRelation,
	updateProductSkuRelation,
	getProductSkuRelationDetail,
} from '/@/api/integrations/baseAssociationConfig/index';
import { getKingdeeMaterialList } from '/@/api/integrations/common';
import { useFormDialog } from './hooks/index';
import { useMultipleDicts } from '/@/hooks/multipleDicts';
import { getSkuList } from '/@/api/product/sku';
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
const { dictMap, reload, loading } = useMultipleDicts(
	[
		{
			key: 'qianyiSkuList',
			fetchFn: getSkuList,
			params: {
				current: 1,
				size: 100,
			},
			callback: (data: any) => {
				return data?.records || [];
			},
		}, // 仟易SKU列表
		{
			key: 'kingdeeMaterialList',
			fetchFn: getKingdeeMaterialList,
			params: {
				current: 1,
				size: 100,
			},
		}, // 金蝶物料列表
	],
	{
		isAuto: false,
	}
);

const qianyiSkuOptions = computed(() => {
	return (dictMap.value.qianyiSkuList || []).map((item: any) => ({
		label: item.skuCode,
		value: item.skuCode,
	}));
});

const kingdeeMaterialOptions = computed(() => {
	return (dictMap.value.kingdeeMaterialList || []).map((item: any) => ({
		label: item.kingdeeMaterialsName,
		value: item.kingdeeMaterialsCode,
	}));
});

// 使用表单管理 Hook
const {
	visible,
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
		skuCode: '', // 仟易SKU
		kingdeeMaterialCode: '', // 金蝶物料编码
	}),
	// 表单验证规则
	formRules: {
		skuCode: [{ required: true, message: '请选择仟易SKU', trigger: 'change' }],
		kingdeeMaterialCode: [
			{ required: true, message: '请选择金蝶物料编码', trigger: 'change' },
		],
	} as FormRules,
	// API 接口
	addApi: addProductSkuRelation,
	updateApi: updateProductSkuRelation,
	getDetailApi: getProductSkuRelationDetail,
	// 成功回调
	onSuccess: () => {
		emit('getDataList');
	},
});
let skuLoading = ref(false);
let kingdeeMaterialLoading = ref(false);
/**
 * @description: 远程搜索方法
 */
const getFilterMethod = async (value: string, dictKey: string) => {
	if (!value) return;

	if (dictKey === 'qianyiSkuList') {
		skuLoading.value = true;
		const res = await getSkuList({
			current: 1,
			size: 200,
			keyword: value,
		});
		dictMap.value.qianyiSkuList = res?.data?.records || [];
		skuLoading.value = false;
	} else if (dictKey === 'kingdeeMaterialList') {
		kingdeeMaterialLoading.value = true;
		const res = await getKingdeeMaterialList({
			current: 1,
			size: 200,
			keyword: value,
		});
		dictMap.value.kingdeeMaterialList = (res?.data as any) || [];
		kingdeeMaterialLoading.value = false;
	}
};
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
							<el-form-item prop="skuCode" label="仟易SKU">
								<el-select-v2
									v-model="formData.skuCode"
									placeholder="请选择(更多内容请使用关键词搜索)"
									clearable
									filterable
									remote
									:loading="skuLoading"
									:remote-method="(value: string) => getFilterMethod(value, 'qianyiSkuList')"
									:disabled="type === 'edit'"
									:options="qianyiSkuOptions"
								/>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row :gutter="20" class="mb-3">
						<el-col :span="24">
							<el-form-item prop="kingdeeMaterialCode" label="金蝶物料编码">
								<el-select-v2
									v-model="formData.kingdeeMaterialCode"
									placeholder="请选择(更多内容请使用关键词搜索)"
									clearable
									filterable
									remote
									:loading="kingdeeMaterialLoading"
									:remote-method="(value: string) => getFilterMethod(value, 'kingdeeMaterialList')"
									:options="kingdeeMaterialOptions"
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
