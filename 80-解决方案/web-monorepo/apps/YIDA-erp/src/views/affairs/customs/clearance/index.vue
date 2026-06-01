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
								<el-select
									v-model="state.queryForm.processStatusList"
									collapse-tags
									:max-collapse-tags="1"
									clearable
									filterable
									multiple
									placeholder="状态"
									style="width: 200px"
									@change="getDataList"
								>
									<el-option
										v-for="item in [
											{
												label: '待处理',
												value: 1,
											},
											{
												label: '已处理',
												value: 2,
											},
										]"
										:key="item.value"
										:label="item.label"
										:value="item.value"
									/>
								</el-select>
							</el-form-item>
							<el-form-item>
								<TreeSelectInputApi
									v-model:queryForm="state.queryForm"
									componentType="basePort"
									:settings="{
										code: 'startPortCodeList',
										text: '起始港口',
										searchFn: getDataList,
									}"
								/>
							</el-form-item>
							<el-form-item>
								<TreeSelectInputApi
									v-model:queryForm="state.queryForm"
									componentType="basePort"
									:settings="{
										code: 'destPortCodeList',
										text: '目的港口',
										searchFn: getDataList,
									}"
								/>
							</el-form-item>
							<el-form-item>
								<TreeSelectInputApi
									v-model:queryForm="state.queryForm"
									componentType="country"
									:settings="{
										code: 'destCountryCodeList',
										text: '目的国',
										searchFn: getDataList,
									}"
								/>
							</el-form-item>
							<el-form-item>
								<TreeSelectInputApi
									v-model:queryForm="state.queryForm"
									componentType="freightForwarder"
									:settings="{
										code: 'domesticForwarderNoList',
										text: '拖车报关',
										searchFn: getDataList,
										getTreeDataParams: {
											forwarderTypes: [1],
										},
										selectTreeProps: {
											value: 'forwarderCode',
											label: 'forwarderName',
										},
										getIdsCode: 'forwarderCode',
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
												value: 'createdTime',
												isAddHMS: true,
												dateStart: 'createTimeStart',
												dateEnd: 'createTimeEnd',
											},
										]"
										:getDataList="getDataList"
									/>
								</div>
							</el-form-item>
							<el-form-item>
								<div class="flex item-center">
									<SelectInput
										v-model:queryForm="state.queryForm"
										:searchTypes="[
											{
												label: '订柜号',
												value: 'orderContainerNoList',
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
							</el-form-item></template
						>
					</AdvancedSearchStyle>
				</el-form>
			</el-row>
			<el-row>
				<ToolBar @handleRefresh="getDataList" :is-show-export="false">
					<template #left-tool>
						<el-button
							class="ml10"
							type="primary"
							@click="openDialog('tag')"
							v-auth="'clearance_tag'"
						>
							{{ $t('标记处理') }}</el-button
						>
						<el-dropdown
							class="ml10"
							split-button
							v-if="auths(['clearance_exportfile', 'clearance_exportList'])"
						>
							<span>{{ $t('导出') }}</span>
							<template #dropdown>
								<el-dropdown-menu>
									<el-dropdown-item
										@click="
											() => {
												handleExport('customsData');
											}
										"
										v-if="auth('clearance_exportfile')"
										>报关资料</el-dropdown-item
									>
									<el-dropdown-item
										@click="
											() => {
												handleExport('listInfo');
											}
										"
										v-if="auth('clearance_exportList')"
										>列表信息</el-dropdown-item
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
				native-scrollbar
			>
				<el-table-column
					align="center"
					type="selection"
					reserve-selection
					width="50"
					fixed="left"
				/>
				<!-- 订柜号 -->
				<el-table-column
					prop="orderContainerNo"
					:label="t('订柜号')"
					width="120"
					show-overflow-tooltip
					fixed="left"
				>
					<template #default="{ row }">
						{{ row.orderContainerNo || '---' }}
					</template>
				</el-table-column>

				<!-- 柜号 -->
				<el-table-column
					prop="containerNo"
					:label="t('柜号')"
					width="150"
					show-overflow-tooltip
					fixed="left"
				>
					<template #default="{ row }">
						{{ row.containerNo || '---' }}
					</template>
				</el-table-column>

				<!-- SO号 -->
				<el-table-column
					prop="soNo"
					:label="t('SO')"
					width="120"
					show-overflow-tooltip
					fixed="left"
				>
					<template #default="{ row }">
						{{ row.soNo || '---' }}
					</template>
				</el-table-column>

				<!-- 截单时间 -->
				<el-table-column
					prop="docCutoffTime"
					:label="t('截单时间')"
					width="140"
					show-overflow-tooltip
					fixed="left"
				>
					<template #default="{ row }">
						{{ row.docCutoffTime || '---' }}
					</template>
				</el-table-column>

				<!-- 起始港 -->
				<el-table-column
					prop="startPortCode"
					:label="t('起始港')"
					width="100"
					show-overflow-tooltip
				>
					<template #default="{ row }">
						{{ row.startPortCode || '---' }}
					</template>
				</el-table-column>

				<!-- 目的港 -->
				<el-table-column
					prop="destPortCode"
					:label="t('目的港')"
					width="100"
					show-overflow-tooltip
				>
					<template #default="{ row }">
						{{ row.destPortCode || '---' }}
					</template>
				</el-table-column>

				<!-- 目的国 -->
				<el-table-column
					prop="destCountryCode"
					:label="t('目的国')"
					width="100"
					show-overflow-tooltip
				>
					<template #default="{ row }">
						{{ row.destCountryCode || '---' }}
					</template>
				</el-table-column>

				<!-- 运输方式 -->
				<el-table-column
					prop="transportMethod"
					:label="t('运输方式')"
					width="100"
					show-overflow-tooltip
				>
					<template #default="{ row }">
						{{ row.transportMethod || '---' }}
					</template>
				</el-table-column>

				<!-- 实际装柜时间 -->
				<el-table-column
					prop="actualLoadingTime"
					:label="t('实际装柜时间')"
					width="140"
					show-overflow-tooltip
				>
					<template #default="{ row }">
						{{ row.actualLoadingTime || '---' }}
					</template>
				</el-table-column>

				<!-- 拖车报关 -->
				<el-table-column
					prop="domesticForwarderName"
					:label="t('拖车报关')"
					width="120"
					show-overflow-tooltip
				>
					<template #default="{ row }">
						{{ row.domesticForwarderName || '---' }}
					</template>
				</el-table-column>

				<!-- 总数量 -->
				<el-table-column
					prop="containerTotalQuantity"
					:label="t('总数量')"
					width="100"
					show-overflow-tooltip
				>
					<template #default="{ row }">
						{{ row.containerTotalQuantity || '---' }}
					</template>
				</el-table-column>

				<!-- 总箱数 -->
				<el-table-column
					prop="containerTotalCartonQuantity"
					:label="t('总箱数')"
					width="100"
					show-overflow-tooltip
				>
					<template #default="{ row }">
						{{ row.containerTotalCartonQuantity || '---' }}
					</template>
				</el-table-column>

				<!-- 总净重（kg） -->
				<el-table-column
					prop="containerTotalNetWeight"
					:label="t('总净重(kg)')"
					width="120"
					show-overflow-tooltip
				>
					<template #default="{ row }">
						{{ row.containerTotalNetWeight?.toFixed(2) || '---' }}
						<!-- 保留2位小数 -->
					</template>
				</el-table-column>

				<!-- 总毛重（kg） -->
				<el-table-column
					prop="containerTotalGrossWeight"
					:label="t('总毛重(kg)')"
					width="120"
					show-overflow-tooltip
				>
					<template #default="{ row }">
						{{ row.containerTotalGrossWeight?.toFixed(2) || '---' }}
					</template>
				</el-table-column>

				<!-- 总体积（m³） -->
				<el-table-column
					prop="containerTotalVolume"
					:label="t('总体积(m³)')"
					width="120"
					show-overflow-tooltip
				>
					<template #default="{ row }">
						{{ row.containerTotalVolume?.toFixed(2) || '---' }}
					</template>
				</el-table-column>

				<!-- 处理状态（枚举转换） -->
				<el-table-column
					prop="processStatus"
					:label="t('处理状态')"
					width="100"
					show-overflow-tooltip
				>
					<template #default="{ row }">
						<!-- 根据实际枚举值转换文本 -->
						{{ row.processStatus }}
					</template>
				</el-table-column>
				<!-- 创建时间 -->
				<el-table-column
					prop="createTime"
					:label="t('创建时间')"
					show-overflow-tooltip
					width="100"
				/>
				<el-table-column :label="$t('common.action')" fixed="right" width="150">
					<template #default="{ row }">
						<div class="flex items-center">
							<el-button
								text
								type="primary"
								class="mr20"
								@click="openDialog('tag', row)"
								v-auth="'clearance_tag'"
								:disabled="row.processStatus === '已处理'"
								>{{ $t('标记处理') }}
							</el-button>
							<el-button
								text
								type="primary"
								class="mr20"
								@click="openDialog('log', row)"
								v-auth="'clearance_log'"
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
			:biz-type="['CLEARANCE']"
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

<script setup lang="ts">
import { BasicTableProps, useTable } from '/@/hooks/table';
import { useI18n } from 'vue-i18n';
import { defineAsyncComponent, ref, reactive } from 'vue';
import { useMessage } from '/@/hooks/message';
import { ElMessageBox } from 'element-plus';
import { auth, auths } from '/@/utils/authFunction';
import {
	getClearancePage,
	postProcess2Processed,
	getClearanceExport,
	postClearanceExportTemplates,
} from '/@/api/affairs/customs/clearance/index';
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
const LogDialog = defineAsyncComponent(
	() => import('/@/components/log/log-dialog.vue')
);
const TreeSelectInputApi = defineAsyncComponent(
	() => import('/@/componentsApi/TreeSelectInputApi/index.vue')
);
// table的引用
const tableRef = ref();
const { t } = useI18n();

// 高级搜索布局的引用
const AdvancedSearchStyleRef = ref();

// 搜索变量
const queryRef = ref();
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
	pageList: getClearancePage,
	loading: false,
	createdIsNeed: true,
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
		if (type === 'tag') {
			// 如果没有传row，则表示批量操作
			if (!row) {
				const ids = tableRef.value
					.getSelectionRows()
					?.map((item: any) => item.id);
				if (!ids || ids.length === 0) {
					useMessage().warning(t('请至少选择一条数据'));
					return;
				}
				// 如果有标记为已处理的，则提示不能操作
				const hasProcessed = tableRef.value
					.getSelectionRows()
					?.some((item: any) => item.processStatus === '已处理');
				if (hasProcessed) {
					useMessage().warning(t('所选数据中包含已处理的数据，不能重复操作'));
					return;
				}
				// 批量操作
				ElMessageBox({
					type: 'info',
					title: t('标记处理'),
					message: t('标记处理后，状态变为已处理，确定标记处理吗？'),
				}).then(async () => {
					const res = await postProcess2Processed(ids);
					if (res.code === 0) {
						useMessage().success('操作成功');
						// 清空选中行
						tableRef.value.clearSelection();
						getDataList();
					}
				});
			} else {
				// 单条操作
				if (!row || !row.id) {
					useMessage().warning(t('数据异常，请刷新页面重试'));
					return;
				}
				// 批量操作
				ElMessageBox({
					type: 'info',
					title: t('标记处理'),
					message: t('标记处理后，状态变为已处理，确定标记处理吗？'),
				}).then(async () => {
					const res = await postProcess2Processed([row.id]);
					if (res.code === 0) {
						useMessage().success('操作成功');
						getDataList();
					}
				});
			}
		} else if (type === 'log') {
			logDialogVisible.value = true;
			currentRow.value = row;
		}
	} catch (error: any) {
		useMessage().error(error?.msg || t('错误'));
	}
};

// 导出
const handleExport = async (type: 'customsData' | 'listInfo') => {
	try {
		const ids = tableRef.value.getSelectionRows()?.map((item: any) => item.id);
		const getlist = tableRef.value.getSelectionRows();
		// 如果是报关资料导出，且没有选择数据，则提示至少选择一条数据
		if (type === 'customsData' && (!ids || ids.length === 0)) {
			useMessage().warning(t('请至少选择一条数据'));
			return;
		}
		const api =
			type === 'customsData'
				? postClearanceExportTemplates
				: getClearanceExport;
		// 显示加载状态
		state.loading = true;
		// 发送请求，设置 responseType 为 'blob' 以接收二进制流
		await api(
			type === 'customsData'
				? getlist
				: {
						...state.queryForm,
						ascs: state?.ascs,
						descs: state?.descs,
						ids: ids || [],
						current: 1,
						size: 10000,
				  }
		);
	} catch (error) {
		useMessage().error(t(error as string));
	} finally {
		// 隐藏加载状态
		state.loading = false;
	}
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
