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
										label: '供应商',
										value: 'names',
									},
								]"
								:getDataList="getDataList"
							/>
						</div>
					</el-form-item>
					<el-form-item>
						<el-select
							v-model="state.queryForm.status"
							placeholder="供应商状态"
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
						<div
							class="flex items-center"
							:style="{
								width: '200px',
							}"
						>
							<TreeSelectInput
								v-model:queryForm="state.queryForm"
								:style="{ width: '200px' }"
								:settings="{
									getTreeData: async () => {
										return {
											code: 0,
											data:
												(await getDictMapValueByKey('purchaseUserId')) || [],
										};
									},
									text: '采购员',
									width: '200px',
									searchFn: getDataList,
									code: 'purchaseUserIds',
									selectTreeProps: {
										value: 'userId',
										label: 'name',
										children: 'children',
									},
									getIdsCode: 'userId',
								}"
							/>
						</div>
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
										value: 'createTime',
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
						<div
							class="flex items-center"
							:style="{
								width: '200px',
							}"
						>
							<TreeSelectInput
								v-model:queryForm="state.queryForm"
								:style="{ width: '200px' }"
								:settings="{
									getTreeData: async () => {
										return {
											code: 0,
											data:
												(await getDictMapValueByKey('productManageId')) || [],
										};
									},
									text: '开发员',
									width: '200px',
									searchFn: getDataList,
									code: 'developerIds',
									selectTreeProps: {
										value: 'userId',
										label: 'name',
										children: 'children',
									},
									getIdsCode: 'userId',
								}"
							/>
						</div>
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
				:tableAttrs="tableAttrs"
			>
				<template #left-tool>
					<el-button
						class="ml10"
						type="primary"
						@click="openDialog('add')"
						v-auth="'supplier_add'"
					>
						{{ $t('添加') }}</el-button
					>
					<el-button
						class="ml10"
						@click="
							() => {
								importDialogRef.show();
							}
						"
						v-auth="'supplier_import'"
					>
						{{ $t('导入') }}</el-button
					>
					<el-button
						class="ml10"
						@click="openDialog('del')"
						v-auth="'supplier_delete'"
					>
						{{ $t('批量删除') }}</el-button
					>
					<el-button
						class="ml10"
						@click="openDialog('changePurchaser')"
						v-auth="'supplier_changePurchaser'"
					>
						{{ $t('变更采购员') }}</el-button
					>
				</template>
				<template #status="{ row }">
					<el-switch
						:modelValue="!!row.status"
						size="small"
						@change="
							(e: any) => {
								statusChange(e, row);
							}
						"
					></el-switch>
				</template>
				<template #purchaseUserId="{ row }">
					{{ row.purchaseUserName || '---' }}
				</template>
				<template #currency="{ row }">
					{{ row.contact || '---' }} - {{ row.phone || '---' }}
				</template>
				<template #attachmentUrlList="{ row }">
					<div v-if="row.attachmentUrlList?.length">
						<div v-for="(value, index) in row.attachmentUrlList" :key="value">
							<el-link target="_blank" :href="value" type="primary">{{
								row.originNameList?.length
									? row.originNameList && row.originNameList[index]
									: '--'
							}}</el-link
							>&nbsp;
						</div>
					</div>
					<template v-else>---</template>
				</template>
				<template #action="{ row }">
					<div class="flex items-center">
						<el-button
							text
							type="primary"
							class="mr20"
							@click="openDialog('edit', row)"
							v-auth="'supplier_edit'"
							>{{ $t('编辑') }}
						</el-button>
						<el-button
							text
							type="primary"
							class="mr20"
							@click="openDialog('log', row)"
							v-auth="'supplier_log'"
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
			title="导入供应商"
			templateUrl="/files/import-template/导入供应商模版.xlsx"
			excelUploadApi="/purchase/supplierInfo/import"
			:accept="'.xlsx,.xls'"
			@refreshDataList="getDataList"
		/>
		<!-- 采购员变更弹窗 -->
		<select-dialog
			ref="changePurchaserDialog"
			title="变更采购员"
			:show-icon="true"
			icon-type="info"
			select-prop="purchaserId"
			select-placeholder="选择采购员"
			:options="dictMap.purchaseUserId"
			:option-props="{ label: 'name', value: 'userId' }"
			@confirm="handleChangePurchaser"
			@cancel="changePurchaserDialog.hide()"
		/>
		<LogDialog
			v-model="logDialogVisible"
			:id="currentRow.id"
			:biz-type="['PURCHASE_SUPPLIER_INFO']"
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
import { columns } from './config/index';
import { useI18n } from 'vue-i18n';
import { defineAsyncComponent, ref, reactive } from 'vue';
import { useMessage } from '/@/hooks/message';
import { ElMessageBox } from 'element-plus';
import {
	getSupplierInfoPage,
	getDetailInfo,
	openStatus,
	closeStatus,
	deleteSupplier,
	updatePurchaseUser,
	exportSupplierInfo,
} from '/@/api/base/supplier/index';
import { getBasePortListByCondition } from '/@/api/all-base-data/index';
import { getUserListByCondition } from '/@/api/admin/user';
import { useMultipleDicts } from '/@/hooks/multipleDicts';
import { useResultDialog } from '/@/hooks/useResultDialog';
const BaseTable = defineAsyncComponent(
	() => import('/@/components/BaseTable/index.vue')
);

const TreeSelectInput = defineAsyncComponent(
	() => import('/@/components/TableFormModule/tree-select-input.vue')
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
const SelectDate = defineAsyncComponent(
	() => import('/@/components/TableFormModule/select-date.vue')
);
const SelectInput = defineAsyncComponent(
	() => import('/@/components/TableFormModule/select-input.vue')
);
const SelectDialog = defineAsyncComponent(
	() => import('/@/components/ConfirmDialog/SelectDialog.vue')
);

const { open } = useResultDialog();

const { t } = useI18n();
// table的引用
const baseTableRef = ref();
// 搜索变量
const queryRef = ref();
// 是否显示搜索
const showSearch = ref(true);
// 导入弹窗的引用
const importDialogRef = ref();
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

const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {},
	pageList: getSupplierInfoPage as any,
	columns,
	loading: false,
	dataList: [],
	ascs: [],
	descs: ['si.create_time'],
	toolBarConfig: {
		handleRefresh: () => {
			getDataList();
		},
		handleExport: () => {
			handleExport();
		},
	},
});
const tableAttrs = {
	rowConfig: { keyField: 'id', isHover: true },
	cellConfig: { height: 90 },
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
const { register, getDataList, resetTableQuery, tableRef } = useTable(
	state,
	baseTableRef
);
//   初始化数据
const { dictMap, getDictMapValueByKey } = useMultipleDicts(
	[
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
			key: 'basePortListByCondition',
			fetchFn: getBasePortListByCondition,
		}, // 国家港口列表
	],
	{
		isAuto: true,
		tableRef,
	}
);
//  table hook

// 清空搜索条件
const resetQuery = () => {
	resetTableQuery(() => {
		// 重置时间范围
		return {
			queryForm: {
				current: 1,
				size: 10,
			},
			descs: ['create_time'],
			ascs: [],
		};
	});
};
// 变更采购员弹窗ref
const changePurchaserDialog = ref();
// 打开对话框
const openDialog = async (type: string, row?: any) => {
	try {
		if (type === 'add') {
			title.value = t('新增供应商资料');
			visibleType.value = 'add';
			currentRow.value = {
				id: '',
			};
			visible.value = true;
		} else if (type === 'edit') {
			const res = await getDetailInfo({ id: row.id });
			if (res.code === 0) {
				title.value = t('编辑供应商资料');
				visibleType.value = 'edit';
				currentRow.value = res.data;
				visible.value = true;
			}
		} else if (type === 'del') {
			const ids = register.getSelectedIds();
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
					const res = await deleteSupplier({ ids });
					if (res?.data?.failCount > 0) {
						// 打开提示框
						open({
							title: t('错误提示'),
							data: res.data,
						});
						getDataList();
						return;
					}
					if (res.code === 0) {
						useMessage().success(t('删除成功'));
					} else {
						useMessage().error(res.msg || t('删除失败'));
					}
					// 清空选中行
					register.safeCallTableMethod('clearCheckboxRow');
					// 刷新数据
					getDataList();
				} catch (error: any) {
					useMessage().error(error?.msg || t('删除失败'));
				}
			});
		} else if (type === 'log') {
			logDialogVisible.value = true;
			currentRow.value = row;
		} else if (type === 'changePurchaser') {
			if (register.getSelectedIds().length === 0) {
				useMessage().warning('请选择要变更采购员的供应商');
				return;
			}
			changePurchaserDialog.value.show();
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

// 处理采购员变更
const handleChangePurchaser = async (formData: any) => {
	const ids = register.getSelectedIds();
	try {
		if (!formData.purchaserId) {
			useMessage().error('请选择采购员');
			return;
		}
		// 这里添加采购员变更的API调用
		const res = await updatePurchaseUser({
			ids: ids,
			userId: formData.purchaserId,
		});
		if (res.code === 0) {
			changePurchaserDialog.value.hide();
			if (res?.data?.failCount > 0) {
				// 显示结果对话框
				open({
					title: t('错误提示'),
					data: res.data,
				});
			} else {
				useMessage().success('采购员变更成功');
			}
		}
		register.safeCallTableMethod('clearCheckboxRow');
		getDataList();
	} catch (error: any) {
		useMessage().error(error?.msg || '采购员变更失败');
	}
};

// 导出
const handleExport = async () => {
	try {
		const ids = register.getSelectedIds();
		// 显示加载状态
		state.loading = true;
		// 发送请求，设置 responseType 为 'blob' 以接收二进制流
		await exportSupplierInfo({
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
		// 隐藏加载状态
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
				const api = e ? openStatus : closeStatus;
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
</style>
