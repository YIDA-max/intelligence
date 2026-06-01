<template>
	<div>
		<div class="mb20">
			<el-button class="ml10" type="primary" @click="openExcipientDialog">
				{{ $t('选择辅料') }}
			</el-button>
			<el-button class="ml10">
				{{ $t('批量删除') }}
			</el-button>
		</div>
		<el-table
			:data="state.dataList"
			@selection-change="handleSelectionChange"
			style="width: 100%"
			v-loading="state.loading"
			border
			:cell-style="tableStyle.cellStyle"
			:header-cell-style="tableStyle.headerCellStyle"
			native-scrollbar
		>
			<el-table-column align="center" type="selection" width="40" />
			<el-table-column :label="$t('图片')" type="index" width="60" />
			<el-table-column
				:label="$t('辅料编码/名称')"
				prop="name"
				show-overflow-tooltip
			/>
			<el-table-column
				:label="$t('数量')"
				prop="dsName"
				show-overflow-tooltip
			/>
			<el-table-column
				:label="$t('备注')"
				prop="dsType"
				show-overflow-tooltip
			/>
			<el-table-column :label="$t('common.action')" width="250" fixed="right">
				<template #default="">
					<el-button text>{{ $t('datasourceconf.docBtn') }} </el-button>

					<!-- <el-button icon="edit" @click="formDialogRef.openDialog(scope.row.id)" text type="primary">{{ $t('common.editBtn') }} </el-button>

          <el-button icon="delete" @click="handleDelete([scope.row.id])" text type="primary">{{ $t('common.delBtn') }} </el-button> -->
				</template>
			</el-table-column>
		</el-table>
		<pagination
			@current-change="currentChangeHandle"
			@size-change="sizeChangeHandle"
			v-bind="state.pagination"
		/>

		<ExcipientDialog
			v-model="addExcipientVisible"
			@closeDialog="closeExcipientDialog"
		></ExcipientDialog>
	</div>
</template>

<script setup lang="ts">
import { BasicTableProps, useTable } from '/@/hooks/table';

const ExcipientDialog = defineAsyncComponent(
	() => import('./excipient-dialog.vue')
);

// TODO: 接口未定义
const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {},
	// pageList: fetchList,
	descs: ['create_time'],
});

//  table hook
const { currentChangeHandle, sizeChangeHandle, tableStyle } = useTable(state);

// 多选变量
const selectObjs = ref([]) as any;
const multiple = ref(true);

// 多选事件
const handleSelectionChange = (objs: { id: string }[]) => {
	selectObjs.value = objs.map(({ id }) => id);
	multiple.value = !objs.length;
};

// 辅料弹窗
const addExcipientVisible = ref(false);

const openExcipientDialog = () => {
	addExcipientVisible.value = true;
};

const closeExcipientDialog = () => {
	addExcipientVisible.value = false;
};
</script>

<style lang="scss" scoped></style>
