<template>
	<el-dialog
		v-bind="$attrs"
		width="50%"
		:close-on-click-modal="false"
		draggable
		:append-to-body="true"
		@open="handleOpen"
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
				<el-form-item prop="bundleKeyword">
					<el-input
						v-model="state.queryForm.bundleKeyword"
						placeholder="搜索捆绑编码/捆绑名称"
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
				row-key="id"
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
					width="300"
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
					prop="productTypeText"
					:label="$t('产品类型')"
					show-overflow-tooltip
				>
				</el-table-column>
				<el-table-column
					prop="materialControlUserName"
					:label="$t('物控负责人')"
					show-overflow-tooltip
				>
				</el-table-column>
				<el-table-column
					prop="singleCartonQty"
					:label="$t('单箱数量')"
					show-overflow-tooltip
				>
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
import {
	getSkuByDeptId,
	postSupplierSkuGetBySkuCode,
} from '/@/api/purchase/demand';
import { useMessage } from '/@/hooks/message';
const emits = defineEmits(['closeDialog', 'setRows']);
const Preview = defineAsyncComponent(
	() => import('/@/components/Material/preview.vue')
);
// 是否显示预览
const showPreview = ref(false);
const theCurrentRow = ref<any>({});
const loading = ref(false);

// const props = defineProps({
// 	deptId: {
// 		type: Number,
// 		default: () => {
// 			return 0;
// 		},
// 	},
// });
// TODO:接口未调试
const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {
		// deptId: props.deptId, // 不传默认全部部门
		status: 1,
	},
	pageList: getSkuByDeptId,
	createdIsNeed: false,
	isAutoClearSelection: false,
});

const tableRef = ref<any>(null);

//  table hook
const { getDataList, currentChangeHandle, sizeChangeHandle, tableStyle } =
	useTable(state, tableRef);
// 重置
const resetQuery = async () => {
	// 重置查询条件
	state.queryForm = {
		current: 1,
		status: 1,
		size: 10,
	};
	// 清空选中
	tableRef.value?.clearSelection();
	// 获取数据
	getDataList();
};

// 关闭弹窗
const closeDialog = () => {
	emits('closeDialog');
};
const handleOpen = () => {
	resetQuery();
};

// 提交
const onSubmit = async () => {
	loading.value = true;
	try {
		const selectedRows = tableRef.value.getSelectionRows();
		if (selectedRows.length === 0) {
			useMessage().warning('请至少选择一条数据');
			return;
		}
		// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
		const dataList = selectedRows.map(({ id, ...row }: any) => ({
			...row,
			countryCode: row.saleArea,
		}));
		// 后台偷懒系列1-2
		const res = await postSupplierSkuGetBySkuCode(
			dataList.map((item: any) => item.skuCode)
		);
		if (res.code !== 0) {
			loading.value = false;
			throw new Error('获取供应商产品信息失败');
		}
		dataList.forEach((item: any) => {
			// res.data 是map 结构
			const supplierSkuInfo = res.data[item.skuCode];
			item.minimumOrder = supplierSkuInfo?.minimumOrder || null;
		});
		// 查询是否有物控负责人 是否有materialControlUserId
		for (const item of dataList) {
			if (!item.materialControlUserId) {
				// 获取产品类目信息（可能是 categoryCode/categoryName 或 productCategoryCode/productCategoryName）
				const categoryCode =
					item.categoryCode || item.productCategoryCode || '';
				const categoryName =
					item.categoryName || item.productCategoryName || '';
				const categoryInfo =
					categoryCode && categoryName
						? `${categoryCode}-${categoryName}`
						: categoryCode || categoryName || '未知类目';
				useMessage().warning(
					`SKU[${item.skuCode}]关联产品类目[${categoryInfo}]未配置物控负责人，请联系物控配置后再操作！`
				);
				return;
			}
		}
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
