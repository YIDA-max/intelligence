<template>
	<div class="third-warehouse">
		<div class="sp-info layout-padding-view">
			<el-scrollbar>
				<query-tree
					:placeholder="$t('请输入')"
					:props="treeProps"
					:query="deptData.queryList"
					:show-expand="true"
					@node-click="handleNodeClick"
				>
					<!-- 没有数据权限提示 -->
					<template #default="{ node, data }">
						<el-tooltip
							v-if="data.isLock"
							class="item"
							effect="dark"
							:content="$t('sysuser.noDataScopeTip')"
							placement="right-start"
						>
							<span
								>{{ node.label }}
								<SvgIcon name="ele-Lock" />
							</span>
						</el-tooltip>
						<span v-if="!data.isLock">{{ node.label }}</span>
					</template>
				</query-tree>
			</el-scrollbar>
		</div>
		<div
			class="third_warehouseLogistics layout-padding-auto layout-padding-view ml10"
		>
			<el-row class="ml10" v-show="showSearch">
				<el-form
					:inline="true"
					:model="state.queryForm"
					@keyup.enter="getDataList"
					ref="queryRef"
				>
					<el-form-item>
						<div class="flex item-center">
							<SelectInput
								v-model:queryForm="state.queryForm"
								:settings="{
									selectStyle: {
										width: '180px',
									},
								}"
								:searchTypes="[
									{
										label: '物流商渠道中文名称',
										value: 'logisticsChannelNameCns',
									},
								]"
								:getDataList="getDataList"
							/>
						</div>
					</el-form-item>
					<el-form-item>
						<el-select
							v-model="state.queryForm.statuses"
							placeholder="状态"
							clearable
							collapse-tags
							:max-collapse-tags="1"
							style="width: 150px"
							multiple
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
						<TreeSelectInputApi
							v-model:queryForm="state.queryForm"
							componentType="userList"
							:settings="{
								text: '操作人',
								code: 'createIds',
								searchFn: getDataList,
								getTreeDataParams: {
									lockFlag: 0,
								},
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
										label: '同步时间',
										value: 'syncTime',
										isAddHMS: true,
										dateStart: 'syncTimeStart',
										dateEnd: 'syncTimeEnd',
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
				<ToolBar @handleRefresh="resetQuery" :isShowExport="false">
					<template #left-tool>
						<el-button
							class="ml10"
							type="primary"
							@click="openDialog('sync')"
							v-auth="'logisticsChannels_sync'"
						>
							{{ $t('重新同步') }}</el-button
						>
						<el-button
							class="ml10"
							type="primary"
							@click="openDialog('add')"
							v-auth="'logisticsChannels_add'"
						>
							{{ $t('新增渠道') }}</el-button
						>
						<!-- <el-button class="ml10" type="primary" @click="openDialog('cancel')"> {{ $t('取消订单') }}</el-button> -->
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
					prop="logisticsChannelCode"
					:label="t('物流渠道中文名称')"
					show-overflow-tooltip
					sortable="custom"
					min-width="200"
				>
					<template #default="{ row }">
						{{ row.logisticsChannelName || '---' }}
					</template>
				</el-table-column>
				<el-table-column
					prop="logisticsChannelCode"
					:label="t('渠道代码')"
					show-overflow-tooltip
					sortable="custom"
					width="200"
				>
					<template #default="{ row }">
						{{ row.logisticsChannelCode || '---' }}
					</template>
				</el-table-column>
				<el-table-column
					prop="status"
					:label="t('状态')"
					show-overflow-tooltip
					sortable="custom"
					width="150"
				>
					<template #default="{ row }">
						<el-switch
							:modelValue="!!row.status"
							size="small"
							@change="
									(e: any) => {
										statusChange(e, row);
									}
								"
						></el-switch
					></template>
				</el-table-column>
				<el-table-column
					prop="warehouseCode"
					:label="t('仓库代码')"
					show-overflow-tooltip
					width="150"
				>
					<template #default="{ row }">
						{{ row.warehouseCode || '---' }}</template
					>
				</el-table-column>
				<el-table-column
					prop="selfPickupFlag"
					:label="t('是否自提物流')"
					show-overflow-tooltip
					width="150"
				>
					<template #default="{ row }">
						{{ row.selfPickupFlag === 1 ? '是' : '否' }}
					</template>
				</el-table-column>
				<el-table-column
					prop="selfPickupConfig"
					:label="t('自提物流渠道配置')"
					show-overflow-tooltip
					width="150"
				>
					<template #default="{ row }">
						{{ row.selfPickupConfigName?.join(', ') || '---' }}
					</template>
				</el-table-column>
				<el-table-column
					prop="createId"
					:label="t('操作人')"
					show-overflow-tooltip
					width="150"
				>
					<template #default="{ row }">
						{{ row.createName || '---' }}
					</template>
				</el-table-column>
				<el-table-column
					prop="syncTime"
					:label="t('同步时间')"
					show-overflow-tooltip
					sortable="custom"
					width="150"
				>
					<template #default="{ row }"> {{ row.syncTime || '---' }} </template>
				</el-table-column>

				<el-table-column :label="$t('common.action')" width="170" fixed="right">
					<template #default="{ row }">
						<div class="flex items-center">
							<el-button
								text
								type="primary"
								class="mr20"
								@click="openDialog('detail', row)"
								v-auth="'logisticsChannels_detail'"
								>{{ $t('详情') }}
							</el-button>
							<el-button
								text
								type="primary"
								class="mr20"
								@click="openDialog('edit', row)"
								v-auth="'logisticsChannels_edit'"
								>{{ $t('编辑') }}
							</el-button>
							<el-button
								text
								type="primary"
								class="mr20"
								@click="openDialog('log', row)"
								v-auth="'logisticsChannels_log'"
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
		<confirm-dialog
			:title="statusTitle"
			width="20%"
			ref="statusRef"
			:show-icon="true"
			:confirm-button-text="statusTitle"
			icon-type="warn"
			@cancel="statusRef.hide()"
			@confirm="handleConfirmStatus"
		>
			<div>确认{{ statusTitle }}吗？</div>
		</confirm-dialog>
		<FormDialog
			v-model="visible"
			:currentRow="currentRow"
			:visibleType="visibleType"
			:title="title"
			@closeDialog="closeDialog"
			:dictMap="dictMap"
		></FormDialog>
		<LogDialog
			v-model="logDialogVisible"
			:id="currentRow.id"
			:biz-type="['ORDER_LOGISTICS_CHANNEL']"
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

<script lang="ts" name="systemUser" setup>
import {
	getLogisticsChannelList,
	updateStatus,
	searchThirdWarehouse,
	syncThirdWarehouse,
} from '/@/api/fbm/logisticsChannel/thirdWarehouseLogistics/index';
import { getDicts } from '/@/api/admin/dict';
import { groupByPlatform } from '/@/api/fbm/logisticsChannel/platformWarehouseDelivery/index';
import { BasicTableProps, useTable } from '/@/hooks/table';
import { useMultipleDicts } from '/@/hooks/multipleDicts';
import { useI18n } from 'vue-i18n';
import { useMessage } from '/@/hooks/message';
import { getWarehouseInfoList } from '/@/api/warehouse/third-warehouse/index';
import { getPlatformLogisticsTree } from '/@/api/fbm/logisticsChannel/platformLogistics/index';
const SelectDate = defineAsyncComponent(
	() => import('/@/components/TableFormModule/select-date.vue')
);
const SelectInput = defineAsyncComponent(
	() => import('/@/components/TableFormModule/select-input.vue')
);
const ToolBar = defineAsyncComponent(
	() => import('/@/components/ToolBar/tool-bar.vue')
);
const LogDialog = defineAsyncComponent(
	() => import('/@/components/log/log-dialog.vue')
);
const TreeSelectInputApi = defineAsyncComponent(
	() => import('/@/componentsApi/TreeSelectInputApi/index.vue')
);

const FormDialog = defineAsyncComponent(
	() =>
		import(
			'/@/views/fbm/logisticsChannels/thirdWarehouseLogistics/components/form-dialog.vue'
		)
);

// 动态引入组件
const QueryTree = defineAsyncComponent(
	() => import('/@/components/QueryTree/index.vue')
);
const ConfirmDialog = defineAsyncComponent(
	() => import('/@/components/ConfirmDialog/index.vue')
);

const { t } = useI18n();

const queryRef = ref();
const showSearch = ref(true);

const treeProps = {
	label: 'label',
	children: 'children',
	value: 'value',
};
// 当前点击的行
const currentRow: any = ref({
	id: '',
	feeLogisticsChannelIds: [],
	feeLogisticsChannelId: '',
});

// 弹窗标题
const title = ref('');
// 弹窗类型
const visibleType = ref('');
// 弹窗是否可见
const visible = ref(false);

// 日志对话框是否可见
const logDialogVisible = ref(false);

const tableRef = ref();

const { dictMap } = useMultipleDicts(
	[
		{
			key: 'platformChannel',
			fetchFn: getDicts,
			params: 'platform_channel',
		}, // 平台 渠道
		{
			key: 'thirdWarehouseList',
			fetchFn: getWarehouseInfoList,
			params: {
				status: 1,
			},
		}, // 三方仓仓库列表
		{
			key: 'carrieList',
			fetchFn: groupByPlatform,
		}, // 平台物流承运商
		{
			key: 'platformLogisticsTree',
			fetchFn: getPlatformLogisticsTree,
		}, // 平台物流树
	],
	{
		isAuto: true,
		tableRef,
	}
);

// 定义表格查询、后台调用的API
const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {},
	pageList: getLogisticsChannelList,
	loading: false,
	descs: ['sync_time'],
});
const {
	getDataList,
	currentChangeHandle,
	sizeChangeHandle,
	sortChangeHandle,
	tableStyle,
} = useTable(state, tableRef);

// 部门树使用的数据
const deptData = reactive({
	queryList: async (name: String) => {
		const res = await searchThirdWarehouse({
			warehouseName: name || '',
		});
		let arr: any[] = [];
		res.data.map((item: any) => {
			let obj: any = {};
			obj.id = item.id + item.spName;
			obj.label = item.spName;
			obj.value = item.id;
			obj.children = item.warehouseInfoList.map((it: any) => ({
				label: it.warehouseName,
				value: it.warehouseCode,
				id: it.warehouseCode,
			}));
			arr.push(obj);
		});
		return {
			code: 0,
			data: arr,
		};
	},
});
// 打开对话框
const openDialog = async (type: string, row?: any) => {
	try {
		if (type === 'add') {
			title.value = t('新增渠道');
			visibleType.value = 'add';
			currentRow.value = {
				id: '',
			};
			visible.value = true;
		} else if (type === 'edit') {
			currentRow.value = row;
			currentRow.value.feeLogisticsChannelIds =
				currentRow.value?.feeLogisticsChannelId
					?.split(',')
					?.filter((i: any) => i !== '')
					?.map((i: any) => Number(i)) || [];
			title.value = t('编辑渠道');
			visibleType.value = 'edit';
			visible.value = true;
		} else if (type === 'detail') {
			currentRow.value = row;
			//转数值 currentRow.value?.feeLogisticsChannelId?.split(',')
			currentRow.value.feeLogisticsChannelIds =
				currentRow.value?.feeLogisticsChannelId
					?.split(',')
					?.filter((i: any) => i !== '')
					?.map((i: any) => Number(i)) || [];
			visibleType.value = 'detail';
			title.value = t('渠道详情');
			visible.value = true;
		} else if (type === 'log') {
			logDialogVisible.value = true;
			currentRow.value = row;
		} else if (type === 'sync') {
			state.loading = true;
			const res = await syncThirdWarehouse({});
			if (res.code === 0) {
				useMessage().success(t('操作成功'));
				getDataList();
				state.loading = false;
			} else {
				state.loading = false;
			}
		}
	} catch (error: any) {
		useMessage().error(error?.msg || t('错误'));
		state.loading = false;
	}
};
// 状态改变弹窗title
const statusTitle = ref();
// 状态改变弹窗ref
const statusRef = ref();

// 状态切换
const statusChange = async (e: any, row: any) => {
	if (e) {
		statusTitle.value = '启用';
	} else {
		statusTitle.value = '停用';
	}
	currentRow.value = row;
	statusRef.value.show();
};
// 切换状态
const handleConfirmStatus = async () => {
	const api = updateStatus;
	try {
		const res = await api({
			id: currentRow.value.id,
			status: statusTitle.value === '启用' ? 1 : 0,
		});
		if (res.code === 0) {
			useMessage().success(t('操作成功'));
			statusRef.value.hide();
			getDataList();
		}
	} catch (error: any) {
		useMessage().error(error?.msg || t('操作失败'));
	}
};
// 关闭对话框
const closeDialog = () => {
	visible.value = false;
	getDataList();
};

// 点击树，只允许点击子节点（叶子节点）筛选
const handleNodeClick = (e: any) => {
	// 只有没有 children 的节点才允许筛选
	if (!e.children || e.children.length === 0) {
		// 这个要转为数组 不然会报错 后台需要数组
		state.queryForm.warehouseCodes = [e.value];
		getDataList();
	}
	// 如果是父节点，什么都不做
};
// 清空搜索条件
const resetQuery = () => {
	state.queryForm = {
		current: 1,
		size: 10,
	};
	getDataList();
};
</script>

<style scoped lang="scss">
.third-warehouse {
	height: 100%;
	display: flex;
	background-color: #f5f5f5;
	.sp-info {
		width: 350px;
		height: 100%;
		padding: 10px;
	}
	.third_warehouseLogistics {
		padding: 10px;
		width: calc(100% - 350px);
		height: 100%;
	}
}
</style>
