<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-row class="ml10" v-show="showSearch">
				<el-form
					:inline="true"
					:model="state.queryForm"
					@keyup.enter="getDataList"
					ref="queryRef"
				>
					<el-form-item>
						<div
							class="flex items-center"
							:style="{
								width: '220px',
							}"
						>
							<TreeSelectInputApi
								v-model:queryForm="state.queryForm"
								:style="{ width: '220px' }"
								:settings="{
									getTreeData: getWarehouseInfoList,
									text: '仓库名称',
									width: '220px',
									searchFn: getDataList,
									code: 'warehouseCodes',
									prefixKey: 'spName',
									separator: '-',
									selectTreeProps: {
										value: 'warehouseCode',
										label: 'warehouseName',
										children: 'children',
									},
									getIdsCode: 'warehouseCode',
								}"
							/>
						</div>
					</el-form-item>
					<el-form-item>
						<div class="flex items-center">
							<el-date-picker
								v-model="state.queryForm.snapshotDate"
								type="date"
								:style="{ width: '220px' }"
								:placeholder="`请选择快照日期`"
								value-format="YYYY-MM-DD"
								@change="
									() => {
										getDataList();
									}
								"
							></el-date-picker>
						</div>
					</el-form-item>
					<el-form-item>
						<div class="flex item-center">
							<SelectInput
								v-model:queryForm="state.queryForm"
								:searchTypes="[
									{
										label: '系统sku',
										value: 'productSkuCodes',
									},
									{
										label: '系统产品名称',
										value: 'productSkuNames',
									},
									{
										label: '三方仓SKU',
										value: 'spSkuCodes',
									},
									{
										label: '三方仓产品名称',
										value: 'spSkuNames',
									},
								]"
								@getDataList="getDataList"
							/>
						</div>
					</el-form-item>
					<el-form-item>
						<el-button @click="getDataList" type="primary"
							>{{ $t('搜索') }}
						</el-button>
						<el-button @click="resetQuery" type="info" plain
							>{{ $t('common.resetBtn') }}
						</el-button>
					</el-form-item>
				</el-form>
			</el-row>
			<el-row>
				<ToolBar
					@handleRefresh="resetQuery"
					@handleExport="exportPartFn"
					:is-show-export="auth('spInventory_export')"
				>
					<template #left-tool>
						<el-button
							class="ml10"
							type="primary"
							@click="openDialog('synchronize')"
							v-auth="'spInventory_synchronize'"
						>
							{{ $t('同步SKU和库存') }}</el-button
						>
					</template>
					<template #right-tool>
						<el-checkbox
							v-model="state.queryForm.hideZero"
							@change="
								() => {
									getDataList();
								}
							"
							>{{ $t('隐藏零库存量') }}</el-checkbox
						>
					</template>
				</ToolBar>
			</el-row>
			<el-table
				:data="state.dataList"
				@sort-change="sortChangeHandle"
				style="width: 100%"
				v-loading="state.loading"
				border
				row-key="id"
				ref="tableRef"
				:cell-style="tableStyle.cellStyle"
				:header-cell-style="tableStyle.headerCellStyle"
				native-scrollbar
			>
				<el-table-column
					align="center"
					type="selection"
					width="40"
					reserve-selection
				/>
				<el-table-column
					prop="spName"
					:label="t('服务商')"
					show-overflow-tooltip
					sortable="custom"
					width="100"
				/>
				<el-table-column
					prop="warehouseName"
					:label="t('仓库名称')"
					show-overflow-tooltip
					sortable="custom"
					width="120"
				/>
				<el-table-column
					prop="spSkuCode"
					:label="t('三方仓sku/产品名称')"
					sortable="custom"
					width="200"
				>
					<template #default="{ row }">
						<div
							:style="{
								display: 'flex',
								flexDirection: 'column',
								justifyContent: 'center',
								alignItems: 'flex-start',
								width: '100%',
								textAlign: 'left',
							}"
						>
							<div>{{ row.spSkuCode }}</div>
							<div>{{ row.spSkuName }}</div>
						</div>
						<div v-if="!row.spSkuCode">---</div>
					</template>
				</el-table-column>
				<el-table-column
					prop="productSkuCode"
					:label="t('系统SKU/产品名称')"
					sortable="custom"
					width="300"
				>
					<template #default="{ row }">
						<div v-if="row?.productSkuCode" class="flex items-center gap-3">
							<!-- 图片列 -->
							<div class="flex justify-center">
								<MrImg :src="row.productSkuImg" />
							</div>
							<div class="flex flex-col items-start pl-2 text-left">
								<MrTextEllipsis :text="row.productSkuName" :maxLength="50" />
								<MrTextEllipsis :text="row.productSkuCode" :maxLength="50" />
							</div>
						</div>
						<div v-else>---</div>
					</template>
				</el-table-column>
				<el-table-column prop="onwayQty" show-overflow-tooltip>
					<template #header>
						{{ t('在途量') }}
						<el-tooltip
							effect="dark"
							content="已发货但未到仓的数量"
							placement="top"
						>
							<el-icon color="#a8abb2"><QuestionFilled /></el-icon>
						</el-tooltip>
					</template>
				</el-table-column>
				<el-table-column prop="pendingQty" show-overflow-tooltip>
					<template #header>
						{{ t('待上架') }}
						<el-tooltip
							effect="dark"
							content="已到仓但未上架数量"
							placement="top"
						>
							<el-icon color="#a8abb2"><QuestionFilled /></el-icon>
						</el-tooltip> </template></el-table-column
				>/
				<el-table-column prop="availableQty" show-overflow-tooltip
					><template #header>
						{{ t('可用量') }}
						<el-tooltip
							effect="dark"
							content="可用数量，不包含占用量"
							placement="top"
						>
							<el-icon color="#a8abb2"><QuestionFilled /></el-icon>
						</el-tooltip> </template
				></el-table-column>
				<el-table-column prop="reservedQty" show-overflow-tooltip
					><template #header>
						{{ t('占用量') }}
						<el-tooltip
							effect="dark"
							content="已下单未出库数量"
							placement="top"
						>
							<el-icon color="#a8abb2"><QuestionFilled /></el-icon>
						</el-tooltip> </template
				></el-table-column>
				<el-table-column prop="unsellableQty" show-overflow-tooltip
					><template #header>
						{{ t('不可售') }}
						<el-tooltip
							effect="dark"
							content="三方仓上架为不可售的数量"
							placement="top"
						>
							<el-icon color="#a8abb2"><QuestionFilled /></el-icon>
						</el-tooltip> </template
				></el-table-column>
				<el-table-column prop="totalQty" show-overflow-tooltip
					><template #header>
						{{ t('库存总量') }}
						<el-tooltip
							effect="dark"
							content="库存总量=可用量+占用量+不可售"
							placement="top"
						>
							<el-icon color="#a8abb2"><QuestionFilled /></el-icon>
						</el-tooltip> </template
				></el-table-column>
				<el-table-column
					prop="updateTime"
					:label="t('更新时间')"
					show-overflow-tooltip
					sortable="custom"
					width="180"
				/>
			</el-table>
			<pagination
				@current-change="currentChangeHandle"
				@size-change="sizeChangeHandle"
				v-bind="state.pagination"
			/>
		</div>
	</div>
</template>

<script setup lang="ts">
import { BasicTableProps, useTable } from '/@/hooks/table';
import { useI18n } from 'vue-i18n';
import dayjs from 'dayjs';
import { defineAsyncComponent, ref, reactive, onMounted } from 'vue';
import { useMessage } from '/@/hooks/message';
import { ElMessageBox } from 'element-plus';

import {
	getSpInventoryList,
	postSynchronizeSpInventory,
	getSpInventoryExport,
} from '/@/api/warehouse/spInventory/index';
import { getWarehouseInfoList } from '/@/api/warehouse/third-warehouse/index';
import { auth } from '/@/utils/authFunction';
const ToolBar = defineAsyncComponent(
	() => import('/@/components/ToolBar/tool-bar.vue')
);
const TreeSelectInputApi = defineAsyncComponent(
	() => import('/@/componentsApi/TreeSelectInputApi/index.vue')
);
const SelectInput = defineAsyncComponent(
	() => import('/@/components/TableFormModule/select-input.vue')
);
const { t } = useI18n();
// table的引用
const tableRef = ref();
// 搜索变量
const queryRef = ref();
// 是否显示搜索
const showSearch = ref(true);

const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {
		status: 1,
	},
	pageList: getSpInventoryList,
	loading: false,
	dataList: [],
	ascs: ['sp_name'],
});

//  table hook
const {
	getDataList,
	currentChangeHandle,
	sizeChangeHandle,
	sortChangeHandle,
	resetTableQuery,
	tableStyle,
} = useTable(state, tableRef);

onMounted(() => {
	// 快照日期默认查询今天 YYYY-MM-DD
	state.queryForm.snapshotDate = dayjs().format('YYYY-MM-DD');
	// 获取数据列表
	getDataList();
});

// 清空搜索条件
const resetQuery = () => {
	resetTableQuery(() => {
		// 重置时间范围
		return {
			queryForm: {
				current: 1,
				size: 10,
				status: 1, // 默认启用
			},
			descs: [],
			ascs: ['sp_name'],
		};
	});
};

// 导出
const exportPartFn = async () => {
	try {
		const ids = tableRef.value.getSelectionRows().map((item: any) => item.id);
		// 显示加载状态
		state.loading = true;
		// 发送请求，设置 responseType 为 'blob' 以接收二进制流
		await getSpInventoryExport({
			...state.queryForm,
			ascs: state?.ascs,
			descs: state?.descs,
			ids: ids || [],
			current: 1,
			size: 10000,
		});
	} catch (error) {
		useMessage().error(t(error as string));
	} finally {
		// 隐藏加载状态
		state.loading = false;
	}
};

// 打开对话框
const openDialog = async (type: string) => {
	if (type === 'synchronize') {
		// 同步SKU和库存
		ElMessageBox.confirm(
			'确定要同步SKU和库存吗？同步需要一定时间，请耐心等待。',
			'提示',
			{
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'info',
			}
		).then(async () => {
			try {
				const res = await postSynchronizeSpInventory({
					warehouseCodes: state.queryForm.warehouseCodes,
				});
				if (res.code === 0) {
					useMessage().success('同步成功');
					getDataList();
				}
			} catch (error: any) {
				useMessage().error(error.msg || '同步失败，请稍后再试');
				return;
			}
		});
	}
};
</script>

<style lang="scss" scoped>
.text-blue {
	color: #0089ef;
}
.el-dropdown-link {
	cursor: pointer;
	color: var(--el-color-primary);
	display: flex;
	align-items: center;
}
</style>
