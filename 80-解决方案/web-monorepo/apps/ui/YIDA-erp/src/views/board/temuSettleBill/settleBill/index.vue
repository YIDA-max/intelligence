<template>
	<div>
		<el-row class="ml10" v-show="showSearch">
			<el-form
				:inline="true"
				:model="register.state.queryForm"
				@keyup.enter="getDataList"
				ref="queryRef"
			>
				<AdvancedSearchStyle
					ref="AdvancedSearchStyleRef"
					showRightBtn
					@reset="resetQuery"
					@search="getDataList"
				>
					<template #default>
						<el-form-item>
							<custom-cascader
								v-model:queryForm="register.state.queryForm"
								:data="storeData"
								:settings="{
									code: 'storeIdList',
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
								@change="getDataList"
							/>
						</el-form-item>
						<el-form-item>
							<TreeSelectInputApi
								v-model:queryForm="register.state.queryForm"
								componentType="dicts"
								:settings="{
									getTreeDataParams: 'temu_finance_transaction_type',
									text: '交易类型',
									searchFn: register?.getDataList,
									code: 'transactionTypeList',
								}"
							/>
						</el-form-item>
						<el-form-item>
							<TreeSelectInputApi
								v-model:queryForm="register.state.queryForm"
								componentType="dicts"
								:settings="{
									getTreeDataParams: 'yes_no_type',
									text: '是否活动价',
									searchFn: register?.getDataList,
									code: 'isPromotionalPriceList',
								}"
							/>
						</el-form-item>
						<el-form-item>
							<SelectInput
								v-model:queryForm="register.state.queryForm"
								:searchTypes="[
									{
										label: '结算流水ID',
										value: 'settlementTransactionIdList',
									},
									{
										label: '批次号',
										value: 'batchNumberList',
									},
									{
										label: 'PO单号',
										value: 'poNumberList',
									},
									{
										label: '单据号',
										value: 'documentNumberList',
									},
									{
										label: 'SKU ID',
										value: 'skuIdList',
									},
									{
										label: 'MSKU',
										value: 'mskuList',
									},
								]"
								:getDataList="getDataList"
							/>
						</el-form-item>
						<el-form-item>
							<SelectDate
								v-model:queryForm="register.state.queryForm"
								:searchTypes="[
									{
										label: '到账时间',
										value: 'arrivalTime',
										isAddHMS: true,
										dateStart: 'arrivalTimeStart',
										dateEnd: 'arrivalTimeEnd',
									},
								]"
								:getDataList="getDataList"
							/>
						</el-form-item>
					</template>
				</AdvancedSearchStyle>
			</el-form>
		</el-row>
		<BaseTable :register="register" ref="baseTableRef">
			<template #left-tool>
				<el-button
					type="primary"
					class="ml10"
					@click="importDialogRef?.show()"
					v-auth="`${moduleKey}_import`"
					>{{ $t('导入') }}
				</el-button>
			</template>
			<template #skuName="{ row }">
				<SkuTableColumn :row="row" isShowLink></SkuTableColumn>
			</template>
			<template #isPromotionalPrice="{ row }">
				{{ row.isPromotionalPrice === 1 ? '是' : '否' }}
			</template>
		</BaseTable>
		<ImportDialog
			ref="importDialogRef"
			title="导入Temu结算明细"
			:templateUrl="TEMU_FINANCE_SETTLEMENT_IMPORT_TEMPLATE_URL"
			:excelUploadApi="TEMU_FINANCE_SETTLEMENT_IMPORT_URL"
			:accept="'.xlsx,.xls'"
			@refreshDataList="register?.getDataList"
		/>
	</div>
</template>

<script setup lang="ts">
import {
	BasicTableProps,
	useTable,
} from '/@/components/BaseTable/hooks/BaseTable';
import { useI18n } from 'vue-i18n';
import { defineAsyncComponent, ref, reactive, onMounted } from 'vue';
import { useMessage } from '/@/hooks/message';

import { columns, moduleKey } from './config/index';

import { getGroupStoreByPlatform } from '/@/api/base/store/index';
import {
	TEMU_FINANCE_SETTLEMENT_IMPORT_URL,
	TEMU_FINANCE_SETTLEMENT_IMPORT_TEMPLATE_URL,
	getTemuFinanceSettlementPage,
	getTemuFinanceSettlementExport,
} from '/@/api/board/temu/index';

import BaseTable from '/@/components/BaseTable/index.vue';

const ImportDialog = defineAsyncComponent(
	() => import('/@/components/fileUpload/importDialog.vue')
);
const SelectInput = defineAsyncComponent(
	() => import('/@/components/TableFormModule/select-input.vue')
);
const AdvancedSearchStyle = defineAsyncComponent(
	() => import('/@/components/TableFormModule/advanced-search-style.vue')
);
const CustomCascader = defineAsyncComponent(
	() => import('/@/components/TreeSelectInput/custom-cascader.vue')
);
const SelectDate = defineAsyncComponent(
	() => import('/@/components/TableFormModule/select-date.vue')
);
const TreeSelectInputApi = defineAsyncComponent(
	() => import('/@/componentsApi/TreeSelectInputApi/index.vue')
);
const SkuTableColumn = defineAsyncComponent(
	() => import('/@/components/SkuTableColumn/index.vue')
);
// table的引用
const baseTableRef = ref();
// 导入弹窗引用
const importDialogRef = ref();
const { t } = useI18n();

// 搜索变量
const queryRef = ref();
// 是否显示搜索
const showSearch = ref(true);
// 高级搜索布局的引用
const AdvancedSearchStyleRef = ref();
const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: { temuFinanceTransactionType: '' },
	pageList: getTemuFinanceSettlementPage as any,
	columns,
	toolBarConfig: {
		handleRefresh: () => {
			register?.getDataList();
		},
		handleExport: () => {
			handleExport();
		},
		isShowExport: true,
		settingKey: `${moduleKey}_index`,
	},
	ascs: [],
	descsDefault: ['update_time'],
	descs: ['update_time'],
});
//  table hook
const { register, getDataList } = useTable(state, baseTableRef);

// 重置
const resetQuery = () => {
	register.state.queryForm = {
		current: 1,
		size: 10,
		status: 1, // 默认启用
	};
	getDataList();
};

/***
 * 导出
 */
const handleExport = async () => {
	try {
		// 获取选中的行数据
		const selectedIds = register?.getSelectedIds() || [];
		// 显示加载状态
		register.state.loading = true;
		const api = getTemuFinanceSettlementExport;
		await api({
			...register.state.queryForm,
			ascs: register.state?.ascs,
			descs: register.state?.descs,
			ids: selectedIds || [],
			current: 1,
			size: 10000,
		});
	} catch (error) {
		useMessage().error(t(error as string));
	} finally {
		// 隐藏加载状态
		register.state.loading = false;
	}
};

onMounted(() => {
	// 初始加载仓库数据
	loadStoreData();
});

// 仓库数据
const storeData = ref<Array<any>>([]);
// 仓库选择相关
const loadStoreData = async () => {
	try {
		const res = await getGroupStoreByPlatform({
			platformChannelCode: 'Temu半托管',
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
</script>

<style lang="scss" scoped></style>
