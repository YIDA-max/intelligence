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
								:searchTypes="[
									{
										label: 'SKU',
										value: 'skuCodes',
									},
								]"
								:getDataList="getDataList"
							/>
						</div>
					</el-form-item>
					<el-form-item>
						<TreeSelectInputApi
							v-model:queryForm="state.queryForm"
							componentType="qianyiSupplier"
							:settings="{
								text: '供应商',
								code: 'supplierNos',
								searchFn: getDataList,
							}"
						/>
					</el-form-item>
					<el-form-item>
						<TreeSelectInputApi
							v-model:queryForm="state.queryForm"
							componentType="userList"
							:settings="{
								text: '采购员',
								code: 'purchaseUserIds',
								searchFn: getDataList,
								getTreeDataParams: {
									postCodeList: [
										'PURCHASING_DIRECTOR',
										'PURCHASING_MANAGER',
										'PROCUREMENT_MANAGER',
										'PURCHASING_OFFICER',
									],
								},
							}"
						/>
					</el-form-item>
					<el-form-item>
						<TreeSelectInputApi
							v-model:queryForm="state.queryForm"
							componentType="userList"
							:settings="{
								text: '创建人',
								code: 'createIds',
								searchFn: getDataList,
								getTreeDataParams: { lockFlag: 0 },
							}"
						/>
					</el-form-item>
					<el-form-item>
						<TreeSelectInputApi
							v-model:queryForm="state.queryForm"
							componentType="currency"
							:settings="{
								text: '币种',
								code: 'currencyList',
								searchFn: getDataList,
							}"
						/>
					</el-form-item>
					<el-form-item>
						<el-select
							v-model="state.queryForm.skuStatus"
							placeholder="产品状态"
							clearable
							style="width: 150px"
							@change="getDataList"
						>
							<el-option
								v-for="item in [
									{
										value: 1,
										label: '启用',
									},
									{
										value: 0,
										label: '停用',
									},
								]"
								:key="item.value"
								:label="item.label"
								:value="item.value"
							/>
						</el-select>
					</el-form-item>
					<el-form-item>
						<el-select
							v-model="state.queryForm.status"
							placeholder="供应商产品状态"
							clearable
							style="width: 150px"
							@change="getDataList"
						>
							<el-option
								v-for="item in [
									{
										value: 1,
										label: '启用',
									},
									{
										value: 0,
										label: '停用',
									},
								]"
								:key="item.value"
								:label="item.label"
								:value="item.value"
							/>
						</el-select>
					</el-form-item>
					<el-form-item>
						<el-button @click="getDataList" type="primary"
							>{{ $t('搜索') }}
						</el-button>
						<el-button @click="resetQuery" type="info" plain
							>{{ $t('common.resetBtn') }}
						</el-button>
					</el-form-item>
				</el-form>
			</el-row>
			<BaseTable
				ref="baseTableRef"
				:register="register"
				:rowConfig="{ keyField: 'id', height: 100 }"
			>
				<template #left-tool>
					<el-button
						class="ml10"
						type="primary"
						@click="openDialog('add')"
						v-auth="'supplierSku_add'"
					>
						{{ $t('添加') }}
					</el-button>
					<el-button
						class="ml10"
						@click="importDialogRef.show()"
						v-auth="'supplierSku_import'"
					>
						{{ $t('产品导入') }}
					</el-button>
					<el-button
						class="ml10"
						@click="importDialogUpdateRef.show()"
						v-auth="'supplierSku_importUpdate'"
					>
						{{ $t('产品报价导入更新') }}
					</el-button>
					<el-button
						class="ml10"
						@click="openDialog('del')"
						v-auth="'supplierSku_delete'"
					>
						{{ $t('批量删除') }}
					</el-button>
				</template>

				<!-- 图片列 -->
				<template #imgUrl="{ row }">
					<MrImg :src="row.imgUrl" />
				</template>

				<!-- SKU/产品名称列 -->
				<template #skuCode="{ row }">
					<div class="col-flex-start">
						<div class="ellipsis-text">{{ row.skuCode }}</div>
						<div class="ellipsis-text">{{ row.skuName }}</div>
					</div>
				</template>

				<!-- 产品状态列 -->
				<template #skuStatus="{ row }">
					{{ row.skuStatus === 1 ? '启用' : '停用' }}
				</template>

				<!-- 供应商产品状态列 -->
				<template #status="{ row }">
					<el-switch
						:modelValue="!!row.status"
						size="small"
						@change="(e: any) => { statusChange(e, row); }"
					></el-switch>
				</template>

				<!-- 不含税单价 | 税率% | 含税单价列 -->
				<template #unitPriceWithoutTax="{ row }">
					<!-- 梯度报价 -->
					<div v-if="row.ladderFlag === 1">
						<el-popover width="450" placement="left">
							<template #default>
								<h2 class="mb10">{{ t('阶梯报价详情') }}</h2>
								<el-table :data="row.ladderVOS" border style="width: 400px">
									<el-table-column
										prop="minNum"
										:label="t('阶梯数量')"
										show-overflow-tooltip
									>
										<template #default="{ row: ladderRow }">
											{{ ladderRow.minNum }} - {{ ladderRow.maxNum }}
										</template>
									</el-table-column>
									<el-table-column
										prop="unitPriceWithoutTax"
										:label="t('不含税单价')"
										show-overflow-tooltip
									/>
									<el-table-column
										prop="taxRate"
										:label="t('税率')"
										show-overflow-tooltip
									>
										{{
											row.effectiveTaxRate
												? row.effectiveTaxRate === '***'
													? '***'
													: row.effectiveTaxRate + '%'
												: '---'
										}}
									</el-table-column>
									<el-table-column
										prop="unitPriceIncludingTax"
										:label="t('含税单价')"
										show-overflow-tooltip
									/>
								</el-table>
							</template>
							<template #reference>
								{{ row.unitPriceWithoutTax || '---' }} |
								{{
									row.effectiveTaxRate
										? row.effectiveTaxRate === '***'
											? '***'
											: row.effectiveTaxRate + '%'
										: '---'
								}}
								| {{ row.unitPriceIncludingTax || '---' }}
							</template>
						</el-popover>
					</div>
					<!-- 非梯度报价 -->
					<div v-else>
						{{ row.unitPriceWithoutTax || '---' }} |
						{{
							row.effectiveTaxRate
								? row.effectiveTaxRate === '***'
									? '***'
									: row.effectiveTaxRate + '%'
								: '---'
						}}
						| {{ row.unitPriceIncludingTax || '---' }}
					</div>
				</template>

				<!-- 操作列 -->
				<template #action="{ row }">
					<div class="flex items-center">
						<el-button
							text
							type="primary"
							class="mr20"
							@click="openDialog('edit', row)"
							v-auth="'supplierSku_edit'"
							>{{ $t('编辑') }}
						</el-button>
						<el-button
							text
							type="primary"
							class="mr20"
							@click="openDialog('log', row)"
							v-auth="'supplierSku_log'"
							>{{ $t('日志') }}
						</el-button>
					</div>
				</template>
			</BaseTable>
		</div>
		<!-- 编辑、新增  -->
		<FormDialog
			v-model="visible"
			:currentRow="currentRow"
			:visibleType="visibleType"
			:title="title"
			@closeDialog="closeDialog"
			:dictMap="dictMap"
		></FormDialog>
		<ImportDialog
			ref="importDialogRef"
			title="导入供应商产品"
			templateUrl="/files/import-template/导入供应商产品模版.xlsx"
			excelUploadApi="/purchase/supplierSku/import"
			:accept="'.xlsx,.xls'"
			@refreshDataList="getDataList"
		/>
		<ImportDialog
			ref="importDialogUpdateRef"
			title="供应商产品报价导入更新"
			templateUrl="/files/import-template/批量更新供应商产品报价模版.xlsx"
			excelUploadApi="/purchase/supplierSku/importPrice"
			:accept="'.xlsx,.xls'"
			@refreshDataList="getDataList"
		/>
		<LogDialog
			v-model="logDialogVisible"
			:id="currentRow.id"
			:biz-type="['PURCHASE_SUPPLIER_SKU']"
			:showSearchForm="false"
			:showToolBar="false"
			:postCodeList="[
				'PURCHASING_DIRECTOR',
				'PURCHASING_MANAGER',
				'PROCUREMENT_MANAGER',
				'PURCHASING_OFFICER',
				'FINANCE_MANAGER',
				'FINANCE_BUSINIESS_PARTNER',
				'FINANCE_DIRECTOR',
				'FINANCE_OFFICER',
			]"
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
import { columns } from './config/index';
import { useI18n } from 'vue-i18n';
import { defineAsyncComponent, ref, reactive } from 'vue';
import { useMessage } from '/@/hooks/message';
import { ElMessageBox } from 'element-plus';
import { getDicts } from '/@/api/admin/dict';
import {
	getSupplierSkuPage,
	getSupplierInfoList,
	postSupplierEnable,
	postSupplierDisable,
	getSupplierSkuDetailInfo,
	postSupplierSkuDelete,
	getSupplierSkuExport,
	getListByCondition,
} from '/@/api/purchase/supplierSku/index';
import { getUserListByCondition } from '/@/api/admin/user';
import { useMultipleDicts } from '/@/hooks/multipleDicts';
// import { auth } from '/@/utils/authFunction';
const SelectInput = defineAsyncComponent(
	() => import('/@/components/TableFormModule/select-input.vue')
);
const FormDialog = defineAsyncComponent(
	() => import('./components/form-dialog.vue')
);
const ImportDialog = defineAsyncComponent(
	() => import('/@/components/fileUpload/importDialog.vue')
);
const LogDialog = defineAsyncComponent(
	() => import('/@/components/log/log-dialog.vue')
);
const TreeSelectInputApi = defineAsyncComponent(
	() => import('/@/componentsApi/TreeSelectInputApi/index.vue')
);
const { t } = useI18n();
// table的引用
const baseTableRef = ref();
// 搜索变量
const queryRef = ref();
// 是否显示搜索
const showSearch = ref(true);

// 导入弹窗的引用
const importDialogRef = ref();
// 导入更新弹窗的引用
const importDialogUpdateRef = ref();
// 当前点击的行
const currentRow = ref({
	id: '',
});
// 弹窗标题
const title = ref('');
// 弹窗类型
const visibleType = ref('');
// 弹窗是否可见
const visible = ref(false);
// 日志对话框是否可见
const logDialogVisible = ref(false);

//   初始化数据
const { dictMap } = useMultipleDicts(
	[
		{
			key: 'spInfoList',
			fetchFn: getSupplierInfoList,
		}, // 服务商列表
		{
			key: 'productManageId',
			fetchFn: getUserListByCondition,
			params: { lockFlag: 0 },
		}, // 人员列表
		{
			key: 'purchaseUserId',
			fetchFn: getUserListByCondition,
			params: {
				postCodeList: [
					'PURCHASING_DIRECTOR',
					'PURCHASING_MANAGER',
					'PROCUREMENT_MANAGER',
					'PURCHASING_OFFICER',
				],
			},
		}, // 采购人员列表
		{
			key: 'planUserId',
			fetchFn: getUserListByCondition,
			params: {
				postCodeList: ['PURCHASING_PLAN'],
			},
		}, // 主计划人员列表
		{
			key: 'currency',
			fetchFn: getListByCondition,
			params: {},
		}, // 币种字典
		{
			key: 'invoiceType',
			fetchFn: getDicts,
			params: 'invoice_type',
		}, // 发票类型字典
	],
	{
		isAuto: true,
		tableRef: baseTableRef,
	}
);
const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {
		status: 1,
	},
	pageList: getSupplierSkuPage,
	loading: false,
	dataList: [],
	columns,
	ascs: [],
	descs: ['create_time'],
	toolBarConfig: {
		handleRefresh: () => register?.getDataList(),
		handleExport: () => handleExport(),
		isShowExport: false,
		// settingKey: 'supplierSku_index',
	},
});

//  table hook
const { register, getDataList, resetTableQuery } = useTable(
	state,
	baseTableRef
);

// 清空搜索条件
const resetQuery = () => {
	resetTableQuery(() => {
		// 重置时间范围
		return {
			queryForm: {
				current: 1,
				status: 1,
				size: 10,
			},
			descs: ['create_time'],
			ascs: [],
		};
	});
};

// 打开对话框
const openDialog = async (type: string, row?: any) => {
	try {
		if (type === 'add') {
			title.value = t('添加供应商产品');
			visibleType.value = 'add';
			currentRow.value = {
				id: '',
			};
			visible.value = true;
		} else if (type === 'edit') {
			const res = await getSupplierSkuDetailInfo({ id: row.id });
			if (res.code === 0) {
				title.value = t('编辑供应商产品');
				visibleType.value = 'edit';
				currentRow.value = res.data;
				visible.value = true;
			}
		} else if (type === 'del') {
			const ids = (
				register.safeCallTableMethod('getCheckboxRecords') || []
			).map((item: any) => item.id);
			if (!ids || ids.length === 0) {
				useMessage().warning(t('请至少选择一条数据'));
				return;
			}
			ElMessageBox.confirm(t('是否确认删除选中数据？'), t('提示'), {
				confirmButtonText: t('确定'),
				cancelButtonText: t('取消'),
				type: 'warning',
			}).then(async () => {
				try {
					const res = await postSupplierSkuDelete({ ids });
					if (res.code === 0) {
						useMessage().success(t('操作成功'));
					} else if (res.code === 5004) {
						ElMessageBox.confirm(t(res.msg), t('提示'), {
							type: 'error',
						});
					}
					// 清空选中行
					register.safeCallTableMethod('clearCheckboxRow');
					// 刷新数据
					getDataList();
				} catch (error: any) {
					useMessage().error(error?.msg || t('操作失败'));
				}
			});
		} else if (type === 'log') {
			logDialogVisible.value = true;
			currentRow.value = row;
		}
	} catch (error: any) {
		useMessage().error(error?.msg || t('错误'));
	}
};
// 关闭对话框
const closeDialog = () => {
	visible.value = false;
	getDataList();
};

// 导出
const handleExport = async () => {
	try {
		const ids = register.getSelectedIds();
		state.loading = true;
		await getSupplierSkuExport({
			...state.queryForm,
			ascs: state?.ascs,
			descs: state?.descs,
			ids,
			current: 1,
			size: 10000,
		});
	} catch (error) {
		useMessage().error(t(error as string));
	} finally {
		state.loading = false;
	}
};

// 状态切换
const statusChange = async (e: any, row: any) => {
	try {
		ElMessageBox.confirm(t(`是否确认${e ? '启用' : '禁用'}？`), t('提示'), {
			confirmButtonText: t('确定'),
			cancelButtonText: t('取消'),
			type: 'warning',
		}).then(async () => {
			try {
				const api = e ? postSupplierEnable : postSupplierDisable;
				const res = await api({
					id: row.id,
				});
				if (res.code === 0) {
					useMessage().success(t('操作成功'));
					getDataList();
				}
			} catch (error: any) {
				useMessage().error(error?.msg || t('操作失败'));
			}
		});
	} catch (error: any) {
		useMessage().error(error?.msg || t('错误'));
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
.col-flex-start {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: flex-start;
	width: 100%;
}
.ellipsis-text {
	max-width: 100%;
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
}
</style>
