<template>
	<div class="layout-padding">
		<el-row :style="{ marginTop: '5px' }">
			<!-- 工具栏 -->
			<ToolBar
				@handleRefresh="
					() => {
						removeDataList();
					}
				"
				@handleExport="exportPartFn"
				:is-show-export="auth('product_category_export')"
				:is-show-refresh="true"
			>
				<template #left-tool>
					<el-button
						@click="
							() => {
								openDialog('add');
							}
						"
						class="ml10"
						type="primary"
						v-auth="'product_category_add'"
					>
						{{ $t('添加类目') }}
					</el-button>
					<el-button
						@click="importDialogRef.show()"
						v-auth="'product_category_import'"
						>导入</el-button
					>
					<el-button
						@click="updateMaterialControl"
						v-auth="'product_category_update_material_control'"
						>更新物控</el-button
					>
				</template>
				<template #right-tool>
					<el-select
						v-model="state.queryForm.status"
						placeholder="类目状态"
						clearable
						style="width: 150px"
						@change="
							async () => {
								getDataList();
								// 触发搜索
								await queryRef?.getdeptTree();
								// 重新获取树的数据
								treeData = queryRef?.getTreeData() || [];
							}
						"
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
					<!-- <el-select
						class="ml10"
						v-model="state.queryForm.materialControlUserIds"
						placeholder="物控负责人"
						collapse-tags
						:max-collapse-tags="1"
						clearable
						filterable
						multiple
						style="width: 150px"
						@change="getDataList"
					>
						<el-option
							v-for="item in dictMap.materialControlList"
							:key="item.userId"
							:label="item.name"
							:value="item.userId"
						/>
					</el-select> -->
					<div>
						<TreeSelectInputApi
							v-model:queryForm="state.queryForm"
							:style="{ width: '220px' }"
							:showInputSearch="false"
							multiple
							placeholder="物控负责人"
							:settings="{
								getTreeData: getUsersByDepartment,
								text: '物控负责人',
								width: '220px',
								searchFn: async () => {
									await getDataList();
								},
								selectTreeProps: {
									value: 'userId',
									label: 'name',
								},
								getIdsCode: 'userId',
								code: 'materialControlUserIds',
							}"
						/>
					</div>

					<el-tree-select
						:style="{
							marginLeft: '10px',
							width: '310px',
						}"
						v-model="state.queryForm.categoryCodes"
						:data="treeData"
						:props="{
							label: 'name',
							value: 'id',
							children: 'children',
						}"
						:multiple="true"
						collapse-tags
						:filterable="true"
						:default-expand-all="true"
						:check-strictly="true"
						placeholder="请选择类目"
						clearable
						@change="treeSelectChange"
					/>
				</template>
			</ToolBar>
		</el-row>

		<splitpanes>
			<pane size="15">
				<div class="layout-padding-auto layout-padding-view">
					<el-scrollbar>
						<Query-tree
							:placeholder="$t('搜索类目代码/名称')"
							:query="(keyword: String) => {return getCategoryTree({keyword: keyword,status: state.queryForm.status});}"
							:show-expand="true"
							@node-click="handleNodeClick"
							ref="queryRef"
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
						</Query-tree>
					</el-scrollbar>
				</div>
			</pane>
			<pane class="ml8">
				<div class="layout-padding-auto layout-padding-view">
					<el-table
						v-loading="state.loading"
						:data="state.dataList"
						row-key="id"
						ref="tableRef"
						border
						:cell-style="tableStyle.cellStyle"
						:header-cell-style="tableStyle.headerCellStyle"
						@sort-change="sortChangeHandle"
						native-scrollbar
					>
						<el-table-column
							align="center"
							type="selection"
							width="40"
							:reserve-selection="true"
						/>
						<el-table-column
							:label="t('上级类目')"
							prop="parentCategoryCode"
							show-overflow-tooltip
						/>
						<el-table-column
							:label="t('类目代码')"
							prop="categoryCode"
							sortable="custom"
							show-overflow-tooltip
						/>
						<el-table-column
							:label="t('类目名称')"
							prop="categoryName"
							sortable="custom"
							show-overflow-tooltip
						/>
						<el-table-column :label="t('状态')">
							<template #default="{ row }">
								<el-switch
									:modelValue="!!row.status"
									size="small"
									@change="
										(e: any) => {
											statusChange(e, row);
										}
									"
									:disabled="
										row.status === 1 || row.status === '1'
											? !auth('product_category_stop')
											: !auth('product_category_start')
									"
								></el-switch>
							</template>
						</el-table-column>
						<el-table-column
							:label="t('物控负责人')"
							prop="materialControlUserName"
							show-overflow-tooltip
						>
							<template #default="{ row }">
								<span>{{ row.materialControlUserName || '---' }}</span>
							</template>
						</el-table-column>
						<el-table-column
							:label="t('创建人')"
							prop="createName"
							show-overflow-tooltip
						/>
						<el-table-column
							:label="t('创建时间')"
							prop="createTime"
							sortable="custom"
							show-overflow-tooltip
						/>
						<el-table-column
							:label="t('更新时间')"
							prop="updateTime"
							sortable="custom"
							show-overflow-tooltip
						/>
						<el-table-column :label="$t('common.action')" width="250">
							<template #default="scope">
								<el-button
									text
									type="primary"
									@click="openDialog('edit', scope.row)"
									v-auth="'product_category_edit'"
									>{{ $t('common.editBtn') }}
								</el-button>
								<el-button
									text
									type="primary"
									@click="openDialog('log', scope.row)"
									>{{ $t('日志') }}
								</el-button>
							</template>
						</el-table-column>
					</el-table>
					<pagination
						v-bind="state.pagination"
						@current-change="currentChangeHandle"
						@size-change="sizeChangeHandle"
					>
					</pagination>
				</div>
			</pane>
		</splitpanes>

		<el-dialog
			v-model="statusVisible"
			:show-close="false"
			:close-on-click-modal="false"
			:close-on-press-escape="false"
			width="25%"
			class="status-header"
		>
			<div>
				<div class="flex items-center mb10">
					<el-icon size="22px" :color="status ? '#2E5CF6' : '#f56c6c'"
						><Warning
					/></el-icon>
					<span class="text-lg ml8">
						{{ status ? '启用' : '停用' }}
					</span>
				</div>
				<div class="text-lg ml30">
					<div>{{ status ? '' : '停用后不再允许被SKU/SPU引用' }}</div>
					<div>
						确定{{ status ? '启用' : '停用' }}{{ currentRow?.categoryName }}[{{
							currentRow?.categoryCode
						}}]吗?
					</div>
				</div>
			</div>
			<template #footer>
				<div class="dialog-footer">
					<el-button @click="statusVisible = false">取消</el-button>
					<el-button v-if="status" type="primary" @click="changeStatus">
						启用
					</el-button>
					<el-button v-else type="danger" plain @click="changeStatus"
						>停用</el-button
					>
				</div>
			</template>
		</el-dialog>

		<CategoryDialog
			v-model="visible"
			:title="title"
			@close-dialog="closeDialog"
			:treeData="treeData"
			:visibleType="visibleType"
			:currentRow="currentRow"
		/>

		<!-- <uploadExcel
			ref="excelUploadRef"
			:title="$t('类目导入')"
			temp-url="/admin/sys-file/local/file/user.xlsx"
			url="/product/category/import"
			@refreshDataList="getDataList"
		/> -->
		<ImportDialog
			ref="importDialogRef"
			title="导入类目"
			templateUrl="/files/import-template/导入类目模版.xlsx"
			excelUploadApi="/product/category/import"
			@refreshDataList="getDataList"
		/>
		<!-- 日志 -->
		<LogDialog
			v-model="logVisible"
			:currentRow="currentRow"
			@close-dialog="logVisible = false"
		/>
		<!-- 更新物控 -->
		<UpdateMaterialControl
			ref="updateMaterialControlRef"
			@getDataList="
				() => {
					tableRef?.clearSelection();
					getDataList();
				}
			"
		/>
	</div>
</template>

<script lang="ts" name="systemUser" setup>
import { getCategoryList } from '/@/api/product/category';
import { BasicTableProps, useTable } from '/@/hooks/table';
import { useMessage } from '/@/hooks/message';
import {
	getCategoryTree,
	postCategoryEnable,
	postCategoryDisable,
	getCategoryExportPart,
	getUsersByDepartment,
} from '/@/api/product/category';
import { useI18n } from 'vue-i18n';
import { onMounted } from 'vue';
import { auth } from '/@/utils/authFunction';
// 动态引入组件
const CategoryDialog = defineAsyncComponent(
	() => import('./components/category-dialog.vue')
);
const QueryTree = defineAsyncComponent(
	() => import('/@/components/QueryTree/index.vue')
);
// const PopoverInput = defineAsyncComponent(() => import('/@/components/PopoverInput/index.vue'));
const ToolBar = defineAsyncComponent(
	() => import('/@/components/ToolBar/tool-bar.vue')
);
// const uploadExcel = defineAsyncComponent(() => import('./components/upload-excel.vue'));
const ImportDialog = defineAsyncComponent(
	() => import('/@/components/fileUpload/importDialog.vue')
);
const TreeSelectInputApi = defineAsyncComponent(
	() => import('/@/componentsApi/TreeSelectInputApi/index.vue')
);

const UpdateMaterialControl = defineAsyncComponent(
	() => import('./components/updateMaterialControl.vue')
);

const { t } = useI18n();
const LogDialog = defineAsyncComponent(
	() => import('./components/log-dialog.vue')
);
// 定义变量内容

// const excelUploadRef = ref();
const queryRef = ref();
const tableRef = ref();
const importDialogRef = ref();
// 当前的树数据
const treeData = ref([]);

// 二次确认状态
const status = ref<boolean>(false);
const statusVisible = ref(false);
// 当前点击的行
const currentRow = ref<any>({
	id: '',
});

// 更新物控
const updateMaterialControlRef = ref();
// 弹窗相关
const visible = ref(false);
const title = ref('添加类目');
const visibleType = ref('');
const logVisible = ref(false);
// 定义表格查询、后台调用的API
const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {
		categoryCode: '',
		username: '',
		phone: '',
		statusBoole: '', // 是否展示停用品牌
		status: 1, // 默认只展示启用品牌
	},
	pageList: getCategoryList,
	descs: ['create_time'],
	ascs: [],
});
const {
	getDataList,
	currentChangeHandle,
	sortChangeHandle,
	sizeChangeHandle,
	resetTableQuery,
	tableStyle,
} = useTable(state, tableRef);

// 初始化
onMounted(async () => {
	// 获取树的数据
	const res = await getCategoryTree({
		status: state.queryForm.status,
	});
	treeData.value = res.data ? res.data : [];
});

// 初始化重新刷新数据
const removeDataList = () => {
	resetTableQuery(() => {
		queryRef.value?.clearCurrentNode();
		return {
			queryForm: {
				categoryCode: '',
				status: 1,
				current: 1,
				size: 10,
			},
			descs: ['create_time'],
			ascs: [],
		};
	});
};

// 点击树,查询右边的数据
const handleNodeClick = (e: any) => {
	state.queryForm.categoryCode = e.id;
	// 清空选中数据
	tableRef.value?.clearSelection();
	getDataList();
};

// 更新物控
const updateMaterialControl = () => {
	const ids = tableRef.value?.getSelectionRows().map((item: any) => item.id);
	if (!ids || ids.length === 0) {
		useMessage().error(t('请至少选择一条数据'));
		return;
	}
	updateMaterialControlRef.value.show(ids);
};

// 导出类目
const exportPartFn = async () => {
	try {
		const ids = tableRef.value?.getSelectionRows().map((item: any) => item.id);
		// 显示加载状态
		state.loading = true;
		// 发送请求，设置 responseType 为 'blob' 以接收二进制流
		await getCategoryExportPart({
			ids,
			...state.queryForm,
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

// 打开类别弹窗
const openDialog = (type: string, row?: any) => {
	if (type === 'add') {
		// 添加操作
		title.value = '添加类目';
	} else if (type === 'edit' && row) {
		// 编辑操作
		currentRow.value = row;
		title.value = '编辑类目';
	} else if (type === 'view' && row) {
		// 查看操作
		currentRow.value = row;
		title.value = '查看类目';
	} else if (type === 'log' && row) {
		// 查看日志
		currentRow.value = row;
		logVisible.value = true;
		title.value = '品牌日志';
		return;
	}
	visible.value = true;
	// 设置弹窗类型
	visibleType.value = type;
};
// 关闭品牌弹窗
const closeDialog = async () => {
	visible.value = false;
	// 刷新数据列表
	getDataList();
	// 刷新树形结构数据
	await queryRef.value?.getdeptTree();
	// 重新获取树的数据
	treeData.value = queryRef.value?.getTreeData() || [];
};

// 类别状态修改
const statusChange = (type: boolean, row: any) => {
	status.value = type;
	statusVisible.value = true;
	// 设置当前行
	currentRow.value = row;
};
// 修改类别状态
const changeStatus = async () => {
	// 关闭弹窗
	statusVisible.value = false;
	// 调用接口修改状态
	if (status.value) {
		// 启用操作
		await postCategoryEnable({ id: currentRow.value?.id });
		getDataList();
	} else {
		// 停用操作
		await postCategoryDisable({ id: currentRow.value?.id });
		getDataList();
	}
};
// 树形选择变化,和左边的树形结构联动
const treeSelectChange = (e: string) => {
	// 重新获取数据
	// queryRef.value?.getdeptTree();
	queryRef.value?.setCurrentNode();
	// 如果没有选择节点，就说明清空了，需要重新查询数据
	if (!e) {
		getDataList();
	}
	// 重新获取下面table的数据
	getDataList();
};
</script>
