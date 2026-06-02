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
							@change="register.getDataList"
						/>
					</el-form-item>
					<!-- 交易类型筛选 -->
					<el-form-item>
						<TreeSelectInputApi
							v-model:queryForm="state.queryForm"
							:settings="{
								getTreeData: () => ({
									code: 0,
									data: transactionTypes,
								}),
								text: '交易类型',
								width: '200px',
								searchFn: register.getDataList,
								code: 'transactionTypes',
								selectTreeProps: {
									value: 'value',
									label: 'label',
									children: 'children',
								},
								getIdsCode: 'value',
							}"
						/>
					</el-form-item>
					<!-- 金额类型筛选 -->
					<el-form-item>
						<TreeSelectInputApi
							v-model:queryForm="state.queryForm"
							:settings="{
								getTreeData: () => ({
									code: 0,
									data: amountTypes,
								}),
								text: '金额类型',
								width: '200px',
								searchFn: register.getDataList,
								code: 'amountTypes ',
								selectTreeProps: {
									value: 'value',
									label: 'label',
									children: 'children',
								},
								getIdsCode: 'value',
							}"
						/>
					</el-form-item>
					<!-- 商品类型筛选 -->
					<el-form-item>
						<TreeSelectInputApi
							v-model:queryForm="state.queryForm"
							:settings="{
								getTreeData: () => ({
									code: 0,
									data: productTypes,
								}),
								text: '商品类型',
								width: '200px',
								searchFn: register.getDataList,
								code: 'productTypes',
								selectTreeProps: {
									value: 'value',
									label: 'label',
									children: 'children',
								},
								getIdsCode: 'value',
							}"
						/>
					</el-form-item>

					<!--配送方式筛选 -->
					<el-form-item>
						<TreeSelectInputApi
							v-model:queryForm="state.queryForm"
							:settings="{
								getTreeData: () => ({
									code: 0,
									data: shippingMethods,
								}),
								text: '配送方式',
								width: '200px',
								searchFn: register.getDataList,
								code: 'shippingMethods',
								selectTreeProps: {
									value: 'value',
									label: 'label',
									children: 'children',
								},
								getIdsCode: 'value',
							}"
						/>
					</el-form-item>
					<!--拥金激励计划筛选 -->
					<el-form-item>
						<TreeSelectInputApi
							v-model:queryForm="state.queryForm"
							:settings="{
								getTreeData: () => ({
									code: 0,
									data: commissionIncentivePrograms,
								}),
								text: '拥金激励计划',
								width: '200px',
								searchFn: register.getDataList,
								code: 'commissionIncentivePrograms',
								selectTreeProps: {
									value: 'value',
									label: 'label',
									children: 'children',
								},
								getIdsCode: 'value',
							}"
						/>
					</el-form-item>
					<!--履约类型划筛选 -->
					<el-form-item>
						<TreeSelectInputApi
							v-model:queryForm="state.queryForm"
							:settings="{
								getTreeData: () => ({
									code: 0,
									data: fulfillmentTypes,
								}),
								text: '履约类型',
								width: '200px',
								searchFn: register.getDataList,
								code: 'fulfillmentTypes',
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
						<div>
							<SelectDate
								v-model:queryForm="state.queryForm"
								:settings="{
									selectStyle: {
										width: '150px',
									},
									dateStyle: {
										width: '200px',
									},
								}"
								:searchTypes="[
									{
										label: '周期日期',
										value: 'periodStartDate',
										isAddHMS: true,
										dateStart: 'periodStartDateStart',
										dateEnd: 'periodEndDateEnd',
										dateEndText: '周期开始日期',
										dateStartText: '周期结束日期',
									},
									{
										label: '交易过账时间',
										value: 'transactionPostedTimestamp',
										isAddHMS: true,
										dateStart: 'transactionPostedTimestampStart',
										dateEnd: 'transactionPostedTimestampEnd',
										dateEndText: '交易过账时间开始日期',
										dateStartText: '交易过账时间结束日期',
									},
								]"
								:getDataList="register?.getDataList"
							/>
						</div>
					</el-form-item>
					<el-form-item>
						<div class="flex item-center">
							<SelectInput
								v-model:queryForm="state.queryForm"
								:searchTypes="[
									{
										label: '客户订单号',
										value: 'customerOrderNums',
									},
									{
										label: '采购订单号',
										value: 'purchaseOrderNums',
									},
									{
										label: '合作伙伴商品 ID',
										value: 'partnerItemIds',
									},
									{
										label: '合作伙伴全球贸易项目代码',
										value: 'partnerGtins',
									},
									{
										label: '活动ID',
										value: 'campaignIds',
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
				height="600"
				ref="tableRef"
				:columns="columns"
			>
				<template #left-tool> </template>
				<template #storeInfo="{ row }">
					{{
						row.storeName && row.siteCode
							? `${row.storeName}:${row.siteCode}`
							: row.storeName || row.siteCode || '---'
					}}
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
	getWalmartSettleBillPage,
	getExportWalmartSettleBill,
} from '/@/api/board/walmart//walmartSettleBill';
import { getGroupStoreByPlatform } from '/@/api/base/store/index';

// import { getListByCondition as getListByConditionStore } from '/@/api/mcp/collectionPlan/index';
import { useMessage } from '/@/hooks/message';
import { auth } from '/@/utils/authFunction';
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

const transactionTypes = [
	{ label: 'Adjustment', value: 'Adjustment' },
	{ label: 'Campaigns', value: 'Campaigns' },
	{ label: 'Service Fee', value: 'Service Fee' },
	{ label: 'PaymentSummary', value: 'PaymentSummary' },
	{ label: 'Sale', value: 'Sale' },
	{ label: 'Refund', value: 'Refund' },
];

const amountTypes = [
	{ label: 'Commission on Product', value: 'Commission on Product' },
	{ label: 'ExcessRefundAdjustment', value: 'ExcessRefundAdjustment' },
	{ label: 'Extra Savings', value: 'Extra Savings' },
	{ label: 'Fee/Reimbursement', value: 'Fee/Reimbursement' },
	{ label: 'Item Fees', value: 'Item Fees' },
	{ label: 'Other tax (Fees)', value: 'Other tax (Fees)' },
	{ label: 'Product Price', value: 'Product Price' },
	{ label: 'Product tax', value: 'Product tax' },
	{ label: 'Product tax withheld', value: 'Product tax withheld' },
	{ label: 'Promo Code', value: 'Promo Code' },
	{ label: 'Review Accelerator Fee', value: 'Review Accelerator Fee' },
	{ label: 'SEM Marketing Fee', value: 'SEM Marketing Fee' },
	{
		label: 'Total Walmart Funded Savings',
		value: 'Total Walmart Funded Savings',
	},
	{ label: 'WFS Fee/Reimbursement', value: 'WFS Fee/Reimbursement' },
	{ label: 'WFS Inbound Fee', value: 'OWFS Inbound Fee' },
	{
		label: 'WFS Inventory Fee/Reimbursement',
		value: 'WFS Inventory Fee/Reimbursement',
	},
];

const productTypes = [
	{ label: 'Abdominal Trainers', value: 'Abdominal Trainers' },
	{ label: 'Balance Boards', value: 'Balance Boards' },
	{ label: 'Dumbbells', value: 'Dumbbells' },
	{
		label: 'Electric Abdominal Toning Belts',
		value: 'Electric Abdominal Toning Belts',
	},
	{ label: 'Elliptical Trainers', value: 'Elliptical Trainers' },
	{ label: 'Exercise Bikes', value: 'Exercise Bikes' },
	{ label: 'Exercise Rowers', value: 'Exercise Rowers' },
	{ label: 'Exercise Treadmills', value: 'Exercise Treadmills' },
	{ label: 'Home Gyms', value: 'Home Gyms' },
	{ label: 'Step Machines', value: 'Step Machines' },
	{ label: 'Trampolines', value: 'Trampolines' },
	{
		label: 'Vibrating Platform Exercise Machines',
		value: 'Vibrating Platform Exercise Machines',
	},
];

const shippingMethods = [
	{ label: 'Marketplace expedited', value: 'Marketplace expedited' },
	{ label: 'Marketplace standard', value: 'Marketplace standard' },
	{ label: 'Marketplace value', value: 'Marketplace value' },
];

const commissionIncentivePrograms = [
	{ label: 'Assortment Growth', value: 'Assortment Growth' },
	{ label: 'Flash Deals', value: 'Flash Deals' },
	{ label: 'Negotiated Referral Fee', value: 'Negotiated Referral Fee' },
	{ label: 'Others', value: 'Others' },
	{ label: 'PRO', value: 'PRO ' },
	{ label: 'Reduced Referral Fee', value: 'Reduced Referral Fee' },
	{ label: 'SCE', value: 'SCE ' },
];

const fulfillmentTypes = [
	{ label: 'Seller fulfilled', value: 'Seller fulfilled' },
	{ label: 'walmart-fulfilled', value: 'walmart-fulfilled' },
];

const state: BasicTableProps = reactive<BasicTableProps>({
	pageList: getWalmartSettleBillPage,
	columns,
	toolBarConfig: {
		handleRefresh: () => {
			register?.getDataList();
		},
		handleExport: () => {
			handleExport();
		},
		isShowExport: auth('walmartSettleBill_export'),
		settingKey: 'walmartSettleBill-index',
	},
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
			descs: [],
		};
	});
};

// 导出
const handleExport = async () => {
	try {
		// 显示加载状态
		state.loading = true;
		const ids = register?.getSelectedIds();
		// 发送请求，设置 responseType 为 'blob' 以接收二进制流
		await getExportWalmartSettleBill({
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
			platformChannelCode: 'Walmart',
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
