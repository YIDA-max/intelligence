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
				:model="state.queryForm"
				@keyup.enter="getDataList"
				@submit.prevent
				ref="queryRef"
			>
				<el-form-item prop="dsName">
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
				<el-table-column :label="t('图片')" type="imgUrl">
					<template #default="{ row }">
						<MrImg :src="row.imgUrl" />
					</template>
				</el-table-column>
				<el-table-column
					prop="skuCode"
					:label="t('SKU/产品名称')"
					show-overflow-tooltip
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
					prop="skuCode"
					:label="t('产品类型')"
					show-overflow-tooltip
				>
					<template #default>
						{{ t('配件') }}
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
	</el-dialog>
</template>

<script setup lang="ts">
import { BasicTableProps, useTable } from '/@/hooks/table';
import { Search } from '@element-plus/icons-vue';
import { getAllSkuList } from '/@/api/product/sku';
import { useI18n } from 'vue-i18n';
const emits = defineEmits(['closeDialog', 'setMaterialRows']);
const { t } = useI18n();
const loading = ref(false);

// TODO:接口未调试
const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {
		productType: '2', // 1是成品 2是配件
	},
	pageList: getAllSkuList,
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

const init = () => {
	// 初始化时获取数据
	getDataList();
};
onMounted(async () => {});
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
		const materialRows = selectedRows.map((item: any) => {
			return {
				...item,
				skuCode: item.skuCode,
				materialCode: item.skuCode,
				materialName: item.skuName,
				materialQty: 1, // 默认数量为1
				remark: '',
			};
		});
		emits('setMaterialRows', materialRows);
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
