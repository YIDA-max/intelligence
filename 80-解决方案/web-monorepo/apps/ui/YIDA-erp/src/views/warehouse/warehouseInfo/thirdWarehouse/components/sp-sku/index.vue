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
						:settings="{
							text: '服务商',
							searchFn: async () => {
								changeSpId();
							},
						}"
						:getDataList="getDataList"
					/>
				</el-form-item>
				<el-form-item>
					<el-select
						v-model="state.queryForm.spSkuStatus"
						placeholder="三方仓产品状态"
						clearable
						style="width: 200px"
						@change="getDataList"
						multiple
						:max-collapse-tags="1"
						collapse-tags
					>
						<el-option
							v-for="item in [
								{
									value: 0,
									label: '废弃',
								},
								{
									value: 1,
									label: '草稿',
								},
								{
									value: 2,
									label: '可用',
								},
								{
									value: 3,
									label: '审核中',
								},
								{
									value: 4,
									label: '审核不通过',
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
						v-model="state.queryForm.mappingStatus"
						placeholder="配对状态"
						clearable
						style="width: 200px"
						@change="getDataList"
					>
						<el-option
							v-for="item in [
								{
									value: 0,
									label: '未配对',
								},
								{
									value: 1,
									label: '已配对',
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
					<div class="flex item-center">
						<SelectInput
							v-model:queryForm="state.queryForm"
							:searchTypes="[
								{
									label: '系统sku',
									value: 'skuCodes',
								},
								{
									label: '系统产品名称',
									value: 'skuNames',
								},
								{
									label: '三方仓SKU',
									value: 'spSkuCodes',
								},
								{
									label: '三方仓产品名称',
									value: 'spSkuNames',
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
				:is-show-export="auth('thirdWarehouse_export_sku')"
			>
				<template #left-tool>
					<el-button
						class="ml10"
						type="primary"
						@click="openDialog('synchronize')"
						v-auth="'thirdWarehouse_syncSku'"
					>
						{{ $t('同步三方仓SKU') }}</el-button
					>
					<el-dropdown class="ml10" split-button>
						批量操作
						<template #dropdown>
							<el-dropdown-menu>
								<el-dropdown-item
									@click="
										() => {
											batchOperation('enable');
										}
									"
									v-if="auth('thirdWarehouse_startSku')"
									>批量启用</el-dropdown-item
								>
								<el-dropdown-item
									@click="
										() => {
											batchOperation('disable');
										}
									"
									v-if="auth('thirdWarehouse_stopSku')"
									>批量停用</el-dropdown-item
								>
								<el-dropdown-item
									@click="
										() => {
											batchOperation('unbind');
										}
									"
									v-if="auth('thirdWarehouse_remove')"
									>批量解除配对</el-dropdown-item
								>
							</el-dropdown-menu>
						</template>
					</el-dropdown>
					<el-dropdown class="ml10" split-button>
						导入
						<template #dropdown>
							<el-dropdown-menu>
								<el-dropdown-item
									@click="
										() => {
											importDialogRef.show();
										}
									"
									v-if="auth('thirdWarehouse_importSku')"
									>导入三方仓SKU</el-dropdown-item
								>
								<el-dropdown-item
									@click="
										() => {
											importSpSkuMappingRef.show();
										}
									"
									v-if="auth('thirdWarehouse_import')"
									>导入配对关系</el-dropdown-item
								>
							</el-dropdown-menu>
						</template>
					</el-dropdown>
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
		>
			<el-table-column
				align="center"
				type="selection"
				width="40"
				reserve-selection
			/>
			<el-table-column
				prop="spName"
				:label="t('服务商')"
				show-overflow-tooltip
				sortable="custom"
				width="100"
			/>
			<el-table-column
				prop="spSkuCode"
				:label="t('三方仓sku/产品名称')"
				sortable="custom"
				width="180"
			>
				<template #default="{ row }">
					<div
						:style="{
							display: 'flex',
							flexDirection: 'column',
							justifyContent: 'center',
							alignItems: 'flex-start',
							width: '100%',
							textAlign: 'left',
						}"
					>
						<div>{{ row.spSkuCode }}</div>
						<div>{{ row.spSkuName }}</div>
					</div>
					<div v-if="!row.spSkuCode">---</div>
				</template>
			</el-table-column>
			<el-table-column
				prop="spSkuStatusText"
				:label="t('三方仓产品状态')"
				show-overflow-tooltip
				width="160"
			/>
			<el-table-column
				prop="skuName"
				:label="t('箱规编码/产品名称')"
				show-overflow-tooltip
				sortable="custom"
				width="220"
			>
				<template #default="{ row }">
					<div
						v-if="row?.skuName"
						:style="{
							display: 'flex',
							flexDirection: 'row',
							justifyContent: 'center',
							alignItems: 'flex-start',
							width: '100%',
							textAlign: 'left',
						}"
					>
						<div
							:style="{
								width: '50px',
								height: '50px',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								marginRight: '10px',
							}"
						>
							<MrImg :src="row.imgUrl" />
						</div>
						<div
							class="flex flex-col items-start justify-center w-full"
							:style="{
								maxWidth: 'calc(100% - 80px)',
								overflow: 'hidden',
							}"
						>
							<div
								:style="{
									maxWidth: 'calc(100%)',
									whiteSpace: 'nowrap',
									overflow: 'hidden',
									textOverflow: 'ellipsis',
								}"
							>
								{{ row.productSkuCartonCode }}
							</div>
							<div
								:style="{
									maxWidth: 'calc(100%)',
									whiteSpace: 'nowrap',
									overflow: 'hidden',
									textOverflow: 'ellipsis',
								}"
							>
								{{ row.skuName }}
							</div>
						</div>
					</div>

					<div v-if="!row.skuName">---</div></template
				>
			</el-table-column>

			<el-table-column :label="t('状态')" show-overflow-tooltip>
				<template #default="{ row }">
					<el-switch
						:modelValue="!!row.status"
						size="small"
						:disabled="
							row.status === 1 || row.status === '1'
								? !auth('thirdWarehouse_stopSku')
								: !auth('thirdWarehouse_startSku')
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
				prop="mappingStatus"
				:label="t('配对')"
				show-overflow-tooltip
			>
				<template #default="{ row }">
					<!-- 配对状态，0未配对，1已配对 -->
					<el-tag
						v-if="row.mappingStatus === 0"
						type="danger"
						size="small"
						:style="{ cursor: 'pointer' }"
						>未配对
					</el-tag>
					<el-tag
						v-else-if="row.mappingStatus === 1"
						size="small"
						:style="{ cursor: 'pointer' }"
					>
						已配对
					</el-tag>
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
							v-if="row.mappingStatus === 0"
							class="mr20"
							@click="openDialog('map', row)"
							v-auth="'thirdWarehouse_manual'"
							>{{ $t('手动配对') }}
						</el-button>
						<el-button
							text
							type="primary"
							v-if="row.mappingStatus === 1"
							class="mr20"
							@click="openDialog('map', row)"
							v-auth="'thirdWarehouse_change'"
							>{{ $t('更换配对') }}
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
					<div v-if="!status">停用后相关单据无法推送至三方仓</div>
					<div>
						确定{{ status ? '启用' : '停用'
						}}<span class="text-blue">三方仓SKU{{ currentRow?.spSkuCode }}</span
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
		<DialogSku
			ref="addDialogRef"
			v-model="dialogVisible"
			:title="dialogTitle"
			:currentRow="currentRow"
			:dictMap="dictMap"
			:visibleType="visibleType"
			@closeDialog="
				() => {
					dialogVisible = false;
					getDataList();
				}
			"
		/>
		<LogDialog
			v-model="logDialogVisible"
			:bizType="['WAREHOUSE_SP_SKU']"
			:id="currentRow.id"
			:showSearchForm="false"
			:showToolBar="false"
			@closeDialog="closeLogDialog"
		/>
		<ImportDialog
			ref="importDialogRef"
			title="导入三方仓SKU"
			templateUrl="/files/import-template/导入三方仓SKU.xlsx"
			excelUploadApi="/warehouse/spSku/import"
			:accept="'.xlsx,.xls'"
			@refreshDataList="getDataList"
		/>
		<ImportDialog
			ref="importSpSkuMappingRef"
			title="导入配对关系"
			templateUrl="/files/import-template/导入配对关系.xlsx"
			excelUploadApi="/warehouse/spSkuMapping/import"
			:accept="'.xlsx,.xls'"
			@refreshDataList="getDataList"
		/>
	</div>
</template>

<script setup lang="ts">
import { BasicTableProps, useTable } from '/@/hooks/table';
import { useI18n } from 'vue-i18n';
import { defineAsyncComponent, ref, reactive, watch } from 'vue';
import { useMessage } from '/@/hooks/message';
import { ElMessageBox } from 'element-plus';

import { getSpInfoList } from '/@/api/warehouse/spInfo/index';
import {
	getSpSkuList,
	postSynchronizeSpSku,
	postSpSkuEnable,
	postSpSkuDisable,
	postSpSkuUnbind,
	getSpSkuExport,
} from '/@/api/warehouse/spSku/index';
import { useMultipleDicts } from '/@/hooks/multipleDicts';
import { auth } from '/@/utils/authFunction';
import { useResultDialog } from '/@/hooks/useResultDialog';
const DialogSku = defineAsyncComponent(
	() => import('./components/dialog-sku.vue')
);
const ToolBar = defineAsyncComponent(
	() => import('/@/components/ToolBar/tool-bar.vue')
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
// table的引用
const tableRef = ref();
// 导入弹窗的引用
const importDialogRef = ref();
const importSpSkuMappingRef = ref();
// 搜索变量
const queryRef = ref();
// 是否显示搜索
const showSearch = ref(true);
// 单选框的值
const radioValue = ref('spSku');

// 新增仓库弹窗
const dialogVisible = ref(false);
// 弹窗类型
const visibleType = ref('');
const addDialogRef = ref();
const dialogTitle = ref('添加仓库');
// 当前点击的行
const currentRow = ref<any>({
	id: '',
});
const { open } = useResultDialog();
//   初始化数据
const { dictMap, reload } = useMultipleDicts(
	[
		{
			key: 'spInfoList',
			fetchFn: getSpInfoList,
			params: {},
		}, // 服务商列表
	],
	{
		isAuto: true,
		tableRef,
	}
);

const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {
		status: 1,
	},
	pageList: getSpSkuList,
	loading: false,
	dataList: [],
	ascs: ['sp_name'],
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
			if (newVal?.dockCode) {
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
			descs: [],
			ascs: ['sp_name'],
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
		await getSpSkuExport({
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

// 打开对话框
const openDialog = async (type: string, row?: any) => {
	if (type === 'map') {
		// 手动配对
		dialogTitle.value = '手动配对';
		currentRow.value = row;
		visibleType.value = 'map';
		dialogVisible.value = true;
	} else if (type === 'log' && row) {
		currentRow.value = row;
		dialogTitle.value = '仓库日志';
		visibleType.value = 'log';
		logDialogVisible.value = true;
	} else if (type === 'synchronize') {
		// 同步三方仓SKU
		ElMessageBox.confirm(
			'确定要同步三方仓SKU吗？同步需要一定时间，请耐心等待。',
			'提示',
			{
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'info',
			}
		).then(async () => {
			try {
				const res = await postSynchronizeSpSku({
					spId: state.queryForm.spId,
				});
				if (res.code === 0) {
					useMessage().success('同步成功');
					getDataList();
				}
			} catch (error: any) {
				useMessage().error(error.msg || '同步失败，请稍后再试');
				return;
			}
		});
	}
};

// 批量操作
const batchOperation = async (type: string) => {
	try {
		const selectedRows = tableRef.value.getSelectionRows();
		if (selectedRows.length === 0) {
			useMessage().warning('请至少选择一条数据');
			return;
		}
		if (type === 'enable') {
			await ElMessageBox.confirm('确定要启用选中的SKU吗？', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'info',
			});
			await postSpSkuEnable({ ids: selectedRows.map((item: any) => item.id) });
		} else if (type === 'disable') {
			await ElMessageBox.confirm(
				'停用后相关单据无法推送至三方仓,确定要停用选中的SKU吗？',
				'提示',
				{
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning',
				}
			);
			await postSpSkuDisable({ ids: selectedRows.map((item: any) => item.id) });
		} else if (type === 'unbind') {
			await ElMessageBox.confirm('确定要解除选中的SKU配对吗？', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
			});
			const res = await postSpSkuUnbind({
				ids: selectedRows.map((item: any) => item.id),
			});
			if (res.code === 0) {
				// 判断是否有失败的记录
				if (res?.data?.failCount > 0) {
					// 展示错误提示
					open({
						title: t('删除失败'),
						data: res.data,
					});
				} else if (res?.data?.failCount === 0) {
					useMessage().success('解除成功');
				}
			}
		}
		// 清空选中
		tableRef.value.clearSelection();
		getDataList();
	} catch (error: any) {
		useMessage().error(error.msg || '操作失败，请稍后再试');
		return;
	}
};

// 辅料状态修改 -- 二次确认
const status = ref<Boolean>(false);

// 状态弹窗
const statusVisible = ref(false);

const statusChange = (type: Boolean, row: any) => {
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
		await postSpSkuEnable({ ids: [currentRow.value?.id] });
		getDataList();
	} else {
		// 停用操作
		await postSpSkuDisable({ ids: [currentRow.value?.id] });
		getDataList();
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
