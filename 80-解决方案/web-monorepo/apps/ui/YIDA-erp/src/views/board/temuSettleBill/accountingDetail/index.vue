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
							<TreeSelectInputApi
								v-model:queryForm="register.state.queryForm"
								componentType="temuShop"
								:settings="{
									text: '店铺',
									width: '220px',
									searchFn: getDataList,
									code: 'shopList',
								}"
							/>
						</el-form-item>
						<el-form-item>
							<TreeSelectInputApi
								v-model:queryForm="register.state.queryForm"
								componentType="dicts"
								:settings="{
									getTreeDataParams: 'temu_finance_accounting_type',
									text: '账务类型',
									width: '220px',
									searchFn: register?.getDataList,
									code: 'accountingTypeList',
								}"
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

		<BaseTable :register="register" ref="baseTableRef" :columns="columns">
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
			title="导入Temu账务明细"
			:templateUrl="TEMU_FINANCE_DETAIL_IMPORT_TEMPLATE_URL"
			:excelUploadApi="TEMU_FINANCE_DETAIL_IMPORT_URL"
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
	TEMU_FINANCE_DETAIL_IMPORT_URL,
	TEMU_FINANCE_DETAIL_IMPORT_TEMPLATE_URL,
	getTemuFinanceDetailPage,
	getTemuFinanceDetailExport,
} from '/@/api/board/temu/index';

import BaseTable from '/@/components/BaseTable/index.vue';

const ImportDialog = defineAsyncComponent(
	() => import('/@/components/fileUpload/importDialog.vue')
);
const TreeSelectInputApi = defineAsyncComponent(
	() => import('/@/componentsApi/TreeSelectInputApi/index.vue')
);
const AdvancedSearchStyle = defineAsyncComponent(
	() => import('/@/components/TableFormModule/advanced-search-style.vue')
);

const SelectDate = defineAsyncComponent(
	() => import('/@/components/TableFormModule/select-date.vue')
);

// 导入弹窗引用
const importDialogRef = ref();
const { t } = useI18n();

// 搜索变量
const queryRef = ref();
// 是否显示搜索
const showSearch = ref(true);
// 高级搜索布局的引用
const AdvancedSearchStyleRef = ref();
// table的引用
const baseTableRef = ref();
// 是否显示搜索

const state: BasicTableProps = reactive<BasicTableProps>({
	pageList: getTemuFinanceDetailPage as any,
	columns,
	toolBarConfig: {
		handleRefresh: () => {
			register?.getDataList();
		},
		handleExport: () => {
			handleExport();
		},
		settingKey: `${moduleKey}_index`,
		isShowExport: true,
	},
	descs: ['update_time'],
	descsDefault: ['update_time'],
});
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
		const api = getTemuFinanceDetailExport;
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

<style lang="scss" scoped>
.tabel-header-flex {
	display: flex;
	align-items: center;
	gap: 4px;
}
</style>
