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
						<custom-cascader
							v-model:queryForm="state.queryForm"
							:data="warehouseData"
							:settings="{
								code: 'warehouseCodes',
								text: '发货仓',
								width: '190px',
								emitPath: false,
								props: {
									value: 'warehouseCode',
									label: 'name',
									children: 'children',
								},
								onSearch: handleWarehouseSearch,
								checkStrictly: false,
								showSelectAll: false,
							}"
							@change="handleWarehouseChange"
						/>
					</el-form-item>
					<el-form-item>
						<div
							class="flex items-center"
							:style="{
								width: '220px',
							}"
						>
							<TreeSelectInputApi
								v-model:queryForm="state.queryForm"
								:style="{ width: '220px' }"
								componentType="userList"
								:settings="{
									getTreeDataParams: {
										lockFlag: 0,
									},
									text: '操作人',
									width: '220px',
									searchFn: getDataList,
									code: 'updateIds',
									selectTreeProps: {
										value: 'userId',
										label: 'name',
										children: 'children',
									},
									getIdsCode: 'userId',
								}"
							/>
						</div>
					</el-form-item>
					<el-form-item>
						<div class="flex item-center">
							<SelectInput
								v-model:queryForm="state.queryForm"
								:searchTypes="[
									{
										label: '物流渠道',
										value: 'courierCode',
									},
									{
										label: '物流服务商',
										value: 'platformCourierCode',
									},
								]"
								:getDataList="getDataList"
								:splitChar="'-|'"
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
				<ToolBar @handleRefresh="getDataList" @handleExport="handleExport">
					<template #left-tool>
						<el-button class="ml10" type="primary" @click="openDialog('add')">
							{{ $t('新建') }}</el-button
						>
						<el-button class="ml10" @click="importDialogRef.show()">
							{{ $t('导入') }}</el-button
						>
						<el-button class="ml10" @click="syncCourier">
							{{ $t('同步') }}</el-button
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
					prop="courierName"
					:label="t('物流渠道名称')"
					show-overflow-tooltip
				/>
				<!-- sortable="custom" -->
				<el-table-column
					prop="warehouseName"
					:label="t('发货仓库')"
					show-overflow-tooltip
					sortable="custom"
				/>
				<el-table-column
					prop="platformCourierCode"
					:label="t('物流商代码')"
					show-overflow-tooltip
					sortable="custom"
				/>
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
		</div>
		<AddDialog
			ref="addDialogRef"
			v-model="addDialogVisible"
			:title="addDialogTitle"
			:editData="currentData"
			@save="saveWarehouse"
			@closeDialog="addDialogVisible = false"
		/>
		<LogDialog
			v-model="logDialogVisible"
			:id="currentRow.id"
			:biz-type="['LOGISTICS_TRACKING_COURIER']"
			:showSearchForm="false"
			:showToolBar="false"
			@closeDialog="closeLogDialog"
		/>
		<ImportDialog
			ref="importDialogRef"
			title="导入物流商"
			templateUrl="/files/import-template/尾程物流渠道及平台服务商匹配关系导入模板.xlsx"
			excelUploadApi="/tracking/logisticsCourier/import"
			@refreshDataList="getDataList"
		/>
	</div>
</template>

<script setup lang="ts">
import { BasicTableProps, useTable } from '/@/hooks/table';
import { useI18n } from 'vue-i18n';
import { defineAsyncComponent, ref, reactive, onMounted } from 'vue';
import { useMessage } from '/@/hooks/message';
import { getWareHouseList } from '/@/api/materialFlow/track';
import {
	logisticsCourierPage,
	courierDetail,
	courierSync,
	exportCourier,
} from '/@/api/materialFlow/providerCode';

const AddDialog = defineAsyncComponent(() => import('./components/add.vue'));
const ToolBar = defineAsyncComponent(
	() => import('/@/components/ToolBar/tool-bar.vue')
);
const LogDialog = defineAsyncComponent(
	() => import('/@/components/log/log-dialog.vue')
);
const CustomCascader = defineAsyncComponent(
	() => import('/@/components/TreeSelectInput/custom-cascader.vue')
);
const ImportDialog = defineAsyncComponent(
	() => import('/@/components/fileUpload/importDialog.vue')
);
const TreeSelectInputApi = defineAsyncComponent(
	() => import('/@/componentsApi/TreeSelectInputApi/index.vue')
);
const { t } = useI18n();
// 搜索变量
const queryRef = ref();
const showSearch = ref(true);

// 仓库数据
const warehouseData = ref<any[]>([]);
// 导入弹窗
const importDialogRef = ref();

const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {},
	loading: false,
	pageList: logisticsCourierPage,
	dataList: [],
	ascs: ['update_time'],
	descs: [],
});
const tableRef = ref();
//  table hook
const {
	getDataList,
	currentChangeHandle,
	sizeChangeHandle,
	sortChangeHandle,
	tableStyle,
} = useTable(state, tableRef);

// 仓库选择相关
const loadWarehouseData = async (searchKeyword = '') => {
	try {
		const res = await getWareHouseList({
			warehouseName: searchKeyword, // 添加搜索参数
		});
		warehouseData.value = res.data.map((item: any) => ({
			id: item.warehouseType,
			warehouseCode: item.warehouseType,
			name: item.warehouseTypeText,
			children: item.warehouses.map((warehouse: any) => ({
				id: warehouse.id,
				warehouseCode: warehouse.warehouseCode,
				name: warehouse.warehouseName,
			})),
		}));
	} catch (error) {
		warehouseData.value = [];
	}
};

onMounted(() => {
	loadWarehouseData(); // 初始化加载仓库数据
});

// 处理仓库搜索
const handleWarehouseSearch = async (keyword: string) => {
	await loadWarehouseData(keyword);
};

// 处理仓库选择变化
const handleWarehouseChange = (values: string[] | number[]) => {
	state.queryForm.warehouseCodes = values;
	getDataList();
};
// 重置
const resetQuery = () => {
	state.queryForm = {
		current: 1,
		size: 10,
	};
	getDataList();
};

// 导出
const handleExport = async () => {
	try {
		const ids = tableRef.value.getSelectionRows()?.map((item: any) => item.id);
		// 显示加载状态
		state.loading = true;
		// 发送请求，设置 responseType 为 'blob' 以接收二进制流
		await exportCourier({
			...state.queryForm,
			ascs: state?.ascs,
			descs: state?.descs,
			ids,
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
		addDialogTitle.value = '新建';
		currentData.value = {}; // 新增时清空内容
	} else if (type === 'edit' && row) {
		addDialogTitle.value = '编辑';
		await getInfo(row.id);
	}
	addDialogVisible.value = true;
};

const getInfo = async (id: string) => {
	const res = await courierDetail(id);
	currentData.value = { ...res.data };
};

// 多选变量
const selectObjs = ref([]) as any;
const multiple = ref(true);
// 当前点击的行
const currentRow = ref({
	id: '',
});
// 多选事件
const handleSelectionChange = (objs: { id: string }[]) => {
	selectObjs.value = objs.map(({ id }) => id);
	multiple.value = !objs.length;
};

// 新增弹窗
const addDialogVisible = ref(false);
const addDialogRef = ref();
const addDialogTitle = ref('添加仓库');

// 新增
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

// 同步
const syncCourier = () => {
	courierSync(1).then(() => {
		useMessage().success(t('同步成功'));
		getDataList();
	});
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
