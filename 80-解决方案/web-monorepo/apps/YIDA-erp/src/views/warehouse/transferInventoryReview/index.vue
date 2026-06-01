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
												label: 'SKU',
												value: 'skuCodes',
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
												label: '转库存单号',
												value: 'transferInventoryNos',
											},
										]"
										:getDataList="getDataList"
									/>
								</div>
							</el-form-item>

							<el-form-item>
								<!-- 自营仓+三方仓+平台仓 -->
								<!-- <el-select
									collapse-tags
									:max-collapse-tags="1"
									clearable
									filterable
									multiple
									@change="getDataList"
									v-model="state.queryForm.warehouseCodes"
									placeholder="仓库"
									style="width: 220px"
								>
									<el-option
										v-for="item in dictMap.warehouseListType"
										:key="item.warehouseCode"
										:label="item.warehouseName"
										:value="item.warehouseCode"
									/>
								</el-select> -->
								<TreeSelectInputApi
									componentType="warehouseQianyi"
									v-model:queryForm="state.queryForm"
									:style="{ width: '220px' }"
									multiple
									placeholder="仓库"
									:settings="{
										text: '仓库',
										width: '220px',
										searchFn: async () => {
											await getDataList();
										},
										getTreeDataParams: {
											warehouseTypes: [0, 1, 3],
										},
										code: 'warehouseCodes',
									}"
								/>
							</el-form-item>
							<el-form-item>
								<!-- <el-select
									v-model="state.queryForm.statusList"
									collapse-tags
									:max-collapse-tags="1"
									clearable
									filterable
									multiple
									placeholder="状态"
									style="width: 200px"
									@change="getDataList"
								>
									<el-option
										v-for="item in dictMap.transferInventoryReviewApprovalType"
										:key="item.value"
										:label="item.label"
										:value="item.value"
									/>
								</el-select> -->
								<TreeSelectInputApi
									componentType="dicts"
									v-model:queryForm="state.queryForm"
									:style="{ width: '220px' }"
									multiple
									placeholder="状态"
									:settings="{
										text: '状态',
										width: '220px',
										searchFn: async () => {
											await getDataList();
										},
										getTreeDataParams: 'transfer_inventory_review_status',
										code: 'statusList',
									}"
								/>
							</el-form-item>
							<el-form-item>
								<!-- <el-select
									collapse-tags
									:max-collapse-tags="1"
									clearable
									filterable
									multiple
									@change="getDataList"
									v-model="state.queryForm.createIds"
									placeholder="申请人"
									style="width: 220px"
								>
									<el-option
										v-for="item in dictMap.productManageId"
										:key="item.userId"
										:label="item.name"
										:value="item.userId"
									/>
								</el-select> -->
								<TreeSelectInputApi
									componentType="userList"
									v-model:queryForm="state.queryForm"
									:style="{ width: '220px' }"
									multiple
									placeholder="申请人"
									:settings="{
										text: '申请人',
										width: '220px',
										searchFn: async () => {
											await getDataList();
										},
										getTreeDataParams: '{ lockFlag: 0 }',
										code: 'createIds',
									}"
								/>
							</el-form-item>
							<el-form-item>
								<!-- <el-select
									collapse-tags
									:max-collapse-tags="1"
									clearable
									filterable
									multiple
									@change="getDataList"
									v-model="state.queryForm.transferTypes"
									placeholder="类型"
									style="width: 220px"
								>
									<el-option
										v-for="item in dictMap.stockTransferType"
										:key="item.id"
										:label="item.label"
										:value="item.value"
									/>
								</el-select> -->
								<TreeSelectInputApi
									componentType="dicts"
									v-model:queryForm="state.queryForm"
									:style="{ width: '220px' }"
									multiple
									placeholder="类型"
									:settings="{
										text: '类型',
										width: '220px',
										searchFn: async () => {
											await getDataList();
										},
										getTreeDataParams: 'stock_transfer_type',
										code: 'transferTypes',
									}"
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
												label: '申请时间',
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
								</div>
							</el-form-item></template
						>
					</AdvancedSearchStyle>
				</el-form>
			</el-row>
			<el-row>
				<ToolBar
					@handleRefresh="getDataList"
					@handleExport="handleExport"
					:is-show-export="auth('transferInventoryReview_export')"
				>
					<template #left-tool>
						<el-button
							class="ml10"
							@click="openReview('newDeptSupervisorReview')"
							v-auth="'transferInventoryReview_newDeptSupervisorReview'"
						>
							{{ $t('新部门主管审核') }}</el-button
						>
						<el-button
							class="ml10"
							@click="openReview('originalDeptSupervisorReview')"
							v-auth="'transferInventoryReview_originalDeptSupervisorReview'"
						>
							{{ $t('原部门主管审核') }}</el-button
						>
						<el-button
							class="ml10"
							@click="openReview('logisticsReview')"
							v-auth="'transferInventoryReview_logisticsReview'"
						>
							{{ $t('物流审核') }}</el-button
						>
						<el-button
							class="ml10"
							@click="openReview('materialReview')"
							v-auth="'transferInventoryReview_materialReview'"
						>
							{{ $t('物控审核') }}</el-button
						>
						<el-button
							class="ml10"
							@click="openReview('logisticsDirectorReview')"
							v-auth="'transferInventoryReview_logisticsDirectorReview'"
						>
							{{ $t('物流总监审核') }}</el-button
						>
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
					reserve-selection
					width="50"
					fixed="left"
				/>
				<el-table-column
					:label="t('转库存单号')"
					prop="transferInventoryNo"
					width="150"
				>
					<template #default="{ row }">
						{{ row.transferInventoryNo ? row.transferInventoryNo : '---' }}
					</template>
				</el-table-column>
				<el-table-column
					prop="status"
					:label="t('类型')"
					show-overflow-tooltip
					width="150"
				>
					<template #default="{ row }">
						{{
							dictMap.stockTransferType.find(
								(i) => String(i.value) === String(row.transferType)
							)?.label || '---'
						}}
					</template>
				</el-table-column>
				<el-table-column
					prop="status"
					:label="t('状态')"
					show-overflow-tooltip
					width="100"
				>
					<template #default="{ row }">
						{{ row.statusText || '---' }}
					</template>
				</el-table-column>
				<el-table-column
					prop="legalPersonId"
					:label="t('法人主体')"
					show-overflow-tooltip
					width="100"
				>
					<template #default="{ row }">
						{{ row.legalPersonName || '---' }}
					</template>
				</el-table-column>
				<el-table-column
					prop="legalPersonNewName"
					:label="t('新法人主体')"
					show-overflow-tooltip
					width="100"
				>
					<template #default="{ row }">
						{{ row.legalPersonNewName || '---' }}
					</template>
				</el-table-column>
				<el-table-column
					prop="skuCode"
					:label="t('SKU/产品名称')"
					show-overflow-tooltip
					width="200"
				>
					<template #default="{ row }">
						<div
							style="
								display: flex;
								flex-direction: column;
								justify-content: center;
								align-items: flex-start;
								width: 100%;
							"
						>
							<div
								style="
									max-width: 100%;
									overflow: hidden;
									white-space: nowrap;
									text-overflow: ellipsis;
								"
							>
								{{ row.skuCode }}
							</div>
							<div
								style="
									max-width: 100%;
									overflow: hidden;
									white-space: nowrap;
									text-overflow: ellipsis;
								"
							>
								{{ row.skuName }}
							</div>
						</div>
					</template>
				</el-table-column>
				<el-table-column
					prop="planNum"
					:label="t('仓库')"
					show-overflow-tooltip
					width="100"
				>
					<template #default="{ row }">
						{{ row.warehouseCodeText || '---' }}
					</template>
				</el-table-column>
				<el-table-column
					prop="countryCode"
					:label="t('国家')"
					show-overflow-tooltip
					width="100"
				>
					<template #default="{ row }">
						{{ row.countryCode || '---' }}
					</template>
				</el-table-column>
				<el-table-column
					prop="platformChannelCodeTextOriginal"
					:label="t('渠道(原)')"
					show-overflow-tooltip
					width="100"
				>
					<template #default="{ row }">
						{{ row.platformChannelCodeTextOriginal || '---' }}
					</template>
				</el-table-column>
				<el-table-column
					prop="mskuCodeOriginal"
					:label="t('MSKU(原)')"
					show-overflow-tooltip
					width="100"
				>
					<template #default="{ row }">
						{{ row.mskuCodeOriginal || '---' }}
					</template>
				</el-table-column>
				<el-table-column
					prop="deptNameOriginal"
					:label="t('部门&小组(原)')"
					show-overflow-tooltip
					width="180"
				>
					<template #default="{ row }">
						{{ row.deptNameOriginal || '---' }}
					</template>
				</el-table-column>
				<el-table-column
					prop="transferQuantity"
					:label="t('转换数量')"
					show-overflow-tooltip
					width="100"
				>
					<template #default="{ row }">
						{{ row.transferQuantity || '---' }}
					</template>
				</el-table-column>
				<el-table-column
					prop="platformChannelCodeTextNew"
					:label="t('渠道(新)')"
					show-overflow-tooltip
					width="100"
				>
					<template #default="{ row }">
						{{ row.platformChannelCodeTextNew || '---' }}
					</template>
				</el-table-column>
				<el-table-column
					prop="mskuCodeNew"
					:label="t('MSKU(新)')"
					show-overflow-tooltip
					width="100"
				>
					<template #default="{ row }">
						{{ row.mskuCodeNew || '---' }}
					</template>
				</el-table-column>
				<el-table-column
					prop="deptNameNew"
					:label="t('部门&小组(新)')"
					show-overflow-tooltip
					width="180"
				>
					<template #default="{ row }">
						{{ row.deptNameNew || '---' }}
					</template>
				</el-table-column>
				<el-table-column
					prop="createName"
					:label="t('申请人')"
					show-overflow-tooltip
					width="100"
				/>
				<el-table-column
					prop="createTime"
					:label="t('申请时间')"
					show-overflow-tooltip
					width="100"
				/>
				<el-table-column :label="$t('common.action')" fixed="right" width="100">
					<template #default="{ row }">
						<div class="flex items-center">
							<el-button
								text
								type="primary"
								class="mr20"
								@click="openDialog('log', row)"
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

		<!-- 日志 -->
		<LogDialog
			v-model="logDialogVisible"
			:id="currentRow.id"
			:biz-type="['TRANSFER_INVENTORY_REVIEW']"
			:showSearchForm="false"
			:showToolBar="false"
			@closeDialog="
				() => {
					logDialogVisible = false;
				}
			"
		/>
		<ImportDialog
			ref="importDialogRef"
			title="导入需求计划"
			templateUrl="/files/import-template/导入需求模版.xlsx"
			excelUploadApi="/purchase/demand/import"
			:accept="'.xlsx,.xls'"
			@refreshDataList="getDataList"
		/>
		<!-- 原部门主管审核 -->
		<InputDialog
			ref="originalDeptSupervisorReviewRef"
			title="原部门主管审核"
			message=""
			:show-icon="true"
			icon-type="info"
			input-prop="remark"
			confirm-button-text="确认"
			confirm-button-type="primary"
			cancelButtonText="驳回"
			input-placeholder="驳回,必填"
			inputType="textarea"
			@cancel="(e:any) => {
				handleCancel('originalDeptSupervisorReview', e);
			}"
			@confirm="
				(e:any) => {
					handleConfirm('originalDeptSupervisorReview', e);
				}
			"
		/>
		<!-- 新部门主管审核 -->
		<InputDialog
			ref="newDeptSupervisorReviewRef"
			title="新部门主管审核"
			message=""
			:show-icon="true"
			icon-type="info"
			input-prop="remark"
			confirm-button-text="确认"
			confirm-button-type="primary"
			cancelButtonText="驳回"
			input-placeholder="驳回,必填"
			inputType="textarea"
			@cancel="(e:any) => {
				handleCancel('newDeptSupervisorReview', e);
			}"
			@confirm="
				(e:any) => {
					handleConfirm('newDeptSupervisorReview', e);
				}
			"
		/>
		<!-- 物流审核 -->
		<InputDialog
			ref="logisticsReviewRef"
			title="物流审核"
			message=""
			:show-icon="true"
			icon-type="info"
			input-prop="remark"
			confirm-button-text="确认"
			confirm-button-type="primary"
			cancelButtonText="驳回"
			input-placeholder="驳回,必填"
			inputType="textarea"
			@cancel="(e:any) => {
				handleCancel('logisticsReview', e);
			}"
			@confirm="
				(e:any) => {
					handleConfirm('logisticsReview', e);
				}
			"
		/>
		<!-- 物控审核 -->
		<InputDialog
			ref="materialReviewRef"
			title="物控审核"
			message=""
			:show-icon="true"
			icon-type="info"
			input-prop="remark"
			confirm-button-text="确认"
			confirm-button-type="primary"
			cancelButtonText="驳回"
			input-placeholder="驳回,必填"
			inputType="textarea"
			@cancel="(e:any) => {
				handleCancel('materialReview', e);
			}"
			@confirm="
				(e:any) => {
					handleConfirm('materialReview', e);
				}
			"
		/>
		<!-- 物流总监审核 -->
		<InputDialog
			ref="logisticsDirectorReviewRef"
			title="物流总监审核"
			message=""
			:show-icon="true"
			icon-type="info"
			input-prop="remark"
			confirm-button-text="确认"
			confirm-button-type="primary"
			cancelButtonText="驳回"
			input-placeholder="驳回,必填"
			inputType="textarea"
			@cancel="(e:any) => {
				handleCancel('logisticsDirectorReview', e);
			}"
			@confirm="
				(e:any) => {
					handleConfirm('logisticsDirectorReview', e);
				}
			"
		/>
	</div>
</template>

<script setup lang="ts">
import { BasicTableProps, useTable } from '/@/hooks/table';
import { useI18n } from 'vue-i18n';
import { defineAsyncComponent, ref, reactive } from 'vue';
import { useMessage } from '/@/hooks/message';
import { ElMessageBox } from 'element-plus';
import { getDicts } from '/@/api/admin/dict';
import { useRoute } from 'vue-router';
import {
	getTransferInventoryReviewPage,
	postLogisticsDirectorReview,
	postLogisticsReview,
	postMaterialReview,
	logisticsDirectorReview,
	postNewDeptSupervisorReview,
	postOriginalDeptSupervisorReview,
	getTransferInventoryReviewExport,
} from '/@/api/warehouse/transferInventoryReview/index';
import { useMultipleDicts } from '/@/hooks/multipleDicts';
import { useResultDialog } from '/@/hooks/useResultDialog';
import { auth } from '/@/utils/authFunction';
const route = useRoute();
const ToolBar = defineAsyncComponent(
	() => import('/@/components/ToolBar/tool-bar.vue')
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
const InputDialog = defineAsyncComponent(
	() => import('/@/components/ConfirmDialog/InputDialog.vue')
);
const TreeSelectInputApi = defineAsyncComponent(
	() => import('/@/componentsApi/TreeSelectInputApi/index.vue')
);
//   初始化数据
// table的引用
const tableRef = ref();
const { dictMap } = useMultipleDicts(
	[
		{
			key: 'stockTransferType',
			fetchFn: getDicts,
			params: 'stock_transfer_type',
		}, // 转库存类型
	],
	{
		isAuto: true,
		tableRef,
	}
);
const { t } = useI18n();

// 原部门主管审核对话框的引用
const originalDeptSupervisorReviewRef = ref();
// 新部门主管审核对话框的引用
const newDeptSupervisorReviewRef = ref();
// 物流审核对话框的引用
const logisticsReviewRef = ref();
// 物流总监审核对话框的引用
const logisticsDirectorReviewRef = ref();
// 物控审核对话框的引用
const materialReviewRef = ref();

// 高级搜索布局的引用
const AdvancedSearchStyleRef = ref();

// 搜索变量
const queryRef = ref();
// 导入弹窗的引用
const importDialogRef = ref();
// 是否显示搜索
const showSearch = ref(true);
// 当前点击的行
const currentRow = ref({
	id: '',
});
// 当前选中的行数据
const selectedRows = ref([]);
// 弹窗标题
const title = ref('');
// 弹窗类型
const visibleType = ref('');
// 弹窗是否可见
const visible = ref(false);
// 日志对话框是否可见
const logDialogVisible = ref(false);

const { open } = useResultDialog();

const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {
		// status: 1,
		// skuStatus: 1,
	},
	pageList: getTransferInventoryReviewPage,
	loading: false,
	dataList: [],
	ascs: [],
	descs: ['create_time'],
});

//  table hook
const {
	getDataList,
	currentChangeHandle,
	sizeChangeHandle,
	sortChangeHandle,
	tableStyle,
} = useTable(state, tableRef);

// 重置
const resetQuery = async () => {
	// 重置时间组件的查询条件
	state.queryForm = {
		current: 1,
		size: 10,
		descs: ['create_time'],
	};
	getDataList();
};

// 打开对话框
const openDialog = async (type: string, row?: any) => {
	try {
		if (type === 'add') {
			title.value = t('新增需求');
			visibleType.value = 'add';
			currentRow.value = {
				id: '',
			};
			visible.value = true;
		} else if (type === 'log') {
			logDialogVisible.value = true;
			currentRow.value = row;
		}
	} catch (error: any) {
		useMessage().error(error?.msg || t('错误'));
	}
};

//判断所选行属性
const checkFieldUnique = (field: string) => {
	const rows = tableRef.value.getSelectionRows() || [];

	const values = [...new Set(rows.map((item: any) => item[field]))];

	if (values.length > 1) {
		// useMessage().warning(t(`所选数据的 ${field} 必须一致`));
		return { status: false, value: null };
	}

	return { status: true, value: values[0] };
};

// 打开审核对话框
const openReview = async (type: string) => {
	// 清空备注
	// 获取到所有选中的行
	selectedRows.value = [];
	const ids = tableRef.value.getSelectionRows()?.map((item: any) => item.id);
	if (!ids || ids.length === 0) {
		useMessage().warning(t('请至少选择一条数据'));
		return;
	}
	if (!checkFieldUnique('transferType').status) {
		useMessage().warning(t('所选数据的转库存类型必须一致'));
		return;
	}
	try {
		if (type === 'newDeptSupervisorReview') {
			const allStatusOne = tableRef.value
				.getSelectionRows()
				?.every((item: any) => item.status === 1);
			if (!allStatusOne) {
				useMessage().warning(
					t('只有状态为待新部门主管审核的数据才能进行新部门主管审核')
				);
				return;
			}
			newDeptSupervisorReviewRef.value.show();
		} else if (type === 'originalDeptSupervisorReview') {
			const allStatusOne = tableRef.value
				.getSelectionRows()
				?.every((item: any) => item.status === 2);
			if (!allStatusOne) {
				useMessage().warning(
					t('只有状态为待原部门主管审核的数据才能进行原部门主管审核')
				);
				return;
			}
			originalDeptSupervisorReviewRef.value.show();
		} else if (type === 'logisticsReview') {
			const allStatusOne = tableRef.value
				.getSelectionRows()
				?.every((item: any) => item.status === 3);
			if (!allStatusOne) {
				useMessage().warning(t('只有状态为待物流审核的数据才能进行物流审核'));
				return;
			}
			logisticsReviewRef.value.show();
		} else if (type === 'materialReview') {
			const allStatusOne = tableRef.value
				.getSelectionRows()
				?.every((item: any) => item.status === 4);
			if (!allStatusOne) {
				useMessage().warning(t('只有状态为待物控审核的数据才能进行物控审核'));
				return;
			}
			materialReviewRef.value.show();
		} else if (type === 'logisticsDirectorReview') {
			const allStatusOne = tableRef.value
				.getSelectionRows()
				?.every((item: any) => item.status === 5);
			if (!allStatusOne) {
				useMessage().warning(
					t('只有状态为待物流总监审核的数据才能进行物流总监审核')
				);
				return;
			}
			logisticsDirectorReviewRef.value.show();
		}
	} catch (error: any) {
		if (error?.msg) {
			useMessage().error(error.msg);
		}
	}
};
// 导出
const handleExport = async () => {
	try {
		const ids = tableRef.value.getSelectionRows()?.map((item: any) => item.id);
		// 显示加载状态
		state.loading = true;
		// 发送请求，设置 responseType 为 'blob' 以接收二进制流
		await getTransferInventoryReviewExport({
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

// 确认操作
const handleConfirm = async (type: string, e?: any) => {
	// 获取到所有选中的行
	const ids = tableRef.value.getSelectionRows()?.map((item: any) => item.id);
	try {
		if (type === 'originalDeptSupervisorReview') {
			const res = await postOriginalDeptSupervisorReview({
				ids,
				passFlag: 1, //  是否审核通过 0否，1是
				remark: e.remark,
			});
			if (res.code === 0) {
				// 判断是否有失败的记录
				if (res.data?.failCount > 0) {
					// 展示错误提示
					open({
						title: t('原部门主管审核失败'),
						data: res.data,
					});
				} else if (res.data?.failCount === 0) {
					useMessage().success('审核成功');
				}
			}
			// 关闭对话框
			originalDeptSupervisorReviewRef.value.hide();
		} else if (type === 'newDeptSupervisorReview') {
			const res = await postNewDeptSupervisorReview({
				ids,
				passFlag: 1, //  是否审核通过 0否，1是
				remark: e.remark,
			});
			if (res.code === 0) {
				// 判断是否有失败的记录
				if (res.data?.failCount > 0) {
					// 展示错误提示
					open({
						title: t('新部门主管审核失败'),
						data: res.data,
					});
				} else if (res.data?.failCount === 0) {
					useMessage().success('审核成功');
				}
			}
			// 关闭对话框
			newDeptSupervisorReviewRef.value.hide();
		} else if (type === 'logisticsReview') {
			const res = await postLogisticsReview({
				ids,
				passFlag: 1, //  是否审核通过 0否，1是
				remark: e.remark,
			});
			if (res.code === 0) {
				// 判断是否有失败的记录
				if (res.data?.failCount > 0) {
					// 展示错误提示
					open({
						title: t('物流审核失败'),
						data: res.data,
					});
				} else if (res.data?.failCount === 0) {
					useMessage().success('审核成功');
				}
			}
			// 关闭对话框
			logisticsReviewRef.value.hide();
		} else if (type === 'materialReview') {
			let api =
				checkFieldUnique('transferType').value == 1
					? logisticsDirectorReview
					: postMaterialReview;
			const res = await api({
				ids,
				passFlag: 1, //  是否审核通过 0否，1是
				remark: e.remark,
			});
			if (res.code === 0) {
				// 判断是否有失败的记录
				if (res.data?.failCount > 0) {
					// 展示错误提示
					open({
						title: t('物控审核失败'),
						data: res.data,
					});
				} else if (res.data?.failCount === 0) {
					useMessage().success('审核成功');
				}
			}
			// 关闭对话框
			materialReviewRef.value.hide();
		} else if (type === 'logisticsDirectorReview') {
			const res = await postLogisticsDirectorReview({
				ids,
				passFlag: 1, //  是否审核通过 0否，1是
				remark: e.remark,
			});
			if (res.code === 0) {
				// 判断是否有失败的记录
				if (res.data?.failCount > 0) {
					// 展示错误提示
					open({
						title: t('物流总监审核失败'),
						data: res.data,
					});
				} else if (res.data?.failCount === 0) {
					useMessage().success('审核成功');
				}
			}
			// 关闭对话框
			logisticsDirectorReviewRef.value.hide();
		}
		// 清空选中行
		tableRef.value.clearSelection();
		getDataList();
	} catch (error: any) {
		if (error?.msg) {
			useMessage().error(error.msg);
		}
	}
};

// 取消操作(驳回)
const handleCancel = async (type: string, e?: any) => {
	// 获取到所有选中的行
	const ids = tableRef.value.getSelectionRows()?.map((item: any) => item.id);
	try {
		if (type === 'originalDeptSupervisorReview') {
			if (!e.remark) {
				ElMessageBox.alert('驳回理由不能为空', '提示', {
					type: 'warning',
				});
				return;
			}
			const res = await postOriginalDeptSupervisorReview({
				ids,
				passFlag: 0, //  是否审核通过 0否，1是
				remark: e.remark,
			});
			if (res.code === 0) {
				// 判断是否有失败的记录
				if (res.data?.failCount > 0) {
					// 展示错误提示
					open({
						title: t('原部门主管审核驳回失败'),
						data: res.data,
					});
				} else if (res.data?.failCount === 0) {
					useMessage().success('驳回成功');
				}
			}
			// 关闭对话框
			originalDeptSupervisorReviewRef.value.hide();
		} else if (type === 'newDeptSupervisorReview') {
			if (!e.remark) {
				ElMessageBox.alert('驳回理由不能为空', '提示', {
					type: 'warning',
				});
				return;
			}
			const res = await postNewDeptSupervisorReview({
				ids,
				passFlag: 0, //  是否审核通过 0否，1是
				remark: e.remark,
			});
			if (res.code === 0) {
				// 判断是否有失败的记录
				if (res.data?.failCount > 0) {
					// 展示错误提示
					open({
						title: t('新部门主管审核驳回失败'),
						data: res.data,
					});
				} else if (res.data?.failCount === 0) {
					useMessage().success('驳回成功');
				}
			}
			// 关闭对话框
			newDeptSupervisorReviewRef.value.hide();
		} else if (type === 'logisticsReview') {
			if (!e.remark) {
				ElMessageBox.alert('驳回理由不能为空', '提示', {
					type: 'warning',
				});
				return;
			}
			const res = await postLogisticsReview({
				ids,
				passFlag: 0, //  是否审核通过 0否，1是
				remark: e.remark,
			});
			if (res.code === 0) {
				// 判断是否有失败的记录
				if (res.data?.failCount > 0) {
					// 展示错误提示
					open({
						title: t('物流审核驳回失败'),
						data: res.data,
					});
				} else if (res.data?.failCount === 0) {
					useMessage().success('驳回成功');
				}
			}
			// 关闭对话框
			logisticsReviewRef.value.hide();
		} else if (type === 'materialReview') {
			if (!e.remark) {
				ElMessageBox.alert('驳回理由不能为空', '提示', {
					type: 'warning',
				});
				return;
			}
			let api =
				checkFieldUnique('transferTypes').value == 1
					? logisticsDirectorReview
					: postMaterialReview;
			const res = await api({
				ids,
				passFlag: 0, //  是否审核通过 0否，1是
				remark: e.remark,
			});
			if (res.code === 0) {
				// 判断是否有失败的记录
				if (res.data?.failCount > 0) {
					// 展示错误提示
					open({
						title: t('物流审核驳回失败'),
						data: res.data,
					});
				} else if (res.data?.failCount === 0) {
					useMessage().success('驳回成功');
				}
			}
			// 关闭对话框
			materialReviewRef.value.hide();
		} else if (type === 'logisticsDirectorReview') {
			if (!e.remark) {
				ElMessageBox.alert('驳回理由不能为空', '提示', {
					type: 'warning',
				});
				return;
			}
			const res = await postLogisticsDirectorReview({
				ids,

				passFlag: 0, //  是否审核通过 0否，1是
				remark: e.remark,
			});
			if (res.code === 0) {
				// 判断是否有失败的记录
				if (res.data?.failCount > 0) {
					// 展示错误提示
					open({
						title: t('物流总监审核驳回失败'),
						data: res.data,
					});
				} else if (res.data?.failCount === 0) {
					useMessage().success('驳回成功');
				}
			}
			// 关闭对话框
			logisticsDirectorReviewRef.value.hide();
		}
		// 清空选中行
		tableRef.value.clearSelection();
		getDataList();
	} catch (error: any) {
		if (error?.msg) {
			useMessage().error(error.msg);
		}
	}
};

// 页面初始化时处理URL参数
onMounted(() => {
	const transferInventoryNos = route.query.transferInventoryNos as string;
	if (transferInventoryNos) {
		if (transferInventoryNos.includes(',')) {
			// 逗号分隔的字符串，转换为数组
			state.queryForm.transferInventoryNos = transferInventoryNos
				.split(',')
				.map((item) => item.trim())
				.filter((item) => item);
		} else {
			// 单个值，包装成数组
			state.queryForm.transferInventoryNos = [transferInventoryNos];
		}
		getDataList();
	}
});
</script>

<style lang="scss" scoped>
.text-blue {
	color: #0089ef;
}
.el-dropdown-link {
	cursor: pointer;
	color: var(--el-color-primary);
	display: flex;
	align-items: center;
}
</style>
