<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<!-- 搜索表单 -->
			<el-row class="ml10">
				<el-form
					:inline="true"
					:model="state.queryForm"
					@keyup.enter="getDataList"
				>
					<el-form-item label="用户名">
						<el-input
							v-model="state.queryForm.username"
							placeholder="请输入用户名"
							clearable
						/>
					</el-form-item>
					<el-form-item label="状态">
						<el-select
							v-model="state.queryForm.status"
							placeholder="请选择状态"
							clearable
						>
							<el-option label="启用" :value="1" />
							<el-option label="禁用" :value="0" />
						</el-select>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" @click="getDataList">查询</el-button>
						<el-button @click="resetQuery">重置</el-button>
					</el-form-item>
				</el-form>
			</el-row>

			<!-- 工具栏 -->
			<el-row>
				<el-button type="primary" @click="handleAdd">新增</el-button>
				<el-button type="danger" @click="handleBatchDelete">批量删除</el-button>
				<el-button @click="getDataList">刷新</el-button>
			</el-row>

			<!-- 表格 -->
			<mr-table-vxe
				ref="tableRef"
				:data="state.dataList"
				v-loading="state.loading"
				@sort-change="sortChangeHandle"
				@checkbox-change="handleCheckboxChange"
				@checkbox-all="handleCheckboxAll"
			>
				<!-- 复选框列 -->
				<mr-table-column-vxe type="checkbox" width="60" />

				<!-- 序号列 -->
				<mr-table-column-vxe type="seq" title="序号" width="80" />

				<!-- 普通列 -->
				<mr-table-column-vxe
					field="username"
					title="用户名"
					width="150"
					sortable
				/>

				<mr-table-column-vxe field="nickname" title="昵称" width="150" />

				<mr-table-column-vxe field="email" title="邮箱" width="200" />

				<mr-table-column-vxe field="phone" title="手机号" width="150" />

				<!-- 状态列 - 使用插槽自定义 -->
				<mr-table-column-vxe field="status" title="状态" width="100">
					<template #default="{ row }">
						<el-tag :type="row.status === 1 ? 'success' : 'danger'">
							{{ row.status === 1 ? '启用' : '禁用' }}
						</el-tag>
					</template>
				</mr-table-column-vxe>

				<!-- 创建时间列 - 支持排序 -->
				<mr-table-column-vxe
					field="createTime"
					title="创建时间"
					width="180"
					sortable
				/>

				<!-- 操作列 - 使用插槽 -->
				<mr-table-column-vxe title="操作" width="200" fixed="right">
					<template #default="{ row }">
						<el-button link type="primary" @click="handleEdit(row)"
							>编辑</el-button
						>
						<el-button link type="danger" @click="handleDelete(row)"
							>删除</el-button
						>
					</template>
				</mr-table-column-vxe>
			</mr-table-vxe>

			<!-- 分页 -->
			<el-pagination
				@current-change="currentChangeHandle"
				@size-change="sizeChangeHandle"
				:current-page="state.pagination.current"
				:page-size="state.pagination.size"
				:page-sizes="state.pagination.pageSizes"
				:total="state.pagination.total"
				:layout="state.pagination.layout"
				background
			/>
		</div>
	</div>
</template>

<script setup lang="ts">
/* eslint-disable no-console */
import { reactive, ref } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { BasicTableProps, useTableVxe } from '/@/hooks/tableVxe';

// 模拟API
const mockApi = (params: any) => {
	return new Promise((resolve) => {
		setTimeout(() => {
			const mockData = Array.from({ length: params.size }, (_, i) => ({
				id: (params.current - 1) * params.size + i + 1,
				username: `user${(params.current - 1) * params.size + i + 1}`,
				nickname: `昵称${(params.current - 1) * params.size + i + 1}`,
				email: `user${(params.current - 1) * params.size + i + 1}@example.com`,
				phone: `138${String(
					(params.current - 1) * params.size + i + 1
				).padStart(8, '0')}`,
				status: Math.random() > 0.5 ? 1 : 0,
				createTime: new Date().toISOString(),
			}));

			resolve({
				code: 0,
				data: {
					records: mockData,
					total: 100,
				},
			});
		}, 500);
	});
};

// 表格引用
const tableRef = ref();

// 表格状态
const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {
		username: '',
		status: undefined,
	},
	pageList: mockApi,
	loading: false,
	dataList: [],
	ascs: [],
	descs: [],
});

// 使用 tableVxe hook
const {
	getDataList,
	currentChangeHandle,
	sizeChangeHandle,
	sortChangeHandle,
	getSelectionRows,
} = useTableVxe(state, tableRef);

// 重置查询
const resetQuery = () => {
	state.queryForm = {
		username: '',
		status: undefined,
	};
	state.ascs = [];
	state.descs = [];
	getDataList();
};

// 复选框变化事件
const handleCheckboxChange = ({ records }: any) => {
	console.log('选中的行:', records);
};

// 全选事件
const handleCheckboxAll = ({ records }: any) => {
	console.log('全选的行:', records);
};

// 新增
const handleAdd = () => {
	ElMessage.success('点击了新增按钮');
};

// 编辑
const handleEdit = (row: any) => {
	ElMessage.success(`编辑用户: ${row.username}`);
};

// 删除
const handleDelete = (row: any) => {
	ElMessageBox.confirm(`确定删除用户 ${row.username} 吗？`, '提示', {
		confirmButtonText: '确定',
		cancelButtonText: '取消',
		type: 'warning',
	}).then(() => {
		ElMessage.success('删除成功');
		getDataList();
	});
};

// 批量删除
const handleBatchDelete = () => {
	const selectedRows = getSelectionRows();
	if (selectedRows.length === 0) {
		ElMessage.warning('请先选择要删除的数据');
		return;
	}
	ElMessageBox.confirm(
		`确定删除选中的 ${selectedRows.length} 条数据吗？`,
		'提示',
		{
			confirmButtonText: '确定',
			cancelButtonText: '取消',
			type: 'warning',
		}
	).then(() => {
		ElMessage.success('批量删除成功');
		getDataList();
	});
};
</script>

<style scoped lang="scss">
.layout-padding {
	padding: 15px;
}

.layout-padding-auto {
	padding: 15px;
	background: #fff;
	border-radius: 4px;
}

.ml10 {
	margin-left: 10px;
}

.el-row {
	margin-bottom: 15px;
}
</style>
