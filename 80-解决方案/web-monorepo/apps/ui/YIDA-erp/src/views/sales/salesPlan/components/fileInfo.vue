<template>
	<el-dialog
		v-bind="$attrs"
		v-model="visible"
		:close-on-click-modal="false"
		title="文件详情"
		width="80%"
		height="800px"
		@close="handleClose"
	>
		<el-form
			:inline="true"
			:model="state.queryForm"
			@keyup.enter="getDataList"
			ref="queryRef"
		>
			<el-form-item>
				<div class="flex item-center">
					<SelectInput
						v-model:queryForm="state.queryForm"
						:searchTypes="[
							{
								label: 'sku编码',
								value: 'skuCodes',
							},
						]"
						:getDataList="getDataList"
					/>
				</div>
			</el-form-item>
		</el-form>

		<el-table
			:data="state.dataList"
			@sort-change="sortChangeHandle"
			style="width: 100%"
			height="600"
			border
			v-loading="state.loading"
			row-key="id"
			ref="tableRef"
			:cell-style="tableStyle.cellStyle"
			:header-cell-style="tableStyle.headerCellStyle"
			native-scrollbar
		>
			<el-table-column :label="t('商品编码')" prop="skuCode" width="100" fixed>
			</el-table-column>
			<el-table-column :label="t('sku名称')" prop="skuName" width="150" fixed>
			</el-table-column>
			<el-table-column
				:label="t('站点')"
				prop="siteCode"
				width="80"
				fixed
			></el-table-column>
			<el-table-column
				prop="salesChannel"
				:label="t('销售渠道')"
				show-overflow-tooltip
				width="150"
				fixed
			/>
			<el-table-column
				prop="warehouseStrategy"
				:label="t('运营入仓策略')"
				fixed
				show-overflow-tooltip
				width="120"
			/>
			<el-table-column :label="t('sku类目')" prop="skuCategory" width="100">
			</el-table-column>
			<el-table-column
				:label="t('迭代编码')"
				prop="iterationCode"
				width="100"
			></el-table-column>
			<el-table-column
				:label="t('地区')"
				prop="region"
				width="80"
			></el-table-column>
			<el-table-column
				prop="productStatus"
				:label="t('产品状态')"
				show-overflow-tooltip
				width="100"
			/>
			<el-table-column
				prop="supplier"
				:label="t('供应商')"
				show-overflow-tooltip
				width="120"
			/>
			<el-table-column
				prop="pmc"
				:label="t('pmc')"
				show-overflow-tooltip
				width="100"
			/>
			<el-table-column
				prop="materialController"
				:label="t('物控')"
				show-overflow-tooltip
				width="120"
			/>
			<el-table-column
				prop="supervisor"
				:label="t('上级负责人')"
				show-overflow-tooltip
				width="120"
			/>
			<el-table-column
				prop="operator"
				:label="t('运营负责人')"
				show-overflow-tooltip
				width="120"
			/>
			<el-table-column
				prop="operationRemark"
				:label="t('运营问题备注')"
				show-overflow-tooltip
				width="200"
			/>
			<el-table-column
				prop="materialRemark"
				:label="t('物控备注')"
				show-overflow-tooltip
				width="200"
			/>
			<el-table-column
				prop="remark"
				:label="t('备注')"
				show-overflow-tooltip
				width="200"
			/>
			<el-table-column
				prop="currentMonthActualSales"
				show-overflow-tooltip
				width="130"
			>
				<template #header>近半月实际销量</template>
				<template #default="{ row }">
					<span>{{
						row.currentMonthActualSales || row.currentMonthActualSales === 0
							? row.currentMonthActualSales
							: '-'
					}}</span>
				</template>
			</el-table-column>
			<el-table-column
				prop="currentMonthForecastSales"
				show-overflow-tooltip
				width="130"
			>
				<template #header>近半月预估销量</template>
				<template #default="{ row }">
					<span>{{
						row.currentMonthForecastSales || row.currentMonthForecastSales === 0
							? row.currentMonthForecastSales
							: '-'
					}}</span>
				</template>
			</el-table-column>
			<el-table-column
				prop="currentMonthCompletionRate"
				show-overflow-tooltip
				width="140"
			>
				<template #header>近半月预估达成率 </template>
				<template #default="{ row }">
					<span
						>{{
							row.currentMonthCompletionRate ||
							row.currentMonthCompletionRate === 0
								? row.currentMonthCompletionRate
								: '-'
						}}%</span
					>
				</template>
			</el-table-column>
			<el-table-column prop="n1Sales" show-overflow-tooltip width="80">
				<template #header>{{ getMonthLabel(1) }}月销量</template>
				<template #default="{ row }">
					<span>{{
						row.n1Sales || row.n1Sales === 0 ? row.n1Sales : '-'
					}}</span>
				</template>
			</el-table-column>
			<el-table-column prop="n1Forecast" show-overflow-tooltip width="120">
				<template #header>{{ getMonthLabel(1) }}月预估销量</template>
				<template #default="{ row }">
					<span>{{
						row.n1Forecast || row.n1Forecast === 0 ? row.n1Forecast : '-'
					}}</span>
				</template>
			</el-table-column>
			<el-table-column
				prop="n1CompletionRate"
				show-overflow-tooltip
				width="120"
			>
				<template #header>{{ getMonthLabel(1) }}月预估完成率</template>
				<template #default="{ row }">
					<span
						>{{
							row.n1CompletionRate || row.n1CompletionRate === 0
								? row.n1CompletionRate
								: '-'
						}}%</span
					>
				</template>
			</el-table-column>
			<el-table-column prop="n2Sales" show-overflow-tooltip width="80">
				<template #header>{{ getMonthLabel(2) }}月销量</template>
				<template #default="{ row }">
					<span>{{
						row.n2Sales || row.n2Sales === 0 ? row.n2Sales : '-'
					}}</span>
				</template>
			</el-table-column>
			<el-table-column prop="n3Sales" show-overflow-tooltip width="80">
				<template #header>{{ getMonthLabel(3) }}月销量</template>
				<template #default="{ row }">
					<span>{{
						row.n3Sales || row.n3Sales === 0 ? row.n3Sales : '-'
					}}</span>
				</template>
			</el-table-column>
			<!-- 动态表头 -->
			<el-table-column
				v-for="(weekDate, index) in weekDateList"
				:key="weekDate + index"
				:label="weekDate"
				width="100"
			>
				<template #default="{ row }">
					<span>{{ getWeekSalesVolume(row, weekDate) }}</span>
				</template>
			</el-table-column>
		</el-table>
		<pagination
			@current-change="currentChangeHandle"
			@size-change="sizeChangeHandle"
			v-bind="state.pagination"
		/>
	</el-dialog>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { BasicTableProps, useTable } from '/@/hooks/table';
import { ref, reactive } from 'vue';
import { detailInfo } from '/@/api/sales/index';
const SelectInput = defineAsyncComponent(
	() => import('/@/components/TableFormModule/select-input.vue')
);

const { t } = useI18n();
const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {},
	pageList: async (params) => {
		// 设置 loading 状态
		state.loading = true;

		try {
			const res = await detailInfo(params);
			// 处理动态表头数据 - 从所有行数据中收集唯一的weekDate
			if (res.data.records.length > 0) {
				const allWeekDates = new Set<string>();

				// 遍历所有行，收集所有的weekDate
				res.data?.records.forEach((item: any) => {
					if (
						item.salesPlanItemSalesList &&
						Array.isArray(item.salesPlanItemSalesList)
					) {
						item.salesPlanItemSalesList.forEach((weekData: any) => {
							if (weekData.weekDate) {
								allWeekDates.add(weekData.weekDate);
							}
						});
					}
				});

				// 转换为数组，保持原始顺序（不排序）
				weekDateList.value = Array.from(allWeekDates);
			}

			// 设置月份信息（如果有的话）
			if (res.data.records.length > 0 && res.data.records[0].currentMonth) {
				month.value = res.data.records[0].currentMonth;
			}

			return {
				data: {
					...res.data,
				},
			};
		} catch (error) {
			state.loading = false;
		} finally {
			// 无论成功还是失败，都要关闭 loading
			state.loading = false;
		}
	},
	pagination: { current: 1, size: 20 },
	loading: false,
	dataList: [],
	createdIsNeed: false,
});

const weekDateList = ref<string[]>([]);
const month = ref(); // 设置月份
const visible = ref(false);

const getMonthLabel = (offset: number) => {
	// offset=0 表示当前 month 1/2/3 表示往前 1/2/3 个月
	const current = Number(month.value);
	if (!current || Number.isNaN(current)) return '-';
	return ((current - offset - 1 + 12) % 12) + 1;
};

// 获取指定行的指定周的销量数据
const getWeekSalesVolume = (row: any, weekDate: string) => {
	if (row.salesPlanItemSalesList && Array.isArray(row.salesPlanItemSalesList)) {
		const weekData = row.salesPlanItemSalesList.find(
			(item: any) => item.weekDate === weekDate
		);
		return weekData
			? weekData.forecastSales || weekData.forecastSales === 0
				? weekData.forecastSales
				: '-'
			: '-';
	}
	return '-';
};

const handleClose = () => {
	visible.value = false;
	state.dataList = [];
	// 清空动态表头
	weekDateList.value = [];
};

const handleOpen = async (id: string) => {
	// state.queryForm = {};
	state.pagination = { current: 1, size: 20 };
	state.queryForm.id = id;
	visible.value = true; // 先显示弹窗
	getDataList();
};

const tableRef = ref<any>(null);

//  table hook
const {
	getDataList,
	currentChangeHandle,
	sizeChangeHandle,
	sortChangeHandle,
	tableStyle,
} = useTable(state, tableRef);

defineExpose({
	handleClose,
	handleOpen,
});
</script>
