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
									platformChannelCode: props.currentSpInfo.id || 'Amazon',
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
									label: 'MSKU',
									value: 'mskuCodes',
								},
								{
									label: 'ASIN',
									value: 'asins',
								},
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
			<template #storeId="{ row }">{{ row.storeName ?? '-' }}</template>
			<template #asin="{ row }">
				<div class="flex flex-col items-start w-full">
					<MrTextEllipsis :text="row.asin || '---'" />
					<MrTextEllipsis :text="row.mskuCode || '---'" />
				</div>
			</template>
			<template #skuCode="{ row }">
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

			<template #totalQuantity-header>
				{{ t('总库存') }}
				<el-tooltip
					effect="dark"
					content="=在库库存+货件待发货+货件已发货+到货处理中"
					placement="top"
				>
					<el-icon color="#a8abb2"><QuestionFilled /></el-icon>
				</el-tooltip>
			</template>

			<template #inStockQuantity-header>
				{{ t('在库库存') }}
				<el-tooltip
					effect="dark"
					content="=可售库存+不可售可存+预留库存+冻结库存"
					placement="top"
				>
					<el-icon color="#a8abb2"><QuestionFilled /></el-icon>
				</el-tooltip>
			</template>

			<template #fulfillableQuantity-header>
				{{ t('可售库存') }}
				<el-tooltip
					effect="dark"
					content="来源《亚马逊物流库存报告:存档》的字段afn-fulfillable-quantity字段"
					placement="top"
				>
					<el-icon color="#a8abb2"><QuestionFilled /></el-icon>
				</el-tooltip>
			</template>

			<template #unsellableQuantity-header>
				{{ t('不可售库存') }}
				<el-tooltip
					effect="dark"
					content="来源《亚马逊物流库存报告:存档》的字段afn-unsellable-quantity字段"
					placement="top"
				>
					<el-icon color="#a8abb2"><QuestionFilled /></el-icon>
				</el-tooltip>
			</template>

			<template #reservedQuantity-header>
				{{ t('预留库存') }}
				<el-tooltip
					effect="dark"
					content="来源《亚马逊物流库存报告:存档》的字段afn-reserved-quantity字段"
					placement="top"
				>
					<el-icon color="#a8abb2"><QuestionFilled /></el-icon>
				</el-tooltip>
			</template>

			<template #researchingQuantity-header>
				{{ t('冻结库存') }}
				<el-tooltip
					effect="dark"
					content="来源《亚马逊物流库存报告:存档》的字段afn-researching-quantity字段"
					placement="top"
				>
					<el-icon color="#a8abb2"><QuestionFilled /></el-icon>
				</el-tooltip>
			</template>

			<template #inboundWorkingQuantity-header>
				{{ t('货件待发货') }}
				<el-tooltip
					effect="dark"
					content="来源《亚马逊物流库存报告:存档》的字段afn-inbound-working-quantity字段"
					placement="top"
				>
					<el-icon color="#a8abb2"><QuestionFilled /></el-icon>
				</el-tooltip>
			</template>

			<template #inboundShippedQuantity-header>
				{{ t('货件已发货') }}
				<el-tooltip
					effect="dark"
					content="来源《亚马逊物流库存报告:存档》的字段afn-inbound-shipped-quantity字段"
					placement="top"
				>
					<el-icon color="#a8abb2"><QuestionFilled /></el-icon>
				</el-tooltip>
			</template>

			<template #inboundReceivingQuantity-header>
				{{ t('到货处理中') }}
				<el-tooltip
					effect="dark"
					content="来源《亚马逊物流库存报告:存档》的字段afn-inbound-receiving-quantity字段"
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
import { getColumns } from './config/amazon';
import { useI18n } from 'vue-i18n';
import { defineAsyncComponent, ref, reactive } from 'vue';
import { useMessage } from '/@/hooks/message';
import {
	getAmazonStorageList,
	exportAmazonStorageList,
} from '/@/api/warehouse/platformStock/index';
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
		isShowExport: auth('amazon_export'),
	},
	pageList: async (params: any) => {
		const res = await getAmazonStorageList(params);
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
		await exportAmazonStorageList({
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
