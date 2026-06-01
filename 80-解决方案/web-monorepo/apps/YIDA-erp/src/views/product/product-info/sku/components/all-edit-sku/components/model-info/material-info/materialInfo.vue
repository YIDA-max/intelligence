<!--
 * @Author: YIDA 3136271519@qq.com
 * @Date: 2025-10-09 17:58:38
 * @LastEditors: YIDA 3136271519@qq.com
 * @LastEditTime: 2025-12-18 14:47:30
 * @FilePath: \qianyi-ui\src\views\product\product-info\sku\components\all-edit-sku\components\model-info\material-info\materialInfo.vue
 * @Description: 
 * 
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved. 
-->
<script setup lang="ts">
import { defineAsyncComponent, reactive, ref } from 'vue';
import { BasicTableProps, useTable } from '/@/hooks/table';
import { Minus } from '@element-plus/icons-vue';
import { useI18n } from 'vue-i18n';
import { auth } from '/@/utils/authFunction';
import { useMessage } from '/@/hooks/message';
import emitter from '/@/utils/mitt';
const MaterialDialog = defineAsyncComponent(
	() =>
		import(
			'/@/views/product/product-info/sku/components/form-dialog/components/associate-material/material-dialog.vue'
		)
);

onMounted(() => {
	// 监听产品类型变化事件
	emitter.on('productTypeChange', (newVal) => {
		// 1 是成品 2 是配件
		// 根据产品类型决定是否显示添加按钮
		if (newVal === '1') {
			showAddButton.value = true;
		} else if (newVal === '2') {
			showAddButton.value = false;
			// 清空列表
			setTableData([]);
		}
	});
});
onUnmounted(() => {
	// 移除监听
	emitter.off('productTypeChange');
});
const { t } = useI18n();

const init = () => {
	// 初始化方法
	setTableData([]);
	// 默认显示添加按钮
	showAddButton.value = true;
};
const tableRef = ref<any>(null);
const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {},
	// pageList: getMaterialList,
	descs: [''],
	isPage: false,
});
//  table hook
const { tableStyle, setTableData, getTableData } = useTable(state, tableRef);
// 辅料弹窗
const addExcipientVisible = ref(false);
// 是否展示添加按钮
const showAddButton = ref(true);
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
			useMessage().warning('请先选择要删除的数据');
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

// 获取提交值
const validateForm = async () => {
	const getFormData = getTableData();
	// 校验数量是否填写且为正整数
	for (const item of getFormData) {
		if (
			item.materialQty === null ||
			item.materialQty === undefined ||
			item.materialQty === ''
		) {
			useMessage().error(`产品 ${item.materialCode} 的数量不能为空`);
			return Promise.reject();
		}
		if (!Number.isInteger(item.materialQty) || item.materialQty <= 0) {
			useMessage().error(`产品 ${item.materialCode} 的数量必须为正整数`);
			return Promise.reject();
		}
	}
	return {
		materials: getFormData,
	};
};

// 暴露方法给父组件
defineExpose({
	init,
	validateForm,
});
</script>
<template>
	<div class="box">
		<div class="mb20" v-show="showAddButton">
			<el-button class="ml10" type="primary" @click="openExcipientDialog">
				{{ $t('选择产品/配件') }}
			</el-button>
			<el-button class="ml10" @click="handleDelete({}, -1, 'batch')">
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
				<el-table-column align="center" type="selection" width="40" />
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
					<template #header>
						<span
							:style="{
								color: '#f78c8c',
								marginRight: '3px',
							}"
							>*
						</span>
						{{ $t('数量') }}
					</template>
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

<style scoped lang="scss">
.box {
	padding: 10px;
	border-radius: 5px;
	.span {
		margin: 0 8px;
	}
}
</style>
