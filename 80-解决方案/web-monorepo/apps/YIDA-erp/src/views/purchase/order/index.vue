<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-row class="ml10" v-show="showSearch">
				<el-form
					:inline="true"
					:model="state.queryForm"
					@keyup.enter="freshTable"
					ref="queryRef"
				>
					<el-form-item>
						<SelectInput
							v-model:queryForm="state.queryForm"
							:searchTypes="[{ label: '采购订单', value: 'purchaseNos' }]"
							:getDataList="freshTable"
						/>
					</el-form-item>
					<el-form-item>
						<SelectInput
							v-model:queryForm="state.queryForm"
							:searchTypes="[{ label: 'SKU', value: 'skuCodes' }]"
							:getDataList="freshTable"
						/>
					</el-form-item>
					<el-form-item>
						<TreeSelectInputApi
							v-model:queryForm="state.queryForm"
							componentType="dicts"
							:settings="{
								text: '状态',
								code: 'statusList',
								searchFn: freshTable,
								getTreeDataParams: 'purchase_order_status',
							}"
						/>
					</el-form-item>
					<el-form-item v-auth="'order_supplier'">
						<TreeSelectInputApi
							v-model:queryForm="state.queryForm"
							componentType="qianyiSupplier"
							:settings="{
								text: '供应商',
								code: 'supplierNos',
								searchFn: freshTable,
							}"
						/>
					</el-form-item>
					<el-form-item>
						<TreeSelectInputApi
							v-model:queryForm="state.queryForm"
							componentType="legalEntity"
							:settings="{
								text: '法人主体',
								code: 'legalPersonIds',
								searchFn: freshTable,
							}"
						/>
					</el-form-item>
					<el-form-item>
						<TreeSelectInputApi
							v-model:queryForm="state.queryForm"
							componentType="userList"
							:settings="{
								text: '采购员',
								code: 'purchaseUserIds',
								searchFn: freshTable,
								getTreeDataParams: {
									postCodeList: [
										'PURCHASING_DIRECTOR',
										'PURCHASING_MANAGER',
										'PROCUREMENT_MANAGER',
										'PURCHASING_OFFICER',
									],
								},
							}"
						/>
					</el-form-item>
					<el-form-item>
						<SelectInput
							v-model:queryForm="state.queryForm"
							:searchTypes="[{ label: '需求单号', value: 'demandNos' }]"
							:getDataList="freshTable"
						/>
					</el-form-item>
					<el-form-item>
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
							:getDataList="freshTable"
						/>
					</el-form-item>
					<el-form-item>
						<el-button @click="freshTable" type="primary">{{
							$t('搜索')
						}}</el-button>
						<el-button @click="resetQuery" type="info" plain>{{
							$t('common.resetBtn')
						}}</el-button>
					</el-form-item>
				</el-form>
			</el-row>

			<BaseTable
				ref="baseTableRef"
				:register="register"
				:rowConfig="{ keyField: 'id' }"
				@toggle-row-expand="clickRowHandle"
			>
				<template #left-tool>
					<el-button
						class="ml10"
						@click="openChangePurchaserDialog"
						v-auth="'order_changePerchase'"
					>
						{{ $t('采购员变更') }}
					</el-button>
					<el-button
						class="ml10"
						@click="openReturnApplicationDialog"
						v-auth="'order_returnApply'"
					>
						{{ $t('退货申请') }}
					</el-button>
					<el-button
						class="ml10"
						color="#d9001b"
						@click="openDeleteDialog"
						v-auth="'order_delete'"
					>
						{{ $t('删除采购单') }}
					</el-button>
					<el-button
						class="ml10"
						@click="openBatchConfiemDialog('批量采购确认')"
						v-auth="'order_openBatchConfiem'"
					>
						{{ $t('批量采购确认') }}
					</el-button>
					<el-button
						class="ml10"
						@click="openBatchConfiemDialog('批量编辑')"
						v-auth="'order_openBatchEdit'"
					>
						{{ $t('批量编辑') }}
					</el-button>
				</template>

				<!-- 展开行：内嵌表格 -->
				<template #expand="{ row }">
					<el-table :data="row.skuList" class="expand-table" native-scrollbar>
						<el-table-column align="center" width="60" />
						<el-table-column
							prop="purchaseNo"
							label="采购单号"
							width="150"
							show-overflow-tooltip
						/>
						<el-table-column
							prop="demandNo"
							label="需求单号"
							width="150"
							show-overflow-tooltip
						/>
						<el-table-column label="图片" width="100">
							<template #default="{ row: skuRow }">
								<div class="flex">
									<img
										v-if="skuRow.imgUrl"
										:src="skuRow.imgUrl"
										alt=""
										class="object-cover w-10 h-10 rounded-md cursor-pointer"
										@click="() => handlePreview(skuRow)"
									/>
									<span v-else class="text-gray-400">无图片</span>
								</div>
							</template>
						</el-table-column>
						<el-table-column
							label="产品名称/SKU"
							width="220"
							show-overflow-tooltip
						>
							<template #default="{ row: skuRow }">
								<div class="flex flex-col">
									<span>{{ skuRow.skuName }}</span>
									<span class="text-gray-500">{{ skuRow.skuCode }}</span>
								</div>
							</template>
						</el-table-column>
						<el-table-column prop="planNum" label="计划数量" width="150" />
						<el-table-column
							prop="builtDeliveryGoodsNum"
							label="已建发货计划数量"
							width="150"
						/>
						<el-table-column
							prop="pendingPurchaseQuantity"
							label="待采购数量"
							width="150"
						/>
						<el-table-column
							prop="purchaseNum"
							label="PMC确认采购数量"
							width="150"
						/>
						<el-table-column
							prop="confirmedRemainingPurchaseNum"
							label="PMC确认剩余采购数量"
							width="200"
						/>
						<el-table-column
							prop="returnNumConfirmed"
							label="退货数量(完成)"
							width="150"
						/>
						<el-table-column
							prop="returnNumPending"
							label="退货中数量"
							width="150"
						/>
						<el-table-column
							prop="returnNum"
							label="退货总数"
							width="200"
							show-overflow-tooltip
						/>
						<el-table-column
							prop="builtTakeGoodsNum"
							label="已建提货计划数量"
							width="150"
						/>
						<el-table-column
							prop="builtDeliveryGoodsNumPending"
							label="已建发货计划数量(待拼柜)"
							width="200"
						/>
						<el-table-column
							prop="builtDeliveryGoodsNumConfirmed"
							label="已建发货计划数量(已拼待提)"
							width="230"
						/>
						<el-table-column
							prop="builtDeliveryGoodsNumDelivered"
							label="已建发货计划数量(已拼已提)"
							width="230"
						/>
						<el-table-column
							prop="factoryStandardDeliveryDate"
							label="工厂标准交期"
							width="150"
						/>
						<el-table-column
							prop="expectedPickupDate"
							label="期望提货时间"
							width="150"
						/>
						<el-table-column
							prop="mcpCreateName"
							label="物控人员"
							width="150"
						/>
						<el-table-column
							prop="orderTypeText"
							label="订单类型"
							width="150"
						/>
						<el-table-column
							prop="materialRemark"
							label="物控备注"
							width="150"
						/>
						<el-table-column
							prop="unitPriceWithoutTax"
							label="不含税单价"
							width="150"
						>
							<template #default="{ row: skuRow }">
								{{ getCurrencySymbol(row.currency) }}
								{{ skuRow.unitPriceWithoutTax }}
							</template>
						</el-table-column>
						<el-table-column
							prop="priceWithoutTax"
							label="不含税货值"
							width="150"
						>
							<template #default="{ row: skuRow }">
								{{ getCurrencySymbol(row.currency) }}
								{{ skuRow.priceWithoutTax }}
							</template>
						</el-table-column>
						<el-table-column
							prop="unitPriceIncludingTax"
							label="含税单价"
							width="120"
						>
							<template #default="{ row: skuRow }">
								{{ getCurrencySymbol(row.currency) }}
								{{ skuRow.unitPriceIncludingTax }}
							</template>
						</el-table-column>
						<el-table-column
							prop="priceIncludingTax"
							label="含税货值"
							width="150"
						>
							<template #default="{ row: skuRow }">
								{{ getCurrencySymbol(row.currency) }}
								{{ skuRow.priceIncludingTax }}
							</template>
						</el-table-column>
					</el-table>
				</template>

				<!-- 采购单号列 -->
				<template #purchaseNo="{ row }">
					<div>{{ row.purchaseNo || '-' }}</div>
				</template>

				<!-- 采购量（可点击链接） -->
				<template #purchaseNum="{ row }">
					<span class="link" @click="openDialog(row, 'purchaseRecord')">{{
						row.purchaseNum
					}}</span>
				</template>

				<!-- 订单总金额 -->
				<template #amountText="{ row }">
					{{ getCurrencySymbol(row.currency) }}
					{{ formatValue(row.amountText) }}
				</template>

				<!-- 操作列 -->
				<template #action="{ row }">
					<div class="flex items-center">
						<el-button
							text
							type="primary"
							class="mr5"
							@click="openDialog(row, 'edit')"
							v-if="row.status === 3"
							v-auth="'order_edit'"
						>
							{{ $t('编辑') }}
						</el-button>
						<el-button
							text
							type="primary"
							class="mr5"
							@click="openDialog(row, 'view')"
							v-if="row.status !== 3"
							v-auth="'order_detail'"
						>
							{{ $t('详情') }}
						</el-button>
						<el-button
							text
							type="primary"
							class="mr5"
							@click="openDialog(row, 'confirmPurchase')"
							v-auth="'order_confirmPurchase'"
							v-if="row.status === 3 || row.status === 4"
						>
							{{ $t('采购确认') }}
						</el-button>
						<el-button
							text
							type="primary"
							class="mr5"
							@click="openLogDialog(row.id)"
							v-auth="'order_log'"
						>
							{{ $t('日志') }}
						</el-button>
					</div>
				</template>
			</BaseTable>
		</div>

		<!-- 确认下单弹窗 -->
		<confirm-dialog
			title="确认下单"
			ref="confirmRef"
			:show-icon="true"
			icon-type="info"
			@cancel="confirmRef.hide()"
			@confirm="handleConfirmOrder"
		>
			<span>确认已下单勾选的采购订单吗?</span>
		</confirm-dialog>

		<!-- 删除弹窗 -->
		<input-dialog
			ref="deleteDialog"
			title="删除"
			message="确认删除勾选的采购订单吗?"
			:show-icon="true"
			icon-type="warn"
			confirm-button-text="确认"
			confirm-button-type="danger"
			input-prop="remark"
			input-placeholder="备注,必填"
			v-model="deleteRemark"
			@cancel="deleteDialog.hide()"
			@confirm="handleDelete"
		/>

		<!-- 维护工厂回复交期弹窗 -->
		<date-dialog
			ref="factoryDateDialog"
			title="维护工厂回复交期"
			:show-icon="true"
			icon-type="info"
			date-prop="factoryDate"
			date-placeholder="请选择日期"
			@cancel="factoryDateDialog.hide()"
			@confirm="handleFactoryDate"
		/>

		<!-- 采购员变更弹窗 -->
		<select-dialog
			ref="changePurchaserDialog"
			title="变更采购员"
			:show-icon="true"
			icon-type="info"
			select-prop="purchaserId"
			select-placeholder="选择采购员"
			:options="dictMap.purchaseUserId"
			:option-props="{ label: 'name', value: 'userId' }"
			@confirm="handleChangePurchaser"
			@cancel="changePurchaserDialog.hide()"
		/>

		<!-- 退货申请弹窗 -->
		<ReturnApplicationDialog
			ref="returnApplicationDialogRef"
			:selected-order="selectedReturnOrder"
			@submit="handleReturnApplication"
			@close="handleReturnApplicationClose"
		/>

		<!-- 预览组件 -->
		<Preview v-model="showPreview" :url="previewUrl" type="image" />

		<!-- 日志 -->
		<LogDialog
			v-model="logDialogVisible"
			:id="currentRow.id"
			:biz-type="['PURCHASE_ORDER']"
			:showSearchForm="false"
			:showToolBar="false"
			@closeDialog="closeLogDialog"
		/>

		<ShowResultDialog ref="showResultDialog" />

		<OrderEdit
			v-model="orderEditVisible"
			:currentRow="currentRow"
			:visibleType="editVisibleType"
			:title="editDialogTitle"
			@closeDialog="
				() => {
					orderEditVisible = false;
					freshTable();
					register.safeCallTableMethod('clearCheckboxRow');
				}
			"
			:dictMap="dictMap"
		/>

		<!-- 采购确认 -->
		<ConfirmPurchase
			ref="confirmPurchaseRef"
			:currentRow="currentRow"
			:cancel-button-text="$t('取消')"
			:confirm-button-text="$t('确认')"
			:confirm-button-type="'primary'"
			@confirm="(e) => confirmPurchaseConfirm(e)"
			@cancel="() => confirmPurchaseRef.hide()"
			:disabled="confirmPurchaseDisabled"
		/>

		<!-- 采购记录 -->
		<PurchaseRecord
			ref="purchaseRecordRef"
			:currentRow="currentRow"
			@cancel="() => confirmPurchaseRef.hide()"
			@closed="() => getDataList()"
		/>

		<!-- 分配采购数量 -->
		<PurchaseQuantityDialog
			ref="purchaseQuantityRef"
			:currentRow="currentRow"
			:cancel-button-text="$t('取消')"
			:confirm-button-text="$t('确认')"
			:confirm-button-type="'primary'"
			:disabled="purchaseQuantityDisabled"
			@confirm="(e) => confirmPurchaseQuantity(e)"
			@cancel="() => purchaseQuantityRef.hide()"
		/>

		<!-- 批量采购确认 -->
		<ImportDialog
			ref="batchConfiemDialogRef"
			:title="importDialogTitle"
			:showExpandTip="`PS:下载模板时,会根据筛选条件带出状态为【待采购确认,${
				importDialogTitle === '批量采购确认' ? '部分处理' : '待处理'
			}】的采购单数据，没有符合条件的采购单则为空`"
			:excelUploadApi="
				importDialogTitle === '批量采购确认'
					? '/purchase/order/importBatchConfirm'
					: '/purchase/order/importBatchUpdate'
			"
			@refreshDataList="freshTable"
			@downloadTemplate="downloadNeedTemplate"
		/>
	</div>
</template>

<script setup lang="ts">
import {
	BasicTableProps,
	useTable,
} from '/@/components/BaseTable/hooks/BaseTable';
import { columns } from './config/index';
import { useI18n } from 'vue-i18n';
import { defineAsyncComponent, ref, reactive, onMounted } from 'vue';
import { useMessage } from '/@/hooks/message';
import { getUserListByCondition } from '/@/api/admin/user';
import { useMultipleDicts } from '/@/hooks/multipleDicts';
import { returnInfoSkuById } from '/@/api/purchase/return/index';
import { useRoute } from 'vue-router';
import {
	getOrderPage,
	getskuInfo,
	confirmOrder,
	updateDeliveryDate,
	exporOrder,
	updatePurchaseUser,
	deleteOrder,
	orderInfo,
	getProConfirmById,
	postConfirmInto,
	getAllocateData,
	allocatePurchaseQuantity,
	exportNeedConfirmOrder,
	exportNeedUpdateOrder,
} from '/@/api/purchase/order/index';
import { getCurrencySymbol } from '/@/utils/rateUtils';
import { auth } from '/@/utils/authFunction';

const Preview = defineAsyncComponent(
	() => import('/@/components/Material/preview.vue')
);
const LogDialog = defineAsyncComponent(
	() => import('/@/components/log/log-dialog.vue')
);
const ConfirmDialog = defineAsyncComponent(
	() => import('/@/components/ConfirmDialog/index.vue')
);
const InputDialog = defineAsyncComponent(
	() => import('/@/components/ConfirmDialog/InputDialog.vue')
);
const SelectDialog = defineAsyncComponent(
	() => import('/@/components/ConfirmDialog/SelectDialog.vue')
);
const DateDialog = defineAsyncComponent(
	() => import('/@/components/ConfirmDialog/DateDialog.vue')
);
const SelectInput = defineAsyncComponent(
	() => import('/@/components/TableFormModule/select-input.vue')
);
const ShowResultDialog = defineAsyncComponent(
	() => import('/@/components/fileUpload/showResult.vue')
);
const ReturnApplicationDialog = defineAsyncComponent(
	() => import('./components/ReturnApplicationDialog.vue')
);
const OrderEdit = defineAsyncComponent(
	() => import('./components/order-edit.vue')
);
const SelectDate = defineAsyncComponent(
	() => import('/@/components/TableFormModule/select-date.vue')
);
const ConfirmPurchase = defineAsyncComponent(
	() => import('./components/confirmPurchase.vue')
);
const PurchaseRecord = defineAsyncComponent(
	() => import('./components/purchaseRecord.vue')
);
const PurchaseQuantityDialog = defineAsyncComponent(
	() => import('./components/purchaseQuantityDialog.vue')
);
const ImportDialog = defineAsyncComponent(
	() => import('/@/components/fileUpload/importDialog.vue')
);
const TreeSelectInputApi = defineAsyncComponent(
	() => import('/@/componentsApi/TreeSelectInputApi/index.vue')
);

const { t } = useI18n();
const route = useRoute();

const baseTableRef = ref();
const queryRef = ref();
const showSearch = ref(true);
const currentRow = ref<any>({ id: '' });
// 预览相关
const showPreview = ref(false);
const previewUrl = ref('');

// 添加退货申请弹窗相关变量
const orderEditVisible = ref(false);
// 添加退货申请弹窗相关变量
const showResultDialog = ref();
// 日志
const logDialogVisible = ref(false);
// 添加选中行数据变量;
const selectedRows = ref<any[]>([]);
// 添加删除弹窗相关变量
const deleteRemark = ref('');

// 添加退货申请弹窗相关变量
const returnApplicationDialogRef = ref();
const selectedReturnOrder = ref<any>(null);

// 确认采购弹窗
const confirmPurchaseRef = ref();
const confirmRef = ref();
// 工厂回复交期
const factoryDateDialog = ref();
// 变更采购人
const changePurchaserDialog = ref();
// 批量采购确认
const batchConfiemDialogRef = ref();
// 导入
const importDialogTitle = ref('');
const editVisibleType = ref(''); //编辑弹窗类型
const editDialogTitle = ref('编辑采购单'); //编辑弹窗类型
const purchaseRecordRef = ref(); //编辑弹窗类型
const purchaseQuantityRef = ref(); //分配采购数量弹窗引用
const confirmPurchaseDisabled = ref(false); //  采购确认按钮禁用状态
const purchaseQuantityDisabled = ref(false); // 分配采购数量按钮禁用状态

// 仅保留弹窗中还需要用到的字典（采购员变更弹窗的 options）
const { dictMap } = useMultipleDicts(
	[
		{
			key: 'purchaseUserId',
			fetchFn: getUserListByCondition,
			params: {
				postCodeList: [
					'PURCHASING_DIRECTOR',
					'PURCHASING_MANAGER',
					'PROCUREMENT_MANAGER',
					'PURCHASING_OFFICER',
				],
			},
		},
	],
	{ tableRef: baseTableRef }
);

const handlePreview = (row: any) => {
	if (row.imgUrl) {
		previewUrl.value = row.imgUrl;
		showPreview.value = true;
	}
};

const isNumeric = (value: any) => {
	return typeof value === 'number'
		? !isNaN(value)
		: typeof value === 'string' && value.trim() !== '' && !isNaN(Number(value));
};

/**
 * 格式化值为两位小数
 * @description 如果是数字或字符串数字，则格式化为两位小数，否则原样返回
 * @param value
 */
const formatValue = (value: string | number) => {
	if (isNumeric(value)) return Number(value).toFixed(2);
	return value;
};

// skuList 缓存，key: purchaseNo，切换页签后数据不丢失
const skuListCache = new Map<string, any[]>();

// 展开行数据加载
const clickRowHandle = async (params: any) => {
	const { row, expanded } = params;
	// 收起时不需要处理
	if (!expanded) return;
	// 已有数据（来自缓存回填或本次已加载）则跳过
	if (row.skuList?.length) return;
	// 从缓存取
	if (skuListCache.has(row.purchaseNo)) {
		row.skuList = skuListCache.get(row.purchaseNo);
		return;
	}
	// 请求接口
	const data = await getskuInfo({ purchaseNo: row.purchaseNo });
	const skuList = (data.data || []).map((sku: any) => ({
		...sku,
		unitPriceWithoutTax: formatValue(sku.unitPriceWithoutTax),
		priceWithoutTax: formatValue(sku.priceWithoutTax),
		unitPriceIncludingTax: formatValue(sku.unitPriceIncludingTax),
		priceIncludingTax: formatValue(sku.priceIncludingTax),
	}));
	// 写入缓存
	skuListCache.set(row.purchaseNo, skuList);
	row.skuList = skuList;
};

const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {},
	pageList: getOrderPage as (params?: any) => Promise<any>,
	columns,
	toolBarConfig: {
		handleRefresh: () => freshTable(),
		handleExport: () => handleExport(),
		isShowExport: auth('order_export'),
		settingKey: 'purchase_order',
	},
	// 数据加载后把缓存的 skuList 回填，切换页签/翻页后已展开的数据不丢失
	handleTableData: (list: any[]) => {
		list.forEach((item: any) => {
			if (skuListCache.has(item.purchaseNo)) {
				item.skuList = skuListCache.get(item.purchaseNo);
			}
		});
		return list;
	},
	ascs: [],
	descs: ['create_time'],
});

const { register, getDataList, toggleRowCollapse } = useTable(
	state,
	baseTableRef
);

// 更新数据并收起所有展开行
const freshTable = async () => {
	// 主动刷新时清空 skuList 缓存，确保数据最新
	skuListCache.clear();
	getDataList();
	toggleRowCollapse();
};

const resetQuery = () => {
	state.queryForm = {};
	freshTable();
};

// 同步选中行
const syncSelectedRows = () => {
	selectedRows.value = register.tableRef.value?.getCheckboxRecords() || [];
};

const handleExport = async () => {
	try {
		syncSelectedRows();
		state.loading = true;
		await exporOrder({
			ids: selectedRows.value.map((item: any) => item.id),
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

// 打开日志弹窗
const openLogDialog = (id: string) => {
	currentRow.value.id = id;
	logDialogVisible.value = true;
};
// 关闭日志弹窗
const closeLogDialog = () => {
	logDialogVisible.value = false;
};

const openDeleteDialog = () => {
	syncSelectedRows();
	deleteRemark.value = '';
	if (selectedRows.value.length === 0) {
		useMessage().warning('请选择要删除的采购订单');
		return;
	}
	if (!selectedRows.value.every((row: any) => row.status === 3)) {
		useMessage().warning('只能勾选状态为待采购确认的采购订单');
		return;
	}
	deleteDialog.value.show();
};

const deleteDialog = ref();

const handleDelete = async (formData: any) => {
	try {
		if (!deleteRemark.value) {
			useMessage().warning('请输入删除备注');
			return;
		}
		const res = await deleteOrder({
			ids: selectedRows.value.map((item: any) => item.id),
			remark: formData.remark,
		});
		if (res.code === 0) {
			deleteDialog.value.hide();
			if (res?.data?.failCount > 0) {
				showResultDialog.value.setData({ data: res.data, title: '删除失败' });
				showResultDialog.value.show();
			} else {
				useMessage().success('删除成功');
			}
		}
		register.safeCallTableMethod('clearCheckboxRow');
		freshTable();
	} catch (error: any) {
		useMessage().error(error?.msg || '删除失败');
	}
};

const handleConfirmOrder = async () => {
	try {
		syncSelectedRows();
		const res = await confirmOrder({
			ids: selectedRows.value.map((item: any) => item.id),
		});
		if (res.code === 0) {
			confirmRef.value.hide();
			if (res?.data?.failCount > 0) {
				showResultDialog.value.setData({
					data: res.data,
					title: '确认下单失败',
				});
				showResultDialog.value.show();
			} else {
				useMessage().success('确认下单成功');
			}
		}
		register.safeCallTableMethod('clearCheckboxRow');
		freshTable();
	} catch (error: any) {
		useMessage().error(error?.msg || '确认下单失败');
	}
};

const handleFactoryDate = async (formData: any) => {
	try {
		syncSelectedRows();
		if (!formData.factoryDate) {
			useMessage().warning('请选择工厂回复交期');
			return;
		}
		const res = await updateDeliveryDate({
			ids: selectedRows.value.map((item: any) => item.id),
			date: formData.factoryDate,
		});
		if (res.code === 0) {
			factoryDateDialog.value.hide();
			if (res?.data?.failCount > 0) {
				showResultDialog.value.setData({
					data: res.data,
					title: '维护工厂回复交期失败',
				});
				showResultDialog.value.show();
			} else {
				useMessage().success('维护工厂回复交期成功');
			}
		}
		register.safeCallTableMethod('clearCheckboxRow');
		freshTable();
	} catch (error: any) {
		useMessage().error(error?.msg || '维护工厂回复交期失败');
	}
};

const openChangePurchaserDialog = () => {
	syncSelectedRows();
	if (selectedRows.value.length === 0) {
		useMessage().warning('请选择要变更采购员的采购订单');
		return;
	}
	changePurchaserDialog.value.show();
};

const handleChangePurchaser = async (formData: any) => {
	try {
		if (!formData.purchaserId) {
			useMessage().error('请选择采购员');
			return;
		}
		const res = await updatePurchaseUser({
			ids: selectedRows.value.map((item: any) => item.id),
			userId: formData.purchaserId,
		});
		if (res.code === 0) {
			changePurchaserDialog.value.hide();
			if (res?.data?.failCount > 0) {
				showResultDialog.value.setData({
					data: res.data,
					title: '变更采购员失败',
				});
				showResultDialog.value.show();
			} else {
				useMessage().success('采购员变更成功');
			}
		}
		register.safeCallTableMethod('clearCheckboxRow');
		freshTable();
	} catch (error: any) {
		useMessage().error(error?.msg || '采购员变更失败');
	}
};

const openBatchConfiemDialog = (type: string) => {
	importDialogTitle.value = type;
	batchConfiemDialogRef.value.show();
};

const downloadNeedTemplate = async () => {
	try {
		syncSelectedRows();
		const api =
			importDialogTitle.value === '批量采购确认'
				? exportNeedConfirmOrder
				: exportNeedUpdateOrder;
		state.loading = true;
		await api({
			ids: selectedRows.value.map((item: any) => item.id),
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

const openReturnApplicationDialog = async () => {
	syncSelectedRows();
	if (selectedRows.value.length === 0) {
		useMessage().warning('请选择要申请退货的采购订单');
		return;
	}
	if (selectedRows.value.length > 1) {
		useMessage().warning('一次只能操作一个采购单');
		return;
	}
	if (!selectedRows.value.every((row: any) => row.status === 2)) {
		useMessage().warning('只能勾选状态为【已处理】的采购订单');
		return;
	}
	const selectedOrder = selectedRows.value[0];
	try {
		const response = await returnInfoSkuById({ id: selectedOrder.id });
		selectedReturnOrder.value = response.data;
		returnApplicationDialogRef.value?.show();
	} catch (err: any) {
		useMessage().error(err.msg || '获取基础信息失败');
	}
};

const handleReturnApplication = async () => {
	handleReturnApplicationClose();
	freshTable();
};

const handleReturnApplicationClose = () => {
	selectedReturnOrder.value = null;
	register.safeCallTableMethod('clearCheckboxRow');
	returnApplicationDialogRef.value?.hide();
};

const openDialog = async (row: any, type: string) => {
	if (type === 'view') {
		editVisibleType.value = 'view';
		editDialogTitle.value = '查看采购单';
		const res = await orderInfo({ id: row.id });
		currentRow.value = { ...row, ...res.data };
		orderEditVisible.value = true;
	} else if (type === 'edit') {
		editVisibleType.value = 'edit';
		editDialogTitle.value = '编辑采购单';
		const res = await orderInfo({ id: row.id });
		currentRow.value = { ...row, ...res.data };
		orderEditVisible.value = true;
	} else if (type === 'confirmPurchase') {
		const res = await getProConfirmById({ id: row.id });
		if (res.code === 0) {
			currentRow.value = { dataList: res.data };
			confirmPurchaseRef.value?.show();
		}
	} else if (type === 'purchaseRecord') {
		currentRow.value = row;
		purchaseRecordRef.value?.show(currentRow.value);
	} else if (type === 'purchaseQuantity') {
		if (!row.click) return;
		const res = await getAllocateData({ purchaseNo: row.purchaseNo });
		if (res.code === 0) {
			currentRow.value = { purchaseOrderSkuList: res.data };
			purchaseQuantityRef.value?.show();
		}
	}
};

const confirmPurchaseConfirm = async (e: { data: Array<any> }) => {
	confirmPurchaseDisabled.value = true;
	try {
		if (e.data && e.data.length > 0) {
			const res = await postConfirmInto(e.data);
			if (res.code === 0) {
				useMessage().success(t('操作成功'));
				confirmPurchaseRef.value?.hide();
				freshTable();
			}
		}
	} catch (error) {
		useMessage().error(t('操作失败'));
	} finally {
		confirmPurchaseDisabled.value = false;
	}
};

const confirmPurchaseQuantity = async (e: Array<any>) => {
	purchaseQuantityDisabled.value = true;
	if (e && e.length > 0) {
		const res = await allocatePurchaseQuantity(e);
		if (res.code === 0) {
			useMessage().success(t('操作成功'));
			purchaseQuantityRef.value?.hide();
			freshTable();
		}
	} else {
		purchaseQuantityDisabled.value = false;
		useMessage().error('提交数据不能为空');
	}
};

onMounted(() => {
	const purchaseNos = route.query.purchaseNos as string;
	if (purchaseNos) {
		state.queryForm.purchaseNos = purchaseNos.includes(',')
			? purchaseNos
					.split(',')
					.map((item) => item.trim())
					.filter(Boolean)
			: [purchaseNos];
		freshTable();
	}
});
</script>

<style lang="scss" scoped>
.link {
	color: #409eff;
	cursor: pointer;
	text-decoration: underline;
}
.expand-table {
	::v-deep(.el-table__header-wrapper) {
		th {
			background-color: white !important;
		}
	}
}
</style>
