<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-row v-show="showSearch" class="ml10">
				<el-form
					ref="queryRef"
					:inline="true"
					:model="register.state.queryForm"
					@keyup.enter="register?.getDataList"
				>
					<AdvancedSearchStyle
						ref="AdvancedSearchStyleRef"
						showRightBtn
						@reset="resetQuery"
						@search="register?.getDataList"
					>
						<template #default>
							<el-form-item v-for="(item, index) in searchConfig" :key="index">
								<component
									:is="componentMap[item.component]"
									:ref="
										item.component === 'SelectDate'
											? setSelectDateRef
											: undefined
									"
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

			<BaseTable ref="baseTableRef" :register="register" />
		</div>
	</div>
</template>

<script setup lang="ts">
import {
	BasicTableProps,
	useTable,
} from '/@/components/BaseTable/hooks/BaseTable';
import { defineAsyncComponent, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useMessage } from '/@/hooks/message';
import { auth } from '/@/utils/authFunction';

import { columns, listApi, moduleKey, searchConfig } from './config/index';

const { t } = useI18n();
const message = useMessage();

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
const queryRef = ref();
const AdvancedSearchStyleRef = ref();
const showSearch = ref(true);

// SelectDate 组件实例
const selectDateRef = ref<any>(null);

// 设置 SelectDate 组件 ref
const setSelectDateRef = (el: any) => {
	if (el) {
		selectDateRef.value = el;
	}
};

const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {}, // SelectDate 组件会在 setup 阶段自动初始化
	pageList: listApi.getList,
	columns,
	descsDefault: ['warehouse_name'],
	toolBarConfig: {
		handleRefresh: () => register?.getDataList(),
		handleExport: () => handleExport(),
		isShowExport: auth(`${moduleKey}_export`),
		settingKey: `${moduleKey}_index`,
	},
	pagination: {
		size: 10000,
		pageSizes: [10, 20, 50, 100, 200, 500, 1000],
	},
});

const { register } = useTable(state, baseTableRef);

const componentMap: any = {
	customCascaderApi,
	TreeSelectInputApi,
	SelectInput,
	SelectDate,
};

const resetQuery = () => {
	// 清空所有查询条件（保持对象引用，只删除属性）
	Object.keys(register.state.queryForm).forEach((key) => {
		delete register.state.queryForm[key];
	});

	// 调用 SelectDate 组件的重置方法（恢复默认日期）
	selectDateRef.value?.resetToDefault?.();

	register?.getDataList();
};

const handleExport = async () => {
	try {
		const selectedIds = register?.getSelectedIds() || [];
		register.state.loading = true;
		await listApi.exportList({
			...register.state.queryForm,
			ascs: register.state?.ascs,
			descs: register.state?.descs,
			ids: selectedIds || [],
		});
	} catch (error) {
		message.error(t(error as string));
	} finally {
		register.state.loading = false;
	}
};
</script>
