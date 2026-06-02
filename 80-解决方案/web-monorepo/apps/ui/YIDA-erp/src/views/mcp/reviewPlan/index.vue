<script setup lang="ts">
import { BasicTableProps, useTable } from '/@/hooks/table';
import { useI18n } from 'vue-i18n';
import { defineAsyncComponent, ref, reactive } from 'vue';
import { useMessage } from '/@/hooks/message';
import { ElMessageBox } from 'element-plus';
import { getDicts } from '/@/api/admin/dict';
import { deptTree } from '/@/api/admin/dept';
import {
	getQueryCollectionPlanCancel,
	postMaterialReview,
	postPurchaseReview,
} from '/@/api/mcp/reviewPlan/index';
import { getUserListByCondition } from '/@/api/admin/user';
import { useMultipleDicts } from '/@/hooks/multipleDicts';
import { useResultDialog } from '/@/hooks/useResultDialog';

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
			key: 'productManageId',
			fetchFn: getUserListByCondition,
			params: { lockFlag: 0 },
		}, // 人员列表
		{
			key: 'collection_plan_cancel',
			fetchFn: getDicts,
			params: 'collection_plan_cancel',
		}, // 需求计划的审批状态
		{
			key: 'platformChannel',
			fetchFn: getDicts,
			params: 'platform_channel',
		}, // 平台 渠道
		{
			key: 'deptTree',
			fetchFn: deptTree,
			params: {
				deptName: '运营中心',
				showRootFlag: 0, // 是否显示根节点 1是展示 0不展示
			},
		}, // 部门树
	],
	{
		isAuto: true,
		tableRef,
	}
);
const { t } = useI18n();

// 物控审核对话框的引用
const materialReviewRef = ref();
// 采购审核对话框的引用
const purchaseReviewRef = ref();

// 高级搜索布局的引用
const AdvancedSearchStyleRef = ref();

// 搜索变量
const queryRef = ref();

// 是否显示搜索
const showSearch = ref(true);
// 当前点击的行
const currentRow = ref({
	id: '',
});
// 当前选中的行数据
const selectedRows = ref([]);

// 日志对话框是否可见
const logDialogVisible = ref(false);

const { open } = useResultDialog();

const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {
		// status: 1,
		// skuStatus: 1,
	},
	pageList: getQueryCollectionPlanCancel,
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
		if (type === 'log') {
			logDialogVisible.value = true;
			currentRow.value = row;
		}
	} catch (error: any) {
		useMessage().error(error?.msg || t('错误'));
	}
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
	try {
		if (type === 'materialReview') {
			const allStatusOne = tableRef.value
				.getSelectionRows()
				?.every((item: any) => item.status === 1);
			if (!allStatusOne) {
				useMessage().warning(t('只有状态为待物控审核的数据才能进行物控审核'));
				return;
			}
			materialReviewRef.value.show();
		} else if (type === 'purchaseReview') {
			const allStatusOne = tableRef.value
				.getSelectionRows()
				?.every((item: any) => item.status === 2);
			if (!allStatusOne) {
				useMessage().warning(t('只有状态为待采购审核的数据才能进行采购审核'));
				return;
			}
			purchaseReviewRef.value.show();
		}
	} catch (error: any) {
		if (error?.msg) {
			useMessage().error(error.msg);
		}
	}
};

// 确认操作
const handleConfirm = async (type: string, e?: any) => {
	// 获取到所有选中的行
	const ids = tableRef.value.getSelectionRows()?.map((item: any) => item.id);
	try {
		if (type === 'materialReview') {
			const res = await postMaterialReview({
				ids,
				passFlag: 1, //  是否审核通过 0否，1是
				checkRemark: e.remark,
				type: 1, // 1.物控审核 2：采购审核
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
			materialReviewRef.value.hide();
		} else if (type === 'purchaseReview') {
			const res = await postPurchaseReview({
				ids,
				passFlag: 1, //  是否审核通过 0否，1是
				checkRemark: e.remark,
				type: 2, // 1.物控审核 2：采购审核
			});
			if (res.code === 0) {
				// 判断是否有失败的记录
				if (res.data?.failCount > 0) {
					// 展示错误提示
					open({
						title: t('采购审核失败'),
						data: res.data,
					});
				} else if (res.data?.failCount === 0) {
					useMessage().success('审核成功');
				}
			}
			// 关闭对话框
			purchaseReviewRef.value.hide();
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
		if (type === 'materialReview') {
			if (!e.remark) {
				ElMessageBox.alert('驳回理由不能为空', '提示', {
					type: 'warning',
				});
				return;
			}
			const res = await postMaterialReview({
				ids,
				passFlag: 0, //  是否审核通过 0否，1是
				checkRemark: e.remark,
				type: 1, // 1.物控审核 2：采购审核
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
			materialReviewRef.value.hide();
		} else if (type === 'purchaseReview') {
			if (!e.remark) {
				ElMessageBox.alert('驳回理由不能为空', '提示', {
					type: 'warning',
				});
				return;
			}
			const res = await postPurchaseReview({
				ids,
				passFlag: 0, //  是否审核通过 0否，1是
				checkRemark: e.remark,
				type: 2, // 1.物控审核 2：采购审核
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
			purchaseReviewRef.value.hide();
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
</script>

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
												label: '提货单号',
												value: 'pickupOrderNos',
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
												label: 'SKU',
												value: 'skuCodes',
											},
										]"
										:getDataList="getDataList"
									/>
								</div>
							</el-form-item>
							<el-form-item>
								<TreeSelectInputApi
									componentType="dicts"
									code="platformChannelCodes"
									v-model:queryForm="state.queryForm"
									:searchFn="getDataList"
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
									code="statuses"
									v-model:queryForm="state.queryForm"
									:searchFn="getDataList"
									:settings="{
										text: '审核状态',
										width: '220px',
										getTreeDataParams: 'collection_plan_cancel',
									}"
								/>
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
												width: '100px',
											},
											dateStyle: {
												width: '120px',
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
							<el-form-item>
								<TreeSelectInputApi
									componentType="userList"
									code="purchaseUserIds"
									v-model:queryForm="state.queryForm"
									:searchFn="getDataList"
									:settings="{
										text: '采购员',
										width: '220px',
										getTreeDataParams: { lockFlag: 0 },
									}"
								/>
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
				<ToolBar @handleRefresh="getDataList" :is-show-export="false">
					<template #left-tool>
						<el-button
							class="ml10"
							@click="openReview('materialReview')"
							v-auth="'reviewPlan_materialReview'"
						>
							{{ $t('物控审核') }}</el-button
						>
						<el-button
							class="ml10"
							@click="openReview('purchaseReview')"
							v-auth="'reviewPlan_purchaseReview'"
						>
							{{ $t('采购审核') }}</el-button
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
				<el-table-column type="selection" width="55" />
				<el-table-column
					:label="t('编号')"
					min-width="150"
					show-overflow-tooltip
				>
					<template #default="{ row }">
						{{ row.cancelNo || '---' }}
					</template>
				</el-table-column>
				<el-table-column
					:label="t('审核状态')"
					min-width="150"
					show-overflow-tooltip
				>
					<template #default="{ row }">
						{{ row.statusText || '---' }}
					</template>
				</el-table-column>
				<el-table-column
					:label="t('取消原因')"
					min-width="150"
					show-overflow-tooltip
				>
					<template #default="{ row }">
						{{ row.reason || '---' }}
					</template>
				</el-table-column>
				<el-table-column
					:label="t('取消数量')"
					min-width="150"
					show-overflow-tooltip
				>
					<template #default="{ row }">
						{{ row.num || '---' }}
					</template>
				</el-table-column>
				<el-table-column
					:label="t('提货单号')"
					min-width="150"
					show-overflow-tooltip
				>
					<template #default="{ row }">
						{{ row.pickupOrderNo || '---' }}
					</template>
				</el-table-column>
				<!-- <el-table-column
					:label="t('提货单状态')"
					min-width="150"
					show-overflow-tooltip
				>
					<template #default="{ row }">
						{{ row.pickupOrderStatusText || '---' }}
					</template>
				</el-table-column> -->
				<el-table-column
					prop="skuCode"
					:label="$t('SKU/产品名称')"
					show-overflow-tooltip
					min-width="150"
				>
					<template #default="{ row }">
						<div class="flex flex-col items-start justify-center w-full">
							<div
								class="max-w-full overflow-hidden whitespace-nowrap text-ellipsis"
							>
								{{ row.skuCode }}
							</div>
							<div
								class="max-w-full overflow-hidden whitespace-nowrap text-ellipsis"
							>
								{{ row.skuName }}
							</div>
						</div>
					</template>
				</el-table-column>
				<el-table-column
					:label="t('国家')"
					min-width="100"
					show-overflow-tooltip
				>
					<template #default="{ row }">
						{{ row.countryCode || '---' }}
					</template>
				</el-table-column>
				<el-table-column
					:label="t('平台渠道')"
					min-width="100"
					show-overflow-tooltip
				>
					<template #default="{ row }">
						{{ row.platformChannelCode || '---' }}
					</template>
				</el-table-column>

				<el-table-column
					:label="t('MSKU')"
					min-width="100"
					show-overflow-tooltip
				>
					<template #default="{ row }">
						{{ row.mskuCode || '---' }}
					</template>
				</el-table-column>
				<el-table-column
					:label="t('部门')"
					min-width="100"
					show-overflow-tooltip
				>
					<template #default="{ row }">
						{{ row.parentDeptText || '---' }}
					</template>
				</el-table-column>
				<el-table-column
					:label="t('运营小组')"
					min-width="100"
					show-overflow-tooltip
				>
					<template #default="{ row }">
						{{ row.deptText || '---' }}
					</template>
				</el-table-column>
				<el-table-column
					:label="t('采购单')"
					min-width="100"
					show-overflow-tooltip
				>
					<template #default="{ row }">
						{{ row.purchaseOrderNo || '---' }}
					</template>
				</el-table-column>
				<el-table-column
					:label="t('采购员')"
					min-width="100"
					show-overflow-tooltip
				>
					<template #default="{ row }">
						{{ row.purchaseUserName || '---' }}
					</template>
				</el-table-column>
				<el-table-column
					:label="t('创建人')"
					min-width="100"
					show-overflow-tooltip
				>
					<template #default="{ row }">
						{{ row.createName || '---' }}
					</template>
				</el-table-column>
				<el-table-column
					:label="t('创建时间')"
					min-width="100"
					show-overflow-tooltip
				>
					<template #default="{ row }">
						{{ row.createTime || '---' }}
					</template>
				</el-table-column>

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
			:biz-type="['COLLECTION_PLAN_CANCEL']"
			:showSearchForm="false"
			:showToolBar="false"
			@closeDialog="
				() => {
					logDialogVisible = false;
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
		<!-- 采购审核 -->
		<InputDialog
			ref="purchaseReviewRef"
			title="采购审核"
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
				handleCancel('purchaseReview', e);
			}"
			@confirm="
				(e:any) => {
					handleConfirm('purchaseReview', e);
				}
			"
		/>
	</div>
</template>

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
