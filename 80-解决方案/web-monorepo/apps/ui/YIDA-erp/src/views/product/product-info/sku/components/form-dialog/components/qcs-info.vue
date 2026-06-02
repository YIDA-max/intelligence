<!--
 * @Author: 朱寒松 3136271519@qq.com
 * @Date: 2025-07-07 16:49:25
 * @LastEditors: 朱寒松 3136271519@qq.com
 * @LastEditTime: 2025-07-15 17:29:46
 * @FilePath: \qianyi-ui\src\views\product\product-info\sku\components\sku-form-dialog\components\qcs-info.vue
 * @Description: 
 * 
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved. 
-->
<template>
	<div class="py-[15px] px-[30px]">
		<el-table
			:data="tableData"
			:style="{
				width: '100%',
			}"
			v-loading="state.loading"
			border
			row-key="index"
			:cell-style="tableStyle.cellStyle"
			:header-cell-style="tableStyle.headerCellStyle"
			class="mb20"
			native-scrollbar
		>
			<el-table-column
				:label="$t('质检项')"
				prop="qcItem"
				show-overflow-tooltip
			>
				<template #default="{ row }">
					<el-input
						v-model="row.qcItem"
						placeholder="请输入质检项"
						maxlength="50"
						show-word-limit
						:disabled="
							props.visibleType === 'view' ||
							props.visibleType === 'spuView' ||
							!auth('sku_edit_qcsInfo')
						"
					/>
				</template>
			</el-table-column>
			<el-table-column
				:label="$t('质检内容')"
				prop="qcContent"
				show-overflow-tooltip
			>
				<template #default="{ row }">
					<el-input
						v-model="row.qcContent"
						placeholder="请输入质检内容"
						maxlength="200"
						show-word-limit
						:disabled="
							props.visibleType === 'view' ||
							props.visibleType === 'spuView' ||
							!auth('sku_edit_qcsInfo')
						"
					/>
				</template>
			</el-table-column>
			<el-table-column :label="$t('common.action')" width="120" fixed="right">
				<template #default="{ row, $index: rowIndex }">
					<el-button
						:icon="Minus"
						@click="handleDelete(row, rowIndex, 'single')"
						v-show="
							props.visibleType !== 'view' && props.visibleType !== 'spuView'
						"
						:disabled="!auth('sku_edit_qcsInfo')"
					/>
				</template>
			</el-table-column>
		</el-table>
		<el-button
			:icon="Plus"
			@click="handleAdd"
			v-show="props.visibleType !== 'view' && props.visibleType !== 'spuView'"
			:disabled="!auth('sku_edit_qcsInfo')"
		/>
	</div>
</template>

<script setup lang="ts">
import { BasicTableProps, useTable } from '/@/hooks/table';
import { Minus, Plus } from '@element-plus/icons-vue';
import { ref, reactive } from 'vue';
import { auth } from '/@/utils/authFunction';
const props = defineProps({
	visibleType: {
		type: String,
		default: '', // edit, view
	},
});

// 当前展示的数据
const tableData = ref<Array<{ qcItem: string; qcContent: string }>>([]);

// TODO: 接口未调试
const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {},
	// pageList: fetchList,
	descs: [''],
});

//  table hook getDataList,
const { tableStyle } = useTable(state);

// 添加
const handleAdd = () => {
	// 添加逻辑
	const newRow = { qcItem: '', qcContent: '' };
	tableData.value.push(newRow);
};
// 移除
const handleDelete = (row: any, index: number) => {
	tableData.value.splice(index, 1);
};
const setData = (data: any) => {
	// 设置数据
	tableData.value = data;
};
defineExpose({
	tableData,
	setData,
});
</script>

<style lang="scss" scoped></style>
