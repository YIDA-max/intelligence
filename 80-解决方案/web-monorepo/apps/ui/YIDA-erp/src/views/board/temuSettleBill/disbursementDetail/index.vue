<template>
	<div class="">
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
									getTreeDataParams: 'temu_finance_expense_type',
									text: '支出类型',
									width: '220px',
									searchFn: register?.getDataList,
									code: 'expenseTypeList',
								}"
							/>
						</el-form-item>
						<el-form-item>
							<TreeSelectInputApi
								v-model:queryForm="register.state.queryForm"
								componentType="dicts"
								:settings="{
									getTreeDataParams: 'temu_finance_violation_type',
									text: '违规类型',
									width: '220px',
									searchFn: register?.getDataList,
									code: 'violationTypeList',
								}"
							/>
						</el-form-item>
						<el-form-item>
							<SelectInput
								v-model:queryForm="register.state.queryForm"
								:searchTypes="[
									{
										label: '违规编号',
										value: 'violationNumberList',
									},
									{
										label: '订单编号',
										value: 'orderNumberList',
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
										label: '账务时间',
										value: 'accountingTime',
										isAddHMS: true,
										dateStart: 'accountingTimeStart',
										dateEnd: 'accountingTimeEnd',
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
					v-auth="`${moduleKey}_import`"
					@click="importDialogRef?.show()"
					>{{ $t('导入') }}
				</el-button>
			</template>
		</BaseTable>
		<ImportDialog
			ref="importDialogRef"
			title="导入Temu支出明细"
			:templateUrl="TEMU_EXPENSE_DETAIL_IMPORT_TEMPLATE_URL"
			:excelUploadApi="TEMU_EXPENSE_DETAIL_IMPORT_URL"
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
	TEMU_EXPENSE_DETAIL_IMPORT_URL,
	TEMU_EXPENSE_DETAIL_IMPORT_TEMPLATE_URL,
	getTemuExpenseDetailPage,
	getTemuExpenseDetailExport,
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
	queryForm: {},
	pageList: getTemuExpenseDetailPage as any,
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
	descs: ['update_time'],
	descsDefault: ['update_time'],
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
		const api = getTemuExpenseDetailExport;
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
