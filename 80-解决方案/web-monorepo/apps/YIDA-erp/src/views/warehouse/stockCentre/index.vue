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
								<TreeSelectInputApi
									componentType="country"
									text="国家"
									code="countryCodes"
									v-model:queryForm="state.queryForm"
									:searchFn="getDataList"
									:settings="{
										text: '国家',
										width: '220px',
									}"
								/>
							</el-form-item>
							<el-form-item>
								<TreeSelectInputApi
									componentType="dicts"
									text="平台渠道"
									code="platformChannelCodes"
									v-model:queryForm="state.queryForm"
									:searchFn="getDataList"
									:settings="{
										text: '平台渠道',
										width: '220px',
										getTreeDataParams: 'platform_channel',
									}"
								/>
							</el-form-item>
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
				<template #skuCode="{ row }">
					<div class="flex items-center">
						<MrImg :src="row.imgUrl" />
						<div class="flex flex-col items-start pl-2">
							<MrTextEllipsis :maxLength="12" :text="row.skuCode || '---'" />
							<MrTextEllipsis :maxLength="13" :text="row.skuName || '---'" />
						</div>
					</div>
				</template>

				<template #inStockInventory-header>
					{{ t('在库库存') }}
					<el-tooltip
						effect="dark"
						content="=平台仓在库+三方仓在库"
						placement="top"
					>
						<el-icon color="#a8abb2"><QuestionFilled /></el-icon>
					</el-tooltip>
				</template>

				<template #onWayInventory-header>
					{{ t('在途库存') }}
					<el-tooltip
						effect="dark"
						content="=平台仓在途+三方仓在途"
						placement="top"
					>
						<el-icon color="#a8abb2"><QuestionFilled /></el-icon>
					</el-tooltip>
				</template>

				<template #bookInventory-header>
					{{ t('账面库存') }}
					<el-tooltip
						effect="dark"
						content="=在库库存+在途库存"
						placement="top"
					>
						<el-icon color="#a8abb2"><QuestionFilled /></el-icon>
					</el-tooltip>
				</template>

				<template #totalInventory-header>
					{{ t('总库存') }}
					<el-tooltip
						effect="dark"
						content="=账面库存+采购在途"
						placement="top"
					>
						<el-icon color="#a8abb2"><QuestionFilled /></el-icon>
					</el-tooltip>
				</template>

				<template #inStockSalesDays-header>
					{{ t('在库可售天数') }}
					<el-tooltip
						effect="dark"
						content="=在库库存/加权日销"
						placement="top"
					>
						<el-icon color="#a8abb2"><QuestionFilled /></el-icon>
					</el-tooltip>
				</template>

				<template #onWaySalesDays-header>
					{{ t('在途可售天数') }}
					<el-tooltip
						effect="dark"
						content="=在途库存/加权日销"
						placement="top"
					>
						<el-icon color="#a8abb2"><QuestionFilled /></el-icon>
					</el-tooltip>
				</template>

				<template #bookSalesDays-header>
					{{ t('账面可售天数') }}
					<el-tooltip
						effect="dark"
						content="=账面库存/加权日销"
						placement="top"
					>
						<el-icon color="#a8abb2"><QuestionFilled /></el-icon>
					</el-tooltip>
				</template>

				<template #purchaseOnWaySalesDays-header>
					{{ t('采购在途可售天数') }}
					<el-tooltip
						effect="dark"
						content="=采购在途/加权日销"
						placement="top"
					>
						<el-icon color="#a8abb2"><QuestionFilled /></el-icon>
					</el-tooltip>
				</template>

				<template #totalSalesDays-header>
					{{ t('总库存可售天数') }}
					<el-tooltip effect="dark" content="=总库存/加权日销" placement="top">
						<el-icon color="#a8abb2"><QuestionFilled /></el-icon>
					</el-tooltip>
				</template>

				<template #weightedDailySales-header>
					{{ t('加权日销') }}
					<el-tooltip
						effect="dark"
						content="近30天销量/30*30%+近14天销量/14*30%+近7天销量/7*40%+0.01"
						placement="top"
					>
						<el-icon color="#a8abb2"><QuestionFilled /></el-icon>
					</el-tooltip>
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
import { QuestionFilled } from '@element-plus/icons-vue';
import {
	getCentralStockPage,
	getCentralStockExport,
} from '/@/api/warehouse/stockCentre/index';
import { auth } from '/@/utils/authFunction';

const SelectInput = defineAsyncComponent(
	() => import('/@/components/TableFormModule/select-input.vue')
);
const AdvancedSearchStyle = defineAsyncComponent(
	() => import('/@/components/TableFormModule/advanced-search-style.vue')
);
const MrTextEllipsis = defineAsyncComponent(
	() => import('/@/common/MrTextEllipsis/index.vue')
);
const TreeSelectInputApi = defineAsyncComponent(
	() => import('/@/componentsApi/TreeSelectInputApi/index.vue')
);
// table的引用
const baseTableRef = ref();

const { t } = useI18n();

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
		const res = await getCentralStockPage(params);
		return {
			...res,
			msg: res.msg || 'success',
		};
	},
	createdIsNeed: true,
	loading: false,
	dataList: [],
	ascs: [],
	descs: [],
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
		await getCentralStockExport({
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
</script>

<style lang="scss" scoped></style>
