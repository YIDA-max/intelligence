<script setup lang="ts">
import { BasicTableProps, useTable } from '/@/hooks/table';
import { useI18n } from 'vue-i18n';
import { defineAsyncComponent, ref, reactive } from 'vue';
import {
	getBaseCurrencyPage,
	putBaseCurrencyUpdate,
} from '/@/api/base/exchangeRate/index';
import { ElMessageBox } from 'element-plus';
import dayjs from 'dayjs';
import { useMessage } from '/@/hooks/message';
const ToolBar = defineAsyncComponent(
	() => import('/@/components/ToolBar/tool-bar.vue')
);
const LogDialog = defineAsyncComponent(
	() => import('/@/components/log/log-dialog.vue')
);
const TreeSelectInputApi = defineAsyncComponent(
	() => import('/@/componentsApi/TreeSelectInputApi/index.vue')
);
const AdvancedSearchStyle = defineAsyncComponent(
	() => import('/@/components/TableFormModule/advanced-search-style.vue')
);

const ImportDialog = defineAsyncComponent(
	() => import('/@/components/fileUpload/importDialog.vue')
);
const logDialogVisible = ref(false);
const currentRow = ref<{
	id?: string | number;
}>({});
// table的引用
const tableRef = ref();
//   初始化数据
const { t } = useI18n();

// 高级搜索布局的引用
const AdvancedSearchStyleRef = ref();

// 搜索变量
const queryRef = ref();
// 导入弹窗的引用
const importDialogRef = ref();
// 是否显示搜索
const showSearch = ref(true);

const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {},
	pageList: getBaseCurrencyPage,
	loading: false,
	dataList: [],
	ascs: [],
	descs: [''],
});

//  table hook
const {
	getDataList,
	currentChangeHandle,
	sizeChangeHandle,
	sortChangeHandle,
	tableStyle,
} = useTable(state, tableRef);

onMounted(() => {
	state.queryForm.versionDate = dayjs().format('YYYY-MM');
});

// 打开弹窗
const openDialog = (type: string, row: any) => {
	if (type === 'log') {
		currentRow.value = row;
		logDialogVisible.value = true;
	}
};

/**
 * 保存汇率
 */
const saveExchangeRate = async (row: any) => {
	ElMessageBox.confirm(`${t('确定要保存该币种的汇率吗？')}`, '提示', {
		confirmButtonText: '确认',
		cancelButtonText: '取消',
		type: 'warning',
	})
		.then(async () => {
			const res = await putBaseCurrencyUpdate({
				currencyCode: row.currencyCode,
				rate: Number(row.rate),
				versionDate: row.versionDate,
			});
			if (res.code !== 0) {
				return;
			}
			useMessage().success('保存成功');
			getDataList();
		})
		.catch(() => {
			// 取消操作
			getDataList();
		});
};

// 重置
const resetQuery = async () => {
	// 重置时间组件的查询条件
	state.queryForm = {
		current: 1,
		size: 10,
		descs: [''],
	};
	getDataList();
};
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
								<div>
									<el-date-picker
										v-model="state.queryForm.versionDate"
										@change="getDataList"
										type="month"
										format="YYYY-MM"
										value-format="YYYY-MM"
										:clearable="false"
									/>
								</div>
							</el-form-item>
							<el-form-item>
								<TreeSelectInputApi
									componentType="currency"
									v-model:queryForm="state.queryForm"
									code="currencyCodes"
									@change="getDataList"
									:settings="{
										text: '币种',
										selectTreeProps: {
											value: 'currencyCode',
											label: 'currencyName',
										},
										getIdsCode: 'currencyCodes',
									}"
								/>
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
				<ToolBar @handleRefresh="getDataList" :is-show-export="false">
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
					:label="t('币种')"
					prop="currencyName"
					show-overflow-tooltip
					min-width="100"
				>
					<template #default="{ row }">
						{{ row.currencyName ? row.currencyName : '---' }}
					</template>
				</el-table-column>
				<el-table-column
					prop="status"
					:label="t('币种代码')"
					show-overflow-tooltip
					min-width="100"
				>
					<template #default="{ row }">
						{{ row.currencyCode || '---' }}
					</template>
				</el-table-column>

				<el-table-column prop="rate" :label="t('汇率')" min-width="100">
					<template #default="{ row }">
						<div v-if="row.standardCurrency === 0">
							{{ row.rate || '---' }}
						</div>
						<div
							v-else
							@mouseenter="row.showFullRate = true"
							@mouseleave="row.showFullRate = false"
						>
							<div v-if="!row.showFullRate" class="w-full cursor-pointer">
								{{ row.rate }}
							</div>
							<div v-else class="w-full cursor-pointer">
								<el-row>
									<el-col :span="18">
										<el-input
											v-model="row.rate"
											size="mini"
											style="width: 100%"
											type="number"
											min="0"
											step="0.0001"
											@change="row.rate = Number(row.rate).toFixed(4)"
										></el-input>
									</el-col>
									<el-col :span="5" class="ml-1">
										<el-link
											type="primary"
											@click="saveExchangeRate(row)"
											underline="never"
											>{{ $t('保存') }}</el-link
										>
									</el-col>
								</el-row>
							</div>
						</div>
					</template>
				</el-table-column>
				<el-table-column
					prop="standardCurrency ? '是' : '否"
					:label="t('是否本位币')"
					show-overflow-tooltip
					min-width="100"
				>
					<template #default="{ row }">
						{{ row.standardCurrency == 0 ? '是' : '否' }}
					</template>
				</el-table-column>
				<el-table-column
					prop="updateName"
					:label="t('更新人')"
					show-overflow-tooltip
					min-width="100"
				>
					<template #default="{ row }">
						{{ row.updateName || '---' }}
					</template>
				</el-table-column>
				<el-table-column
					prop="updateTime"
					:label="t('更新时间')"
					show-overflow-tooltip
					min-width="100"
				>
					<template #default="{ row }">
						{{ row.updateTime || '---' }}
					</template>
				</el-table-column>
				<el-table-column :label="$t('common.action')" fixed="right" width="150">
					<template #default="{ row }">
						<div class="flex items-center">
							<el-button
								text
								type="primary"
								class="mr20"
								v-auth="'clearCustoms_log'"
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
		</div>

		<ImportDialog
			ref="importDialogRef"
			title="导入需求计划"
			templateUrl="/files/import-template/批量新增平台仓库关系配置.xlsx"
			excelUploadApi="/warehouse/platformWarehouseMapping/import"
			:accept="'.xlsx,.xls'"
			@refreshDataList="getDataList"
		/>
		<!-- 日志 -->
		<LogDialog
			v-model="logDialogVisible"
			:id="currentRow.id"
			:biz-type="['CURRENCY_RATE']"
			:showSearchForm="false"
			:showToolBar="false"
			@closeDialog="
				() => {
					logDialogVisible = false;
				}
			"
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
