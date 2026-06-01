<!--
  物流费用 — 尾程费用列表（骨架）
-->
<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-row class="ml10" v-show="showSearch">
				<el-form
					:inline="true"
					:model="state.queryForm"
					@keyup.enter="getDataList"
				>
					<AdvancedSearchStyle>
						<template #default>
							<el-form-item>
								<div class="flex item-center">
									<SelectInput
										v-model:queryForm="state.queryForm"
										:searchTypes="[
											{ label: '平台订单号', value: 'platformOrderNos' },
											{ label: '系统订单号', value: 'selfOrderNos' },
											{ label: '仓库单号', value: 'warehouseOrderNos' },
											{ label: '运单号', value: 'waybillNos' },
											{ label: '跟踪号', value: 'logisticsTrackingNos' },
										]"
										:settings="{
											selectStyle: { width: '170px' },
										}"
										:getDataList="getDataList"
									/>
								</div>
							</el-form-item>
							<el-form-item>
								<CustomCascaderApi
									v-model:queryForm="state.queryForm"
									:getData="getWarehouseTreeData"
									:settings="{
										code: 'warehouseCodes',
										text: '发货仓',
										props: {
											value: 'name',
											label: 'name',
											children: 'children',
										},
										width: '220px',
										checkStrictly: false,
										showSelectAll: false,
									}"
									@change="getDataList"
								/>
							</el-form-item>
							<el-form-item>
								<TreeSelectInputApi
									v-model:queryForm="state.queryForm"
									componentType="logisticsChannel"
									multiple
									:settings="{
										text: '物流渠道',
										code: 'logisticsCodes',
										width: '220px',
										searchFn: getDataList,
										getTreeDataParams: {
											current: 1,
											size: 1000000000000,
											statuses: [1],
										},
									}"
								/>
							</el-form-item>
							<el-form-item>
								<CustomCascaderApi
									v-model:queryForm="state.queryForm"
									componentType="siteStoreId"
									:settings="{
										code: 'storeIds',
										text: '平台店铺',
										width: '220px',
									}"
									@change="getDataList"
								/>
							</el-form-item>
							<el-form-item>
								<TreeSelectInputApi
									v-model:queryForm="state.queryForm"
									componentType="qianyiSupplierMerge"
									multiple
									:settings="{
										text: '物流商',
										code: 'logisticsProviders',
										searchFn: getDataList,
										width: '220px',
									}"
								/>
							</el-form-item>

							<el-form-item>
								<TreeSelectInputApi
									v-model:queryForm="state.queryForm"
									componentType="country"
									multiple
									:settings="{
										text: '目的国家',
										code: 'destCountryCodes',
										searchFn: getDataList,
										width: '220px',
									}"
								/>
							</el-form-item>
							<el-form-item>
								<TreeSelectInputApi
									v-model:queryForm="state.queryForm"
									componentType="feeTypeList"
									multiple
									:settings="{
										text: '尾程费用项',
										code: 'feeItemCodes',
										searchFn: getDataList,
										width: '220px',
									}"
								/>
							</el-form-item>

							<el-form-item>
								<QueryField
									v-model:queryForm="state.queryForm"
									:searchTypes="[
										{ type: 'single', label: '大于（>）', value: 1 },
										{ type: 'single', label: '小于（<）', value: 2 },
										{ type: 'single', label: '等于（=）', value: 3 },
										{ type: 'range', label: '介于', value: 4 },
										{ type: 'empty', label: '空值', value: 5 },
									]"
									:typeKey="'operatorType'"
									:valuesKey="'values'"
									:label="'费用差额'"
									:getDataList="getDataList"
								/>
							</el-form-item>
							<el-form-item>
								<el-select
									v-model="state.queryForm.feeEnteredFlag"
									clearable
									placeholder="录入实际费用"
									style="width: 150px"
									@change="getDataList"
								>
									<el-option
										v-for="opt in FEE_ENTRY_STATUS_OPTIONS"
										:key="opt.value"
										:label="opt.label"
										:value="opt.value"
									/>
								</el-select>
							</el-form-item>
							<el-form-item>
								<SelectDate
									v-model:queryForm="state.queryForm"
									:settings="{
										selectStyle: { width: '140px' },
										dateStyle: { width: '130px' },
									}"
									:searchTypes="[
										{
											label: '发货时间',
											value: 'shipTime',
											dateStart: 'shipTimeStart',
											dateEnd: 'shipTimeEnd',
											isAddHMS: true,
										},
									]"
									:getDataList="getDataList"
								/>
							</el-form-item>
						</template>
						<template #right>
							<el-form-item>
								<el-button type="primary" @click="getDataList">{{
									t('搜索')
								}}</el-button>
								<el-button type="info" plain @click="resetQuery">{{
									t('common.resetBtn')
								}}</el-button>
							</el-form-item>
						</template>
					</AdvancedSearchStyle>
				</el-form>
			</el-row>

			<BaseTable
				ref="baseTableRef"
				:register="register"
				:row-config="{ keyField: 'id' }"
			>
				<template #left-tool>
					<el-button
						class="ml10"
						type="primary"
						@click="importDialogRef?.show?.()"
					>
						导入实际费用
					</el-button>
					<el-button class="ml10" @click="handleExport('actual')">
						导出实际费用明细
					</el-button>
					<el-button class="ml10" @click="handleExport('list')">
						导出列表字段
					</el-button>
				</template>
				<template #storeSite="{ row }">
					<!-- 店铺:站点 -->
					{{ row.storeName }}:{{ row.storeSite }}
				</template>
				<template #action="{ row }">
					<el-button link type="primary" @click="openDialog('fee', row)">
						录入实际费用
					</el-button>
					<el-button link type="primary" @click="openDialog('log', row)">
						{{ t('日志') }}
					</el-button>
				</template>
			</BaseTable>
		</div>
		<FeeDialog ref="feeDialogRef" @success="getDataList" />
		<ImportDialog
			ref="importDialogRef"
			title="导入实际费用"
			templateUrl="/files/import-template/尾程费用导入模板.xlsx"
			excelUploadApi="/mcp/last-mile/fee/import"
			:accept="'.xlsx,.xls'"
			@refreshDataList="getDataList"
		/>
		<LogDialog
			v-model="logDialogVisible"
			:id="currentRow.id"
			:biz-type="['LOGISTICS_LAST_MILE']"
			:showSearchForm="false"
			:showToolBar="false"
			@closeDialog="logDialogVisible = false"
		/>
	</div>
</template>

<script setup lang="ts">
import {
	BasicTableProps,
	useTable,
} from '/@/components/BaseTable/hooks/BaseTable';
import { useI18n } from 'vue-i18n';
import { defineAsyncComponent, ref, reactive } from 'vue';
import { useMessage } from '/@/hooks/message';
import {
	getLastMileFeePage,
	postLastMileFeeExportDetail,
	postLastMileFeeExport,
} from '/@/api/materialFlow/logisticsFee/lastMileFee/index';
import { getWareHouseList } from '/@/api/materialFlow/track';
import FeeDialog from './components/FeeDialog.vue';
import QueryField from '/@/components/QueryField/index.vue';
import CustomCascaderApi from '/@/componentsApi/customCascaderApi/index.vue';
import { columns, FEE_ENTRY_STATUS_OPTIONS, moduleKey } from './config/index';

const LogDialog = defineAsyncComponent(
	() => import('/@/components/log/log-dialog.vue')
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
const ImportDialog = defineAsyncComponent(
	() => import('/@/components/fileUpload/importDialog.vue')
);
const { t } = useI18n();

const baseTableRef = ref();
const showSearch = ref(true);
const feeDialogRef = ref<InstanceType<typeof FeeDialog>>();
const importDialogRef = ref();
const logDialogVisible = ref(false);
const currentRow = ref<{ id?: string }>({ id: '' });

const state = reactive<BasicTableProps>({
	queryForm: {
		storeIds: [],
	},
	pageList: getLastMileFeePage,
	beforeQueryParamsHandle(queryForm: Record<string, any>) {
		const v = queryForm.values;

		if (Array.isArray(v)) {
			// 检查是否数组所有元素都是数字或 null
			const isValidNumbers = v.every(
				(item: unknown) => typeof item === 'number' || item === null
			);

			if (isValidNumbers) {
				// 如果全是数字或 null，执行转换：null 变 0
				queryForm.values = v.map((item: unknown) => (item === null ? 0 : item));
			} else {
				// 包含非数字元素（如字符串、对象等），删除 operatorType
				delete queryForm.operatorType;
			}
		} else {
			// 不是数组，删除整个 values 属性
			delete queryForm.values;
		}
		return queryForm;
	},
	columns,
	loading: false,
	dataList: [],
	toolBarConfig: {
		handleRefresh: () => register?.getDataList(),
		handleExport: () => postLastMileFeeExport(),
		settingKey: `${moduleKey}_index`,
	},
});

const { register, getDataList, resetTableQuery } = useTable(
	state,
	baseTableRef
);

/**
 * 发货仓：自定义数据加载（供 CustomCascaderApi 使用）
 * - 初次加载会调用一次
 * - 搜索时由 handleWarehouseSearch 复用同一逻辑
 */
const getWarehouseTreeData = async (params?: Record<string, any>) => {
	try {
		const res = await getWareHouseList({
			warehouseName: params?.warehouseName ?? '',
			warehouseTypes: [0, 1, 3],
		});
		return (res?.data ?? []).map((item: any) => ({
			id: item.warehouseType,
			name: item.warehouseTypeText,
			warehouseCode: item.warehouseCode,
			children: (item.warehouses ?? []).map((warehouse: any) => ({
				id: warehouse.id,
				name: warehouse.warehouseName,
				warehouseCode: warehouse.warehouseCode,
			})),
		}));
	} catch (error) {
		return [];
	}
};

/**
 * 重置查询
 */
const resetQuery = () => {
	resetTableQuery(() => ({
		queryForm: { storeIds: [] },
		descs: [],
		ascs: [],
	}));
};

/**
 * 导出实际费用明细
 */
const handleExport = async (type: 'actual' | 'list') => {
	const ids = register.getSelectedIds();
	const hasFilter = Object.values(state.queryForm || {}).some((val) => {
		if (val === 0) return true;
		if (val === false) return true;
		if (val == null) return false;
		if (Array.isArray(val)) return val.length > 0;
		if (typeof val === 'string') return val.trim().length > 0;
		return true;
	});
	const isExportAll = !ids.length && !hasFilter;
	state.loading = true;
	try {
		const payload: Record<string, unknown> = {
			...state.queryForm,
			ascs: state.ascs,
			descs: state.descs,
			ids: ids.length ? ids : undefined,
		};
		// 无勾选 & 无筛选：默认导出所有（不传分页参数）
		if (!isExportAll) {
			payload.current = state.pagination?.current;
			payload.size = state.pagination?.size;
		}
		if (type === 'actual') {
			await postLastMileFeeExportDetail(payload);
		} else if (type === 'list') {
			await postLastMileFeeExport(payload);
		}
	} catch (err) {
		useMessage().error(t(err as string));
	} finally {
		state.loading = false;
	}
};

type LastMileListDialogType = 'fee' | 'log';

/**
 * 操作列统一入口（录入费用 / 日志）
 */
const openDialog = async (type: LastMileListDialogType, row?: any) => {
	try {
		if (type === 'fee') {
			feeDialogRef.value?.open('actual', row.selfOrderNo);
		} else if (type === 'log') {
			currentRow.value = { id: row?.id };
			logDialogVisible.value = true;
		}
	} catch (error: unknown) {
		useMessage().error((error as { msg?: string })?.msg || t('错误'));
	}
};
</script>
