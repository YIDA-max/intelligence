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
									platformChannelCode:
										props.currentSpInfo.id || 'Tiktok自运营',
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
					/>
				</el-form-item>
				<el-form-item>
					<div class="flex item-center">
						<SelectInput
							v-model:queryForm="state.queryForm"
							:searchTypes="[
								{
									label: 'MSKU', //  msku 就是 商品ID 就是 reference_code
									value: 'referenceCodes',
								},
								{
									label: '产品名称',
									value: 'names',
								},
								{
									label: 'SKU',
									value: 'skuCodes',
								},
								{
									label: 'FBT ID',
									value: 'goodsIds',
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
			<template #goodsId-header>
				{{ t('FBT ID') }}
				<el-tooltip effect="dark" content="类似FNSKU" placement="top">
					<el-icon color="#a8abb2"><QuestionFilled /></el-icon>
				</el-tooltip>
			</template>
			<template #referenceCode-header>
				{{ t('MSKU') }}
				<el-tooltip
					effect="dark"
					content="取自:reference_code,作为ERP的MSKU"
					placement="top"
				>
					<el-icon color="#a8abb2"><QuestionFilled /></el-icon>
				</el-tooltip>
			</template>
			<template #fbtWarehouseId-header>
				{{ t('仓库ID') }}
				<el-tooltip
					effect="dark"
					content="取自：fbtWarehouseId"
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
import { getColumns } from './config/ticktock';
import { useI18n } from 'vue-i18n';
import { defineAsyncComponent, ref, reactive, onMounted } from 'vue';
import { useMessage } from '/@/hooks/message';
import {
	getTicktockStorageList,
	exportTicktockStorageList,
} from '/@/api/warehouse/platformStock/ticktockStock/index';
import { getGroupStoreByPlatform } from '/@/api/base/store/index';
import { useRouter } from 'vue-router';
import { auth } from '/@/utils/authFunction';

const SelectInput = defineAsyncComponent(
	() => import('/@/components/TableFormModule/select-input.vue')
);
const MrTextEllipsis = defineAsyncComponent(
	() => import('/@/common/MrTextEllipsis/index.vue')
);

const TreeSelectInputApi = defineAsyncComponent(
	() => import('/@/componentsApi/TreeSelectInputApi/index.vue')
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
		isShowExport: auth('tiktok_export'),
	},
	pageList: async (params: any) => {
		const res = await getTicktockStorageList(params);
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

onMounted(() => {
	// 初始加载仓库数据
	loadStoreData();
});

// 仓库数据
const storeData = ref<Array<any>>([]);
// 仓库选择相关
const loadStoreData = async () => {
	try {
		const res = await getGroupStoreByPlatform({
			platformChannelCode: props.currentSpInfo.id || 'Tiktok自运营',
		});
		storeData.value = res.data.map((item: any) => ({
			id: item.siteCode,
			name: item.siteCode,
			children: item.stores.map((val: any) => ({
				id: val.id,
				name: val.storeName,
			})),
		}));
	} catch (error) {
		storeData.value = [];
	}
};

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
		await exportTicktockStorageList({
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
.el-dropdown-link {
	cursor: pointer;
	color: var(--el-color-primary);
	display: flex;
	align-items: center;
}

::v-deep(.el-table__footer td) {
	text-align: center;
}
</style>
