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
		>
			<template #left-tool>
				<el-button
					type="primary"
					class="ml10"
					@click="openDialog('audit')"
					v-auth="`${moduleKey}_audit`"
					>{{ t('审核') }}
				</el-button>
				<el-button
					class="ml10"
					@click="openDialog('pay')"
					v-auth="`${moduleKey}_pay`"
					>{{ t('付款') }}
				</el-button>
				<el-button
					class="ml10"
					@click="handleInvalidate()"
					v-auth="`${moduleKey}_invalidate`"
					>{{ t('作废') }}
				</el-button>
			</template>
			<template #action="{ row }">
				<el-button
					text
					type="primary"
					@click="openDialog('audit', row)"
					v-auth="`${moduleKey}_audit`"
					>{{ t('审核') }}
				</el-button>
				<el-button
					text
					type="primary"
					@click="openDialog('pay', row)"
					v-auth="`${moduleKey}_pay`"
					>{{ t('付款') }}
				</el-button>
				<el-button
					text
					type="primary"
					@click="handleInvalidate(row)"
					v-auth="`${moduleKey}_invalidate`"
					>{{ t('作废') }}
				</el-button>
				<el-button
					text
					type="primary"
					@click="openDialog('log', row)"
					v-auth="`${moduleKey}_log`"
					>{{ t('日志') }}
				</el-button>
			</template>
		</BaseTable>

		<!-- 审核弹窗 -->
		<AuditDialog ref="auditDialogRef" @confirm="handleAuditConfirm" />

		<!-- 付款弹窗 -->
		<PayDialog ref="payDialogRef" @confirm="handlePayConfirm" />
		<!-- 日志对话框 -->
		<LogDialog
			v-model="logDialogVisible"
			:id="currentRow.id"
			:biz-type="['APPLY_ORDER']"
			:showSearchForm="false"
			:showToolBar="false"
			@closeDialog="
				() => {
					logDialogVisible = false;
				}
			"
		/>
	</div>
</template>

<script setup lang="ts">
import { auth } from '/@/utils/authFunction';
import {
	BasicTableProps,
	useTable,
} from '/@/components/BaseTable/hooks/BaseTable';
import { useI18n } from 'vue-i18n';
import { defineAsyncComponent, ref, reactive } from 'vue';
import { useMessage } from '/@/hooks/message';
import { ElMessageBox, ElNotification } from 'element-plus';
import { columns, moduleKey, searchConfig, listApi } from './config/index';

// 付款
const PayDialog = defineAsyncComponent(
	() => import('./components/PayDialog.vue')
);

// 审核
const AuditDialog = defineAsyncComponent(
	() => import('./components/AuditDialog.vue')
);

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
const SelectInputApi = defineAsyncComponent(
	() => import('/@/componentsApi/SelectInputApi/index.vue')
);
const TreeSelectInputApi = defineAsyncComponent(
	() => import('/@/componentsApi/TreeSelectInputApi/index.vue')
);
const LogDialog = defineAsyncComponent(
	() => import('/@/components/log/log-dialog.vue')
);

const baseTableRef = ref();
const { t } = useI18n();
const showSearch = ref(true);

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
	ascs: [],
	// descsDefault: ['application_date'],
});

const { register, getDataList } = useTable(state, baseTableRef);

const componentMap: any = {
	customCascaderApi,
	SelectInput,
	SelectDate,
	SelectInputApi,
	TreeSelectInputApi,
};

// 弹窗 ref
const auditDialogRef = ref();
const payDialogRef = ref();
const logDialogVisible = ref(false);

// 当前操作的数据行（弹窗提交时使用）
const currentRows = ref<any[]>([]);
// 当前单条操作行（日志等单条场景使用）
const currentRow = ref<any>({});

/**
 * 各弹窗的状态校验配置（可选）
 * 不需要校验的弹窗类型不在此配置
 */
type DialogType = 'audit' | 'pay' | 'log';

const dialogValidationMap: Partial<
	Record<DialogType, { check: (row: any) => boolean; message: string }>
> = {
	audit: {
		check: (row) => row.applicationStatus !== '0',
		message: '只能选择待审核状态的申请单',
	},
	pay: {
		check: (row) => row.applicationStatus !== '1',
		message: '只能选择已审核状态的申请单',
	},
};

/**
 * 统一弹窗入口
 * - 不传 row：批量模式，取勾选数据
 * - 传 row：单条模式
 *
 * @param type  弹窗类型
 * @param row   单条操作时传入的行数据（可选）
 */
const openDialog = async (type: DialogType, row?: any) => {
	const selectRows: any[] = row
		? [row]
		: register.tableRef.value?.getCheckboxRecords() || [];

	if (selectRows.length === 0) {
		useMessage().error('请至少选择一条数据');
		return;
	}

	// 有校验配置则执行，没有则跳过
	const validation = dialogValidationMap[type];
	if (validation && selectRows.some(validation.check)) {
		useMessage().error(validation.message);
		return;
	}

	// 保存当前操作行，供确认回调使用
	currentRows.value = selectRows;
	currentRow.value = selectRows[0];

	if (type === 'audit') {
		const ids = selectRows.map((r: any) => r.id);
		let slowTimer: ReturnType<typeof setTimeout> | null = null;
		let slowNotify: any = null;

		try {
			register.state.loading = true;
			// 当请求耗时超过 30s 时触发
			slowTimer = setTimeout(() => {
				slowNotify = ElNotification({
					title: '提示',
					message: '审核单据较多，请耐心等待',
					type: 'warning',
					duration: 0,
				});
			}, 30000);

			const res: any = await listApi.getAuditDetail({ ids });
			auditDialogRef.value?.open(res?.data);
		} catch (error: any) {
			useMessage().error(error?.msg || '获取审核数据失败');
		} finally {
			clearTimeout(slowTimer!);
			slowNotify?.close();
			register.state.loading = false;
		}
	} else if (type === 'pay') {
		payDialogRef.value?.open();
	} else if (type === 'log') {
		logDialogVisible.value = true;
	}
};

const resetQuery = () => {
	register.state.queryForm = {};
	getDataList();
};

const handleExport = async () => {
	try {
		const selectedIds = register?.getSelectedIds() || [];
		register.state.loading = true;
		const res: any = await listApi.exportList({
			...register.state.queryForm,
			ascs: register.state?.ascs,
			descs: register.state?.descs,
			ids: selectedIds || [],
			current: 1,
			size: 1000,
		});
		// 接口返回下载地址，直接在新标签页打开
		const url = res?.data;
		if (url) {
			window.open(url, '_blank');
		} else {
			useMessage().error('导出失败，未获取到下载地址');
		}
	} catch (error) {
		useMessage().error(t(error as string));
	} finally {
		register.state.loading = false;
	}
};

/**
 * 审核确认回调
 */
const handleAuditConfirm = async (passed: boolean, remark: string) => {
	try {
		register.state.loading = true;
		await listApi.auditList({
			queryDto: currentRows.value,
			auditPassed: passed ? 1 : 2,
			remark,
		});
		useMessage().success('审核成功');
		register?.getDataList();
	} catch (error: any) {
		useMessage().error(error?.msg || '审核失败');
	} finally {
		register.state.loading = false;
	}
};

/**
 * 付款确认回调
 */
const handlePayConfirm = async (formData: any) => {
	try {
		register.state.loading = true;
		await listApi.payList({
			queryDto: currentRows.value,
			...formData,
		});
		useMessage().success('付款成功');
		register?.getDataList();
	} catch (error: any) {
		useMessage().error(error?.msg || '付款失败');
	} finally {
		register.state.loading = false;
	}
};

/**
 * 作废（单条 or 批量）
 * - 不传 row：批量模式
 * - 传 row：单条模式
 */
const handleInvalidate = async (row?: any) => {
	const selectRows: any[] = row
		? [row]
		: register.tableRef.value?.getCheckboxRecords() || [];

	if (selectRows.length === 0) {
		useMessage().error('请至少选择一条数据');
		return;
	}

	// 状态限制：只能作废未审核（0）或已驳回（2）的申请单
	if (
		selectRows.some(
			(r) => r.applicationStatus !== '0' && r.applicationStatus !== '2'
		)
	) {
		useMessage().error('只能作废未审核或已驳回状态的申请单');
		return;
	}

	try {
		await ElMessageBox.confirm(
			selectRows.length === 1
				? '确认作废该申请单吗？'
				: `确认作废选中的 ${selectRows.length} 条申请单吗？`,
			'提示',
			{ confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }
		);

		register.state.loading = true;
		await listApi.invalidateList({ ids: selectRows.map((r) => r.id) });
		useMessage().success('作废成功');
		register?.getDataList();
	} catch (error: any) {
		if (error !== 'cancel') {
			useMessage().error(error?.msg || '作废失败');
		}
	} finally {
		register.state.loading = false;
	}
};
</script>

<style lang="scss" scoped></style>
