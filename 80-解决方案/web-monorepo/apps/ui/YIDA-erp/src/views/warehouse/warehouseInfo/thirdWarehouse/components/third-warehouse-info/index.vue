<template>
	<div class="layout-padding-auto layout-padding-view">
		<el-row class="ml10" v-show="showSearch">
			<el-form
				:inline="true"
				:model="state.queryForm"
				@keyup.enter="getDataList"
				ref="queryRef"
			>
				<el-form-item>
					<el-radio-group v-model="radioValue" @change="setRadioValue">
						<el-radio-button
							:label="$t('仓库设置')"
							value="thirdWarehouseInfo"
						/>
						<el-radio-button :label="$t('SKU配对')" value="spSku" />
					</el-radio-group>
				</el-form-item>
				<el-form-item>
					<SelectInputApi
						v-model="state.queryForm.spId"
						componentType="spInfo"
						@change="changeSpId()"
						:settings="{
							text: '服务商',
						}"
						:getDataList="getDataList"
					/>
				</el-form-item>
				<el-form-item>
					<TreeSelectInputApi
						v-model:queryForm="state.queryForm"
						componentType="dicts"
						multiple
						placeholder="业务类型"
						:settings="{
							text: '业务类型',
							getTreeDataParams: 'warehouse_biz',
							code: 'warehouseBizList',
							searchFn: async () => {
								await getDataList();
							},
						}"
					/>
				</el-form-item>
				<el-form-item>
					<el-select
						:max-collapse-tags="1"
						v-model="state.queryForm.status"
						placeholder="状态"
						clearable
						style="width: 200px"
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
						:max-collapse-tags="1"
						v-model="state.queryForm.countryCode"
						placeholder="国家"
						filterable
						clearable
						style="width: 200px"
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
				@handleExport="exportPartFn"
				:is-show-export="auth('thirdWarehouse_export')"
			>
				<template #left-tool>
					<el-button
						class="ml10"
						type="primary"
						@click="openDialog('add')"
						v-auth="'thirdWarehouse_addWarehouse'"
					>
						{{ $t('添加仓库') }}</el-button
					>
					<el-button
						class="ml10"
						@click="batchOperation('enable')"
						v-auth="'thirdWarehouse_startWarehouse'"
					>
						{{ $t('启用仓库') }}</el-button
					>
					<el-button
						class="ml10"
						@click="batchOperation('disable')"
						v-auth="'thirdWarehouse_stopWarehouse'"
					>
						{{ $t('停用仓库') }}</el-button
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
			:cell-style="tableStyle.cellStyle"
			:header-cell-style="tableStyle.headerCellStyle"
			native-scrollbar
		>
			<el-table-column align="center" type="selection" width="40" />
			<el-table-column
				prop="spName"
				:label="t('服务商')"
				show-overflow-tooltip
				sortable="custom"
				width="100"
			/>
			<el-table-column
				prop="warehouseName"
				:label="t('仓库名称')"
				show-overflow-tooltip
				sortable="custom"
				width="120"
			/>
			<el-table-column
				prop="warehouseCode"
				:label="t('仓库代码')"
				show-overflow-tooltip
				sortable="custom"
				width="120"
			/>
			<el-table-column
				prop="legalPersonName"
				:label="t('法人主体')"
				show-overflow-tooltip
				width="120"
			/>
			<el-table-column
				prop="warehouseBizText"
				:label="t('业务类型')"
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
								? !auth('thirdWarehouse_stopWarehouse')
								: !auth('thirdWarehouse_startWarehouse')
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
							v-auth="'thirdWarehouse_editWarehouse'"
							>{{ $t('编辑') }}
						</el-button>
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
			:currentData="currentRow"
			:dictMap="dictMap"
			:visibleType="addVisibleType"
			@closeDialog="
				() => {
					addDialogVisible = false;
					getDataList();
				}
			"
		/>
		<LogDialog
			v-model="logDialogVisible"
			:bizType="['WAREHOUSE_THIRD']"
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
import { defineAsyncComponent, ref, reactive, watch } from 'vue';
import { useMessage } from '/@/hooks/message';
import { getSpInfoList } from '/@/api/warehouse/spInfo/index';
import {
	getThirdWarehouseList,
	getThirdWarehouseThirdShow,
	getExportThirdWarehouseExcel,
	postWarehouseInfoEnableThird,
	postWarehouseInfoDisableThird,
} from '/@/api/warehouse/third-warehouse/index';
import { ElMessageBox } from 'element-plus';
import { getCountryList } from '/@/api/warehouse/warehouse/index';
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
const SelectInput = defineAsyncComponent(
	() => import('/@/components/TableFormModule/select-input.vue')
);
const TreeSelectInputApi = defineAsyncComponent(
	() => import('/@/componentsApi/TreeSelectInputApi/index.vue')
);
const SelectInputApi = defineAsyncComponent(
	() => import('/@/componentsApi/SelectInputApi/index.vue')
);
const props = defineProps({
	// 设置单选框的值
	setRadioValue: {
		type: Function,
		required: true,
		default: () => {},
	},
	// 清空服务商信息
	clearSpInfo: {
		type: Function,
		required: true,
		default: () => {},
	},
	// 当前选中的服务商信息
	currentSpInfo: {
		type: Object,
		required: true,
		default: () => {},
	},
	// 设置服务商信息
	setSpInfo: {
		type: Function,
		required: true,
		default: () => {},
	},
});
const { t } = useI18n();
// 搜索变量
const queryRef = ref();
// table的引用
const tableRef = ref();
// 是否显示搜索
const showSearch = ref(true);
// 显示结果对话框
const showResultDialog = ref();
// 单选框的值
const radioValue = ref('thirdWarehouseInfo');

// 新增仓库弹窗
const addDialogVisible = ref(false);
// 弹窗类型
const addVisibleType = ref('');
const addDialogRef = ref();
const addDialogTitle = ref('添加仓库');
// 当前点击的行
const currentRow = ref<any>({
	id: '',
});
//   初始化数据
const { dictMap, reload } = useMultipleDicts(
	[
		{
			key: 'spInfoList',
			fetchFn: getSpInfoList,
		}, // 服务商列表
		{
			key: 'countryList',
			fetchFn: getCountryList,
			params: {
				parentCode: '0',
			},
		}, // 国家列表有省市区的
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
	pageList: getThirdWarehouseList,
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
			// 不知道为什么要授权了的才能查询，理论上是不授权也可以
			// if (newVal?.dockCode || newVal?.id) {
			if (newVal?.id) {
				state.queryForm.spId = newVal.id;
				// 刷新
				getDataList();
			}
		}
	},
	{ immediate: true }
);

// 服务器切换查询
const changeSpId = () => {
	if (state.queryForm.spId) {
		// 设置父组件的服务商信息
		props.setRadioValue(radioValue.value);
		// 刷新数据
		getDataList();
		// 设置父组件的服务商信息
		props.setSpInfo(
			state.queryForm.spId
				? dictMap.value.spInfoList.find(
						(item) => item.id === state.queryForm.spId
				  )
				: {}
		);
	} else {
		// 清空服务商信息
		props.clearSpInfo();
		// 清空查询条件
		getDataList();
	}
};

// 重置
// 清空搜索条件
const resetQuery = () => {
	resetTableQuery(() => {
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
const exportPartFn = async () => {
	try {
		const ids = tableRef.value.getSelectionRows().map((item: any) => item.id);
		// 显示加载状态
		state.loading = true;
		// 发送请求，设置 responseType 为 'blob' 以接收二进制流
		await getExportThirdWarehouseExcel({
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
	if (type === 'add') {
		addDialogTitle.value = '添加仓库';
		currentRow.value = {
			id: '',
		}; // 新增时清空内容
		addVisibleType.value = 'add';
		addDialogVisible.value = true;
	} else if (type === 'edit' && row) {
		const res = await getThirdWarehouseThirdShow({ id: row.id });
		if (res.code === 0) {
			currentRow.value = res.data;
			addDialogTitle.value = '编辑仓库';
		}
		addVisibleType.value = 'edit';
		addDialogVisible.value = true;
	} else if (type === 'log' && row) {
		currentRow.value = row;
		addDialogTitle.value = '仓库日志';
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
	// 关闭弹窗
	statusVisible.value = false;
	// 调用接口修改状态
	if (status.value) {
		// 启用操作
		try {
			const res = await postWarehouseInfoEnableThird({
				ids: [currentRow.value?.id],
			});
			if (res.code === 0) {
				// 清空选中
				tableRef.value.clearSelection();
				getDataList();
				// 判断是否有失败的记录
				if (res?.data?.failCount > 0) {
					// 展示错误提示
					useMessage().error(res.data.failInfos[0]);
				} else {
					useMessage().success('启用成功');
				}
			}
		} catch (error: any) {
			if (error.msg) useMessage().error(error.msg);
		}
	} else {
		try {
			const res = await postWarehouseInfoDisableThird({
				ids: [currentRow.value?.id],
			});
			if (res.code === 0) {
				// 清空选中
				tableRef.value.clearSelection();
				getDataList();
				// 判断是否有失败的记录
				if (res?.data?.failCount > 0) {
					// 展示错误提示
					useMessage().error(res.data.failInfos[0]);
				} else {
					useMessage().success('停用成功');
				}
			}
		} catch (error: any) {
			if (error.msg) useMessage().error(error.msg);
		}
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
			await ElMessageBox.confirm('确定要启用选中的仓库吗？', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'info',
			});
			try {
				const res = await postWarehouseInfoEnableThird({
					ids: selectedRows.map((item: any) => item.id),
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
			await ElMessageBox.confirm('确定要停用选中的仓库吗？', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
			});
			try {
				const res = await postWarehouseInfoDisableThird({
					ids: selectedRows.map((item: any) => item.id),
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

const logDialogVisible = ref(false);
// 关闭日志弹窗
const closeLogDialog = () => {
	logDialogVisible.value = false;
};
// 设置单选框的值
const setRadioValue = () => {
	props.setRadioValue(radioValue.value);
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
