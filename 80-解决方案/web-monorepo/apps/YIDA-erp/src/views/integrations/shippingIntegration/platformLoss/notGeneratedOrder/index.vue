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
			:register="register"
			ref="baseTableRef"
			:rowConfig="{
				keyField: 'id',
			}"
		>
			<template #left-tool>
				<el-button
					type="primary"
					class="ml10"
					v-auth="`${moduleKey}_generate`"
					@click="generateKdBill"
					>{{ $t('生成金蝶单据') }}
				</el-button>
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
import { confirmGenerateKdBill } from '/@/views/integrations/components/indexConfig';

import { useResultDialog } from '/@/hooks/useResultDialog';

const { open } = useResultDialog();
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
const queryRef = ref();
const showSearch = ref(true);
const AdvancedSearchStyleRef = ref();
const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: { statuses: [0], billTypes: [0] },
	pageList: listApi.getList,
	columns,
	toolBarConfig: {
		isShowExport: auth(`${moduleKey}_export`),
		handleRefresh: () => {
			register?.getDataList();
		},
		handleExport: () => {
			handleExport();
		},
		settingKey: `${moduleKey}_index`,
	},
	ascs: [],
	descsDefault: ['create_time'],
});
const { register, getDataList } = useTable(state, baseTableRef);
const emit = defineEmits(['refresh-failed-count']);

const componentMap: any = {
	customCascaderApi,
	TreeSelectInputApi,
	SelectInput,
	SelectDate,
};

const resetQuery = () => {
	register.state.queryForm = {
		statuses: [0],
		billTypes: [0],
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

onMounted(() => {});

const generateKdBill = async () => {
	try {
		let selectedIds = register?.getSelectedIds() || [];

		await confirmGenerateKdBill(selectedIds);

		register.state.loading = true;

		const res = await listApi.generateList({
			...register.state.queryForm,
			ascs: register.state?.ascs,
			descs: register.state?.descs,
			ids: selectedIds || [],
			current: 1,
			size: 10000,
		});

		if (res.code === 0) {
			if (res.data?.failCount > 0) {
				emit('refresh-failed-count');

				open({
					title: t('生成金蝶单据失败'),
					data: res.data,
				});
			} else {
				useMessage().success('操作成功');
			}

			register?.getDataList();
		}
	} catch (error: any) {
		if (error.message !== 'cancelled') {
			useMessage().error(error?.msg || t('错误'));
		}
	} finally {
		emit('refresh-failed-count');
		register.state.loading = false;
	}
};
</script>

<style lang="scss" scoped>
@import '/@/views/integrations/components/indexList.scss';
</style>
