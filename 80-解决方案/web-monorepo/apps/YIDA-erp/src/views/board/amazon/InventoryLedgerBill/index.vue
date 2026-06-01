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
								text: '库存属性',
								code: 'dispositions',
								searchFn: register?.getDataList,
								getTreeDataParams: 'Amazon_Disposition',
							}"
						/>
					</el-form-item>
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
										label: 'MSKU',
										value: 'mskuCodes',
									},
									{
										label: '位置',
										value: 'locations',
									},
								]"
								:getDataList="register?.getDataList"
							/>
						</div>
					</el-form-item>
					<el-form-item>
						<div>
							<SelectDateDynamic
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
										label: '日期',
										dateType: 'date',
										value: 'reportDate',
										isAddHMS: false,
										dateStart: 'reportDateStart',
										dateEnd: 'reportDateEnd',
									},
									{
										label: '月份',
										dateType: 'month',
										value: 'yearMonth',
										isAddHMS: false,
										dateStart: 'yearMonth',
										dateEnd: 'yearMonthEnd',
										defaultMonthsAgo: 1,
										singleMonth: true,
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
			<BaseTable
				:register="register"
				ref="tableRef"
				:columns="columns"
				height="600"
			>
				<template #storeName="{ row }">
					{{ row.storeName ? row.storeName : '' }}
					:
					{{ row.marketplace ? row.marketplace : '' }}
				</template>
				<template #skuCode="{ row }">
					<SkuTableColumn :row="row" />
				</template>
				<template #left-tool> </template>
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
	getInventoryLedgerBillPage,
	getExportInventoryLedgerBill,
} from '/@/api/board/amazon/InventoryLedgerBill/index';
import { useMessage } from '/@/hooks/message';
import { auth } from '/@/utils/authFunction';

const SelectInput = defineAsyncComponent(
	() => import('/@/components/TableFormModule/select-input.vue')
);
const CustomCascader = defineAsyncComponent(
	() => import('/@/components/TreeSelectInput/custom-cascader.vue')
);
const TreeSelectInputApi = defineAsyncComponent(
	() => import('/@/componentsApi/TreeSelectInputApi/index.vue')
);

const SelectDateDynamic = defineAsyncComponent(
	() => import('/@/components/TableFormModule/select-date-dynamic.vue')
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
	pageList: getInventoryLedgerBillPage,
	columns,
	descs: ['create_time'],
	toolBarConfig: {
		handleRefresh: () => {
			register?.getDataList();
		},
		handleExport: () => {
			handleExport();
		},
		isShowExport: auth('inventory_export'),
		settingKey: 'InventoryLedgerBill',
		isShowSetting: true,
	},
	pagination: {
		size: 10000,
		pageSizes: [10, 20, 50, 100, 200, 500, 1000],
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
		await getExportInventoryLedgerBill({
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
