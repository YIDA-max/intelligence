<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-row class="ml10" v-show="showSearch">
				<el-form
					:inline="true"
					:model="state.queryForm"
					@keyup.enter="getDataListDebounced"
					ref="queryRef"
				>
					<AdvancedSearchStyle ref="AdvancedSearchStyleRef">
						<template #default>
							<el-form-item>
								<div class="flex item-center">
									<SelectInput
										v-model:queryForm="state.queryForm"
										:searchTypes="[
											{ label: '提货单号', value: 'pickupOrderNos' },
											{ label: '需求单号', value: 'demandOrderNos' },
											{ label: '采购订单', value: 'purchaseOrderNos' },
										]"
										:getDataList="getDataListDebounced"
									/>
								</div>
							</el-form-item>
							<el-form-item>
								<div class="flex item-center">
									<SelectInput
										v-model:queryForm="state.queryForm"
										:searchTypes="[
											{ label: 'SKU', value: 'skuCodes' },
											{ label: 'MSKU', value: 'mskuCodes' },
										]"
										:getDataList="getDataListDebounced"
									/>
								</div>
							</el-form-item>
							<el-form-item>
								<TreeSelectInputApi
									componentType="dicts"
									code="statuses"
									v-model:queryForm="state.queryForm"
									:searchFn="register?.getDataList"
									:settings="{
										text: '状态',
										width: '220px',
										getTreeDataParams: 'collection_plan_status',
									}"
								/>
							</el-form-item>
							<el-form-item>
								<TreeSelectInputApi
									componentType="country"
									code="countryCodes"
									v-model:queryForm="state.queryForm"
									:searchFn="register?.getDataList"
									:settings="{ text: '国家', width: '220px' }"
								/>
							</el-form-item>
							<el-form-item>
								<TreeSelectInputApi
									componentType="dicts"
									code="platformChannelCodes"
									v-model:queryForm="state.queryForm"
									:searchFn="register?.getDataList"
									:settings="{
										text: '平台渠道',
										width: '220px',
										getTreeDataParams: 'platform_channel',
									}"
								/>
							</el-form-item>
							<el-form-item>
								<TreeSelectInputApi
									componentType="dicts"
									code="shippingMethods"
									v-model:queryForm="state.queryForm"
									:searchFn="register?.getDataList"
									:settings="{
										text: '发货方式',
										width: '220px',
										getTreeDataParams: 'shipping_method',
									}"
								/>
							</el-form-item>
							<el-form-item>
								<TreeSelectInputApi
									componentType="dicts"
									code="orderTypes"
									v-model:queryForm="state.queryForm"
									:searchFn="register?.getDataList"
									:settings="{
										text: '订单类型',
										width: '220px',
										getTreeDataParams: 'purchase_demand_order_type',
									}"
								/>
							</el-form-item>
							<el-form-item>
								<el-tree-select
									@change="getDataListDebounced"
									v-model="state.queryForm.deptIds"
									placeholder="部门和小组"
									show-checkbox
									fit-input-width
									clearable
									multiple
									collapse-tags
									:max-collapse-tags="1"
									style="width: 200px"
									filterable
									:props="{ children: 'children', label: 'name', value: 'id' }"
									:node-key="'id'"
									:data="dictMap.deptTree"
								/>
							</el-form-item>
							<el-form-item>
								<div class="flex items-center">
									<el-select
										class="user-search-select"
										v-model="userSearchType"
										:value-key="userSearchType"
										@change="handleUserSearchTypeChange"
									>
										<el-option label="采购员" value="purchaseUserIds" />
										<el-option label="运营人员" value="operationIds" />
										<el-option label="创建人" value="createIds" />
									</el-select>
									<div class="user-search-select-right">
										<TreeSelectInputApi
											componentType="userList"
											:key="userSearchType"
											:code="userSearchType"
											v-model:queryForm="state.queryForm"
											:searchFn="register?.getDataList"
											:settings="{
												...userSearchSettings[userSearchType],
											}"
										/>
									</div>
								</div>
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
											value: 'createdTime',
											isAddHMS: true,
											dateStart: 'createTimeStart',
											dateEnd: 'createTimeEnd',
											defaultMonthsAgo: 12,
										},
										{
											label: '运营确认时间',
											value: 'operationConfirmTime',
											isAddHMS: true,
											dateStart: 'operationConfirmTimeStart',
											dateEnd: 'operationConfirmTimeEnd',
										},
									]"
									:getDataList="getDataListDebounced"
								/>
							</el-form-item>
							<el-form-item>
								<div class="flex item-center">
									<el-button @click="getDataListDebounced" type="primary">{{
										$t('搜索')
									}}</el-button>
									<el-button @click="resetQuery" type="info" plain>{{
										$t('common.resetBtn')
									}}</el-button>
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
				:cell-config="{ height: 36 }"
				:stripe="true"
				:header-cell-config="{ height: 38 }"
			>
				<template #left-tool>
					<el-button
						class="ml10"
						type="primary"
						v-auth="'mcp_add'"
						@click="openDialog('add')"
					>
						{{ $t('新增提货') }}
					</el-button>
					<el-dropdown
						class="ml10"
						split-button
						v-if="
							auths([
								'mcp_adds',
								'mcp_preservePackageInfoRefs',
								'mcp_pushDeliverGoodRefs',
								'mcp_affirmDeliveryTimeRefs',
								'mcp_preserveMSKURefs',
							])
						"
					>
						<span>{{ $t('批量操作') }}</span>
						<template #dropdown>
							<el-dropdown-menu>
								<el-dropdown-item
									@click="
										() => {
											importDialogRef.show();
										}
									"
									v-if="auth('mcp_adds')"
								>
									{{ $t('批量新增') }}
								</el-dropdown-item>
								<el-dropdown-item
									@click="
										() => {
											preservePackageInfoRef.show();
										}
									"
									v-if="auth('mcp_preservePackageInfoRefs')"
								>
									{{ $t('批量维护货件信息') }}
								</el-dropdown-item>
								<el-dropdown-item
									@click="
										() => {
											pushDeliverGoodsRef.show();
										}
									"
									v-if="auth('mcp_pushDeliverGoodRefs')"
								>
									{{ $t('批量推送发货') }}
								</el-dropdown-item>
								<el-dropdown-item
									@click="
										() => {
											affirmDeliveryTimeRef.show();
										}
									"
									v-if="auth('mcp_affirmDeliveryTimeRefs')"
								>
									{{ $t('批量采购确认交期') }}
								</el-dropdown-item>
								<el-dropdown-item
									@click="
										() => {
											preserveMSKURef.show();
										}
									"
									v-if="auth('mcp_preserveMSKURefs')"
								>
									{{ $t('批量MSKU维护') }}
								</el-dropdown-item>
							</el-dropdown-menu>
						</template>
					</el-dropdown>
					<el-button
						class="ml10"
						@click="openReview('affirmDeliverGoods')"
						v-auth="'mcp_affirmDeliverGoods'"
					>
						{{ $t('运营确认发货') }}
					</el-button>
					<el-button
						class="ml10"
						@click="openReview('editCollectionPlan')"
						v-auth="'mcp_editCollectionPlan'"
					>
						{{ $t('修改计划') }}
					</el-button>
					<el-button
						class="ml10"
						@click="openReview('pushDeliverGoodsForPlatform')"
						v-auth="'mcp_pushDeliverGoodsForPlatform'"
					>
						{{ $t('批量推送发货（有货件）') }}
					</el-button>
					<el-button
						class="ml10"
						@click="openReview('cancelApplication')"
						v-auth="'mcp_cancelApplication'"
					>
						{{ $t('取消申请') }}
					</el-button>
					<el-button
						color="#d9001b"
						class="ml10"
						@click="openDialog('del')"
						v-auth="'mcp_dels'"
					>
						{{ $t('批量删除') }}
					</el-button>
					<el-button
						class="ml10"
						@click="openDialog('uploadLabel')"
						v-auth="'upload_shipment_labels'"
					>
						{{ $t('上传货件标签') }}
					</el-button>
				</template>

				<!-- 操作列 -->
				<template #action="{ row }">
					<div class="flex items-center">
						<el-dropdown placement="bottom-end">
							<span class="el-dropdown-link">
								{{ $t('操作') }}
								<el-icon class="el-icon--right"><arrow-down /></el-icon>
							</span>
							<template #dropdown>
								<el-dropdown-menu>
									<!-- cancelStatus 为 1(取消中) 或 2(已取消) 时，除日志外操作项禁用 -->
									<!-- 编辑提货计划：订单状态为待运营确认发货 status=1 -->
									<el-dropdown-item
										@click="openDialog('collectionPlanEdit', row)"
										v-if="
											row.status === OrderStatus.WAIT_OPERATION_CONFIRM &&
											auth('mcp_collectionPlanEdit')
										"
										:disabled="row.cancelStatus === 1 || row.cancelStatus === 2"
									>
										{{ $t('编辑提货计划') }}
									</el-dropdown-item>
									<!-- 采购确认交期：订单状态为待采购确认交期 status=2 -->
									<el-dropdown-item
										@click="openDialog('affirmDeliveryTime', row)"
										v-if="
											row.status === OrderStatus.WAIT_PURCHASE_CONFIRM &&
											auth('mcp_affirmDeliveryTime')
										"
										:disabled="row.cancelStatus === 1 || row.cancelStatus === 2"
									>
										{{ $t('采购确认交期') }}
									</el-dropdown-item>
									<!-- 采购更新交期：订单状态为待推送发货(5)或已完成推送(6)，且 showLeadTimeButton 为 false -->
									<!-- 修复点：去掉了多余的 row.status === OrderStatus.WAIT_PUSH_SHIP -->
									<el-dropdown-item
										@click="openDialog('updateDeliveryTime', row)"
										v-if="
											(row.status === OrderStatus.WAIT_PUSH_SHIP ||
												row.status === OrderStatus.FINISH) &&
											!row.showLeadTimeButton &&
											auth('mcp_updateDeliveryTime')
										"
										:disabled="row.cancelStatus === 1 || row.cancelStatus === 2"
									>
										{{ $t('采购更新交期') }}
									</el-dropdown-item>
									<!-- 维护货件信息：发货方式为入平台仓 enter_platform_warehouse，且状态为待推送发货(5)/待上传货件标签(4)/待运营维护货件(3) -->
									<!-- 修复点：保留了上一轮修复的 row.status === 判断，确保逻辑有效 -->
									<el-dropdown-item
										@click="openDialog('preservePackageInfo', row)"
										v-if="
											row.shippingMethod === 'enter_platform_warehouse' &&
											(row.status === OrderStatus.WAIT_PUSH_SHIP ||
												row.status === OrderStatus.WAIT_UPLOAD_LABEL ||
												row.status ===
													OrderStatus.WAIT_OPERATION_MAINTAINANCE) &&
											auth('mcp_preservePackageInfo')
										"
										:disabled="row.cancelStatus === 1 || row.cancelStatus === 2"
									>
										{{ $t('维护货件信息') }}
									</el-dropdown-item>
									<!-- 推送发货(一件代发)：发货方式为一件代发 dropshipping，且订单状态为待推送发货 status=5 -->
									<el-dropdown-item
										@click="openDialog('pushDeliverGoods', row)"
										v-if="
											row.shippingMethod === 'dropshipping' &&
											row.status === OrderStatus.WAIT_PUSH_SHIP &&
											auth('mcp_pushDeliverGoods')
										"
										:disabled="row.cancelStatus === 1 || row.cancelStatus === 2"
									>
										{{ $t('推送发货(一件代发)') }}
									</el-dropdown-item>
									<!-- 日志 -->
									<el-dropdown-item @click="openDialog('log', row)">
										{{ $t('日志') }}
									</el-dropdown-item>
								</el-dropdown-menu>
							</template>
						</el-dropdown>
					</div>
				</template>
			</BaseTable>
		</div>

		<!-- 编辑、新增 -->
		<FormDialog
			v-model="visible"
			:currentRow="currentRow"
			:visibleType="visibleType"
			:title="title"
			@closeDialog="closeDialog"
		/>
		<!-- 确认与更新采购商交期 -->
		<AffirmDeliveryTimeDialog
			v-model="affirmDeliveryTimeDialogVisible"
			:currentRow="currentRow"
			:visibleType="visibleType"
			:title="title"
			@closeDialog="
				() => {
					affirmDeliveryTimeDialogVisible = false;
					getDataListDebounced();
					tableRef.value?.clearCheckboxRow();
				}
			"
		/>
		<!-- 维护货件信息 -->
		<PreservePackageInfoDialog
			v-model="preservePackageInfoDialogVisible"
			:currentRow="currentRow"
			:visibleType="visibleType"
			:title="title"
			@closeDialog="
				() => {
					preservePackageInfoDialogVisible = false;
					getDataListDebounced();
					tableRef.value?.clearCheckboxRow();
				}
			"
		/>
		<!-- 推送发货一件代发 -->
		<PushDeliverGoodsDialog
			v-model="pushDeliverGoodsDialogVisible"
			:currentRow="currentRow"
			:visibleType="visibleType"
			:title="title"
			@closeDialog="
				() => {
					pushDeliverGoodsDialogVisible = false;
					getDataListDebounced();
					tableRef.value?.clearCheckboxRow();
				}
			"
		/>
		<!-- 日志 -->
		<LogDialog
			v-model="logDialogVisible"
			:id="currentRow.id"
			:biz-type="['CONTROL_COLLECTION_PLAN']"
			:showSearchForm="false"
			:showToolBar="false"
			@closeDialog="
				() => {
					logDialogVisible = false;
				}
			"
		/>
		<!-- 批量新增 -->
		<ImportDialog
			ref="importDialogRef"
			title="导入提货计划"
			templateUrl="/files/import-template/批量新增提货模版.xlsx"
			excelUploadApi="/mcp/collectionPlan/importCollectionPlan"
			:accept="'.xlsx,.xls'"
			@refreshDataList="getDataListDebounced"
			:uploadTips="[
				'建议每次导入都使用最新的导入模板，避免出现不必要的错误',
				'仅支持xls/xlsx格式',
				'行数不超过5000条，文件大小不超过5M',
				'一行生成一个提货计划',
				'运输方式为必填，仅支持填写系统配置的运输方式',
			]"
		/>
		<!-- 批量维护货件信息 -->
		<ImportDialog
			ref="preservePackageInfoRef"
			title="批量维护货件信息"
			:showExpandTip="`PS:下载模板时,会根据筛选条件带出提货计划数据`"
			excelUploadApi="/mcp/collectionPlan/preservePackageInfoBatch"
			:accept="'.xlsx,.xls'"
			@refreshDataList="getDataListDebounced"
			@downloadTemplate="downloadNeedTemplate('shipmentInformation')"
		/>
		<!-- 批量推送发货：一件代发 + 入平台仓且货件维护国家未配置（shipmentCountryConfigFlag !== true） -->
		<ImportDialog
			ref="pushDeliverGoodsRef"
			title="批量推送发货"
			:showExpandTip="`PS:下载模板时,会根据筛选条件带出提货计划数据`"
			excelUploadApi="/mcp/collectionPlan/pushDeliverGoodsBatch"
			:accept="'.xlsx,.xls'"
			@refreshDataList="getDataListDebounced"
			@downloadTemplate="downloadNeedTemplate('dispatchShipments')"
		/>
		<!-- 批量采购确认交期 -->
		<ImportDialog
			ref="affirmDeliveryTimeRef"
			title="批量采购确认交期"
			:showExpandTip="`PS:下载模板时,会根据筛选条件带出状态为【待采购确认交期】的提货计划数据，没有符合条件的提货计划则为空`"
			excelUploadApi="/mcp/collectionPlan/batchAffirmDeliveryTime"
			:accept="'.xlsx,.xls'"
			@refreshDataList="getDataListDebounced"
			@downloadTemplate="downloadNeedTemplate('needAffirm')"
		/>
		<!-- 批量MSKU维护 -->
		<ImportDialog
			ref="preserveMSKURef"
			title="批量MSKU维护"
			templateUrl="/files/import-template/批量维护MSKU.xlsx"
			excelUploadApi="/mcp/collectionPlan/batchUpdateMsku"
			:accept="'.xlsx,.xls'"
			@refreshDataList="getDataListDebounced"
		/>

		<!-- 运营确认发货 -->
		<ConfirmDialog
			title="运营确认发货"
			ref="affirmDeliverGoodsRef"
			message=""
			:show-icon="true"
			icon-type="info"
			input-prop="remark"
			confirm-button-text="确认发货"
			confirm-button-type="primary"
			cancelButtonText="取消,通知物控修改计划"
			inputType="textarea"
			width="1000px"
			@cancel="
				() => {
					handleCancel('affirmDeliverGoods');
				}
			"
			@confirm="
				() => {
					handleConfirm('affirmDeliverGoods');
				}
			"
		>
			<div style="margin-bottom: 12px">
				{{ t('确定勾选的提货计划可发货?') }}
			</div>
			<el-table :data="affirmDeliverGoodsRows" max-height="420">
				<el-table-column
					prop="pickupOrderNo"
					label="提货单号"
					min-width="150"
				/>
				<el-table-column prop="skuCode" label="SKU" min-width="120" />
				<el-table-column prop="countryCode" label="国家" min-width="100" />
				<el-table-column
					prop="platformChannelCodeText"
					label="平台渠道"
					min-width="120"
				/>
				<el-table-column prop="mskuCode" label="MSKU" min-width="120">
					<template #default="{ row }">
						{{ row.mskuCode || '-' }}
					</template>
				</el-table-column>
				<el-table-column
					prop="pickupQuantity"
					label="提货数量"
					min-width="100"
				/>
				<el-table-column label="运输方式" min-width="120">
					<template #default="{ row }">
						{{ getTransportMethodText(row) }}
					</template>
				</el-table-column>
				<el-table-column
					prop="plannedPickupDate"
					label="计划提货日期"
					min-width="120"
				/>
				<el-table-column prop="urgentDate" label="加急日期" min-width="120">
					<template #default="{ row }">
						{{ row.urgentDate || '-' }}
					</template>
				</el-table-column>
			</el-table>
		</ConfirmDialog>
		<!-- 取消申请对话框 -->
		<CancelApplication
			ref="cancelApplicationRef"
			@getDataList="getDataListDebounced"
		/>

		<uploadLabel
			ref="upFileRef"
			:currentRow="currentRow"
			:show-icon="true"
			:icon-type="'info'"
			:cancel-button-text="$t('取消')"
			:confirm-button-text="$t('确认')"
			:confirm-button-type="'primary'"
			:width="'1000px'"
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
import { defineAsyncComponent, ref, reactive } from 'vue';
import { useMessage, useMessageBox } from '/@/hooks/message';
import { ElMessageBox } from 'element-plus';
import {
	getCollectionPlanPage,
	getCollectionPlanDetail,
	postCollectionPlanDelete,
	postCollectionPlanAffirmDeliverGoods,
	getExportCollectionPlan,
	postPushDeliverGoodsForPlatform,
	getExportNeedAffirmDeliveryTime,
	getExportShipmentInformation,
	getExportDispatchShipments,
	getCollectionPlanListByIds,
	uploadFileAttachment,
} from '/@/api/mcp/collectionPlan/index';
import { useMultipleDicts } from '/@/hooks/multipleDicts';
import { deptTree } from '/@/api/admin/dept';
import { useResultDialog } from '/@/hooks/useResultDialog';
import { auth, auths } from '/@/utils/authFunction';
import { columns } from './config/index';
import { OrderStatus } from './config/enmus';
const uploadLabel = defineAsyncComponent(
	() => import('./components/uploadLabel.vue')
);
const FormDialog = defineAsyncComponent(
	() => import('./components/form-dialog.vue')
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
const LogDialog = defineAsyncComponent(
	() => import('/@/components/log/log-dialog.vue')
);
const ImportDialog = defineAsyncComponent(
	() => import('/@/components/fileUpload/importDialog.vue')
);
const ConfirmDialog = defineAsyncComponent(
	() => import('/@/components/ConfirmDialog/index.vue')
);
const TreeSelectInputApi = defineAsyncComponent(
	() => import('/@/componentsApi/TreeSelectInputApi/index.vue')
);
const AffirmDeliveryTimeDialog = defineAsyncComponent(
	() => import('./components/affirmDeliveryTime-dialog.vue')
);
const PreservePackageInfoDialog = defineAsyncComponent(
	() => import('./components/preservePackageInfo-dialog.vue')
);
const PushDeliverGoodsDialog = defineAsyncComponent(
	() => import('./components/pushDeliverGoods-dialog.vue')
);
const CancelApplication = defineAsyncComponent(
	() => import('./components/cancelApplication.vue')
);

// BaseTable 引用
const baseTableRef = ref();

// 高级搜索布局的引用
const AdvancedSearchStyleRef = ref();
// 搜索表单引用
const queryRef = ref();
// 导入弹窗引用
const importDialogRef = ref();
// 批量维护货件信息
const preservePackageInfoRef = ref();
// 批量推送发货（模板/导入：一件代发 ∪ 入平台仓且未命中货件维护配置国家）
const pushDeliverGoodsRef = ref();
// 批量采购确认交期
const affirmDeliveryTimeRef = ref();
// 批量MSKU维护
const preserveMSKURef = ref();
// 取消申请对话框引用
const cancelApplicationRef = ref();
// 运营确认发货对话框引用
const affirmDeliverGoodsRef = ref();
// 运营确认发货弹窗勾选数据
const affirmDeliverGoodsRows = ref<any[]>([]);
// 是否显示搜索
const showSearch = ref(true);
// 当前点击的行
const currentRow = ref({ id: '' });
// 弹窗标题
const title = ref('');
// 弹窗类型
const visibleType = ref('');
// 弹窗是否可见
const visible = ref(false);
// 采购确认/更新交期对话框
const affirmDeliveryTimeDialogVisible = ref(false);
// 维护货件信息对话框
const preservePackageInfoDialogVisible = ref(false);
// 一件代发推送发货对话框
const pushDeliverGoodsDialogVisible = ref(false);
// 日志对话框
const logDialogVisible = ref(false);
const upFileRef = ref();
// 人员搜索类型
type UserSearchKey = 'purchaseUserIds' | 'operationIds' | 'createIds';
const userSearchType = ref<UserSearchKey>('purchaseUserIds');

// 各类型对应的 settings 配置
const userSearchSettings: Record<UserSearchKey, Record<string, any>> = {
	purchaseUserIds: {
		text: '采购员',
		getTreeDataParams: {
			postCodeList: [
				'PURCHASING_DIRECTOR',
				'PURCHASING_MANAGER',
				'PROCUREMENT_MANAGER',
				'PURCHASING_OFFICER',
			],
		},
	},
	operationIds: {
		text: '运营人员',
		getTreeDataParams: { lockFlag: 0 },
	},
	createIds: {
		text: '创建人',
		getTreeDataParams: { lockFlag: 0 },
	},
};

// 切换人员搜索类型时清空所有相关字段
const handleUserSearchTypeChange = () => {
	(Object.keys(userSearchSettings) as UserSearchKey[]).forEach((key) => {
		state.queryForm[key] = undefined;
	});
	getDataListDebounced();
};

const { t } = useI18n();
const { open } = useResultDialog();

const getTransportMethodText = (row: any) =>
	row.transportMethodText ||
	row.collectionPlanMessage?.transportMethodText ||
	row.collectionPlanMessage?.transportMethod ||
	row.transportMethod ||
	'-';

const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {},
	pageList: getCollectionPlanPage,
	columns,
	descs: ['create_time', 'pickup_order_no'],
	ascs: [],
	pagination: {
		size: 20,
		pageSizes: [10, 20, 50, 100, 200, 500, 1000],
	},
	toolBarConfig: {
		handleRefresh: () => register?.getDataList(),
		handleExport: () => handleExport(),
		settingKey: 'mcp_collectionPlan_index',
	},
});

const {
	register,
	getDataList: getDataListDebounced,
	tableRef,
	resetTableQuery,
} = useTable(state, baseTableRef);

// 初始化字典数据
const { dictMap } = useMultipleDicts(
	[
		{
			key: 'deptTree',
			fetchFn: deptTree,
			params: {
				deptName: '运营中心',
				showRootFlag: 0,
			},
		},
	],
	{
		isAuto: true,
		tableRef,
	}
);

// 重置查询
const resetQuery = () => {
	resetTableQuery(() => ({
		queryForm: { current: 1, size: 10 },
		descs: ['create_time', 'pickup_order_no'],
		ascs: [],
	}));
};

// 打开对话框
const openDialog = async (type: string, row?: any) => {
	try {
		if (type === 'add') {
			title.value = t('新增提货');
			visibleType.value = 'add';
			currentRow.value = { id: '' };
			visible.value = true;
		} else if (type === 'collectionPlanEdit') {
			if (row.status !== OrderStatus.WAIT_OPERATION_CONFIRM) {
				useMessage().warning(t('只有待运营确认发货的提货单号才能编辑'));
				return;
			}
			const res = await getCollectionPlanDetail({ id: row.id });
			if (res.code === 0) {
				title.value = t('编辑提货计划');
				visibleType.value = 'edit';
				currentRow.value = res.data;
				visible.value = true;
			}
		} else if (type === 'del') {
			const ids = tableRef.value
				?.getCheckboxRecords()
				?.map((item: any) => item.id);
			if (!ids || ids.length === 0) {
				useMessage().warning(t('请至少选择一条数据'));
				return;
			}
			const allPushedShippingQuantityZero = tableRef.value
				?.getCheckboxRecords()
				?.every((item: any) => item.pushedShippingQuantity === 0);
			if (!allPushedShippingQuantityZero) {
				useMessageBox().warning(t('只有已推发货数量为0的提货单号才能删除'));
				return;
			}
			ElMessageBox.confirm(t('是否确认删除选中数据？'), t('提示'), {
				confirmButtonText: t('确定'),
				cancelButtonText: t('取消'),
				type: 'warning',
			}).then(async () => {
				try {
					const res = await postCollectionPlanDelete({ ids });
					if (res.code === 0) {
						if (res.data?.failCount > 0) {
							open({ title: t('删除失败'), data: res.data });
						} else if (res.data?.failCount === 0) {
							useMessage().success('删除成功');
						}
					}
					tableRef.value?.clearCheckboxRow();
					getDataListDebounced();
				} catch (error: any) {
					ElMessageBox.confirm(error?.msg || t('操作失败'), t('提示'), {
						type: 'error',
					});
				}
			});
		} else if (type === 'log') {
			logDialogVisible.value = true;
			currentRow.value = row;
		} else if (type === 'affirmDeliveryTime') {
			if (row.status !== OrderStatus.WAIT_PURCHASE_CONFIRM) {
				useMessage().warning(t('只有待采购确认交期才能进行采购确认交期'));
				return;
			}
			const res = await getCollectionPlanDetail({ id: row.id });
			if (res.code === 0) {
				title.value = t('采购确认交期');
				visibleType.value = 'affirmDeliveryTime';
				currentRow.value = res.data;
				affirmDeliveryTimeDialogVisible.value = true;
			}
		} else if (type === 'updateDeliveryTime') {
			if (
				row.status !== OrderStatus.WAIT_PUSH_SHIP &&
				row.status !== OrderStatus.WAIT_PUSH_SHIP &&
				row.status !== OrderStatus.FINISH
			) {
				useMessage().warning(t('状态不对,无法进行采购更新交期'));
				return;
			}
			const res = await getCollectionPlanDetail({ id: row.id });
			if (res.code === 0) {
				title.value = t('采购更新交期');
				visibleType.value = 'updateDeliveryTime';
				currentRow.value = res.data;
				affirmDeliveryTimeDialogVisible.value = true;
			}
		} else if (type === 'preservePackageInfo') {
			// 3待运营维护货件 4 待上传货件标签 5 待推送发货
			if (
				row.status !== OrderStatus.WAIT_PUSH_SHIP &&
				row.status !== OrderStatus.WAIT_UPLOAD_LABEL &&
				row.status !== OrderStatus.WAIT_OPERATION_MAINTAINANCE
			) {
				useMessage().warning(t('状态不对,无法进行维护货件信息'));
				return;
			}
			const res = await getCollectionPlanDetail({ id: row.id });
			if (res.code === 0) {
				title.value = t('维护货件信息');
				visibleType.value = 'preservePackageInfo';
				currentRow.value = res.data;
				preservePackageInfoDialogVisible.value = true;
			}
		} else if (type === 'pushDeliverGoods') {
			if (row.status !== OrderStatus.WAIT_PUSH_SHIP) {
				useMessage().warning(t('状态不对,无法进行推送发货(一件代发)'));
				return;
			}
			const res = await getCollectionPlanDetail({ id: row.id });
			if (res.code === 0) {
				title.value = t('推送发货(一件代发)');
				visibleType.value = 'pushShipment';
				currentRow.value = res.data;
				pushDeliverGoodsDialogVisible.value = true;
			}
		} else if (type === 'uploadLabel') {
			const ids = tableRef.value
				?.getCheckboxRecords()
				?.map((item: any) => item.id);
			if (!ids || ids.length === 0) {
				useMessage().warning(t('请至少选择一条数据'));
				return;
			}
			const inValid = tableRef.value
				?.getCheckboxRecords()
				?.some((item: any) => item.status === OrderStatus.FINISH);
			if (inValid) {
				useMessage().warning(t('已完成推送不能进行上传'));
				return;
			}
			upFileRef.value.show();
		}
	} catch (error: any) {
		useMessage().error(error?.msg || t('错误'));
	}
};

// 打开批量操作对话框
const openReview = async (type: string) => {
	const ids = tableRef.value?.getCheckboxRecords()?.map((item: any) => item.id);
	if (!ids || ids.length === 0) {
		useMessage().warning(t('请至少选择一条数据'));
		return;
	}
	try {
		if (type === 'affirmDeliverGoods') {
			const rows = tableRef.value?.getCheckboxRecords() ?? [];
			const allStatusOne = rows?.every(
				(item: any) => item.status === OrderStatus.WAIT_OPERATION_CONFIRM
			);
			if (!allStatusOne) {
				useMessage().warning(
					t('只有待运营确认发货的提货单号才能进行运营确认发货')
				);
				return;
			}
			const missingMskuPlans = rows
				?.filter((item: any) => item.mskuCode === '')
				.map((item: any) => item.pickupOrderNo);
			if (missingMskuPlans.length > 0) {
				useMessage().warning(
					`提货计划[${missingMskuPlans.join('、')}]未维护MSKU,请维护后再操作！`
				);
				return;
			}
			affirmDeliverGoodsRows.value = rows;
			affirmDeliverGoodsRef.value.show();
		} else if (type === 'pushDeliverGoodsForPlatform') {
			const rows = tableRef.value?.getCheckboxRecords() ?? [];
			const allShippingMethodEnterPlatformWarehouse = rows.every(
				(item: any) => item.shippingMethod === 'enter_platform_warehouse'
			);
			if (!allShippingMethodEnterPlatformWarehouse) {
				useMessage().warning(
					t('只有类型为入平台仓的提货单号才能进行批量推送发货（有货件）')
				);
				return;
			}
			const allHitConfiguredCountry = rows.every((item: any) =>
				isRowEligibleForBatchPushDeliverWithShipment(item)
			);
			if (!allHitConfiguredCountry) {
				const bad = rows
					.filter(
						(item: any) => !isRowEligibleForBatchPushDeliverWithShipment(item)
					)
					.map((item: any) => item.pickupOrderNo);
				useMessage().warning(
					`批量推送发货（有货件）仅支持货件维护配置表已配置国家的入平台仓单据，以下提货单不符合：${bad.join(
						'、'
					)}`
				);
				return;
			}
			const allStatusFour = rows.every(
				(item: any) => item.status === OrderStatus.WAIT_PUSH_SHIP
			);
			if (!allStatusFour) {
				useMessage().warning(
					t('只有状态是待推送发货的提货单号才能进行批量推送发货（有货件）')
				);
				return;
			}
			useMessageBox()
				.confirm(t('是否确认批量推送发货（有货件）选中数据？'))
				.then(async () => {
					try {
						const res = await postPushDeliverGoodsForPlatform({ ids });
						if (res.code === 0) {
							if (res.data?.failCount > 0) {
								open({
									title: t('批量推送发货（有货件）失败'),
									data: res.data,
								});
							} else if (res.data?.failCount === 0) {
								useMessage().success(t('批量推送发货（有货件）成功'));
							}
						}
						tableRef.value?.clearCheckboxRow();
						getDataListDebounced();
					} catch (error: any) {
						useMessage().error(error?.msg || t('操作失败'));
					}
				});
		} else if (type === 'cancelApplication') {
			const res = await getCollectionPlanListByIds({ ids });
			if (res.code !== 0) return;
			const hasPushedShippingQuantity = res.data.some(
				(item: any) => item.pushedShippingQuantity === item.pickupQuantity
			);
			if (hasPushedShippingQuantity) {
				useMessage().warning(
					t(
						'所选提货计划中存在已推送发货数量等于全部提货数量的记录，无法进行取消申请'
					)
				);
				return;
			}
			cancelApplicationRef.value.show(res.data);
		}
	} catch (error: any) {
		tableRef.value?.clearCheckboxRow();
		getDataListDebounced();
		if (error?.msg) {
			useMessage().error(error.msg);
		}
	}
};

// 导出
const handleExport = async () => {
	try {
		const ids = tableRef.value
			?.getCheckboxRecords()
			?.map((item: any) => item.id);
		state.loading = true;
		await getExportCollectionPlan({
			...state.queryForm,
			ascs: state?.ascs,
			descs: state?.descs,
			ids,
			current: 1,
			size: 10000,
		});
	} catch (error) {
		useMessage().error(t(error as string));
	} finally {
		state.loading = false;
	}
};

type DownloadType = 'needAffirm' | 'shipmentInformation' | 'dispatchShipments';
const downloadApiMap: Record<DownloadType, (params: any) => Promise<any>> = {
	needAffirm: getExportNeedAffirmDeliveryTime,
	shipmentInformation: getExportShipmentInformation,
	dispatchShipments: getExportDispatchShipments,
};

/** 批量推送发货模板范围：一件代发，或入平台仓且货件维护国家未命中（与 CollectionPlanVo.shipmentCountryConfigFlag 一致） */
const isRowEligibleForBatchPushDeliverCombined = (row: any) =>
	row.shippingMethod === 'dropshipping' ||
	(row.shippingMethod === 'enter_platform_warehouse' &&
		row.shipmentCountryConfigFlag !== true);

/** 批量推送发货（有货件）：仅入平台仓且货件维护国家已命中 */
const isRowEligibleForBatchPushDeliverWithShipment = (row: any) =>
	row.shippingMethod === 'enter_platform_warehouse' &&
	row.shipmentCountryConfigFlag === true;

// 下载批量操作模板
const downloadNeedTemplate = async (type: DownloadType) => {
	try {
		const records = tableRef.value?.getCheckboxRecords() ?? [];
		// 勾选下载时：批量推送发货仅允许「一件代发」或「入平台仓且未配置货件维护国家」
		if (type === 'dispatchShipments' && records.length > 0) {
			const invalid = records.filter(
				(row: any) => !isRowEligibleForBatchPushDeliverCombined(row)
			);
			if (invalid.length > 0) {
				useMessage().warning(
					`「批量推送发货」仅支持一件代发，或入平台仓且货件维护国家未配置的单据，以下提货单不符合：${invalid
						.map((r: any) => r.pickupOrderNo)
						.join('、')}`
				);
				return;
			}
		}
		const ids = records.map((item: any) => item.id);
		state.loading = true;
		await downloadApiMap[type]({
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

// 确认操作
const handleConfirm = async (type: string) => {
	const ids = tableRef.value?.getCheckboxRecords()?.map((item: any) => item.id);
	try {
		if (type === 'affirmDeliverGoods') {
			const res = await postCollectionPlanAffirmDeliverGoods({ ids });
			if (res.code === 0) {
				if (res.data?.failCount > 0) {
					open({ title: t('发货确认失败'), data: res.data });
				} else if (res.data?.failCount === 0) {
					useMessage().success('发货成功');
				}
			}
			affirmDeliverGoodsRef.value.hide();
			affirmDeliverGoodsRows.value = [];
		}
		tableRef.value?.clearCheckboxRow();
		getDataListDebounced();
	} catch (error: any) {
		if (error?.msg) {
			useMessage().error(error.msg);
		}
	}
};

// 取消操作
const handleCancel = async (type: string) => {
	try {
		if (type === 'affirmDeliverGoods') {
			affirmDeliverGoodsRef.value.hide();
			affirmDeliverGoodsRows.value = [];
		}
		tableRef.value?.clearCheckboxRow();
		getDataListDebounced();
	} catch (error: any) {
		if (error?.msg) {
			useMessage().error(error.msg);
		}
	}
};

const isZipFile = (fileName: string) => {
	return /\.zip$/i.test(fileName);
};

// 确定上传附件的回调
const confirmUpFile = async (e: any) => {
	const fileName = e.shipmentLabelFileUrl?.[0];

	// 不是 zip
	const fileType = isZipFile(fileName) ? 'zip' : 'file';
	const res = await uploadFileAttachment({
		filesUrl: e.shipmentLabelFileUrl,
		fileType: fileType,
	});
	if (res.code === 0) {
		useMessage().success(t('上传成功'));
		// 关闭弹窗
		upFileRef.value?.hide();
	}
	register.getDataList();
};
// 关闭对话框
const closeDialog = () => {
	visible.value = false;
	tableRef.value?.clearCheckboxRow();
	getDataListDebounced();
};
</script>

<style lang="scss" scoped>
.el-dropdown-link {
	cursor: pointer;
	color: var(--el-color-primary);
	display: flex;
	align-items: center;
}
.user-search-select {
	width: 110px !important;
}
.user-search-select-right {
	width: 220px;
}
</style>
