<script setup lang="ts">
import { BasicTableProps, useTable } from '/@/hooks/table';
import { useI18n } from 'vue-i18n';
import { defineAsyncComponent, ref, reactive, watch } from 'vue';
import { useMessage } from '/@/hooks/message';
import { getDicts } from '/@/api/admin/dict';
import { getExportWarehouseExcel } from '/@/api/warehouse/platformChannelWarehouse/index';
import {
	getPlatformLogisticsPage,
	getPlatformLogisticsDetailInfo,
	postPlatformLogisticsUpdateStatus,
	postPlatformLogisticsBatchUpdateStatus,
} from '/@/api/fbm/logisticsChannel/platformLogistics/index';
import { groupByPlatform } from '/@/api/fbm/logisticsChannel/platformWarehouseDelivery/index';
import { useMultipleDicts } from '/@/hooks/multipleDicts';
import { auth } from '/@/utils/authFunction';
import { ElMessageBox } from 'element-plus';
const FormDialog = defineAsyncComponent(
	() => import('./components/formDialog.vue')
);
const ToolBar = defineAsyncComponent(
	() => import('/@/components/ToolBar/tool-bar.vue')
);
const LogDialog = defineAsyncComponent(
	() => import('/@/components/log/log-dialog.vue')
);
const ShowResultDialog = defineAsyncComponent(
	() => import('/@/components/fileUpload/showResult.vue')
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
const props = defineProps({
	// 当前选中的服务商信息
	currentSpInfo: {
		type: Object,
		required: true,
		default: () => {},
	},
	// 当前选中的tab
	currentType: {
		type: Number,
		default: 1,
	},
});
const { t } = useI18n();
// table的引用
const tableRef = ref();
// 显示结果对话框
const showResultDialog = ref();
// 弹窗类型
const formDialogType = ref('');
const formDialogRef = ref();
// 当前点击的行
const currentRow = ref<any>({
	id: '',
});
onMounted(() => {});
//   初始化数据
const { dictMap, reload } = useMultipleDicts(
	[
		{
			key: 'platformChannel',
			fetchFn: getDicts,
			params: 'platform_channel',
		}, // 平台 渠道
		{
			key: 'carrieList',
			fetchFn: groupByPlatform,
		}, // 平台物流承运商
	],
	{
		isAuto: true,
		tableRef,
	}
);

const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {
		status: 1, // 默认启用
	},
	pageList: getPlatformLogisticsPage,
	loading: false,
	createdIsNeed: false,
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

// 监听当前选中的服务商信息
watch(
	() => props.currentSpInfo,
	async (newVal) => {
		if (newVal) {
			if (newVal?.id) {
				// 清空其他的搜索条件
				resetTableQuery(() => {
					return {
						queryForm: {
							current: 1,
							size: 10,
							logisticsProviderId: newVal.id || '',
						},
						descs: ['create_time'],
						ascs: [],
					};
				});
				// 刷新
				getDataList();
			}
		}
	},
	{ immediate: true }
);

// 重置
// 清空搜索条件
const resetQuery = () => {
	resetTableQuery(() => {
		return {
			queryForm: {
				current: 1,
				size: 10,
				logisticsProviderId: props.currentSpInfo.id || '',
			},
			descs: ['create_time'],
			ascs: [],
		};
	});
};

// 导出
const exportPartFn = async () => {
	try {
		const ids = tableRef.value.getSelectionRows().map((item: any) => item.id);
		// 显示加载状态
		state.loading = true;
		// 发送请求，设置 responseType 为 'blob' 以接收二进制流
		await getExportWarehouseExcel({
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

// 打开弹窗
const openDialog = async (type: string, row?: any) => {
	if (type === 'add') {
		currentRow.value = {};
		formDialogType.value = 'add';
		formDialogRef.value?.show();
	} else if (type === 'edit' && row) {
		const res = await getPlatformLogisticsDetailInfo({ id: row.id });
		if (res.code === 0) {
			formDialogType.value = 'edit';
			currentRow.value = res.data;
			formDialogRef.value?.show();
		}
	} else if (type === 'log' && row) {
		currentRow.value = row;
		formDialogType.value = 'log';
		logDialogVisible.value = true;
	}
};

// 批量操作
const batchOperation = async (type: string) => {
	try {
		const selectedRows = tableRef.value.getSelectionRows();
		if (selectedRows.length === 0) {
			useMessage().warning('请至少选择1条数据');
			return;
		}
		if (type === 'enable') {
			await ElMessageBox.confirm('确定要启用选中的渠道吗？', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'info',
			});
			try {
				const res = await postPlatformLogisticsBatchUpdateStatus({
					ids: selectedRows.map((item: any) => item.id),
					status: 1,
				});
				if (res.code === 0) {
					// 清空选中
					tableRef.value.clearSelection();
					getDataList();
					// 判断是否有失败的记录
					if (res?.data?.failCount > 0) {
						// 显示结果对话框
						showResultDialog.value.setData({
							data: res.data,
							title: '批量启用',
						});
						showResultDialog.value.show();
					} else {
						useMessage().success('批量启用成功');
					}
				}
			} catch (error: any) {
				if (error.msg) useMessage().error(error.msg);
			}
		} else if (type === 'disable') {
			await ElMessageBox.confirm('确定要停用选中的渠道吗？', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
			});
			try {
				const res = await postPlatformLogisticsBatchUpdateStatus({
					ids: selectedRows.map((item: any) => item.id),
					status: 0,
				});
				if (res.code === 0) {
					// 清空选中
					tableRef.value.clearSelection();
					getDataList();
					// 判断是否有失败的记录
					if (res?.data?.failCount > 0) {
						// 显示结果对话框
						showResultDialog.value.setData({
							data: res.data,
							title: '批量停用',
						});
						showResultDialog.value.show();
					} else {
						useMessage().success('批量停用成功');
					}
				}
			} catch (error: any) {
				if (error.msg) useMessage().error(error.msg);
			}
		} else {
			useMessage().warning('未知操作类型');
			return;
		}
	} catch (error: any) {
		if (error.msg) useMessage().error(error.msg);
		return;
	}
};

/**
 * 状态切换
 */
const handleChange = async (newVal: boolean, row: any) => {
	ElMessageBox.confirm(`确定要${newVal ? '启用' : '停用'}该渠道吗？`, '提示', {
		confirmButtonText: '确定',
		cancelButtonText: '取消',
		type: newVal ? 'info' : 'warning',
	})
		.then(async () => {
			try {
				const res = await postPlatformLogisticsUpdateStatus({
					id: row.id,
					status: newVal ? 1 : 0,
				});
				if (res.code === 0) {
					useMessage().success('操作成功');
					getDataList();
				}
			} catch (error: any) {
				useMessage().error(error.msg || '操作失败，请稍后重试');
				// 刷新列表，恢复原状态
				getDataList();
			}
		})
		.catch(() => {
			// 刷新列表，恢复原状态
			getDataList();
		});
};
const logDialogVisible = ref(false);
// 关闭日志弹窗
const closeLogDialog = () => {
	logDialogVisible.value = false;
};
// 查询所有的数据
const resetData = () => {
	// 查询获取所有的服务商信息
	reload();
	// 重新获取数据
	getDataList();
};
// 暴露给父组件的方法
defineExpose({
	resetData,
});
</script>
<template>
	<div class="layout-padding-auto layout-padding-view">
		<el-row class="ml10">
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
									label: '渠道名称',
									value: 'logisticsChannelNames',
								},
							]"
							:getDataList="getDataList"
						/>
					</div>
				</el-form-item>
				<el-form-item>
					<el-select
						:max-collapse-tags="1"
						v-model="state.queryForm.status"
						placeholder="状态"
						clearable
						style="width: 100px"
						@change="getDataList"
					>
						<el-option
							v-for="item in [
								{
									value: 1,
									label: '启用',
								},
								{
									value: 0,
									label: '停用',
								},
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
						componentType="userList"
						:settings="{
							text: '更新人',
							code: 'updateId',
							searchFn: getDataList,
							getTreeDataParams: {
								lockFlag: 0,
							},
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
									label: '更新时间',
									value: 'createdTime',
									isAddHMS: true,
									dateStart: 'updateTimeStart',
									dateEnd: 'updateTimeEnd',
									// defaultMonthsAgo: 1,
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
				@handleExport="exportPartFn"
				:is-show-export="false"
			>
				<template #left-tool>
					<el-button
						class="ml10"
						type="primary"
						@click="openDialog('add')"
						v-auth="'platformChannelWarehouse_add'"
					>
						{{ $t('新增渠道') }}</el-button
					>
					<el-button
						class="ml10"
						@click="batchOperation('enable')"
						v-auth="'platformChannelWarehouse_start'"
					>
						{{ $t('批量启用') }}</el-button
					>
					<el-button
						class="ml10"
						@click="batchOperation('disable')"
						v-auth="'platformChannelWarehouse_stop'"
					>
						{{ $t('批量停用') }}</el-button
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
			ref="tableRef"
			row-key="id"
			:cell-style="tableStyle.cellStyle"
			:header-cell-style="tableStyle.headerCellStyle"
			native-scrollbar
		>
			<el-table-column type="selection" width="55" reserve-selection />
			<el-table-column
				prop="logisticsChannelName"
				:label="t('物流渠道名称')"
				show-overflow-tooltip
				min-width="150"
			>
				<template #default="{ row }">
					<span>{{ row.logisticsChannelName ?? '-' }}</span>
				</template>
			</el-table-column>
			<el-table-column
				prop="logisticsChannelCode"
				:label="t('渠道代码')"
				show-overflow-tooltip
				min-width="120"
			>
				<template #default="{ row }">
					<span>{{ row.logisticsChannelCode ?? '-' }}</span>
				</template>
			</el-table-column>
			<el-table-column :label="t('状态')" show-overflow-tooltip width="150">
				<template #default="{ row }">
					<el-switch
						:modelValue="!!row.status"
						size="small"
						@change="handleChange($event, row)"
						:disabled="
							row.status === 1 || row.status === '1'
								? !auth('platformChannelWarehouse_stop')
								: !auth('platformChannelWarehouse_start')
						"
					></el-switch>
				</template>
			</el-table-column>
			<el-table-column
				prop="updateName"
				:label="t('更新人')"
				show-overflow-tooltip
				width="150"
			/>
			<el-table-column
				prop="updateTime"
				:label="t('更新时间')"
				show-overflow-tooltip
				sortable="custom"
				width="180"
			/>
			<el-table-column :label="$t('common.action')" fixed="right" width="100">
				<template #default="{ row }">
					<div class="flex items-center">
						<el-link
							underline="never"
							type="primary"
							@click="openDialog('edit', row)"
							class="mr-2"
							>{{ $t('编辑') }}</el-link
						>
						<el-link
							underline="never"
							type="primary"
							@click="openDialog('log', row)"
							>{{ $t('日志') }}</el-link
						>
					</div>
				</template>
			</el-table-column>
		</el-table>
		<pagination
			@current-change="currentChangeHandle"
			@size-change="sizeChangeHandle"
			v-bind="state.pagination"
		/>

		<FormDialog
			ref="formDialogRef"
			:currentRow="currentRow"
			:dictMap="dictMap"
			:formDialogType="formDialogType"
			:currentSpInfo="props.currentSpInfo"
			@getDataList="getDataList"
		/>
		<LogDialog
			v-model="logDialogVisible"
			:bizType="['PLATFORM_LOGISTICS']"
			:id="currentRow.id"
			:showSearchForm="false"
			:showToolBar="false"
			@closeDialog="closeLogDialog"
		/>
		<ShowResultDialog
			ref="showResultDialog"
			:currentSpInfo="props.currentSpInfo"
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
