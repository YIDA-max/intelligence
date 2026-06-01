<template>
	<el-dialog
		v-bind="$attrs"
		width="40%"
		:close-on-click-modal="false"
		draggable
		@open="init"
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
			>
				<el-table-column
					align="center"
					type="selection"
					width="40"
					:reserve-selection="true"
				/>
				<el-table-column :label="$t('图片')" width="60">
					<template #default="{ row }">
						<MrImg :src="row.imgUrl" />
					</template>
				</el-table-column>
				<el-table-column
					prop="skuCode"
					:label="$t('SKU/产品名称')"
					show-overflow-tooltip
					sortable="custom"
					width="160"
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
				/>
				<el-table-column
					prop="brandName"
					:label="$t('品牌')"
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
import { getChooseSku } from '/@/api/product/spu';
import { getDicts } from '/@/api/admin/dict';
import { ref, reactive, onMounted } from 'vue';
const emits = defineEmits(['closeDialog', 'setMaterialRows']);

const loading = ref(false);
const materialTypeOptions = ref([]);
const props = defineProps({
	currentRow: {
		type: Object,
		default: () => ({}),
	},
});
// TODO:接口未调试
const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {
		skuIds: props.currentRow.productSkus?.map((item: any) => {
			return item?.id;
		}),
	},
	pageList: getChooseSku,
});

const tableRef = ref<any>(null);

//  table hook
const { getDataList, currentChangeHandle, sizeChangeHandle, tableStyle } =
	useTable(state, tableRef);

// 关闭弹窗
const closeDialog = () => {
	//   model.value = false;
	emits('closeDialog');
};
onMounted(async () => {
	try {
		// 获取辅料类型
		const res = await getDicts('material_type');
		if (res.code === 0) {
			materialTypeOptions.value = res.data.map((item: any) => ({
				value: item.value,
				label: item.label,
			}));
		}
	} catch (error) {
		// eslint-disable-next-line no-console
		console.error('获取辅料类型失败:', error);
	}
});
// 当 props.currentRow.productSkus 变化时，重新获取数据
// watch(
// 	() => props.currentRow.productSkus,
// 	async (newVal) => {
// 		// 根据里面的值来设置回显的sku数据
// 		state.queryForm.skuIds = newVal.productSkus?.map((item: any) => {
// 			return item?.id;
// 		});
// 		await getDataList();
// 	},
// 	{
// 		deep: true,
// 	}
// );
const init = async () => {
	// 初始化逻辑
	state.queryForm = {
		keyword: '',
		skuIds:
			props.currentRow.productSkus?.map((item: any) => {
				return item?.id;
			}) || [],
	};
	await getDataList();
};
// 提交
const onSubmit = async () => {
	loading.value = true;
	try {
		const selectedRows = tableRef.value.getSelectionRows();
		if (selectedRows.length === 0) {
			// eslint-disable-next-line no-console
			console.warn('请至少选择一条辅料');
			return;
		}

		emits('setMaterialRows', selectedRows);
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
