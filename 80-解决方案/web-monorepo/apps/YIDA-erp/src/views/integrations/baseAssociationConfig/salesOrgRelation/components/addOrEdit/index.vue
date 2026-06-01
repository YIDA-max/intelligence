<!--
 * @Author: YIDA 3136271519@qq.com
 * @Date: 2026-01-29 18:30:00
 * @LastEditors: YIDA zhuhansong@merach.com
 * @LastEditTime: 2026-04-16 17:31:50
 * @FilePath: \qianyi-ui\src\views\integrations\baseAssociationConfig\salesOrgRelation\components\addOrEdit\index.vue
 * @Description: 添加/编辑销售组织关系组件
 * 
 * Copyright (c) 2026 by ${git_name_email}, All Rights Reserved. 
-->
<script setup lang="ts">
import { computed } from 'vue';
import type { FormRules } from 'element-plus';
import {
	addSalesOrgRelation,
	updateSalesOrgRelation,
	getSalesOrgRelationDetail,
} from '/@/api/integrations/baseAssociationConfig/index';
import {
	getKingdeeOrgList,
	getKingdeeWarehouseList,
	getKingdeeCustomerList,
	getKingdeeDeptList,
} from '/@/api/integrations/common';
import { useFormDialog } from './hooks/index';
import { useMultipleDicts } from '/@/hooks/multipleDicts';
import { getListByCondition } from '/@/api/product/sku';
import { getDicts } from '/@/api/admin/dict';

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
// 当前使用的店铺下拉
const currentShopOption = ref<any[]>([]);
// 获取下拉选项数据
const { dictMap, reload } = useMultipleDicts(
	[
		{
			key: 'platformChannel',
			fetchFn: getDicts,
			params: 'platform_channel',
		}, // 平台渠道
		{
			key: 'kingdeeOrgList',
			fetchFn: getKingdeeOrgList,
			params: '',
		}, // 金蝶销售组织
		{
			key: 'kingdeeCustomerList',
			fetchFn: getKingdeeCustomerList,
			params: '',
		}, // 金蝶客户
		{
			key: 'kingdeeFbaTransitWhList',
			fetchFn: getKingdeeWarehouseList,
			params: '',
		}, // 金蝶仓库列表
		{
			key: 'kingdeeDeptList',
			fetchFn: getKingdeeDeptList,
			params: '',
		}, // 金蝶部门列表
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
		storeId: '',
		platformChannelCode: '',
		kingdeeSalesOrgCode: '',
		kingdeeSalesOrgName: '',
		kingdeeCustomerCode: '',
		kingdeeFbaTransitWhName: '',
		kingdeeOverseasTransitWhCode: '',
		kingdeeOverseasTransitWhName: '',
		platformDeliveryKingdeeWhCode: '',
		platformDeliveryKingdeeWhName: '',
		kingdeeDispatchWhCode: '',
		kingdeeDispatchWhName: '',
		kingdeeOrgCode: '',
		kingdeeDeptName: '',
	}),
	// 表单验证规则
	formRules: {
		platformChannelCode: [
			{ required: true, message: '请选择平台', trigger: 'change' },
		],
		storeId: [{ required: true, message: '请选择店铺站点', trigger: 'change' }],
		kingdeeSalesOrgCode: [
			{ required: true, message: '请选择金蝶销售组织', trigger: 'change' },
		],
		kingdeeCustomerCode: [
			{ required: true, message: '请选择金蝶客户', trigger: 'change' },
		],
		kingdeeDispatchWhCode: [
			{ required: false, message: '请选择商品仓', trigger: 'change' },
		],
	} as FormRules,
	// API 接口
	addApi: addSalesOrgRelation,
	updateApi: updateSalesOrgRelation,
	getDetailApi: getSalesOrgRelationDetail,
	// 成功回调
	onSuccess: () => {
		emit('getDataList');
	},
});
// 金蝶销售组织变化
const handleKingdeeSalesOrgChange = async (value: string) => {
	// 如果是删除，则清空其他字段
	if (!value) {
		// 金蝶客户
		formData.value.kingdeeCustomerCode = '';
		// 金蝶发出商品仓
		formData.value.kingdeeDispatchWhCode = '';
		// 金蝶部门
		formData.value.kingdeeDeptCode = '';
		// 清空校验
		nextTick(() => {
			formRef.value?.resetFields([
				'kingdeeSalesOrgCode',
				'kingdeeCustomerCode',
				'kingdeeDispatchWhCode',
				'kingdeeDeptCode',
			]);
		});
	} else {
		const res = await getKingdeeCustomerList({});
		if (res.code === 0) {
			kingdeeCustomerCode.value = res.data.map((item: any) => ({
				label: `${item.kingdeeCustomerCode}-${item.kingdeeCustomerName}`,
				value: item.kingdeeCustomerCode,
			}));
		}
	}
};
// 转换为 el-select-v2 需要的格式
const kingdeePlatformChannelCode = computed(() => {
	const list = dictMap.value?.platformChannel || [];
	return list.map((item: any) => ({
		label: item.label,
		value: item.value,
	}));
});

const kingdeeStoreId = computed(() => {
	const list = currentShopOption.value || [];
	return list.map((item: any) => ({
		label: `${item.storeName}-${item.siteCode}`,
		value: item.id,
	}));
});

const kingdeeSalesOrgCode = computed(() => {
	const list = dictMap.value?.kingdeeOrgList || [];
	return list.map((item: any) => ({
		label: `${item.kingdeeOrgCode}-${item.kingdeeOrgName}`,
		value: item.kingdeeOrgCode,
	}));
});
// 金蝶客户列表
const kingdeeCustomerCode = ref<any[]>([]);
const kingdeeFbaTransitWhList = computed(() => {
	const list = dictMap.value?.kingdeeFbaTransitWhList || [];
	return list.map((item: any) => ({
		label: `${item.kingdeeWareCode}-${item.kingdeeWareName}`,
		value: item.kingdeeWareCode,
	}));
});
const kingdeeDeptList = computed(() => {
	const list = dictMap.value?.kingdeeDeptList || [];
	return list.map((item: any) => ({
		label: `${item.kingdeeDeptCode}-${item.kingdeeDeptName}`,
		value: item.kingdeeDeptCode,
	}));
});
// 平台渠道变化
const handlePlatformChange = async (value: string, isInit = false) => {
	if (!isInit) formData.value.storeId = '';
	//初始化的时候也请求
	if (value || isInit) {
		// 获取店铺下拉
		const res = await getListByCondition({
			platformChannelCode: value,
		});
		if (res.code === 0) {
			currentShopOption.value = res.data || [];
		}
	} else {
		currentShopOption.value = [];
	}
};
// 打开弹窗（适配组件使用方式）
const handleOpen = () => {
	reload();
	nextTick(async () => {
		await openDialog(props.type, props.row);
		// 请求平台渠道列表
		handlePlatformChange(formData.value.platformChannelCode, true);
		// 请求金蝶销售组织列表
		handleKingdeeSalesOrgChange(formData.value.kingdeeSalesOrgCode);
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
							<el-form-item prop="platformChannelCode" label="平台">
								<!-- <el-select
									v-model="formData.platformChannelCode"
									placeholder="请选择"
									clearable
									filterable
									style="width: 100%"
									:disabled="type === 'edit'"
									@change="handlePlatformChange"
								>
									<el-option
										v-for="item in dictMap.platformChannel || []"
										:key="item.id"
										:label="item.label"
										:value="item.value"
									/>
								</el-select> -->

								<el-select-v2
									v-model="formData.platformChannelCode"
									placeholder="请选择"
									clearable
									filterable
									style="width: 100%"
									:disabled="type === 'edit'"
									:options="kingdeePlatformChannelCode"
									@change="handlePlatformChange"
								/>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row :gutter="20" class="mb-3">
						<el-col :span="24">
							<el-form-item prop="storeId" label="店铺站点">
								<el-select-v2
									v-model="formData.storeId"
									placeholder="请选择"
									clearable
									filterable
									style="width: 100%"
									:disabled="type === 'edit' || !formData.platformChannelCode"
									:options="kingdeeStoreId"
								/>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row :gutter="20" class="mb-3">
						<el-col :span="24">
							<el-form-item prop="kingdeeSalesOrgCode" label="金蝶销售组织">
								<el-select-v2
									v-model="formData.kingdeeSalesOrgCode"
									placeholder="请选择"
									clearable
									filterable
									style="width: 100%"
									:options="kingdeeSalesOrgCode"
									@change="handleKingdeeSalesOrgChange"
								/>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row :gutter="20" class="mb-3">
						<el-col :span="24">
							<el-form-item prop="kingdeeCustomerCode" label="金蝶客户">
								<el-select-v2
									v-model="formData.kingdeeCustomerCode"
									placeholder="请选择"
									clearable
									filterable
									style="width: 100%"
									:disabled="!formData.kingdeeSalesOrgCode"
									:options="kingdeeCustomerCode"
								/>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row :gutter="20" class="mb-3">
						<el-col :span="24">
							<el-form-item label="金蝶发出商品仓" prop="kingdeeDispatchWhCode">
								<el-select-v2
									v-model="formData.kingdeeDispatchWhCode"
									placeholder="请选择"
									clearable
									filterable
									style="width: 100%"
									:disabled="!formData.kingdeeSalesOrgCode"
									:options="kingdeeFbaTransitWhList"
								/>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row :gutter="20" class="mb-3">
						<el-col :span="24">
							<el-form-item label="金蝶部门">
								<el-select-v2
									v-model="formData.kingdeeDeptCode"
									placeholder="请选择"
									clearable
									filterable
									style="width: 100%"
									:disabled="!formData.kingdeeSalesOrgCode"
									:options="kingdeeDeptList"
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
