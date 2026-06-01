<script setup lang="ts">
import { BasicTableProps, useTable } from '/@/hooks/table';
import { useI18n } from 'vue-i18n';
import { defineAsyncComponent, ref, reactive, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useMessage } from '/@/hooks/message';
import {
	getPlatformWarehouseMappingPage,
	getPlatformWarehouseMappingExport,
} from '/@/api/warehouse/platformWarehouse/index';
import { getListByCondition as getListByConditionStore } from '/@/api/mcp/collectionPlan/index';
import { auth } from '/@/utils/authFunction';
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
const TreeSelectInputApi = defineAsyncComponent(
	() => import('/@/componentsApi/TreeSelectInputApi/index.vue')
);
const SelectInputApi = defineAsyncComponent(
	() => import('/@/componentsApi/SelectInputApi/index.vue')
);
const ImportDialog = defineAsyncComponent(
	() => import('/@/components/fileUpload/importDialog.vue')
);

// table的引用
const tableRef = ref();
//   初始化数据

const { t } = useI18n();
const route = useRoute();

// 高级搜索布局的引用
const AdvancedSearchStyleRef = ref();

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

// 日志对话框是否可见
const logDialogVisible = ref(false);

const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {
		// status: 1,
		// skuStatus: 1,
	},
	pageList: getPlatformWarehouseMappingPage,
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
	toggleRowCollapse,
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
		toggleRowCollapse();
		if (type === 'import') {
			//
			importDialogRef.value?.show();
		} else if (type === 'log') {
			logDialogVisible.value = true;
			currentRow.value = row;
		}
	} catch (error: any) {
		useMessage().error(error?.msg || t('错误'));
	}
};

// 导出
const handleExport = async () => {
	try {
		const ids = tableRef.value.getSelectionRows()?.map((item: any) => item.id);
		// 显示加载状态
		state.loading = true;
		// 发送请求，设置 responseType 为 'blob' 以接收二进制流
		await getPlatformWarehouseMappingExport({
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
												label: '仓库名称(平台)',
												value: 'platformWarehouseNames',
											},
											{
												label: '仓库编码(平台)',
												value: 'platformWarehouseCodes',
											},
										]"
										:getDataList="getDataList"
									/>
								</div>
							</el-form-item>
							<el-form-item>
								<TreeSelectInputApi
									v-model:queryForm="state.queryForm"
									componentType="dicts"
									:settings="{
										getTreeDataParams: 'platform_channel',
										text: '平台渠道',
										searchFn: getDataList,
										code: 'platformChannelCode',
										width: '220px',
									}"
								/>
							</el-form-item>
							<el-form-item>
								<div class="flex item-center">
									<SelectInput
										v-model:queryForm="state.queryForm"
										:searchTypes="[
											{
												label: '三方仓库名称',
												value: 'warehouseNames',
											},
											{
												label: '三方仓库编码',
												value: 'warehouseCodes',
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
								<el-input
									v-model="state.queryForm.platformWarehouseSpName"
									placeholder="平台服务商"
									style="width: 200px"
									@blur="getDataList"
								/>
							</el-form-item>
							<el-form-item>
								<SelectInputApi
									v-model="state.queryForm.spId"
									componentType="spInfo"
									placeholder="服务商"
									@change="getDataList"
									:settings="{
										getTreeDataParams: { status: 1 },
										text: '服务商',
										searchFn: getDataList,
										width: '220px',
									}"
								/>
							</el-form-item>
							<el-form-item>
								<TreeSelectInputApi
									v-model:queryForm="state.queryForm"
									:style="{ width: '220px' }"
									:showInputSearch="true"
									:settings="{
                  getTreeData: async () => {
                    const res = await getListByConditionStore()
                    return {
                      code: 0,
                      data: (res.data || []).map((item: any) => ({
                        ...item,
                        label: `[${item.platformChannelCode}]${item.storeName}:${item.siteCode}`,
                      })),
                    }
                  },
                  text: '店铺',
                  width: '220px',
                  code: 'storeIds',
                  searchFn: async () => {
                    await getDataList();
                  },
                  selectTreeProps: {
                    value: 'id',
                    label: 'label',
                  },
                  getIdsCode: 'id',
                }"
								/>
							</el-form-item>
							<el-form-item>
								<TreeSelectInputApi
									componentType="userList"
									text="创建人"
									code="createIds"
									v-model:queryForm="state.queryForm"
									:searchFn="getDataList"
									:settings="{
										text: '创建人',
										width: '220px',
										getTreeDataParams: { lockFlag: 0 },
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
					:is-show-export="auth('enterStock-export')"
				>
					<template #left-tool>
						<el-button
							class="ml10"
							type="primary"
							@click="openDialog('import')"
							v-auth="'enterStock-add'"
						>
							{{ $t('批量导入') }}</el-button
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
				<el-table-column
					align="center"
					type="selection"
					reserve-selection
					width="50"
					fixed="left"
				/>
				<el-table-column
					:label="t('仓库名称(平台)')"
					prop="platformWarehouseName"
					show-overflow-tooltip
					min-width="100"
				>
					<template #default="{ row }">
						{{ row.platformWarehouseName ? row.platformWarehouseName : '---' }}
					</template>
				</el-table-column>
				<el-table-column
					prop="status"
					:label="t('仓库编码(平台)')"
					show-overflow-tooltip
					min-width="100"
				>
					<template #default="{ row }">
						{{ row.platformWarehouseCode || '---' }}
					</template>
				</el-table-column>
				<el-table-column
					prop="platformWarehouseSpName"
					:label="t('仓库服务商(平台)')"
					show-overflow-tooltip
					min-width="100"
				>
					<template #default="{ row }">
						{{ row.platformWarehouseSpName || '---' }}
					</template>
				</el-table-column>
				<el-table-column
					prop="platformChannelCode"
					:label="t('平台渠道')"
					show-overflow-tooltip
					min-width="100"
				>
					<template #default="{ row }">
						{{ row.platformChannelCode || '---' }}
					</template>
				</el-table-column>
				<el-table-column
					prop="storeName"
					:label="t('店铺')"
					show-overflow-tooltip
					min-width="100"
				>
					<template #default="{ row }">
						{{ row.storeName || '---' }}
					</template>
				</el-table-column>
				<el-table-column
					prop="warehouseName"
					:label="t('三方仓名称')"
					show-overflow-tooltip
					min-width="100"
				>
					<template #default="{ row }">
						{{ row.warehouseName || '---' }}
					</template>
				</el-table-column>
				<el-table-column
					prop="warehouseCode"
					:label="t('三方仓编码')"
					show-overflow-tooltip
					min-width="100"
				>
					<template #default="{ row }">
						{{ row.warehouseCode || '---' }}
					</template>
				</el-table-column>
				<el-table-column
					prop="spName"
					:label="t('服务商')"
					show-overflow-tooltip
					min-width="100"
				>
					<template #default="{ row }">
						{{ row.spName || '---' }}
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
			</el-table>
			<pagination
				@current-change="currentChangeHandle"
				@size-change="sizeChangeHandle"
				v-bind="state.pagination"
			/>
		</div>

		<ImportDialog
			ref="importDialogRef"
			title="批量导入平台仓库关系配置"
			templateUrl="/files/import-template/批量新增平台仓库关系配置.xlsx"
			excelUploadApi="/warehouse/platformWarehouseMapping/import"
			:accept="'.xlsx,.xls'"
			@refreshDataList="getDataList"
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
