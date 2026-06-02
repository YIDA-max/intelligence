<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<!-- search选择参数选择行 -->
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
							placeholder="状态"
							clearable
							style="width: 150px"
							@change="getDataList"
						>
							<el-option
								v-for="item in [
									{
										label: '启用',
										value: 1,
									},
									{
										label: '禁用',
										value: 0,
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
								:settings="{
									selectStyle: {
										width: '120px',
									},
								}"
								:searchTypes="[
									{
										label: '规则名称',
										value: 'names',
									},
									{
										label: '规则ID',
										value: 'ruleNos',
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
										label: '订单MSKU',
										value: 'mskuCodes',
									},
									{
										label: '订单产品',
										value: 'skuCodes',
									},
								]"
								:settings="{
									selectStyle: {
										width: '120px',
									},
								}"
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

			<!-- 操作行 -->
			<el-row>
				<ToolBar
					@handleRefresh="getDataList"
					@handleExport="handleExport"
					:is-show-export="false"
				>
					<template #left-tool>
						<el-button
							type="primary"
							v-auth="'orderAuditRule-add'"
							@click="
								() => {
									openDialog('add');
								}
							"
						>
							{{ $t('新增规则') }}</el-button
						>
						<el-button
							@click="
								() => {
									openDialog('BatchEnable');
								}
							"
							v-auth="'orderAuditRule-enable'"
						>
							{{ $t('批量启用') }}</el-button
						>
						<el-button
							@click="
								() => {
									openDialog('BatchDisable');
								}
							"
							v-auth="'orderAuditRule-disable'"
						>
							{{ $t('批量禁用') }}</el-button
						>
						<!-- <el-button class="ml10" @click="openDialog('remark')"> {{ $t('规则测试工具') }}</el-button> -->
					</template>
				</ToolBar>
			</el-row>

			<!-- 拖拽表格组件 -->
			<DraggableTable
				:dataList="state.dataList"
				:loading="state.loading"
				:show-drag-handle="true"
				row-key="ruleNo"
				ref="tableRef"
				:cell-style="tableStyle.cellStyle"
				:header-cell-style="tableStyle.headerCellStyle"
				@sort-change="sortChangeHandle"
				@selection-change="(val:any) => (selectedRows = val)"
				@drag-end="handleDragEnd"
			>
				<el-table-column
					prop="name"
					:label="t('规则名称')"
					show-overflow-tooltip
					min-width="200"
				>
					<template #default="{ row }"> {{ row.name || '---' }} </template>
				</el-table-column>
				<el-table-column
					prop="ruleNo"
					:label="t('规则ID')"
					show-overflow-tooltip
					width="200"
				>
					<template #default="{ row }"> {{ row.ruleNo || '---' }} </template>
				</el-table-column>
				<el-table-column
					prop="status"
					:label="t('状态')"
					show-overflow-tooltip
					width="200"
				>
					<template #default="{ row }">
						<el-switch
							:disabled="
								row.status === 1 || row.status === '1'
									? !auth('orderAuditRule-disable')
									: !auth('orderAuditRule-enable')
							"
							v-model="row.status"
							:active-value="1"
							:inactive-value="0"
							inline-prompt
							@change="openDialog('changeStatus', row)"
						/>
					</template>
				</el-table-column>
				<el-table-column
					prop="effectiveTime"
					:label="t('规则生效时间(北京)')"
					show-overflow-tooltip
					width="200"
				>
					<template #default="{ row }">
						{{ row.effectiveTime || '---' }}
					</template>
				</el-table-column>
				<el-table-column
					prop="description"
					:label="t('规则描述')"
					show-overflow-tooltip
					width="270"
				>
					<template #default="{ row }">
						{{ row.description || '---' }}</template
					>
				</el-table-column>
				<el-table-column
					prop="createName"
					:label="t('创建人')"
					show-overflow-tooltip
					width="150"
				>
					<template #default="{ row }">
						{{ row.createName || '---' }}
					</template>
				</el-table-column>
				<el-table-column
					prop="createTime"
					:label="t('创建时间(北京)')"
					show-overflow-tooltip
					width="170"
				>
					<template #default="{ row }">
						{{ row.createTime || '---' }}
					</template>
				</el-table-column>
				<el-table-column :label="$t('common.action')" width="150" fixed="right">
					<template #default="{ row }">
						<div class="flex items-center">
							<el-link
								type="primary"
								underline="never"
								class="mr-5"
								@click="openDialog('edit', row)"
								v-if="auth('orderAuditRule-edit')"
							>
								{{ $t('编辑') }}
							</el-link>
							<el-dropdown @command="(type:any) => openDialog(type, row)">
								<span class="el-dropdown-link">
									<el-link type="primary" underline="never">操作 </el-link>
									<el-icon class="el-icon--right">
										<arrow-down />
									</el-icon>
								</span>
								<template #dropdown>
									<el-dropdown-menu>
										<el-dropdown-item
											command="log"
											v-if="auth('orderAuditRule-info')"
											>日志</el-dropdown-item
										>
										<el-dropdown-item
											command="copy"
											v-if="auth('orderAuditRule-copy')"
											>复制</el-dropdown-item
										>
									</el-dropdown-menu>
								</template>
							</el-dropdown>
						</div>
					</template>
				</el-table-column>
			</DraggableTable>

			<pagination
				@current-change="currentChangeHandle"
				@size-change="sizeChangeHandle"
				v-bind="state.pagination"
			/>
		</div>
		<!-- 日志对话框 -->
		<LogDialog
			v-model="logDialogVisible"
			:id="currentRow.id"
			:biz-type="['SELF_RULE']"
			:showSearchForm="false"
			:showToolBar="false"
			@closeDialog="
				() => {
					logDialogVisible = false;
				}
			"
		/>
		<RuleModel
			ref="ruleModelRef"
			:currentRow="currentRow"
			:visibleType="visibleType"
			@getDataList="getDataList"
		/>
	</div>
</template>

<script setup lang="ts">
import { BasicTableProps, useTable } from '/@/hooks/table';
import { useI18n } from 'vue-i18n';
import { defineAsyncComponent, ref, reactive } from 'vue';
import { useMessage } from '/@/hooks/message';
import { getExportDeliveryPlan } from '/@/api/materialFlow/deliveryPlan/index';
import { getDicts } from '/@/api/admin/dict';
import { getListByCondition as baseStore } from '/@/api/product/sku';
import { sysCountryList } from '/@/api/materialFlow/track';
import { useMultipleDicts } from '/@/hooks/multipleDicts';
import { getCategoryTree } from '/@/api/product/category';
import { getBrandAllList } from '/@/api/product/brand';
// import { useResultDialog } from '/@/hooks/useResultDialog';
import {
	postRuleInfoOpen,
	postRuleInfoClose,
} from '/@/api/fbm/orderRule/orderConfirmRule';
import {
	getRuleInfoList,
	reorderRuleInfoList,
} from '/@/api/fbm/orderRule/orderConfirmRule/index';
import { getRuleConditionReviewDetail } from '/@/api/fbm/orderRule/orderAuditRule/index';
import { getWarehouseInfoList } from '/@/api/warehouse/third-warehouse/index';
import { ElMessageBox } from 'element-plus';
import { auth } from '/@/utils/authFunction';
const ToolBar = defineAsyncComponent(
	() => import('/@/components/ToolBar/tool-bar.vue')
);
const LogDialog = defineAsyncComponent(
	() => import('/@/components/log/log-dialog.vue')
);
const SelectInput = defineAsyncComponent(
	() => import('/@/components/TableFormModule/select-input.vue')
);
const RuleModel = defineAsyncComponent(
	() => import('./components/rule-model/index.vue')
);
const DraggableTable = defineAsyncComponent(
	() => import('/@/components/DraggableTable/index.vue')
);

// const { open } = useResultDialog();
// table的引用
const tableRef = ref();
const { dictMap } = useMultipleDicts(
	[
		{
			key: 'platformChannel',
			fetchFn: getDicts,
			params: 'platform_channel',
		}, // 平台 渠道
		{
			key: 'countryList',
			fetchFn: sysCountryList,
		}, // 国家列表
		{
			key: 'baseStore',
			fetchFn: baseStore,
		}, // 店铺
		{
			key: 'categoryCode',
			fetchFn: getCategoryTree,
			params: {
				status: 1,
			},
		}, // 产品类目
		{
			key: 'brandCode',
			fetchFn: getBrandAllList,
			params: '',
		}, // 产品品牌
		{
			key: 'specialAttribute',
			fetchFn: getDicts,
			params: 'special_attribute',
		}, // 特殊属性
		{
			key: 'warehouseList',
			fetchFn: getWarehouseInfoList,
		}, // 三方仓仓库列表
	],
	{
		isAuto: true,
		tableRef,
	}
);
const { t } = useI18n();
// 传递字典
provide('dictMap', dictMap);
// 搜索变量
const queryRef = ref();
// 是否显示搜索
const showSearch = ref(true);
// 规则模型引用
const ruleModelRef = ref<any>(null);
// 当前选中的行
const selectedRows = ref<Array<any>>([]);
// 对话框类型
const visibleType = ref<'copy' | 'edit' | 'add'>('add');
// 当前点击的行
const currentRow = ref({
	id: '',
});
// 日志对话框是否可见
const logDialogVisible = ref(false);
const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {
		type: 'review',
		status: 1,
	},
	pageList: getRuleInfoList,
	loading: false,
	dataList: [],
	ascs: [],
	pagination: {
		current: 1,
		size: 10000,
	},
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
const resetQuery = () => {
	state.queryForm = {
		type: 'review',
		status: 1,
	};
	getDataList();
};

// 打开对话框
const openDialog = async (type: string, row?: any) => {
	try {
		if (type === 'log') {
			logDialogVisible.value = true;
			currentRow.value = row;
		} else if (type === 'add') {
			// 新增规则
			visibleType.value = 'add';
			ruleModelRef.value?.show();
		} else if (type === 'edit') {
			// 编辑规则
			const res = await getRuleConditionReviewDetail({
				id: row.id,
				type: 'review',
			});
			if (res.code === 0) {
				currentRow.value = res.data;
				visibleType.value = 'edit';
				ruleModelRef.value?.show();
			} else {
				useMessage().error(res.msg || t('获取规则详情失败'));
				return;
			}
		} else if (type === 'copy') {
			// 复制规则
			const res = await getRuleConditionReviewDetail({
				id: row.id,
				type: 'review',
			});
			if (res.code === 0) {
				currentRow.value = res.data;
				visibleType.value = 'copy';
				ruleModelRef.value?.show();
			} else {
				useMessage().error(res.msg || t('获取规则详情失败'));
				return;
			}
		} else if (type === 'changeStatus') {
			ElMessageBox.confirm(
				row.status === 1
					? t('是否确认启用该规则？')
					: t('是否确认禁用该规则？'),
				{
					type: 'warning',
				}
			)
				.then(async () => {
					let res;
					if (row.status === 1) {
						res = await postRuleInfoOpen({ ids: [row.id], type: 'review' });
					} else {
						res = await postRuleInfoClose({ ids: [row.id], type: 'review' });
					}
					if (res.code === 0) {
						useMessage().success(t('操作成功'));
						getDataList();
					} else {
						useMessage().error(res.msg || t('操作失败'));
						return;
					}
				})
				.catch(() => {
					// 取消操作，恢复开关状态
					row.status = row.status === 1 ? 0 : 1;
				});
		} else if (type === 'BatchEnable') {
			// 批量启用
			const ids = tableRef.value.getSelectionRows().map((item: any) => item.id);
			if (ids.length === 0) {
				useMessage().warning(t('请先选择要操作的规则'));
				return;
			}
			// 查看状态是否都是禁用状态
			const allDisabled = tableRef.value
				.getSelectionRows()
				.every((item: any) => item.status === 0);
			if (!allDisabled) {
				useMessage().warning(t('只能启用禁用状态的规则'));
				return;
			}
			ElMessageBox.confirm(t('是否确认启用选中的规则？'), {
				type: 'warning',
			})
				.then(async () => {
					const res = await postRuleInfoOpen({ ids: ids, type: 'review' });
					if (res.code === 0) {
						useMessage().success(t('操作成功'));
						getDataList();
					} else {
						useMessage().error(res.msg || t('操作失败'));
						return;
					}
				})
				.catch(() => {
					// 取消操作
				});
		} else if (type === 'BatchDisable') {
			// 批量禁用
			const ids = tableRef.value.getSelectionRows().map((item: any) => item.id);
			if (ids.length === 0) {
				useMessage().warning(t('请先选择要操作的规则'));
				return;
			}
			// 查看状态是否都是启用状态
			const allEnabled = tableRef.value
				.getSelectionRows()
				.every((item: any) => item.status === 1);
			if (!allEnabled) {
				useMessage().warning(t('只能禁用启用状态的规则'));
				return;
			}
			ElMessageBox.confirm(t('是否确认禁用选中的规则？'), {
				type: 'warning',
			})
				.then(async () => {
					const res = await postRuleInfoClose({ ids: ids, type: 'review' });
					if (res.code === 0) {
						useMessage().success(t('操作成功'));
						getDataList();
					} else {
						useMessage().error(res.msg || t('操作失败'));
						return;
					}
				})
				.catch(() => {
					// 取消操作
				});
		} else if (type === 'import') {
			// 导入
			useMessage().info('导入，敬请期待！');
		} else {
			useMessage().error(t('未知的操作'));
			return;
		}
	} catch (error: any) {
		useMessage().error(error?.msg || t('错误'));
	}
};
// 导出
const handleExport = async () => {
	try {
		const ids = selectedRows.value.map((item: any) => item.id);
		// 显示加载状态
		state.loading = true;
		// 发送请求，设置 responseType 为 'blob' 以接收二进制流
		await getExportDeliveryPlan({
			...state.queryForm,
			ids: ids.length > 0 ? ids : undefined,
			ascs: state?.ascs,
			descs: state?.descs,
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
// 处理拖拽结束事件
const handleDragEnd = async (newDataList: any[], originalDataList: any[]) => {
	// 更新表格数据
	state.dataList = newDataList;
	const arr = newDataList.map((item, i) => ({
		id: item.id,
		sort: originalDataList[i].sort,
	}));
	// TODO: 这里可以添加保存排序到后端的逻辑
	try {
		const res = await reorderRuleInfoList(arr);
		if (res.code === 0) {
			useMessage().success('排序保存成功！');
		}
		getDataList();
	} catch (error) {
		useMessage().error('排序保存失败！');
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
