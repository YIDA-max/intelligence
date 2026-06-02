<template>
	<el-dialog
		v-model="visible"
		width="90%"
		:close-on-click-modal="false"
		draggable
		:destroy-on-close="false"
		title="选择需求单"
	>
		<div class="dialog-container">
			<!-- 查询条件 -->
			<el-row class="ml10">
				<el-form :inline="true" :model="state.queryForm">
					<el-form-item>
						<div class="flex item-center">
							<el-select
								v-model="state.queryForm.demandNos"
								placeholder="需求单号"
								filterable
								multiple
								@change="handleDemandNosChange"
							>
								<el-option
									v-for="item in deliveryMethodOptions"
									:key="item.value"
									:label="item.sourceOrderNo"
									:value="item.sourceOrderNo"
								/>
							</el-select>
						</div>
					</el-form-item>

					<el-form-item>
						<div class="flex item-center">
							<SelectDate
								v-model:queryForm="state.queryForm"
								:settings="{
									selectStyle: {
										width: '160px',
									},
									dateStyle: {
										width: '160px',
									},
								}"
								:searchTypes="[
									{
										label: '期望提货时间',
										value: 'expectedPickupDate',
										isAddHMS: true,
										dateStart: 'expectedPickupDateStart',
										dateEnd: 'expectedPickupDateEnd',
									},
								]"
								:getDataList="getDataList"
							/>
						</div>
					</el-form-item>
				</el-form>
			</el-row>

			<!-- 表格 -->
			<el-table
				:data="state.dataList"
				v-loading="state.loading"
				border
				ref="tableRef"
				@selection-change="handleSelectionChange"
				:cell-style="tableStyle.cellStyle"
				:header-cell-style="tableStyle.headerCellStyle"
				native-scrollbar
			>
				<el-table-column type="selection" width="40" fixed />
				<el-table-column
					v-for="column in tableColumns"
					:key="column.prop"
					:prop="column.prop"
					:label="column.label"
					:width="column.width"
					:min-width="column.minWidth"
					:show-overflow-tooltip="column.showOverflowTooltip"
				>
					<template #header>
						<MrTips :label="column.label" :tips="column.tips" />
					</template>
					<template #default="{ row }">
						<!-- SKU特殊展示 -->
						<sku-table-column v-if="column.type === 'sku'" :row="row" />
						<!-- 常规文本显示 -->
						<span v-else>{{
							column.formatter
								? column.formatter(row)
								: row[column.prop] ?? '---'
						}}</span>
					</template>
				</el-table-column>
			</el-table>

			<!-- 分页 -->
			<el-pagination
				@current-change="currentChangeHandle"
				@size-change="sizeChangeHandle"
				v-bind="state.pagination"
			/>
		</div>

		<template #footer>
			<span class="dialog-footer">
				<el-button @click="handleClose">取消</el-button>
				<el-button type="primary" @click="handleConfirm">确定</el-button>
			</span>
		</template>
	</el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, defineAsyncComponent } from 'vue';
import { useMessage } from '/@/hooks/message';
import { BasicTableProps, useTable } from '/@/hooks/table';
import { getDemandPage } from '/@/api/purchase/demand/index';
const SelectDate = defineAsyncComponent(
	() => import('/@/components/TableFormModule/select-date.vue')
);
const SkuTableColumn = defineAsyncComponent(
	() => import('/@/components/SkuTableColumn/index.vue')
);
const MrTips = defineAsyncComponent(() => import('/@/common/MrTips/index.vue'));
const emit = defineEmits(['confirm', 'closed']);

const visible = ref(false);
const tableRef = ref();

// 选中的数据
const selectedRows = ref<any[]>([]);

// 表格状态
const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {
		current: 1,
		size: 20,
		demandNos: [],
	},
	pageList: getDemandPage,
	createdIsNeed: false,
	dataList: [],
	pagination: {
		total: 0,
		current: 1,
		size: 20,
	},
});

// 使用 table hook
const { getDataList, currentChangeHandle, sizeChangeHandle, tableStyle } =
	useTable(state, tableRef);

// 表格列配置
const tableColumns = [
	{
		prop: 'skuCode',
		label: 'SKU/名称',
		width: 200,
		type: 'sku',
	},
	{
		prop: 'demandNo',
		label: '需求单号',
		width: 120,
		showOverflowTooltip: true,
	},
	{
		prop: 'countryCode',
		label: '国家',
		width: 100,
		showOverflowTooltip: true,
	},
	{
		prop: 'platformChannelCode',
		label: '平台渠道',
		width: 120,
		showOverflowTooltip: true,
	},
	{
		prop: 'mskuCode',
		label: 'MSKU',
		width: 140,
		showOverflowTooltip: true,
	},
	{
		prop: 'shippingMethod',
		label: '发货方式',
		width: 100,
		showOverflowTooltip: true,
		formatter: (row: any) => row.shippingMethodText || '---',
	},
	{
		prop: 'expectedPickupDate',
		label: '期望提货时间',
		width: 120,
		showOverflowTooltip: true,
	},
	{
		prop: 'purchaseNum',
		label: '采购数量',
		width: 100,
		showOverflowTooltip: true,
	},
	{
		prop: 'availableQuantity',
		label: '可用数量',
		width: 100,
		tips: '=在途库存 - 在途占用',
		showOverflowTooltip: true,
	},
	// {
	// 	prop: 'cartonQty',
	// 	label: '单箱数量',
	// 	width: 100,
	// 	showOverflowTooltip: true,
	// },
	{
		prop: 'deptName',
		label: '部门&运营小组',
		width: 140,
		showOverflowTooltip: true,
	},
	{
		prop: 'operationName',
		label: '运营人',
		minWidth: 100,
		showOverflowTooltip: true,
	},
];
//需求单可选列表
const deliveryMethodOptions = ref<any[]>([]);

// 原始row数据
const originalRow = ref<any>({});

// 处理需求单号变化（至少保留一条）
const handleDemandNosChange = (value: string[]) => {
	if (!value || value.length === 0) {
		useMessage().warning('至少需要选择一条需求单号,已默认选择第一个');
		// 恢复至少一个选项（选择第一个）
		state.queryForm.demandNos = [deliveryMethodOptions.value[0].sourceOrderNo];
		getDataList();
		return;
	}
	getDataList();
};

// 打开弹窗
const open = (row?: any, onwaySourceDetails?: any[]) => {
	originalRow.value = row;
	// 重置表单并使用默认的 skuCode
	state.queryForm = {
		current: 1,
		size: 20,
		demandNos: onwaySourceDetails?.map((item: any) => item.sourceOrderNo) || [],
	};
	deliveryMethodOptions.value = onwaySourceDetails || [];

	selectedRows.value = [];
	if (tableRef.value) {
		tableRef.value.clearSelection();
	}
	visible.value = true;
	getDataList();
};

// 选择改变
const handleSelectionChange = (rows: any[]) => {
	selectedRows.value = rows;
};

// 确认
const handleConfirm = () => {
	if (selectedRows.value.length === 0) {
		useMessage().warning('请至少选择一条数据');
		return;
	}
	emit('confirm', selectedRows.value);
	handleClose();
};

// 关闭
const handleClose = () => {
	visible.value = false;
	emit('closed');
};

defineExpose({ open, handleClose });
</script>

<style lang="scss" scoped></style>
