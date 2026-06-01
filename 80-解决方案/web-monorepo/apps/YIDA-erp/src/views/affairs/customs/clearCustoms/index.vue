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
								<el-select
									v-model="state.queryForm.processStatusList"
									collapse-tags
									:max-collapse-tags="1"
									clearable
									filterable
									multiple
									placeholder="清关状态"
									style="width: 200px"
									@change="getDataList"
								>
									<el-option
										v-for="item in [
											{
												label: '待处理',
												value: 1,
											},
											{
												label: '已处理',
												value: 2,
											},
										]"
										:key="item.value"
										:label="item.label"
										:value="item.value"
									/>
								</el-select>
							</el-form-item>
							<el-form-item>
								<TreeSelectInputApi
									componentType="basePort"
									v-model:queryForm="register.state.queryForm"
									placeholder="起始港"
									:settings="{
										text: '起始港',
										searchFn: getDataList,
										code: 'startPortCodeList',
										width: '220px',
									}"
								/>
							</el-form-item>
							<el-form-item>
								<TreeSelectInputApi
									componentType="basePort"
									v-model:queryForm="register.state.queryForm"
									placeholder="目的港"
									:settings="{
										text: '目的港',
										searchFn: getDataList,
										code: 'destPortCodeList',
										width: '220px',
									}"
								/>
							</el-form-item>
							<el-form-item>
								<TreeSelectInputApi
									componentType="country"
									v-model:queryForm="register.state.queryForm"
									placeholder="目的国"
									:settings="{
										text: '目的国',
										searchFn: getDataList,
										code: 'destCountryCodeList',
										width: '220px',
									}"
								/>
							</el-form-item>

							<el-form-item>
								<TreeSelectInputApi
									componentType="freightForwarder"
									v-model:queryForm="register.state.queryForm"
									placeholder="清关服务商"
									:settings="{
										text: '清关服务商',
										searchFn: getDataList,
										code: 'customsForwarderNoList',
										width: '220px',
										getTreeDataParams: {
											forwarderTypes: [3],
										},
										selectTreeProps: {
											value: 'forwarderCode',
											label: 'forwarderName',
										},
										getIdsCode: 'forwarderCode',
									}"
								/>
							</el-form-item>
							<el-form-item>
								<TreeSelectInputApi
									componentType="freightForwarder"
									v-model:queryForm="register.state.queryForm"
									placeholder="提货派送"
									:settings="{
										text: '提货派送',
										searchFn: getDataList,
										code: 'deliveryForwarderNoList',
										width: '220px',
										getTreeDataParams: {
											forwarderTypes: [4],
										},
										selectTreeProps: {
											value: 'forwarderCode',
											label: 'forwarderName',
										},
										getIdsCode: 'forwarderCode',
									}"
								/>
							</el-form-item>
							<el-form-item>
								<div>
									<SelectDate
										v-model:queryForm="state.queryForm"
										:settings="{
											selectStyle: {
												width: '130px',
											},
											dateStyle: {
												width: '130px',
											},
										}"
										:searchTypes="[
											{
												label: '创建时间',
												value: 'createdTime',
												isAddHMS: true,
												dateStart: 'createTimeStart',
												dateEnd: 'createTimeEnd',
											},
										]"
										:getDataList="getDataList"
									/>
								</div>
							</el-form-item>
							<el-form-item>
								<div class="flex item-center">
									<SelectInput
										v-model:queryForm="state.queryForm"
										:searchTypes="[
											{
												label: '订柜号',
												value: 'orderContainerNoList',
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
				<template #left-tool>
					<el-button
						class="ml10"
						type="primary"
						@click="openDialog('tag')"
						v-auth="'clearCustoms_tag'"
					>
						{{ $t('标记处理') }}</el-button
					>
					<el-dropdown
						class="ml10"
						split-button
						v-if="auths(['clearCustoms_exportfile', 'clearCustoms_exportList'])"
					>
						<span>{{ $t('导出') }}</span>
						<template #dropdown>
							<el-dropdown-menu>
								<el-dropdown-item
									@click="
										() => {
											handleExport('customsData');
										}
									"
									v-if="auth('clearCustoms_exportfile')"
									>清关资料</el-dropdown-item
								>
								<el-dropdown-item
									@click="
										() => {
											handleExport('listInfo');
										}
									"
									v-if="auth('clearCustoms_exportList')"
									>列表信息</el-dropdown-item
								>
							</el-dropdown-menu>
						</template>
					</el-dropdown>
				</template>
				<template #action="{ row }">
					<div class="flex items-start">
						<!-- 待处理才可操作 -->
						<el-button
							text
							type="primary"
							@click="openDialog('tag', row)"
							v-auth="'clearCustoms_tag'"
							:disabled="row.processStatus === '已处理'"
							>{{ $t('标记处理') }}
						</el-button>
						<el-button
							text
							type="primary"
							v-auth="'clearCustoms_log'"
							@click="openDialog('log', row)"
							>{{ $t('日志') }}
						</el-button>
					</div>
				</template>
			</BaseTable>
		</div>

		<!-- 日志 -->
		<LogDialog
			v-model="logDialogVisible"
			:id="currentRow.id"
			:biz-type="['CLEAR_CUSTOMS']"
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
import {
	BasicTableProps,
	useTable,
} from '/@/components/BaseTable/hooks/BaseTable';
import { useI18n } from 'vue-i18n';
import { defineAsyncComponent, ref, reactive } from 'vue';
import { useMessage } from '/@/hooks/message';
import { ElMessageBox } from 'element-plus';
import {
	getClearCustomsExport,
	getClearCustomsPage,
	postProcess2Processed,
	getClearCustomsExportTemplates,
} from '/@/api/affairs/customs/clearCustoms/index';
import { auth, auths } from '/@/utils/authFunction';
import { columns } from './config/index';

const SelectDate = defineAsyncComponent(
	() => import('/@/components/TableFormModule/select-date.vue')
);
const SelectInput = defineAsyncComponent(
	() => import('/@/components/TableFormModule/select-input.vue')
);
const AdvancedSearchStyle = defineAsyncComponent(
	() => import('/@/components/TableFormModule/advanced-search-style.vue')
);
const LogDialog = defineAsyncComponent(
	() => import('/@/components/log/log-dialog.vue')
);
const TreeSelectInputApi = defineAsyncComponent(
	() => import('/@/componentsApi/TreeSelectInputApi/index.vue')
);
// table的引用
const baseTableRef = ref();
//   初始化数据

const { t } = useI18n();

// 高级搜索布局的引用
const AdvancedSearchStyleRef = ref();

// 搜索变量
const queryRef = ref();
// 是否显示搜索
const showSearch = ref(true);
// 当前点击的行
const currentRow = ref({
	id: '',
});
// 日志对话框是否可见
const logDialogVisible = ref(false);
const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {},
	pageList: getClearCustomsPage as any,
	loading: false,
	dataList: [],
	columns,
	toolBarConfig: {
		handleRefresh: () => {
			getDataList();
		},
		isShowExport: false,
	},
	descs: ['create_time'],
});
const tableAttrs = {
	rowConfig: { keyField: 'id', isHover: true },
	cellConfig: { height: 60 },
	checkboxConfig: {
		reserve: true,
		highlight: true,
		trigger: 'row',
	},
	scrollY: {
		enabled: true,
		gt: 20,
		oSize: 6,
	},
};

const { register, getDataList } = useTable(state, baseTableRef);

// 重置
const resetQuery = async () => {
	// 重置时间组件的查询条件
	state.queryForm = {
		current: 1,
		size: 10,
		descs: ['create_time'],
	};
	getDataList();
};

// 打开对话框
const openDialog = async (type: string, row?: any) => {
	try {
		if (type === 'tag') {
			// 如果没有传row，则表示批量操作
			if (!row) {
				const ids = register?.getSelectedIds() || [];
				if (!ids || ids.length === 0) {
					useMessage().error(t('请至少选择一条数据'));
					return;
				}
				// 批量操作
				ElMessageBox({
					type: 'info',
					title: t('标记处理'),
					message: t('标记处理后，状态变为已处理，确定标记处理吗？'),
				}).then(async () => {
					const res = await postProcess2Processed(ids);
					if (res.code === 0) {
						useMessage().success('操作成功');
						// 清空选中行
						register?.safeCallTableMethod('clearCheckboxRow');
						getDataList();
					}
				});
			} else {
				// 单条操作
				if (!row || !row.id) {
					useMessage().warning(t('数据异常，请刷新页面重试'));
					return;
				}
				// 批量操作
				ElMessageBox({
					type: 'info',
					title: t('标记处理'),
					message: t('标记处理后，状态变为已处理，确定标记处理吗？'),
				}).then(async () => {
					const res = await postProcess2Processed([row.id]);
					if (res.code === 0) {
						useMessage().success('操作成功');
						getDataList();
					}
				});
			}
		} else if (type === 'log') {
			logDialogVisible.value = true;
			currentRow.value = row;
		}
	} catch (error: any) {
		useMessage().error(error?.msg || t('错误'));
	}
};

// 导出
const handleExport = async (type: 'customsData' | 'listInfo') => {
	try {
		const ids = register?.getSelectedIds() || [];
		let params = null;
		let api = null;
		// 如果是清关资料导出，且没有选择数据，则提示至少选择一条数据
		if (type === 'customsData' && (!ids || ids.length === 0)) {
			useMessage().warning(t('请至少选择一条数据'));
			return;
		}
		if (type === 'customsData') {
			api = getClearCustomsExportTemplates;
			params = register
				?.safeCallTableMethod('getCheckboxRecords')
				?.map((item: any) => {
					return {
						id: item.id,
						destCountryCode: item.destCountryCode,
						orderContainerNo: item.orderContainerNo,
						transportMethod: item.transportMethod,
						actualLoadingTime: item.actualLoadingTime,
						soNo: item.soNo,
						containerNo: item.containerNo,
						estimatedDepartureTime: item.estimatedDepartureTime,
					};
				});
		} else {
			api = getClearCustomsExport;
			params = {
				...state.queryForm,
				ascs: state?.ascs,
				descs: state?.descs,
				ids: ids || [],
				current: 1,
				size: 10000,
			};
		}
		// 显示加载状态
		state.loading = true;
		// 发送请求，设置 responseType 为 'blob' 以接收二进制流
		await api(params);
	} catch (error) {
		useMessage().error(t(error as string));
	} finally {
		// 隐藏加载状态
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
</style>
