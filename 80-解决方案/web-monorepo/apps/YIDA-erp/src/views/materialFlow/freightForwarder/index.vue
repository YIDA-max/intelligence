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
					<el-form-item>
						<div class="flex item-center">
							<SelectInput
								v-model:queryForm="state.queryForm"
								:searchTypes="[{ label: '货代名称', value: 'forwarderNames' }]"
								:getDataList="getDataList"
							/>
						</div>
					</el-form-item>
					<el-form-item>
						<div class="flex item-center">
							<SelectInput
								v-model:queryForm="state.queryForm"
								:searchTypes="[{ label: '编号', value: 'forwarderCodes' }]"
								:getDataList="getDataList"
							/>
						</div>
					</el-form-item>
					<el-form-item>
						<TreeSelectInputApi
							componentType="dicts"
							text="货代类型"
							code="forwarderTypes"
							v-model:queryForm="state.queryForm"
							:searchFn="getDataList"
							:settings="{
								text: '货代类型',
								width: '220px',
								getTreeDataParams: 'forwarder_type',
							}"
						/>
						<!-- <el-select
							collapse-tags
							:max-collapse-tags="1"
							clearable
							filterable
							multiple
							@change="getDataList"
							v-model="state.queryForm.forwarderTypes"
							placeholder="货代类型"
							style="width: 220px"
						>
							<el-option
								v-for="item in dictMap.forwarderTypesOptions"
								:key="item.id"
								:label="item.label"
								:value="item.value"
							/>
						</el-select> -->
					</el-form-item>
					<el-form-item>
						<el-select
							clearable
							@change="getDataList"
							v-model="state.queryForm.status"
							placeholder="状态"
						>
							<el-option
								v-for="item in [
									{ label: '启用', value: 1 },
									{ label: '禁用', value: 0 },
								]"
								:key="item.value"
								:label="item.label"
								:value="item.value"
							/>
						</el-select>
					</el-form-item>
					<el-form-item>
						<TreeSelectInputApi
							componentType="userList"
							text="我司对接人"
							code="selfPersonIds"
							v-model:queryForm="state.queryForm"
							:searchFn="getDataList"
							:settings="{
								text: '我司对接人',
								width: '220px',
								getTreeDataParams: {
									lockFlag: 0,
								},
							}"
						/>
						<!-- <el-select
							collapse-tags
							:max-collapse-tags="1"
							clearable
							filterable
							multiple
							@change="getDataList"
							v-model="state.queryForm.selfPersonIds"
							placeholder="我司对接人"
							style="width: 220px"
						>
							<el-option
								v-for="item in dictMap.productManageId"
								:key="item.userId"
								:label="item.name"
								:value="item.userId"
							/>
						</el-select> -->
					</el-form-item>
					<el-form-item>
						<TreeSelectInputApi
							componentType="userList"
							text="创建人"
							code="createIds"
							v-model:queryForm="state.queryForm"
							:searchFn="getDataList"
							:settings="{
								text: '创建人',
								width: '220px',
								getTreeDataParams: {
									lockFlag: 0,
								},
							}"
						/>
						<!-- <el-select
							collapse-tags
							:max-collapse-tags="1"
							clearable
							filterable
							multiple
							@change="getDataList"
							v-model="state.queryForm.createIds"
							placeholder="创建人"
							style="width: 220px"
						>
							<el-option
								v-for="item in dictMap.productManageId"
								:key="item.userId"
								:label="item.name"
								:value="item.userId"
							/>
						</el-select> -->
					</el-form-item>
					<el-form-item>
						<SelectDate
							v-model:queryForm="state.queryForm"
							:settings="{
								selectStyle: { width: '130px' },
								dateStyle: { width: '130px' },
							}"
							:searchTypes="[
								{
									label: '更新时间',
									value: 'updateTime',
									isAddHMS: false,
									dateStart: 'updateTimeStart',
									dateEnd: 'updateTimeEnd',
								},
							]"
							:getDataList="getDataList"
						/>
					</el-form-item>
					<el-form-item>
						<el-button @click="getDataList" type="primary">{{
							$t('搜索')
						}}</el-button>
						<el-button @click="resetQuery" type="info" plain>{{
							$t('common.resetBtn')
						}}</el-button>
					</el-form-item>
				</el-form>
			</el-row>

			<BaseTable
				:register="register"
				ref="baseTableRef"
				:tableAttrs="tableAttrs"
			>
				<template #left-tool>
					<el-button
						class="ml10"
						@click="openDialog('add')"
						v-auth="'freightForwarder_add'"
					>
						{{ $t('添加') }}
					</el-button>
					<el-button
						class="ml10"
						@click="openDialog('import')"
						v-auth="'freightForwarder_import'"
					>
						{{ $t('导入') }}
					</el-button>
					<el-button
						class="ml10"
						@click="openDialog('enable')"
						v-auth="'freightForwarder_enable'"
					>
						{{ $t('批量启用') }}
					</el-button>
					<el-button
						class="ml10"
						@click="openDialog('disable')"
						v-auth="'freightForwarder_disable'"
					>
						{{ $t('批量禁用') }}
					</el-button>
				</template>
				<template #forwarderType="{ row }">
					{{ row.forwarderTypeName || '---' }}
				</template>
				<template #selfPersonId="{ row }">
					{{ row.selfPersonName || '---' }}
				</template>
				<!-- 状态列 -->
				<template #statusText="{ row }">
					{{ row.status === 1 ? '启用' : '禁用' }}
				</template>

				<!-- 附件列 -->
				<template #attachmentUrlsCustom="{ row }">
					<el-tooltip
						v-if="row.attachmentUrls?.length"
						placement="top"
						effect="dark"
					>
						<!-- tooltip 展示全部 -->
						<template #content>
							<div v-for="(value, index) in row.attachmentUrls" :key="value">
								<el-link :href="value" target="_blank" type="primary">
									{{ row.attachmentOriginalName[index] || '---' }}
								</el-link>
							</div>
						</template>

						<!-- 表格里只显示前2个（竖排） -->
						<div class="attachment-list">
							<div
								v-for="(value, index) in row.attachmentUrls.slice(0, 2)"
								:key="value"
								class="attachment-item"
							>
								<el-link :href="value" target="_blank" type="primary">
									{{ row.attachmentOriginalName[index] || '---' }}
								</el-link>
							</div>

							<!-- 超出提示 -->
							<div v-if="row.attachmentUrls.length > 2" class="more">...</div>
						</div>
					</el-tooltip>

					<template v-else>---</template>
				</template>

				<!-- 操作列 -->
				<template #action="{ row }">
					<div class="flex items-center">
						<el-button
							text
							type="primary"
							class="mr20"
							@click="openDialog('edit', row)"
							v-auth="'freightForwarder_edit'"
							>{{ $t('编辑') }}</el-button
						>
						<el-button
							text
							type="primary"
							class="mr20"
							@click="openLog(row)"
							v-auth="'freightForwarder_log'"
							>{{ $t('日志') }}</el-button
						>
					</div>
				</template>
			</BaseTable>
		</div>

		<!-- 编辑、新增 -->
		<FormDialog
			ref="formDialog"
			:rowData="currentRow"
			:title="addDialogTitle"
			:dictMap="dictMap"
			@save="getDataList"
		/>
		<!-- 导入货代信息 -->
		<ImportDialog
			ref="importDialogRef"
			title="导入货代"
			templateUrl="/files/import-template/货代管理导入模板.xlsx"
			excelUploadApi="/mcp/freightForwarder/import"
			@refreshDataList="getDataList"
		/>
		<LogDialog
			v-model="logDialogVisible"
			:id="currentRow.id"
			:biz-type="['FREIGHT_FORWARDER']"
			:showSearchForm="false"
			:showToolBar="false"
			@closeDialog="logDialogVisible = false"
		/>
	</div>
</template>

<script setup lang="ts">
import {
	BasicTableProps,
	useTable,
} from '/@/components/BaseTable/hooks/BaseTable';
import { getColumns } from './config/index';
import { useI18n } from 'vue-i18n';
import { defineAsyncComponent, ref, reactive } from 'vue';
import { useMultipleDicts } from '/@/hooks/multipleDicts';
import { getDicts } from '/@/api/admin/dict';
import { getUserListByCondition } from '/@/api/admin/user';
import { useMessage, useMessageBox } from '/@/hooks/message';
import {
	getFreightForwarderPage,
	freightForwarDerdetails,
	enableFreightForwarDer,
	disableFreightForwarDer,
	exportFreightForwarDer,
} from '/@/api/materialFlow/freightForwarder/index';
import { useResultDialog } from '/@/hooks/useResultDialog';
import { auth } from '/@/utils/authFunction';

const SelectDate = defineAsyncComponent(
	() => import('/@/components/TableFormModule/select-date.vue')
);
const SelectInput = defineAsyncComponent(
	() => import('/@/components/TableFormModule/select-input.vue')
);
const FormDialog = defineAsyncComponent(
	() => import('./components/form-dialog.vue')
);
const LogDialog = defineAsyncComponent(
	() => import('/@/components/log/log-dialog.vue')
);
const ImportDialog = defineAsyncComponent(
	() => import('/@/components/fileUpload/importDialog.vue')
);

const TreeSelectInputApi = defineAsyncComponent(
	() => import('/@/componentsApi/TreeSelectInputApi/index.vue')
);

const { t } = useI18n();
const { open } = useResultDialog();

const baseTableRef = ref();
const queryRef = ref();
const showSearch = ref(true);
const currentRow = ref<any>({ id: '' });
const logDialogVisible = ref(false);
const formDialog = ref();
const importDialogRef = ref();
const addDialogTitle = ref('');

const { dictMap } = useMultipleDicts(
	[
		{
			key: 'forwarderTypesOptions',
			fetchFn: getDicts,
			params: 'forwarder_type',
		},
		{
			key: 'productManageId',
			fetchFn: getUserListByCondition,
			params: { lockFlag: 0 },
		},
	],
	{ isAuto: true }
);

const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {},
	pageList: getFreightForwarderPage as (params?: any) => Promise<any>,
	columns: getColumns(),
	toolBarConfig: {
		handleRefresh: () => getDataList(),
		handleExport: () => exportPartFn(),
		isShowExport: auth('freightForwarder_export'),
		settingKey: 'freightForwarder',
	},
	descs: ['update_time'],
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
const { register, getDataList } = useTable(state, baseTableRef);

const resetQuery = () => {
	state.queryForm = {
		current: 1,
		size: 10,
	};
	getDataList();
};

const openDialog = async (type: string, row?: any) => {
	if (type === 'add') {
		currentRow.value = { id: '' };
		addDialogTitle.value = '添加货代';
		formDialog.value.handleOpen(currentRow.value);
	} else if (type === 'edit') {
		const res = await freightForwarDerdetails({ id: row.id });
		if (res.code !== 0) return;
		currentRow.value = { ...res.data };
		addDialogTitle.value = '编辑货代';
		formDialog.value.handleOpen(currentRow.value);
	} else if (type === 'import') {
		importDialogRef.value.show();
	} else if (type === 'enable' || type === 'disable') {
		const ids = register?.getSelectedIds();
		if (ids.length === 0) {
			useMessage().warning(t('请至少选择一条数据'));
			return;
		}
		const isEnable = type === 'enable';
		await useMessageBox()
			.confirm(
				t(isEnable ? '是否确认启用选中数据？' : '是否确认禁用选中数据？')
			)
			.then(async () => {
				const res = isEnable
					? await enableFreightForwarDer({ ids })
					: await disableFreightForwarDer({ ids });
				if (res?.data?.failCount > 0) {
					open({ title: t('错误提示'), data: res.data });
				} else if (res.code === 0) {
					useMessage().success(t(isEnable ? '启用成功' : '禁用成功'));
				}
				register.tableRef.value?.clearCheckboxRow();
				getDataList();
			})
			.catch(() => {});
	}
};

const openLog = (row: any) => {
	currentRow.value = row;
	logDialogVisible.value = true;
};

const exportPartFn = async () => {
	try {
		const ids = register?.getSelectedIds();
		state.loading = true;
		await exportFreightForwarDer({
			...state.queryForm,
			ascs: state?.ascs,
			descs: state?.descs,
			ids: ids.length > 0 ? ids : [],
			current: 1,
			size: 10000,
		});
	} catch (error) {
		useMessage().error(t(error as string));
	} finally {
		state.loading = false;
	}
};
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
.attachment-list {
	display: flex;
	flex-direction: column;
	gap: 2px;
}

.attachment-item {
	line-height: 1.2;
}

.more {
	color: #999;
	font-size: 12px;
}
</style>
