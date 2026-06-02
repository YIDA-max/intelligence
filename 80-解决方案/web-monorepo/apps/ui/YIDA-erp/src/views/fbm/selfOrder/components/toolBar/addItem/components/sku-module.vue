<script setup lang="ts">
import { BasicTableProps, useTable } from '/@/hooks/table';
import { Search } from '@element-plus/icons-vue';
import { ref, reactive } from 'vue';
import { getSkuList } from '/@/api/product/sku';
const emits = defineEmits(['closeDialog', 'setRows']);
const loading = ref(false);

// TODO:接口未调试
const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {},
	pageList: getSkuList,
	createdIsNeed: false,
	isAutoClearSelection: false,
});

const tableRef = ref<any>(null);

const dialogVisible = ref(false);

const show = () => {
	dialogVisible.value = true;
};
const hide = () => {
	dialogVisible.value = false;
};

//  table hook
const {
	getDataList,
	currentChangeHandle,
	sizeChangeHandle,
	setTableData,
	tableStyle,
	clearPagination,
} = useTable(state, tableRef);

const handleOpen = () => {
	// 重置查询
	state.queryForm = {};
	// 设置表格数据为空
	setTableData([]);
	// 重置分页
	clearPagination();
	// getDataList();
};
// 重置
const resetQuery = async () => {
	// 清空查询条件
	Object.keys(state.queryForm).forEach((key) => {
		if (Array.isArray(state.queryForm[key])) {
			state.queryForm[key] = [];
		} else {
			state.queryForm[key] = undefined;
		}
	});

	// 重新获取数据
	getDataList();
};
// 提交
const onSubmit = async () => {
	loading.value = true;
	try {
		const selectedRows = tableRef.value.getSelectionRows();
		if (selectedRows.length === 0) {
			// eslint-disable-next-line no-console
			console.warn('请至少选择一条数据');
			return;
		}
		// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
		const dataList = selectedRows.map(({ id, ...row }: any) => ({
			...row,
		}));
		emits('setRows', dataList);
		// 清空选中
		tableRef.value.clearSelection();
		// 关闭弹窗
		hide();
	} catch (error) {
		// eslint-disable-next-line no-console
		console.error('提交失败:', error);
	} finally {
		loading.value = false;
	}
};
defineExpose({
	show,
	hide,
});
</script>
<template>
	<el-dialog
		v-model="dialogVisible"
		width="40%"
		:close-on-click-modal="false"
		draggable
		@open="handleOpen"
		:append-to-body="true"
	>
		<div>
			<el-form
				:inline="true"
				@submit.prevent
				:model="state.queryForm"
				@keyup.enter="getDataList"
				ref="queryRef"
			>
				<el-form-item prop="keyword">
					<el-input
						v-model="state.queryForm.keyword"
						placeholder="搜索SKU/产品名称"
						:prefix-icon="Search"
						@blur="getDataList"
					/>
				</el-form-item>
				<el-form-item>
					<div class="flex item-center">
						<el-button @click="getDataList" type="primary"
							>{{ $t('搜索') }}
						</el-button>
						<el-button @click="resetQuery" type="info" plain
							>{{ $t('common.resetBtn') }}
						</el-button>
					</div>
				</el-form-item>
			</el-form>
			<el-table
				:data="state.dataList"
				height="400"
				v-loading="state.loading"
				border
				ref="tableRef"
				row-key="skuCode"
				:cell-style="tableStyle.cellStyle"
				:header-cell-style="tableStyle.headerCellStyle"
				native-scrollbar
			>
				<el-table-column
					align="center"
					type="selection"
					width="40"
					:reserve-selection="true"
				/>
				<el-table-column :label="$t('图片')" width="100">
					<template #default="{ row }">
						<MrImg :src="row.imgUrl" />
					</template>
				</el-table-column>
				<el-table-column
					prop="skuCode"
					:label="$t('SKU/产品名称')"
					show-overflow-tooltip
					width="200"
				>
					<template #default="{ row }">
						<div
							style="
								display: flex;
								flex-direction: column;
								justify-content: center;
								align-items: flex-start;
								width: 100%;
							"
						>
							<div
								style="
									max-width: 100%;
									overflow: hidden;
									white-space: nowrap;
									text-overflow: ellipsis;
								"
							>
								{{ row.skuCode }}
							</div>
							<div
								style="
									max-width: 100%;
									overflow: hidden;
									white-space: nowrap;
									text-overflow: ellipsis;
								"
							>
								{{ row.skuName }}
							</div>
						</div>
					</template>
				</el-table-column>
				<el-table-column
					prop="categoryName"
					:label="$t('类目')"
					show-overflow-tooltip
				>
					<template #default="{ row }">
						<div
							:style="{
								display: 'flex',
								flexDirection: 'column',
								justifyContent: 'center',
								alignItems: 'flex-start',
								width: '100%',
							}"
						>
							<div>{{ row.categoryCode }}</div>
							<div>{{ row.categoryName }}</div>
						</div>
					</template>
				</el-table-column>
				<el-table-column
					prop="brandName"
					:label="$t('品牌')"
					show-overflow-tooltip
				>
					<template #default="{ row }">
						<div
							:style="{
								display: 'flex',
								flexDirection: 'column',
								justifyContent: 'center',
								alignItems: 'flex-start',
								width: '100%',
							}"
						>
							<div>{{ row.brandCode }}</div>
							<div>{{ row.brandName }}</div>
						</div>
					</template>
				</el-table-column>
			</el-table>
			<pagination
				@current-change="currentChangeHandle"
				@size-change="sizeChangeHandle"
				v-bind="state.pagination"
			/>
		</div>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="hide">{{ $t('common.cancelButtonText') }}</el-button>
				<el-button type="primary" @click="onSubmit" :disabled="loading">{{
					$t('添加')
				}}</el-button>
			</span>
		</template>
	</el-dialog>
</template>

<style lang="less" scoped></style>
