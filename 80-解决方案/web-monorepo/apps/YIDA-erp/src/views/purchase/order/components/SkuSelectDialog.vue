<template>
	<el-dialog
		v-model="visible"
		title="选择SKU"
		width="1000px"
		:close-on-click-modal="false"
		:close-on-press-escape="false"
		@close="handleClose"
	>
		<div class="mb-4">
			<el-input
				v-model="state.queryForm.keyword"
				placeholder="请输入SKU或产品名称搜索"
				@keyup.enter="getDataList"
				:prefix-icon="Search"
				clearable
				@input="handleSearch"
			/>
		</div>
		<el-table
			:data="state.dataList"
			ref="tableRef"
			@selection-change="handleSelectionChange"
			:cell-style="tableStyle.cellStyle"
			:header-cell-style="tableStyle.headerCellStyle"
			style="width: 100%"
			v-loading="loading"
			border
		>
			<el-table-column type="selection" width="50" align="center" />
			<el-table-column label="图片" width="80" align="center">
				<template #default="{ row }">
					<MrImg :src="row.imgUrl" />
				</template>
			</el-table-column>
			<el-table-column label="SKU/名称" min-width="200" show-overflow-tooltip>
				<template #default="{ row }">
					<div class="flex flex-col">
						<span class="font-medium">{{ row.skuCode }}</span>
						<span class="text-sm text-gray-500">{{ row.skuName }}</span>
					</div>
				</template>
			</el-table-column>
			<el-table-column label="采购数量" width="100" align="center">
				<template #default="{ row }">
					{{ row.purchaseNum }}
				</template>
			</el-table-column>
			<el-table-column label="可退货数量" width="100" align="center">
				<template #default="{ row }">
					{{ row.returnableQuantity }}
				</template>
			</el-table-column>
			<el-table-column label="需求单号" width="150" show-overflow-tooltip>
				<template #default="{ row }">
					{{ row.demandNo }}
				</template>
			</el-table-column>
		</el-table>
		<pagination
			@current-change="currentChangeHandle"
			@size-change="sizeChangeHandle"
			v-bind="state.pagination"
		/>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="handleClose">取消</el-button>
				<el-button type="primary" @click="handleConfirm"> 确定 </el-button>
			</span>
		</template>
	</el-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useMessage } from '/@/hooks/message';
import { Search } from '@element-plus/icons-vue';
import { chooseSkuByReturn } from '/@/api/purchase/return/index';

import { BasicTableProps, useTable } from '/@/hooks/table';

// 定义组件属性
const props = defineProps<{
	selectedOrder: any | null;
}>();

// 定义组件事件
const emit = defineEmits<{
	confirm: [sku: any[]];
	close: [];
}>();

// 响应式数据
const visible = ref(false);
const loading = ref(false);
const showPreview = ref(false);
const selectedSkus = ref<any[]>([]);

const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {
		purchaseNo: props.selectedOrder.purchaseNo,
	},
	pageList: chooseSkuByReturn,
	createdIsNeed: false,
});

const tableRef = ref<any>(null);

//  table hook
const { getDataList, currentChangeHandle, sizeChangeHandle, tableStyle } =
	useTable(state, tableRef);

// 处理搜索
const handleSearch = () => {
	getDataList();
};

// 处理选择变化
const handleSelectionChange = (selection: any[]) => {
	selectedSkus.value = selection;
};

// 确认选择
const handleConfirm = () => {
	if (selectedSkus.value.length === 0) {
		useMessage().error('请选择SKU');
		return;
	}
	emit('confirm', selectedSkus.value);
	tableRef.value.clearSelection();
	hide();
};

// 关闭弹窗
const handleClose = () => {
	state.dataList = [];
	emit('close');
	hide();
};

// 显示弹窗
const show = () => {
	visible.value = true;
	state.queryForm.keyword = '';
	state.queryForm.purchaseNo = props.selectedOrder.purchaseNo;
	getDataList();
};

// 隐藏弹窗
const hide = () => {
	visible.value = false;
	selectedSkus.value = [];
	state.queryForm.keyword = '';
	showPreview.value = false;
};

// 暴露方法
defineExpose({
	show,
	hide,
});
</script>

<style lang="scss" scoped>
.dialog-footer {
	display: flex;
	justify-content: flex-end;
	gap: 12px;
}

:deep(.el-table .el-table__row) {
	&:hover {
		background-color: #f5f7fa;
	}
}
</style>
