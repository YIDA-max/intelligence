<template>
	<el-dialog
		v-bind="$attrs"
		width="40%"
		:close-on-click-modal="false"
		draggable
	>
		<div>
			<el-form
				:inline="true"
				:model="state.queryForm"
				@keyup.enter="getDataList"
				ref="queryRef"
			>
				<el-form-item prop="dsName">
					<el-select
						v-model="state.queryForm.status"
						clearable
						placeholder="辅料类型"
						style="width: 120px"
					>
						<el-option
							v-for="item in statusOptions"
							:key="item.value"
							:label="item.label"
							:value="item.value"
						/>
					</el-select>
				</el-form-item>
				<el-form-item prop="dsName">
					<el-input
						v-model="state.queryForm.code"
						placeholder="搜索辅料编码/名称"
						:prefix-icon="Search"
					/>
				</el-form-item>
			</el-form>
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
					:label="$t('辅料类型')"
					prop="name"
					show-overflow-tooltip
				/>
			</el-table>
			<pagination
				@current-change="currentChangeHandle"
				@size-change="sizeChangeHandle"
				v-bind="state.pagination"
			/>
		</div>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="closeDialog">{{
					$t('common.cancelButtonText')
				}}</el-button>
				<el-button type="primary" @click="onSubmit" :disabled="loading">{{
					$t('添加')
				}}</el-button>
			</span>
		</template>
	</el-dialog>
</template>

<script setup lang="ts">
import { BasicTableProps, useTable } from '/@/hooks/table';
import { Search } from '@element-plus/icons-vue';

const emits = defineEmits(['closeDialog']);

const loading = ref(false);

// TODO:接口未调试
const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {},
	// pageList: fetchList,
	descs: ['create_time'],
});

//  table hook
const { getDataList, currentChangeHandle, sizeChangeHandle, tableStyle } =
	useTable(state);

// 关闭弹窗
const closeDialog = () => {
	//   model.value = false;
	emits('closeDialog');
};

// 提交
const onSubmit = () => {};

// 多选变量
const selectObjs = ref([]) as any;
const multiple = ref(true);

// 多选事件
const handleSelectionChange = (objs: { id: string }[]) => {
	selectObjs.value = objs.map(({ id }) => id);
	multiple.value = !objs.length;
};

const statusOptions = ref([
	{
		label: 1,
		value: 1,
	},
]);
</script>

<style lang="less" scoped></style>
