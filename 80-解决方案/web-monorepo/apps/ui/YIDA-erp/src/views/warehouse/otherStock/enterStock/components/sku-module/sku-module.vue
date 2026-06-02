<script setup lang="ts">
import { BasicTableProps, useTable } from '/@/hooks/table';
import { Search } from '@element-plus/icons-vue';
import { ref, reactive, defineAsyncComponent } from 'vue';
import { useI18n } from 'vue-i18n';
import { getChooseSkuByOtherbound } from '/@/api/warehouse/otherStock/enterStock';

const TreeSelectInputApi = defineAsyncComponent(
	() => import('/@/componentsApi/TreeSelectInputApi/index.vue')
);
const emits = defineEmits(['closeDialog', 'setRows']);
const { t } = useI18n();
const loading = ref(false);

const props = defineProps({
	skuList: {
		type: Array,
		default: () => [],
	},
	warehouseCode: {
		type: String,
		default: '',
	},
	warehouseType: {
		type: String,
		default: '',
	},
});

// TODO:接口未调试
const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {},
	pageList: getChooseSkuByOtherbound,
	createdIsNeed: false,
	isAutoClearSelection: false,
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
const {
	getDataList,
	currentChangeHandle,
	sizeChangeHandle,
	setTableSelection,
	tableStyle,
} = useTable(state, tableRef);

const handleOpen = () => {
	// 重置查询
	state.queryForm = {
		warehouseCode: props.warehouseCode,
		keyword: '',
	};
	// 获取数据
	getDataList();
	// 如果有已传入的skuList，设置选中
	if (props.skuList && props.skuList.length > 0) {
		setTableSelection(props.skuList);
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
		width="70%"
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
				<el-form-item prop="keyword">
					<el-input
						v-model="state.queryForm.keyword"
						placeholder="搜索SKU/产品名称"
						:prefix-icon="Search"
						@blur="getDataList"
						:style="{
							width: '180px',
						}"
					/>
				</el-form-item>
				<el-form-item prop="mskuCode">
					<el-input
						v-model="state.queryForm.mskuCode"
						placeholder="MSKU"
						:prefix-icon="Search"
						@blur="getDataList"
						:style="{
							width: '180px',
						}"
					/>
				</el-form-item>
				<el-form-item prop="platformChannel">
					<TreeSelectInputApi
						v-model:queryForm="state.queryForm"
						componentType="dicts"
						multiple
						:settings="{
							text: '平台渠道',
							getTreeDataParams: 'platform_channel',
							searchFn: getDataList,
							code: 'platformChannel',
							width: '180px',
						}"
					/>
				</el-form-item>
			</el-form>
			<el-table
				:data="state.dataList"
				height="400"
				v-loading="state.loading"
				border
				ref="tableRef"
				:row-key="
					(row:any) => {
						return `${row.skuCode}-${row.countryCode}-${row.mskuCode}-${row.platformChannel}-${row.deptId}-${row.skuCartonCode} }`;
					}
				"
				:cell-style="tableStyle.cellStyle"
				:header-cell-style="tableStyle.headerCellStyle"
				:empty-text="t('请查询SKU')"
				native-scrollbar
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
					min-width="150"
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
					:label="t('国家')"
					min-width="80"
					show-overflow-tooltip
				>
					<template #default="{ row }">
						{{ row.countryCode || '---' }}
					</template>
				</el-table-column>
				<el-table-column
					:label="t('平台渠道')"
					min-width="80"
					show-overflow-tooltip
				>
					<template #default="{ row }">
						{{ row.platformChannel || '---' }}
					</template>
				</el-table-column>
				<el-table-column label="箱规编码" min-width="80" show-overflow-tooltip>
					<template #default="{ row }">
						{{ row.skuCartonCode || '--' }}
					</template>
				</el-table-column>
				<el-table-column
					:label="t('MSKU')"
					min-width="80"
					show-overflow-tooltip
				>
					<template #default="{ row }">
						{{ row.mskuCode || '---' }}
					</template>
				</el-table-column>
				<el-table-column
					:label="t('部门&小组')"
					min-width="80"
					show-overflow-tooltip
				>
					<template #default="{ row }">
						{{ row.deptName || '---' }}
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
