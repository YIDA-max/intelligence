<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-row class="ml10" v-show="showSearch">
				<el-form
					:inline="true"
					:model="state.queryForm"
					@keyup.enter="register?.getDataList"
					ref="queryRef"
				>
					<!-- 店铺筛选 -->
					<el-form-item>
						<TreeSelectInputApi
							v-model:queryForm="state.queryForm"
							:settings="{
								getTreeData: getListByConditionStore,
								getTreeDataParams: {
									platformChannelCode: 'SHOPIFY',
								},
								text: '店铺',
								width: '200px',
								searchFn: register.getDataList,
								code: 'storeIds',
								selectTreeProps: {
									value: 'id',
									label: 'storeName',
									children: 'children',
								},
								getIdsCode: 'id',
							}"
						/>
					</el-form-item>
					<!-- 交易类型筛选 -->
					<el-form-item>
						<TreeSelectInputApi
							v-model:queryForm="state.queryForm"
							componentType="dicts"
							:settings="{
								code: 'projectTypes',
								text: '交易类型',
								getTreeDataParams: 'shopify_project_type',
								searchFn: register.getDataList,
							}"
						></TreeSelectInputApi>
						<!-- <TreeSelectInput
							v-model:queryForm="state.queryForm"
							:settings="{
								getTreeData: getDicts,
								getTreeDataParams: 'shopify_project_type',
								text: '交易类型',
								width: '200px',
								searchFn: register.getDataList,
								code: 'projectTypes',
								selectTreeProps: {
									value: 'value',
									label: 'label',
									children: 'children',
								},
								getIdsCode: 'value',
							}"
						/> -->
					</el-form-item>
					<!-- 订单/退货筛选 -->
					<el-form-item>
						<TreeSelectInputApi
							v-model:queryForm="state.queryForm"
							componentType="dicts"
							:settings="{
								code: 'orderTypes',
								text: '订单/退货',
								getTreeDataParams: 'shopify_order_type',
								searchFn: register.getDataList,
							}"
						></TreeSelectInputApi>
						<!-- <TreeSelectInput
							v-model:queryForm="state.queryForm"
							:settings="{
								getTreeData: getDicts,
								getTreeDataParams: 'shopify_order_type',
								text: '订单/退货',
								width: '200px',
								searchFn: register.getDataList,
								code: 'orderTypes',
								selectTreeProps: {
									value: 'value',
									label: 'label',
									children: 'children',
								},
								getIdsCode: 'value',
							}"
						/> -->
					</el-form-item>
					<!-- 销售渠道筛选 -->
					<el-form-item>
						<TreeSelectInputApi
							v-model:queryForm="state.queryForm"
							componentType="dicts"
							:settings="{
								code: 'appNames',
								text: '销售渠道',
								getTreeDataParams: 'shopify_app_name',
								searchFn: register.getDataList,
							}"
						></TreeSelectInputApi>
						<!-- <TreeSelectInput
							v-model:queryForm="state.queryForm"
							:settings="{
								getTreeData: getDicts,
								getTreeDataParams: 'shopify_app_name',
								text: '销售渠道',
								width: '200px',
								searchFn: register.getDataList,
								code: 'appNames',
								selectTreeProps: {
									value: 'value',
									label: 'label',
									children: 'children',
								},
								getIdsCode: 'value',
							}"
						/> -->
					</el-form-item>
					<el-form-item>
						<div class="flex item-center">
							<SelectInput
								v-model:queryForm="state.queryForm"
								:searchTypes="[
									{
										label: '订单ID',
										value: 'legacyResourceIds',
									},
									{
										label: '平台订单号',
										value: 'orderNames',
									},
									{
										label: 'MSKU',
										value: 'mskus',
									},
								]"
								:settings="{
									selectStyle: {
										width: '130px',
									},
									inputStyle: {
										width: '250px',
									},
								}"
								:getDataList="register?.getDataList"
							/>
						</div>
					</el-form-item>
					<el-form-item>
						<div>
							<el-date-picker
								v-model="state.queryForm.orderCreatedDate"
								@change="register?.getDataList"
								type="date"
								format="YYYY/M/D"
								value-format="YYYY/M/D"
								placeholder="订单创建日期"
							/>
						</div>
					</el-form-item>
					<el-form-item>
						<el-button @click="register?.getDataList" type="primary"
							>{{ $t('搜索') }}
						</el-button>
						<el-button @click="resetQuery" type="info" plain
							>{{ $t('common.resetBtn') }}
						</el-button>
					</el-form-item>
				</el-form>
			</el-row>
			<BaseTable :register="register" ref="tableRef">
				<template #left-tool> </template>
				<template #orderCreatedDate="{ row }">
					{{ formatOrderDate(row.orderCreatedDate) }}
				</template>
				<template #skuCode="{ row }">
					<SkuTableColumn :row="row" />
				</template>
			</BaseTable>
		</div>
	</div>
</template>

<script setup lang="ts">
import {
	BasicTableProps,
	useTable,
} from '/@/components/BaseTable/hooks/BaseTable';
import { columns } from './config';
import { defineAsyncComponent, ref, reactive } from 'vue';
import {
	getShopifyOrderSaleReportPage,
	getExportShopifyOrderSaleReport,
} from '/@/api/board/shopifySettlementBillReport/index';
import { getListByCondition as getListByConditionStore } from '/@/api/mcp/collectionPlan/index';
import { useMessage } from '/@/hooks/message';
import dayjs from 'dayjs';
const SelectInput = defineAsyncComponent(
	() => import('/@/components/TableFormModule/select-input.vue')
);
const TreeSelectInputApi = defineAsyncComponent(
	() => import('/@/componentsApi/TreeSelectInputApi/index.vue')
);

// 搜索变量
const queryRef = ref();
// table的引用
const tableRef = ref();
// 是否显示搜索
const showSearch = ref(true);

const state: BasicTableProps = reactive<BasicTableProps>({
	pageList: getShopifyOrderSaleReportPage,
	columns,
	toolBarConfig: {
		handleRefresh: () => {
			register?.getDataList();
		},
		handleExport: () => {
			handleExport();
		},
		settingKey: 'shopifySettlementBillReport-index',
	},
	ascs: [],
	descs: ['update_time'],
});

//  table hook
const { register } = useTable(state, tableRef);

// 重置
// 清空搜索条件
const resetQuery = () => {
	register?.resetTableQuery(() => {
		return {
			queryForm: {
				current: 1,
				size: 10,
			},
			ascs: [],
			descs: ['update_time'],
		};
	});
};

// 格式化订单创建日期：将 2025-06-02 15:59:25 转换为 2025/6/2 或 2025/11/11
const formatOrderDate = (dateStr: string | null | undefined): string => {
	if (!dateStr) return '-';
	try {
		// 使用 dayjs 解析日期并格式化为 YYYY/M/D 格式（去掉前导零）
		return dayjs(dateStr).format('YYYY/M/D');
	} catch (error) {
		return dateStr;
	}
};

// 导出
const handleExport = async () => {
	try {
		// 显示加载状态
		state.loading = true;
		const ids = register?.getSelectedIds();
		// 发送请求，设置 responseType 为 'blob' 以接收二进制流
		await getExportShopifyOrderSaleReport({
			ids,
			...state.queryForm,
			ascs: state?.ascs,
			descs: state?.descs,
			current: 1,
			size: 10000,
		});
	} catch (error) {
		useMessage().error(`导出失败: ${error}`);
	} finally {
		// 隐藏加载状态
		state.loading = false;
	}
};
</script>

<style lang="scss" scoped>
.text-blue {
	color: #0089ef;
	word-break: break-all;
	white-space: pre-line;
	cursor: pointer;
	text-align: left;
}

.el-dropdown-link {
	cursor: pointer;
	color: var(--el-color-primary);
	display: flex;
	align-items: center;
}
</style>
