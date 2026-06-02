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
					<AdvancedSearchStyle ref="AdvancedSearchStyleRef">
						<template #default>
							<el-form-item>
								<div class="flex item-center">
									<SelectInput
										v-model:queryForm="state.queryForm"
										:searchTypes="[
											{
												label: '订柜号',
												value: 'orderContainerNoList',
											},
											{
												label: '柜号',
												value: 'containerNoList',
											},
											{
												label: 'SO',
												value: 'SONoList',
											},
											{
												label: '发货单号',
												value: 'deliveryNoList',
											},
											{
												label: 'SKU',
												value: 'skuCodeList',
											},
										]"
										:getDataList="getDataList"
									/>
								</div>
							</el-form-item>
							<el-form-item>
								<TreeSelectInputApi
									v-model:queryForm="state.queryForm"
									componentType="dicts"
									multiple
									:searchFn="getDataList"
									:settings="{
										text: '状态',
										code: 'statusList',
										getTreeDataParams: 'order_container_status',
										width: '200px',
									}"
								/>
							</el-form-item>
							<el-form-item>
								<el-select
									v-model="state.queryForm.outboundAttachFlag"
									collapse-tags
									:max-collapse-tags="1"
									clearable
									filterable
									multiple
									placeholder="附件上传状态"
									style="width: 200px"
									:searchFn="getDataList"
								>
									<el-option
										v-for="item in [
											{ label: '已上传', value: 1, key: 1 },
											{ label: '未上传', value: 0, key: 2 },
										]"
										:key="item.value"
										:label="item.label"
										:value="item.value"
									/>
								</el-select>
							</el-form-item>
							<el-form-item>
								<TreeSelectInputApi
									v-model:queryForm="state.queryForm"
									componentType="country"
									multiple
									:searchFn="getDataList"
									:settings="{
										text: '目的国',
										code: 'destCountryCodeList',
										width: '200px',
									}"
								/>
							</el-form-item>
							<el-form-item>
								<TreeSelectInputApi
									v-model:queryForm="state.queryForm"
									componentType="basePort"
									multiple
									:searchFn="getDataList"
									:settings="{
										text: '目的港',
										code: 'destPortCodeList',
										width: '220px',
									}"
								/>
							</el-form-item>
							<el-form-item>
								<TreeSelectInputApi
									v-model:queryForm="state.queryForm"
									componentType="warehouseQianyi"
									multiple
									:searchFn="getDataList"
									:settings="{
										text: '目的仓',
										code: 'destWarehouseCodeList',
									}"
								/>
							</el-form-item>
							<el-form-item>
								<SelectCategory
									:queryForm="state.queryForm"
									:settings="{
										categoryStyle: { width: '150px' },
										optionStyle: { width: '220px' },
									}"
									:placeholder="'货代类型'"
									:categoryList="forwarderTypesOptions"
									:optionList="forwarderTypesList"
									:categoryFieldName="'forwarderType'"
									:optionFieldName="'forwarderOptList'"
									@categoryChangeItem="changeForwarderType"
									:getDataList="getDataList"
								/>
							</el-form-item>
							<el-form-item>
								<TreeSelectInputApi
									v-model:queryForm="state.queryForm"
									componentType="userList"
									multiple
									:searchFn="getDataList"
									:settings="{
										text: '创建人',
										code: 'createIds',
										width: '220px',
									}"
								/>
							</el-form-item>
							<el-form-item>
								<el-select
									clearable
									filterable
									multiple
									:searchFn="getDataList"
									v-model="state.queryForm.transshipmentFlag"
									placeholder="是否中转拆柜"
								>
									<el-option
										v-for="item in [
											{ id: 0, label: '否', value: 0 },
											{ id: 1, label: '是', value: 1 },
										]"
										:key="item.value"
										:label="item.label"
										:value="item.value"
									/>
								</el-select>
							</el-form-item>
						</template>
						<template #second>
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
											// {
											// 	label: '预计装柜时间',
											// 	value: 'estimatedLoadingDate',
											// 	isAddHMS: true,
											// 	dateStart: 'estimatedLoadingTimeStart',
											// 	dateEnd: 'estimatedLoadingTimeEnd',
											// },
											{
												label: '实际装柜时间',
												value: 'actualOutStockDate',
												isAddHMS: true,
												dateStart: 'actualLoadingTimeStart',
												dateEnd: 'actualLoadingTimeEnd',
											},
										]"
										:getDataList="getDataList"
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
												label: '截SI时间',
												value: 'siCutoffDate',
												isAddHMS: true,
												dateStart: 'siCutoffTimeStart',
												dateEnd: 'siCutoffTimeEnd',
											},
											{
												label: '截单时间',
												value: 'docCutoffDate',
												isAddHMS: true,
												dateStart: 'docCutoffTimeStart',
												dateEnd: 'docCutoffTimeEnd',
											},
											{
												label: '截关时间',
												value: 'customsCutoffDate',
												isAddHMS: true,
												dateStart: 'customsCutoffTimeStart',
												dateEnd: 'customsCutoffTimeEnd',
											},
										]"
										:getDataList="getDataList"
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
												label: '创建时间',
												value: 'createdTime',
												isAddHMS: true,
												dateStart: 'createTimeStart',
												dateEnd: 'createTimeEnd',
											},
										]"
										:getDataList="getDataList"
									/>
								</div>
							</el-form-item>
						</template>
						<template #right>
							<el-form-item>
								<div class="flex item-center">
									<el-button @click="getDataList" type="primary"
										>{{ $t('搜索') }}
									</el-button>
									<el-button @click="resetQuery" type="info" plain
										>{{ $t('common.resetBtn') }}
									</el-button>
									<el-button
										type="info"
										plain
										@click="
											() => {
												AdvancedSearchStyleRef.changeSecondToggle();
											}
										"
										>{{
											$t(
												`${
													AdvancedSearchStyleRef?.showSecond ? '收起' : '展开'
												}`
											)
										}}
									</el-button>
								</div>
							</el-form-item>
						</template>
					</AdvancedSearchStyle>
				</el-form>
			</el-row>
			<BaseTable
				ref="baseTableRef"
				:register="register"
				:rowConfig="{ keyField: 'id' }"
			>
				<template #left-tool>
					<el-button class="ml10" @click="openDialog('input')">
						{{ $t('批量导入') }}</el-button
					>
					<el-button class="ml10" @click="handleExportLoadingAllocation">
						{{ $t('导出装车单') }}</el-button
					>
					<el-button
						v-auth="'orderContainer_rejectPrevStep'"
						class="ml10"
						@click="handleBatchRejectPrevStep"
					>
						{{ $t('驳回上一步') }}</el-button
					>
				</template>

				<!-- 目的仓：多仓库 popover 展示 -->
				<template #destWarehouse="{ row }">
					{{
						[...new Set(row?.destWarehouseNameList || [])].join(', ') || '--'
					}}
				</template>

				<!-- 出库附件上传 -->
				<template #outboundAttachFlag="{ row }">
					{{ row.outboundAttachFlag == 1 ? '已上传' : '未上传' }}
				</template>

				<!-- 附件 -->
				<template #attachmentUrlList1="{ row }">
					<el-tooltip
						v-if="row.attachmentUrlList?.length"
						placement="right"
						effect="dark"
						popper-class="tooltip-content"
					>
						<!-- tooltip 展示全部 -->
						<template #content>
							<div v-for="(value, index) in row.attachmentUrlList" :key="value">
								<el-link
									@click="openPreviewDialog(value)"
									target="_blank"
									type="primary"
								>
									{{ row.attachmentTriple[index].originalFileName || '---' }}
								</el-link>
							</div>
						</template>
						<!-- 表格里只显示前2个（竖排） -->
						<div class="attachment-list">
							<div
								v-for="(value, index) in row.attachmentUrlList.slice(0, 2)"
								:key="value"
								class="attachment-item"
							>
								<el-link
									@click="openPreviewDialog(value)"
									target="_blank"
									type="primary"
								>
									{{ row.attachmentTriple[index]?.originalFileName || '---' }}
									{{
										row.attachmentUrlList.length > 2 && index === 1 ? '...' : ''
									}}
								</el-link>
							</div>
						</div>
					</el-tooltip>
					<template v-else>---</template>
				</template>

				<!-- 操作列 -->
				<template #action="{ row }">
					<div class="flex items-center">
						<el-button
							text
							type="primary"
							class="mr5"
							@click="openDialog('view', row)"
							v-auth="'orderContainer_detail'"
						>
							{{ $t('详情') }}</el-button
						>
						<el-dropdown placement="bottom-end">
							<el-button
								text
								v-if="
									auths([
										'orderContainer_edit',
										'orderContainer_confirmBooking',
										'orderContainer_confirmShipment',
										'orderContainer_cancel',
										'orderContainer_postEmail',
										'orderContainer_exportDeliver',
										'orderContainer_arrangeLoading',
										'orderContainer_confirmPickup',
										'orderContainer_firstLegTransfer',
										'orderContainer_log',
									])
								"
							>
								<el-icon class="el-icon--right"><arrow-down /></el-icon>
							</el-button>
							<template #dropdown>
								<el-dropdown-menu>
									<el-dropdown-item
										v-for="item in getVisibleActions(row)"
										:key="item.permission"
										@click="handleActionClick(item, row)"
									>
										{{ $t(item.label) }}
									</el-dropdown-item>
								</el-dropdown-menu>
							</template>
						</el-dropdown>
					</div>
				</template>
			</BaseTable>
		</div>
		<!-- 编辑弹窗 -->
		<orderContainerDialog
			ref="orderContainerRef"
			:title="editDialogTitle"
			:visiableType="editVisiableType"
			:currentRow="currentRow"
			:dictMap="dictMap"
			@closeDialog="getDataList"
		/>
		<!-- 确认发货弹窗 -->
		<SubmitShipDialog
			ref="submitShipRef"
			:title="'确认发货'"
			:dictMap="dictMap"
			:currentRow="currentRow"
			@closeDialog="getDataList"
		/>
		<!-- 头程调拨弹窗 -->
		<FirstAllotDialog
			ref="firstAllotRef"
			:title="'头程调拨'"
			:dictMap="dictMap"
			:currentRow="currentRow"
			@closeDialog="getDataList"
		/>
		<!-- 安排装柜弹窗 -->
		<ArrangeContainerDialog
			v-if="arrangeContainerVisible"
			:dictMap="dictMap"
			:currentRow="currentRow"
			@closeDialog="
				arrangeContainerVisible = false;
				getDataList();
			"
		/>
		<!-- 确认提货弹窗 -->
		<ConfirmDeliveryGoodsDialog
			v-if="confirmPickupVisible"
			:dictMap="dictMap"
			:currentRow="currentRow"
			@closeDialog="
				confirmPickupVisible = false;
				getDataList();
			"
		/>
		<!-- 日志对话框 -->
		<LogDialog
			v-model="logDialogVisible"
			:id="currentRow.id"
			:biz-type="['LOGISTICS_ORDER_CONTAINER']"
			:showSearchForm="false"
			:showToolBar="false"
			@closeDialog="
				() => {
					logDialogVisible = false;
				}
			"
		/>
		<!-- 维护工厂回复交期弹窗 -->
		<date-dialog
			ref="factoryDateDialog"
			title="未维护预计装柜时间"
			:show-icon="true"
			icon-type="info"
			dateType="datetime"
			valueFormat="YYYY-MM-DD HH:mm:ss"
			date-prop="factoryDate"
			dateLabel="预计装柜时间"
			date-placeholder="请选择日期"
			@cancel="factoryDateDialog.hide()"
			confirm-button-text="下一步"
			@confirm="handleFactoryDate"
		>
			<span class="red">维护后自动同步更新到货柜中</span>
		</date-dialog>
		<ImportDialog
			ref="importDialogRef"
			title="批量导入订柜信息"
			:showExpandTip="`PS:下载模板时,会根据筛选条件带出订柜管理数据，没有符合条件的则为空`"
			excelUploadApi="/mcp/orderContainer/importOrderContainerInfo"
			@refreshDataList="getDataList"
			@downloadTemplate="downloadNeedTemplate('bookedContainerInformation')"
		/>
		<EmailDialog
			ref="emailDialogRef"
			:currentRow="currentRow"
			@refresh="getDataList"
		/>
		<UpFile
			ref="upFileRef"
			:currentRow="currentRow"
			:show-icon="true"
			:icon-type="'info'"
			:cancel-button-text="$t('取消')"
			:confirm-button-text="$t('确认')"
			:confirm-button-type="'primary'"
			:width="'800px'"
			@confirm="
				(e) => {
					confirmUpFile(e);
				}
			"
			@cancel="
				() => {
					upFileRef.hide();
				}
			"
		/>
	</div>
</template>

<script setup lang="ts">
import {
	BasicTableProps,
	useTable,
} from '/@/components/BaseTable/hooks/BaseTable';
import { useI18n } from 'vue-i18n';
import { defineAsyncComponent, ref, reactive, nextTick } from 'vue';
import { useMessage } from '/@/hooks/message';
import { ElMessageBox } from 'element-plus';
import { auth, auths } from '/@/utils/authFunction';
import {
	getOrderContainerPage,
	getOrderContainerDetail,
	confirmOrder,
	cancelOrderContainer,
	exportLoadingList,
	exportLoadingAllocation,
	exportContainer,
	uploadFileAttachment,
	updateEstimatedLoadingTime,
	getExportBookedContainerInformation,
	getExportCutoffDataInformation,
	postOrderContainerRejectPrevious,
} from '/@/api/materialFlow/orderContainer/index';
import { useResultDialog } from '/@/hooks/useResultDialog';
import { getForwarderList } from '/@/api/materialFlow/freightForwarder/index';
import { getWarehouseInfoList } from '/@/api/warehouse/third-warehouse/index';
import { useMultipleDicts } from '/@/hooks/multipleDicts';
import { OrderContainerStatus } from './confige/enums';
import { actionMenuList, columns } from './confige/index';
import { usePreviewDialog } from '/@/components/FilePreviewDialog/usePreviewDialog/index';
const { open: openPreviewDialog } = usePreviewDialog();
const UpFile = defineAsyncComponent(() => import('./components/upFile.vue'));

const ImportDialog = defineAsyncComponent(
	() => import('/@/components/fileUpload/importDialog.vue')
);
const orderContainerDialog = defineAsyncComponent(
	() => import('./components/form-dialog/form-dialog.vue')
);
const SubmitShipDialog = defineAsyncComponent(
	() => import('./components/confirmShipment/form-dialog.vue')
);
const FirstAllotDialog = defineAsyncComponent(
	() => import('./components/firstAllot/form-dialog.vue')
);
const ArrangeContainerDialog = defineAsyncComponent(
	() => import('./components/arrangeContainerLoading/index.vue')
);
const ConfirmDeliveryGoodsDialog = defineAsyncComponent(
	() => import('./components/confirmDeliveryGoods/index.vue')
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
const AdvancedSearchStyle = defineAsyncComponent(
	() => import('/@/components/TableFormModule/advanced-search-style.vue')
);
const EmailDialog = defineAsyncComponent(
	() => import('./components/postEmailDialog.vue')
);
const DateDialog = defineAsyncComponent(
	() => import('/@/components/ConfirmDialog/DateDialog.vue')
);
const importDialogRef = ref();
const SelectCategory = defineAsyncComponent(
	() => import('/@/components/TableFormModule/select-category.vue')
);
const TreeSelectInputApi = defineAsyncComponent(
	() => import('/@/componentsApi/TreeSelectInputApi/index.vue')
);

const { open } = useResultDialog();
// table的引用
const baseTableRef = ref();

const { t } = useI18n();

// 搜索变量
const queryRef = ref();
// 是否显示搜索
const showSearch = ref(true);
// 高级搜索布局的引用
const AdvancedSearchStyleRef = ref();
// 编辑弹窗的引用
const orderContainerRef = ref();
// 确认发货弹窗
const submitShipRef = ref();
// 头程调拨弹窗
const firstAllotRef = ref();
const arrangeContainerVisible = ref(false);
const confirmPickupVisible = ref(false);
const editDialogTitle = ref(''); //  编辑详情弹窗标题
const editVisiableType = ref(''); //  编辑详情弹窗标题
// 上传组件的引用
const upFileRef = ref();
// 发送邮件dialog
const emailDialogRef = ref();
// 当前点击的行
const currentRow = ref<any>({
	id: '',
	shipmentQuantity: 0,
});
// 日志对话框是否可见
const logDialogVisible = ref(false);
const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {
		// statusList: ['1'], // 默认待订舱
	},
	pageList: getOrderContainerPage,
	columns,
	ascs: [],
	descs: ['create_time'],
	toolBarConfig: {
		handleRefresh: () => register?.getDataList(),
		handleExport: () => handleExport(),
		settingKey: 'orderContainer_index',
	},
});
//  table hook
const { register, getDataList, resetTableQuery } = useTable(
	state,
	baseTableRef
);

// 重置
const resetQuery = () => {
	resetTableQuery(() => ({
		queryForm: { current: 1, size: 10 },
		descs: ['create_time'],
		ascs: [],
	}));
};

const { dictMap } = useMultipleDicts(
	[
		{
			key: 'thirdWarehouseList',
			fetchFn: getWarehouseInfoList,
			params: {
				status: 1,
			},
		}, // 三方仓仓库列表
	],
	{
		isAuto: true,
		tableRef: baseTableRef,
	}
);

const forwarderTypesOptions = ref<
	Array<{ label: string; value: string | number; prop: string | number }>
>([
	{ label: '国内拖车报关', value: 'DOMESTIC', prop: 1 },
	{ label: '海运/空运/铁路', value: 'MAIN', prop: 2 },
	{ label: '清关', value: 'CUSTOMS', prop: 3 },
	{ label: '国外拖车', value: 'DELIVERY', prop: 4 },
]);
// 货代数据
const forwarderTypesList = ref<
	Array<{ label: string; value: string | number }>
>([]);

// 修改货代类型
const changeForwarderType = async (selectedOption: any) => {
	const forwarderType = selectedOption?.prop;
	const res = await getForwarderList({
		forwarderTypes: [forwarderType],
	});
	forwarderTypesList.value =
		res.data.map((item: any) => {
			return {
				label: item.forwarderName,
				value: item.forwarderCode,
			};
		}) || [];
};

// 判断操作按钮是否显示（基于 actionMenuList 配置驱动）
const canShowAction = (permission: string, row: any): boolean => {
	const item = actionMenuList.find((m) => m.permission === permission);
	if (!item) return false;
	const statusOk =
		item.statusList.length === 0 || item.statusList.includes(row.status);
	return statusOk && auth(permission);
};

const getVisibleActions = (row: any) =>
	actionMenuList.filter((m) => canShowAction(m.permission, row));

const handleActionClick = (item: any, row: any) => {
	if (item.event === 'upload') {
		currentRow.value = row;
		upFileRef.value.show();
	} else {
		openDialog(item.event, row);
	}
};

// 打开对话框
const openDialog = async (type: string, row?: any) => {
	try {
		if (type === 'confirmBooking') {
			// 确认订舱
			if (row.status !== OrderContainerStatus.WAIT_ORDERING) {
				useMessage().warning(t('只能操作状态为【待订舱】的订柜单据'));
				return;
			}
			ElMessageBox.confirm(
				`确定订柜号${row.orderContainerNo}已完成订舱?`,
				'确认订舱',
				{
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning',
				}
			).then(async () => {
				const res = await confirmOrder({ id: row.id });
				if (res.code === 0) {
					if (res?.data?.failCount > 0) {
						// 打开提示框
						open({
							title: t('错误提示'),
							data: res.data,
						});
						getDataList();
						return;
					} else {
						useMessage().success(t('订舱成功'));
						getDataList();
					}
				}
			});
		} else if (type === 'cancel') {
			// 作废
			if (row.status === OrderContainerStatus.ALREADY_OUT_STORAGE) {
				useMessage().warning(t('只能操作状态不是【已出库】的订柜单据'));
				return;
			}
			ElMessageBox.confirm(
				`确认作废订柜号${row.orderContainerNo}?`,
				'作废确认',
				{
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning',
				}
			).then(async () => {
				const res = await cancelOrderContainer({ id: row.id });
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
					useMessage().success(t('作废成功'));
				} else {
					useMessage().error(res.msg || t('作废失败'));
				}
				getDataList();
			});
		} else if (type === 'log') {
			// 日志
			logDialogVisible.value = true;
			currentRow.value = row;
		} else if (type === 'postEmail') {
			if (
				row.status !== OrderContainerStatus.ALREADY_ORDERING &&
				row.status !== OrderContainerStatus.ALREADY_SEND_MAIL
			) {
				useMessage().warning(
					t('只能操作状态为【已订舱、已发送工厂邮件】的订柜单据')
				);
				return;
			}
			currentRow.value = row;
			// if (!row.estimatedLoadingTime) {
			// 	factoryDateDialog.value.show();
			// } else {
			emailDialogRef.value.openDialog(row.orderContainerNo);
			// }
		} else if (type === 'edit') {
			if (
				row.status === OrderContainerStatus.ALREADY_OUT_STORAGE ||
				row.status === OrderContainerStatus.CANCEL
			) {
				useMessage().warning(
					t('只能操作状态为【待订舱、已订舱、已发送工厂邮件】的订柜单据')
				);
				return;
			}
			const res = await getOrderContainerDetail({
				id: row.id,
			});
			if (res.code === 0) {
				currentRow.value = res.data;
			}
			await nextTick();
			editDialogTitle.value = `编辑${row.orderContainerNo}`;
			editVisiableType.value = 'edit';
			orderContainerRef.value?.handleOpen(currentRow.value);
		} else if (type === 'confirmShipment') {
			// if (row.status !== OrderContainerStatus.PICKED_UP) {
			// 	useMessage().warning(t('只能操作状态为【已发送工厂邮件】的订柜单据'));
			// 	return;
			// }
			const res = await getOrderContainerDetail({
				id: row.id,
			});
			if (res.code === 0) {
				currentRow.value = res.data;
			}
			await nextTick();
			submitShipRef.value?.handleOpen(currentRow.value);
		} else if (type === 'view') {
			const res = await getOrderContainerDetail({
				id: row.id,
			});
			if (res.code === 0) {
				currentRow.value = res.data;
			}
			await nextTick();
			editDialogTitle.value = `详情${row.orderContainerNo}`;
			editVisiableType.value = 'view';
			orderContainerRef.value?.handleOpen(currentRow.value);
		} else if (type === 'exportDeliverGoods') {
			// 导出装柜清单
			await exportLoadingList({
				id: row.id,
			});
		} else if (type === 'input') {
			importDialogRef.value.show();
			return;
		} else if (type === 'exportCutoffData') {
			// 导出截单资料
			await getExportCutoffDataInformation({
				id: row.id,
			});
		} else if (type === 'arrangeLoading') {
			// 安排装柜
			currentRow.value = row;
			arrangeContainerVisible.value = true;
		} else if (type === 'confirmPickup') {
			// 确认提货
			currentRow.value = row;
			confirmPickupVisible.value = true;
		} else if (type === 'firstLegTransfer') {
			// 头程调拨
			const res = await getOrderContainerDetail({
				id: row.id,
			});
			if (res.code === 0) {
				currentRow.value = res.data;
			}
			await nextTick();
			firstAllotRef.value?.handleOpen(currentRow.value);
		}
	} catch (error: any) {
		useMessage().error(error?.msg || t('错误'));
	}
};

const handleBatchRejectPrevStep = async () => {
	const rows = register.safeCallTableMethod('getCheckboxRecords') ?? [];
	if (!rows.length) {
		useMessage().warning(t('请先选择要驳回的记录'));
		return;
	}
	const res: any = await postOrderContainerRejectPrevious({
		ids: rows.map((r: any) => r.id),
	});
	if (res?.data?.failCount > 0) {
		open({
			title: t('错误提示'),
			data: res.data,
		});
		getDataList();
		return;
	} else if (res.code === 0) {
		useMessage().success(t('驳回成功'));
	}
	getDataList();
};

// 批量导出装车单（仅已安排装柜及后续状态可导出）
const handleExportLoadingAllocation = async () => {
	try {
		const selectedRows =
			register.safeCallTableMethod('getCheckboxRecords') || [];
		//
		state.loading = true;
		const ids = selectedRows.map((item: any) => item.id);
		await exportLoadingAllocation({
			...state.queryForm,
			ids,
			ascs: state?.ascs,
			descs: state?.descs,
			current: 1,
			size: 1000,
		});
	} catch (error: any) {
		useMessage().error(error?.msg || t('导出失败'));
	} finally {
		state.loading = false;
	}
};

// 维护预计装柜时间弹窗
const factoryDateDialog = ref();
// 维护预计装柜时间
const handleFactoryDate = async (formData: any) => {
	try {
		if (!formData.factoryDate) {
			useMessage().warning('请选择预计装柜时间');
			return;
		}
		// 维护预计装柜时间API调用 todo
		const res = await updateEstimatedLoadingTime({
			id: currentRow.value.id,
			updateEstimatedLoadingTime: formData.factoryDate,
		});
		if (res.code === 0) {
			factoryDateDialog.value.hide();
			if (res?.data?.failCount > 0) {
				// 显示结果对话框
				open({
					data: res.data,
					title: '维护预计装柜时间失败',
				});
			} else {
				useMessage().success('维护预计装柜时间成功');
				emailDialogRef.value.openDialog(currentRow.value.orderContainerNo);
			}
			getDataList();
		}
	} catch (error: any) {
		useMessage().error(error?.msg || '维护预计装柜时间失败');
	}
};

// 导出
const handleExport = async () => {
	try {
		const ids = register.getSelectedIds();
		state.loading = true;
		await exportContainer({
			...state.queryForm,
			ids: ids.length > 0 ? ids : undefined,
			ascs: state?.ascs,
			descs: state?.descs,
			current: 1,
			size: 10000,
		});
	} catch (error) {
		useMessage().error(t(error as string));
	} finally {
		state.loading = false;
	}
};

type DownloadType = 'bookedContainerInformation';
const downloadApiMap: Record<DownloadType, (params: any) => Promise<any>> = {
	bookedContainerInformation: getExportBookedContainerInformation,
};
const downloadNeedTemplate = async (type: DownloadType) => {
	try {
		const ids = register
			.safeCallTableMethod('getCheckboxRecords')
			?.map((item: any) => item.id);

		state.loading = true;

		const api = downloadApiMap[type];

		await api({
			ids,
			...state.queryForm,
			pageNum: 1,
			pageSize: 999999,
		});
	} catch (error) {
		useMessage().error(t(error as string));
	} finally {
		state.loading = false;
	}
};

// 确定上传附件的回调
const confirmUpFile = async (e: any) => {
	const res = await uploadFileAttachment({
		id: currentRow.value.id,
		labelingPhotoFileUrl: e.labelingPhotoFileUrl,
		loadingPhotoFileUrl: e.loadingPhotoFileUrl,
		factoryDeliveryOrderFileUrl: e.factoryDeliveryOrderFileUrl,
		attachment: e.attachment,
	});
	if (res.code === 0) {
		useMessage().success(t('上传成功'));
		// 关闭弹窗
		upFileRef.value?.hide();
	}
	getDataList();
};
</script>

<style lang="scss" scoped>
.text-blue {
	color: #0089ef;
}
.spanLabel {
	max-width: 100px;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}
.red {
	color: red;
}
.attachment-list {
	display: flex;
	flex-direction: column;
	gap: 2px;
}

.attachment-item {
	line-height: 1.2;
}

.more {
	color: #999;
	font-size: 12px;
}
.tooltip-content {
	max-height: 500px;
}
</style>
<style>
.tooltip-content {
	max-height: 400px;
	overflow-y: auto;
}
</style>
