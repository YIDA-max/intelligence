<!--
 * @Author: 朱寒松 3136271519@qq.com
 * @Date: 2025-07-09 15:18:34
 * @LastEditors: YIDA 3136271519@qq.com
 * @LastEditTime: 2026-01-08 14:12:50
 * @FilePath: \qianyi-ui\src\views\product\product-info\bundle\components\form-dialog\components\associate-sku.vue
 * @Description: 
 * 
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved. 
-->
<template>
	<div>
		<div class="mb20">
			<el-button
				class="ml10"
				type="primary"
				@click="openExcipientDialog"
				v-show="props.visibleType !== 'view'"
				:disabled="!auth('bundle_edit_sku')"
			>
				{{ $t('选择SKU') }}
			</el-button>
			<el-button
				class="ml10"
				@click="handleDelete({}, '', 'batch')"
				v-show="props.visibleType !== 'view'"
				:disabled="!auth('bundle_edit_sku')"
			>
				{{ $t('批量删除') }}
			</el-button>
		</div>
		<el-table
			:data="state.dataList"
			style="width: 100%"
			v-loading="state.loading"
			border
			height="600"
			ref="tableRef"
			row-key="id"
			:cell-style="tableStyle.cellStyle"
			:header-cell-style="tableStyle.headerCellStyle"
		>
			<el-table-column
				align="center"
				type="selection"
				width="40"
				v-show="props.visibleType !== 'view'"
			/>
			<el-table-column :label="$t('图片')">
				<template #default="{ row }">
					<MrImg :src="row.imgUrl" />
				</template>
			</el-table-column>
			<el-table-column
				:label="$t('SKU/产品名称')"
				prop="skuCode"
				show-overflow-tooltip
			>
				<template #default="{ row }">
					<div class="flex flex-col">
						<span>{{ row.skuCode }}</span>
						<span>{{ row.skuName }}</span>
					</div>
				</template>
			</el-table-column>

			<el-table-column prop="skuQty" show-overflow-tooltip>
				<template #header>
					<span
						:style="{
							color: '#f78c8c',
							marginRight: '3px',
						}"
						>*
					</span>
					{{ $t('sku数量') }}
				</template>
				<template #default="{ row }">
					<el-input
						v-model="row.skuQty"
						type="number"
						min="1"
						:disabled="props.visibleType === 'view' || !auth('bundle_edit_sku')"
						placeholder="请输入sku数量"
						@change="
								(value:unknown) => {
									if (value === '' || value === null || value === undefined) {
										row.skuQty = null;
										useMessage().error('只能输入正整数');
									} else if (Number(value) <= 0) {
										row.skuQty = null;
										useMessage().error('只能输入正整数');
									} else if (isNaN(Number(value))) {
										row.skuQty = null;
										useMessage().error('只能输入整数');
									} else {
										row.skuQty = Math.floor(Number(value));
									}
								}
							"
					/>
				</template>
			</el-table-column>
			<el-table-column :label="$t('common.action')" width="150" fixed="right">
				<template #default="{ row, $index: index }">
					<el-button
						:icon="Minus"
						@click="handleDelete(row, index, 'single')"
						v-show="props.visibleType !== 'view'"
						:disabled="!auth('bundle_edit_sku')"
					/>
				</template>
			</el-table-column>
			<el-button
				:icon="Minus"
				@click="handleDelete(row, index, 'single')"
				v-show="props.visibleType !== 'view'"
				:disabled="!auth('bundle_edit_sku')"
			/>
		</el-table>
		<MaterialDialog
			v-model="addExcipientVisible"
			@closeDialog="closeExcipientDialog"
			@setMaterialRows="setMaterialRows"
			:currentRow="props.currentRow"
		></MaterialDialog>
		<!-- 展示图片 -->
		<Preview v-model="showPreview" :url="theCurrentRow?.imgUrl" type="image" />
	</div>
</template>

<script setup lang="ts">
import { defineAsyncComponent, reactive, ref } from 'vue';
import { BasicTableProps, useTable } from '/@/hooks/table';
import { Minus } from '@element-plus/icons-vue';
import { auth } from '/@/utils/authFunction';
import { useMessage } from '/@/hooks/message';
const MaterialDialog = defineAsyncComponent(
	() => import('./associate-sku/material-dialog.vue')
);
const Preview = defineAsyncComponent(
	() => import('/@/components/Material/preview.vue')
);
const props = defineProps({
	visibleType: {
		type: String,
		default: '', // edit, view
	},
	currentRow: {
		type: Object,
		default: () => ({}),
	},
});
// 是否显示预览
const showPreview = ref(false);
const theCurrentRow = ref({});

// TODO: 接口未定义
const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {},
	// pageList: getMaterialList,
	descs: [''],
	isPage: false,
});

//  table hook
const { tableStyle, setTableData } = useTable(state);
// tableRef
const tableRef = ref<any>(null);
// 辅料弹窗
const addExcipientVisible = ref(false);

const openExcipientDialog = () => {
	addExcipientVisible.value = true;
};

const closeExcipientDialog = () => {
	addExcipientVisible.value = false;
};
// 设置辅料table
const setMaterialRows = (rows: string[]) => {
	const dataList = state.dataList ? [...state.dataList] : [];
	rows.forEach((row: any) => {
		// 检查是否已存在相同的辅料
		const existingIndex = dataList.findIndex((item: any) => item.id === row.id);
		if (existingIndex !== -1) {
			// // 如果存在，更新数量和备注
			// 无需处理
			// dataList[existingIndex].materialQty = row.materialQty;
			// dataList[existingIndex].remark = row.remark;
		} else {
			// 如果不存在，添加新的辅料
			dataList.push({
				...row,
			});
		}
	});
	// 设置选中的辅料
	setTableData(dataList);
};
// 删除选中的辅料
const handleDelete = (row: any, index: number, type: string) => {
	// 删除选中的辅料
	if (!row) return;
	if (type === 'single') {
		// 从数据列表中删除
		const dataList = [...(state.dataList ? state.dataList : [])];
		dataList.splice(index, 1);
		setTableData(dataList);
	} else if (type === 'batch') {
		// 批量删除
		const selectedRows = tableRef.value.getSelectionRows();
		if (selectedRows.length === 0) {
			return;
		}
		const dataList = [...(state.dataList ? state.dataList : [])];
		selectedRows.forEach((selectedRow: any) => {
			const index = dataList.findIndex(
				(item: any) => item.id === selectedRow.id
			);
			if (index !== -1) {
				dataList.splice(index, 1);
			}
		});
		setTableData(dataList);
	}
};
// 获取数据列表
const getDataList = () => {
	return state.dataList;
};
const setData = (data: any) => {
	// 设置数据
	setTableData(data);
};
defineExpose({
	setData,
	getDataList: getDataList,
});
</script>

<style lang="scss" scoped></style>
