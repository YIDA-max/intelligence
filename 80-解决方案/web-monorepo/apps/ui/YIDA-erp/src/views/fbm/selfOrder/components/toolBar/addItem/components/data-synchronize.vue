<script setup lang="ts">
import { BasicTableProps, useTable } from '/@/hooks/table';
import { ref, reactive } from 'vue';
import { postSearchOrderBasicMessage } from '/@/api/fbm/selfOrder';
import { ElMessageBox } from 'element-plus';
// import { isArray } from 'lodash';
const emits = defineEmits(['setData']);
const loading = ref(false);
const SelectInput = defineAsyncComponent(
	() => import('/@/components/TableFormModule/select-input.vue')
);
// TODO:接口未调试
const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {
		platformOrderNos: [],
		selfOrderNos: [],
	},
	pageList: postSearchOrderBasicMessage,
	// beforeQueryParamsHandle: (params) => {
	// 	// 如果存在平台单号且不是数组，则转换为数组
	// 	if (params.platformOrderNos && !isArray(params.platformOrderNos)) {
	// 		params.platformOrderNos = [params.platformOrderNos];
	// 	}
	// 	// 如果不存在平台单号，则初始化为空数组
	// 	if (!params.platformOrderNos) {
	// 		params.platformOrderNos = [];
	// 	}
	// 	// 如果存在系统订单号且不是数组，则转换为数组
	// 	if (params.selfOrderNos && !isArray(params.selfOrderNos)) {
	// 		params.selfOrderNos = [params.selfOrderNos];
	// 	}
	// 	// 如果不存在系统订单号，则初始化为空数组
	// 	if (!params.selfOrderNos) {
	// 		params.selfOrderNos = [];
	// 	}
	// 	return params;
	// },
	createdIsNeed: false,
	isAutoClearSelection: false,
	isPage: false,
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
const { getDataList, tableStyle, setTableData } = useTable(state, tableRef);
const handleOpen = async () => {
	// 重置查询
	state.queryForm = {
		platformOrderNos: [],
		selfOrderNos: [],
	};
	// 获取数据
	setTableData([]);
};

// 提交
const onSubmit = async (row: any) => {
	loading.value = true;
	try {
		//二次确认
		const confirmed = await ElMessageBox.confirm('确认要同步数据吗?', '提示', {
			confirmButtonText: '确定',
			cancelButtonText: '取消',
			type: 'warning',
		});
		if (confirmed) {
			emits('setData', row);
			// 关闭弹窗
			hide();
		}
	} catch (error) {
		// eslint-disable-next-line no-console
		console.error('提交失败:', error);
	} finally {
		loading.value = false;
	}
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
defineExpose({
	show,
	hide,
});
</script>
<template>
	<el-dialog
		v-model="dialogVisible"
		width="60%"
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
				<el-form-item>
					<div class="flex item-center">
						<SelectInput
							v-model:queryForm="state.queryForm"
							:searchTypes="[
								{
									label: '平台单号',
									value: 'platformOrderNos',
								},
								{
									label: '系统订单号',
									value: 'selfOrderNos',
								},
							]"
							:settings="{ selectStyle: { width: '130px' } }"
							:getDataList="getDataList"
						/>
					</div>
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
				row-key="platformOrderNo"
				:cell-style="tableStyle.cellStyle"
				:header-cell-style="tableStyle.headerCellStyle"
				native-scrollbar
			>
				<el-table-column
					prop="platformOrderNo"
					:label="$t('平台单号/系统订单号')"
					show-overflow-tooltip
					min-width="250"
				>
					<template #default="{ row }">
						<div class="flex flex-col items-start justify-center w-full">
							<div
								style="
									max-width: 100%;
									overflow: hidden;
									white-space: nowrap;
									text-overflow: ellipsis;
								"
							>
								{{ row.platformOrderNo }}
							</div>
							<div
								style="
									max-width: 100%;
									overflow: hidden;
									white-space: nowrap;
									text-overflow: ellipsis;
								"
							>
								{{ row.orderNo }}
							</div>
						</div>
					</template>
				</el-table-column>
				<el-table-column
					prop="platformChannelCode"
					:label="$t('来源渠道')"
					show-overflow-tooltip
					min-width="150"
				>
				</el-table-column>
				<el-table-column
					prop="storeName"
					:label="$t('店铺')"
					show-overflow-tooltip
					min-width="150"
				>
				</el-table-column>
				<el-table-column
					prop="buyerName"
					:label="$t('买家姓名/邮箱')"
					min-width="350"
					show-overflow-tooltip
					><template #default="{ row }">
						<div class="flex flex-col items-start justify-center w-full">
							<div
								style="
									max-width: 100%;
									overflow: hidden;
									white-space: nowrap;
									text-overflow: ellipsis;
								"
							>
								{{ row.buyerName }}
							</div>
							<div
								style="
									max-width: 100%;
									overflow: hidden;
									white-space: nowrap;
									text-overflow: ellipsis;
								"
							>
								{{ row.buyerEmail }}
							</div>
						</div>
					</template>
				</el-table-column>
				<el-table-column
					min-width="100"
					:label="$t('操作')"
					show-overflow-tooltip
				>
					<template #default="{ row }">
						<el-link type="primary" @click="onSubmit(row)" underline="never">{{
							$t('同步数据')
						}}</el-link>
					</template>
				</el-table-column>
			</el-table>
		</div>
	</el-dialog>
</template>

<style lang="less" scoped></style>
