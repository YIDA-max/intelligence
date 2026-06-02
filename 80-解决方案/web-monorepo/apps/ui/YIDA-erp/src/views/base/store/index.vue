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
						<TreeSelectInputApi
							v-model:queryForm="state.queryForm"
							componentType="country"
							multiple
							:settings="{
								text: '国家',
								code: 'siteCodes',
								searchFn: getDataList,
								width: '200px',
							}"
						/>
					</el-form-item>
					<el-form-item prop="platformChannelCodes">
						<TreeSelectInputApi
							v-model:queryForm="state.queryForm"
							componentType="dicts"
							multiple
							:settings="{
								text: '渠道',
								getTreeDataParams: 'platform_channel',
								code: 'platformChannelCodes',
								searchFn: getDataList,
								width: '200px',
							}"
						/>
					</el-form-item>
					<el-form-item>
						<TreeSelectInputApi
							v-model:queryForm="state.queryForm"
							componentType="legalEntity"
							multiple
							:settings="{
								text: '法人主体',
								code: 'legalPersonIds',
								searchFn: getDataList,
								width: '200px',
								getTreeDataOptions: { enable: false, delay: 0 },
							}"
						/>
					</el-form-item>
					<el-form-item>
						<TreeSelectInputApi
							v-model:queryForm="state.queryForm"
							componentType="legalEntity"
							multiple
							:settings="{
								text: '核算主体',
								code: 'accountingLegalPersonIds',
								searchFn: getDataList,
								width: '200px',
								getTreeDataOptions: { enable: false, delay: 0 },
							}"
						/>
					</el-form-item>
					<el-form-item>
						<el-cascader
							v-model="state.queryForm.deptIds"
							placeholder="部门&运营小组"
							clearable
							:options="dictMap.deptTree"
							collapse-tags
							:max-collapse-tags="1"
							filterable
							:props="{
								label: 'name',
								value: 'id',
								emitPath: false, // ✅ 只返回最后一个 id
								checkStrictly: false, // 默认即可，确保联动
								leafOnly: true, // ✅ 只允许选最后一级
								multiple: true,
							}"
							@change="(val: any) => {
		                          //  handleChange(val);	
								}"
						>
						</el-cascader>
					</el-form-item>
					<el-form-item prop="managerIds">
						<TreeSelectInputApi
							v-model:queryForm="state.queryForm"
							componentType="userList"
							multiple
							:settings="{
								text: '店铺负责人',
								getTreeDataParams: { lockFlag: 0 },
								code: 'managerIds',
								searchFn: getDataList,
								width: '200px',
							}"
						/>
					</el-form-item>
					<el-form-item>
						<SelectInput
							v-model:queryForm="state.queryForm"
							:searchTypes="[
								{
									label: '店铺名称',
									value: 'storeNames',
								},
								{
									label: '店铺别名',
									value: 'storeAliasList',
								},
							]"
							:getDataList="getDataList"
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
				<ToolBar @handleRefresh="resetQuery" @handleExport="handleExport">
					<template #left-tool>
						<el-button
							class="ml10"
							type="primary"
							@click="openDialog('add')"
							v-auth="'store_add'"
						>
							{{ $t('新增店铺') }}</el-button
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
					width="40"
					reserve-selection
				/>
				<el-table-column
					prop="storeName"
					:label="t('店铺名称')"
					show-overflow-tooltip
					sortable="custom"
					width="200"
				>
					<template #default="{ row }"> {{ row.storeName || '---' }} </template>
				</el-table-column>
				<el-table-column
					prop="storeAlias"
					:label="t('店铺别名')"
					show-overflow-tooltip
					sortable="custom"
					width="200"
				>
					<template #default="{ row }">
						{{ row.storeAlias || '---' }}
					</template>
				</el-table-column>
				<el-table-column
					prop="legalPersonId"
					:label="t('法人主体')"
					show-overflow-tooltip
					sortable="custom"
					width="200"
				>
					<template #default="{ row }">
						{{ row.legalPersonName || '---' }}
					</template>
				</el-table-column>
				<el-table-column
					prop="accountingLegalPersonName"
					:label="t('核算主体')"
					show-overflow-tooltip
					width="200"
				>
					<template #default="{ row }">
						{{ row.accountingLegalPersonName || '---' }}
					</template>
				</el-table-column>
				<el-table-column
					prop="status"
					:label="t('状态')"
					show-overflow-tooltip
					sortable="custom"
					width="100"
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
						></el-switch>
					</template>
				</el-table-column>
				<el-table-column
					prop="platformChannelCode"
					:label="t('平台渠道')"
					show-overflow-tooltip
					sortable="custom"
					width="150"
				>
					<template #default="{ row }">
						{{ row.platformChannelCodeText || '---' }}
					</template>
				</el-table-column>
				<el-table-column
					prop="siteCode"
					:label="t('站点')"
					show-overflow-tooltip
					width="150"
				>
					<template #default="{ row }"> {{ row.siteName || '---' }}</template>
				</el-table-column>
				<el-table-column
					prop="deptId"
					:label="t('部门')"
					show-overflow-tooltip
					width="150"
				>
					<template #default="{ row }"> {{ row.deptName || '---' }} </template>
				</el-table-column>
				<el-table-column
					prop="teamName"
					:label="t('小组')"
					show-overflow-tooltip
					width="150"
				>
					<template #default="{ row }"> {{ row.teamName || '---' }} </template>
				</el-table-column>
				<el-table-column
					prop="managerId"
					:label="t('店铺负责人')"
					show-overflow-tooltip
					width="150"
				>
					<template #default="{ row }">
						{{ row.managerName || '---' }}
					</template>
				</el-table-column>
				<el-table-column
					prop="createId"
					:label="t('创建人')"
					show-overflow-tooltip
					sortable="custom"
					width="150"
				>
					<template #default="{ row }">
						{{ row.createName || '---' }}
					</template>
				</el-table-column>
				<el-table-column
					prop="createTime"
					:label="t('创建时间')"
					show-overflow-tooltip
					sortable="custom"
					width="150"
				>
					<template #default="{ row }">
						{{ row.createTime || '---' }}
					</template>
				</el-table-column>
				<el-table-column
					prop="updateTime"
					:label="t('更新时间')"
					show-overflow-tooltip
					sortable="custom"
					width="150"
				>
					<template #default="{ row }">
						{{ row.updateTime || '---' }}
					</template>
				</el-table-column>
				<el-table-column
					prop="updateName"
					:label="t('操作人')"
					show-overflow-tooltip
					sortable="custom"
					width="150"
				>
					<template #default="{ row }">
						{{ row.updateName || '---' }}
					</template>
				</el-table-column>
				<el-table-column :label="$t('common.action')" width="150" fixed="right">
					<template #default="{ row }">
						<div class="flex items-center">
							<el-button
								text
								type="primary"
								class="mr20"
								@click="openDialog('edit', row)"
								v-auth="'store_edit'"
								>{{ $t('编辑') }}
							</el-button>
							<el-button
								text
								type="primary"
								class="mr20"
								@click="openDialog('log', row)"
								v-auth="'store_log'"
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
		<!-- 编辑、新增  -->
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
			:biz-type="['STORE']"
			:showSearchForm="false"
			:showToolBar="false"
			@closeDialog="
				() => {
					logDialogVisible = false;
				}
			"
		/>
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
			<div v-if="statusTitle === '停用'">停用后店铺信息将无法同步</div>
			<div>确认{{ statusTitle }}店铺{{ currentRow?.storeName }}吗？</div>
		</confirm-dialog>
	</div>
</template>

<script setup lang="ts">
import { BasicTableProps, useTable } from '/@/hooks/table';
import { useI18n } from 'vue-i18n';
import { defineAsyncComponent, ref, reactive } from 'vue';
import { useMessage } from '/@/hooks/message';
import {
	getBaseStorePage,
	openStatus,
	closeStatus,
	exportStoreInfo,
	getDetailInfo,
} from '/@/api/base/store/index';
import { useMultipleDicts } from '/@/hooks/multipleDicts';
import { deptTree } from '/@/api/admin/dept';

const FormDialog = defineAsyncComponent(
	() => import('./components/form-dialog.vue')
);
const ToolBar = defineAsyncComponent(
	() => import('/@/components/ToolBar/tool-bar.vue')
);
const LogDialog = defineAsyncComponent(
	() => import('/@/components/log/log-dialog.vue')
);
const SelectDate = defineAsyncComponent(
	() => import('/@/components/TableFormModule/select-date.vue')
);
const ConfirmDialog = defineAsyncComponent(
	() => import('/@/components/ConfirmDialog/index.vue')
);
const SelectInput = defineAsyncComponent(
	() => import('/@/components/TableFormModule/select-input.vue')
);

const TreeSelectInputApi = defineAsyncComponent(
	() => import('/@/componentsApi/TreeSelectInputApi/index.vue')
);
const { t } = useI18n();
// table的引用
const tableRef = ref();
// 搜索变量
const queryRef = ref();
// 是否显示搜索
const showSearch = ref(true);
// 当前点击的行
const currentRow = ref<any>({
	id: '',
});
// 弹窗标题
const title = ref('');
// 弹窗类型
const visibleType = ref('');
// 弹窗是否可见
const visible = ref(false);
// 日志对话框是否可见
const logDialogVisible = ref(false);

//   初始化数据
const { dictMap } = useMultipleDicts(
	[
		{
			key: 'deptTree',
			fetchFn: deptTree,
			params: {
				deptName: '运营中心',
				showRootFlag: 0, // 是否显示根节点 1是展示 0不展示
			},
		}, // 部门树
	],
	{
		isAuto: true,
		tableRef,
	}
);
const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {},
	pageList: getBaseStorePage,
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
	resetTableQuery,
	tableStyle,
} = useTable(state, tableRef);

// 清空搜索条件
const resetQuery = () => {
	resetTableQuery(() => {
		// 重置时间范围
		return {
			queryForm: {
				current: 1,
				size: 10,
			},
			descs: [],
			ascs: [],
		};
	});
};
// 打开对话框
const openDialog = async (type: string, row?: any) => {
	try {
		if (type === 'add') {
			title.value = t('新增店铺');
			visibleType.value = 'add';
			currentRow.value = {
				id: '',
			};
			visible.value = true;
		} else if (type === 'edit') {
			const res = await getDetailInfo({ id: row.id });
			if (res.code === 0) {
				title.value = t('编辑店铺');
				visibleType.value = 'edit';
				currentRow.value = res.data;
				visible.value = true;
			}
		} else if (type === 'log') {
			logDialogVisible.value = true;
			currentRow.value = row;
		}
	} catch (error: any) {
		useMessage().error(error?.msg || t('错误'));
	}
};
// 关闭对话框
const closeDialog = () => {
	visible.value = false;
	getDataList();
};

// 导出
const handleExport = async () => {
	try {
		const ids = tableRef.value.getSelectionRows()?.map((item: any) => item.id);
		// 显示加载状态
		state.loading = true;
		// 发送请求，设置 responseType 为 'blob' 以接收二进制流
		await exportStoreInfo({
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
	const api = statusTitle.value === '启用' ? openStatus : closeStatus;
	try {
		const res = await api({
			id: currentRow.value.id,
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
