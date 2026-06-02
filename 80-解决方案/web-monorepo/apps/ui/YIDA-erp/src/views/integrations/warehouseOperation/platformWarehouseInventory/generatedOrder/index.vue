<template>
	<div>
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

		<BaseTable
			ref="baseTableRef"
			:register="register"
			:rowConfig="{
				keyField: 'id',
			}"
		>
		</BaseTable>
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

const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {
		statuses: [1],
	},
	pageList: listApi.getList,
	columns,
	toolBarConfig: {
		handleRefresh: () => register?.getDataList(),
		handleExport: () => handleExport(),
		isShowExport: auth(`${moduleKey}_export`),
		settingKey: `${moduleKey}_index`,
	},
	descsDefault: ['generate_kingdee_doc_time'],
});

const { register } = useTable(state, baseTableRef);

const componentMap: any = {
	customCascaderApi,
	TreeSelectInputApi,
	SelectInput,
	SelectDate,
};

const resetQuery = () => {
	register.state.queryForm = {
		statuses: [1],
	};
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
			current: 1,
			size: 10000,
		});
	} catch (error) {
		message.error(t(error as string));
	} finally {
		register.state.loading = false;
	}
};
</script>

<style lang="scss" scoped></style>
