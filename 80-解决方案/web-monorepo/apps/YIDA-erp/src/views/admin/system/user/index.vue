<template>
	<div class="layout-padding">
		<splitpanes>
			<pane size="15">
				<div class="layout-padding-auto layout-padding-view">
					<el-scrollbar>
						<query-tree
							:placeholder="$t('common.queryDeptTip')"
							:query="deptData.queryList"
							:show-expand="true"
							@node-click="handleNodeClick"
							ref="queryTreeRef"
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
			</pane>
			<pane class="ml8">
				<div class="layout-padding-auto layout-padding-view">
					<el-row v-show="showSearch">
						<el-form
							ref="queryRef"
							:inline="true"
							:model="state.queryForm"
							@keyup.enter="getDataList"
						>
							<el-form-item :label="$t('sysuser.username')" prop="username">
								<el-input
									v-model="state.queryForm.username"
									style="width: 120px"
									:placeholder="$t('sysuser.inputUsernameTip')"
									clearable
								/>
							</el-form-item>
							<el-form-item :label="$t('姓名')" prop="name">
								<el-input
									v-model="state.queryForm.name"
									style="width: 120px"
									:placeholder="$t('请输入姓名')"
									clearable
								/>
							</el-form-item>
							<el-form-item :label="$t('岗位')" prop="post">
								<el-select
									v-model="state.queryForm.post"
									:placeholder="$t('请选择岗位')"
									clearable
									multiple
									collapse-tags
									:max-collapse-tags="1"
									filterable
									style="width: 120px"
								>
									<el-option
										v-for="item in dictMap.postList"
										:key="item.postId"
										:value="item.postId"
										:label="item.postName"
									></el-option>
								</el-select>
							</el-form-item>
							<el-form-item :label="$t('角色')" prop="role">
								<el-select
									v-model="state.queryForm.role"
									:placeholder="$t('请选择角色')"
									clearable
									multiple
									collapse-tags
									:max-collapse-tags="1"
									filterable
									style="width: 120px"
								>
									<el-option
										v-for="item in dictMap.roleList"
										:key="item.roleId"
										:value="item.roleId"
										:label="item.roleName"
									></el-option>
								</el-select>
							</el-form-item>
							<el-form-item :label="$t('状态')" prop="lockFlag">
								<el-select
									v-model="state.queryForm.lockFlag"
									:placeholder="$t('请选择状态')"
									clearable
									style="width: 120px"
								>
									<el-option value="0" :label="$t('开启')"></el-option>
									<el-option value="9" :label="$t('禁用')"></el-option>
								</el-select>
							</el-form-item>
							<el-form-item :label="$t('sysuser.phone')" prop="phone">
								<el-input
									v-model="state.queryForm.phone"
									style="width: 120px"
									:placeholder="$t('sysuser.inputPhoneTip')"
									clearable
								/>
							</el-form-item>

							<el-form-item>
								<el-button icon="Search" type="primary" @click="getDataList">{{
									$t('common.queryBtn')
								}}</el-button>
								<el-button icon="Refresh" @click="resetQuery">{{
									$t('common.resetBtn')
								}}</el-button>
							</el-form-item>
						</el-form>
					</el-row>
					<el-row>
						<div class="mb8" style="width: 100%">
							<el-button
								v-auth="'sys_user_add'"
								icon="folder-add"
								type="primary"
								@click="userDialogRef.openDialog()"
							>
								{{ $t('common.addBtn') }}
							</el-button>
							<el-button
								plain
								v-auth="'sys_user_add'"
								class="ml10"
								icon="upload-filled"
								type="primary"
								@click="excelUploadRef.show()"
							>
								{{ $t('common.importBtn') }}
							</el-button>

							<el-button
								plain
								v-auth="'sys_user_del'"
								:disabled="multiple"
								class="ml10"
								icon="Delete"
								type="primary"
								@click="handleDelete(selectObjs)"
							>
								{{ $t('common.delBtn') }}
							</el-button>

							<right-toolbar
								v-model:showSearch="showSearch"
								:export="'sys_user_export'"
								@exportExcel="exportExcel"
								@queryTable="getDataList"
								class="ml10 mr20"
								style="float: right"
							/>
						</div>
					</el-row>
					<el-table
						v-loading="state.loading"
						:data="state.dataList"
						@selection-change="handleSelectionChange"
						row-key="userId"
						ref="tableRef"
						border
						:cell-style="tableStyle.cellStyle"
						:header-cell-style="tableStyle.headerCellStyle"
						native-scrollbar
					>
						<el-table-column
							:selectable="handleSelectable"
							type="selection"
							width="40"
						/>
						<el-table-column
							:label="$t('sysuser.index')"
							type="index"
							width="60"
							fixed="left"
						/>
						<el-table-column
							:label="$t('sysuser.username')"
							prop="username"
							fixed="left"
							show-overflow-tooltip
						></el-table-column>
						<el-table-column
							:label="$t('sysuser.name')"
							prop="name"
							show-overflow-tooltip
						></el-table-column>
						<el-table-column
							:label="$t('sysuser.phone')"
							prop="phone"
							show-overflow-tooltip
						></el-table-column>
						<el-table-column :label="$t('sysuser.post')" show-overflow-tooltip>
							<template #default="scope">
								<el-tag
									v-for="(item, index) in scope.row.postList"
									:key="index"
									class="mr-1"
								>
									{{ item.postName }}
								</el-tag>
							</template>
						</el-table-column>
						<el-table-column
							:label="$t('部门')"
							prop="deptName"
							show-overflow-tooltip
						></el-table-column>
						<el-table-column :label="$t('sysuser.role')" show-overflow-tooltip>
							<template #default="scope">
								<el-tag
									v-for="(item, index) in scope.row.roleList"
									:key="index"
									class="mr-1"
								>
									{{ item.roleName }}
								</el-tag>
							</template>
						</el-table-column>
						<el-table-column
							:label="$t('sysuser.lockFlag')"
							show-overflow-tooltip
						>
							<template #default="scope">
								<el-switch
									v-model="scope.row.lockFlag"
									@change="changeSwitch(scope.row)"
									active-value="0"
									inactive-value="9"
								></el-switch>
							</template>
						</el-table-column>
						<el-table-column
							:label="$t('common.action')"
							width="300"
							fixed="right"
						>
							<template #default="scope">
								<div style="display: flex">
									<!-- 重置密码 -->
									<popover-input
										v-model="inputPassword"
										@confirm="changePassword(scope.row)"
									>
										<template #default>
											<el-button
												v-auth="'sys_user_edit'"
												icon="RefreshLeft"
												text
												type="primary"
												class="mr-4"
											>
												{{ $t('sysuser.passwordBtn') }}
											</el-button>
										</template>
									</popover-input>

									<el-button
										text
										type="primary"
										icon="user"
										v-auth="'sys_role_replace_login'"
										@click="handleLogin(scope.row)"
										>代登录</el-button
									>

									<!-- 修改信息 -->
									<el-button
										v-auth="'sys_user_edit'"
										icon="edit-pen"
										text
										type="primary"
										@click="userDialogRef.openDialog(scope.row.userId)"
									>
										{{ $t('common.editBtn') }}
									</el-button>
									<!-- 删除用户 -->
									<el-tooltip
										:content="$t('sysuser.deleteDisabledTip')"
										:disabled="scope.row.userId !== '1'"
										placement="top"
									>
										<span style="margin-left: 12px">
											<el-button
												icon="delete"
												v-auth="'sys_user_del'"
												:disabled="scope.row.username === 'admin'"
												text
												type="primary"
												@click="handleDelete([scope.row.userId])"
												>{{ $t('common.delBtn') }}
											</el-button>
										</span>
									</el-tooltip>
								</div>
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

		<user-form
			ref="userDialogRef"
			@refresh="getDataList(false)"
			:deptId="state.queryForm.deptId"
		/>

		<ImportDialog
			ref="excelUploadRef"
			:title="$t('sysuser.importUserTip')"
			templateUrl="/files/import-template/导入用户模版.xlsx"
			excelUploadApi="/admin/user/import"
			@refreshDataList="getDataList"
		/>
	</div>
</template>

<script lang="ts" name="systemUser" setup>
import { delObj, pageList, putObj, pageExport } from '/@/api/admin/user';
import { deptTree } from '/@/api/admin/dept';
import { BasicTableProps, useTable } from '/@/hooks/table';
import { useMessage, useMessageBox } from '/@/hooks/message';
import { useI18n } from 'vue-i18n';
import { defineAsyncComponent } from 'vue';
import { getNodeAndDescendants } from '/@/utils/arrayTree';
import { useMultipleDicts } from '/@/hooks/multipleDicts';
import { list as roleList } from '/@/api/admin/role';
import { list as postList } from '/@/api/admin/post';
const tableRef = ref();
//   初始化数据
const { dictMap } = useMultipleDicts(
	[
		{
			key: 'roleList',
			fetchFn: roleList,
		}, // 角色字典
		{
			key: 'postList',
			fetchFn: postList,
		}, // 岗位字典
	],
	{
		isAuto: true,
		tableRef: tableRef,
	}
);

// 动态引入组件
const UserForm = defineAsyncComponent(() => import('./form.vue'));
const QueryTree = defineAsyncComponent(
	() => import('/@/components/QueryTree/index.vue')
);
const PopoverInput = defineAsyncComponent(
	() => import('/@/components/PopoverInput/index.vue')
);
const ImportDialog = defineAsyncComponent(
	() => import('/@/components/fileUpload/importDialog.vue')
);
import { ElMessageBox } from 'element-plus';
const { t } = useI18n();

// 定义变量内容
const userDialogRef = ref();
const excelUploadRef = ref();

const queryTreeRef = ref();
const queryRef = ref();
const showSearch = ref(true);
const inputPassword = ref();

// 多选rows
const selectObjs = ref([]) as any;
// 是否可以多选
const multiple = ref(true);

// 定义表格查询、后台调用的API
const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {
		deptId: '',
		username: '',
		phone: '',
	},
	pageList: pageList,
});
const {
	getDataList,
	currentChangeHandle,
	sizeChangeHandle,

	tableStyle,
} = useTable(state, tableRef);

// 部门树使用的数据
const deptData = reactive({
	queryList: (name: String) => {
		return deptTree({
			deptName: name,
		});
	},
});

// 清空搜索条件
const resetQuery = () => {
	queryRef.value?.resetFields();
	state.queryForm.deptId = '';
	getDataList();
};

// 点击树
const handleNodeClick = (e: any) => {
	const treeData = queryTreeRef.value.getTreeData();
	const nodeInfo = getNodeAndDescendants(treeData, e.id);
	if (nodeInfo) {
		const ids = nodeInfo.map((item) => item.id);
		state.queryForm.deptIds = ids;
	} else {
		state.queryForm.deptId = e.id;
	}
	// 查询
	getDataList();
};

// 导出excel
const exportExcel = async () => {
	try {
		// 发送请求，设置 responseType 为 'blob' 以接收二进制流
		await pageExport({
			...state.queryForm,
			ids: selectObjs.value || [],
			current: 1,
			size: 10000,
		});
	} catch (error) {
		useMessage().error(t(error as string));
	}
};

// 是否可以多选
const handleSelectable = (row: any) => {
	return row.username !== 'admin';
};

// 多选事件
const handleSelectionChange = (objs: { userId: string }[]) => {
	selectObjs.value = objs.map(({ userId }) => userId);
	multiple.value = !objs.length;
};

// 删除操作
const handleDelete = async (ids: string[]) => {
	try {
		await useMessageBox().confirm(t('common.delConfirmText'));
	} catch {
		return;
	}

	try {
		await delObj(ids);
		getDataList();
		useMessage().success(t('common.delSuccessText'));
	} catch (err: any) {
		useMessage().error(err.msg);
	}
};

//表格内开关 (用户状态)
const changeSwitch = async (row: any) => {
	// 不修改密码
	row.password = undefined;
	row.phone = undefined;
	await putObj(row);
	useMessage().success(t('common.optSuccessText'));
	getDataList();
};

//修改用户密码
const changePassword = async (row: any) => {
	if (
		!inputPassword.value ||
		inputPassword.value.length < 6 ||
		inputPassword.value.length > 20
	) {
		useMessage().error(t('sysuser.inputPasswordTip'));
		return;
	}

	row.phone = undefined;
	row.password = inputPassword.value;
	await putObj(row);
	useMessage().success(t('common.optSuccessText'));
	getDataList();
};

// 代登录
import { quickLogin } from './proxyLogin';
const handleLogin = (row: any) => {
	ElMessageBox.confirm('确认更换登录用户？当前登录用户将退出', '提示', {
		type: 'warning',
	}).then(async () => {
		try {
			await quickLogin(row.userId);
			location.reload();
		} catch (err: any) {
			useMessage().error(err.message || '操作失败');
		}
	});
};
</script>
