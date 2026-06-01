<!--
 * @Author: YIDA 3136271519@qq.com
 * @Date: 2025-10-09 17:58:38
 * @LastEditors: YIDA 3136271519@qq.com
 * @LastEditTime: 2025-12-09 18:09:04
 * @FilePath: \qianyi-ui\src\views\product\product-info\sku\components\all-edit-sku\components\model-info\qc-info\qcInfo.vue
 * @Description: 
 * 
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved. 
-->
<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { Minus, Plus } from '@element-plus/icons-vue';
const { t } = useI18n();
import { BasicTableProps, useTable } from '/@/hooks/table';
const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {},
	// pageList: fetchList,
	descs: [''],
});
const tableRef = ref(null);
const { tableStyle, setTableData, getTableData } = useTable(state, tableRef);
const init = () => {
	// 重置数据
	setTableData([]);
};
// 获取提交值
const validateForm = async () => {
	const tableData = getTableData();
	return {
		qcs: tableData,
	};
};
// 添加
const handleAdd = () => {
	const tableData = Array.from(state.dataList || []);
	// 添加逻辑
	const newRow = { qcItem: '', qcContent: '' };
	tableData.push(newRow);
	setTableData(tableData);
};
// 移除
const handleDelete = (row: any, index: number) => {
	const tableData = Array.from(state.dataList || []);
	tableData.splice(index, 1);
	setTableData(tableData);
};

// 暴露方法给父组件
defineExpose({
	init,
	validateForm,
});
</script>
<template>
	<div class="box">
		<el-table
			:data="state.dataList"
			:style="{
				width: '100%',
			}"
			border
			ref="tableRef"
			row-key="index"
			:cell-style="tableStyle.cellStyle"
			:header-cell-style="tableStyle.headerCellStyle"
			class="mb20"
			native-scrollbar
		>
			<el-table-column :label="t('质检项')" prop="qcItem" show-overflow-tooltip>
				<template #default="{ row }">
					<el-input
						v-model="row.qcItem"
						placeholder="请输入质检项"
						maxlength="50"
						show-word-limit
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
					/>
				</template>
			</el-table-column>
			<el-table-column :label="$t('common.action')" width="120" fixed="right">
				<template #default="{ row, $index: rowIndex }">
					<el-button :icon="Minus" @click="handleDelete(row, rowIndex)" />
				</template>
			</el-table-column>
		</el-table>
		<el-button :icon="Plus" @click="handleAdd" />
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
