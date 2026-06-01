<template>
	<el-dialog
		v-bind="$attrs"
		width="71%"
		:close-on-click-modal="false"
		draggable
		@open="handleOpen"
		:style="{ height: '850px' }"
		title="选择sku"
		:append-to-body="true"
	>
		<div>
			<el-form
				:inline="true"
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
						:style="{ width: '180px' }"
					/>
				</el-form-item>
				<el-form-item prop="demandOrderNos">
					<div class="flex item-center">
						<SelectInput
							v-model:queryForm="state.queryForm"
							:searchTypes="[
								{
									label: '需求单号',
									value: 'demandOrderNos',
								},
							]"
							:getDataList="getDataList"
						/>
					</div>
				</el-form-item>
				<el-form-item prop="countryCodes">
					<TreeSelectInputApi
						componentType="country"
						code="countryCodes"
						v-model:queryForm="state.queryForm"
						@change="getDataList"
						:settings="{
							text: '国家',
							width: '220px',
						}"
					/>
				</el-form-item>
				<el-form-item props="platformChannelCodes">
					<TreeSelectInputApi
						componentType="dicts"
						code="platformChannelCodes"
						v-model:queryForm="state.queryForm"
						@change="getDataList"
						:settings="{
							text: '平台渠道',
							width: '220px',
							getTreeDataParams: 'platform_channel',
						}"
					/>
				</el-form-item>
				<el-form-item prop="shippingMethods">
					<TreeSelectInputApi
						componentType="dicts"
						code="shippingMethods"
						v-model:queryForm="state.queryForm"
						@change="getDataList"
						:settings="{
							text: '发货方式',
							width: '220px',
							getTreeDataParams: 'shipping_method',
						}"
					/>
				</el-form-item>
				<el-form-item>
					<div>
						<SelectDate
							v-model:queryForm="state.queryForm"
							:settings="{
								selectStyle: {
									width: '130px',
								},
								dateStyle: {
									width: '130px',
								},
							}"
							:searchTypes="[
								{
									label: '期望提货时间',
									value: 'expectedPickupDate',
									isAddHMS: false,
									dateStart: 'expectedPickupDateStart',
									dateEnd: 'expectedPickupDateEnd',
								},
							]"
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
				height="500"
				v-loading="state.loading"
				border
				ref="tableRef"
				row-key="demandOrderNo"
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
				<el-table-column prop="skuCode" :label="t('SKU/产品名称')" width="180">
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
					:label="t('需求单号')"
					prop="demandOrderNo"
					width="100"
				>
					<template #default="{ row }">
						{{ row.demandOrderNo || '---' }}
					</template>
				</el-table-column>
				<el-table-column prop="countryCode" :label="t('国家')" width="120">
					<template #default="{ row }">
						{{ row.countryCode || '---' }}
						{{ row.countryText ? ` - ${row.countryText}` : '' }}
					</template>
				</el-table-column>
				<el-table-column
					prop="platformChannelCode"
					:label="t('平台渠道')"
					width="100"
				>
				</el-table-column>
				<el-table-column prop="mskuCode" :label="t('MSKU')" width="100">
				</el-table-column>
				<el-table-column
					prop="expectedPickupDate"
					:label="t('期望提货时间')"
					width="180"
				>
				</el-table-column>
				<el-table-column
					prop="shippingMethod"
					:label="t('发货方式')"
					width="100"
				>
					<template #default="{ row }">
						{{ row.shippingMethodText || '---' }}
					</template>
				</el-table-column>
				<el-table-column
					prop="orderTypeText"
					:label="t('订单类型')"
					width="100"
				>
					<template #default="{ row }">
						{{ row.orderTypeText }}
					</template>
				</el-table-column>
				<el-table-column prop="purchaseNum" :label="t('采购数量')" width="100">
					<template #default="{ row }">
						{{ row.purchaseNum || '---' }}
					</template>
				</el-table-column>
				<el-table-column
					prop="availableQuantity"
					:label="t('可提数量')"
					width="100"
				>
					<template #default="{ row }">
						{{ row.availableQuantity ? row.availableQuantity : '0' }}
					</template>
				</el-table-column>
				<el-table-column prop="cartonQty" :label="t('单箱数量')" width="100">
					<template #header>
						{{ $t('单箱数量') }}
						<el-popover placement="right" trigger="hover" :width="320">
							<template #default>
								<div class="popover-tip">
									<div>一箱多少个</div>
								</div>
							</template>
							<!-- 这个是触发 Popover 的小图标 -->
							<template #reference>
								<el-icon class="tip-trigger"><InfoFilled /></el-icon>
							</template>
						</el-popover>
					</template>
					<template #default="{ row }">
						{{ row.cartonQty ? row.cartonQty : '0' }}
					</template>
				</el-table-column>
				<el-table-column
					prop="deptText"
					:label="t('部门&运营小组')"
					width="180"
				>
					<template #default="{ row }">
						{{ row.deptText || '---' }}
					</template>
				</el-table-column>
				<el-table-column prop="operationText" :label="t('运营人')" width="100">
					<template #default="{ row }">
						{{ row.operationText || '---' }}
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
				<el-button @click="closeDialog">{{
					$t('common.cancelButtonText')
				}}</el-button>
				<el-button type="primary" @click="onSubmit" :disabled="loading">{{
					$t('添加')
				}}</el-button>
			</span>
		</template>
		<!-- 展示图片 -->
		<Preview v-model="showPreview" :url="theCurrentRow?.imgUrl" type="image" />
	</el-dialog>
</template>

<script setup lang="ts">
import { BasicTableProps, useTable } from '/@/hooks/table';
import { Search } from '@element-plus/icons-vue';
import { ref, reactive } from 'vue';
import { useI18n } from 'vue-i18n';
import { getCollectionPlanQuerySku } from '/@/api/mcp/collectionPlan';
const emits = defineEmits(['closeDialog', 'setRows']);
const Preview = defineAsyncComponent(
	() => import('/@/components/Material/preview.vue')
);
const SelectInput = defineAsyncComponent(
	() => import('/@/components/TableFormModule/select-input.vue')
);
const SelectDate = defineAsyncComponent(
	() => import('/@/components/TableFormModule/select-date.vue')
);
const TreeSelectInputApi = defineAsyncComponent(
	() => import('/@/componentsApi/TreeSelectInputApi/index.vue')
);
// 是否显示预览
const showPreview = ref(false);
const theCurrentRow = ref<any>({});
const loading = ref(false);
const { t } = useI18n();
// TODO:接口未调试
const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {},
	pageList: getCollectionPlanQuerySku,
	createdIsNeed: false,
	isAutoClearSelection: false,
});

const tableRef = ref<any>(null);
// 重置
const resetQuery = () => {
	state.queryForm = {
		current: 1,
		size: 10,
	};
	getDataList();
};
//  table hook
const { getDataList, currentChangeHandle, sizeChangeHandle, tableStyle } =
	useTable(state, tableRef);

// 关闭弹窗
const closeDialog = () => {
	emits('closeDialog');
};
const handleOpen = () => {
	// 重置查询
	state.queryForm = {};
	// 获取数据
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
		const dataList = selectedRows.map(({ ...row }: any) => ({
			...row,
		}));
		emits('setRows', dataList);
		// 清空选中
		tableRef.value.clearSelection();
		// 关闭弹窗
		closeDialog();
	} catch (error) {
		// eslint-disable-next-line no-console
		console.error('提交失败:', error);
	} finally {
		loading.value = false;
	}
};
</script>

<style lang="less" scoped></style>
