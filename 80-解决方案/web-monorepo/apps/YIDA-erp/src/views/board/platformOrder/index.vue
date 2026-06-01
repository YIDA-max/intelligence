<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-row class="ml10" v-show="showSearch">
				<el-form
					:inline="true"
					:model="state.queryForm"
					@keyup.enter="getDataList"
				>
					<el-form-item prop="platformChannelCode">
						<TreeSelectInputApi
							v-model:queryForm="state.queryForm"
							componentType="dicts"
							:settings="{
								text: '平台',
								code: 'platformChannelCode',
								searchFn: changePlatform,
								getTreeDataParams: 'platform_channel',
							}"
							:enable-multiple="false"
						/>
					</el-form-item>
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
							@change="getDataList"
						/>
					</el-form-item>
					<el-form-item>
						<div>
							<SelectDate
								v-model:queryForm="state.queryForm"
								:settings="{
									selectStyle: { width: '130px' },
									dateStyle: { width: '130px' },
								}"
								:searchTypes="[
									{
										label: '创建时间',
										value: 'createTime',
										isAddHMS: true,
										dateStart: 'createTimeStart',
										dateEnd: 'createTimeEnd',
									},
								]"
								:getDataList="getDataList"
							/>
						</div>
					</el-form-item>
					<el-form-item>
						<div class="flex item-center">
							<SelectInput
								v-model:queryForm="state.queryForm"
								:searchTypes="[{ label: '订单号', value: 'orderIds' }]"
								:getDataList="getDataList"
							/>
						</div>
					</el-form-item>
					<el-form-item>
						<el-button @click="getDataList" type="primary">{{
							$t('搜索')
						}}</el-button>
						<el-button @click="resetQuery" type="info" plain>{{
							$t('common.resetBtn')
						}}</el-button>
					</el-form-item>
				</el-form>
			</el-row>

			<BaseTable ref="baseTableRef" :register="register">
				<template #left-tool>
					<el-button
						type="primary"
						@click="openImportDialog"
						v-auth="'platformOrderDetail_import'"
						class="ml10"
						>{{ $t('导入') }}</el-button
					>
				</template>
			</BaseTable>

			<SlotImportDialog
				ref="slotImportDialogRef"
				title="导入订单"
				v-model="importFormModel"
				:form-items="importFormItems"
				:form-rules="importFormRules"
				templateUrl="/files/import-template/导入订单模版.xlsx"
				excelUploadApi="/order/tiktokFinalOrder/import"
				:useProgressDialog="true"
				@refreshDataList="getDataList"
			/>
		</div>
	</div>
</template>

<script setup lang="ts">
import {
	BasicTableProps,
	useTable,
} from '/@/components/BaseTable/hooks/BaseTable';
import { defineAsyncComponent, ref, reactive, computed, onMounted } from 'vue';
import { getGroupStoreByPlatform } from '/@/api/base/store/index';
import { useMultipleDicts } from '/@/hooks/multipleDicts';
import { getDicts } from '/@/api/admin/dict';
import { sysCountryList } from '/@/api/materialFlow/track';
import { getListByCondition as getListByConditionStore } from '/@/api/mcp/collectionPlan/index';
import { getCurrencyOption } from '/@/api/product/sku';
import { getTiktokFinalOrderPage } from '/@/api/financial/platformOrder/index';
import { columns } from './config/index';
import type { FormItem } from '/@/components/fileUpload/types';

const SelectInput = defineAsyncComponent(
	() => import('/@/components/TableFormModule/select-input.vue')
);
const CustomCascader = defineAsyncComponent(
	() => import('/@/components/TreeSelectInput/custom-cascader.vue')
);
const SelectDate = defineAsyncComponent(
	() => import('/@/components/TableFormModule/select-date.vue')
);
const SlotImportDialog = defineAsyncComponent(
	() => import('/@/components/fileUpload/slotImportDialog.vue')
);
const TreeSelectInputApi = defineAsyncComponent(
	() => import('/@/componentsApi/TreeSelectInputApi/index.vue')
);

const baseTableRef = ref();
const showSearch = ref(true);

// 初始化字典数据
const { dictMap } = useMultipleDicts(
	[
		{ key: 'platform', fetchFn: getDicts, params: 'platform_channel' },
		{ key: 'countryList', fetchFn: sysCountryList },
		{ key: 'storeList', fetchFn: getListByConditionStore },
		{ key: 'currencyOption', fetchFn: getCurrencyOption, params: {} },
	],
	{
		isAuto: true,
		tableRef: baseTableRef,
	}
);

const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {},
	pageList: getTiktokFinalOrderPage,
	columns,
	descs: [],
	ascs: [],
	toolBarConfig: {
		handleRefresh: () => register?.getDataList(),
		isShowExport: false,
		// settingKey: 'platform_order_index',
	},
});

const { register, getDataList, resetTableQuery } = useTable(
	state,
	baseTableRef
);

onMounted(() => {
	loadStoreData();
});

// 站点/店铺级联数据
const storeData = ref<Array<any>>([]);

const loadStoreData = async () => {
	try {
		const res = await getGroupStoreByPlatform({
			platformChannelCode: state.queryForm.platformChannelCode,
		});
		storeData.value = res.data.map((item: any) => ({
			id: item.siteCode,
			name: item.siteCode,
			children: item.stores.map((val: any) => ({
				id: val.id,
				name: val.storeName,
			})),
		}));
	} catch {
		storeData.value = [];
	}
};

const changePlatform = async () => {
	loadStoreData();
	getDataList();
};

// 重置搜索条件
const resetQuery = () => {
	resetTableQuery(() => ({
		queryForm: { current: 1, size: 10 },
		ascs: [],
		descs: [],
	}));
};

// 导入弹窗
const slotImportDialogRef = ref();

const importFormRules = ref({
	platformChannelCode: [
		{ required: true, message: '请选择平台', trigger: 'change' },
	],
	siteCode: [{ required: true, message: '请选择站点', trigger: 'change' }],
	storeId: [{ required: true, message: '请选择店铺', trigger: 'change' }],
	currency: [{ required: true, message: '请选择币种', trigger: 'change' }],
});

const storeOption = ref([]);

const importFormModel = ref({
	platformChannelCode: 'Tiktok自运营',
	siteCode: '',
	storeId: '',
	currency: '',
});

const importFormItems = computed<FormItem[]>(() => [
	{
		type: 'select',
		label: '平台',
		prop: 'platformChannelCode',
		options: dictMap.value.platform || [],
		onChange: () => handleImportFormChange(),
	},
	{
		type: 'select',
		label: '站点',
		prop: 'siteCode',
		options: dictMap.value.countryList || [],
		optionLabel: 'chineseName',
		optionValue: 'abbTwoCode',
		onChange: () => handleImportFormChange(),
	},
	{
		type: 'select',
		label: '店铺',
		prop: 'storeId',
		options: storeOption.value,
		optionLabel: 'storeName',
		optionValue: 'id',
	},
	{
		type: 'select',
		label: '币种',
		prop: 'currency',
		options: dictMap.value.currencyOption || [],
		optionLabel: 'currencyCode',
		optionValue: 'currencyCode',
	},
]);

const handleImportFormChange = () => {
	importFormModel.value.storeId = '';
	getImportStoreData();
};

const getImportStoreData = async () => {
	try {
		const res = await getListByConditionStore({
			platformChannelCode: importFormModel.value.platformChannelCode,
			siteCode: importFormModel.value.siteCode,
		});
		storeOption.value = res.data || [];
	} catch {
		storeOption.value = [];
	}
};

const openImportDialog = () => {
	getImportStoreData();
	slotImportDialogRef.value.show();
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
</style>
