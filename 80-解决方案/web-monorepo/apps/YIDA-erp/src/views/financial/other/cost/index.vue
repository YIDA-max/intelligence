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
							@change="register?.getDataList"
						/>
					</el-form-item>
					<el-form-item>
						<el-date-picker
							style="width: 190px"
							v-model="state.queryForm.costTimeStart"
							@change="register?.getDataList"
							type="month"
							format="YYYY-MM"
							value-format="YYYY-MM"
							placeholder="日期开始时间"
						/>
					</el-form-item>
					<el-form-item>
						<el-date-picker
							style="width: 190px"
							v-model="state.queryForm.costTimeEnd"
							@change="register?.getDataList"
							type="month"
							format="YYYY-MM"
							value-format="YYYY-MM"
							placeholder="日期结束时间"
						/>
					</el-form-item>
					<el-form-item>
						<div class="flex item-center">
							<SelectInput
								v-model:queryForm="state.queryForm"
								:searchTypes="[
									{
										label: 'SKU',
										value: 'skuCodes',
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
			<BaseTable :register="register" ref="baseTableRef">
				<template #left-tool>
					<el-button
						type="primary"
						@click="openImportDialog"
						class="ml10"
						v-auth="'tkTalentCommission_import'"
						>{{ $t('导入') }}
					</el-button>
				</template>
			</BaseTable>
		</div>
		<SlotImportDialog
			ref="slotImportDialogRef"
			title="导入订单"
			v-model="importFormModel"
			:form-items="importFormItems"
			:form-rules="importFormRules"
			templateUrl="/files/import-template/商品成本&费用表导入模板.xlsx"
			excelUploadApi="/rpa/tiktokCostCalculation/import"
			:useProgressDialog="true"
			@refreshDataList="register?.getDataList"
		>
			<template #date="{ model }">
				<el-date-picker
					v-model="model.costDate"
					type="month"
					format="YYYY-MM"
					value-format="YYYY-MM"
					:clearable="false"
				/>
			</template>
		</SlotImportDialog>
	</div>
</template>

<script setup lang="ts">
import {
	BasicTableProps,
	useTable,
} from '/@/components/BaseTable/hooks/BaseTable';
import { columns } from './config/TableColumn';
import { defineAsyncComponent, ref, reactive, computed } from 'vue';
import { getGroupStoreByPlatform } from '/@/api/base/store/index';
import { useMultipleDicts } from '/@/hooks/multipleDicts';
import { sysCountryList } from '/@/api/materialFlow/track';
import { getListByCondition as getListByConditionStore } from '/@/api/mcp/collectionPlan/index';
import { useMessage } from '/@/hooks/message';
import { getDicts } from '/@/api/admin/dict';
import {
	getRpaTiktokCostCalculationPage,
	getExportRpaTiktokCostCalculation,
} from '/@/api/financial/other/cost/index';

const SelectInput = defineAsyncComponent(
	() => import('/@/components/TableFormModule/select-input.vue')
);
const CustomCascader = defineAsyncComponent(
	() => import('/@/components/TreeSelectInput/custom-cascader.vue')
);
const SlotImportDialog = defineAsyncComponent(
	() => import('/@/components/fileUpload/slotImportDialog.vue')
);
const TreeSelectInputApi = defineAsyncComponent(
	() => import('/@/componentsApi/TreeSelectInputApi/index.vue')
);
import type { FormItem } from '/@/components/fileUpload/types';

// 搜索变量
const queryRef = ref();
// table的引用
const baseTableRef = ref();
// 是否显示搜索
const showSearch = ref(true);

const state: BasicTableProps = reactive<BasicTableProps>({
	pageList: getRpaTiktokCostCalculationPage,
	columns,
	toolBarConfig: {
		handleRefresh: () => {
			register?.getDataList();
		},
		handleExport: () => {
			handleExport();
		},
		settingKey: 'financial-other-cost',
	},
});

//  table hook
const { register, tableRef } = useTable(state, baseTableRef);
//   初始化数据
const { dictMap } = useMultipleDicts(
	[
		{
			key: 'platform',
			fetchFn: getDicts,
			params: 'platform_channel',
		}, // 平台渠道
		{
			key: 'countryList',
			fetchFn: sysCountryList,
		}, // 国家列表
		{
			key: 'storeList',
			fetchFn: getListByConditionStore,
		}, // 店铺
	],
	{
		isAuto: true,
		tableRef: register.tableRef,
	}
);
onMounted(() => {
	// 初始加载仓库数据
	loadStoreData();
});

// slot导入弹窗
const slotImportDialogRef = ref();

// 导入表单的验证规则
const importFormRules = ref({
	platformChannelCode: [
		{ required: true, message: '请选择平台', trigger: 'change' },
	],
	siteCode: [{ required: true, message: '请选择站点', trigger: 'change' }],
	storeId: [{ required: true, message: '请选择店铺', trigger: 'change' }],
	costDate: [{ required: true, message: '请选择日期', trigger: 'change' }],
});

// 仓库数据
const storeData = ref<Array<any>>([]);
// 仓库选择相关
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
	} catch (error) {
		storeData.value = [];
	}
};

const changePlatform = async () => {
	await loadStoreData();
	register?.getDataList();
};

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
			descs: [],
		};
	});
};

// 导入弹窗店铺数据
const storeOption = ref([]);

// 导入弹窗的表单数据
const importFormModel = ref({
	platformChannelCode: 'Tiktok自运营', // 平台
	siteCode: '', // 站点
	storeId: '', // 店铺
	costDate: '', // 日期
	storeName: '', // 店铺名称
	siteName: '', // 站点名称
});

// 动态生成导入表单的配置
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
		type: 'custom',
		label: '日期',
		prop: 'costDate',
		slotName: 'date',
	},
]);

// 导出
const handleExport = async () => {
	try {
		// 显示加载状态
		state.loading = true;
		const ids = tableRef.value
			?.getCheckboxRecords()
			?.map((item: any) => item.id);
		// 发送请求，设置 responseType 为 'blob' 以接收二进制流
		await getExportRpaTiktokCostCalculation({
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
// 处理导入表单字段变化，用于级联
const handleImportFormChange = () => {
	importFormModel.value.storeId = ''; // 清空依赖字段
	getImportStoreData();
};

// 获取导入弹窗的店铺数据
const getImportStoreData = async () => {
	try {
		const res = await getListByConditionStore({
			platformChannelCode: importFormModel.value.platformChannelCode,
			siteCode: importFormModel.value.siteCode,
		});
		storeOption.value = res.data || [];
	} catch (error) {
		storeOption.value = [];
	}
};

// 打开导入弹窗
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
.el-dropdown-link {
	cursor: pointer;
	color: var(--el-color-primary);
	display: flex;
	align-items: center;
}
</style>
