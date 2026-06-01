<!--
 * @Author: 朱寒松 3136271519@qq.com
 * @Date: 2025-07-09 15:18:34
 * @LastEditors: YIDA 3136271519@qq.com
 * @LastEditTime: 2025-09-29 10:03:44
 * @FilePath: \qianyi-ui\src\views\product\product-info\sku\components\form-dialog\components\associate-product.vue
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
				v-show="
					props.visibleType !== 'view' &&
					props.visibleType !== 'spuView' &&
					showAddButton
				"
				:disabled="!auth('sku_edit_product')"
			>
				{{ $t('选择产品/配件') }}
			</el-button>
			<el-button
				class="ml10"
				@click="handleDelete({}, -1, 'batch')"
				v-show="
					props.visibleType !== 'view' &&
					props.visibleType !== 'spuView' &&
					showAddButton
				"
				:disabled="!auth('sku_edit_product')"
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
			native-scrollbar
		>
			<template v-if="showAddButton">
				<el-table-column
					align="center"
					type="selection"
					width="40"
					v-show="props.visibleType !== 'view'"
				/>
			</template>
			<el-table-column :label="t('图片')" type="imgUrl">
				<template #default="{ row }">
					<MrImg :src="row.imgUrl" />
				</template>
			</el-table-column>
			<el-table-column
				prop="materialCode"
				:label="t('SKU/产品名称')"
				show-overflow-tooltip
			>
				<template #default="{ row }">
					<div
						:style="{
							display: 'flex',
							flexDirection: 'column',
							justifyContent: 'center',
							alignItems: 'flex-start',
							width: '100%',
						}"
					>
						<div>{{ row.materialCode }}</div>
						<div>{{ row.materialName }}</div>
					</div>
				</template>
			</el-table-column>
			<template v-if="showAddButton">
				<el-table-column
					:label="$t('数量')"
					prop="materialQty"
					show-overflow-tooltip
				>
					<template #default="{ row }">
						<el-input
							v-model="row.materialQty"
							type="number"
							placeholder="请输入数量"
							style="width: 100%"
							@change="
								(value:unknown) => {
									if (value === '' || value === null || value === undefined) {
										row.materialQty = null;
										useMessage().error('只能输入正整数');
									} else if (Number(value) <= 0) {
										row.materialQty = null;
										useMessage().error('只能输入正整数');
									} else if (isNaN(Number(value))) {
										row.materialQty = null;
										useMessage().error('只能输入整数');
									} else {
										row.materialQty = Math.floor(Number(value));
									}
								}
							"
							:disabled="
								props.visibleType === 'view' || !auth('sku_edit_product')
							"
						/>
					</template>
				</el-table-column>
			</template>
			<template v-if="showAddButton">
				<el-table-column
					:label="$t('备注')"
					prop="remark"
					show-overflow-tooltip
				>
					<template #default="{ row }">
						<el-input
							v-model="row.remark"
							type="text"
							placeholder="请输入备注"
							style="width: 100%"
							maxlength="50"
							:disabled="
								props.visibleType === 'view' || !auth('sku_edit_product')
							"
							show-word-limit
						/>
					</template>
				</el-table-column>
			</template>
			<template v-if="showAddButton"
				><el-table-column
					:label="$t('common.action')"
					width="150"
					fixed="right"
				>
					<template #default="{ row, $index: index }">
						<el-button
							:icon="Minus"
							@click="handleDelete(row, index, 'single')"
							v-show="props.visibleType !== 'view'"
							:disabled="!auth('sku_edit_product')"
						/>
					</template> </el-table-column
			></template>
		</el-table>
		<MaterialDialog
			v-model="addExcipientVisible"
			@closeDialog="closeExcipientDialog"
			@setMaterialRows="setMaterialRows"
		></MaterialDialog>
	</div>
</template>

<script setup lang="ts">
import { defineAsyncComponent, reactive, ref, watch } from 'vue';
import { BasicTableProps, useTable } from '/@/hooks/table';
import { Minus } from '@element-plus/icons-vue';
import { useI18n } from 'vue-i18n';
import { auth } from '/@/utils/authFunction';
import { useMessage } from '/@/hooks/message';
const MaterialDialog = defineAsyncComponent(
	() => import('./associate-material/material-dialog.vue')
);
const { t } = useI18n();
const props = defineProps({
	visibleType: {
		type: String,
		default: '', // edit, view
	},
	baseInfoRef: {
		type: Object,
		default: null,
	},
	tabsValue: {
		type: Number,
		default: 0,
	},
});

// TODO: 接口未定义
const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {},
	// pageList: getMaterialList,
	descs: [''],
	isPage: false,
});

// tableRef
const tableRef = ref<any>(null);
//  table hook
const { tableStyle, setTableData } = useTable(state, tableRef);
// 是否展示添加按钮
const showAddButton = ref(true);

watch(
	() => props.tabsValue,
	(newVal) => {
		if (newVal && newVal === 3) {
			// 当展示的时候,判断当前选中的产品类型是成品还是配件
			// 1是成品 2是配件
			if (
				props.baseInfoRef &&
				props.baseInfoRef.localFormData &&
				props.baseInfoRef.localFormData.productType &&
				props.baseInfoRef.localFormData.productType === '1'
			) {
				// 如果是成品,则展示添加按钮
				showAddButton.value = true;
			} else if (
				props.baseInfoRef &&
				props.baseInfoRef.localFormData &&
				props.baseInfoRef.localFormData.productType &&
				props.baseInfoRef.localFormData.productType === '2'
			) {
				// 如果是配件,则不展示添加按钮
				showAddButton.value = false;
			} else {
				showAddButton.value = true; // 默认展示
			}
		}
	},
	{ immediate: true }
);
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
