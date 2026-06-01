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
					<AdvancedSearchStyle ref="AdvancedSearchStyleRef">
						<template #default>
							<el-form-item>
								<div class="flex item-center">
									<SelectInput
										v-model:queryForm="state.queryForm"
										:searchTypes="[
											{
												label: 'SKU',
												value: 'skuCodes',
											},
										]"
										:getDataList="getDataList"
									/>
								</div>
							</el-form-item>
							<el-form-item>
								<div class="flex item-center">
									<SelectInput
										v-model:queryForm="state.queryForm"
										:searchTypes="[
											{
												label: t('MSKU'),
												value: 'mskuCodes',
											},
										]"
										:getDataList="getDataList"
									/>
								</div>
							</el-form-item>
							<el-form-item>
								<div class="flex item-center">
									<SelectInput
										v-model:queryForm="state.queryForm"
										:searchTypes="[
											{
												label: t('关联单号'),
												value: 'relateOrderNos',
											},
										]"
										:getDataList="getDataList"
									/>
								</div>
							</el-form-item>
							<el-form-item>
								<!-- 自营仓+三方仓+平台仓 -->
								<TreeSelectInputApi
									componentType="warehouseQianyi"
									text="仓库"
									code="warehouseCodes"
									v-model:queryForm="state.queryForm"
									:searchFn="getDataList"
									:settings="{
										text: '选择仓库',
										width: '220px',
										getTreeDataParams: { warehouseTypes: [0, 1, 2] },
									}"
								/>
							</el-form-item>
							<el-form-item>
								<TreeSelectInputApi
									v-model:queryForm="state.queryForm"
									code="recordTypeIds"
									:settings="{
										getTreeData: getStockRecordStatusList,
										text: '操作类型',
										searchFn: getDataList,
										width: '220px',
										selectTreeProps: {
											value: 'id',
											label: 'recordTypeName',
										},
										getIdsCode: 'id',
									}"
								/>
							</el-form-item>
							<el-form-item>
								<TreeSelectInputApi
									componentType="userList"
									text="操作人"
									code="createIds"
									v-model:queryForm="state.queryForm"
									:searchFn="getDataList"
									:settings="{
										text: '操作人',
										width: '220px',
										getTreeDataParams: { lockFlag: 0 },
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
												label: t('操作时间'),
												value: 'createdTime',
												isAddHMS: true,
												dateStart: 'createTimeStart',
												dateEnd: 'createTimeEnd',
											},
										]"
										:getDataList="getDataList"
									/>
								</div>
							</el-form-item>
						</template>

						<template #right>
							<el-form-item>
								<div class="flex item-center">
									<el-button @click="getDataList" type="primary"
										>{{ $t('搜索') }}
									</el-button>
									<el-button @click="resetQuery" type="info" plain
										>{{ $t('common.resetBtn') }}
									</el-button>
								</div>
							</el-form-item></template
						>
					</AdvancedSearchStyle>
				</el-form>
			</el-row>
			<BaseTable
				:register="register"
				ref="baseTableRef"
				:tableAttrs="tableAttrs"
			>
				<template #imgUrl="{ row }">
					<MrImg :src="row.imgUrl" />
				</template>
				<template #skuCode="{ row }">
					<div class="flex flex-col items-start w-full">
						<MrTextEllipsis :text="row.skuCode || '---'" />
						<MrTextEllipsis :text="row.skuName || '---'" />
					</div>
				</template>
				<template #warehouseCode="{ row }">
					<MrTextEllipsis :text="row.warehouseName || '---'" />
				</template>
				<template #platformChannelCode="{ row }">
					<MrTextEllipsis :text="row.platformChannelText || '---'" />
				</template>
				<template #operateQty="{ row }">
					{{ row.operateQty?.toLocaleString() ?? '-' }}
				</template>
			</BaseTable>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useTable } from '/@/components/BaseTable/hooks/BaseTable';
import { getColumns } from './config/index';
import { useI18n } from 'vue-i18n';
import { defineAsyncComponent, ref, reactive, onMounted } from 'vue';
import { useMessage } from '/@/hooks/message';
import {
	getStockRecordPage,
	getStockRecordStatusList,
	getStockRecordExport,
} from '/@/api/warehouse/stockRecord/index';
import { auth } from '/@/utils/authFunction';
const TreeSelectInputApi = defineAsyncComponent(
	() => import('/@/componentsApi/TreeSelectInputApi/index.vue')
);
const SelectDate = defineAsyncComponent(
	() => import('/@/components/TableFormModule/select-date.vue')
);
const SelectInput = defineAsyncComponent(
	() => import('/@/components/TableFormModule/select-input.vue')
);
const AdvancedSearchStyle = defineAsyncComponent(
	() => import('/@/components/TableFormModule/advanced-search-style.vue')
);
const MrTextEllipsis = defineAsyncComponent(
	() => import('/@/common/MrTextEllipsis/index.vue')
);

const { t } = useI18n();

// table的引用
const baseTableRef = ref();

// 搜索变量
const queryRef = ref();
// 是否显示搜索
const showSearch = ref(true);
// 高级搜索布局的引用
const AdvancedSearchStyleRef = ref();

const state: any = reactive({
	queryForm: {},
	columns: getColumns(),
	toolBarConfig: {
		handleRefresh: () => {
			getDataList();
		},
		handleExport: () => {
			handleExport();
		},
		isShowExport: auth('stockRecord_export'),
	},
	pageList: async (params: any) => {
		const res = await getStockRecordPage(params);
		return {
			...res,
			msg: res.msg || 'success',
		};
	},
	createdIsNeed: true,
	loading: false,
	dataList: [],
	ascs: [],
	descs: ['r.create_time'],
});

const tableAttrs = {
	rowConfig: { keyField: 'id', isHover: true },
	cellConfig: { height: 78 },
	checkboxConfig: {
		reserve: true,
		highlight: true,
		trigger: 'checkbox',
	},
	scrollY: {
		enabled: true,
		gt: 20,
		oSize: 6,
	},
};

const { register, getDataList, tableRef } = useTable(state, baseTableRef);

onMounted(() => {});

// 重置
const resetQuery = () => {
	state.queryForm = {
		current: 1,
		size: 10,
	};
	getDataList();
};

/**
 * 导出
 */
const handleExport = async () => {
	try {
		const ids = tableRef.value
			.getCheckboxRecords(true)
			.map((item: any) => item.id);
		// 显示加载状态
		state.loading = true;
		// 发送请求，设置 responseType 为 'blob' 以接收二进制流
		await getStockRecordExport({
			...state.queryForm,
			ascs: state?.ascs,
			ids: ids.length > 0 ? ids : undefined,
			descs: state?.descs,
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
