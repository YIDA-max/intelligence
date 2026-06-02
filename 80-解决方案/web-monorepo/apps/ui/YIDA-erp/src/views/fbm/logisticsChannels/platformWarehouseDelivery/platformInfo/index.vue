<template>
	<div class="layout-padding-auto layout-padding-view">
		<el-row>
			<ToolBar
				@handleRefresh="resetQuery"
				@handleExport="exportPartFn"
				:is-show-export="false"
			>
			</ToolBar>
		</el-row>
		<el-table
			:data="state.dataList"
			@sort-change="sortChangeHandle"
			style="width: 100%"
			v-loading="state.loading"
			border
			ref="tableRef"
			:cell-style="tableStyle.cellStyle"
			:header-cell-style="tableStyle.headerCellStyle"
			native-scrollbar
		>
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
						:disabled="
							row.status === 1 || row.status === '1'
								? !auth('platformChannelWarehouse_stop')
								: !auth('platformChannelWarehouse_start')
						"
						@change="
						(e: any) => {
							statusChange(e, row);
						}
					"
					></el-switch>
				</template>
			</el-table-column>
			<el-table-column
				prop="mappingCount"
				:label="t('标发映射关系')"
				show-overflow-tooltip
				width="180"
			>
				<template #default="{ row }">
					<span>共有映射关系：{{ row.mappingCount ?? '-' }}个</span>
				</template>
			</el-table-column>
			<el-table-column
				prop="createName"
				:label="t('创建人')"
				show-overflow-tooltip
				width="150"
			/>
			<el-table-column
				prop="createTime"
				:label="t('创建时间')"
				show-overflow-tooltip
				sortable="custom"
				width="180"
			/>
			<el-table-column :label="$t('common.action')" fixed="right" width="80">
				<template #default="{ row }">
					<div class="flex items-center">
						<el-dropdown placement="bottom-end">
							<span class="el-dropdown-link">
								{{ $t('操作') }}
								<el-icon class="el-icon--right">
									<arrow-down />
								</el-icon>
							</span>
							<template #dropdown>
								<el-dropdown-menu>
									<el-dropdown-item @click="openDialog('edit', row)"
										>{{ $t('编辑') }}
									</el-dropdown-item>
									<el-dropdown-item @click="openDialog('detail', row)"
										>{{ $t('详情') }}
									</el-dropdown-item>
									<el-dropdown-item @click="openDialog('log', row)"
										>{{ $t('日志') }}
									</el-dropdown-item>
								</el-dropdown-menu>
							</template>
						</el-dropdown>
					</div>
				</template>
			</el-table-column>
		</el-table>
		<pagination
			@current-change="currentChangeHandle"
			@size-change="sizeChangeHandle"
			v-bind="state.pagination"
		/>
		<el-dialog
			v-model="statusVisible"
			:show-close="false"
			:close-on-click-modal="false"
			:close-on-press-escape="false"
			width="25%"
			class="status-header"
		>
			<div>
				<div class="flex items-center mb10">
					<el-icon size="22px" :color="status ? '#2E5CF6' : '#f56c6c'">
						<Warning />
					</el-icon>
					<span class="text-lg ml8">
						{{ status ? '启用' : '停用' }}
					</span>
				</div>
				<div class="text-lg ml30">
					<div>
						确定{{ status ? '启用' : '停用' }}物流渠道<span class="text-blue">{{
							currentRow?.platformChannelCodeText
						}}</span
						>吗?
					</div>
				</div>
			</div>
			<template #footer>
				<div class="dialog-footer">
					<el-button @click="statusVisible = false">取消</el-button>
					<el-button v-if="status" type="primary" @click="changeStatus">
						启用
					</el-button>
					<el-button v-else type="danger" plain @click="changeStatus"
						>停用</el-button
					>
				</div>
			</template>
		</el-dialog>
		<AddDialog
			ref="addDialogRef"
			:currentRow="currentRow"
			:dictMap="dictMap"
			:visibleType="addVisibleType"
			@closeDialog="
				() => {
					getDataList();
				}
			"
		/>
		<LogDialog
			v-model="logDialogVisible"
			:bizType="['PLATFORM_WARE_LOGISTICS']"
			:id="currentRow.id"
			:showSearchForm="false"
			:showToolBar="false"
			@closeDialog="closeLogDialog"
		/>
		<ShowResultDialog ref="showResultDialog" />
	</div>
</template>

<script setup lang="ts">
import { BasicTableProps, useTable } from '/@/hooks/table';
import { useI18n } from 'vue-i18n';
import { defineAsyncComponent, ref, reactive, watch, nextTick } from 'vue';
import { useMessage } from '/@/hooks/message';

import { getDicts } from '/@/api/admin/dict';
import { getExportWarehouseExcel } from '/@/api/warehouse/platformChannelWarehouse/index';
import {
	getPlatformWareLogisticsList,
	updateStatus,
	getPlatformWareLogisticsDetail,
	groupByPlatform,
} from '/@/api/fbm/logisticsChannel/platformWarehouseDelivery/index';
import { useMultipleDicts } from '/@/hooks/multipleDicts';
import { auth } from '/@/utils/authFunction';
const AddDialog = defineAsyncComponent(() => import('./components/add.vue'));
const ToolBar = defineAsyncComponent(
	() => import('/@/components/ToolBar/tool-bar.vue')
);
const LogDialog = defineAsyncComponent(
	() => import('/@/components/log/log-dialog.vue')
);
const ShowResultDialog = defineAsyncComponent(
	() => import('/@/components/fileUpload/showResult.vue')
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
const addVisibleType = ref('');
const addDialogRef = ref();
// 当前点击的行
const currentRow = ref<any>({
	id: '',
});
//   初始化数据
const { dictMap, reload } = useMultipleDicts(
	[
		{
			key: 'platform',
			fetchFn: getDicts,
			params: 'platform_channel',
		}, // 平台
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
		type: 1,
	},
	pageList: getPlatformWareLogisticsList,
	loading: false,
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
		// 等待加载完成
		await new Promise((resolve) => setTimeout(resolve, 100));
		if (newVal) {
			if (newVal?.dockCode || newVal?.value) {
				state.queryForm.siteCode = newVal.value;
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
				type: 1,
				current: 1,
				size: 10,
				siteCode: props.currentSpInfo.value,
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

// 添加仓库
const openDialog = async (type: string, row?: any) => {
	if (type === 'copy' && row) {
		const res = await getPlatformWareLogisticsDetail({ id: row.id });
		if (res.code === 0) {
			currentRow.value = res.data;
		}
		addVisibleType.value = 'copy';
		await nextTick();
		addDialogRef.value?.handleOpen();
	} else if (type === 'edit' && row) {
		const res = await getPlatformWareLogisticsDetail({ id: row.id });
		if (res.code === 0) {
			currentRow.value = res.data;
		}
		addVisibleType.value = 'edit';
		await nextTick();
		addDialogRef.value?.handleOpen();
	} else if (type === 'detail' && row) {
		const res = await getPlatformWareLogisticsDetail({ id: row.id });
		if (res.code === 0) {
			currentRow.value = res.data;
		}
		addVisibleType.value = 'detail';
		await nextTick();
		addDialogRef.value?.handleOpen();
	} else if (type === 'log' && row) {
		currentRow.value = row;
		addVisibleType.value = 'log';
		logDialogVisible.value = true;
	}
};

// 辅料状态修改 -- 二次确认
const status = ref<boolean>(false);

// 状态弹窗
const statusVisible = ref(false);

const statusChange = (type: boolean, row: any) => {
	status.value = type;
	statusVisible.value = true;
	// 设置当前行
	currentRow.value = row;
};

// 修改状态
const changeStatus = async () => {
	// 启用操作
	try {
		const res = await updateStatus({
			id: currentRow.value.id,
			status: status.value ? 1 : 0, // 启用1 停用0
		});
		if (res.code === 0) {
			// 清空选中
			tableRef.value.clearSelection();
			getDataList();
			useMessage().success(`${status.value ? '启用' : '停用'}成功`);
			statusVisible.value = false;
		}
	} catch (error: any) {
		if (error.msg) useMessage().error(error?.msg || t('操作失败'));
	}
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
