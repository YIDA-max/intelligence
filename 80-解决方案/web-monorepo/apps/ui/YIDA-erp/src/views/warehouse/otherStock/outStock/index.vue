<script setup lang="ts">
import { BasicTableProps, useTable } from '/@/hooks/table';
import { useI18n } from 'vue-i18n';
import { defineAsyncComponent, ref, reactive, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useMessage } from '/@/hooks/message';
import { ElMessageBox } from 'element-plus';
import {
	getOtherOutboundPage,
	getOtherOutboundById,
	getOtherOutboundDetails,
	postOtherOutboundLogisticsAudit,
	postOtherOutboundFinancialAudit,
	postOtherOutboundDiscard,
	getOtherOutboundExport,
} from '/@/api/warehouse/otherStock/outStock/index';
import { getLegalEntitySelect } from '/@/api/admin/legalEntity/index';
import { useMultipleDicts } from '/@/hooks/multipleDicts';
import { deptTree } from '/@/api/admin/dept';
import { getWareHouseList } from '/@/api/materialFlow/track/index';
import { useResultDialog } from '/@/hooks/useResultDialog';
import { auth } from '/@/utils/authFunction';

const FormDialog = defineAsyncComponent(
	() => import('./components/form-dialog.vue')
);
const ToolBar = defineAsyncComponent(
	() => import('/@/components/ToolBar/tool-bar.vue')
);
const SelectDate = defineAsyncComponent(
	() => import('/@/components/TableFormModule/select-date.vue')
);
const SelectInput = defineAsyncComponent(
	() => import('/@/components/TableFormModule/select-input.vue')
);
const TreeSelectInputApi = defineAsyncComponent(
	() => import('/@/componentsApi/TreeSelectInputApi/index.vue')
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
// table的引用
const tableRef = ref();
//   初始化数据
const { dictMap } = useMultipleDicts(
	[
		{
			key: 'deptTree',
			fetchFn: deptTree,
			params: {
				deptName: '运营中心',
				showRootFlag: 0, // 是否显示根节点 1是展示 0不展示
			},
		}, // 部门树
		{
			key: 'entityList',
			fetchFn: getLegalEntitySelect,
		}, // 法人主体
		{
			key: 'warehouseListByType',
			fetchFn: getWareHouseList,
			params: {
				warehouseTypes: [1, 3], // 0-自营仓 1-三方仓
				status: 1,
			},
		}, // 仓库列表
	],
	{
		isAuto: true,
		tableRef,
	}
);
const { t } = useI18n();
const route = useRoute();

//  物流审核对话框的引用
const materialDialogRef = ref();

// 财务审核对话框的引用
const financialDialogRef = ref();

// 高级搜索布局的引用
const AdvancedSearchStyleRef = ref();

// 表单对话框的引用
const formDialogRef = ref();

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

// 日志对话框是否可见
const logDialogVisible = ref(false);
// 审核备注
const remark = ref('');
const { open } = useResultDialog();

const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {
		// status: 1,
		// skuStatus: 1,
	},
	pageList: getOtherOutboundPage,
	loading: false,
	dataList: [],
	ascs: [],
	descs: ['create_time'],
	isAutoCollapseExpand: true,
});

//  table hook
const {
	getDataList,
	currentChangeHandle,
	sizeChangeHandle,
	sortChangeHandle,
	getTableData,
	setTableData,
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
		// 先收起全部展开行
		if (type === 'add') {
			formDialogRef.value.show({
				title: t('新增其他出库单'),
				visibleType: 'add',
				currentRow: {},
			});
		} else if (type === 'edit') {
			// 如果状态不是待提交或者审核驳回就不能修改
			if (row.status !== 4) {
				useMessage().error(t('只有待提交和审核驳回状态的需求才能编辑'));
				return;
			}
			const res = await getOtherOutboundById({ id: row.id });
			if (res.code === 0) {
				formDialogRef.value.show({
					title: t('编辑其他出库单'),
					visibleType: 'edit',
					currentRow: res.data,
				});
			}
		} else if (type === 'rejected') {
			const ids = tableRef.value
				.getSelectionRows()
				?.map((item: any) => item.id);
			if (!ids || ids.length === 0) {
				useMessage().error(t('请至少选择一条数据'));
				return;
			}
			ElMessageBox.confirm(
				t(`是否确认作废选中的${ids.length}条数据？`),
				t('提示'),
				{
					confirmButtonText: t('确定'),
					cancelButtonText: t('取消'),
					type: 'warning',
				}
			).then(async () => {
				try {
					const res = await postOtherOutboundDiscard({ ids });
					if (res.code === 0) {
						// 判断是否有失败的记录
						if (res?.data?.failCount > 0) {
							// 展示错误提示
							open({
								title: t('作废失败'),
								data: res.data,
							});
						} else if (res?.data?.failCount === 0) {
							useMessage().success('作废成功');
						}
					}
					// 清空选中行
					tableRef.value.clearSelection();
					// 刷新数据
					getDataList();
				} catch (error: any) {
					ElMessageBox.confirm(error?.msg || t('操作失败'), t('提示'), {
						type: 'error',
					});
				}
			});
		} else if (type === 'log') {
			logDialogVisible.value = true;
			currentRow.value = row;
		}
	} catch (error: any) {
		useMessage().error(error?.msg || t('错误'));
	}
};

// 打开审核对话框
const openReview = async (type: string) => {
	// 先收起全部展开行
	// 清空备注
	remark.value = '';
	// 获取到所有选中的行
	selectedRows.value = [];
	const ids = tableRef.value.getSelectionRows()?.map((item: any) => item.id);
	if (!ids || ids.length === 0) {
		useMessage().error(t('请至少选择一条数据'));
		return;
	}
	try {
		if (type === 'material') {
			// 检查所有选中项的状态是否都是1 1-待物流审核
			// const allStatusOne = tableRef.value.getSelectionRows()?.every((item: any) => item.status === 1);
			// if (!allStatusOne) {
			// 	useMessage().error(t('只有待物流审核的需求才能进行物流审核'));
			// 	return;
			// }
			materialDialogRef.value.show();
		} else if (type === 'financial') {
			// 检查所有选中项的状态是否都是2 2-待财务审核
			// const allStatusOne = tableRef.value.getSelectionRows()?.every((item: any) => item.status === 2);
			// if (!allStatusOne) {
			// 	useMessage().error(t('只有待财务审核的需求才能进行财务审核'));
			// 	return;
			// }
			financialDialogRef.value.show();
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
		await getOtherOutboundExport({
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
		if (type === 'material') {
			// 物流审核
			const res = await postOtherOutboundLogisticsAudit({
				ids,
				passFlag: 1, //  是否审核通过 0否，1是
				remark: e.remark,
			});
			if (res.code === 0) {
				// 判断是否有失败的记录
				if (res?.data?.failCount > 0) {
					// 展示错误提示
					open({
						title: t('物流审核失败'),
						data: res.data,
					});
				} else if (res?.data?.failCount === 0) {
					useMessage().success('审核成功');
				}
			}
			// 关闭对话框
			materialDialogRef.value.hide();
		} else if (type === 'financial') {
			// 财务审核
			const res = await postOtherOutboundFinancialAudit({
				ids,
				passFlag: 1, //  是否审核通过 0否，1是
				remark: e.remark,
			});
			if (res.code === 0) {
				// 判断是否有失败的记录
				if (res?.data?.failCount > 0) {
					// 展示错误提示
					open({
						title: t('财务审核失败'),
						data: res.data,
					});
				} else if (res?.data?.failCount === 0) {
					useMessage().success('审核成功');
				}
			}
			// 关闭对话框
			financialDialogRef.value.hide();
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

// 取消/驳回操作
const handleCancel = async (type: string, e?: any) => {
	// 获取到所有选中的行
	const ids = tableRef.value.getSelectionRows()?.map((item: any) => item.id);
	try {
		if (type === 'material') {
			// 物流审核驳回
			if (!e.remark) {
				ElMessageBox.alert('驳回理由不能为空', '提示', {
					type: 'warning',
				});
				return;
			}
			const res = await postOtherOutboundLogisticsAudit({
				ids,
				passFlag: 0, //  是否审核通过 0否，1是
				remark: e.remark,
			});
			if (res.code === 0) {
				// 判断是否有失败的记录
				if (res?.data?.failCount > 0) {
					// 展示错误提示
					open({
						title: t('物流审核驳回失败'),
						data: res.data,
					});
				} else if (res?.data?.failCount === 0) {
					useMessage().success('驳回成功');
				}
			}
			// 关闭对话框
			materialDialogRef.value.hide();
		} else if (type === 'financial') {
			// 财务审核驳回
			if (!e.remark) {
				ElMessageBox.alert('驳回理由不能为空', '提示', {
					type: 'warning',
				});
				return;
			}
			const res = await postOtherOutboundFinancialAudit({
				ids,
				passFlag: 0, //  是否审核通过 0否，1是
				remark: e.remark,
			});
			if (res.code === 0) {
				// 判断是否有失败的记录
				if (res?.data?.failCount > 0) {
					// 展示错误提示
					open({
						title: t('财务审核驳回失败'),
						data: res.data,
					});
				} else if (res?.data?.failCount === 0) {
					useMessage().success('驳回成功');
				}
			}
			// 关闭对话框
			financialDialogRef.value.hide();
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
	const demandNos = route.query.demandNos as string;
	if (demandNos) {
		if (demandNos.includes(',')) {
			// 逗号分隔的字符串，转换为数组
			state.queryForm.demandNos = demandNos
				.split(',')
				.map((item) => item.trim())
				.filter((item) => item);
		} else {
			// 单个值，包装成数组
			state.queryForm.demandNos = [demandNos];
		}
		getDataList();
	}
});
// 点击行展开
const clickRowHandle = async (row: any) => {
	if (row.isExpand) {
		row.isExpand = !row.isExpand;
	} else {
		// 初次展开设为true
		row.isExpand = true;
	}
	if (!row.isExpand) return;
	if (!row.skuList?.length) {
		const data = await getOtherOutboundDetails({
			outboundNo: row.outboundNo,
		});
		const list = getTableData();

		list?.map((item) => {
			if (item.outboundNo === row.outboundNo) {
				item.skuList = data.data;
			}
			// item.skuList?.forEach((sku: any) => {});
		});
		setTableData(list || []);
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
										:settings="{
											selectStyle: {
												width: '150px',
											},
										}"
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
												label: '其他出库单号',
												value: 'outboundNos',
											},
										]"
										:settings="{
											selectStyle: {
												width: '150px',
											},
										}"
										:getDataList="getDataList"
									/>
								</div>
							</el-form-item>
							<el-form-item>
								<el-select
									v-model="state.queryForm.status"
									placeholder="状态"
									clearable
									style="width: 200px"
									@change="getDataList"
								>
									<!-- 状态：1-待物流审核, 2-待财务审核, 3-已出库, 4-审核驳回, 5-废弃 -->
									<el-option
										v-for="item in [
											{ label: '待物流审核', value: 1 },
											{ label: '待财务审核', value: 2 },
											{ label: '已出库', value: 3 },
											{ label: '审核驳回', value: 4 },
											{ label: '作废', value: 5 },
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
									componentType="dicts"
									multiple
									:settings="{
										text: '出库类型',
										getTreeDataParams: 'other_out_type',
										searchFn: getDataList,
										code: 'outboundTypes',
										width: '200px',
									}"
								/>
							</el-form-item>
							<el-form-item>
								<TreeSelectInputApi
									v-model:queryForm="state.queryForm"
									componentType="warehouseQianyi"
									multiple
									:settings="{
										text: '仓库',
										getTreeDataParams: { warehouseType: [1, 3] },
										searchFn: getDataList,
										code: 'warehouseCodes',
										width: '200px',
									}"
								/>
							</el-form-item>
							<el-form-item>
								<TreeSelectInputApi
									v-model:queryForm="state.queryForm"
									componentType="userList"
									:settings="{
										text: '创建人',
										getTreeDataParams: { lockFlag: 0 },
										searchFn: getDataList,
										code: 'createIds',
										width: '220px',
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
												label: '创建时间',
												value: 'createTime',
												isAddHMS: true,
												dateStart: 'createTimeStart',
												dateEnd: 'createTimeEnd',
												defaultMonthsAgo: 1,
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
							</el-form-item>
						</template>
					</AdvancedSearchStyle>
				</el-form>
			</el-row>
			<el-row>
				<ToolBar
					@handleRefresh="getDataList"
					@handleExport="handleExport"
					:is-show-export="auth('outStock-export')"
				>
					<template #left-tool>
						<el-button
							class="ml10"
							type="primary"
							@click="openDialog('add')"
							v-auth="'outStock-add'"
						>
							{{ $t('新增其他出库单') }}</el-button
						>
						<el-button
							class="ml10"
							@click="openReview('material')"
							v-auth="'outStock-material'"
						>
							{{ $t('物流审核') }}</el-button
						>
						<el-button
							class="ml10"
							@click="openReview('financial')"
							v-auth="'outStock-financial'"
						>
							{{ $t('财务审核') }}</el-button
						>
						<el-button
							class="ml10"
							@click="openDialog('rejected')"
							v-auth="'outStock-rejected'"
						>
							{{ $t('作废') }}</el-button
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
				@expand-change="clickRowHandle"
				native-scrollbar
			>
				<el-table-column
					type="expand"
					className="expand-column "
					width="50"
					fixed="left"
				>
					<template #default="{ row: expandedRow }">
						<div>
							<el-table
								:data="expandedRow.skuList || []"
								height="100%"
								style="width: 100%"
								border
								native-scrollbar
							>
								<el-table-column width="100"> </el-table-column>
								<el-table-column :label="$t('图片')" min-width="150">
									<template #default="{ row }">
										<MrImg :src="row.imgUrl" />
									</template>
								</el-table-column>
								<el-table-column
									prop="skuCode"
									:label="$t('SKU/产品名称')"
									show-overflow-tooltip
									min-width="250"
								>
									<template #default="{ row }">
										<div
											class="flex flex-col items-start justify-center w-full"
										>
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
									min-width="150"
									show-overflow-tooltip
								>
									<template #default="{ row }">
										{{ row.countryCode || '---' }}
									</template>
								</el-table-column>
								<el-table-column
									:label="t('平台渠道')"
									min-width="150"
									show-overflow-tooltip
								>
									<template #default="{ row }">
										{{ row.platformChannel || '---' }}
									</template>
								</el-table-column>
								<el-table-column
									:label="t('MSKU')"
									min-width="150"
									show-overflow-tooltip
								>
									<template #default="{ row }">
										{{ row.mskuCode || '---' }}
									</template>
								</el-table-column>
								<el-table-column
									:label="t('部门&小组')"
									min-width="150"
									show-overflow-tooltip
								>
									<template #default="{ row }">
										{{ row.deptName || '---' }}
									</template>
								</el-table-column>
								<el-table-column
									:label="t('出库数量')"
									min-width="150"
									show-overflow-tooltip
								>
									<template #default="{ row }">
										{{ row.quantity || '---' }}
									</template>
								</el-table-column>
								<el-table-column
									:label="t('备注')"
									min-width="150"
									show-overflow-tooltip
								>
									<template #default="{ row }">
										{{ row.remark || '---' }}
									</template>
								</el-table-column>
							</el-table>
						</div>
					</template>
				</el-table-column>
				<el-table-column
					align="center"
					type="selection"
					reserve-selection
					width="50"
					fixed="left"
				/>
				<el-table-column
					:label="t('其他出库单')"
					prop="outboundNo"
					show-overflow-tooltip
					min-width="200"
				>
					<template #default="{ row }">
						{{ row.outboundNo ? row.outboundNo : '---' }}
					</template>
				</el-table-column>
				<el-table-column
					prop="status"
					:label="t('状态')"
					show-overflow-tooltip
					min-width="100"
				>
					<template #default="{ row }">
						<!-- {{
							row.status === 1
								? '待物流审核'
								: row.status === 2
								? '待财务审核'
								: row.status === 3
								? '已出库'
								: row.status === 4
								? '审核驳回'
								: row.status === 5
								? '作废'
								: '---'
						}} -->
						{{ row.statusText || '---' }}
					</template>
				</el-table-column>
				<el-table-column
					prop="warehouseCode"
					:label="t('仓库')"
					show-overflow-tooltip
					min-width="100"
				>
					<template #default="{ row }">
						{{ row.warehouseName || '---' }}
					</template>
				</el-table-column>
				<el-table-column
					prop="outboundTypeText"
					:label="t('出库类型')"
					show-overflow-tooltip
					min-width="100"
				>
					<template #default="{ row }">
						{{ row.outboundTypeText || '---' }}
					</template>
				</el-table-column>
				<el-table-column
					prop="quantity"
					:label="t('出库数量')"
					show-overflow-tooltip
					min-width="100"
				>
					<template #default="{ row }"> {{ row.quantity || '---' }} </template>
				</el-table-column>
				<el-table-column
					prop="remark"
					:label="t('备注')"
					show-overflow-tooltip
					min-width="200"
				>
					<template #default="{ row }"> {{ row.remark || '---' }} </template>
				</el-table-column>
				<el-table-column
					prop="outboundTime"
					:label="t('出库时间')"
					show-overflow-tooltip
					min-width="100"
				>
					<template #default="{ row }">
						{{ row.outboundTime || '---' }}
					</template>
				</el-table-column>
				<el-table-column
					prop="createName"
					:label="t('创建人')"
					show-overflow-tooltip
					min-width="100"
				/>
				<el-table-column
					prop="createTime"
					:label="t('创建时间')"
					show-overflow-tooltip
					min-width="100"
				/>
				<el-table-column :label="$t('common.action')" fixed="right" width="120">
					<template #default="{ row }">
						<div class="flex items-center">
							<!-- 只有待审核和审核驳回 -->
							<el-button
								text
								type="primary"
								class="mr20"
								@click="openDialog('edit', row)"
								v-if="row.status === 4"
								v-auth="'outStock-edit'"
								>{{ $t('编辑') }}
							</el-button>
							<el-button
								text
								type="primary"
								class="mr20"
								@click="openDialog('log', row)"
								v-auth="'outStock-log'"
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
			ref="formDialogRef"
			:dictMap="dictMap"
			@getDataList="getDataList"
		></FormDialog>
		<!-- 日志 -->
		<LogDialog
			v-model="logDialogVisible"
			:id="currentRow.id"
			:biz-type="['OTHER_OUT']"
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
		<!-- 财务审核 -->
		<InputDialog
			title="财务审核"
			ref="financialDialogRef"
			message=""
			:show-icon="true"
			icon-type="info"
			input-prop="remark"
			confirm-button-text="确认"
			confirm-button-type="primary"
			cancelButtonText="驳回"
			input-placeholder="驳回,必填"
			inputType="textarea"
			@cancel="
				(e) => {
					handleCancel('financial', e);
				}
			"
			@confirm="
				(e) => {
					handleConfirm('financial', e);
				}
			"
		>
		</InputDialog>
		<!-- 物流审核 -->
		<InputDialog
			title="物流审核"
			ref="materialDialogRef"
			message=""
			:show-icon="true"
			icon-type="info"
			input-prop="remark"
			confirm-button-text="确认"
			confirm-button-type="primary"
			cancelButtonText="驳回"
			input-placeholder="驳回,必填"
			inputType="textarea"
			@cancel="
				(e) => {
					handleCancel('material', e);
				}
			"
			@confirm="
				(e) => {
					handleConfirm('material', e);
				}
			"
		>
		</InputDialog>
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
