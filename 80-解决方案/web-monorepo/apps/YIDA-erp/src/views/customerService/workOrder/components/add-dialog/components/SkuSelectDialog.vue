<script setup lang="ts">
import { BasicTableProps, useTable } from '/@/hooks/table';
import { Search } from '@element-plus/icons-vue';
import { ref, reactive, watch, nextTick } from 'vue';
import { getSkuList } from '/@/api/product/sku';
const emits = defineEmits(['closeDialog', 'setRows']);
const loading = ref(false);

// TODO:接口未调试
const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {},
	pageList: getSkuList,
	createdIsNeed: false,
	isAutoClearSelection: false,
	pagination: {
		current: 1,
		size: 20,
		total: 0,
	},
});

const tableRef = ref<any>(null);
const dialogMode = ref<'static' | 'api'>('api');
const staticData = ref<any[]>([]);

const dialogVisible = ref(false);

const selectedSkuCodes = ref<string[]>([]);

const show = (options: {
	type: 'static' | 'api';
	data?: any[];
	skuCodes?: string[];
}) => {
	dialogVisible.value = true;
	dialogMode.value = options.type;
	if (options.type === 'static') {
		staticData.value = options.data || [];
	}
	// 接收并设置 skuCodes 搜索条件
	state.queryForm.skuCodes = options.skuCodes;
	selectedSkuCodes.value = options.skuCodes || [];
};
const hide = () => {
	dialogVisible.value = false;
};

//  table hook
const {
	getDataList,
	currentChangeHandle,
	sizeChangeHandle,
	tableStyle,
	clearPagination,
} = useTable(state, tableRef);

watch(
	() => state.dataList,
	async (newVal) => {
		if (newVal && newVal.length > 0) {
			await nextTick();
			if (selectedSkuCodes.value.length > 0 && tableRef.value) {
				newVal.forEach((row: any) => {
					if (selectedSkuCodes.value.includes(row.skuCode)) {
						tableRef.value.toggleRowSelection(row, true);
					}
				});
			}
		}
	},
	{ immediate: true }
);

const handleOpen = async () => {
	// 重置查询
	state.queryForm.keyword = undefined;
	// 设置表格数据为空
	// 重置分页
	clearPagination();
	if (tableRef.value) {
		tableRef.value.clearSelection();
	}

	if (dialogMode.value === 'static') {
		state.dataList = staticData.value;
		state.pagination!.total = staticData.value.length;
	} else {
		getDataList();
	}
};
const handleSearch = () => {
	if (dialogMode.value === 'static') {
		const keyword = state.queryForm.keyword;
		if (keyword) {
			const lowerKeyword = keyword.toLowerCase();
			state.dataList = staticData.value.filter(
				(item) =>
					(item.skuCode && item.skuCode.toLowerCase().includes(lowerKeyword)) ||
					(item.skuName && item.skuName.toLowerCase().includes(lowerKeyword))
			);
		} else {
			state.dataList = staticData.value;
		}
		state.pagination!.total = state.dataList.length;
	} else {
		state.queryForm.skuCodes = undefined;
		getDataList();
	}
};
// 重置
const resetQuery = async () => {
	// 清空查询条件
	state.queryForm.keyword = undefined;
	state.queryForm.skuCodes = undefined;
	if (dialogMode.value === 'static') {
		state.dataList = staticData.value;
		state.pagination!.total = staticData.value.length;
	} else {
		// 重新获取数据
		getDataList();
	}
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
				@keyup.enter="handleSearch"
				ref="queryRef"
			>
				<el-form-item prop="keyword">
					<el-input
						v-model="state.queryForm.keyword"
						placeholder="搜索SKU/产品名称"
						:prefix-icon="Search"
						@blur="handleSearch"
					/>
				</el-form-item>
				<el-form-item>
					<div class="flex item-center">
						<el-button @click="handleSearch" type="primary"
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
