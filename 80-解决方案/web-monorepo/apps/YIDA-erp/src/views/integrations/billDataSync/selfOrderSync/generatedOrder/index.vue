<template>
	<div>
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
							<!-- SelectInputApi 使用 v-model 绑定单个字段，change 后触发列表刷新 -->
							<component
								v-if="item.component === 'SelectInputApi'"
								:is="componentMap[item.component]"
								v-model="register.state.queryForm[(item.props as any).code]"
								v-bind="item.props"
								:searchFn="register?.getDataList"
							/>
							<!-- 其他组件使用 v-model:queryForm -->
							<component
								v-else
								:is="componentMap[item.component]"
								v-model:queryForm="register.state.queryForm"
								v-bind="item.props"
								:searchFn="register?.getDataList"
								:getDataList="register?.getDataList"
							/>
						</el-form-item>
					</template>
				</AdvancedSearchStyle>
			</el-form>
		</el-row>
		<BaseTable :register="register" ref="baseTableRef">
			<template #left-tool> </template>
			<template #platformOrderNo="{ row }">
				<el-tag
					v-if="row.giftFlag === 1"
					type="success"
					size="small"
					class="ml-1"
					>赠</el-tag
				>
				<el-tag
					v-if="row.resendOrder === 1"
					type="warning"
					size="small"
					class="ml-1"
					>补</el-tag
				>
				{{ row.platformOrderNo }}
			</template>
			<template #orderTotalAmountCustom="{ row }">
				{{ getorderTotalAmountCustom(row) }}
			</template>
		</BaseTable>
	</div>
</template>

<script setup lang="ts">
import { auth } from '/@/utils/authFunction';
import {
	BasicTableProps,
	useTable,
} from '/@/components/BaseTable/hooks/BaseTable';
import { useI18n } from 'vue-i18n';
import { defineAsyncComponent, ref, reactive, onMounted } from 'vue';
import { useMessage } from '/@/hooks/message';

import { columns, moduleKey, searchConfig, listApi } from './config/index';

const SelectInput = defineAsyncComponent(
	() => import('/@/components/TableFormModule/select-input.vue')
);
const AdvancedSearchStyle = defineAsyncComponent(
	() => import('/@/components/TableFormModule/advanced-search-style.vue')
);

const SelectDate = defineAsyncComponent(
	() => import('/@/components/TableFormModule/select-date.vue')
);
const SelectInputApi = defineAsyncComponent(
	() => import('/@/componentsApi/SelectInputApi/index.vue')
);
const customCascaderApi = defineAsyncComponent(
	() => import('/@/componentsApi/customCascaderApi/index.vue')
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
const state: BasicTableProps = reactive<BasicTableProps>({
	// 0: 未生成，1: 已生成
	queryForm: { generateKingdeeDocStatuses: [1] },
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
	keyField: 'selfOrderKingdeeDocItemId',
	ascs: [],
	descsDefault: ['generate_kingdee_doc_time'],
	// descs: ['create_time'],
});
//  table hook
const { register, getDataList } = useTable(state, baseTableRef);

const componentMap: any = {
	customCascaderApi,
	TreeSelectInputApi,
	SelectInput,
	SelectDate,
	SelectInputApi,
};

// 重置
const resetQuery = () => {
	register.state.queryForm = {
		generateKingdeeDocStatuses: [1],
	};
	getDataList();
};

/***
 * 导出
 */
const handleExport = async () => {
	try {
		// 获取选中的行数据
		const selectedIds = register?.getSelectedIds() || [];
		// 显示加载状态
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
		// 隐藏加载状态
		register.state.loading = false;
	}
};
const getorderTotalAmountCustom = computed(() => (row: any) => {
	return row.sellingPrice * row.shippedQuantity;
});

onMounted(() => {
	// 初始加载仓库数据
});
</script>

<style lang="scss" scoped></style>
