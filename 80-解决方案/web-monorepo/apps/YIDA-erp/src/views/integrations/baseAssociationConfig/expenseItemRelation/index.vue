<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-row class="ml10" v-show="showSearch">
				<el-form
					:inline="true"
					:model="register?.state?.queryForm"
					@keyup.enter="register?.getDataList"
					ref="queryRef"
				>
					<AdvancedSearchStyle
						ref="AdvancedSearchStyleRef"
						showRightBtn
						@reset="resetQuery"
						@search="register?.getDataList"
					>
						<template #default>
							<el-form-item>
								<TreeSelectInputApi
									v-model:queryForm="register.state.queryForm"
									componentType="dicts"
									:settings="{
										text: '业务模块',
										code: 'businessModules',
										searchFn: register?.getDataList,
										getTreeDataParams: 'kingdee_business_module',
									}"
								/>
							</el-form-item>
							<el-form-item>
								<TreeSelectInputApi
									v-model:queryForm="register.state.queryForm"
									componentType="dicts"
									:settings="{
										text: '费用类型',
										code: 'expenseTypes',
										searchFn: register?.getDataList,
										getTreeDataParams: 'kingdee_expense_type',
									}"
								/>
							</el-form-item>
							<el-form-item>
								<TreeSelectInputApi
									v-model:queryForm="register.state.queryForm"
									componentType="kingdeeFeeItem"
									:settings="{
										text: '金蝶费用项目',
										code: 'kingdeeExpenseCodes',
										searchFn: register?.getDataList,
									}"
								/>
							</el-form-item>
							<el-form-item>
								<TreeSelectInputApi
									v-model:queryForm="register.state.queryForm"
									componentType="userList"
									:settings="{
										text: '创建人',
										code: 'createIds',
										searchFn: register?.getDataList,
										getTreeDataParams: { lockFlag: 0 },
									}"
								/>
							</el-form-item>
							<el-form-item>
								<SelectDate
									v-model:queryForm="register.state.queryForm"
									:settings="{
										selectStyle: {
											width: '100px',
										},
										dateStyle: {
											width: '150px',
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
									:getDataList="register?.getDataList"
								/>
							</el-form-item>
						</template>
					</AdvancedSearchStyle>
				</el-form>
			</el-row>

			<BaseTable :register="register" ref="tableRef">
				<!-- 左侧工具栏 -->
				<template #left-tool>
					<div class="flex items-center">
						<EditOrAdd
							:type="'add'"
							v-auth="`${moduleKey}-add`"
							@getDataList="register?.getDataList"
						/>
						<el-button
							class="ml10"
							@click="importDialogRef?.show()"
							v-auth="`${moduleKey}-import`"
							>{{ $t('导入') }}
						</el-button>
					</div>
				</template>
				<!-- 操作栏 -->
				<template #action="{ row }">
					<div class="flex justify-center">
						<EditOrAdd
							:type="'edit'"
							:row="row"
							v-auth="`${moduleKey}-edit`"
							@getDataList="register?.getDataList"
						/>
						<ActionDropdown
							:row="row"
							:menu-list="actionMenuList"
							@delete="handleDelete"
						/>
					</div>
				</template>
			</BaseTable>
			<ImportDialog
				ref="importDialogRef"
				title="导入费用项目关系"
				:templateUrl="EXPENSE_ITEM_RELATION_IMPORT_TEMPLATE_URL"
				:excelUploadApi="EXPENSE_ITEM_RELATION_IMPORT_URL"
				:accept="'.xlsx,.xls'"
				@refreshDataList="register?.getDataList"
			/>
		</div>
	</div>
</template>

<script setup lang="ts">
import {
	BasicTableProps,
	useTable,
} from '/@/components/BaseTable/hooks/BaseTable';
import { columns, moduleKey, actionMenuList } from './config';
import {
	getExpenseItemRelationPage,
	EXPENSE_ITEM_RELATION_IMPORT_TEMPLATE_URL,
	EXPENSE_ITEM_RELATION_IMPORT_URL,
	getExportExpenseItemRelation,
	deleteExpenseItemRelation,
} from '/@/api/integrations/baseAssociationConfig/index';
import { useMessage } from '/@/hooks/message';
import { auth } from '/@/utils/authFunction';
import { defineAsyncComponent, ref, reactive } from 'vue';
import { useI18n } from 'vue-i18n';
const EditOrAdd = defineAsyncComponent(
	() => import('./components/addOrEdit/index.vue')
);
const AdvancedSearchStyle = defineAsyncComponent(
	() => import('/@/components/TableFormModule/advanced-search-style.vue')
);
const SelectDate = defineAsyncComponent(
	() => import('/@/components/TableFormModule/select-date.vue')
);
const ActionDropdown = defineAsyncComponent(
	() => import('/@/components/ActionDropdown/index.vue')
);
const ImportDialog = defineAsyncComponent(
	() => import('/@/components/fileUpload/importDialog.vue')
);
const TreeSelectInputApi = defineAsyncComponent(
	() => import('/@/componentsApi/TreeSelectInputApi/index.vue')
);

// 搜索变量
const AdvancedSearchStyleRef = ref();
const queryRef = ref();
const importDialogRef = ref();
// table的引用
const tableRef = ref();
// 是否显示搜索
const showSearch = ref(true);
const { t } = useI18n();

const state: BasicTableProps = reactive<BasicTableProps>({
	pageList: getExpenseItemRelationPage,
	columns,
	toolBarConfig: {
		handleRefresh: () => {
			register?.getDataList();
		},
		isShowExport: auth(`${moduleKey}-export`),
		handleExport: () => {
			handleExport();
		},
		settingKey: 'expenseItemRelation',
		isShowSetting: true,
	},
	descsDefault: ['create_time'],
});

//  table hook
const { register, tableRef: BaseTableRef } = useTable(state, tableRef);

const handleExport = async () => {
	try {
		state.loading = true;
		const ids = BaseTableRef.value
			?.getCheckboxRecords()
			?.map((item: any) => item.id);
		await getExportExpenseItemRelation({
			ids,
			...state.queryForm,
			ascs: state?.ascs,
			descs: state?.descs,
			current: 1,
			size: 10000,
		});
	} catch (error) {
		useMessage().error(`导出失败: ${error}`);
	} finally {
		state.loading = false;
	}
};
// 删除
const handleDelete = async (_item: any, row: any) => {
	const res = await deleteExpenseItemRelation({ id: row.id });
	if (res.code === 0) {
		useMessage().success(t('common.delSuccessText'));
		register?.getDataList();
	}
};
// 重置
// 清空搜索条件
const resetQuery = () => {
	register?.resetTableQuery(() => {
		return {
			queryForm: {
				current: 1,
				size: 10,
			},
			ascs: [],
			descs: [],
		};
	});
};
</script>

<style lang="scss" scoped>
.text-blue {
	color: #0089ef;
	word-break: break-all;
	white-space: pre-line;
	cursor: pointer;
	text-align: left;
}
</style>
