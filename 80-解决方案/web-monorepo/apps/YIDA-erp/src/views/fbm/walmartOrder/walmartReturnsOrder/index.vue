<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-row class="ml10" v-show="showSearch">
				<el-form
					:inline="true"
					:model="register.state.queryForm"
					@keyup.enter="getDataList"
					ref="queryRef"
				>
					<AdvancedSearchStyle
						ref="AdvancedSearchStyleRef"
						showRightBtn
						@reset="resetQuery"
						@search="getDataList"
					>
						<template #default>
							<el-form-item v-for="(item, index) in searchConfig" :key="index">
								<component
									:is="componentMap[item.component]"
									v-model:queryForm="register.state.queryForm"
									v-bind="item.props"
									:searchFn="register?.getDataList"
								/>
							</el-form-item>
						</template>
					</AdvancedSearchStyle>
				</el-form>
			</el-row>
			<BaseTable
				:register="register"
				ref="baseTableRef"
				:rowConfig="{
					keyField: 'id',
				}"
				@toggle-row-expand="handleToggleRowExpand"
			>
				<template #left-tool>
					<el-button
						class="ml10"
						type="primary"
						@click="openDialog('import')"
						v-auth="`${moduleKey}_import`"
					>
						{{ $t('导入订单') }}</el-button
					>
				</template>

				<template #expand-expand="{ row }">
					<div class="goods-list" v-for="value in row.items" :key="value.id">
						<el-row :gutter="20">
							<el-col
								v-for="item in goodsListColumnsLeft"
								:key="item.field"
								:span="4"
							>
								<span>{{ item.title }} ：</span>
								<template v-if="item.field === 'sku'">
									<span v-if="value[item.field]">
										{{ formatData(item, value) }}
									</span>

									<!-- 空值结构 -->
									<div
										v-else
										@click="
											() => {
												router.push({
													path: '/product/product-info/sku/index',
												});
											}
										"
										class="text-blue"
									>
										<span> SKU信息没有维护,请前往SKU管理中维护>> </span>
									</div>
								</template>

								<!-- 默认字段 -->
								<span v-else>
									<el-tooltip
										v-if="(formatData(item, value) || '').length > 30"
										:content="formatData(item, value)"
										placement="top"
									>
										<span> {{ formatData(item, value).slice(0, 30) }}... </span>
									</el-tooltip>

									<span v-else>
										{{ formatData(item, value) }}
									</span>
								</span>
							</el-col>
						</el-row>
					</div>
				</template>
			</BaseTable>
			<ImportDialog
				ref="importDialogRef"
				title="导入退货订单"
				templateUrl="/files/import-template/导入沃尔玛退货.xlsx"
				excelUploadApi="/fbm/walmartReturnOrderView/import"
				:accept="'.xlsx,.xls'"
				@refreshDataList="getDataList"
				:uploadTips="uploadTips"
			/>
		</div>
	</div>
</template>

<script setup lang="ts">
import {
	BasicTableProps,
	useTable,
} from '/@/components/BaseTable/hooks/BaseTable';
import { useI18n } from 'vue-i18n';
import { defineAsyncComponent, ref, reactive, onMounted, nextTick } from 'vue';
import { useMessage } from '/@/hooks/message';
import { useFormatter } from '/@/hooks/useFormatter';
import { useRouter } from 'vue-router';
const router = useRouter();
import {
	columns,
	moduleKey,
	searchConfig,
	listApi,
	goodsListColumnsLeft,
} from './config/index';
import { auth } from '/@/utils/authFunction';
const SelectInput = defineAsyncComponent(
	() => import('/@/components/TableFormModule/select-input.vue')
);
const AdvancedSearchStyle = defineAsyncComponent(
	() => import('/@/components/TableFormModule/advanced-search-style.vue')
);
const SelectDate = defineAsyncComponent(
	() => import('/@/components/TableFormModule/select-date.vue')
);
const customCascaderApi = defineAsyncComponent(
	() => import('/@/componentsApi/customCascaderApi/index.vue')
);
const TreeSelectInputApi = defineAsyncComponent(
	() => import('/@/componentsApi/TreeSelectInputApi/index.vue')
);

const baseTableRef = ref();
const { t } = useI18n();
const { formatData } = useFormatter();
const queryRef = ref();
const showSearch = ref(true);
const AdvancedSearchStyleRef = ref();
const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: { type: 1 },
	pageList: listApi.getList,
	columns,
	toolBarConfig: {
		handleRefresh: () => {
			register?.getDataList();
		},
		handleExport: () => {
			handleExport();
		},
		isShowExport: auth(`${moduleKey}_export`),
		settingKey: `${moduleKey}_index`,
	},
	isAutoCollapseExpand: true,
	ascs: [],
});
const { register, getDataList, getTableData } = useTable(state, baseTableRef);
const uploadTips = [
	'建议每次导入都使用最新的导入模板，避免出现不必要的错误',
	'仅支持xls/xlsx格式',
	'行数不超过5000条，文件大小不超过5M',
	'同一个平台订单存在多条记录时，以第一条为准',
];
// 导入弹窗
const importDialogRef = ref();
const componentMap: any = {
	customCascaderApi,
	TreeSelectInputApi,
	SelectInput,
	SelectDate,
};

const resetQuery = () => {
	register.state.queryForm = {
		type: 1,
	};
	getDataList();
};

const handleExport = async () => {
	try {
		const selectedIds = register?.getSelectedIds() || [];
		register.state.loading = true;
		const api = listApi.exportList;
		await api({
			...register.state.queryForm,
			ascs: register.state?.ascs,
			descs: register.state?.descs,
			ids: selectedIds || [],
			current: 1,
			size: 10000,
		});
	} catch (error) {
		useMessage().error(t(error as string));
	} finally {
		register.state.loading = false;
	}
};
const openDialog = async (type: string) => {
	try {
		if (type === 'import') {
			importDialogRef.value.show();
		}
	} catch (error: any) {
		useMessage().error(error?.msg || t('错误'));
	}
};
const handleToggleRowExpand = async (params: any) => {
	const { row, expanded } = params;
	if (expanded) {
		if (!row.items?.length) {
			const data = await listApi.getInfo({
				returnOrderId: row.returnOrderId,
			});
			const list = getTableData();

			list?.map((item: any) => {
				if (item.returnOrderId === row.returnOrderId) {
					item.items = data.data;
				}
			});

			// 异步加载数据后，由于展开项的高度改变，等待DOM更新后重新同步滚动和高度布局
			await nextTick();
			if (baseTableRef.value?.tableRef) {
				const xTable = baseTableRef.value.tableRef.xTableRef;
				// 调用 refreshColumn() 刷新滚动操作，手动同步滚动相关位置（避免发生重叠或错位）
				if (typeof xTable.refreshColumn === 'function') {
					xTable.refreshColumn();
				}
			}
		}
	}
};
onMounted(() => {});
</script>

<style lang="scss" scoped>
@import '/@/views/integrations/components/indexList.scss';
.text-blue {
	color: #0089ef;
	word-break: break-all;
	white-space: pre-line;
	cursor: pointer;
	text-align: left;
	display: inline;
}
</style>
