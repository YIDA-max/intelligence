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
					<el-form-item prop="platformChannelCodes">
						<el-select
							v-model="state.queryForm.platformChannelCodes"
							filterable
							collapse-tags
							:max-collapse-tags="1"
							placeholder="平台渠道"
							multiple
							@change="changePlatformChannelCodes"
						>
							<el-option
								v-for="item in dictMap.platform"
								:key="item.value"
								:label="item.label"
								:value="item.value"
							/>
						</el-select>
					</el-form-item>
					<el-form-item>
						<el-select
							v-model="state.queryForm.siteCodes"
							collapse-tags
							:max-collapse-tags="1"
							clearable
							filterable
							multiple
							placeholder="站点/国家"
							style="width: 200px"
							@change="changeSiteCodes"
						>
							<el-option
								v-for="item in dictMap.countryList"
								:key="item.abbTwoCode"
								:label="`${item.abbTwoCode}-${item.chineseName}`"
								:value="item.abbTwoCode"
							/>
						</el-select>
					</el-form-item>
					<el-form-item>
						<el-select
							v-model="state.queryForm.storeIds"
							collapse-tags
							:max-collapse-tags="1"
							clearable
							filterable
							multiple
							placeholder="店铺"
							style="width: 200px"
							@change="getDataList"
						>
							<el-option
								v-for="item in storeOptionsForQuery"
								:key="item.id"
								:label="`[${item.platformChannelCode}]${item.storeName}:${item.siteCode}`"
								:value="item.id"
							/>
						</el-select>
					</el-form-item>
					<el-form-item>
						<div class="flex item-center">
							<SelectInput
								v-model:queryForm="state.queryForm"
								:settings="{
									selectStyle: {
										width: '120px',
									},
								}"
								:searchTypes="[
									{
										label: '平台订单号',
										value: 'platformOrderNos',
									},
								]"
								:getDataList="getDataList"
							/>
						</div>
					</el-form-item>
					<el-form-item>
						<el-select
							v-model="state.queryForm.orderStatuses"
							placeholder="订单状态"
							clearable
							multiple
							collapse-tags
							:max-collapse-tags="1"
							filterable
							style="width: 150px"
							@change="getDataList"
						>
							<el-option
								v-for="item in dictMap.orderStatusOption"
								:key="item.value"
								:label="item.label"
								:value="item.value"
							/>
						</el-select>
					</el-form-item>
					<el-form-item>
						<el-select
							v-model="state.queryForm.pushStatuses"
							placeholder="推送状态"
							clearable
							multiple
							collapse-tags
							:max-collapse-tags="1"
							filterable
							style="width: 150px"
							@change="getDataList"
						>
							<el-option
								v-for="item in dictMap.pushStatusOption"
								:key="item.value"
								:label="item.label"
								:value="item.value"
							/>
						</el-select>
					</el-form-item>
					<el-form-item>
						<el-select
							v-model="state.queryForm.deliveryMethod"
							placeholder="配送方式"
							clearable
							style="width: 150px"
							@change="getDataList"
						>
							<el-option
								v-for="item in dictMap.deliveryOption"
								:key="item.value"
								:label="item.label"
								:value="item.value"
							/>
						</el-select>
					</el-form-item>
					<el-form-item>
						<div class="flex item-center">
							<SelectInput
								v-model:queryForm="state.queryForm"
								:searchTypes="[
									{
										label: 'MSKU',
										value: 'mskus',
									},
								]"
								:getDataList="getDataList"
							/>
						</div>
					</el-form-item>
					<el-form-item>
						<el-cascader
							v-model="state.queryForm.deptIds"
							placeholder="部门&运营小组"
							style="width: 300px"
							clearable
							:options="dictMap.deptTree"
							collapse-tags
							:max-collapse-tags="1"
							filterable
							:props="{
								label: 'name',
								value: 'id',
								emitPath: false, // ✅ 只返回最后一个 id
								checkStrictly: false, // 默认即可，确保联动
								leafOnly: true, // ✅ 只允许选最后一级
								multiple: true,
							}"
							@change="getDataList"
						>
						</el-cascader>
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
										defaultMonthsAgo: 1,
									},
									{
										label: '订购时间',
										value: 'orderTime',
										isAddHMS: true,
										dateStart: 'orderTimeStart',
										dateEnd: 'orderTimeEnd',
									},
									{
										label: '付款时间',
										value: 'paymentTime',
										isAddHMS: true,
										dateStart: 'paymentTimeStart',
										dateEnd: 'paymentTimeEnd',
									},
									{
										label: '发货时间(北京)',
										value: 'shippingTime',
										isAddHMS: true,
										dateStart: 'shippingTimeStart',
										dateEnd: 'shippingTimeEnd',
									},
									{
										label: '发货时间(市场)',
										value: 'shippingTimeMarket',
										isAddHMS: true,
										dateStart: 'shippingTimeMarketStart',
										dateEnd: 'shippingTimeMarketEnd',
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
				<ToolBar @handleRefresh="resetQuery" @handleExport="handleExport">
					<template #left-tool>
						<el-button
							class="ml10"
							type="primary"
							@click="openDialog('import')"
							v-auth="'salesOrder_import'"
						>
							{{ $t('导入订单') }}</el-button
						>
						<el-button
							class="ml10"
							type="primary"
							@click="openDialog('remark')"
							v-auth="'salesOrder_remark'"
						>
							{{ $t('订单备注') }}</el-button
						>
						<!-- <el-button class="ml10" type="primary" @click="openDialog('cancel')"> {{ $t('取消订单') }}</el-button> -->
					</template>
				</ToolBar>
			</el-row>
			<el-table
				:data="state.dataList"
				@sort-change="sortChangeHandle"
				style="width: 100%"
				v-loading="state.loading"
				border
				row-key="orderNo"
				ref="tableRef"
				:cell-style="tableStyle.cellStyle"
				:header-cell-style="tableStyle.headerCellStyle"
				@selection-change="(val:any) => (selectedRows = val)"
				native-scrollbar
			>
				<el-table-column
					align="center"
					type="selection"
					width="40"
					fixed
					reserve-selection
				/>
				<el-table-column
					prop="platformChannelCode"
					:label="t('平台渠道')"
					show-overflow-tooltip
					min-width="200"
				>
					<template #default="{ row }">
						{{ row.platformChannelCode || '---' }}
					</template>
				</el-table-column>
				<el-table-column
					prop="storeId"
					:label="t('店铺/站点')"
					show-overflow-tooltip
					width="200"
				>
					<template #default="{ row }">
						{{ row.storeName || '---' }}:{{ row.siteCode || '---' }}
					</template>
				</el-table-column>
				<el-table-column
					prop="platformOrderNo"
					:label="t('平台订单号')"
					show-overflow-tooltip
					width="200"
				>
					<template #default="{ row }">
						<div>
							<span>{{ row.platformOrderNo || '---' }} </span>
						</div>
						<div>
							<span
								:class="row.deliveryMethod === 'FBM_DELIVERY' ? 'blue' : 'red'"
								>{{ row.deliveryMethodName || '---' }}</span
							>
							<!-- 退款标识 -->
							<span
								class="ml-1"
								v-if="row.existRefundFlag === 1 ? true : false"
							>
								<el-tag type="warning" size="small">退款</el-tag>
							</span>
						</div>
					</template>
				</el-table-column>
				<el-table-column
					prop="orderType"
					:label="t('订单类型')"
					show-overflow-tooltip
					width="150"
				>
					<template #default="{ row }">
						{{ row.orderTypeName || '---' }}
					</template>
				</el-table-column>
				<el-table-column
					prop="operationList"
					:label="t('运营')"
					show-overflow-tooltip
					width="120"
				>
					<template #default="{ row }">
						{{
							row.operationList?.length
								? row.operationList[0].operationUserName
								: '---'
						}}
						<span class="inline-block" v-if="row.operationList?.length > 1">
							<ShowList
								:list="row.operationList.map((item: any) => item.operationUserName)"
							/>
						</span>
					</template>
				</el-table-column>
				<el-table-column
					prop="operationList"
					:label="t('运营小组')"
					show-overflow-tooltip
					width="120"
				>
					<template #default="{ row }">
						{{
							row.operationList?.length ? row.operationList[0].deptName : '---'
						}}
						<span class="inline-block" v-if="row.operationList?.length > 1">
							<ShowList
								:list="row.operationList.map((item: any) => item.deptName)"
							/>
						</span>
					</template>
				</el-table-column>
				<el-table-column
					prop="orderTime"
					:label="t('订购时间(北京)')"
					show-overflow-tooltip
					width="150"
				>
					<template #default="{ row }"> {{ row.orderTime || '---' }}</template>
				</el-table-column>
				<el-table-column
					prop="paymentTime"
					:label="t('付款时间(北京)')"
					show-overflow-tooltip
					width="150"
				>
					<template #default="{ row }">
						{{ row.paymentTime || '---' }}
					</template>
				</el-table-column>
				<el-table-column
					prop="shippingTime"
					:label="t('发货时间(北京)')"
					show-overflow-tooltip
					width="150"
				>
					<template #default="{ row }">
						{{ row.shippingTime || '---' }}
					</template>
				</el-table-column>
				<el-table-column
					prop="shippingTimeMarket"
					:label="t('发货时间(市场)')"
					show-overflow-tooltip
					width="150"
				>
					<template #default="{ row }">
						{{ row.shippingTimeMarket || '---' }}
					</template>
				</el-table-column>
				<el-table-column
					prop="orderTotalAmount"
					:label="t('订单总金额')"
					show-overflow-tooltip
					width="150"
				>
					<template #default="{ row }">
						{{ row.orderTotalAmount || '---' }}
					</template>
				</el-table-column>
				<el-table-column
					prop="buyerActualPayment"
					:label="t('买家实付金额')"
					show-overflow-tooltip
					width="150"
				>
					<template #default="{ row }">
						{{ row.buyerActualPayment || '---' }}
					</template>
				</el-table-column>
				<el-table-column
					prop="refundTotalAmount"
					:label="t('退款总金额')"
					show-overflow-tooltip
					width="150"
				>
					<template #default="{ row }">
						{{ row.refundTotalAmount || '---' }}
					</template>
				</el-table-column>
				<el-table-column
					prop="orderStatus"
					:label="t('订单状态')"
					show-overflow-tooltip
					width="150"
				>
					<template #default="{ row }">
						{{ row.orderStatusName || '---' }}
					</template>
				</el-table-column>
				<el-table-column
					prop="pushStatus"
					:label="t('推送状态')"
					show-overflow-tooltip
					width="150"
				>
					<template #default="{ row }">
						{{ row.pushStatusName || '---' }}
					</template>
				</el-table-column>

				<el-table-column
					prop="sellerRemark"
					:label="t('订单备注')"
					show-overflow-tooltip
					width="150"
				>
					<template #default="{ row }">
						{{ row.orderRemark || '---' }}
					</template>
				</el-table-column>
				<el-table-column
					prop="logisticsTrackingNoList"
					:label="t('物流跟踪号')"
					show-overflow-tooltip
					width="220"
				>
					<template #default="{ row }">
						{{
							row.logisticsTrackingNoList?.length
								? row.logisticsTrackingNoList[0]
								: '---'
						}}
						<span
							class="inline-block"
							v-if="row.logisticsTrackingNoList?.length > 1"
						>
							<ShowList :list="row.logisticsTrackingNoList" />
						</span>
					</template>
				</el-table-column>
				<el-table-column
					prop="createName"
					:label="t('创建人')"
					show-overflow-tooltip
					width="150"
				>
					<template #default="{ row }">
						{{ row.createName || '---' }}
					</template>
				</el-table-column>
				<el-table-column
					prop="createTime"
					:label="t('创建时间(北京)')"
					show-overflow-tooltip
					sortable="custom"
					width="150"
				>
					<template #default="{ row }">
						{{ row.createTime || '---' }}
					</template>
				</el-table-column>
				<el-table-column
					prop="orderUpdateTime"
					:label="t('更新时间(北京)')"
					show-overflow-tooltip
					sortable="custom"
					width="150"
				>
					<template #default="{ row }">
						{{ row.orderUpdateTime || '---' }}
					</template>
				</el-table-column>
				<el-table-column :label="$t('common.action')" width="150" fixed="right">
					<template #default="{ row }">
						<div class="flex items-center">
							<el-button
								text
								type="primary"
								class="mr20"
								@click.stop.prevent="openDialog('detail', row)"
								v-auth="'salesOrder_detail'"
								>{{ $t('详情') }}
							</el-button>
							<el-button
								text
								type="primary"
								class="mr20"
								@click="openDialog('log', row)"
								v-auth="'salesOrder_log'"
								>{{ $t('日志') }}
							</el-button>
						</div>
					</template>
				</el-table-column>
			</el-table>
			<pagination
				@current-change="currentChangeHandle"
				@size-change="sizeChangeHandle"
				v-bind="state.pagination"
			/>
		</div>
		<!-- 编辑、新增  -->
		<FormDialog
			ref="detailRef"
			:currentRow="currentRow"
			:visibleType="visibleType"
			:title="title"
			@closeDialog="closeDialog"
			:dictMap="dictMap"
		></FormDialog>
		<ImportDialog
			ref="importDialogRef"
			title="导入销售订单"
			templateUrl="/files/import-template/批量新增销售订单.xlsx"
			excelUploadApi="/fbm/orderBasic/import"
			:accept="'.xlsx,.xls'"
			@refreshDataList="getDataList"
			:uploadTips="uploadTips"
		/>
		<InputDialog
			ref="remarkRef"
			title="订单备注"
			message=""
			:show-icon="true"
			icon-type="info"
			input-prop="orderRemark"
			confirm-button-type="primary"
			input-placeholder="请输入"
			inputType="textarea"
			@cancel="(e:any) => {
				remarkRef.hide()
			}"
			@confirm="(e:any) => {
				handleRemark(e)
			}"
		>
			<span>添加备注后，将覆盖订单原始备注，确认添加？</span>
		</InputDialog>
		<LogDialog
			v-model="logDialogVisible"
			:id="currentRow.id"
			:biz-type="['SALE_ORDER']"
			:showSearchForm="false"
			:showToolBar="false"
			@closeDialog="
				() => {
					logDialogVisible = false;
				}
			"
		/>
	</div>
</template>

<script setup lang="ts">
import { BasicTableProps, useTable } from '/@/hooks/table';
import { useI18n } from 'vue-i18n';
import { defineAsyncComponent, ref, reactive, computed } from 'vue';
import { useMessage } from '/@/hooks/message';
import { getListByCondition } from '/@/api/mcp/collectionPlan/index';
import {
	getorderBasicList,
	getOrderDetailByOrderNo,
	updateOrderRemark,
	getExportOrder,
} from '/@/api/fbm/salesOrder/index';
import { getUserListByCondition } from '/@/api/admin/user';
import { useMultipleDicts } from '/@/hooks/multipleDicts';
import { sysCountryList } from '/@/api/materialFlow/track';
import { getDicts } from '/@/api/admin/dict';
import { deptTree } from '/@/api/admin/dept';
import { ElMessageBox } from 'element-plus';
import { useResultDialog } from '/@/hooks/useResultDialog';

const FormDialog = defineAsyncComponent(
	() => import('./components/form-dialog.vue')
);
const ToolBar = defineAsyncComponent(
	() => import('/@/components/ToolBar/tool-bar.vue')
);
const LogDialog = defineAsyncComponent(
	() => import('/@/components/log/log-dialog.vue')
);
const SelectDate = defineAsyncComponent(
	() => import('/@/components/TableFormModule/select-date.vue')
);
const SelectInput = defineAsyncComponent(
	() => import('/@/components/TableFormModule/select-input.vue')
);
const ImportDialog = defineAsyncComponent(
	() => import('/@/components/fileUpload/importDialog.vue')
);
const InputDialog = defineAsyncComponent(
	() => import('/@/components/ConfirmDialog/InputDialog.vue')
);
const ShowList = defineAsyncComponent(
	() => import('./components/showList/showList.vue')
);

const { t } = useI18n();

const uploadTips = [
	'建议每次导入都使用最新的导入模板，避免出现不必要的错误',
	'仅支持xls/xlsx格式',
	'行数不超过5000条，文件大小不超过5M',
	'同一个平台订单存在多条记录时，以第一条为准',
];
const { open } = useResultDialog();
// table的引用
const tableRef = ref();
// 搜索变量
const queryRef = ref();
// 是否显示搜索
const showSearch = ref(true);
// 当前选中的行
const selectedRows = ref<Array<any>>([]);
// 当前点击的行
const currentRow = ref({
	id: '',
});
// 弹窗标题
const title = ref('');
// 弹窗类型
const visibleType = ref('');
// 弹窗是否可见
const visible = ref(false);
// 日志对话框是否可见
const logDialogVisible = ref(false);

// 订单备注弹窗
const remarkRef = ref();

// 导入销售订单弹窗
const importDialogRef = ref();

const detailRef = ref();

//   初始化数据
const { dictMap } = useMultipleDicts(
	[
		{
			key: 'countryList',
			fetchFn: sysCountryList,
		}, // 国家列表
		{
			key: 'storeList',
			fetchFn: getListByCondition,
		}, // 店铺
		{
			key: 'platform',
			fetchFn: getDicts,
			params: 'platform_channel',
		}, // 平台渠道
		{
			key: 'orderStatusOption',
			fetchFn: getDicts,
			params: 'order_status',
		}, // 销售订单状态
		{
			key: 'pushStatusOption',
			fetchFn: getDicts,
			params: 'push_status',
		}, // 推送状态
		{
			key: 'deliveryOption',
			fetchFn: getDicts,
			params: 'order_delivery_method',
		}, // 配送方式
		{
			key: 'deptTree',
			fetchFn: deptTree,
			params: {
				deptName: '运营中心',
				showRootFlag: 0, // 是否显示根节点 1是展示 0不展示
			},
		}, // 部门树
		{
			key: 'productManageId',
			fetchFn: getUserListByCondition,
			params: { lockFlag: 0 },
		}, // 人员列表
	],
	{
		isAuto: true,
		tableRef,
	}
);
const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {},
	pageList: getorderBasicList,
	loading: false,
	dataList: [],
	ascs: [],
	descsDefault: ['create_time'],
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

// 清空搜索条件
const resetQuery = () => {
	resetTableQuery(() => {
		// 重置时间范围
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

/** 店铺下拉：平台渠道、站点均为空时不筛对应维度；有值则按 platformChannelCode、siteCode 过滤 */
const storeOptionsForQuery = computed(() => {
	// 深拷贝
	const list = JSON.parse(JSON.stringify(dictMap.value.storeList));
	// 如果list为空，则返回空数组
	if (!Array.isArray(list) || list.length === 0) return [];
	// 平台渠道和站点都要用同一份数据
	let result = list;
	// 如果存在平台渠道，就按照平台渠道过滤
	const channelCodes = state.queryForm.platformChannelCodes;
	if (Array.isArray(channelCodes) && channelCodes.length > 0) {
		result = result.filter(
			(item: { platformChannelCode?: string }) =>
				item?.platformChannelCode &&
				channelCodes.includes(item.platformChannelCode)
		);
	}

	// 如果存在站点，就再按照站点过滤
	const siteCodes = state.queryForm.siteCodes;
	if (Array.isArray(siteCodes) && siteCodes.length > 0) {
		const siteSet = new Set(siteCodes);
		result = result.filter(
			(item: { siteCode?: string }) =>
				item?.siteCode && siteSet.has(item.siteCode)
		);
	}

	return result;
});

// 改变平台渠道代码
const changePlatformChannelCodes = () => {
	state.queryForm.storeIds = [];
	getDataList();
};

// 改变站点代码
const changeSiteCodes = () => {
	state.queryForm.storeIds = [];
	getDataList();
};

// 打开对话框
const openDialog = async (type: string, row?: any) => {
	try {
		if (type === 'detail') {
			const res = await getOrderDetailByOrderNo({ orderNo: row.orderNo });
			if (res.code === 0) {
				title.value = t('订单详情');
				visibleType.value = 'view';
				currentRow.value = res.data || {};
				detailRef.value.handleOpen();
			}
		} else if (type === 'log') {
			logDialogVisible.value = true;
			currentRow.value = row;
		} else if (type === 'remark') {
			const rows = tableRef.value?.getSelectionRows() || [];
			const ids = rows.map((item: any) => item.id);
			if (ids.length === 0) {
				useMessage().warning(t('请至少选择一条数据'));
				return;
			}
			remarkRef.value.show();
		} else if (type === 'import') {
			importDialogRef.value.show();
		} else if (type === 'cancel') {
			ElMessageBox.confirm(t('确认取消勾选的销售订单吗？'), t('取消'), {
				confirmButtonText: t('确定'),
				cancelButtonText: t('取消'),
				type: 'warning',
			}).then(() => {});
		}
	} catch (error: any) {
		useMessage().error(error?.msg || t('错误'));
	}
};
// 关闭对话框
const closeDialog = () => {
	visible.value = false;
	getDataList();
};

// 订单备注
const handleRemark = async (formData: any) => {
	const ids = tableRef.value.getSelectionRows()?.map((item: any) => item.id);
	if (!ids.length) {
		useMessage().error('至少选择一条数据');
	}
	const res = await updateOrderRemark({
		ids: ids,
		orderRemark: formData.orderRemark,
	});
	if (res?.data?.failCount > 0) {
		// 打开提示框
		open({
			title: t('错误提示'),
			data: res.data,
		});
		getDataList();
		return;
	}
	if (res.code === 0) {
		useMessage().success(t('订单备注成功'));
		remarkRef.value.hide();
		getDataList();
	} else {
		useMessage().error(res.msg || t('订单备注失败'));
	}
};

/**
 * 导出
 * */
const handleExport = async () => {
	try {
		const ids = tableRef.value.getSelectionRows()?.map((item: any) => item.id);
		// 显示加载状态
		state.loading = true;
		// 发送请求，设置 responseType 为 'blob' 以接收二进制流
		await getExportOrder({
			ids: ids || [],
			...state.queryForm,
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
</script>

<style lang="scss" scoped>
.text-blue {
	color: #0089ef;
}
.blue {
	color: #0089ef;
}
.red {
	color: #e44c5f;
}
</style>
