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
						<div class="flex item-center">
							<SelectInput
								v-model:queryForm="state.queryForm"
								:searchTypes="[
									{
										label: '达人名称',
										value: 'influencerNames',
									},
								]"
								:getDataList="getDataListAll"
							/>
						</div>
					</el-form-item>
					<el-form-item>
						<div class="flex item-center">
							<SelectInput
								v-model:queryForm="state.queryForm"
								:searchTypes="[
									{
										label: 'SPU',
										value: 'spus',
									},
								]"
								:getDataList="getDataListAll"
							/>
						</div>
					</el-form-item>
					<el-form-item>
						<div class="flex item-center">
							<el-input
								v-model="state.queryForm.approver"
								show-word-limit
								placeholder="跟进人"
							>
								<template #prepend>跟进人</template>
							</el-input>
						</div>
					</el-form-item>
					<el-form-item>
						<div class="flex item-center">
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
										label: '合作日期',
										value: 'cooperationDate',
										isAddHMS: false,
										dateStart: 'cooperationDateStart',
										dateEnd: 'cooperationDateEnd',
									},
								]"
								:getDataList="getDataListAll"
							/>
						</div>
					</el-form-item>
					<el-form-item v-show="currentStatus === '1'">
						<div class="flex item-center">
							<el-select
								v-model="state.queryForm.progress"
								placeholder="进度"
								clearable
								style="width: 200px"
								@change="
									() => {
										getDataList();
										getStatusProgress();
									}
								"
							>
								<el-option
									v-for="item in dictMap.tiktok"
									:key="item.value"
									:label="item.label"
									:value="item.value"
								/>
							</el-select>
						</div>
					</el-form-item>
					<el-row>
						<el-form-item>
							<div class="flex item-center">
								<el-button @click="getDataListAll" type="primary"
									>{{ $t('搜索') }}
								</el-button>
								<el-button @click="resetQuery" type="info" plain
									>{{ $t('common.resetBtn') }}
								</el-button>
							</div>
						</el-form-item>
					</el-row>
				</el-form>
			</el-row>
			<el-row>
				<ToolBar @handleRefresh="getDataListAll" @handleExport="exportPartFn">
					<template #left-tool>
						<el-button
							class="ml10"
							type="primary"
							@click="
								() => {
									importDialogRef.show();
								}
							"
							v-auth="'cooperation_import'"
						>
							{{ $t('导入') }}</el-button
						>
						<el-button
							class="ml10"
							@click="openDialog('add')"
							v-auth="'cooperation_add'"
						>
							{{ $t('新增') }}</el-button
						>
						<el-button
							class="ml10"
							@click="openDialog('del')"
							v-auth="'cooperation_del'"
						>
							{{ $t('删除') }}</el-button
						>
					</template>
				</ToolBar>
			</el-row>
			<!-- 状态列表 -->
			<div class="track-tabs">
				<el-tabs
					v-model="currentStatus"
					@tab-change="
						() => {
							state.queryForm.progress = currentStatus;
							getDataListAll();
						}
					"
				>
					<el-tab-pane
						v-for="tab in dictMap.tiktok"
						:key="tab.value"
						:name="tab.value"
					>
						<template #label>
							<span> {{ tab.label }} ({{ tab.number || 0 }}) </span>
						</template>
					</el-tab-pane>
				</el-tabs>
			</div>
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
					prop="influencerName"
					:label="t('达人名称')"
					width="150"
				>
					<template #default="{ row }">
						{{ row.influencerName || '---' }}
					</template>
				</el-table-column>

				<el-table-column prop="spu" :label="t('SPU')" show-overflow-tooltip>
					<template #default="{ row }"> {{ row.spu || '---' }} </template>
				</el-table-column>
				<el-table-column
					prop="cooperationDate"
					:label="t('合作日期')"
					show-overflow-tooltip
				>
					<template #default="{ row }">
						{{ row.cooperationDate || '---' }}
					</template>
				</el-table-column>
				<el-table-column
					prop="cooperationFee"
					:label="t('合作费用')"
					show-overflow-tooltip
				>
					<template #default="{ row }">
						$ {{ row.cooperationFee || '---' }}
					</template>
				</el-table-column>
				<el-table-column
					prop="commissionRate"
					:label="t('佣金比例')"
					show-overflow-tooltip
				>
					<template #default="{ row }">
						{{ row.commissionRate || '---' }} %
					</template>
				</el-table-column>
				<el-table-column
					prop="approver"
					:label="t('跟进人')"
					show-overflow-tooltip
					width="150"
				>
					<template #default="{ row }"> {{ row.approver || '---' }} </template>
				</el-table-column>
				<el-table-column
					prop="progress"
					:label="t('进度')"
					show-overflow-tooltip
				>
					<template #default="{ row }"> {{ row.progress }} </template>
				</el-table-column>
				<el-table-column prop="store" :label="t('店铺')" show-overflow-tooltip>
					<template #default="{ row }"> {{ row.store || '---' }} </template>
				</el-table-column>
				<el-table-column prop="remark" :label="t('备注')" show-overflow-tooltip>
					<template #default="{ row }"> {{ row.remark || '---' }} </template>
				</el-table-column>
				<el-table-column :label="$t('common.action')" fixed="right" width="120">
					<template #default="{ row }">
						<div class="flex items-center">
							<el-button
								text
								type="primary"
								class="mr20"
								@click="openDialog('edit', row)"
								v-auth="'cooperation_edit'"
								>{{ $t('编辑') }}
							</el-button>
							<el-button
								text
								type="primary"
								class="mr20"
								@click="openDialog('log', row)"
								v-auth="'cooperation_log'"
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
			v-model="visible"
			:currentRow="currentRow"
			:visibleType="visibleType"
			:title="title"
			:dictMap="dictMap"
			@closeDialog="closeDialog"
		></FormDialog>
		<LogDialog
			v-model="logDialogVisible"
			:id="currentRow.id"
			:biz-type="['INFLUENCER_COOPERATION']"
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
			title="导入Tiktok达人合作信息"
			templateUrl="/files/import-template/TikTok达人合作数据录入模板.xlsx"
			excelUploadApi="/platform/tiktok/influencer/cooperation/import"
			:accept="'.xlsx,.xls'"
			@refreshDataList="getDataListAll"
		/>
	</div>
</template>

<script setup lang="ts">
import { BasicTableProps, useTable } from '/@/hooks/table';
import { useI18n } from 'vue-i18n';
import { defineAsyncComponent, ref, reactive } from 'vue';
import { useMessage } from '/@/hooks/message';
import { ElMessageBox } from 'element-plus';
import { getUserListByCondition } from '/@/api/admin/user';
import { useMultipleDicts } from '/@/hooks/multipleDicts';
import {
	getTikTokPage,
	getExportTikTok,
	postDelTikTok,
	getTikTokInfo,
	getProgressStatistics,
} from '/@/api/tiktok/cooperation/index';
import { getDicts } from '/@/api/admin/dict';
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
const LogDialog = defineAsyncComponent(
	() => import('/@/components/log/log-dialog.vue')
);
const ImportDialog = defineAsyncComponent(
	() => import('/@/components/fileUpload/importDialog.vue')
);
// const TreeSelectInput = defineAsyncComponent(() => import('/@/components/TableFormModule/tree-select-input.vue'));
// table的引用
const tableRef = ref();
//   初始化数据
const { dictMap } = useMultipleDicts(
	[
		{
			key: 'productManageId',
			fetchFn: getUserListByCondition,
			params: {
				lockFlag: 0,
			},
		}, // 用户列表
		{
			key: 'tiktok',
			fetchFn: getDicts,
			params: 'tiktok_progress',
			callback: (data) => {
				getDataListAll();
				return data;
			},
		}, // 状态
	],
	{
		isAuto: true,
		tableRef,
	}
);
const { t } = useI18n();

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
// 当前选中的状态
const currentStatus = ref('1');
// 弹窗标题
const title = ref('');
// 弹窗类型
const visibleType = ref('');
// 弹窗是否可见
const visible = ref(false);
// 日志对话框是否可见
const logDialogVisible = ref(false);
const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {
		progress: '1',
	},
	pageList: getTikTokPage,
	createdIsNeed: false,
	loading: false,
	dataList: [],
	ascs: [],
	descs: ['create_time'],
});
// 查询状态栏和table数据，不带状态
const getDataListAll = async () => {
	const params = JSON.parse(JSON.stringify(state.queryForm));
	// 删除空参数
	params.progress = '';
	const res: any = await getProgressStatistics(params);
	if (res.code === 0) {
		// 计算各个状态的数量
		dictMap.value?.tiktok?.forEach((status) => {
			status.number = res.data[status.value] || 0;
		});
	}
	getDataList();
};
// 带状态去查询状态栏数据
const getStatusProgress = async () => {
	const params = JSON.parse(JSON.stringify(state.queryForm));
	const res: any = await getProgressStatistics(params);
	if (res.code === 0) {
		// 计算各个状态的数量
		dictMap.value.tiktok.forEach((status) => {
			status.number = res.data[status.value] || 0;
		});
	}
};
// 监听状态变化,当前状态为全部时，重新获取状态数量
watch(
	() => currentStatus.value,
	() => {
		if (currentStatus.value === '1') {
			getStatusProgress();
		}
	}
);

//  table hook
const {
	getDataList,
	currentChangeHandle,
	sizeChangeHandle,
	sortChangeHandle,
	tableStyle,
} = useTable(state, tableRef);

// 重置
const resetQuery = () => {
	state.queryForm = {
		current: 1,
		size: 10,
		progress: '1',
	};
	getDataListAll();
};

// 打开对话框
const openDialog = async (type: string, row?: any) => {
	try {
		if (type === 'add') {
			title.value = t('新增达人');
			visibleType.value = 'add';
			currentRow.value = {
				id: '',
			};
			visible.value = true;
		} else if (type === 'edit') {
			const res = await getTikTokInfo({ id: row.id });
			if (res.code === 0) {
				title.value = t('编辑达人');
				visibleType.value = 'edit';
				currentRow.value = res.data;
				visible.value = true;
			}
		} else if (type === 'del') {
			const ids = tableRef.value
				.getSelectionRows()
				?.map((item: any) => item.id);
			if (!ids || ids.length === 0) {
				useMessage().warning(t('请至少选择一条数据'));
				return;
			}
			ElMessageBox.confirm(t('是否确认删除选中数据？'), t('提示'), {
				confirmButtonText: t('确定'),
				cancelButtonText: t('取消'),
				type: 'warning',
			}).then(async () => {
				try {
					const res = await postDelTikTok({ ids });
					if (res.code === 0) {
						useMessage().success(t('操作成功'));
					} else if (res.code === 5004) {
						ElMessageBox.confirm(t(res.msg), t('提示'), {
							type: 'error',
						});
					}
					// 清空选中行
					tableRef.value.clearSelection();
					// 刷新数据
					getDataListAll();
				} catch (error: any) {
					useMessage().error(error?.msg || t('操作失败'));
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
// 关闭对话框
const closeDialog = () => {
	visible.value = false;
	getDataListAll();
};

const exportPartFn = async () => {
	try {
		// 显示加载状态
		state.loading = true;
		const ids = tableRef.value.getSelectionRows()?.map((item: any) => item.id);
		// 发送请求，设置 responseType 为 'blob' 以接收二进制流
		await getExportTikTok({
			...state.queryForm,
			ascs: state?.ascs,
			descs: state?.descs,
			ids,
			page: 1,
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
