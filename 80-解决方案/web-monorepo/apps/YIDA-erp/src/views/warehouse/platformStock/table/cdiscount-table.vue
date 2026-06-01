<template>
	<div class="layout-padding-auto layout-padding-view">
		<el-row class="ml10" v-show="showSearch">
			<el-form
				:inline="true"
				:model="state.queryForm"
				@keyup.enter="getDataList"
				ref="queryRef"
			>
				<el-form-item>
					<TreeSelectInputApi
						v-model:queryForm="state.queryForm"
						:settings="{
							getTreeData: async () => {
								const res = await getGroupStoreByPlatform({
									platformChannelCode: props.currentSpInfo.id || 'Cdiscount',
								});
								return {
									code: 0,
									data: (res.data || []).flatMap((item: any) =>
										(item.stores || []).map((val: any) => ({
											...val,
											label: `${val.storeName}:${item.siteCode}`,
										}))
									),
								};
							},
							text: '店铺',
							width: '190px',
							code: 'storeIdList',
							searchFn: async () => {
								await getDataList();
							},
							selectTreeProps: {
								value: 'id',
								label: 'label',
							},
							getIdsCode: 'id',
						}"
						@change="getDataList"
					/>
				</el-form-item>
				<el-form-item>
					<div class="flex item-center">
						<SelectInput
							v-model:queryForm="state.queryForm"
							:searchTypes="[
								{
									label: '产品ID',
									value: 'productIdList',
								},
								{
									label: 'SPU',
									value: 'spuCodeList',
								},
								{
									label: '系统MSKU',
									value: 'mskuCodeList',
								},
								{
									label: 'SKU',
									value: 'skuCodeList',
								},
								{
									label: '产品名称',
									value: 'productNameList',
								},
							]"
							:getDataList="getDataList"
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
		<BaseTable :register="register" ref="baseTableRef" :tableAttrs="tableAttrs">
			<template #imgUrl="{ row }">
				<MrImg :src="row.imgUrl" />
			</template>
			<template #skuName="{ row }">
				<div v-if="row.skuCode" class="flex flex-col items-start w-full">
					<MrTextEllipsis :text="row.skuCode" />
					<MrTextEllipsis :text="row.skuName" />
				</div>
				<div
					v-else
					@click="
						() => {
							router.push({ path: '/product/product-info/sku/index' });
						}
					"
					class="text-blue cursor-pointer"
				>
					<span> SKU信息没有维护关联的MSKU,请前往SKU列表维护>> </span>
				</div>
			</template>
			<template #productId-header>
				{{ t('产品ID') }}
				<el-tooltip effect="dark" content="类似于ASIN" placement="top">
					<el-icon color="#a8abb2"><QuestionFilled /></el-icon>
				</el-tooltip>
			</template>
		</BaseTable>
	</div>
</template>

<script setup lang="ts">
import { useTable } from '/@/components/BaseTable/hooks/BaseTable';
import { getColumns } from './config/cdiscount';
import { useI18n } from 'vue-i18n';
import { defineAsyncComponent, ref, reactive } from 'vue';
import { useMessage } from '/@/hooks/message';
import {
	getCdiscountStorageList,
	exportCdiscountStorageList,
} from '/@/api/warehouse/platformStock/cdiscountStock/index';
import { getGroupStoreByPlatform } from '/@/api/base/store/index';
import { useRouter } from 'vue-router';
import { auth } from '/@/utils/authFunction';

const SelectInput = defineAsyncComponent(
	() => import('/@/components/TableFormModule/select-input.vue')
);
const TreeSelectInputApi = defineAsyncComponent(
	() => import('/@/componentsApi/TreeSelectInputApi/index.vue')
);
const MrTextEllipsis = defineAsyncComponent(
	() => import('/@/common/MrTextEllipsis/index.vue')
);

const router = useRouter();

const props = defineProps({
	// 当前选中的平台仓
	currentSpInfo: {
		type: Object,
		required: true,
		default: () => {},
	},
});
const { t } = useI18n();
// 搜索变量
const queryRef = ref();
// table的引用
const baseTableRef = ref();
// 是否显示搜索
const showSearch = ref(true);

const state: any = reactive({
	queryForm: {},
	columns: getColumns(),
	toolBarConfig: {
		handleRefresh: () => {
			getDataList();
		},
		handleExport: () => {
			exportPartFn();
		},
		isShowExport: auth('cdiscount_export'),
	},
	pageList: async (params: any) => {
		const res = await getCdiscountStorageList(params);
		return {
			...res,
			msg: res.msg || 'success',
		};
	},
	createdIsNeed: true,
	loading: false,
	dataList: [],
	ascs: [],
	descs: ['create_time'],
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

// 重置
const resetQuery = () => {
	state.queryForm = {};
	if (state.pagination) {
		state.pagination.current = 1;
		state.pagination.size = 10;
	}
	getDataList();
};

// 导出
const exportPartFn = async () => {
	try {
		const ids = tableRef.value
			.getCheckboxRecords(true)
			.map((item: any) => item.id);
		state.loading = true;
		const params =
			ids.length > 0
				? { ids }
				: {
						...state.queryForm,
						ascs: state?.ascs,
						descs: state?.descs,
						current: 1,
						size: 10000,
				  };
		await exportCdiscountStorageList(params);
	} catch (error) {
		useMessage().error(t(error as string));
	} finally {
		state.loading = false;
	}
};

// 查询所有的数据
const resetData = () => {
	getDataList();
};

// 暴露给父组件的方法
defineExpose({
	resetData,
});
</script>

<style lang="scss" scoped>
.text-blue {
	color: #0089ef;
}
</style>
