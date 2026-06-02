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
					<el-button
						type="primary"
						class="ml10"
						v-auth="`${moduleKey}_request`"
						@click="handleConfirmRequest()"
					>
						{{ $t('请款') }}
					</el-button>
					<el-button
						class="ml10"
						v-auth="`${moduleKey}_discard`"
						@click="handleDiscard()"
					>
						{{ $t('作废') }}
					</el-button>
				</template>

				<!-- 附件展示 -->
				<template #attachmentUrls="{ row }">
					<span v-if="row.attachmentUrls">{{ row.attachmentUrls }}</span>
					<span v-else>-</span>
				</template>

				<!-- 操作栏 -->
				<template #action="{ row }">
					<el-button
						type="primary"
						link
						v-auth="`${moduleKey}_request`"
						@click="handleConfirmRequest(row)"
					>
						{{ $t('请款') }}
					</el-button>
					<el-button
						type="primary"
						link
						v-auth="`${moduleKey}_discard`"
						@click="handleDiscard(row)"
					>
						{{ $t('作废') }}
					</el-button>
					<el-button
						type="primary"
						link
						v-auth="`${moduleKey}_log`"
						@click="openLog(row)"
					>
						{{ $t('日志') }}
					</el-button>
				</template>
			</BaseTable>

			<!-- 请款弹窗：接口在弹窗内部处理，成功后 emit success 刷新列表 -->
			<RequestDialog
				v-model="requestDialogVisible"
				:rows="requestDialogRows"
				@success="register?.getDataList"
			/>

			<!-- 日志弹窗 -->
			<LogDialog
				v-model="logDialogVisible"
				:id="currentRow.id"
				:biz-type="['LOGISTICS_PAYMENT_REQUEST_POOL']"
				:showSearchForm="false"
				:showToolBar="false"
				@closeDialog="logDialogVisible = false"
			/>
		</div>
	</div>
</template>

<script setup lang="ts">
import { auth } from '/@/utils/authFunction';
import {
	BasicTableProps,
	useTable,
} from '/@/components/BaseTable/hooks/BaseTable';
import { defineAsyncComponent, ref, reactive } from 'vue';
import { useMessage } from '/@/hooks/message';
import { ElMessageBox } from 'element-plus';
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
const customCascaderApi = defineAsyncComponent(
	() => import('/@/componentsApi/customCascaderApi/index.vue')
);
const TreeSelectInputApi = defineAsyncComponent(
	() => import('/@/componentsApi/TreeSelectInputApi/index.vue')
);
const RequestDialog = defineAsyncComponent(
	() => import('./components/RequestDialog.vue')
);
const LogDialog = defineAsyncComponent(
	() => import('/@/components/log/log-dialog.vue')
);

const message = useMessage();
const baseTableRef = ref();
const showSearch = ref(true);
const requestDialogVisible = ref(false);
const requestDialogRows = ref<any[]>([]);
const logDialogVisible = ref(false);
const currentRow = ref<any>({});

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
});

const { register } = useTable(state, baseTableRef);

const componentMap: any = {
	customCascaderApi,
	TreeSelectInputApi,
	SelectInput,
	SelectDate,
};

const resetQuery = () => {
	register.state.queryForm = {};
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
			size: 1000,
		});
	} finally {
		register.state.loading = false;
	}
};

/** 请款（单条 or 批量） */
const handleConfirmRequest = (row?: any) => {
	const selectRows: any[] = row
		? [row]
		: register.tableRef.value?.getCheckboxRecords() || [];

	if (selectRows.length === 0) {
		message.warning('请至少选择一条数据');
		return;
	}

	if (selectRows.some((r) => r.paymentStatus !== 0)) {
		message.warning('只能对未请款状态的记录进行请款操作');
		return;
	}

	requestDialogRows.value = selectRows;
	requestDialogVisible.value = true;
};

/** 作废（单条 or 批量） */
const handleDiscard = async (row?: any) => {
	const selectRows: any[] = row
		? [row]
		: register.tableRef.value?.getCheckboxRecords() || [];

	if (selectRows.length === 0) {
		message.warning('请至少选择一条数据');
		return;
	}

	try {
		await ElMessageBox.confirm(
			selectRows.length === 1
				? '确认作废该请款单吗？'
				: `确认作废选中的 ${selectRows.length} 条请款单吗？`,
			'提示',
			{ confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }
		);

		register.state.loading = true;
		const res = await listApi.discardList({ ids: selectRows.map((r) => r.id) });
		if (res?.code === 0) {
			message.success('作废成功');
			register?.getDataList();
		}
	} catch (error: any) {
		if (error !== 'cancel') {
			message.error(error?.msg || '作废失败');
		}
	} finally {
		register.state.loading = false;
	}
};

/** 打开日志 */
const openLog = (row: any) => {
	currentRow.value = row;
	logDialogVisible.value = true;
};
</script>

<style lang="scss" scoped></style>
