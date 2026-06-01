<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-row v-show="showSearch" class="ml10">
				<el-form
					ref="queryRef"
					:inline="true"
					:model="register.state.queryForm"
					@keyup.enter="getDataList"
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
				ref="baseTableRef"
				:register="register"
				:rowConfig="{ keyField: 'id' }"
			>
				<template #left-tool>
					<!-- <el-button
						type="primary"
						class="ml10"
						v-auth="`${moduleKey}_updata`"
						@click="generateKdBill"
					>
						{{ $t('更新货件信息') }}
					</el-button> -->
				</template>

				<template #matchStatus="{ row }">
					{{ row.matchStatus === 1 ? '已匹配' : '未匹配' }}
				</template>

				<template #receiveQuantity="{ row }">
					<span
						:class="
							row.matchStatus === 1
								? 'text-blue-500 cursor-pointer hover:underline'
								: ''
						"
						@click="showReceiveDetail(row)"
					>
						{{ row.receiveQuantity }}
					</span>
				</template>

				<template #diffQuantity="{ row }">
					<span
						:class="{
							'text-gray-500': row.diffQuantity === 0,
							'text-red-500': row.diffQuantity < 0,
							'text-green-500': row.diffQuantity > 0,
						}"
					>
						{{
							row.diffQuantity === 0
								? row.diffQuantity
								: row.diffQuantity > 0
								? `+${row.diffQuantity}`
								: row.diffQuantity
						}}
					</span>
				</template>

				<template #action="{ row }">
					<el-button
						v-if="canHandleDiff(row)"
						link
						type="primary"
						@click="openHandleDiffDialog(row)"
					>
						处理收发差异
					</el-button>
					<logBtn
						:row="row"
						:bizType="['SHIPMENT_DIFF']"
						showType=""
						v-auth="`${moduleKey}-log`"
					></logBtn>
				</template>
			</BaseTable>

			<ReceiveDetailDialog
				v-model="receiveDetailVisible"
				:rowData="currentReceiveRow"
			/>

			<HandleDiffDialog
				v-model="handleDiffVisible"
				:rowData="currentHandleRow"
				@success="handleDiffSuccess"
			/>
		</div>
	</div>
</template>

<script setup lang="ts">
import {
	BasicTableProps,
	useTable,
} from '/@/components/BaseTable/hooks/BaseTable';
import logBtn from '/@/components/log/log-btn.vue';
import { defineAsyncComponent, onMounted, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useMessage } from '/@/hooks/message';
import { auth } from '/@/utils/authFunction';
import ReceiveDetailDialog from './components/ReceiveDetailDialog.vue';
import HandleDiffDialog from './components/HandleDiffDialog.vue';
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
const showSearch = ref(true);
const receiveDetailVisible = ref(false);
const handleDiffVisible = ref(false);
const currentHandleRow = ref<any>(null);
const currentReceiveRow = ref<any>(null);

const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {},
	pageList: listApi.getList,
	columns,
	toolBarConfig: {
		handleRefresh: () => register?.getDataList(),
		handleExport: () => handleExport(),
		isShowExport: auth(`${moduleKey}_export`),
		settingKey: `${moduleKey}_index`,
	},
	descsDefault: ['create_time'],
	ascs: [],
});

const { register, getDataList } = useTable(state, baseTableRef);

const componentMap: any = {
	customCascaderApi,
	TreeSelectInputApi,
	SelectInput,
	SelectDate,
};

const resetQuery = () => {
	register.state.queryForm = {};
	getDataList();
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

onMounted(() => {});

const showReceiveDetail = (row: any) => {
	if (row.matchStatus !== 1) return;
	currentReceiveRow.value = row;
	receiveDetailVisible.value = true;
};

const canHandleDiff = (row: any) => {
	return (
		[0, 1].includes(Number(row?.handledDiffStatusCode)) &&
		Number(row?.diffQuantity) !== 0
	);
};

const openHandleDiffDialog = (row: any) => {
	currentHandleRow.value = row;
	handleDiffVisible.value = true;
};

const handleDiffSuccess = () => {
	register?.getDataList();
};

// const generateKdBill = async () => {
// 	try {
// 		const selectedIds = register?.getSelectedIds() || [];
// 		register.state.loading = true;

// 		const res = await listApi.generateList({
// 			...register.state.queryForm,
// 			ascs: register.state?.ascs,
// 			descs: register.state?.descs,
// 			ids: selectedIds || [],
// 			current: 1,
// 			size: 10000,
// 		});

// 		if (res.code === 0) {
// 			if (res.data?.failCount > 0) {
// 				open({
// 					title: t('更新货件信息失败'),
// 					data: res.data,
// 				});
// 			} else {
// 				message.success('操作成功');
// 			}
// 			register?.getDataList();
// 		}
// 	} catch (error: any) {
// 		if (error.message !== 'cancelled') {
// 			message.error(error?.msg || t('错误'));
// 		}
// 	} finally {
// 		emit('refresh-failed-count');
// 		register.state.loading = false;
// 	}
// };
</script>

<style lang="scss" scoped>
@import '/@/views/integrations/components/indexList.scss';
</style>
