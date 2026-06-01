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
										label: '订单编号',
										value: 'orderIds',
									},
									{
										label: '类型',
										value: 'settlementTypes',
									},
									{
										label: '市场',
										value: 'marketplaces',
									},
									{
										label: '结算ID',
										value: 'settlementIds',
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
										label: '日期',
										value: 'localDate',
										isAddHMS: true,
										dateStart: 'startTime',
										dateEnd: 'endTime',
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
				<template #left-tool>
					<el-button
						@click="importDialogRef.show()"
						v-auth="`payTheBill_import`"
						type="primary"
						class="ml10"
						>{{ $t('导入') }}
					</el-button>
				</template>
				<template #skuCode="{ row }">
					<SkuTableColumn :row="row" />
				</template>
			</BaseTable>
			<ImportDialog
				ref="importDialogRef"
				title="导入结算账单"
				templateUrl="/files/import-template/Amazon结算账单导入模板.xlsx"
				excelUploadApi="/finance/settlement-report/amazon/import"
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
	getPayTheBillPage,
	getExportPayTheBill,
} from '/@/api/board/amazon/payTheBill/index';
import { auth } from '/@/utils/authFunction';
import { useMessage } from '/@/hooks/message';
const SelectInput = defineAsyncComponent(
	() => import('/@/components/TableFormModule/select-input.vue')
);

const SelectDate = defineAsyncComponent(
	() => import('/@/components/TableFormModule/select-date.vue')
);
const CustomCascader = defineAsyncComponent(
	() => import('/@/components/TreeSelectInput/custom-cascader.vue')
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
	pageList: getPayTheBillPage,
	columns,
	toolBarConfig: {
		handleRefresh: () => {
			register?.getDataList();
		},
		handleExport: () => {
			handleExport();
		},
		isShowExport: auth('payTheBill_export'),
		settingKey: 'payTheBill',
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
		await getExportPayTheBill({
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
