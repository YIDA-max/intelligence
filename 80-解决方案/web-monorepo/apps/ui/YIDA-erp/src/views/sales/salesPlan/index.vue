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
					<el-form-item>
						<div class="flex item-center">
							<SelectInput
								v-model:queryForm="state.queryForm"
								:searchTypes="[
									{
										label: '文件名称',
										value: 'fileNames',
									},
								]"
								:getDataList="getDataList"
							/>
						</div>
					</el-form-item>
					<el-form-item>
						<el-select
							v-model="state.queryForm.versionNum"
							placeholder="请选择版本号"
							clearable
							multiple
							collapse-tags
							:max-collapse-tags="1"
							filterable
							@change="getDataList"
						>
							<el-option
								v-for="item in [
									{ label: 'V1', value: 'V1' },
									{ label: 'V2', value: 'V2' },
								]"
								:key="item.value"
								:label="item.label"
								:value="item.value"
							/>
						</el-select>
					</el-form-item>
					<!-- <el-form-item>
						<el-date-picker
							v-model="month"
							type="monthrange"
							range-separator="To"
							start-placeholder="开始月份"
							end-placeholder="结束月份"
							placeholder="选择月份"
							value-format="YYYY-MM-DD"
							@change="changeMonth"
						/>
					</el-form-item>
					<el-form-item>
						<el-date-picker
							v-model="dateTime"
							type="daterange"
							placeholder="归档日期"
							start-placeholder="归档开始日期"
							end-placeholder="归档结束日期"
							value-format="YYYY-MM-DD"
							@change="changeDate"
						/>
					</el-form-item> -->
					<el-form-item>
						<el-button @click="getDataList" type="primary">{{
							$t('搜索')
						}}</el-button>
						<el-button @click="resetQuery" type="info" plain>{{
							$t('common.resetBtn')
						}}</el-button>
					</el-form-item>
				</el-form>
			</el-row>

			<BaseTable ref="baseTableRef" :register="register">
				<template #left-tool>
					<el-button
						class="ml10"
						@click="dialogForm()"
						v-auth="'sales_addPlan'"
					>
						{{ $t('新增') }}
					</el-button>
					<!-- <el-button class="ml10" @click="openImportPlan('add')" v-auth="'sales_import_plan'"> {{ $t('导入计划') }}</el-button> -->
					<el-button
						class="ml10"
						@click="openDialog('submitApprove')"
						v-auth="'sales_submit_approve'"
					>
						{{ $t('提交审批') }}
					</el-button>
					<el-button
						class="ml10"
						@click="openApproveDialog(2, '销售经理审批')"
						v-auth="'sales_manager'"
					>
						{{ $t('销售经理审批') }}
					</el-button>
					<el-button
						class="ml10"
						@click="openApproveDialog(3, '计划经理审批')"
						v-auth="'plan_manager'"
					>
						{{ $t('计划经理审批') }}
					</el-button>
					<el-button
						class="ml10"
						@click="openDialog('save')"
						v-auth="'sales_save'"
					>
						{{ $t('归档保存') }}
					</el-button>
					<el-button
						class="ml10"
						@click="openDialog('withdraw')"
						v-auth="'sales_withdraw'"
					>
						{{ $t('撤回审批') }}
					</el-button>
				</template>

				<!-- 文件名称列（可点击） -->
				<template #fileName="{ row }">
					<span @click="openDetailDialog(row.id)" style="cursor: pointer">
						{{ row.fileName }}
					</span>
				</template>

				<!-- 操作列 -->
				<template #action="{ row }">
					<div class="flex items-center">
						<el-button
							text
							type="primary"
							class="mr20"
							v-if="row.status == 0"
							v-auth="'sales_update'"
							@click="openDialog('edit', row.id)"
							>{{ $t('更新') }}</el-button
						>
						<el-button
							text
							type="primary"
							class="mr20"
							@click="exportData(row.url)"
							>{{ $t('查看') }}</el-button
						>
						<el-button
							text
							type="danger"
							class="mr20"
							v-auth="'sales_delete'"
							@click="openDialog('delete', row.id)"
							>{{ $t('删除') }}</el-button
						>
					</div>
				</template>
			</BaseTable>
		</div>

		<!-- 审核 -->
		<input-dialog
			ref="approveDialog"
			:title="approveDialogTitle"
			:show-icon="true"
			icon-type="info"
			confirm-button-text="通过"
			confirm-button-type="primary"
			input-prop="approveRemark"
			input-placeholder="审批意见"
			cancelButtonText="拒绝"
			@cancel="(e) => handleApprove(approveType, false, e)"
			@confirm="(e) => handleApprove(approveType, true, e)"
		/>
		<ShowResultDialog ref="showResultDialog" />
		<!-- 导入计划弹窗 -->
		<import-plan
			ref="importPlanRef"
			:isShowMonth="true"
			@confirm="(val) => confirmInfo(val, salesPlanImport, importPlanRef)"
		/>
		<!-- 导入信息弹窗 -->
		<ImportDialog
			ref="importInfoRef"
			title="导入基础信息"
			templateUrl="/files/import-template/sku基础信息导入.xlsx"
			excelUploadApi="/mcp/rsf/skuBaseInfo/import"
			@refreshDataList="getDataList"
		/>
		<FileInfo ref="fileInfoRef" :id="currentRow.id" />
		<ImportDialog
			ref="importDialogRef"
			title="导入历史实际销量"
			templateUrl="/files/import-template/sku历史销量导入.xlsx"
			excelUploadApi="/mcp/rsf/history-sales/import"
			@refreshDataList="getDataList"
		/>
		<addDialog
			ref="dialogRef"
			@refreshDataList="getDataList"
			:title="addDialogTitle"
			@submit="submitAdd"
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
import { defineAsyncComponent, ref, reactive } from 'vue';
import { ElMessageBox } from 'element-plus';
import { useMessage } from '/@/hooks/message';
import {
	salesPlanImport,
	salesPlanList,
	approvePlan,
	deletePlan,
	addSalesPlan,
	updateSalesPlan,
} from '/@/api/sales/index';
import { exportReturnPage } from '/@/api/purchase/return/index';

import { useResultDialog } from '/@/hooks/useResultDialog';
const ShowResultDialog = defineAsyncComponent(
	() => import('/@/components/fileUpload/showResult.vue')
);
const SelectInput = defineAsyncComponent(
	() => import('/@/components/TableFormModule/select-input.vue')
);
const InputDialog = defineAsyncComponent(
	() => import('/@/components/ConfirmDialog/InputDialog.vue')
);
const importPlan = defineAsyncComponent(
	() => import('./components/importPlan.vue')
);
const FileInfo = defineAsyncComponent(
	() => import('./components/fileInfo.vue')
);
const ImportDialog = defineAsyncComponent(
	() => import('/@/components/fileUpload/importDialog.vue')
);
const addDialog = defineAsyncComponent(() => import('./components/add.vue'));

// 显示结果对话框
const showResultDialog = ref();
const { t } = useI18n();
const { open } = useResultDialog();

const baseTableRef = ref();
const queryRef = ref();
// 是否显示搜索
const showSearch = ref(true);
const currentRow = ref({ id: '' });
const selectedRows = ref<any[]>([]);

const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {},
	pageList: salesPlanList,
	columns,
	toolBarConfig: {
		handleRefresh: () => getDataList(),
		handleExport: () => handleExport(),
		isShowExport: false,
		settingKey: 'sales_plan',
	},
});

const { register, getDataList } = useTable(state, baseTableRef);

// 同步选中行
const syncSelectedRows = () => {
	selectedRows.value = register.safeCallTableMethod('getCheckboxRecords') || [];
};

const resetQuery = () => {
	state.queryForm = {
		current: 1,
		size: 10,
	};
	getDataList();
};

// const month = ref([]);
// const changeMonth = (val: any) => {
// 	state.queryForm.startTime = val[0].slice(0, 7);
// 	state.queryForm.endTime = val[1].slice(0, 7);
// };

// const dateTime = ref([]);
// const changeDate = (val: any) => {
// 	state.queryForm.startArchiveDate = val[0];
// 	state.queryForm.endArchiveDate = val[1];
// };
// 导入计划
const importPlanRef = ref();
// 导入信息
const importInfoRef = ref();
// 信息详情
const fileInfoRef = ref();
// 导入实际销量
const importDialogRef = ref();

// 导入计划弹窗
// const openImportPlan = (type: string, row?: any) => {
// 	importPlanRef.value.handleOpen(type, row);
// };

// 新增编辑弹窗
const dialogRef = ref();
const addDialogTitle = ref('新增');
// 新增弹窗
const dialogForm = () => {
	dialogRef.value.handleOpen();
};

// 保存新增数据
const submitAdd = async (e: any) => {
	try {
		const res = await addSalesPlan(e);
		if (res.code === 0) {
			if (res.data?.failCount > 0) {
				open({ title: t('新增失败'), data: res.data });
			} else {
				useMessage().success(res.msg || '新增成功');
				dialogRef.value.handleClose();
			}
		}
		getDataList();
	} catch (err) {
		useMessage().error('新增失败');
	} finally {
		if (dialogRef.value) {
			dialogRef.value.submitLoading = false;
		}
	}
};
// 打开处理弹窗
const openDialog = async (type: string, row?: any) => {
	if (type === 'importInfo') {
		// 打开导入信息弹窗
		importInfoRef.value.show();
	} else if (type === 'submitApprove') {
		// 提交审批
		syncSelectedRows();
		if (selectedRows.value.length === 0) {
			useMessage().warning('请至少选择一条数据');
			return;
		}
		if (!selectedRows.value.every((item: any) => item.status == '0')) {
			useMessage().warning(t('只有草稿状态的计划可以提交审批'));
			return;
		}
		ElMessageBox.confirm(t('是否确认提交审批？'), t('确认审批'), {
			confirmButtonText: t('确定'),
			cancelButtonText: t('取消'),
			type: 'warning',
		}).then(async () => {
			try {
				state.loading = true;
				const res = await approvePlan({
					id: selectedRows.value.map((item: any) => item.id),
					approveType: 1, // 审批类型
					approveResult: 1, // 审核结果
				});
				if (res.code === 0) {
					if (res.data?.failCount > 0) {
						open({ title: t('提交失败'), data: res.data });
					} else {
						useMessage().success('提交成功');
					}
				}
				register.safeCallTableMethod('clearCheckboxRow');
				getDataList();
			} catch (error: any) {
				useMessage().error(error.msg || '提交失败');
			} finally {
				state.loading = false;
			}
		});
	} else if (type === 'save') {
		// 确认归档
		syncSelectedRows();
		if (selectedRows.value.length === 0) {
			useMessage().warning('请至少选择一条数据');
			return;
		}
		if (!selectedRows.value.every((item: any) => item.status == '3')) {
			useMessage().warning(t('只有待归档的计划可以提交归档'));
			return;
		}
		ElMessageBox.confirm(t('是否确认归档？'), t('确认归档'), {
			confirmButtonText: t('确定'),
			cancelButtonText: t('取消'),
			type: 'warning',
		}).then(async () => {
			try {
				state.loading = true;
				const res = await approvePlan({
					id: selectedRows.value.map((item: any) => item.id),
					approveType: 4, // 审批类型
					approveResult: 1,
				});
				if (res.code === 0) {
					if (res.data?.failCount > 0) {
						open({ title: t('提交归档失败'), data: res.data });
					} else {
						useMessage().success('提交归档成功');
					}
				}
				register.safeCallTableMethod('clearCheckboxRow');
				getDataList();
			} catch (error: any) {
				useMessage().error(error.msg || '提交归档失败');
			} finally {
				state.loading = false;
			}
		});
	} else if (type === 'withdraw') {
		// 撤回审批
		syncSelectedRows();
		if (selectedRows.value.length === 0) {
			useMessage().warning('请至少选择一条数据');
			return;
		}
		if (
			!selectedRows.value.every(
				(item: any) => item.status != '0' && item.status != '4'
			)
		) {
			useMessage().warning(t('已归档和草稿状态不能撤回审批'));
			return;
		}
		ElMessageBox.confirm(t('是否撤回审批？'), t('撤回审批'), {
			confirmButtonText: t('确定'),
			cancelButtonText: t('取消'),
			type: 'warning',
		}).then(async () => {
			try {
				state.loading = true;
				const res = await approvePlan({
					id: selectedRows.value.map((item: any) => item.id),
					approveType: 5,
					approveResult: 1,
				});
				if (res.code === 0) {
					if (res.data?.failCount > 0) {
						open({ title: t('撤回失败'), data: res.data });
					} else {
						useMessage().success('撤回成功');
					}
				}
				register.safeCallTableMethod('clearCheckboxRow');
				getDataList();
			} catch (error: any) {
				useMessage().error(error.msg || '撤回失败');
			} finally {
				state.loading = false;
			}
		});
	} else if (type === 'edit') {
		// 更新
		ElMessageBox.confirm(t('是否更新该条数据？'), t('更新'), {
			confirmButtonText: t('确定'),
			cancelButtonText: t('取消'),
			type: 'warning',
		}).then(async () => {
			state.loading = true;
			try {
				const res = await updateSalesPlan({ id: row });
				if (res.code === 0) {
					if (res.data?.failCount > 0) {
						open({ title: t('更新失败'), data: res.data });
					} else {
						useMessage().success('更新成功');
					}
				}
				register.safeCallTableMethod('clearCheckboxRow');
				getDataList();
			} catch (error: any) {
				useMessage().error(error.msg || '更新失败');
			} finally {
				state.loading = false;
			}
		});
	} else if (type === 'delete') {
		// 删除
		ElMessageBox.confirm(t('是否删除该条数据？'), t('删除'), {
			confirmButtonText: t('确定'),
			cancelButtonText: t('取消'),
			type: 'warning',
		}).then(async () => {
			state.loading = true;
			try {
				const res = await deletePlan({ id: row });
				if (res.code === 0) {
					if (res.data?.failCount > 0) {
						open({ title: t('删除失败'), data: res.data });
					} else {
						useMessage().success('删除成功');
					}
				}
				register.safeCallTableMethod('clearCheckboxRow');
				getDataList();
			} catch (error: any) {
				useMessage().error(error.msg || '删除失败');
			} finally {
				state.loading = false;
			}
		});
	} else if (type === 'importPlan') {
		importPlanRef.value.handleOpen();
		return;
	} else if (type === 'actualSale') {
		// 打开导入实际销量弹窗
		importDialogRef.value.show();
	}
};
// 打开详情
const openDetailDialog = (id: string) => {
	fileInfoRef.value.handleOpen(id);
};

// 导出
const handleExport = async () => {
	try {
		// 显示加载状态
		state.loading = true;
		const ids = register.getSelectedIds();
		// 发送请求，设置 responseType 为 'blob' 以接收二进制流
		await exportReturnPage({
			ids: ids,

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

const confirmInfo = async (data: any, api: any, ref: any) => {
	try {
		// 创建FormData对象，符合接口要求的格式
		const formData = new FormData();
		formData.append('file', data.file);
		// 如果有月份信息，添加到FormData中
		if (data.startTime && data.endTime) {
			formData.append('startTime', data.startTime);
			formData.append('endTime', data.endTime);
		}
		const res = await api(formData);
		if (res.code === 0) {
			useMessage().success('导入成功');
			ref.handleClose();
		}
		getDataList();
	} catch (error: any) {
		useMessage().error(error?.msg || '导入失败');
	}
};

// 审批弹窗
const approveType = ref(); // 当前审批类型
const approveDialog = ref();
const approveDialogTitle = ref();
// 审批弹窗
const openApproveDialog = (type: number, title: string) => {
	syncSelectedRows();
	approveType.value = type;
	approveDialogTitle.value = title;
	if (selectedRows.value.length === 0) {
		useMessage().warning('请至少选择一条数据');
		return;
	}
	if (approveType.value === 2) {
		if (!selectedRows.value.every((item: any) => item.status == '1')) {
			useMessage().warning(t('只有待销售经理审批的计划可以进行销售经理审批'));
			return;
		}
	} else if (approveType.value === 3) {
		if (!selectedRows.value.every((item: any) => item.status == '2')) {
			useMessage().warning(t('只有待计划经理审批的计划可以进行计划经理审批'));
			return;
		}
	}
	approveDialog.value.show();
};

// 审批处理
const handleApprove = async (type: number, isApprove: boolean, e: any) => {
	if (!isApprove && !e.approveRemark) {
		useMessage().warning('请填写审批意见');
		return;
	}
	try {
		state.loading = true;
		const res = await approvePlan({
			id: selectedRows.value.map((item: any) => item.id),
			approveType: type, // 审批类型
			approveResult: isApprove ? 1 : 0, // 审核结果
			approveRemark: e.approveRemark,
		});
		if (res.code == 0) {
			if (res.data?.failCount > 0) {
				open({ title: t('审批失败'), data: res.data });
			} else {
				useMessage().success('审批成功');
			}
			approveDialog.value.hide();
			register.safeCallTableMethod('clearCheckboxRow');
			getDataList();
		}
	} catch (error: any) {
		useMessage().error(error?.msg);
	} finally {
		state.loading = false;
	}
};

const exportData = (url: string) => {
	window.open(url);
};
</script>

<style lang="scss" scoped>
.text-blue {
	color: #0089ef;
}
</style>
