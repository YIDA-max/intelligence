<template>
	<el-popover
		placement="bottom"
		:width="600"
		trigger="click"
		:hide-on-click="false"
		v-model:visible="visible"
	>
		<template #reference>
			<el-button type="primary" size="small"> 复制现有 </el-button>
		</template>
		<el-table
			ref="tableRef"
			:data="state.dataList"
			v-loading="state.loading"
			border
			row-key="id"
			height="400"
			:cell-style="tableStyle.cellStyle"
			:header-cell-style="tableStyle.headerCellStyle"
			native-scrollbar
		>
			<el-table-column
				prop="productTypeText"
				:label="$t('国家/地区')"
				show-overflow-tooltip
			>
				<template #default="{ row }">
					<span>{{ row.logisticsChannelCode ?? '-' }}</span>
				</template>
			</el-table-column>
			<el-table-column
				prop="logisticsChannelCode"
				:label="$t('物流渠道')"
				show-overflow-tooltip
			>
				<template #default="{ row }">
					<span>{{ row.logisticsChannelCode ?? '-' }}</span>
				</template>
			</el-table-column>
			<el-table-column
				prop="mappingCount"
				:label="$t('映射关系')"
				show-overflow-tooltip
			>
				<template #default="{ row }">
					<span>{{ row.mappingCount ?? '-' }}个</span>
				</template>
			</el-table-column>
			<el-table-column :label="$t('common.action')" width="150" fixed="right">
				<template #default="{ row }">
					<el-button
						text
						type="primary"
						class="mr5"
						@click="getCopyData(row)"
						>{{ $t('复制') }}</el-button
					>
				</template>
			</el-table-column>
		</el-table>
	</el-popover>
</template>

<script setup lang="ts">
import { BasicTableProps, useTable } from '/@/hooks/table';
import { ref, reactive } from 'vue';
import {
	getPlatformWareLogisticsList,
	getPlatformWareLogisticsDetail,
} from '/@/api/fbm/logisticsChannel/platformWarehouseDelivery/index';

const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {
		type: 1,
	},
	pageList: getPlatformWareLogisticsList,
	createdIsNeed: false,
	pagination: {
		current: 1,
		size: 10000,
	},
});

const tableRef = ref<any>(null);

const { getDataList, tableStyle } = useTable(state, tableRef);

// 弹窗显示状态
const visible = ref(false);

const handleOpen = () => {
	// 获取数据
	visible.value = true;
	getDataList();
};

// Emits
const emit = defineEmits(['confirm', 'cancel']);

const getCopyData = async (row: any) => {
	let selectArr = [];
	const res = await getPlatformWareLogisticsDetail({ id: row.id });
	if (res.code === 0) {
		selectArr = res.data.mappings;
	}
	emit('confirm', selectArr);
};
// 取消
const handleCancel = () => {
	visible.value = false;
	emit('cancel');
};

defineExpose({
	handleOpen,
	handleCancel,
	getCopyData,
});
</script>
