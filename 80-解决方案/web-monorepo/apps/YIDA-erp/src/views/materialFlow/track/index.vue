<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-row class="ml10" v-show="showSearch">
				<el-form
					:inline="true"
					:model="state.queryForm"
					@keyup.enter="getDataListAll"
					ref="queryRef"
				>
					<el-form-item>
						<div class="flex items-center">
							<TreeSelectInputApi
								v-model:queryForm="state.queryForm"
								:settings="{
									getTreeData: getDicts,
									getTreeDataParams: 'logistics_order_type',
									text: '订单类型',
									searchFn: getDataListAll,
									code: 'orderType',
									selectTreeProps: {
										value: 'label',
										label: 'label',
										children: 'children',
									},
									getIdsCode: 'label',
								}"
							/>
						</div>
					</el-form-item>
					<!-- <el-form-item>
						<el-select
							v-model="state.queryForm.shippingMethods"
							placeholder="发货方式"
							clearable
							@change="getDataListAll"
						>
							<el-option
								v-for="item in [
									{ value: 1, label: '平台发货' },
									{ value: 2, label: '自发货' },
								]"
								:key="item.value"
								:label="item.label"
								:value="item.value"
							/>
						</el-select>
					</el-form-item> -->
					<el-form-item>
						<custom-cascader
							v-model:queryForm="state.queryForm"
							:data="warehouseData"
							:settings="{
								code: 'warehouseCodes',
								text: '发货仓',
								props: {
									value: 'name',
									label: 'name',
									children: 'children',
								},
								onSearch: handleWarehouseSearch,
								checkStrictly: false,
								showSelectAll: false,
							}"
							@change="getDataListAll"
						/>
					</el-form-item>
					<el-form-item>
						<el-select
							v-model="state.queryForm.logisticsType"
							placeholder="物流类型"
							clearable
							@change="getDataListAll"
						>
							<el-option
								v-for="item in [
									{ value: 2, label: '平台仓物流' },
									{ value: 1, label: '三方仓物流' },
								]"
								:key="item.value"
								:label="item.label"
								:value="item.value"
							/>
						</el-select>
					</el-form-item>
					<el-form-item>
						<div class="flex items-center">
							<TreeSelectInputApi
								v-model:queryForm="state.queryForm"
								:settings="{
									getTreeData: logisticsCourier,
									getTreeDataParams: 'courierCode',
									text: '物流渠道',
									searchFn: getDataListAll,
									code: 'logisticsChannelCodes',
									selectTreeProps: {
										value: 'courierCode',
										label: 'courierName',
									},
									getIdsCode: 'id',
								}"
							/>
						</div>
					</el-form-item>
					<el-form-item>
						<div class="flex items-center">
							<TreeSelectInputApi
								v-model:queryForm="state.queryForm"
								:settings="{
									getTreeData: sysCountryList,
									getTreeDataParams: 'country',
									text: '发货国',
									searchFn: getDataListAll,
									code: 'originCountry',
									selectTreeProps: {
										value: 'abbTwoCode',
										label: 'chineseName',
									},
									getIdsCode: 'abbTwoCode',
									renderData: (data: any) => {
										return data.map((item: any) => {
											return {
												...item,
												chineseName: `${item.abbTwoCode}-${item.chineseName}`,
											};
										});
									},
								}"
							/>
						</div>
					</el-form-item>
					<el-form-item>
						<div class="flex items-center">
							<TreeSelectInputApi
								v-model:queryForm="state.queryForm"
								:settings="{
									getTreeData: sysCountryList,
									text: '目的国',
									code: 'destCountry',
									searchFn: getDataListAll,
									selectTreeProps: {
										value: 'abbTwoCode',
										label: 'chineseName',
									},
									getIdsCode: 'abbTwoCode',
									renderData: (data: any) => {
										return data.map((item: any) => {
											return {
												...item,
												chineseName: `${item.abbTwoCode}-${item.chineseName}`,
											};
										});
									},
								}"
							/>
						</div>
					</el-form-item>
					<el-form-item v-if="!activeTab">
						<div class="flex items-center">
							<TreeSelectInputApi
								v-model:queryForm="state.queryForm"
								:settings="{
									getTreeData: getDicts,
									getTreeDataParams: 'logistics_order_status',
									text: '物流状态',
									code: 'logisticsStatus',
									searchFn: async () => {
										await getDataListAll();
									},
									selectTreeProps: {
										value: 'value',
										label: 'label',
									},
									getIdsCode: 'value',
								}"
							/>
						</div>
					</el-form-item>
					<el-form-item v-if="activeTab !== 'orderFailed'">
						<el-select
							v-model="state.queryForm.updateStatus"
							placeholder="轨迹更新"
							clearable
							@change="getDataListAll"
						>
							<el-option
								v-for="item in [
									{ value: '1', label: '全部' },
									{ value: '2', label: '超过7天未更新' },
								]"
								:key="item.value"
								:label="item.label"
								:value="item.value"
							/>
						</el-select>
					</el-form-item>
					<el-form-item>
						<TreeSelectInputApi
							componentType="dicts"
							v-model:queryForm="state.queryForm"
							:settings="{
								getTreeDataParams: 'platform_channel',
								text: '平台渠道',
								code: 'platformNames',
								searchFn: async () => {
									await getDataListAll();
								},
								selectTreeProps: {
									value: 'value',
									label: 'label',
								},
								getIdsCode: 'value',
							}"
						/>
					</el-form-item>
					<el-form-item>
						<TreeSelectInputApi
							v-model:queryForm="state.queryForm"
							:settings="{
                  getTreeData: async () => {
                    const res = await getListByConditionStore()
                    return {
                      code: 0,
                      data: (res.data || []).map((item: any) => ({
                        ...item,
                        label: `${item.storeName}/${item.siteCode}`,
                      })),
                    }
                  },
									text: '店铺',
									code: 'shopIds',
									searchFn: async () => {
										await getDataListAll();
									},
									selectTreeProps: {
										value: 'id',
										label: 'label',
									},
									getIdsCode: 'id',
								}"
						/>
					</el-form-item>
					<el-form-item>
						<div class="flex items-center">
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
										label: '订单创建时间',
										value: 'createTime',
										isAddHMS: true,
										dateStart: 'createTimeStart',
										dateEnd: 'createTimeEnd',
									},
									{
										label: '客户付款时间',
										value: 'paymentTime',
										isAddHMS: true,
										dateStart: 'paymentTimeStart',
										dateEnd: 'paymentTimeEnd',
									},
									{
										label: '最晚发货时间',
										value: 'latestShipTime',
										isAddHMS: true,
										dateStart: 'latestShipTimeStart',
										dateEnd: 'latestShipTimeEnd',
									},
									{
										label: '最晚送达时间',
										value: 'latestDeliveryTime',
										isAddHMS: true,
										dateStart: 'latestDeliveryTimeStart',
										dateEnd: 'latestDeliveryTimeEnd',
									},

									{
										label: '订单推送时间',
										value: 'orderPushTime',
										isAddHMS: true,
										dateStart: 'orderPushTimeStart',
										dateEnd: 'orderPushTimeEnd',
									},
									{
										label: '仓库发货时间',
										value: 'warehouseShipTime',
										isAddHMS: true,
										dateStart: 'warehouseShipTimeStart',
										dateEnd: 'warehouseShipTimeEnd',
									},
									{
										label: '扫描上网时间',
										value: 'scanInternetTime',
										isAddHMS: true,
										dateStart: 'scanInternetTimeStart',
										dateEnd: 'scanInternetTimeEnd',
									},
									{
										label: '包裹派送时间',
										value: 'packageDeliveryTime',
										isAddHMS: true,
										dateStart: 'packageDeliveryTimeStart',
										dateEnd: 'packageDeliveryTimeEnd',
									},
									{
										label: '包裹签收时间',
										value: 'packageReceiptTime',
										isAddHMS: true,
										dateStart: 'packageReceiptTimeStart',
										dateEnd: 'packageReceiptTimeEnd',
									},
								]"
								:getDataList="getDataListAll"
							/>
						</div>
					</el-form-item>
					<el-form-item>
						<div class="flex items-center">
							<select-input
								:settings="{
									selectStyle: { width: '130px' },
									inputStyle: { width: '320px' },
								}"
								:selectStyle="{ width: '120px' }"
								:search-types="[
									{ label: '平台订单号', value: 'platformOrderNos' },
									{ label: '系统订单号', value: 'systemOrderNos' },
									{ label: '三方仓单号', value: 'warehouseOrderNos' },
								]"
								v-model:queryForm="state.queryForm"
								:get-data-list="getDataListAll"
							/>
						</div>
					</el-form-item>
					<el-form-item>
						<el-button @click="getDataListAll" type="primary"
							>{{ $t('搜索') }}
						</el-button>
						<el-button @click="resetQuery" type="info" plain
							>{{ $t('common.resetBtn') }}
						</el-button>
					</el-form-item>
				</el-form>
			</el-row>
			<!-- 物流跟踪列表 -->

			<!-- 物流跟踪表格 -->
			<BaseTable
				:register="register"
				ref="baseTableRef"
				:tableAttrs="tableAttrs"
			>
				<template #bottombar>
					<div class="track-tabs">
						<el-tabs v-model="activeTab">
							<el-tab-pane
								v-for="tab in tabList"
								:key="tab.name"
								:name="tab.name"
							>
								<template #label>
									<span :class="tab.type ? `tab-${tab.type}` : ''">
										{{ tab.label }} ({{ tabCounts[tab.countProp] || 0 }})
									</span>
									<el-tooltip
										popper-class="failedPopper"
										v-if="tab.tooltip"
										:content="tab.tooltip"
										placement="top"
									>
										<el-icon class="question-icon"><QuestionFilled /></el-icon>
										<template #content>
											<span
												>请检查物流渠道是否已匹配物流商代码若没有则无法查询物流轨迹，匹配后再重新操作推送订单
												<span
													class="text-blue-500"
													style="cursor: pointer"
													@click="
														router.push('/materialFlow/providerCode/index')
													"
													>前往匹配>></span
												>
											</span>
										</template>
									</el-tooltip>
								</template>
							</el-tab-pane>
						</el-tabs>
					</div>
				</template>
				<template #left-tool>
					<el-button
						class="ml10"
						type="primary"
						@click="importDialogRef.show()"
					>
						{{ $t('导入') }}
					</el-button>
					<el-button class="ml10" @click="logisticsTrajectory">
						{{ $t('同步物流轨迹') }}
					</el-button>
					<el-button
						class="ml10"
						v-if="activeTab === 'orderFailed'"
						@click="pushLogisticsOrder"
					>
						{{ $t('推送订单') }}
					</el-button>
				</template>

				<template #orderNo="{ row }">
					<div>
						<div class="flex">
							<span class="flex-shrink-0">平台单号：</span>
							<MrTextEllipsis :text="row.platformOrderNo || '-'" />
						</div>
						<div class="flex">
							<span class="flex-shrink-0">系统订单号：</span>
							<MrTextEllipsis :text="row.systemOrderNo || '-'" />
						</div>
						<div class="flex">
							<span class="flex-shrink-0">三方仓单号：</span>
							<MrTextEllipsis :text="row.warehouseOrderNo || '-'" />
						</div>
					</div>
				</template>
				<template #logisticsType="{ row }">
					{{ row.orderType == 2 ? '平台仓物流' : '三方仓物流' }}
				</template>
				<template #createTime="{ row }">
					<div>
						<div class="flex">
							<span class="flex-shrink-0">客户付款：</span>
							<MrTextEllipsis :text="row.paymentTime || '-'" />
						</div>
						<div class="flex">
							<span class="flex-shrink-0">最晚发货：</span>
							<MrTextEllipsis :text="row.latestShipTime || '-'" />
						</div>
						<div class="flex">
							<span class="flex-shrink-0">最晚送达：</span>
							<MrTextEllipsis :text="row.latestDeliveryTime || '-'" />
						</div>
						<div class="flex">
							<span class="flex-shrink-0">订单创建：</span>
							<MrTextEllipsis :text="row.createTime || '-'" />
						</div>
						<div class="flex">
							<span class="flex-shrink-0">订单推送：</span>
							<MrTextEllipsis :text="row.orderPushTime || '-'" />
						</div>
						<div class="flex">
							<span class="flex-shrink-0">仓库发货：</span>
							<MrTextEllipsis :text="row.warehouseShipTime || '-'" />
						</div>
					</div>
				</template>
				<template #orderTime="{ row }">
					<div>
						<div class="flex">
							<span class="flex-shrink-0">扫描上网：</span>
							<MrTextEllipsis :text="row.scanInternetTime || '-'" />
						</div>
						<div class="flex">
							<span class="flex-shrink-0">包裹派送：</span>
							<MrTextEllipsis :text="row.packageDeliveryTime || '-'" />
						</div>
						<div class="flex">
							<span class="flex-shrink-0">包裹签收：</span>
							<MrTextEllipsis :text="row.packageReceiptTime || '-'" />
						</div>
					</div>
				</template>
				<template #latestEvent="{ row }">
					<div
						class="track-detail"
						:class="{ 'max-h-120': row.deliveryStatus === 1 }"
					>
						{{ row.latestEvent || '-' }}
					</div>
					<div @click="viewTrackDetail(row)" class="track-detail-link">
						查看更多
					</div>
				</template>
			</BaseTable>
		</div>
		<el-dialog v-model="dialogVisible" title="物流轨迹详情" width="50%">
			<div class="logistics-track-list">
				<div v-for="item in logisticsTrackList" :key="item">
					<div>{{ item }}</div>
				</div>
			</div>
			<template #footer>
				<el-button @click="dialogVisible = false">{{ $t('关闭') }}</el-button>
			</template>
		</el-dialog>
		<ShowResultDialog ref="showResultDialog" />
		<ImportDialog
			ref="importDialogRef"
			title="导入订单"
			templateUrl="/files/import-template/尾程物流订单导入模板.xlsx"
			excelUploadApi="/tracking/logisticsOrder/import"
			@refreshDataList="getDataListAll"
		/>
	</div>
</template>

<script setup lang="ts">
import { ref, reactive, defineAsyncComponent, onMounted, watch } from 'vue';
import {
	BasicTableProps,
	useTable,
} from '/@/components/BaseTable/hooks/BaseTable';
import { columns } from './config/index';
import { useMessage } from '/@/hooks/message';
import { useI18n } from 'vue-i18n';
import { ElMessageBox } from 'element-plus';
import { QuestionFilled } from '@element-plus/icons-vue';
import { getDicts } from '/@/api/admin/dict';
import {
	getWareHouseList,
	logisticsOrderList,
	logisticsOrderCount,
	logisticsInfo,
	logisticsCourier,
	sysCountryList,
	syncLogisticsInfo,
	syncLogisticsOrder,
	exportOrder,
} from '/@/api/materialFlow/track';
import { getListByCondition as getListByConditionStore } from '/@/api/mcp/collectionPlan/index';
import debounce from 'lodash/debounce';
import type { DebouncedFunc } from 'lodash';
import { useRouter } from 'vue-router';
const MrTextEllipsis = defineAsyncComponent(
	() => import('/@/common/MrTextEllipsis/index.vue')
);
const ImportDialog = defineAsyncComponent(
	() => import('/@/components/fileUpload/importDialog.vue')
);
const TreeSelectInputApi = defineAsyncComponent(
	() => import('/@/componentsApi/TreeSelectInputApi/index.vue')
);
const CustomCascader = defineAsyncComponent(
	() => import('/@/components/TreeSelectInput/custom-cascader.vue')
);
const ShowResultDialog = defineAsyncComponent(
	() => import('/@/components/fileUpload/showResult.vue')
);
const SelectInput = defineAsyncComponent(
	() => import('/@/components/TableFormModule/select-input.vue')
);
const SelectDate = defineAsyncComponent(
	() => import('/@/components/TableFormModule/select-date.vue')
);

const router = useRouter();
const { t } = useI18n();

const getDefaultMonthRange = () => {
	const now = new Date();
	const year = now.getFullYear();
	const month = now.getMonth();
	const lastDay = new Date(year, month + 1, 0, 23, 59, 59);
	const pad = (n: number) => n.toString().padStart(2, '0');
	return {
		createTimeStart: `${year}-${pad(month + 1)}-${pad(1)} 00:00:00`,
		createTimeEnd: `${year}-${pad(month + 1)}-${pad(
			lastDay.getDate()
		)} 23:59:59`,
	};
};

// 仓库数据
const warehouseData = ref<any[]>([]);

const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: getDefaultMonthRange(),
	columns,
	toolBarConfig: {
		handleRefresh: () => {
			register?.getDataList();
		},
		handleExport: () => {
			exportPartFn();
		},
		isShowSetting: false,
	},
	pageList: async (params: any) => {
		// 转为字符串，不要了（2026年4月12日15:31:16 现在不要了）
		// let paramsObj = JSON.parse(JSON.stringify(params));
		// paramsObj = formatQueryFormToString(params);
		const res = await logisticsOrderList(params);
		// 更新标签页计数
		// tabCounts.value = res.data.logisticsOrderCnt;
		// 返回表格数据
		return {
			code: 0,
			data: res.data,
			msg: 'success',
		};
	},
	dataList: [],
	loading: false,
	descs: ['create_time'],
});
const tableAttrs = {
	rowConfig: { keyField: 'id', isHover: true },
	cellConfig: { height: 150 },
	checkboxConfig: {
		reserve: true,
		highlight: true,
		trigger: 'checkbox',
	},
	scrollY: {
		enabled: true,
		gt: 20,
		oSize: 6,
	},
};

const baseTableRef = ref();
const { register, getDataList, tableRef } = useTable(state, baseTableRef);

// 选中的行数据
const getSelectedRows = (): any[] => {
	// BaseTable内部使用的是vxe-table，获取勾选行用getCheckboxRecords
	return tableRef.value?.getCheckboxRecords?.() || [];
};
// 导入弹窗
const importDialogRef = ref();
/** 防抖：适合输入/筛选等高频触发场景 */
const getDataListDebounced: DebouncedFunc<(refresh?: boolean) => void> =
	debounce(
		(refresh: boolean = true) => {
			void getDataList(refresh); // lodash 包装后不返回 Promise，这里用 void 吞掉
		},
		1000,
		{ leading: false, trailing: true } // 最常用配置：只在停止触发后执行一次
	);
onMounted(() => {
	getTabCount();
	loadWarehouseData(); // 初始化加载仓库数据
});

// 工具方法：将数组字段转为字符串
const formatQueryFormToString = (queryForm: Record<string, any>) => {
	const formattedForm = { ...queryForm };
	// 遍历查询表单的每个字段
	for (const key in formattedForm) {
		if (Array.isArray(formattedForm[key])) {
			// 如果字段是数组，则将其转换为逗号分隔的字符串
			formattedForm[key] = formattedForm[key].join(',');
		}
	}
	return formattedForm;
};

// 查询状态栏和table数据
const getDataListAll = async () => {
	getTabCount();
	getDataListDebounced();
};

// 带查询tab数据
const getTabCount = async () => {
	state.loading = true;
	try {
		let params = JSON.parse(JSON.stringify(state.queryForm));
		delete params.createFlag;
		params = formatQueryFormToString(params);
		const res = await logisticsOrderCount({
			...params,
		});
		tabCounts.value = res.data;
	} catch (error) {
		tabCounts.value = {
			totalCnt: 0,
			queryingCnt: 0,
			notFoundCnt: 0,
			waitPickupCnt: 0,
			inTransitCnt: 0,
			arrivePickupCnt: 0,
			inDeliveryCnt: 0,
			signedCnt: 0,
			deliveryFailedCnt: 0,
			lostOrDamagedCnt: 0,
			returnedCnt: 0,
			deliveryFailed: 0,
			lost: 0,
			returned: 0,
			otherExceptionCnt: 0,
			orderFailed: 0,
		};
		state.loading = false;
	} finally {
		state.loading = false;
	}
};

// 修改 getDataList 的实现，使其返回 Promise

// 仓库选择相关
const loadWarehouseData = async (searchKeyword = '') => {
	try {
		const res = await getWareHouseList({
			warehouseName: searchKeyword, // 添加搜索参数
		});
		warehouseData.value = res.data.map((item: any) => ({
			id: item.warehouseType,
			name: item.warehouseTypeText,
			warehouseCode: item.warehouseCode,
			children: item.warehouses.map((warehouse: any) => ({
				id: warehouse.id,
				name: warehouse.warehouseName,
				warehouseCode: warehouse.warehouseCode,
			})),
		}));
	} catch (error) {
		warehouseData.value = [];
	}
};

// 处理仓库搜索
const handleWarehouseSearch = async (keyword: string) => {
	await loadWarehouseData(keyword);
};

const showSearch = ref(true);

// 选中的标签页
const activeTab = ref('');

// 标签页配置
const tabList = [
	{ name: '', label: '全部', countProp: 'totalCnt' },
	{ name: '1', label: '查询中', countProp: 'queryingCnt' },
	{ name: '2', label: '未查到', countProp: 'notFoundCnt', type: 'danger' },
	{ name: '3', label: '待揽件', countProp: 'waitPickupCnt' },
	{ name: '4', label: '运输中', countProp: 'inTransitCnt' },
	{ name: '5', label: '到达待取', countProp: 'arrivePickupCnt' },
	{ name: '6', label: '派送中', countProp: 'inDeliveryCnt' },
	{ name: '7', label: '已签收', countProp: 'signedCnt', type: 'success' },
	{
		name: '8',
		label: '投递失败',
		countProp: 'deliveryFailedCnt',
		type: 'danger',
	},
	// { name: '9', label: '拒收', countProp: 'deliveryFailedCnt', type: 'danger' },
	{
		name: '10',
		label: '丢件/破损',
		countProp: 'lostOrDamagedCnt',
		type: 'danger',
	},
	{ name: '11', label: '退件', countProp: 'returnedCnt', type: 'danger' },
	{
		name: '12',
		label: '其他异常',
		countProp: 'otherExceptionCnt',
		type: 'danger',
	},
	{
		name: 'orderFailed',
		label: '下单失败',
		countProp: 'orderFailedCnt',
		type: 'danger',
		tooltip: '点击查看下单失败的详细原因',
	},
];

// 各状态计数
interface TabCountsInterface {
	totalCnt: number;
	queryingCnt: number;
	notFoundCnt: number;
	waitPickupCnt: number;
	inTransitCnt: number;
	arrivePickupCnt: number;
	inDeliveryCnt: number;
	signedCnt: number;
	deliveryFailedCnt: number;
	lostOrDamagedCnt: number;
	returnedCnt: number;
	deliveryFailed: number;
	lost: number;
	returned: number;
	otherExceptionCnt: number;
	orderFailed: number;
	[key: string]: number; // 添加索引签名
}

const tabCounts = ref<TabCountsInterface>({
	totalCnt: 0,
	queryingCnt: 0,
	notFoundCnt: 0,
	waitPickupCnt: 0,
	inTransitCnt: 0,
	arrivePickupCnt: 0,
	inDeliveryCnt: 0,
	signedCnt: 0,
	deliveryFailedCnt: 0,
	lostOrDamagedCnt: 0,
	returnedCnt: 0,
	deliveryFailed: 0,
	lost: 0,
	returned: 0,
	otherExceptionCnt: 0,
	orderFailed: 0,
});
/*
 * 切换创建时间或更新时间
 * 当切换创建时间或更新时间时，重置时间范围
 */

/*
 * 重置查询条件
 */
const resetQuery = () => {
	state.queryForm = {};
	if (state.pagination) {
		state.pagination.current = 1;
		state.pagination.size = 10;
	}
	getDataListAll();
};

const exportPartFn = async () => {
	try {
		// 显示加载状态
		state.loading = true;
		// 发送请求，设置 responseType 为 'blob' 以接收二进制流
		let params = {
			...state.queryForm,
		};
		// 2026年4月12日15:31:16 现在不要了 !!!!!!!!!!!
		// params = formatQueryFormToString(params); // 转为字符串
		await exportOrder({
			...params,
			ascs: state?.ascs,
			descs: state?.descs,
			current: 1,
			size: 10000,
		});
	} catch (error) {
		useMessage().error(t(error as string));
	} finally {
		// 隐藏加载状态
		state.loading = false;
	}
};

// 同步物流轨迹
const logisticsTrajectory = async () => {
	const selectedRows = getSelectedRows();
	await ElMessageBox.confirm('确定要同步物流轨迹吗？', '提示', {
		confirmButtonText: '确定',
		cancelButtonText: '取消',
		type: 'info',
	});
	try {
		const params = {
			syncAll: selectedRows.length === 0,
			systemOrderNos: selectedRows.map((row) => row.systemOrderNo),
			platform: 1, // 51Tracking平台
		};

		const res = await syncLogisticsInfo(params);
		if (res.code === 0) {
			useMessage().success('同步物流轨迹成功');
			// 刷新列表
			getDataListAll();
		} else {
			useMessage().error(res.msg || '同步失败');
		}
	} catch (error: any) {
		useMessage().error(error.msg || '同步失败');
	}
};

const pushLogisticsOrder = async () => {
	const selectedRows = getSelectedRows();
	if (selectedRows.length === 0) {
		useMessage().error('请至少选择一个失败的订单进行推送');
		return;
	}
	await ElMessageBox.confirm('确定要推送订单吗？', '提示', {
		confirmButtonText: '确定',
		cancelButtonText: '取消',
		type: 'info',
	});
	try {
		const params = {
			syncAll: selectedRows.length === 0,
			systemOrderNos: selectedRows.map((row) => row.systemOrderNo),
			platform: 1, // 51Tracking平台
		};
		const res = await syncLogisticsOrder(params as any);
		if (res.code === 0) {
			useMessage().success('推送订单成功');
			// 刷新列表
			getDataListAll();
		} else {
			useMessage().error(res.msg || '推送失败');
		}
	} catch (error: any) {
		useMessage().error(error.msg || '推送失败');
	}
};

// 显示结果对话框
const showResultDialog = ref();

// 监听标签页变化
watch(
	() => activeTab.value,
	(newVal) => {
		if (newVal === 'orderFailed') {
			state.queryForm.logisticsStatus = null;
			state.queryForm.createFlag = 1;
			state.queryForm.latestEvent = '';
		} else {
			if (newVal === '') {
				state.queryForm.logisticsStatus = null;
				state.queryForm.createFlag = null;
				getTabCount();
			} else {
				// 这个要转为数组
				state.queryForm.logisticsStatus = [newVal];
				state.queryForm.createFlag = 2;
			}
		}

		const statusCol = state.columns?.find(
			(c: any) => c.field === 'deliveryStatusDesc'
		);
		if (statusCol) {
			statusCol.visible = !newVal;
		}

		getDataListDebounced();
	}
);

const dialogVisible = ref(false);
const logisticsTrackList = ref([]);

/**
 * 查看轨迹详情
 */
const viewTrackDetail = async (row: any) => {
	logisticsTrackList.value = [];
	dialogVisible.value = true;
	const res = await logisticsInfo(row.systemOrderNo);
	logisticsTrackList.value = res.data?.logisticsDetails || [];
};
</script>

<style lang="scss" scoped>
.track-tabs {
	margin: 10px 0;
}

:deep(.el-table) {
	.cell {
		text-align: left !important;
	}
	th.el-table__cell {
		text-align: left !important;
	}
}

.track-detail {
	margin-top: 5px;
	color: #666;
	font-size: 14px;
	max-height: 120px;
	overflow-y: hidden;
}
.track-detail-link {
	color: #2e5cf6;
	cursor: pointer;
	margin-left: 5px;
}
.tab-danger {
	color: #f76161;
}
.tab-success {
	color: #68d974;
}
.question-icon {
	margin-left: 4px;
	font-size: 14px;
	color: #909399;
	cursor: help;
}
.logistics-track-list {
	font-size: 16px;
}
</style>
<style>
.failedPopper {
	width: 200px;
}
</style>
