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
			:rowConfig="{ keyField: 'id' }"
			@checkbox-change="handleCheckboxChange"
		>
			<template #left-tool>
				<el-button
					type="primary"
					class="ml10"
					v-auth="`${notModuleKey}_generate`"
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
import { moduleKey as notModuleKey } from '../notGeneratedOrder/config/index';
import { useResultDialog } from '/@/hooks/useResultDialog';
import { confirmGenerateKdBill } from '/@/views/integrations/components/indexConfig';

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
	queryForm: { pushState: 3 },
	pageList: listApi.getList,
	columns,
	toolBarConfig: {
		handleRefresh: () => register?.getDataList(),
		handleExport: () => handleExport(),
		isShowExport: auth(`${moduleKey}_export`),
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

// 防止联动勾选时递归触发
let isSyncing = false;

/**
 * 勾选/取消勾选时，按"调拨单号 + 费用类型名称"维度联动当前页同组数据
 */
const handleCheckboxChange = (params: any) => {
	if (isSyncing) return;
	const { row, checked } = params;
	const allData: any[] = register.state.dataList || [];
	const sameGroupRows = allData.filter(
		(item) =>
			item.transferNo === row.transferNo && item.feeItemId === row.feeItemId
	);
	if (sameGroupRows.length <= 1) return;
	const vxeTable = baseTableRef.value?.tableRef;
	if (!vxeTable) return;
	isSyncing = true;
	sameGroupRows.forEach((item) => {
		vxeTable.setCheckboxRow(item, checked);
	});
	isSyncing = false;
};

const resetQuery = () => {
	register.state.queryForm = { pushState: 3 };
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
		useMessage().error(t(error as string));
	} finally {
		register.state.loading = false;
	}
};

onMounted(() => {});

const generateKdBill = async () => {
	try {
		// 获取勾选行，没有勾选则取当前页全部数据
		const selectedRows =
			baseTableRef.value?.tableRef?.getCheckboxRecords() || [];
		const selectedIds = register?.getSelectedIds() || [];
		const targetRows: any[] =
			selectedRows.length > 0 ? selectedRows : register.state.dataList || [];

		await confirmGenerateKdBill(targetRows.map((r: any) => r.id));

		let selectedList;
		const query = {
			...register.state.queryForm,
			ascs: register.state?.ascs,
			descs: register.state?.descs,
			ids: selectedIds || [],
			current: 1,
			size: 10000,
		};
		if (selectedRows.length) {
			// 按 transferNo + feeItemId 分组，每组只取第一条
			const seen = new Set<string>();
			selectedList = targetRows
				.filter((row: any) => {
					const key = `${row.transferNo}_${row.feeItemId}`;
					if (seen.has(key)) return false;
					seen.add(key);
					return true;
				})
				.map((row: any) => ({
					transferNo: row.transferNo,
					feeItemId: row.feeItemId,
					entryTime: row.entryTime,
				}));
		}
		register.state.loading = true;
		const res: any = await listApi.generateList({
			selectedList,
			query,
		});
		if (res.code === 0) {
			if (res.data?.failCount > 0) {
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
