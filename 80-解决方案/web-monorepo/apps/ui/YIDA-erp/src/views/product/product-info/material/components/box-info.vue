<!-- 箱规信息 -->
<template>
	<div class="py-[15px] px-[30px]">
		<el-radio-group v-model="typeValue" class="mb20">
			<el-radio-button
				v-for="type of statusOptions"
				:key="type.value"
				:label="type.value"
			>
				{{ type.label }}
			</el-radio-button>
		</el-radio-group>
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
				:label="$t('箱规SKU')"
				prop="skuCode"
				show-overflow-tooltip
			>
				<template #default="{ row }">
					<el-input
						v-model="row.skuCode"
						placeholder="请输入箱规SKU"
						maxlength="200"
						show-word-limit
					/>
				</template>
			</el-table-column>
			<el-table-column :label="$t('外箱规格')" show-overflow-tooltip>
				<template #default="{ row }">
					<el-row>
						<el-col :span="6">
							<el-form-item prop="outCartonSpecLength">
								<el-input
									v-model="row.outCartonSpecLength"
									:placeholder="$t('长')"
								></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="6">
							<el-form-item prop="outCartonSpecWidth">
								<el-input
									v-model="row.outCartonSpecWidth"
									:placeholder="$t('宽')"
								></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="6">
							<el-form-item prop="outCartonSpecHeight">
								<el-input
									v-model="row.outCartonSpecHeight"
									:placeholder="$t('高')"
								></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="6">
							<el-form-item prop="outCartonSpecUnit">
								<el-select
									v-model="row.outCartonSpecUnit"
									filterable
									placeholder="请选择"
									:style="{
										width: '75px',
									}"
									class="el-select-background"
								>
									<el-option
										v-for="item in statusOptions"
										:key="item.value"
										:label="item.label"
										:value="item.value"
									/>
								</el-select>
							</el-form-item>
						</el-col>
					</el-row>
				</template>
			</el-table-column>
			<el-table-column
				:label="$t('单箱数量')"
				prop="qcItem"
				show-overflow-tooltip
			>
				<template #default="{ row }">
					<el-row>
						<el-col :span="16">
							<el-form-item prop="singleCartonQty">
								<el-input
									v-model="row.singleCartonQty"
									:placeholder="$t('高')"
								></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="8">
							<el-form-item prop="singleCartonWeightUnit">
								<el-select
									v-model="row.singleCartonWeightUnit"
									filterable
									placeholder="请选择"
									:style="{
										width: '75px',
									}"
									class="el-select-background"
								>
									<el-option
										v-for="item in statusOptions"
										:key="item.value"
										:label="item.label"
										:value="item.value"
									/>
								</el-select>
							</el-form-item>
						</el-col>
					</el-row>
				</template>
			</el-table-column>
			<el-table-column
				:label="$t('单箱毛重')"
				prop="qcItem"
				show-overflow-tooltip
			>
				<template #default="{ row }">
					<el-row>
						<el-col :span="16">
							<el-form-item prop="itemGrossWeight">
								<el-input
									v-model="row.itemGrossWeight"
									:placeholder="$t('高')"
								></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="8">
							<el-form-item prop="itemGrossWeightUnit">
								<el-select
									v-model="row.itemGrossWeightUnit"
									filterable
									placeholder="请选择"
									:style="{
										width: '75px',
									}"
									class="el-select-background"
								>
									<el-option
										v-for="item in statusOptions"
										:key="item.value"
										:label="item.label"
										:value="item.value"
									/>
								</el-select>
							</el-form-item>
						</el-col>
					</el-row>
				</template>
			</el-table-column>
			<el-table-column
				:label="$t('单箱净重')"
				prop="qcItem"
				show-overflow-tooltip
			>
				<template #default="{ row }">
					<el-row>
						<el-col :span="16">
							<el-form-item prop="itemNetWeight">
								<el-input
									v-model="row.itemNetWeight"
									:placeholder="$t('高')"
								></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="8">
							<el-form-item prop="itemNetWeightUnit">
								<el-select
									v-model="row.itemNetWeightUnit"
									filterable
									placeholder="请选择"
									:style="{
										width: '75px',
									}"
									class="el-select-background"
								>
									<el-option
										v-for="item in statusOptions"
										:key="item.value"
										:label="item.label"
										:value="item.value"
									/>
								</el-select>
							</el-form-item>
						</el-col>
					</el-row>
				</template>
			</el-table-column>
			<el-table-column
				:label="$t('单柜装箱数量')"
				prop="qcItem"
				show-overflow-tooltip
			>
				<template #default="{ row }">
					<el-row>
						<el-col :span="16">
							<el-form-item prop="containerCartonQty">
								<el-input
									v-model="row.containerCartonQty"
									:placeholder="$t('高')"
								></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="8">
							<el-form-item prop="itemSpecLength">
								<el-select
									v-model="row.itemSpecUnit"
									filterable
									placeholder="请选择"
									:style="{
										width: '75px',
									}"
									class="el-select-background"
								>
									<el-option
										v-for="item in statusOptions"
										:key="item.value"
										:label="item.label"
										:value="item.value"
									/>
								</el-select>
							</el-form-item>
						</el-col>
					</el-row>
				</template>
			</el-table-column>
			<el-table-column :label="$t('common.action')" width="80" fixed="right">
				<template #default="{ row, $index: rowIndex }">
					<el-button
						:icon="Minus"
						@click="handleDelete(row, rowIndex, 'single')"
					/>
				</template>
			</el-table-column>
		</el-table>
		<el-button :icon="Plus" @click="handleAdd" />
	</div>
</template>

<script setup lang="ts">
import { BasicTableProps, useTable } from '/@/hooks/table';
import { Minus, Plus } from '@element-plus/icons-vue';
import { ref, reactive } from 'vue';

// const props = defineProps({
// 	dictMap: {
// 		type: Object,
// 		default: () => ({}),
// 	},
// });
const typeValue = ref(1);
const statusOptions = ref([
	{
		label: '公制',
		value: 1,
	},
	{
		label: '英制',
		value: 2,
	},
]);

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
</script>

<style lang="scss" scoped>
/* 使用 v-deep 修改背景颜色 */
.el-select-background {
	:deep(.el-select__wrapper) {
		background-color: #f0f0f0 !important; /* 修改背景颜色 */
	}

	:deep(.el-input__inner:hover) {
		background-color: #e0e0e0 !important; /* 修改 hover 背景颜色 */
	}
}
:deep(.el-form-item) {
	margin-bottom: 0; /* 移除表单项底部边距 */
}

:deep(.el-table .cell) {
	display: flex;
	align-items: center; /* 垂直居中对齐 */
}

:deep(.el-button) {
	margin: 0; /* 移除按钮边距 */
}

:deep(.el-row) {
	margin-bottom: 0; /* 移除行底部边距 */
}
</style>
