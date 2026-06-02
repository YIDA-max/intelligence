<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-row class="ml10" v-show="showSearch">
				<el-form
					:inline="true"
					:model="state.queryForm"
					@keyup.enter="getDataList"
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
									selectStyle: {
										width: '130px',
									},
									dateStyle: {
										width: '130px',
									},
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
								:searchTypes="[
									{
										label: '订单号',
										value: 'orderIds',
									},
								]"
								:getDataList="getDataList"
							/>
						</div>
					</el-form-item>
					<el-form-item>
						<el-button @click="getDataList" type="primary"
							>{{ $t('搜索') }}
						</el-button>
						<el-button @click="resetQuery" type="info" plain
							>{{ $t('common.resetBtn') }}
						</el-button>
					</el-form-item>
				</el-form>
			</el-row>
			<el-row>
				<ToolBar @handleRefresh="resetQuery" :is-show-export="false">
					<template #left-tool>
						<el-button
							type="primary"
							@click="openImportDialog"
							class="ml10"
							v-auth="'tkTalentCommission_import'"
							>{{ $t('导入') }}
						</el-button>
					</template>
				</ToolBar>
			</el-row>
			<el-table
				:data="state.dataList"
				@sort-change="sortChangeHandle"
				style="width: 100%"
				v-loading="state.loading"
				border
				ref="tableRef"
				:cell-style="tableStyle.cellStyle"
				:header-cell-style="tableStyle.headerCellStyle"
				native-scrollbar
			>
				<el-table-column
					prop="platformChannelCode"
					:label="t('平台')"
					show-overflow-tooltip
					width="140"
					align="left"
				>
					<template #default="{ row }">{{
						row.platformChannelCodeText ?? '-'
					}}</template>
				</el-table-column>
				<el-table-column
					prop="siteCode"
					:label="t('站点')"
					show-overflow-tooltip
					width="140"
					align="left"
				>
					<template #default="{ row }">{{ row.siteCodeText ?? '-' }}</template>
				</el-table-column>
				<el-table-column
					prop="storeId"
					:label="t('店铺')"
					show-overflow-tooltip
					width="120"
					align="left"
				>
					<template #default="{ row }">{{ row.storeIdText ?? '-' }}</template>
				</el-table-column>
				<el-table-column
					prop="orderId"
					:label="t('Order ID')"
					show-overflow-tooltip
					width="180"
					align="left"
				>
					<template #default="{ row }">{{ row.orderId ?? '-' }}</template>
				</el-table-column>
				<el-table-column
					prop="productIdStr"
					:label="t('Product ID')"
					show-overflow-tooltip
					width="140"
					align="left"
				>
					<template #default="{ row }">{{ row.productIdStr ?? '-' }}</template>
				</el-table-column>
				<el-table-column
					prop="productName"
					:label="t('Product Name')"
					show-overflow-tooltip
					width="200"
					align="left"
				>
					<template #default="{ row }">{{ row.productName ?? '-' }}</template>
				</el-table-column>
				<el-table-column
					prop="sku"
					:label="t('SKU')"
					show-overflow-tooltip
					width="140"
					align="left"
				>
					<template #default="{ row }">{{ row.sku ?? '-' }}</template>
				</el-table-column>
				<el-table-column
					prop="skuId"
					:label="t('SKU ID')"
					show-overflow-tooltip
					width="140"
					align="left"
				>
					<template #default="{ row }">{{ row.skuId ?? '-' }}</template>
				</el-table-column>
				<el-table-column
					prop="sellerSku"
					:label="t('Seller SKU')"
					show-overflow-tooltip
					width="140"
					align="left"
				>
					<template #default="{ row }">{{ row.sellerSku ?? '-' }}</template>
				</el-table-column>
				<el-table-column
					prop="price"
					:label="t('Price')"
					show-overflow-tooltip
					width="120"
					align="right"
				>
					<template #default="{ row }">{{ row.price ?? '-' }}</template>
				</el-table-column>
				<el-table-column
					prop="paymentAmount"
					:label="t('Payment Amount')"
					show-overflow-tooltip
					width="160"
					align="right"
				>
					<template #default="{ row }">{{ row.paymentAmount ?? '-' }}</template>
				</el-table-column>
				<el-table-column
					prop="currency"
					:label="t('Currency')"
					show-overflow-tooltip
					width="120"
					align="left"
				>
					<template #default="{ row }">{{ row.currency ?? '-' }}</template>
				</el-table-column>
				<el-table-column
					prop="quantity"
					:label="t('Quantity')"
					show-overflow-tooltip
					width="120"
					align="right"
				>
					<template #default="{ row }">{{ row.quantity ?? '-' }}</template>
				</el-table-column>
				<el-table-column
					prop="paymentMethod"
					:label="t('Payment method')"
					show-overflow-tooltip
					width="160"
					align="left"
				>
					<template #default="{ row }">{{ row.paymentMethod ?? '-' }}</template>
				</el-table-column>
				<el-table-column
					prop="orderStatus"
					:label="t('Order Status')"
					show-overflow-tooltip
					width="140"
					align="left"
				>
					<template #default="{ row }">{{ row.orderStatus ?? '-' }}</template>
				</el-table-column>
				<el-table-column
					prop="creatorUsername"
					:label="t('Creator Username')"
					show-overflow-tooltip
					width="180"
					align="left"
				>
					<template #default="{ row }">{{
						row.creatorUsername ?? '-'
					}}</template>
				</el-table-column>
				<el-table-column
					prop="contentType"
					:label="t('Content Type')"
					show-overflow-tooltip
					width="140"
					align="left"
				>
					<template #default="{ row }">{{ row.contentType ?? '-' }}</template>
				</el-table-column>
				<el-table-column
					prop="contentId"
					:label="t('Content ID')"
					show-overflow-tooltip
					width="140"
					align="left"
				>
					<template #default="{ row }">{{ row.contentId ?? '-' }}</template>
				</el-table-column>
				<el-table-column
					prop="commissionModel"
					:label="t('Commission Model')"
					show-overflow-tooltip
					width="160"
					align="left"
				>
					<template #default="{ row }">{{
						row.commissionModel ?? '-'
					}}</template>
				</el-table-column>
				<el-table-column
					prop="standardCommissionRate"
					:label="t('Standard Commission Rate')"
					show-overflow-tooltip
					width="220"
					align="right"
				>
					<template #default="{ row }">{{
						row.standardCommissionRate ?? '-'
					}}</template>
				</el-table-column>
				<el-table-column
					prop="estCommissionBase"
					:label="t('Est.Commission Base')"
					show-overflow-tooltip
					width="200"
					align="right"
				>
					<template #default="{ row }">{{
						row.estCommissionBase ?? '-'
					}}</template>
				</el-table-column>
				<el-table-column
					prop="estStandardCommissionPayment"
					:label="t('Est.Standard Commission Payment')"
					show-overflow-tooltip
					width="300"
					align="right"
				>
					<template #default="{ row }">{{
						row.estStandardCommissionPayment ?? '-'
					}}</template>
				</el-table-column>
				<el-table-column
					prop="actualCommissionBase"
					:label="t('Actual Commission Base')"
					show-overflow-tooltip
					width="200"
					align="right"
				>
					<template #default="{ row }">{{
						row.actualCommissionBase ?? '-'
					}}</template>
				</el-table-column>
				<el-table-column
					prop="actualCommissionPayment"
					:label="t('Actual Commission Payment')"
					show-overflow-tooltip
					width="220"
					align="right"
				>
					<template #default="{ row }">{{
						row.actualCommissionPayment ?? '-'
					}}</template>
				</el-table-column>
				<el-table-column
					prop="shopAdsCommissionRate"
					:label="t('Shop Ads Commission Rate')"
					show-overflow-tooltip
					width="220"
					align="right"
				>
					<template #default="{ row }">{{
						row.shopAdsCommissionRate ?? '-'
					}}</template>
				</el-table-column>
				<el-table-column
					prop="estShopAdsCommissionPayment"
					:label="t('Est.Shop Ads Commission Payment')"
					show-overflow-tooltip
					width="280"
					align="right"
				>
					<template #default="{ row }">{{
						row.estShopAdsCommissionPayment ?? '-'
					}}</template>
				</el-table-column>
				<el-table-column
					prop="actualShopAdsCommissionPayment"
					:label="t('Actual Shop Ads Commission Payment')"
					show-overflow-tooltip
					width="300"
					align="right"
				>
					<template #default="{ row }">{{
						row.actualShopAdsCommissionPayment ?? '-'
					}}</template>
				</el-table-column>
				<el-table-column
					prop="estCofundedCreatorBonus"
					:label="t('Est. co-funded creator bonus')"
					show-overflow-tooltip
					width="260"
					align="right"
				>
					<template #default="{ row }">{{
						row.estCofundedCreatorBonus ?? '-'
					}}</template>
				</el-table-column>
				<el-table-column
					prop="actualCofundedCreatorBonus"
					:label="t('Actual co-funded creator bonus')"
					show-overflow-tooltip
					width="260"
					align="right"
				>
					<template #default="{ row }">{{
						row.actualCofundedCreatorBonus ?? '-'
					}}</template>
				</el-table-column>
				<!-- <el-table-column prop="totalEstCommission" :label="t('Total Est. Commission')" show-overflow-tooltip width="200" align="right">
					<template #default="{ row }">{{ row.totalEstCommission ?? '-' }}</template>
				</el-table-column>
				<el-table-column prop="totalActualCommission" :label="t('Total Actual Commission')" show-overflow-tooltip width="200" align="right">
					<template #default="{ row }">{{ row.totalActualCommission ?? '-' }}</template>
				</el-table-column> -->
				<el-table-column
					prop="refundsAndReturns"
					:label="t('Refunds and Returns')"
					show-overflow-tooltip
					width="200"
					align="right"
				>
					<template #default="{ row }">{{
						row.refundsAndReturns ?? '-'
					}}</template>
				</el-table-column>
				<el-table-column
					prop="refunds"
					:label="t('Refunds')"
					show-overflow-tooltip
					width="140"
					align="right"
				>
					<template #default="{ row }">{{ row.refunds ?? '-' }}</template>
				</el-table-column>
				<el-table-column
					prop="timeCreated"
					:label="t('Time Created')"
					show-overflow-tooltip
					width="180"
					align="left"
				>
					<template #default="{ row }">{{ row.timeCreated ?? '-' }}</template>
				</el-table-column>
				<el-table-column
					prop="paymentTime"
					:label="t('Payment Time')"
					show-overflow-tooltip
					width="180"
					align="left"
				>
					<template #default="{ row }">{{ row.paymentTime ?? '-' }}</template>
				</el-table-column>
				<el-table-column
					prop="timeReadyToShip"
					:label="t('Time ready to ship')"
					show-overflow-tooltip
					width="180"
					align="left"
				>
					<template #default="{ row }">{{
						row.timeReadyToShip ?? '-'
					}}</template>
				</el-table-column>
				<el-table-column
					prop="orderDeliveryTime"
					:label="t('Order Delivery Time')"
					show-overflow-tooltip
					width="180"
					align="left"
				>
					<template #default="{ row }">{{
						row.orderDeliveryTime ?? '-'
					}}</template>
				</el-table-column>
				<el-table-column
					prop="timeOrderCompleted"
					:label="t('Time Order Completed')"
					show-overflow-tooltip
					width="200"
					align="left"
				>
					<template #default="{ row }">{{
						row.timeOrderCompleted ?? '-'
					}}</template>
				</el-table-column>
				<el-table-column
					prop="timeCommissionPaid"
					:label="t('Time commission Paid')"
					show-overflow-tooltip
					width="200"
					align="left"
				>
					<template #default="{ row }">{{
						row.timeCommissionPaid ?? '-'
					}}</template>
				</el-table-column>
				<el-table-column
					prop="platform"
					:label="t('Platform')"
					show-overflow-tooltip
					width="140"
					align="left"
				>
					<template #default="{ row }">{{ row.platform ?? '-' }}</template>
				</el-table-column>
				<el-table-column
					prop="agreementType"
					:label="t('Agreement Type')"
					show-overflow-tooltip
					width="160"
					align="left"
				>
					<template #default="{ row }">{{ row.agreementType ?? '-' }}</template>
				</el-table-column>
			</el-table>
			<pagination
				@current-change="currentChangeHandle"
				@size-change="sizeChangeHandle"
				v-bind="state.pagination"
			/>
		</div>
		<SlotImportDialog
			ref="slotImportDialogRef"
			title="导入达人佣金"
			v-model="importFormModel"
			:form-items="importFormItems"
			:form-rules="importFormRules"
			templateUrl="/files/import-template/导入达人佣金模版.xlsx"
			excelUploadApi="/order/tiktokCreatorCommission/import"
			:useProgressDialog="true"
			@refreshDataList="getDataList"
		/>
	</div>
</template>

<script setup lang="ts">
import { BasicTableProps, useTable } from '/@/hooks/table';
import { useI18n } from 'vue-i18n';
import { defineAsyncComponent, ref, reactive, computed } from 'vue';
import { getGroupStoreByPlatform } from '/@/api/base/store/index';
import { useMultipleDicts } from '/@/hooks/multipleDicts';
import { getDicts } from '/@/api/admin/dict';
import { getTiktokCreatorCommissionPage } from '/@/api/financial/tkTalentCommission/index';
import { sysCountryList } from '/@/api/materialFlow/track';
import { getListByCondition as getListByConditionStore } from '/@/api/mcp/collectionPlan/index';

const ToolBar = defineAsyncComponent(
	() => import('/@/components/ToolBar/tool-bar.vue')
);
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
import type { FormItem } from '/@/components/fileUpload/types';

const { t } = useI18n();
// 搜索变量
const queryRef = ref();
// table的引用
const tableRef = ref();
// 是否显示搜索
const showSearch = ref(true);

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
		tableRef,
	}
);

const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {},
	pageList: getTiktokCreatorCommissionPage,
	loading: false,
	dataList: [],
});

//  table hook
const {
	getDataList,
	currentChangeHandle,
	sizeChangeHandle,
	sortChangeHandle,
	resetTableQuery,
	tableStyle,
} = useTable(state, tableRef);

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
	getDataList();
};

// 重置
// 清空搜索条件
const resetQuery = () => {
	resetTableQuery(() => {
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
]);

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
