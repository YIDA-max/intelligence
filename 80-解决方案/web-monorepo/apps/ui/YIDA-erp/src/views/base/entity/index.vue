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
									text: '创建人',
									width: '220px',
									searchFn: getDataList,
									code: 'createIds',
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
										label: '法人主体',
										value: 'names',
									},
								]"
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
				<ToolBar @handleRefresh="getDataList" :isShowExport="false">
					<template #left-tool>
						<el-button
							class="ml10"
							type="primary"
							v-auth="'entity_add'"
							@click="openDialog('add')"
						>
							{{ $t('添加') }}</el-button
						>
						<!-- <el-button class="ml10" @click="openDialog('del')"> {{ $t('删除') }}</el-button> -->
						<el-text class="ml10" type="info"
							>已选&nbsp;{{ selectedRows?.length }}</el-text
						>
						<el-link
							class="ml10"
							type="primary"
							@click="
								() => {
									tableRef.clearSelection();
								}
							"
							>{{ $t('清除已选') }}</el-link
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
				@selection-change="(val:any) => (selectedRows = val)"
				native-scrollbar
			>
				<el-table-column
					align="center"
					type="selection"
					width="40"
					reserve-selection
				/>
				<el-table-column
					prop="name"
					:label="t('主体名称')"
					show-overflow-tooltip
					sortable="custom"
					width="180"
				>
					<template #default="{ row }"> {{ row.name || '---' }} </template>
				</el-table-column>
				<el-table-column
					prop="shortName"
					:label="t('主体简称')"
					show-overflow-tooltip
					sortable="custom"
				>
					<template #default="{ row }"> {{ row.shortName || '---' }} </template>
				</el-table-column>
				<el-table-column
					prop="contact"
					:label="t('联系人')"
					show-overflow-tooltip
					sortable="custom"
				>
					<template #default="{ row }"> {{ row.contact || '---' }} </template>
				</el-table-column>
				<el-table-column
					prop="email"
					:label="t('邮箱')"
					show-overflow-tooltip
					sortable="custom"
				>
					<template #default="{ row }"> {{ row.email || '---' }} </template>
				</el-table-column>
				<el-table-column
					prop="phone"
					:label="t('电话')"
					show-overflow-tooltip
					sortable="custom"
				>
					<template #default="{ row }"> {{ row.phone || '---' }} </template>
				</el-table-column>
				<el-table-column
					prop="address"
					:label="t('地址')"
					show-overflow-tooltip
					sortable="custom"
				>
					<template #default="{ row }"> {{ row.address || '---' }} </template>
				</el-table-column>
				<el-table-column
					prop="bank"
					:label="t('开户行')"
					show-overflow-tooltip
					sortable="custom"
				>
					<template #default="{ row }"> {{ row.bank || '---' }} </template>
				</el-table-column>
				<el-table-column
					prop="bankAccountNumber"
					:label="t('开户账号')"
					show-overflow-tooltip
					sortable="custom"
				>
					<template #default="{ row }">
						{{ row.bankAccountNumber || '---' }}
					</template>
				</el-table-column>
				<el-table-column
					prop="createName"
					:label="t('创建人')"
					show-overflow-tooltip
					sortable="custom"
				/>
				<el-table-column
					prop="createTime"
					:label="t('创建时间')"
					show-overflow-tooltip
					sortable="custom"
				/>
				<el-table-column :label="$t('common.action')" width="150" fixed="right">
					<template #default="{ row }">
						<div class="flex items-center">
							<el-button
								text
								type="primary"
								class="mr20"
								@click="openDialog('edit', row)"
								v-auth="'entity_edit'"
								>{{ $t('编辑') }}
							</el-button>
							<el-button
								text
								type="primary"
								class="mr20"
								@click="openDialog('log', row)"
								v-auth="'entity_log'"
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
			:dictMap="dictMap"
			:visibleType="visibleType"
			:title="title"
			@closeDialog="closeDialog"
		></FormDialog>
		<LogDialog
			v-model="logDialogVisible"
			:id="currentRow.id"
			:biz-type="['LEGAL_PERSON']"
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
// import { ElMessageBox } from 'element-plus';
import { useMultipleDicts } from '/@/hooks/multipleDicts';
import { sysCountryList } from '/@/api/materialFlow/track';
// import { getEntityPage, getEntityDetailInfo, postEntityDelete } from '/@/api/purchase/entity/index';
import {
	getLegalEntityList,
	getLegalEntityDetail,
} from '/@/api/admin/legalEntity/index';
// import { useResultDialog } from '/@/hooks/useResultDialog';
const TreeSelectInputApi = defineAsyncComponent(
	() => import('/@/componentsApi/TreeSelectInputApi/index.vue')
);
const FormDialog = defineAsyncComponent(
	() => import('./components/form-dialog.vue')
);
const ToolBar = defineAsyncComponent(
	() => import('/@/components/ToolBar/tool-bar.vue')
);
const LogDialog = defineAsyncComponent(
	() => import('/@/components/log/log-dialog.vue')
);
const SelectInput = defineAsyncComponent(
	() => import('/@/components/TableFormModule/select-input.vue')
);
// const { open } = useResultDialog();
const { t } = useI18n();
// table的引用
const tableRef = ref();
// 搜索变量
const queryRef = ref();
// 是否显示搜索
const showSearch = ref(true);

// 当前选中的行
const selectedRows = ref<Array<any>>([]);
// 当前点击的行
const currentRow = ref({
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

const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {
		status: 1,
	},
	pageList: getLegalEntityList,
	loading: false,
	dataList: [],
	ascs: [],
	descs: ['create_time'],
});

const { dictMap } = useMultipleDicts(
	[
		{
			key: 'countryList',
			fetchFn: sysCountryList,
		}, // 国家列表
	],
	{
		isAuto: true,
	}
);

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
		current: 1,
		size: 10,
		status: 1, // 默认启用
	};
	getDataList();
};

// 打开对话框
const openDialog = async (type: string, row?: any) => {
	try {
		if (type === 'add') {
			title.value = t('添加法人主体');
			visibleType.value = 'add';
			currentRow.value = {
				id: '',
			};
			visible.value = true;
		} else if (type === 'edit') {
			const res = await getLegalEntityDetail({ id: row.id });
			if (res.code === 0) {
				title.value = t('编辑法人主体');
				visibleType.value = 'edit';
				currentRow.value = res.data;
				visible.value = true;
			}
		} else if (type === 'del') {
			// return;
			// if (selectedRows.value.length === 0) {
			// 	useMessage().error(t('请选择要删除的记录'));
			// 	return;
			// }
			// ElMessageBox.confirm(t('确认删除吗？'), t('删除法人主体'), {
			// 	type: 'warning',
			// })
			// 	.then(async () => {
			// 		const ids = selectedRows.value.map((item) => item.id);
			// 		const res = await postEntityDelete({
			// 			ids,
			// 		});
			// 		if (res.code === 0) {
			// 			if (res?.data?.failCount  > 0) {
			// 				// 展示错误提示
			// 				open({
			// 					title: t('删除失败'),
			// 					data: res.data,
			// 				});
			// 			} else if (res?.data?.failCount  === 0) {
			// 				useMessage().success('删除成功');
			// 			}
			// 		} else if (res.code === 5004) {
			// 			ElMessageBox.confirm(t(res.msg), t('提示'), {
			// 				type: 'error',
			// 			});
			// 		}
			// 		// 清空已选
			// 		tableRef.value.clearSelection();
			// 		getDataList();
			// 	})
			// 	.catch(() => {});
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
