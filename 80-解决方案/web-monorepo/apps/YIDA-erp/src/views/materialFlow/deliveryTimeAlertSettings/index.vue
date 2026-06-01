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
						<div class="flex item-center">
							<TreeSelectInputApi
								componentType="dicts"
								code="platformChannelCodes"
								v-model:queryForm="state.queryForm"
								:searchFn="getDataList"
								:settings="{
									text: '平台',
									getTreeDataParams: 'platform_channel',
									getIdsCode: 'id',
								}"
							/>
						</div>
					</el-form-item>
					<el-form-item>
						<div class="flex item-center">
							<TreeSelectInputApi
								componentType="country"
								code="countryCodes"
								v-model:queryForm="state.queryForm"
								:searchFn="getDataList"
								:settings="{
									text: '国家',
								}"
							/>
						</div>
					</el-form-item>
					<el-form-item>
						<TreeSelectInputApi
							componentType="userList"
							code="updateIds"
							v-model:queryForm="state.queryForm"
							:searchFn="getDataList"
							:settings="{
								text: '更新人',
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
										label: '更新时间',
										value: 'updateTime',
										isAddHMS: true,
										dateStart: 'updateTimeStart',
										dateEnd: 'updateTimeEnd',
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
					:is-show-export="auth('delivery_time_alert_export')"
				>
					<template #left-tool>
						<el-button
							class="ml10"
							@click="openDialog('input')"
							v-auth="'delivery_time_alert_import'"
						>
							{{ $t('导入') }}</el-button
						>
						<el-button
							class="ml10"
							@click="openDialog('add')"
							v-auth="'delivery_time_alert_add'"
						>
							{{ $t('新增') }}</el-button
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
				show-summary
				:summary-method="getSummaries"
			>
				<el-table-column
					align="center"
					type="selection"
					width="60"
					reserve-selection
					fixed
				/>
				<el-table-column
					v-for="column in tableColumns"
					:key="column.prop"
					:prop="column.prop"
					:label="column.label"
					:width="column.width"
					:show-overflow-tooltip="column.showOverflowTooltip"
				>
					<template #default="{ row }">
						<span>{{ formatValue(row[column.prop], column, row) }}</span>
					</template>
				</el-table-column>
				<el-table-column :label="$t('common.action')" width="180" fixed="right">
					<template #default="{ row }">
						<div class="flex items-center">
							<el-button
								text
								type="primary"
								class="mr20"
								@click="openDialog('edit', row)"
								v-auth="'delivery_time_alert_edit'"
								>{{ $t('编辑') }}
							</el-button>
							<el-button
								text
								type="primary"
								class="mr20"
								@click="openDialog('log', row)"
								v-auth="'delivery_time_alert_log'"
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
		<!-- 日志 -->
		<LogDialog
			v-model="logDialogVisible"
			:id="currentRow.id"
			:biz-type="['SHIPMENT_DELAY_ALERT']"
			:showSearchForm="false"
			:showToolBar="false"
			@closeDialog="
				() => {
					logDialogVisible = false;
				}
			"
		/>
		<FormDialog
			ref="formDialog"
			:rowData="currentRow"
			:title="addDialogTitle"
			@save="getDataList"
			:dictMap="dictMap"
		/>
		<ImportDialog
			ref="importDialogRef"
			title="导入货件时效配置表"
			templateUrl="/files/import-template/导入货件时效预警设置.xlsx"
			excelUploadApi="/mcp/shipmentDelayAlert/import"
			@refreshDataList="getDataList"
		/>
	</div>
</template>

<script setup lang="ts">
import { BasicTableProps, useTable } from '/@/hooks/table';
import { useI18n } from 'vue-i18n';
import { defineAsyncComponent, ref, reactive } from 'vue';
import { useMessage } from '/@/hooks/message';
import {
	getDeliveryTimeList,
	exportDeliveryTimeList,
	freightForwarDerdetails,
} from '/@/api/materialFlow/deliveryTimeAlertSettings/index';
import { auth } from '/@/utils/authFunction';
import { useTableSummary } from '/@/hooks/useTableSummary';
import { useMultipleDicts } from '/@/hooks/multipleDicts';
import { getBasePortListByCondition } from '/@/api/all-base-data/index';
import { useFormatter } from '/@/hooks/useFormatter';
const ImportDialog = defineAsyncComponent(
	() => import('/@/components/fileUpload/importDialog.vue')
);
const TreeSelectInputApi = defineAsyncComponent(
	() => import('/@/componentsApi/TreeSelectInputApi/index.vue')
);
const LogDialog = defineAsyncComponent(
	() => import('/@/components/log/log-dialog.vue')
);
const ToolBar = defineAsyncComponent(
	() => import('/@/components/ToolBar/tool-bar.vue')
);

const FormDialog = defineAsyncComponent(
	() => import('./components/form-dialog.vue')
);
const { formatValue } = useFormatter();
const logDialogVisible = ref(false);
const { t } = useI18n();
// 搜索变量
const queryRef = ref();
// table的引用
const tableRef = ref();
// 是否显示搜索
const showSearch = ref(true);
//选中行
const currentRow = ref({
	id: '',
});
const { getSummaries } = useTableSummary([
	{ prop: 'availableQuantity' },
	{ prop: 'allocatedQuantity' },
]);
const { dictMap } = useMultipleDicts(
	[
		{
			key: 'basePortListByCondition',
			fetchFn: getBasePortListByCondition,
		}, // 国家港口列表
	],
	{
		isAuto: true, // 是否自动获取数据
		tableRef,
	}
);
const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {},
	pageList: getDeliveryTimeList,
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

const tableColumns = [
	{
		prop: 'platformChannelCodeText',
		label: '平台渠道',
		width: 160,
		showOverflowTooltip: true,
	},
	{
		prop: 'countryCodeText',
		label: '国家',
		width: 180,
		type: 'country',
		formatter: (row: any) => {
			const countryCode = row.countryCode || '---'; // 确保字段存在
			const countryCodeText = row.countryCodeText || '---'; // 确保字段存在
			return `${countryCode}-${countryCodeText}`;
		},
	},
	{
		prop: 'portText',
		label: '港口',
		width: 160,
		formatter: (row: any) => {
			const portCode = row.portCode || '---'; // 确保字段存在
			const porteText = row.portText || '---'; // 确保字段存在
			return `${portCode}-${porteText}`;
		},
	},
	{
		prop: 'expirationDate',
		label: '货件有效期',
		width: 180,
		showOverflowTooltip: true,
	},
	{
		prop: 'warningDays',
		label: '预警天数',
		width: 180,
		showOverflowTooltip: true,
	},
	{
		prop: 'remark',
		label: '备注',
		width: 160,
		showOverflowTooltip: true,
	},
	{
		prop: 'updateName',
		label: '更新人',
		width: 200,
		showOverflowTooltip: true,
	},
	{
		prop: 'updateTime',
		label: '更新时间',
		width: 200,
		showOverflowTooltip: true,
	},
];
// const tableData = [
// 	{
// 		storeSite: 'Cdiscount',
// 		imgUrl: 'https://flagcdn.com/w40/fr.png',
// 		skuName: 'Marseille 港口',
// 		productId: '2026-12-31',
// 		productState: 45,
// 		productCondition: '正常',
// 		sellerId: 'Tom',
// 		mskuCode: '2026-01-08 10:23:11',
// 	},
// 	{
// 		storeSite: 'Amazon',
// 		imgUrl: 'https://flagcdn.com/w40/de.png',
// 		skuName: 'Hamburg 港口',
// 		productId: '2026-06-15',
// 		productState: 12,
// 		productCondition: '临期',
// 		sellerId: 'Lisa',
// 		mskuCode: '2026-01-07 18:42:30',
// 	},
// 	{
// 		storeSite: 'Shopee',
// 		imgUrl: 'https://flagcdn.com/w40/sg.png',
// 		skuName: 'Singapore 港口',
// 		productId: '2027-02-20',
// 		productState: 120,
// 		productCondition: '正常',
// 		sellerId: 'Jack',
// 		mskuCode: '2026-01-05 09:11:05',
// 	},
// 	{
// 		storeSite: 'Lazada',
// 		imgUrl: 'https://flagcdn.com/w40/th.png',
// 		skuName: 'Bangkok 港口',
// 		productId: '2026-02-01',
// 		productState: 3,
// 		productCondition: '即将过期',
// 		sellerId: 'Amy',
// 		mskuCode: '2026-01-09 14:02:55',
// 	},
// 	{
// 		storeSite: 'Cdiscount',
// 		imgUrl: 'https://flagcdn.com/w40/fr.png',
// 		skuName: 'Lyon 港口',
// 		productId: '2026-11-10',
// 		productState: 80,
// 		productCondition: '正常',
// 		sellerId: 'Kevin',
// 		mskuCode: '2026-01-10 08:30:40',
// 	},
// ];

// 重置
// 清空搜索条件
const resetQuery = () => {
	resetTableQuery(() => {
		return {
			queryForm: {
				current: 1,
				size: 10,
			},
			descs: ['create_time'],
			ascs: [],
		};
	});
};

const addDialogTitle = ref('');
const importDialogRef = ref();

const formDialog = ref();
// 导出
const exportPartFn = async () => {
	try {
		const ids = tableRef.value.getSelectionRows().map((item: any) => item.id);
		state.loading = true;
		/* eslint-disable  */
		const params =
			ids.length > 0
				? { ids }
				: {
						...state.queryForm,
						ascs: state?.ascs,
						descs: state?.descs,
						current: 1,
						size: 10000,
				  };
		/* eslint-enable  */
		await exportDeliveryTimeList(params);
	} catch (error) {
		useMessage().error(t(error as string));
	} finally {
		state.loading = false;
	}
};

const openDialog = async (type: string, row?: any) => {
	if (type === 'add') {
		addDialogTitle.value = '新增';
		formDialog.value.handleOpen({}, 'add');
	} else if (type === 'edit') {
		const res = await freightForwarDerdetails({ id: row.id });
		if (res.code !== 0) {
			useMessage().error(res.msg || '获取数据失败');
			return;
		}
		addDialogTitle.value = '编辑';
		formDialog.value.handleOpen(res.data, 'edit');
	} else if (type === 'log') {
		logDialogVisible.value = true;
		currentRow.value = row;
	} else if (type === 'input') {
		importDialogRef.value.show();
		return;
	}
};

// 查询所有的数据
const resetData = () => {
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
	word-break: break-all;
	white-space: pre-line;
	cursor: pointer;
	text-align: left;
}
.el-dropdown-link {
	cursor: pointer;
	color: var(--el-color-primary);
	display: flex;
	align-items: center;
}
:deep(.el-table__footer-wrapper tfoot td.el-table__cell) {
	text-align: center;
}
</style>
