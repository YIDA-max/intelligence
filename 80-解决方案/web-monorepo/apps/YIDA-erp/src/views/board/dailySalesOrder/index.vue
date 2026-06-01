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
				<ToolBar
					@handleRefresh="resetQuery"
					@handleExport="handleExport"
					:is-show-export="auth('dailySalesOrder_export')"
				>
					<template #left-tool>
						<el-button
							type="primary"
							class="ml10"
							@click="handleGenerate"
							v-auth="'dailySalesOrder_generate'"
							>{{ $t('生成数据') }}
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
				row-key="id"
				ref="tableRef"
				:cell-style="tableStyle.cellStyle"
				:header-cell-style="tableStyle.headerCellStyle"
				native-scrollbar
			>
				<el-table-column
					align="center"
					type="selection"
					width="40"
					reserve-selection
				/>
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
					:label="t('平台订单号')"
					show-overflow-tooltip
					width="120"
					align="left"
				>
					<template #default="{ row }">{{ row.orderId ?? '-' }}</template>
				</el-table-column>
				<el-table-column
					prop="orderStatus"
					:label="t('订单状态')"
					show-overflow-tooltip
					width="160"
					align="left"
				>
					<template #default="{ row }">{{ row.orderStatus ?? '-' }}</template>
				</el-table-column>
				<el-table-column
					prop="normalOrPreOrder"
					:label="t('样品/正常订单')"
					show-overflow-tooltip
					width="140"
					align="left"
				>
					<template #default="{ row }">{{
						row.normalOrPreOrder ?? '-'
					}}</template>
				</el-table-column>
				<el-table-column
					prop="skuCode"
					:label="t('SKU')"
					show-overflow-tooltip
					width="220"
					align="left"
				>
					<template #default="{ row }">{{ row.skuCode ?? '-' }}</template>
				</el-table-column>
				<el-table-column
					prop="msku"
					:label="t('MSKU')"
					show-overflow-tooltip
					width="160"
					align="left"
				>
					<template #default="{ row }">{{ row.msku ?? '-' }}</template>
				</el-table-column>
				<el-table-column
					prop="quantity"
					:label="t('数量')"
					show-overflow-tooltip
					width="140"
					align="left"
				>
					<template #default="{ row }">{{ row.quantity ?? '-' }}</template>
				</el-table-column>
				<el-table-column
					prop="skuPlatformDiscount"
					:label="t('平台优惠')"
					show-overflow-tooltip
					width="140"
					align="left"
				>
					<template #default="{ row }">{{
						row.skuPlatformDiscount ?? '-'
					}}</template>
				</el-table-column>
				<el-table-column
					prop="salesRevenue"
					:label="t('销售收入')"
					show-overflow-tooltip
					width="200"
					align="left"
				>
					<template #default="{ row }">
						<div>{{ row.salesRevenue ?? '-' }}</div>
					</template>
				</el-table-column>
				<el-table-column
					prop="orderRefundAmount"
					:label="t('退款')"
					show-overflow-tooltip
					width="220"
					align="right"
				>
					<template #default="{ row }">{{
						row.orderRefundAmount ?? '-'
					}}</template>
				</el-table-column>
				<el-table-column
					prop="netRevenue"
					:label="t('净收入')"
					show-overflow-tooltip
					width="200"
					align="left"
				>
					<template #default="{ row }">{{ row.netRevenue ?? '-' }}</template>
				</el-table-column>
				<el-table-column
					prop="creatorCommission"
					:label="t('达人佣金')"
					show-overflow-tooltip
					width="180"
					align="left"
				>
					<template #default="{ row }">{{
						row.creatorCommission ?? '-'
					}}</template>
				</el-table-column>
				<el-table-column
					prop="currency"
					:label="t('币种')"
					show-overflow-tooltip
					width="180"
					align="left"
				>
					<template #default="{ row }">{{ row.currencyText ?? '-' }}</template>
				</el-table-column>

				<el-table-column
					prop="fulfillmentType"
					:label="t('发货类型')"
					show-overflow-tooltip
					width="200"
					align="left"
				>
					<template #default="{ row }">{{
						row.fulfillmentType ?? '-'
					}}</template>
				</el-table-column>
				<el-table-column
					prop="createdTime"
					:label="t('创建时间')"
					show-overflow-tooltip
					width="200"
					align="left"
				>
					<template #default="{ row }">{{ row.createdTime ?? '-' }}</template>
				</el-table-column>
				<el-table-column
					prop="createTime"
					:label="t('生成时间')"
					show-overflow-tooltip
					width="200"
					align="left"
				>
					<template #default="{ row }">{{ row.createTime ?? '-' }}</template>
				</el-table-column>
				<el-table-column
					prop="createName"
					:label="t('操作人')"
					show-overflow-tooltip
					width="200"
					align="left"
				>
					<template #default="{ row }">{{ row.createName ?? '-' }}</template>
				</el-table-column>
			</el-table>
			<pagination
				@current-change="currentChangeHandle"
				@size-change="sizeChangeHandle"
				v-bind="state.pagination"
			/>
			<confirm-dialog
				:title="'生成数据确认'"
				width="25%"
				ref="confirmRef"
				:show-icon="true"
				:confirm-button-text="'确认'"
				icon-type="info"
				@cancel="confirmRef.hide()"
				@confirm="handleConfirmGenerate"
			>
				<el-form
					:model="formData"
					ref="formRef"
					:inline="false"
					label-position="left"
				>
					<el-form-item label="创建时间">
						<el-date-picker
							style="width: 10%"
							v-model="formData.timeRange"
							type="daterange"
							start-placeholder="开始日期"
							end-placeholder="结束日期"
							:default-time="defaultTime"
						/>
					</el-form-item>
				</el-form>
			</confirm-dialog>
			<!-- 使用公共进度组件 -->
			<UploadProgressDialog
				v-model="progressDialogVisible"
				title="生成数据进度"
				ref="progressDialogRef"
			/>
		</div>
	</div>
</template>

<script setup lang="ts">
import { BasicTableProps, useTable } from '/@/hooks/table';
import { useI18n } from 'vue-i18n';
import { defineAsyncComponent, ref, reactive } from 'vue';
import { useMessage } from '/@/hooks/message';
import { getGroupStoreByPlatform } from '/@/api/base/store/index';
import { auth } from '/@/utils/authFunction';
import {
	getTiktokOrderCalculationSummaryPage,
	getExportTiktokOrderCalculationSummary,
	getGenerateSummary,
} from '/@/api/financial/dailySalesOrder/index';

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

const ConfirmDialog = defineAsyncComponent(
	() => import('/@/components/ConfirmDialog/index.vue')
);

const UploadProgressDialog = defineAsyncComponent(
	() => import('/@/components/ProgressDialog/index.vue')
);
const TreeSelectInputApi = defineAsyncComponent(
	() => import('/@/componentsApi/TreeSelectInputApi/index.vue')
);

const { t } = useI18n();
// 搜索变量
const queryRef = ref();
// table的引用
const tableRef = ref();
// 是否显示搜索
const showSearch = ref(true);

const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {},
	pageList: getTiktokOrderCalculationSummaryPage,
	loading: false,
	dataList: [],
	descs: ['create_time'],
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
// 修改平台
const changePlatform = async () => {
	loadStoreData();
	await getDataList();
};
// 导出
const handleExport = async () => {
	try {
		const ids = tableRef.value.getSelectionRows()?.map((item: any) => item.id);
		// 显示加载状态
		state.loading = true;
		// 发送请求，设置 responseType 为 'blob' 以接收二进制流
		await getExportTiktokOrderCalculationSummary({
			...state.queryForm,
			ascs: state?.ascs,
			descs: state?.descs,
			ids: ids || [],
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

const confirmRef = ref<any>(null);

const formData = ref({
	timeRange: [] as Date[],
});
const defaultTime = [
	new Date(2000, 1, 1, 0, 0, 0), // Start time: 00:00:00
	new Date(2000, 1, 1, 23, 59, 59), // End time: 23:59:59
];
const getDefaultDateRange = (): [Date, Date] => {
	const today = new Date();
	const yesterday = new Date(today);
	yesterday.setDate(today.getDate() - 1);

	const startDate = new Date(yesterday);
	startDate.setHours(0, 0, 0, 0);

	const endDate = new Date(today);
	endDate.setHours(23, 59, 59, 999);

	return [startDate, endDate];
};
// 生成数据
const handleGenerate = async () => {
	formData.value.timeRange = getDefaultDateRange();
	confirmRef.value.show();
};

// 进度对话框引用与可见性（进度由 ProgressDialog 管理）
const progressDialogVisible = ref(false);
const progressDialogRef = ref<any>(null);

const handleConfirmGenerate = async () => {
	if (!formData.value.timeRange || formData.value.timeRange.length !== 2) {
		useMessage().error('请选择有效的时间范围');
		return;
	}
	if (progressDialogRef.value?.startFakeProgress) {
		progressDialogRef.value.startFakeProgress(0);
	} else {
		progressDialogVisible.value = true;
	}
	// 格式化日期为 YYYY-MM-DD HH:mm:ss
	const formatDate = (date: Date) => {
		const year = date.getFullYear();
		const month = String(date.getMonth() + 1).padStart(2, '0');
		const day = String(date.getDate()).padStart(2, '0');
		const hours = String(date.getHours()).padStart(2, '0');
		const minutes = String(date.getMinutes()).padStart(2, '0');
		const seconds = String(date.getSeconds()).padStart(2, '0');
		return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
	};
	try {
		// 显示加载状态
		state.loading = true;
		const res = await getGenerateSummary({
			startDate: formatDate(formData.value.timeRange[0]),
			endDate: formatDate(formData.value.timeRange[1]),
		});

		if (res.code === 0) {
			useMessage().success('生成成功');
			confirmRef.value.hide();
			getDataList();
		} else {
			useMessage().error(res.msg || '生成失败');
		}
		if (progressDialogRef.value?.stopFakeProgress)
			progressDialogRef.value.stopFakeProgress();
		progressDialogVisible.value = false;
	} catch (error) {
		useMessage().error(t(error as string));
	} finally {
		// 隐藏加载状态
		state.loading = false;
		if (progressDialogRef.value?.stopFakeProgress)
			progressDialogRef.value.stopFakeProgress();
		progressDialogVisible.value = false;
	}
};
const resetQuery = () => {
	resetTableQuery(() => {
		return {
			queryForm: {
				current: 1,
				size: 10,
			},
			descs: [],
			ascs: [],
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
