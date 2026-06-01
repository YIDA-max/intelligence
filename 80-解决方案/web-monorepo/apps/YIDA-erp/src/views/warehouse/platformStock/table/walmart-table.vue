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
									platformChannelCode: props.currentSpInfo.id || 'Walmart',
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
							code: 'storeIds',
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
									label: '商品ID',
									value: 'itemIds',
								},
								{
									label: '产品名称',
									value: 'productNames',
								},
								{
									label: 'SKU',
									value: 'skus',
								},
								{
									label: 'MSKU',
									value: 'mskus',
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
			<template #storeName="{ row }">
				<div
					v-if="row.storeName || row.siteCode"
					class="flex flex-col items-start w-full"
				>
					<MrTextEllipsis
						:text="
							row.storeName && row.siteCode
								? `${row.storeName}:${row.siteCode}`
								: row.storeName || row.siteCode || '---'
						"
					/>
				</div>
			</template>
			<template #skuCode="{ row }">
				<div v-if="row.skuCode" class="flex flex-col items-start w-full">
					<MrTextEllipsis :text="row.skuCode" />
					<MrTextEllipsis :text="row.productName" />
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
			<template #imgUrl="{ row }">
				<MrImg :src="row.imgUrl" />
			</template>

			<template #itemId-header>
				{{ t('商品ID') }}
				<el-tooltip effect="dark" content="取自于ItemID" placement="top">
					<el-icon color="#a8abb2"><QuestionFilled /></el-icon>
				</el-tooltip>
			</template>

			<template #availableUnits-header>
				{{ t('可售') }}
				<el-tooltip effect="dark" content="可售库存" placement="top">
					<el-icon color="#a8abb2"><QuestionFilled /></el-icon>
				</el-tooltip>
			</template>

			<template #damagedReceipts-header>
				{{ t('拒收（损坏）') }}
				<el-tooltip effect="dark" content="损坏未记录库存" placement="top">
					<el-icon color="#a8abb2"><QuestionFilled /></el-icon>
				</el-tooltip>
			</template>

			<template #forecastYear-header>
				{{ t('近一年预测量') }}
				<el-tooltip effect="dark" content="沃尔玛平台预测" placement="top">
					<el-icon color="#a8abb2"><QuestionFilled /></el-icon>
				</el-tooltip>
			</template>

			<template #forecastMonth-header>
				{{ t('近一个月预测量') }}
				<el-tooltip effect="dark" content="沃尔玛平台预测" placement="top">
					<el-icon color="#a8abb2"><QuestionFilled /></el-icon>
				</el-tooltip>
			</template>

			<template #sellThroughRate-header>
				{{ t('售罄率') }}
				<el-tooltip
					effect="dark"
					content="特定时期内销量占总供给量的百分比"
					placement="top"
				>
					<el-icon color="#a8abb2"><QuestionFilled /></el-icon>
				</el-tooltip>
			</template>
		</BaseTable>
	</div>
</template>

<script setup lang="ts">
import { useTable } from '/@/components/BaseTable/hooks/BaseTable';
import { getColumns } from './config/walmart';
import { useI18n } from 'vue-i18n';
import { defineAsyncComponent, ref, reactive } from 'vue';
import { useMessage } from '/@/hooks/message';
import {
	getWalmartStorageList,
	exportWalmartStorageList,
} from '/@/api/warehouse/platformStock/walmartStock/index';
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
		isShowExport: auth('walmart_export'),
	},
	pageList: async (params: any) => {
		const res = await getWalmartStorageList(params);
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
		// 显示加载状态
		state.loading = true;
		// 发送请求，设置 responseType 为 'blob' 以接收二进制流
		await exportWalmartStorageList({
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
