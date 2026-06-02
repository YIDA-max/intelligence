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
										text: '平台',
										code: 'platformChannelCodes',
										searchFn: register?.getDataList,
										getTreeDataParams: 'platform_channel',
									}"
									@change="changePlatform"
								/>
							</el-form-item>
							<el-form-item>
								<custom-cascader
									v-model:queryForm="register.state.queryForm"
									:data="storeData"
									:settings="{
										code: 'storeIds',
										text: '店铺站点',
										width: '190px',
										props: {
											value: 'id',
											label: 'name',
											children: 'children',
										},
										checkStrictly: false,
										showSelectAll: false,
									}"
									@change="register?.getDataList"
								/>
							</el-form-item>
							<el-form-item>
								<TreeSelectInputApi
									v-model:queryForm="register.state.queryForm"
									componentType="kingdeeOrg"
									:settings="{
										text: '金蝶销售组织',
										code: 'kingdeeSalesOrgCodes',
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
				<!-- 店铺站点 -->
				<template #storeName="{ row }">
					{{ row.storeName }}:{{ row.storeSite }}
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
				title="导入销售组织关系"
				:templateUrl="SALES_ORG_RELATION_IMPORT_TEMPLATE_URL"
				:excelUploadApi="SALES_ORG_RELATION_IMPORT_URL"
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
	getSalesOrgRelationPage,
	getExportSalesOrgRelation,
	SALES_ORG_RELATION_IMPORT_TEMPLATE_URL,
	SALES_ORG_RELATION_IMPORT_URL,
	deleteSalesOrgRelation,
} from '/@/api/integrations/baseAssociationConfig/salesOrgRelation';
import { getGroupStoreByPlatform } from '/@/api/base/store/index';
import { defineAsyncComponent, ref, reactive, onMounted } from 'vue';
import { useMessage } from '/@/hooks/message';
import { useI18n } from 'vue-i18n';
import { auth } from '/@/utils/authFunction';

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
const CustomCascader = defineAsyncComponent(
	() => import('/@/components/TreeSelectInput/custom-cascader.vue')
);
const SelectDate = defineAsyncComponent(
	() => import('/@/components/TableFormModule/select-date.vue')
);
const TreeSelectInputApi = defineAsyncComponent(
	() => import('/@/componentsApi/TreeSelectInputApi/index.vue')
);

const { t } = useI18n();
const AdvancedSearchStyleRef = ref();
const queryRef = ref();
const importDialogRef = ref();
const tableRef = ref();
const showSearch = ref(true);

const state: BasicTableProps = reactive<BasicTableProps>({
	pageList: getSalesOrgRelationPage,
	columns,
	toolBarConfig: {
		handleRefresh: () => {
			register?.getDataList();
		},
		isShowExport: auth(`${moduleKey}-export`),
		handleExport: () => {
			handleExport();
		},
		settingKey: 'salesOrgRelation',
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
			platformChannelCode: platformCode,
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
const changePlatform = () => {
	loadStoreData();
	register?.getDataList();
};

onMounted(() => {
	loadStoreData();
});
// 导出
const handleExport = async () => {
	try {
		// 显示加载状态
		state.loading = true;
		const ids = BaseTableRef.value
			?.getCheckboxRecords()
			?.map((item: any) => item.id);
		// 发送请求，设置 responseType 为 'blob' 以接收二进制流
		await getExportSalesOrgRelation({
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
		// 隐藏加载状态
		state.loading = false;
	}
};

// 删除
const handleDelete = async (_item: any, row: any) => {
	await deleteSalesOrgRelation({ id: row.id });
	useMessage().success(t('common.delSuccessText'));
	register?.getDataList();
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
