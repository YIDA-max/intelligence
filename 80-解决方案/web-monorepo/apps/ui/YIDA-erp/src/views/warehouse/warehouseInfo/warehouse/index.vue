<template>
	<div class="layout-padding-auto">
		<el-row class="ml10" v-show="showSearch">
			<el-form
				:inline="true"
				:model="state.queryForm"
				@keyup.enter="getDataList"
				ref="queryRef"
			>
				<el-form-item>
					<el-select
						v-model="state.queryForm.status"
						placeholder="产品状态"
						clearable
						style="width: 150px"
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
					<el-select
						v-model="state.queryForm.countryCode"
						placeholder="国家"
						clearable
						style="width: 150px"
						@change="getDataList"
					>
						<el-option
							v-for="item in dictMap.countryList"
							:key="item.code"
							:label="item.name"
							:value="item.code"
						/>
					</el-select>
				</el-form-item>
				<el-form-item>
					<div class="flex item-center">
						<SelectInput
							v-model:queryForm="state.queryForm"
							:searchTypes="[
								{
									label: '仓库名称',
									value: 'warehouseNames',
								},
								{
									label: '仓库代码',
									value: 'warehouseCodes',
								},
							]"
							:getDataList="getDataList"
						/>
					</div>
				</el-form-item>
				<el-form-item>
					<TreeSelectInputApi
						v-model:queryForm="state.queryForm"
						componentType="legalEntity"
						multiple
						placeholder="法人主体"
						:settings="{
							text: '法人主体',
							searchFn: async () => {
								await getDataList();
							},
							code: 'legalPersonIds',
						}"
					/>
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
				@handleExport="handleExport"
				:is-show-export="auth('warehouse_export')"
			>
				<template #left-tool>
					<el-button
						class="ml10"
						type="primary"
						@click="openDialog('add')"
						v-auth="'warehouse_add'"
					>
						{{ $t('添加仓库') }}</el-button
					>
				</template>
			</ToolBar>
		</el-row>
		<el-table
			:data="state.dataList"
			@selection-change="handleSelectionChange"
			@sort-change="sortChangeHandle"
			style="width: 100%"
			v-loading="state.loading"
			border
			ref="tableRef"
			:cell-style="tableStyle.cellStyle"
			:header-cell-style="tableStyle.headerCellStyle"
			native-scrollbar
		>
			<el-table-column align="center" type="selection" width="40" />
			<el-table-column
				prop="warehouseName"
				:label="t('仓库名称')"
				show-overflow-tooltip
			/>
			<el-table-column
				prop="warehouseCode"
				:label="t('仓库代码')"
				show-overflow-tooltip
			/>
			<el-table-column
				prop="legalPersonName"
				:label="t('法人主体')"
				show-overflow-tooltip
				width="120"
			/>
			<el-table-column
				prop="countryCodeText"
				:label="t('国家')"
				show-overflow-tooltip
			/>
			<el-table-column :label="t('状态')" show-overflow-tooltip>
				<template #default="{ row }">
					<el-switch
						:modelValue="!!row.status"
						size="small"
						:disabled="
							row.status === 1 || row.status === '1'
								? !auth('warehouse_stop')
								: !auth('warehouse_start')
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
				prop="createTime"
				:label="t('创建时间')"
				show-overflow-tooltip
				sortable="custom"
				width="180"
			/>
			<el-table-column
				prop="updateTime"
				:label="t('更新时间')"
				show-overflow-tooltip
				sortable="custom"
				width="180"
			/>
			<el-table-column
				prop="updateName"
				:label="t('操作人')"
				show-overflow-tooltip
				width="180"
			/>
			<el-table-column :label="$t('common.action')" width="150" fixed="right">
				<template #default="{ row }">
					<div class="flex items-center">
						<el-button
							text
							type="primary"
							class="mr20"
							@click="openDialog('edit', row)"
							v-auth="'warehouse_edit'"
							>{{ $t('编辑') }}
						</el-button>
						<el-button
							text
							type="primary"
							class="mr20"
							@click="openLogDialog(row.id)"
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
					<div v-if="!status">停用后仓库将无法操作出入库</div>
					<div>
						确定{{ status ? '启用' : '停用' }}仓库<span class="text-blue">{{
							currentRow?.warehouseName
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
			v-model="addDialogVisible"
			:title="addDialogTitle"
			:editData="currentData"
			@save="saveWarehouse"
			@closeDialog="addDialogVisible = false"
			:dictMap="dictMap"
		/>
		<LogDialog
			v-model="logDialogVisible"
			:id="currentRow.id"
			:biz-type="['WAREHOUSE_SELF']"
			:showSearchForm="false"
			:showToolBar="false"
			@closeDialog="closeLogDialog"
		/>
	</div>
</template>

<script setup lang="ts">
import { BasicTableProps, useTable } from '/@/hooks/table';
import { useI18n } from 'vue-i18n';
import { defineAsyncComponent, ref, reactive } from 'vue';
import { useMessage } from '/@/hooks/message';

import {
	getWareHouseList,
	enableWareHouse,
	disableWareHouse,
	getCountryList,
	warehouseInfo,
	exportWarehouseExcel,
} from '/@/api/warehouse/warehouse/index';
import { useMultipleDicts } from '/@/hooks/multipleDicts';
import { auth } from '/@/utils/authFunction';
const AddDialog = defineAsyncComponent(() => import('./components/add.vue'));
const ToolBar = defineAsyncComponent(
	() => import('/@/components/ToolBar/tool-bar.vue')
);
const LogDialog = defineAsyncComponent(
	() => import('/@/components/log/log-dialog.vue')
);
const SelectInput = defineAsyncComponent(
	() => import('/@/components/TableFormModule/select-input.vue')
);
const TreeSelectInputApi = defineAsyncComponent(
	() => import('/@/componentsApi/TreeSelectInputApi/index.vue')
);
const { t } = useI18n();
// 搜索变量
const queryRef = ref();
const showSearch = ref(true);

// 表格引用
const tableRef = ref();

//   初始化数据
const { dictMap } = useMultipleDicts(
	[
		{
			key: 'countryList',
			fetchFn: getCountryList,
			params: {
				areaType: '0',
			},
		}, // 国家列表
	],
	{
		isAuto: true, // 是否自动加载
		tableRef,
	}
);

const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {
		status: 1,
	},
	pageList: getWareHouseList,
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

// 重置
// 清空搜索条件
const resetQuery = () => {
	resetTableQuery(() => {
		// 重置时间范围
		return {
			queryForm: {
				current: 1,
				size: 10,
				status: 1, // 默认启用
			},
			descs: ['create_time'],
			ascs: [],
		};
	});
};

// 导出
const handleExport = async () => {
	try {
		// 显示加载状态
		const ids = tableRef.value?.getSelectionRows()?.map((item: any) => item.id);
		state.loading = true;
		// 发送请求，设置 responseType 为 'blob' 以接收二进制流
		await exportWarehouseExcel({
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

// 选中当前行
const currentData = ref({});
// 添加仓库
const openDialog = async (type: string, row?: any) => {
	if (type === 'add') {
		addDialogTitle.value = '添加仓库';
		currentData.value = {}; // 新增时清空内容
	} else if (type === 'edit' && row) {
		addDialogTitle.value = '编辑仓库';
		await getWarehouseInfo(row.id);
		// 依赖组件内的open方法打开弹窗
		// addDialogRef.value.handleOpen();
	}
	addDialogVisible.value = true;
};

const getWarehouseInfo = async (id: string) => {
	const res = await warehouseInfo({ id: id });
	currentData.value = { ...res.data };
};

// 多选变量
const selectObjs = ref([]) as any;
const multiple = ref(true);
// 当前点击的行
const currentRow = ref<any>({
	id: '',
});
// 多选事件
const handleSelectionChange = (objs: { id: string }[]) => {
	selectObjs.value = objs.map(({ id }) => id);
	multiple.value = !objs.length;
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
	// 关闭弹窗
	statusVisible.value = false;
	// 调用接口修改状态
	if (status.value) {
		// 启用操作
		await enableWareHouse({ ids: [currentRow.value?.id] });
		getDataList();
	} else {
		// 停用操作
		await disableWareHouse({ ids: [currentRow.value?.id] });
		getDataList();
	}
};

// 新增自营仓弹窗
const addDialogVisible = ref(false);
const addDialogRef = ref();
const addDialogTitle = ref('添加仓库');

// 新增自营仓
const saveWarehouse = () => {
	addDialogVisible.value = false;
	getDataList();
};

const logDialogVisible = ref(false);
// 打开日志弹窗
const openLogDialog = (id: string) => {
	currentRow.value.id = id;
	logDialogVisible.value = true;
};
// 关闭日志弹窗
const closeLogDialog = () => {
	logDialogVisible.value = false;
};
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
