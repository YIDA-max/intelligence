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
									componentType="warehouseQianyi"
									:settings="{
										text: '仟易仓库',
										code: 'warehouseCodes',
										searchFn: register?.getDataList,
										getTreeDataParams: { warehouseTypes: [0, 1, 3] },
									}"
								/>
							</el-form-item>
							<el-form-item>
								<TreeSelectInputApi
									v-model:queryForm="register.state.queryForm"
									componentType="dicts"
									:settings="{
										text: '仟易仓库类型',
										code: 'warehouseTypes',
										searchFn: register?.getDataList,
										getTreeDataParams: 'warehouse_type',
									}"
								/>
							</el-form-item>
							<el-form-item>
								<TreeSelectInputApi
									v-model:queryForm="register.state.queryForm"
									componentType="kingdeeOrg"
									:settings="{
										text: '金蝶库存组织',
										code: 'kingdeeInventoryOrgCodes',
										searchFn: register?.getDataList,
									}"
								/>
							</el-form-item>
							<el-form-item>
								<TreeSelectInputApi
									v-model:queryForm="register.state.queryForm"
									componentType="warehouseInfoKingdee"
									:settings="{
										text: '金蝶仓库',
										code: 'kingdeeWarehouseCodes',
										searchFn: register?.getDataList,
									}"
								/>
							</el-form-item>
							<el-form-item>
								<TreeSelectInputApi
									v-model:queryForm="register.state.queryForm"
									componentType="warehouseInfoKingdee"
									:settings="{
										text: '金蝶虚拟在途仓',
										code: 'kingdeeVirtualTransitWhCodes',
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
				title="导入库存组织关系"
				:templateUrl="INVENTORY_ORG_RELATION_IMPORT_TEMPLATE_URL"
				:excelUploadApi="INVENTORY_ORG_RELATION_IMPORT_URL"
				:accept="'.xlsx,.xls'"
				@refreshDataList="register?.getDataList"
			/>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import {
	BasicTableProps,
	useTable,
} from '/@/components/BaseTable/hooks/BaseTable';
import { columns, moduleKey, actionMenuList } from './config';
import {
	getInventoryOrgRelationPage,
	INVENTORY_ORG_RELATION_IMPORT_TEMPLATE_URL,
	INVENTORY_ORG_RELATION_IMPORT_URL,
	getExportInventoryOrgRelation,
	deleteInventoryOrgRelation,
} from '/@/api/integrations/baseAssociationConfig/inventoryOrgRelation';
import { useMessage } from '/@/hooks/message';
import { auth } from '/@/utils/authFunction';
import { getGroupStoreByPlatform } from '/@/api/base/store/index';
import { defineAsyncComponent, ref, reactive, onMounted } from 'vue';
const EditOrAdd = defineAsyncComponent(
	() => import('./components/addOrEdit/index.vue')
);
const ActionDropdown = defineAsyncComponent(
	() => import('/@/components/ActionDropdown/index.vue')
);
const ImportDialog = defineAsyncComponent(
	() => import('/@/components/fileUpload/importDialog.vue')
);
const AdvancedSearchStyle = defineAsyncComponent(
	() => import('/@/components/TableFormModule/advanced-search-style.vue')
);

const SelectDate = defineAsyncComponent(
	() => import('/@/components/TableFormModule/select-date.vue')
);
const TreeSelectInputApi = defineAsyncComponent(
	() => import('/@/componentsApi/TreeSelectInputApi/index.vue')
);

const AdvancedSearchStyleRef = ref();
const queryRef = ref();
const importDialogRef = ref();
const tableRef = ref();
const showSearch = ref(true);
const { t } = useI18n();

const state: BasicTableProps = reactive<BasicTableProps>({
	pageList: getInventoryOrgRelationPage,
	columns,
	toolBarConfig: {
		handleRefresh: () => {
			register?.getDataList();
		},
		isShowExport: auth(`${moduleKey}-export`),
		handleExport: () => {
			handleExport();
		},
		settingKey: 'inventoryOrgRelation',
		isShowSetting: true,
	},
	descsDefault: ['create_time'],
});

const { register, tableRef: BaseTableRef } = useTable(state, tableRef);

const storeData = ref<Array<any>>([]);
const loadStoreData = async () => {
	try {
		const platformCode = register?.state?.queryForm?.platformChannelCodes?.[0];
		const res = await getGroupStoreByPlatform({
			platformChannelCode: platformCode || undefined,
		});
		storeData.value =
			res?.data?.map((item: any) => ({
				id: item.siteCode,
				name: item.siteCode,
				children: item.stores?.map((val: any) => ({
					id: val.id,
					name: val.storeName,
				})),
			})) ?? [];
	} catch {
		storeData.value = [];
	}
};

onMounted(() => {
	loadStoreData();
});

const handleExport = async () => {
	try {
		state.loading = true;
		const ids = BaseTableRef.value
			?.getCheckboxRecords()
			?.map((item: any) => item.id);
		await getExportInventoryOrgRelation({
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
	const res = await deleteInventoryOrgRelation({ id: row.id });
	if (res.code === 0) {
		useMessage().success(t('common.delSuccessText'));
		register?.getDataList();
	}
};

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
