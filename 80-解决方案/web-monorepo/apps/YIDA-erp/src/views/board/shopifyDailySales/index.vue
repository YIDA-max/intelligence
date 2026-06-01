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
					<AdvancedSearchStyle
						ref="AdvancedSearchStyleRef"
						showRightBtn
						@reset="resetQuery"
						@search="getDataList"
					>
						<template #default>
							<el-form-item>
								<custom-cascader
									v-model:queryForm="state.queryForm"
									:data="storeData"
									:settings="{
										code: 'storeIds',
										text: '站点/店铺',
										width: '190px',
										props: {
											value: 'id',
											label: 'name',
											children: 'children',
										},
										checkStrictly: false,
										showSelectAll: false,
									}"
									@change="getDataList"
								/>
							</el-form-item>
							<el-form-item>
								<SelectDate
									v-model:queryForm="state.queryForm"
									:searchTypes="[
										{
											label: '订单时间',
											value: 'createTime',
											isAddHMS: true,
											dateStart: 'createTimeStart',
											dateEnd: 'createTimeEnd',
										},
									]"
									:getDataList="getDataList"
								/>
							</el-form-item>
							<el-form-item>
								<SelectInput
									v-model:queryForm="state.queryForm"
									:searchTypes="[
										{
											label: '订单号',
											value: 'orderIds',
										},
										{
											label: 'SKU',
											value: 'skus',
										},
										{
											label: 'MSKU',
											value: 'mskus',
										},
									]"
									:getDataList="getDataList"
								/>
							</el-form-item>
						</template>
					</AdvancedSearchStyle>
				</el-form>
			</el-row>
			<el-row>
				<ToolBar
					@handleRefresh="getDataList"
					@handle-export="handleExport"
					:is-show-export="auth('shopifyDailySales_export')"
				>
					<template #left-tool>
						<el-button
							type="primary"
							class="ml10"
							@click="generatedClickHandle"
							v-auth="'shopifyDailySales_generateReport'"
							>{{ $t('生成数据') }}
						</el-button>
					</template>
				</ToolBar>
			</el-row>
			<mrTable
				:data="state.dataList"
				v-loading="state.loading"
				@sort-change="sortChangeHandle"
				ref="tableRef"
			>
				<MrTableColumn
					v-for="item in tableList"
					:key="item.prop"
					v-bind="item"
					:label="t(item.label)"
				>
					<template #default="{ row }" v-if="item.type !== 'selection'">
						{{ formatValue(row, item) }}
					</template>
				</MrTableColumn>
			</mrTable>
			<pagination
				@current-change="currentChangeHandle"
				@size-change="sizeChangeHandle"
				v-bind="state.pagination"
			/>
			<confirm-dialog
				:title="'生成数据确认'"
				width="25%"
				ref="confirmRef"
				:show-icon="true"
				:confirm-button-text="'确认'"
				icon-type="info"
				@cancel="confirmRef.hide()"
				@confirm="handleConfirmGenerate"
			>
				<el-form
					:model="formData"
					ref="formRef"
					:inline="false"
					label-position="left"
				>
					<el-form-item label="创建时间">
						<el-date-picker
							style="width: 100%"
							v-model="formData.timeRange"
							type="daterange"
							start-placeholder="开始日期"
							end-placeholder="结束日期"
							:default-time="defaultTime"
						/>
					</el-form-item>
				</el-form>
			</confirm-dialog>
			<!-- 使用公共进度组件 -->
			<UploadProgressDialog
				v-model="progressDialogVisible"
				title="生成数据进度"
				ref="progressDialogRef"
			/>
		</div>
	</div>
</template>

<script setup lang="ts">
import { BasicTableProps, useTable } from '/@/hooks/table';
import { useI18n } from 'vue-i18n';
import { defineAsyncComponent, ref, reactive, onMounted } from 'vue';
import { useMessage } from '/@/hooks/message';

import { auth } from '/@/utils/authFunction';
import { list } from './list';

import { getGroupStoreByPlatform } from '/@/api/base/store/index';
import {
	getShopifyDailySalesPage,
	getExportShopifyDailySales,
	postGenerateReport,
} from '/@/api/financial/shopifyDailySales/index';

const ToolBar = defineAsyncComponent(
	() => import('/@/components/ToolBar/tool-bar.vue')
);
const SelectInput = defineAsyncComponent(
	() => import('/@/components/TableFormModule/select-input.vue')
);
const AdvancedSearchStyle = defineAsyncComponent(
	() => import('/@/components/TableFormModule/advanced-search-style.vue')
);
const CustomCascader = defineAsyncComponent(
	() => import('/@/components/TreeSelectInput/custom-cascader.vue')
);
const SelectDate = defineAsyncComponent(
	() => import('/@/components/TableFormModule/select-date.vue')
);
const MrTable = defineAsyncComponent(
	() => import('/@/common/MrTable/index.vue')
);
const MrTableColumn = defineAsyncComponent(
	() => import('/@/common/MrTableColumn/index.vue')
);
const ConfirmDialog = defineAsyncComponent(
	() => import('/@/components/ConfirmDialog/index.vue')
);
const UploadProgressDialog = defineAsyncComponent(
	() => import('/@/components/ProgressDialog/index.vue')
);
// table的引用
const tableRef = ref();
// 表格列配置
const tableList = ref(list);
// const { open } = useResultDialog();
const { t } = useI18n();

// 搜索变量
const queryRef = ref();
// 是否显示搜索
const showSearch = ref(true);
// 高级搜索布局的引用
const AdvancedSearchStyleRef = ref();
const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {},
	pageList: getShopifyDailySalesPage,
	loading: false,
	dataList: [],
	ascs: [],
	descs: ['create_time'],
});
//  table hook
const { getDataList, currentChangeHandle, sizeChangeHandle, sortChangeHandle } =
	useTable(state, tableRef.value?.elTableRef() || null);

// 格式化数据
function formatValue(row: any, column: any) {
	// 获取列的 prop
	const value = row?.[column.prop];
	if (value === null || value === undefined || value === '') {
		return '-';
	}

	// 获取列的 cType 配置
	const cType = column?.cType;

	if (cType === 'num') {
		const num = Number(value);
		if (isNaN(num)) {
			return '-';
		}
		return num.toFixed(2);
	}

	return value;
}

// 重置
const resetQuery = () => {
	state.queryForm = {
		current: 1,
		size: 10,
		status: 1, // 默认启用
	};
	getDataList();
};

/***
 * 导出
 */
const handleExport = async () => {
	try {
		// 优先使用 getSelectionRows 方法，如果不可用则使用 selectedRows 变量
		const selectedRowsData =
			tableRef.value?.elTableRef()?.getSelectionRows?.() || [];
		const ids = selectedRowsData.map((item: any) => item.reportId);
		// 显示加载状态
		state.loading = true;
		const api = getExportShopifyDailySales;
		// 发送请求，设置 responseType 为 'blob' 以接收二进制流
		await api({
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

onMounted(() => {
	// 初始加载仓库数据
	loadStoreData();
});

// 仓库数据
const storeData = ref<Array<any>>([]);
// 仓库选择相关
const loadStoreData = async () => {
	try {
		const res = await getGroupStoreByPlatform({
			platformChannelCode: 'Shopify',
		});

		storeData.value = res.data.map((item: any) => ({
			id: item.siteCode,
			name: item.siteCode,
			children: item.stores.map((val: any) => ({
				id: val.id,
				name: val.storeName,
			})),
		}));
	} catch (error) {
		storeData.value = [];
	}
};

const confirmRef = ref<any>(null);
const formRef = ref<any>(null);

const formData = ref({
	timeRange: [] as Date[],
});
const defaultTime = [
	new Date(2000, 1, 1, 0, 0, 0), // Start time: 00:00:00
	new Date(2000, 1, 1, 23, 59, 59), // End time: 23:59:59
];
const getDefaultDateRange = (): [Date, Date] => {
	const today = new Date();
	const yesterday = new Date(today);
	yesterday.setDate(today.getDate() - 1);

	const startDate = new Date(yesterday);
	startDate.setHours(0, 0, 0, 0);

	const endDate = new Date(yesterday);
	endDate.setHours(23, 59, 59, 999);

	return [startDate, endDate];
};

// 生成数据
const generatedClickHandle = async () => {
	formData.value.timeRange = getDefaultDateRange();
	confirmRef.value.show();
};

// 进度对话框引用与可见性（进度由 ProgressDialog 管理）
const progressDialogVisible = ref(false);
const progressDialogRef = ref<any>(null);

const handleConfirmGenerate = async () => {
	if (!formData.value.timeRange || formData.value.timeRange.length !== 2) {
		useMessage().error('请选择有效的时间范围');
		return;
	}
	if (progressDialogRef.value?.startFakeProgress) {
		progressDialogRef.value.startFakeProgress(0);
	} else {
		progressDialogVisible.value = true;
	}
	// 格式化日期为 YYYY-MM-DD HH:mm:ss
	const formatDate = (date: Date) => {
		const year = date.getFullYear();
		const month = String(date.getMonth() + 1).padStart(2, '0');
		const day = String(date.getDate()).padStart(2, '0');
		const hours = String(date.getHours()).padStart(2, '0');
		const minutes = String(date.getMinutes()).padStart(2, '0');
		const seconds = String(date.getSeconds()).padStart(2, '0');
		return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
	};
	try {
		// 显示加载状态
		state.loading = true;
		const res = await postGenerateReport({
			createdAtStart: formatDate(formData.value.timeRange[0]),
			createdAtEnd: formatDate(formData.value.timeRange[1]),
		});

		if (res.code === 0) {
			useMessage().success(res.msg || '生成成功');
			confirmRef.value.hide();
			getDataList();
		} else {
			useMessage().error(res.msg || '生成失败');
		}
		if (progressDialogRef.value?.stopFakeProgress)
			progressDialogRef.value.stopFakeProgress();
		progressDialogVisible.value = false;
	} catch (error) {
		useMessage().error(t(error as string));
	} finally {
		// 隐藏加载状态
		state.loading = false;
		if (progressDialogRef.value?.stopFakeProgress)
			progressDialogRef.value.stopFakeProgress();
		progressDialogVisible.value = false;
	}
};
</script>

<style lang="scss" scoped>
.tabel-header-flex {
	display: flex;
	align-items: center;
	gap: 4px;
}
</style>
