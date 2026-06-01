<template>
	<el-dialog
		v-bind="$attrs"
		width="40%"
		:close-on-click-modal="false"
		draggable
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
						@blur="handleSearch"
					>
						<template #prefix>
							<el-icon class="cursor-pointer" @click.stop="handleSearch">
								<Search />
							</el-icon>
						</template>
					</el-input>
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
				highlight-current-row
				@current-change="(val:any) => (rows = val)"
			>
				<el-table-column :label="$t('图片')" width="80">
					<template #default="{ row }">
						<MrImg :src="row.imgUrl" />
					</template>
				</el-table-column>
				<el-table-column
					prop="skuCode"
					:label="$t('SKU/产品名称')"
					show-overflow-tooltip
					sortable="custom"
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
					prop="productSkuCartonCode"
					:label="$t('箱规编码')"
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
				<el-button type="primary" @click="onSubmit" :disabled="!rows?.id">{{
					$t('确定')
				}}</el-button>
			</span>
		</template>
	</el-dialog>
</template>

<script setup lang="ts">
import { BasicTableProps, useTable } from '/@/hooks/table';
import { Search } from '@element-plus/icons-vue';
import { useMessage } from '/@/hooks/message';
import { ref, reactive, onMounted } from 'vue';
import { postManualSpSkuMapping } from '/@/api/warehouse/spSku/index';
import { getSpSkuSelectList } from '/@/api/warehouse/spSku/index';
const emits = defineEmits(['closeDialog', 'setMaterialRows']);

// 当前选中的行数据
const rows = ref<any>({});

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
	// 不立即请求数据
	createdIsNeed: false,
	pageList: getSpSkuSelectList,
	ascs: ['sku_code'],
});

const tableRef = ref<any>(null);

//  table hook
const { getDataList, currentChangeHandle, sizeChangeHandle, tableStyle } =
	useTable(state, tableRef);

// 查询方法（输入框失焦和点击搜索图标都会触发）
const handleSearch = async () => {
	await getDataList();
};

// 关闭弹窗
const closeDialog = () => {
	//   model.value = false;
	emits('closeDialog');
};
onMounted(async () => {});
// 初始化的时候获取数据
const handleOpen = async () => {
	// 清空查询条件
	Object.keys(state.queryForm).forEach((key) => {
		if (Array.isArray(state.queryForm[key])) {
			state.queryForm[key] = [];
		} else {
			state.queryForm[key] = undefined;
		}
	});
	state.queryForm.spId = props.currentRow.spId;
	await getDataList();
};
// 提交
const onSubmit = async () => {
	try {
		await postManualSpSkuMapping({
			spId: props.currentRow.spId,
			spSkuCode: props.currentRow.spSkuCode,
			productSkuCode: rows.value.skuCode,
			productSkuCartonCode: rows.value.productSkuCartonCode,
		});
		// 清空选中
		tableRef.value.clearSelection();
		// 关闭弹窗
		closeDialog();
	} catch (error: any) {
		useMessage().error(error.message || '操作失败，请稍后再试');
	}
};
</script>

<style lang="less" scoped></style>
