<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-row shadow="hover" v-show="showSearch" class="ml10">
				<el-form
					:inline="true"
					:model="state.queryForm"
					@submit.prevent
					@keyup.enter="register?.getDataList()"
					ref="queryRef"
				>
					<el-form-item>
						<TreeSelectInput
							v-model:queryForm="state.queryForm"
							:style="{ width: '220px' }"
							:settings="{
								getTreeData: async () => {
									return {
										code: 0,
										data: [
											{ label: '启用', value: 1 },
											{ label: '停用', value: 0 },
										],
									};
								},
								text: '状态',
								width: '220px',
								searchFn: register?.getDataList,
								code: 'status',
								selectTreeProps: {
									value: 'value',
									label: 'label',
									children: 'children',
								},
								getIdsCode: 'value',
							}"
						/>
					</el-form-item>
					<el-form-item>
						<el-select
							v-model="state.queryForm.tagLevel"
							placeholder="标签类型"
							clearable
							@change="register?.getDataList"
						>
							<el-option
								v-for="item in [
									{
										value: 1,
										label: '一级标签',
									},
									{
										value: 2,
										label: '二级标签',
									},
									{
										value: 3,
										label: '三级标签',
									},
									{
										value: 4,
										label: '四级标签',
									},
								]"
								:key="item.value"
								:label="item.label"
								:value="item.value"
							/>
						</el-select>
					</el-form-item>
					<el-form-item :label="$t('标签名称')" prop="tagName">
						<el-input
							:placeholder="$t('请输入标签名称')"
							clearable
							style="max-width: 180px"
							v-model="state.queryForm.tagName"
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
			<BaseTable
				:register="register"
				ref="tableRef"
				:columns="columns"
				:tree-config="treeConfig"
				:checkbox-config="{ highlight: true, trigger: 'checkbox' }"
				@toggle-tree-expand="toggleExpandChangeEvent"
			>
				<template #left-tool>
					<el-button
						@click="onOpenAddMenu"
						class="ml10"
						icon="folder-add"
						type="primary"
					>
						{{ $t('common.addBtn') }}
					</el-button>
					<el-button
						@click="onOpenImportMenu"
						class="ml10"
						v-auth="'tagSetting_import'"
					>
						{{ $t('导入') }}
					</el-button>
				</template>
				<template #tagLevel="{ row }">
					{{
						row.tagLevel === 1
							? '一级标签'
							: row.tagLevel === 2
							? '二级标签'
							: row.tagLevel === 3
							? '三级标签'
							: '四级标签'
					}}
				</template>
				<template #status="{ row }">
					<el-switch
						:modelValue="!!row.status"
						size="small"
						@change="handleChange($event, row)"
					></el-switch>
				</template>
				<template #action="{ row }">
					<el-button
						icon="folder-add"
						@click="onOpenAddMenu('add', row)"
						text
						type="primary"
						v-auth="'tagSetting_add'"
					>
						{{ $t('common.addBtn') }}
					</el-button>
					<el-button
						icon="edit-pen"
						@click="onOpenEditMenu('edit', row)"
						text
						type="primary"
						v-auth="'tagSetting_edit'"
						>{{ $t('common.editBtn') }}
					</el-button>
					<el-button
						icon="delete"
						@click="handleDelete(row)"
						text
						type="primary"
						v-auth="'tagSetting_delete'"
					>
						{{ $t('common.delBtn') }}
					</el-button>
				</template>
			</BaseTable>
		</div>

		<ImportDialog
			ref="importDialogRef"
			title="导入标签"
			templateUrl="/files/import-template/客诉标签导入模板.xlsx"
			excelUploadApi="/customer-service/tag/import"
			:accept="'.xlsx,.xls'"
			@refreshDataList="register?.getDataList()"
		/>
		<MenuDialog @refresh="query()" ref="menuDialogRef" />
	</div>
</template>

<script lang="ts" setup>
import { VxeTablePropTypes } from 'vxe-table';
import { menuExport } from '/@/api/admin/menu';
import {
	BasicTableProps,
	useTable,
} from '/@/components/BaseTable/hooks/BaseTable';
import { useMessage, useMessageBox } from '/@/hooks/message';
import { useI18n } from 'vue-i18n';
import { columns } from './config/tableColumn';
import { ElMessageBox } from 'element-plus';
import {
	getCustomerServiceTagPage,
	deleteTag,
	tagStatusUpdate,
} from '/@/api/customerService/orderSetting/index';
// 引入组件
const MenuDialog = defineAsyncComponent(() => import('./form.vue'));
const ImportDialog = defineAsyncComponent(
	() => import('/@/components/fileUpload/importDialog.vue')
);
const { t } = useI18n();

const treeConfig = reactive<VxeTablePropTypes.TreeConfig>({
	rowField: 'id',
	childrenField: 'children',
});

// const currentRow = ref();
// 定义变量内容
const tableRef = ref();
const menuDialogRef = ref();
const showSearch = ref(true);
const queryRef = ref();
// 导入弹窗的引用
const importDialogRef = ref();
const state: BasicTableProps = reactive<BasicTableProps>({
	pageList: getCustomerServiceTagPage,
	columns,
	queryForm: {
		// parentId: -1,
	},
	toolBarConfig: {
		handleRefresh: () => {
			register?.getDataList();
		},
		handleExport: () => {
			handleExport();
		},
		isShowExport: false,
		settingKey: 'tag-setting',
	},
});
const { register } = useTable(state, tableRef);

const toggleExpandChangeEvent = (row: any, expanded: boolean) => {
	// 如果是展开状态，则加载子节点数据
	if (expanded) {
		// 调用表格的 load 方法加载子节点数据
		tableRef.value.loadTreeChilds(row);
	}
};

/**
 * 状态切换
 */
const handleChange = async (newVal: boolean, row: any) => {
	ElMessageBox.confirm(`确定要${newVal ? '启用' : '停用'}该标签吗？`, '提示', {
		confirmButtonText: '确定',
		cancelButtonText: '取消',
		type: newVal ? 'info' : 'warning',
	})
		.then(async () => {
			try {
				const res = await tagStatusUpdate({
					id: row.id,
					status: newVal ? 1 : 0,
				});
				if (res.code === 0) {
					useMessage().success('操作成功');
					register?.getDataList();
				}
			} catch (error: any) {
				useMessage().error(error.msg || '操作失败，请稍后重试');
				// 刷新列表，恢复原状态
				register?.getDataList();
			}
		})
		.catch(() => {
			// 刷新列表，恢复原状态
			register?.getDataList();
		});
};

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

// 搜索事件
const query = () => {
	state.dataList = [];
	state.queryForm.parentId = undefined;
	register?.getDataList();
};

// 清空搜索条件
const resetQuery = () => {
	state.queryForm = {};
	queryRef.value.resetFields();
	state.dataList = [];
	register?.getDataList();
};

// 删除操作
const handleDelete = async (row: any) => {
	try {
		await useMessageBox().confirm(t('common.delConfirmText'));
	} catch {
		return;
	}

	try {
		const res = await deleteTag(row.id);
		if (res.code === 0) {
			useMessage().success(t('common.delSuccessText'));
			register?.getDataList();
		}
	} catch (err: any) {
		useMessage().error(err.msg);
	}
};
/***
 * 导出
 */
const handleExport = async () => {
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
		});
	} catch (error) {
		useMessage().error(t(error as string));
	} finally {
		// 隐藏加载状态
		state.loading = false;
	}
};
</script>
