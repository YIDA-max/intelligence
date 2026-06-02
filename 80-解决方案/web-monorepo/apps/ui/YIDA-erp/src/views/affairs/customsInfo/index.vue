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
							<el-select
								v-model="state.queryForm.status"
								placeholder="完善状态"
								clearable
								style="width: 200px"
								@change="getDataList"
							>
								<el-option
									v-for="item in [
										{ label: '未完善', value: 1 },
										{ label: '已完善', value: 2 },
									]"
									:key="item.value"
									:label="item.label"
									:value="item.value"
								/>
							</el-select>
						</div>
					</el-form-item>
					<el-form-item>
						<div class="flex item-center">
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
										value: 'creatTime',
										isAddHMS: false,
										dateStart: 'createTimeStart',
										dateEnd: 'createTimeEnd',
									},
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
						</div>
					</el-form-item>
					<el-form-item>
						<div class="flex item-center">
							<SelectInput
								v-model:queryForm="state.queryForm"
								:searchTypes="[
									{
										label: 'SKU',
										value: 'skuCodes',
									},
									{
										label: '产品名称',
										value: 'skuNames',
									},
									{
										label: 'HS编码',
										value: 'customsCodes',
									},
									{
										label: '中文品名',
										value: 'chineseNames',
									},
									{
										label: '英文品名',
										value: 'enNames',
									},
								]"
								:getDataList="getDataList"
							/>
						</div>
					</el-form-item>
					<el-form-item>
						<el-button @click="getDataList" type="primary"
							>{{ $t('搜索') }}
						</el-button>
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
					<el-dropdown @command="(type: string) => handleCommand(type)">
						<el-button
							class="ml10"
							type="primary"
							v-if="
								auths([
									'affairs_skuCustomsInfo',
									'affairs_skuCustomsPrice',
									'affairs_skuClearanceUnitPrice',
								])
							"
						>
							{{ $t('导入') }}
							<el-icon class="el-icon--right">
								<arrow-down />
							</el-icon>
						</el-button>
						<template #dropdown>
							<el-dropdown-menu>
								<el-dropdown-item
									v-if="auth('affairs_skuCustomsInfo')"
									command="skuCustomsInfo"
								>
									SKU关务信息
								</el-dropdown-item>
								<el-dropdown-item
									v-if="auth('affairs_skuCustomsPrice')"
									command="skuCustomsPrice"
								>
									SKU报关单价
								</el-dropdown-item>
								<el-dropdown-item
									v-if="auth('affairs_skuClearanceUnitPrice')"
									command="skuClearanceUnitPrice"
								>
									SKU清关单价
								</el-dropdown-item>
							</el-dropdown-menu>
						</template>
					</el-dropdown>
				</template>
				<template #action="{ row }">
					<div class="flex items-center">
						<el-button
							text
							type="primary"
							@click="openDialog('edit', row)"
							v-auth="'affairs_edit'"
							>{{ $t('编辑') }}
						</el-button>
						<el-button text type="primary" class="mr20" @click="openLog(row)"
							>{{ $t('日志') }}
						</el-button>
					</div>
				</template>
			</BaseTable>
		</div>
		<!-- 编辑、新增  -->
		<FormDialog
			ref="formDialog"
			:rowData="currentRow"
			:title="'编辑关务信息'"
			@submit="onSubmit"
		/>
		<!-- 导入关务信息 -->
		<ImportDialog
			ref="importDialogRef"
			:title="importDialogTitle"
			:templateUrl="templateUrl"
			:excelUploadApi="excelUploadApi"
			@refreshDataList="getDataList"
		/>
		<LogDialog
			v-model="logDialogVisible"
			:id="currentRow.id"
			:biz-type="['CUSTOMS_AFFAIRS']"
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
import { useI18n } from 'vue-i18n';
import {
	BasicTableProps,
	useTable,
} from '/@/components/BaseTable/hooks/BaseTable';
import { defineAsyncComponent, ref, reactive } from 'vue';
import { useMessage } from '/@/hooks/message';
import {
	getCustomsInfoList,
	exportCustomsInfo,
	getCustomsDetail,
	updateCustomsInfo,
} from '/@/api/affairs/customsInfo/index';
import { auth, auths } from '/@/utils/authFunction';
import { columns } from './config/index';
const SelectDate = defineAsyncComponent(
	() => import('/@/components/TableFormModule/select-date.vue')
);
const SelectInput = defineAsyncComponent(
	() => import('/@/components/TableFormModule/select-input.vue')
);
const BaseTable = defineAsyncComponent(
	() => import('/@/components/BaseTable/index.vue')
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

const { t } = useI18n();

// table的引用
const baseTableRef = ref();
// 搜索变量
const queryRef = ref();
// 是否显示搜索
const showSearch = ref(true);
// 当前点击的行
const currentRow = ref({
	id: '',
});

// 弹窗标题
// 日志对话框是否可见
const logDialogVisible = ref(false);
const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {},
	pageList: getCustomsInfoList as any,
	loading: false,
	dataList: [],
	columns,
	toolBarConfig: {
		handleRefresh: () => {
			getDataList();
		},
		handleExport: () => {
			exportPartFn();
		},
		isShowExport: true,
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
//  table hook
const { register, getDataList, resetTableQuery } = useTable(
	state,
	baseTableRef
);

// 重置
const resetQuery = () => {
	resetTableQuery(() => ({
		queryForm: {
			current: 1,
			size: 10,
			status: 1, // 默认启用
		},
		descs: ['create_time'],
		ascs: [],
	}));
};

const formDialog = ref();
// 打开对话框
const openDialog = async (type: string, row: any) => {
	const res = await getCustomsDetail({ id: row.id });
	currentRow.value = { ...currentRow.value, ...res.data };
	formDialog.value.handleOpen(currentRow.value);
};

// 弹窗提交
const onSubmit = async (formData: any) => {
	const res = await updateCustomsInfo(formData);
	if (res.code === 0) {
		useMessage().success('操作成功');
		getDataList();
		formDialog.value.handleCancel();
	}
};

const openLog = (row: any) => {
	currentRow.value = row;
	logDialogVisible.value = true;
};

// 导入弹窗标题
const importDialogTitle = ref('');
// 导入模板地址
const templateUrl = ref('');
// 导入接口
const excelUploadApi = ref('');
const importDialogRef = ref();
// 操作
const handleCommand = (type: string) => {
	switch (type) {
		case 'skuCustomsInfo':
			importDialogTitle.value = '导入SKU关务信息';
			templateUrl.value = '/files/import-template/导入SKU关务信息.xlsx';
			excelUploadApi.value = '/affairs/customsInfo/importSkuCustomsInfo';
			break;
		case 'skuCustomsPrice':
			importDialogTitle.value = '导入SKU报关单价';
			templateUrl.value = '/files/import-template/导入SKU报关单价.xlsx';
			excelUploadApi.value = '/affairs/customsInfo/importSkuCustomsPrice';
			break;
		case 'skuClearanceUnitPrice':
			importDialogTitle.value = '导入SKU清关单价';
			templateUrl.value = '/files/import-template/导入SKU清关单价.xlsx';
			excelUploadApi.value = '/affairs/customsInfo/importSkuClearanceUnitPrice';
			break;
	}
	importDialogRef.value.show();
};

// 导出
const exportPartFn = async () => {
	try {
		const ids = register?.getSelectedIds() || [];
		// 显示加载状态
		register.state.loading = true;
		// 发送请求，设置 responseType 为 'blob' 以接收二进制流
		await exportCustomsInfo({
			...register.state.queryForm,
			ascs: register.state?.ascs,
			descs: register.state?.descs,
			ids: ids || [],
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
