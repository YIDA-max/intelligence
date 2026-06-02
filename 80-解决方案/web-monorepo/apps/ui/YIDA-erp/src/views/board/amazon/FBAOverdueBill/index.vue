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
					<el-form-item>
						<custom-cascader
							v-model:queryForm="state.queryForm"
							:data="storeData"
							:settings="{
								code: 'storeIds',
								text: '站点/店铺',
								width: '190px',
								props: {
									value: 'id',
									label: 'name',
									children: 'children',
								},
								checkStrictly: false,
								showSelectAll: false,
							}"
							@change="register?.getDataList"
						/>
					</el-form-item>
					<el-form-item>
						<TreeSelectInputApi
							v-model:queryForm="state.queryForm"
							componentType="dicts"
							:settings="{
								text: '建议措施',
								code: 'recommendedActions',
								searchFn: register?.getDataList,
								getTreeDataParams: 'Amazon_recommended_action',
							}"
						/>
					</el-form-item>
					<el-form-item>
						<TreeSelectInputApi
							v-model:queryForm="state.queryForm"
							componentType="dicts"
							:settings="{
								text: '仓库类型',
								code: 'storageTypes',
								searchFn: register?.getDataList,
								getTreeDataParams: 'Amazon_storage_type',
							}"
						/>
					</el-form-item>
					<el-form-item>
						<TreeSelectInputApi
							v-model:queryForm="state.queryForm"
							componentType="dicts"
							:settings="{
								text: '预警等级',
								code: 'alerts',
								searchFn: register?.getDataList,
								getTreeDataParams: 'Amazon_alert',
							}"
						/>
					</el-form-item>
					<el-form-item>
						<TreeSelectInputApi
							v-model:queryForm="state.queryForm"
							componentType="dicts"
							:settings="{
								text: 'FBA库存水平健康状况',
								code: 'fbaInventoryLevelHealthStatuses',
								searchFn: register?.getDataList,
								getTreeDataParams: 'Amazon_fba_inventory_level_health_status',
							}"
						/>
					</el-form-item>
					<!-- 先注释 2026年1月27日17:01:59  -->
					<!-- <el-form-item>
						<TreeSelectInput
							v-model:queryForm="state.queryForm"
							:style="{ width: '220px' }"
							:settings="{
								getTreeData: () => {
									return {
										code: 0,
										data: [
											{ value: 1, label: 'YES' },
											{ value: 0, label: 'NO' },
										],
									};
								},
								text: '本周是否收取低库存水平费',
								width: '220px',
								searchFn: register?.getDataList,
								code: 'lowInventoryLevelFeeAppliedInCurrentWeeks',
								selectTreeProps: {
									value: 'value',
									label: 'label',
									children: 'children',
								},
								getIdsCode: 'value',
							}"
						/>
					</el-form-item>
					<el-form-item>
						<TreeSelectInput
							v-model:queryForm="state.queryForm"
							:style="{ width: '220px' }"
							:settings="{
								getTreeData: () => {
									return {
										code: 0,
										data: [
											{ value: 1, label: 'YES' },
											{ value: 0, label: 'NO' },
										],
									};
								},
								text: '是否获得低库存水平费豁免',
								width: '220px',
								searchFn: register?.getDataList,
								code: 'exemptedFromLowInventoryLevelFees',
								selectTreeProps: {
									value: 'value',
									label: 'label',
									children: 'children',
								},
								getIdsCode: 'value',
							}"
						/>
					</el-form-item> -->
					<el-form-item>
						<div class="flex item-center">
							<SelectInput
								v-model:queryForm="state.queryForm"
								:settings="{
									selectStyle: {
										width: '130px',
									},
									inputStyle: {
										width: '200px',
									},
								}"
								:searchTypes="[
									{
										label: 'ASIN',
										value: 'asins',
									},
									{
										label: 'FNSKU',
										value: 'fnskus',
									},
									{
										label: 'MSKU',
										value: 'mskuCodes',
									},
								]"
								:getDataList="register?.getDataList"
							/>
						</div>
					</el-form-item>
					<el-form-item>
						<div>
							<SelectDate
								v-model:queryForm="state.queryForm"
								:settings="{
									selectStyle: {
										width: '130px',
									},
									dateStyle: {
										width: '130px',
									},
								}"
								:searchTypes="[
									{
										label: '建议补货日期',
										value: 'recommendedShipInDate',
										isAddHMS: false,
										dateStart: 'recommendedShipInDateStart',
										dateEnd: 'recommendedShipInDateEnd',
									},
									{
										label: '库龄计算日期',
										value: 'snapshotDate',
										isAddHMS: false,
										dateStart: 'snapshotDateStart',
										dateEnd: 'snapshotDateEnd',
									},
									{
										label: '历史供应天数的最后更新时间',
										value: 'lastUpdatedDateForHistoricalDaysOfSupply',
										isAddHMS: false,
										dateStart: 'lastUpdatedDateForHistoricalDaysOfSupplyStart',
										dateEnd: 'lastUpdatedDateForHistoricalDaysOfSupplyEnd',
									},
									{
										label: '库存账龄快照日期',
										value: 'inventoryAgeSnapshotDate',
										isAddHMS: false,
										dateStart: 'inventoryAgeSnapshotDateStart',
										dateEnd: 'inventoryAgeSnapshotDateEnd',
									},
								]"
								:getDataList="register?.getDataList"
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
				<template #skuCode="{ row }">
					<SkuTableColumn :row="row" />
				</template>
				<template #storeName="{ row }">
					{{ row.storeName + ':' + row.marketplace }}
				</template>
			</BaseTable>
			<ImportDialog
				ref="importDialogRef"
				title="导入需求计划"
				templateUrl="/files/import-template/导入需求模版.xlsx"
				excelUploadApi="/purchase/demand/import"
				:accept="'.xlsx,.xls'"
				@refreshDataList="register?.getDataList"
			/>
		</div>
	</div>
</template>

<script setup lang="ts">
import {
	BasicTableProps,
	useTable,
} from '/@/components/BaseTable/hooks/BaseTable';
import { columns } from './config';
import { getGroupStoreByPlatform } from '/@/api/base/store/index';
import { defineAsyncComponent, ref, reactive } from 'vue';
import {
	getFBAOverdueBillPage,
	getExportFBAOverdueBill,
} from '/@/api/board/amazon/FBAOverdueBill/index';
import { useMessage } from '/@/hooks/message';
import { auth } from '/@/utils/authFunction';

const SelectInput = defineAsyncComponent(
	() => import('/@/components/TableFormModule/select-input.vue')
);

const SelectDate = defineAsyncComponent(
	() => import('/@/components/TableFormModule/select-date.vue')
);
const CustomCascader = defineAsyncComponent(
	() => import('/@/components/TreeSelectInput/custom-cascader.vue')
);
const TreeSelectInputApi = defineAsyncComponent(
	() => import('/@/componentsApi/TreeSelectInputApi/index.vue')
);
// 搜索变量
const queryRef = ref();
// 导入弹窗引用
const importDialogRef = ref();
// table的引用
const tableRef = ref();
// 是否显示搜索
const showSearch = ref(true);

const state: BasicTableProps = reactive<BasicTableProps>({
	pageList: getFBAOverdueBillPage,
	columns,
	toolBarConfig: {
		handleRefresh: () => {
			register?.getDataList();
		},
		handleExport: () => {
			handleExport();
		},
		isShowExport: auth('fba_export'),
		settingKey: 'FBAOverdueBill',
		isShowSetting: true,
	},
});

//  table hook
const { register } = useTable(state, tableRef);

// 仓库数据
const storeData = ref<Array<any>>([]);
// 仓库选择相关
const loadStoreData = async () => {
	try {
		const res = await getGroupStoreByPlatform({
			platformChannelCode: 'Amazon',
		});
		storeData.value = res.data.map((item: any) => ({
			id: item.siteCode,
			name: item.siteCode,
			children: item.stores.map((val: any) => ({
				id: val.id,
				name: val.storeName,
			})),
		}));
	} catch (error) {
		storeData.value = [];
	}
};
onMounted(() => {
	// 初始加载仓库数据
	loadStoreData();
});
// 导出
const handleExport = async () => {
	try {
		// 显示加载状态
		state.loading = true;
		const ids = register?.getSelectedIds();
		// 发送请求，设置 responseType 为 'blob' 以接收二进制流
		await getExportFBAOverdueBill({
			ids,
			...state.queryForm,
			ascs: state?.ascs,
			descs: state?.descs,
			current: 1,
			size: 10000,
		});
	} catch (error) {
		useMessage().error(error as string);
	} finally {
		// 隐藏加载状态
		state.loading = false;
	}
};
// 清空搜索条件
const resetQuery = () => {
	register?.resetTableQuery(() => {
		return {
			queryForm: {
				current: 1,
				size: 10,
			},
			ascs: [],
			descs: [],
		};
	});
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
