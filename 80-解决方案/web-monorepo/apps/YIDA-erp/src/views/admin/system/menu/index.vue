<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-row shadow="hover" v-show="showSearch" class="ml10">
				<el-form
					:inline="true"
					:model="state.queryForm"
					@submit.prevent
					@keyup.enter="getDataList"
					ref="queryRef"
				>
					<el-form-item :label="$t('sysmenu.name')" prop="menuName">
						<el-input
							:placeholder="$t('sysmenu.inputNameTip')"
							clearable
							style="max-width: 180px"
							v-model="state.queryForm.menuName"
						/>
					</el-form-item>
					<el-form-item>
						<el-button @click="query" class="ml10" icon="search" type="primary">
							{{ $t('common.queryBtn') }}
						</el-button>
						<el-button @click="resetQuery" icon="Refresh">{{
							$t('common.resetBtn')
						}}</el-button>
					</el-form-item>
				</el-form>
			</el-row>

			<el-row>
				<ToolBar
					@handleRefresh="getDataList"
					@handle-export="handleExport"
					:is-show-export="false"
				>
					<template #left-tool>
						<el-button
							@click="onOpenAddMenu"
							class="ml10"
							icon="folder-add"
							type="primary"
							v-auth="'sys_menu_add'"
						>
							{{ $t('common.addBtn') }}
						</el-button>
						<el-button @click="onOpenImportMenu" class="ml10">
							{{ $t('导入') }}
						</el-button>
						<el-dropdown @command="(type: string) => handleExport(type)">
							<el-button class="ml10">
								{{ $t('导出') }}
								<el-icon class="el-icon--right">
									<arrow-down />
								</el-icon>
							</el-button>
							<template #dropdown>
								<el-dropdown-menu>
									<el-dropdown-item command="1">
										导出更新数据
									</el-dropdown-item>
									<el-dropdown-item command="2">
										导出新增数据
									</el-dropdown-item>
								</el-dropdown-menu>
							</template>
						</el-dropdown>
						<el-dropdown
							@command="(type: string) => handleSelectAllAndExport(type)"
							v-if="false"
						>
							<el-button class="ml10">
								{{ $t('全选导出') }}
								<el-icon class="el-icon--right">
									<arrow-down />
								</el-icon>
							</el-button>
							<template #dropdown>
								<el-dropdown-menu>
									<el-dropdown-item command="1">
										全选导出更新数据
									</el-dropdown-item>
									<el-dropdown-item command="2">
										全选导出新增数据
									</el-dropdown-item>
								</el-dropdown-menu>
							</template>
						</el-dropdown>
					</template>
				</ToolBar>
			</el-row>
			<el-table
				ref="tableRef"
				:data="tableList"
				lazy
				:indent="16"
				:load="load"
				:tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
				row-key="id"
				style="width: 100%"
				v-loading="state.loading"
				border
				:cell-style="tableStyle.cellStyle"
				:header-cell-style="tableStyle?.headerCellStyle"
				native-scrollbar
			>
				<el-table-column
					type="selection"
					width="55"
					:reserve-selection="true"
				/>
				<el-table-column
					:label="$t('sysmenu.name')"
					fixed
					prop="name"
					show-overflow-tooltip
				></el-table-column>
				<el-table-column
					:label="$t('sysmenu.sortOrder')"
					prop="sortOrder"
					show-overflow-tooltip
				></el-table-column>
				<el-table-column
					:label="$t('sysmenu.icon')"
					prop="icon"
					show-overflow-tooltip
				>
					<template #default="scope">
						<SvgIcon :name="scope.row.meta.icon" />
					</template>
				</el-table-column>
				<el-table-column
					:label="$t('sysmenu.path')"
					prop="path"
					show-overflow-tooltip
				></el-table-column>
				<el-table-column :label="$t('sysmenu.menuType')" show-overflow-tooltip>
					<template #default="scope">
						<el-tag v-if="scope.row.menuType === '0'">左菜单</el-tag>
						<el-tag v-if="scope.row.menuType === '2'">顶菜单</el-tag>
						<el-tag type="success" v-if="scope.row.menuType === '1'"
							>按钮</el-tag
						>
					</template>
				</el-table-column>
				<el-table-column :label="$t('sysmenu.keepAlive')" show-overflow-tooltip>
					<template #default="scope">
						<!-- 左菜单和顶菜单才有是否缓冲(这个逻辑好像是错误的，但是先这样写好像没有顶菜单这种说法)  -->
						<div
							v-if="scope.row.menuType === '0' || scope.row.menuType === '2'"
						>
							<el-tag v-if="scope.row.meta.isKeepAlive">开启</el-tag>
							<el-tag type="info" v-else>关闭</el-tag>
						</div>
					</template>
				</el-table-column>
				<el-table-column
					:label="$t('sysmenu.permission')"
					:show-overflow-tooltip="true"
					prop="permission"
				></el-table-column>
				<el-table-column
					:label="$t('common.action')"
					show-overflow-tooltip
					width="250"
				>
					<template #default="scope">
						<el-button
							icon="folder-add"
							@click="onOpenAddMenu('add', scope.row)"
							text
							type="primary"
							v-auth="'sys_menu_add'"
						>
							{{ $t('common.addBtn') }}
						</el-button>
						<el-button
							icon="edit-pen"
							@click="onOpenEditMenu('edit', scope.row)"
							text
							type="primary"
							v-auth="'sys_menu_edit'"
							>{{ $t('common.editBtn') }}
						</el-button>

						<el-tooltip
							icon="delete"
							:content="$t('sysmenu.deleteDisabledTip')"
							:disabled="!deleteMenuDisabled(scope.row)"
							placement="top"
						>
							<span style="margin-left: 12px">
								<el-button
									icon="delete"
									:disabled="deleteMenuDisabled(scope.row)"
									@click="handleDelete(scope.row)"
									text
									type="primary"
									v-auth="'sys_menu_del'"
								>
									{{ $t('common.delBtn') }}
								</el-button>
							</span>
						</el-tooltip>
					</template>
				</el-table-column>
			</el-table>
		</div>

		<ImportDialog
			ref="importDialogRef"
			title="导入菜单"
			templateUrl="/files/import-template/导入菜单模板.xlsx"
			excelUploadApi="/admin/menu/import"
			:accept="'.xlsx,.xls'"
			@refreshDataList="getDataList"
		/>
		<MenuDialog @refresh="query()" ref="menuDialogRef" />
	</div>
</template>

<script lang="ts" name="systemMenu" setup>
import { delObj, pageList, menuExport, useMenuApi } from '/@/api/admin/menu';
import { BasicTableProps, useTable } from '/@/hooks/table';
import { useMessage, useMessageBox } from '/@/hooks/message';
import { useI18n } from 'vue-i18n';
import { isArray } from 'lodash';
// 引入组件
const MenuDialog = defineAsyncComponent(() => import('./form.vue'));
const ToolBar = defineAsyncComponent(
	() => import('/@/components/ToolBar/tool-bar.vue')
);
const ImportDialog = defineAsyncComponent(
	() => import('/@/components/fileUpload/importDialog.vue')
);
const menuApi = useMenuApi();
const { t } = useI18n();
// 定义变量内容
const tableRef = ref();
const menuDialogRef = ref();
const showSearch = ref(true);
const queryRef = ref();
// 导入弹窗的引用
const importDialogRef = ref();
const state: BasicTableProps = reactive<BasicTableProps>({
	pageList: pageList, // H
	queryForm: {
		parentId: -1,
		menuName: '',
	},
	isPage: false,
	style: {
		textAlign: 'left',
	},
});

const { getDataList, tableStyle } = useTable(state, tableRef);

// 根据类型判断是否有子节点 (这逻辑非常垃圾！)
const setHasChildren = (arr: any[]) => {
	arr.forEach((item) => {
		// 添加 hasChildren 属性
		item.hasChildren = item.menuType !== '1';
	});
};
const tableList = computed(() => {
	const list = state.dataList;
	if (Array.isArray(list)) {
		setHasChildren(list);
		// 清除 children 懒加载的时候再进行赋值
		list.forEach((item) => {
			// 在 再次展开的时候，是不需要 children 的
			if (item.children) item.children = [];
		});
	}
	return list;
});

// 打开新增菜单弹窗
const onOpenAddMenu = (type?: string, row?: any) => {
	menuDialogRef.value.openDialog(type, row);
};
// 打开编辑菜单弹窗
const onOpenEditMenu = (type: string, row: any) => {
	menuDialogRef.value.openDialog(type, row);
};
// 打开导入菜单弹窗
const onOpenImportMenu = () => {
	importDialogRef.value.show();
};
//是否禁用删除
const deleteMenuDisabled = (row: any) => {
	return (row.children || []).length > 0;
};

// 搜索事件
const query = () => {
	state.dataList = [];
	state.queryForm.parentId = undefined;
	getDataList();
};

// 清空搜索条件
const resetQuery = () => {
	queryRef.value.resetFields();
	state.dataList = [];
	getDataList();
};

const load = async (
	row: any,
	treeNode: unknown,
	resolve: (date: any[]) => void
) => {
	const param = {
		parentId: row.id,
	};
	const res = await pageList(param);
	const childrenList = res.data;
	// 如果不存在子节点就直接返回
	if (!isArray(childrenList)) {
		resolve([]);
		return;
	}
	// 设置 hasChildren 属性
	if (Array.isArray(childrenList)) {
		setHasChildren(childrenList);
	}
	resolve(childrenList);
};

// 删除操作
const handleDelete = async (row: any) => {
	try {
		await useMessageBox().confirm(t('common.delConfirmText'));
	} catch {
		return;
	}

	try {
		await delObj(row.id);
		getDataList();
		useMessage().success(t('common.delSuccessText'));
	} catch (err: any) {
		useMessage().error(err.msg);
	}
};
/***
 * 导出
 */
const handleExport = async (type: string) => {
	try {
		const ids = tableRef.value.getSelectionRows().map((item: any) => item.id);
		if (ids.length === 0) {
			useMessage().warning(t('请选择要导出的数据'));
			return;
		}
		// 显示加载状态
		state.loading = true;
		const api = menuExport;
		// 发送请求，设置 responseType 为 'blob' 以接收二进制流
		await api({
			ids,
			type,
		});
	} catch (error) {
		useMessage().error(t(error as string));
	} finally {
		// 隐藏加载状态
		state.loading = false;
	}
};

/**
 * 从 /admin/menu 返回的树结构中递归提取全部 id。
 */
const collectIdsFromTree = (
	tree: any[],
	idSet: Set<string | number> = new Set<string | number>()
) => {
	if (!Array.isArray(tree) || tree.length === 0) return idSet;
	for (const node of tree) {
		if (node?.id != null) {
			idSet.add(node.id);
		}
		if (Array.isArray(node?.children) && node.children.length > 0) {
			collectIdsFromTree(node.children, idSet);
		}
	}
	return idSet;
};

/**
 * 全选导出：使用 api/admin/menu（/admin/menu）获取完整树，递归收集 id 后导出。
 */
const handleSelectAllAndExport = async (type: string) => {
	try {
		state.loading = true;
		const res = await menuApi.getAdminMenu({
			menuName: state.queryForm.menuName,
		});
		const ids = Array.from(collectIdsFromTree(res?.data || []));
		if (!ids.length) {
			useMessage().warning(t('暂无可导出的数据'));
			return;
		}
		await menuExport({
			ids,
			type,
		});
	} catch (error: any) {
		useMessage().error(error?.msg || t('导出失败'));
	} finally {
		state.loading = false;
	}
};
</script>
