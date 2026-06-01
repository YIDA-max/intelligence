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
						<el-select
							v-model="state.queryForm.status"
							placeholder="SKU状态"
							clearable
							style="width: 220px"
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
							v-model="state.queryForm.bundleType"
							placeholder="捆绑类型"
							clearable
							style="width: 150px"
							@change="getDataList"
						>
							<el-option
								v-for="item in dictMap.bundleType"
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
								width: '220px',
							}"
						>
							<TreeSelectInputApi
								v-model:queryForm="state.queryForm"
								:style="{ width: '220px' }"
								:settings="{
									getTreeData: sysCountryList,
									getTreeDataParams: 'country',
									text: '销售国家',
									width: '220px',
									searchFn: getDataList,
									code: 'countryCodes',
									selectTreeProps: {
										value: 'abbTwoCode',
										label: 'chineseName',
									},
									getIdsCode: 'abbTwoCode',
									renderData: (data: any) => {
										return data.map((item: any) => {
											return {
												...item,
												chineseName: `${item.abbTwoCode}-${item.chineseName}`,
											};
										});
									},
								}"
							/>
						</div>
					</el-form-item>
					<el-form-item>
						<div
							class="flex items-center"
							:style="{
								width: '220px',
							}"
						>
							<TreeSelectInputApi
								v-model:queryForm="state.queryForm"
								:style="{ width: '220px' }"
								:settings="{
									getTreeData: getDicts,
									getTreeDataParams: 'platform_channel',
									text: '销售渠道',
									width: '220px',
									searchFn: getDataList,
									code: 'platforms',
									selectTreeProps: {
										value: 'value',
										label: 'label',
										children: 'children',
									},
									getIdsCode: 'value',
								}"
							/>
						</div>
					</el-form-item>
					<el-form-item>
						<div
							class="flex items-center"
							:style="{
								width: '220px',
							}"
						>
							<TreeSelectInputApi
								v-model:queryForm="state.queryForm"
								:style="{ width: '220px' }"
								:settings="{
									getTreeData: getUserListByCondition,
									getTreeDataParams: {
										lockFlag: 0,
									},
									text: '产品负责人',
									width: '220px',
									searchFn: getDataList,
									code: 'productManageIds',
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
						<div
							class="flex items-center"
							:style="{
								width: '220px',
							}"
						>
							<TreeSelectInputApi
								v-model:queryForm="state.queryForm"
								:style="{ width: '220px' }"
								:settings="{
									getTreeData: getDeptLastDeptByCondition,
									getTreeDataParams: {
										deptName: '运营中心',
									},
									text: '运营组',
									width: '220px',
									searchFn: getDataList,
									code: 'deptNames',
									selectTreeProps: {
										value: 'deptId',
										label: 'name',
										children: 'children',
									},
									getIdsCode: 'deptId',
								}"
							/>
						</div>
					</el-form-item>
					<el-form-item>
						<div class="flex items-center">
							<SelectDate
								v-model:queryForm="state.queryForm"
								:settings="{
									selectStyle: { width: '130px' },
									dateStyle: { width: '130px' },
								}"
								:searchTypes="[
									{
										label: '创建时间',
										value: 'createdTime',
										isAddHMS: true,
										dateStart: 'createTimeStart',
										dateEnd: 'createTimeEnd',
									},
									{
										label: '更新时间',
										value: 'updateTime',
										isAddHMS: true,
										dateStart: 'updateTimeStart',
										dateEnd: 'updateTimeEnd',
									},
								]"
								:getDataList="getDataList"
							/>
						</div>
					</el-form-item>

					<el-form-item>
						<div class="flex items-center">
							<SelectInput
								v-model:queryForm="state.queryForm"
								:searchTypes="[
									{
										label: '捆绑编码',
										value: 'bundleCodes',
									},
									{
										label: '捆绑名称',
										value: 'bundleNames',
									},
									{
										label: 'SKU',
										value: 'skuCodes',
									},
									{
										label: 'MSKU',
										value: 'mskuCodes',
									},
								]"
								:settings="{
									selectStyle: {
										width: '130px',
									},
									inputStyle: {
										width: '260px',
									},
								}"
								:getDataList="getDataList"
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
			<el-row>
				<ToolBar
					@handleRefresh="resetQuery"
					@handleExport="exportPartFn"
					:is-show-export="auth('bundle_export')"
					:is-show-refresh="true"
				>
					<template #left-tool>
						<el-button
							class="ml10"
							type="primary"
							@click="openDialog('add')"
							v-auth="'bundle_add'"
						>
							{{ $t('添加捆绑产品') }}
						</el-button>
						<el-button
							class="ml10"
							@click="importDialogRef.show()"
							v-auth="'bundle_import'"
						>
							{{ $t('导入') }}
						</el-button>
					</template>
				</ToolBar>
			</el-row>
			<el-table
				:data="state.dataList"
				@selection-change="handleSelectionChange"
				@sort-change="sortChangeHandle"
				style="width: 100%"
				v-loading="state.loading"
				border
				row-key="id"
				ref="tableRef"
				:cell-style="tableStyle.cellStyle"
				:header-cell-style="tableStyle.headerCellStyle"
				native-scrollbar
			>
				<el-table-column
					align="center"
					type="selection"
					width="40"
					:reserve-selection="true"
					fixed="left"
				/>
				<el-table-column
					:label="t('图片')"
					type="imgUrl"
					width="100"
					fixed="left"
				>
					<template #default="{ row }">
						<MrImg :src="row.imgUrl" />
					</template>
				</el-table-column>
				<el-table-column
					prop="bundleCode"
					:label="t('捆绑编码/品名')"
					show-overflow-tooltip
					sortable="custom"
					width="160"
					fixed="left"
				>
					<template #default="{ row }">
						<div
							:style="{
								display: 'flex',
								flexDirection: 'column',
								justifyContent: 'center',
								alignItems: 'flex-start',
								width: '100%',
							}"
						>
							<el-row class="ellipsis-text">
								<el-col :span="24" class="flex">
									<span class="mr-1 font-color ellipsis-text">
										{{ row.bundleCode }}</span
									>
									<el-link
										class="copy-icon"
										:icon="DocumentCopy"
										@click="copyText(row.bundleCode)"
										underline="never"
										v-if="row.bundleCode"
									></el-link>
								</el-col>
							</el-row>
							<el-row class="ellipsis-text">
								<el-col :span="24" class="flex">
									<span class="mr-1 font-color ellipsis-text">
										{{ row.bundleName }}</span
									>
									<el-link
										class="copy-icon"
										:icon="DocumentCopy"
										@click="copyText(row.bundleName)"
										underline="never"
										v-if="row.bundleName"
									></el-link>
								</el-col>
							</el-row>
						</div>
					</template>
				</el-table-column>
				<el-table-column
					prop="skus"
					:label="t('包含SKU')"
					width="160"
					fixed="left"
				>
					<template #default="{ row }">
						<div v-if="row.skus.length > 2">
							<div
								v-for="(sku, index) in row.skus.slice(0, 2)"
								:key="sku.id"
								class="relative flex items-center h-8 mb-2"
							>
								<div
									class="flex-1 pr-8 overflow-hidden whitespace-nowrap text-ellipsis"
								>
									{{ sku.skuCode }} * {{ sku.skuQty }}
								</div>
								<div
									class="absolute right-0 transform -translate-y-1/2 top-1/2"
									v-if="index === 1"
								>
									<SkuPopover :tableData="row.skus" />
								</div>
							</div>
						</div>
						<!-- 当小于等于两条时，正常渲染，不加 Tooltip -->
						<div v-else>
							<div
								v-for="(sku, index) in row.skus"
								:key="sku.id"
								class="relative flex items-center h-8 mb-2"
							>
								<div class="whitespace-pre-wrap break-all max-w-[300px]">
									{{ sku.skuCode }} * {{ sku.skuQty }}
								</div>
								<div
									class="absolute right-0 transform -translate-y-1/2 top-1/2"
									v-if="index === row.skus.length - 1"
								>
									<SkuPopover :tableData="row.skus" />
								</div>
							</div>
						</div>
					</template>
				</el-table-column>
				<el-table-column
					prop="bundleType"
					:label="t('捆绑类型')"
					show-overflow-tooltip
					width="160"
				>
					<template #default="{ row }">
						{{
							findNode(dictMap.bundleType, 'value', row.bundleType)?.label ||
							row.bundleTypeText
						}}
					</template>
				</el-table-column>
				<el-table-column
					prop="countryCodeText"
					:label="t('销售国家')"
					show-overflow-tooltip
					width="100"
				/>
				<!-- <el-table-column prop="saleArea" :label="t('销售地区')" show-overflow-tooltip width="100">
					<template #default="{ row }">
						{{ findNode(dictMap.saleArea, 'value', row.saleArea)?.label || row.platformText || row.platform }}
					</template></el-table-column
				> -->
				<el-table-column
					:label="t('平台')"
					width="150"
					prop="productBundlePlatforms"
				>
					<template #default="{ row }">
						<el-tooltip
							:content="row.productBundlePlatforms?.map((p: any) => p.platform).join(', ')"
							placement="top"
							effect="dark"
						>
							<span>
								{{
									row.productBundlePlatforms?.length <= 2
										? row.productBundlePlatforms
												?.map((p: any) => p.platform)
												.join(', ')
										: row.productBundlePlatforms
												?.slice(0, 2)
												.map((p: any) => p.platform)
												.join(', ') + '...'
								}}
							</span>
						</el-tooltip>
					</template>
				</el-table-column>
				<el-table-column prop="mskus" :label="t('关联MSKU')" width="160">
					<template #default="{ row }">
						<div v-if="row.mskus.length > 2">
							<div
								v-for="(sku, index) in row.mskus.slice(0, 2)"
								:key="sku.id"
								class="relative flex items-center h-8 mb-2"
							>
								<div
									class="flex-1 pr-8 overflow-hidden whitespace-nowrap text-ellipsis"
								>
									{{ sku.mskuCode }}
								</div>
								<div
									class="absolute right-0 transform -translate-y-1/2 top-1/2"
									v-if="index === 1"
								>
									<MskuPopover :tableData="row.mskus" />
								</div>
							</div>
						</div>
						<!-- 当小于等于两条时，正常渲染，不加 Tooltip -->
						<div v-else>
							<div
								v-for="(sku, index) in row.mskus"
								:key="sku.id"
								class="relative flex items-center h-8 mb-2"
							>
								<div
									class="flex-1 pr-8 overflow-hidden whitespace-nowrap text-ellipsis"
								>
									{{ sku.mskuCode }}
								</div>
								<div
									class="absolute right-0 transform -translate-y-1/2 top-1/2"
									v-if="index === row.mskus.length - 1"
								>
									<MskuPopover :tableData="row.mskus" />
								</div>
							</div>
						</div>
					</template>
				</el-table-column>
				<el-table-column :label="t('状态')" show-overflow-tooltip>
					<template #default="{ row }">
						<el-switch
							:modelValue="!!row.status"
							size="small"
							@change="
								(e: any) => {
									statusChange(e, row);
								}
							"
							:disabled="
								row.status === 1 || row.status === '1'
									? !auth('bundle_stop')
									: !auth('bundle_start')
							"
						></el-switch>
					</template>
				</el-table-column>
				<el-table-column
					prop="productManageName"
					:label="t('产品负责人')"
					show-overflow-tooltip
				/>
				<el-table-column prop="deptNames" :label="t('运营组')" width="150">
					<template #default="{ row }">
						<el-tooltip
							:content="row.deptIds?.map((p: any) => {
							return findNode(dictMap.skuDepts, 'deptId', p)?.name || p;
						}).join(', ')"
							placement="top"
							effect="dark"
						>
							<span>
								{{
									row.deptIds.length <= 2
										? row.deptIds
												?.map((p: any) => {
													return (
														findNode(dictMap.skuDepts, 'deptId', p)?.name || p
													);
												})
												.join(', ')
										: row.deptIds
												?.slice(0, 2)
												.map((p: any) => {
													return (
														findNode(dictMap.skuDepts, 'deptId', p)?.name || p
													);
												})
												.join(', ') + '...'
								}}
							</span>
						</el-tooltip>
					</template>
				</el-table-column>
				<el-table-column
					prop="createName"
					:label="t('创建人')"
					show-overflow-tooltip
				/>
				<el-table-column
					prop="createTime"
					:label="t('创建时间')"
					show-overflow-tooltip
					sortable="custom"
					width="180"
				/>
				<el-table-column
					prop="updateTime"
					:label="t('更新时间')"
					show-overflow-tooltip
					sortable="custom"
					width="180"
				/>
				<el-table-column :label="$t('common.action')" width="150" fixed="right">
					<template #default="{ row }">
						<div class="flex items-center">
							<el-button
								text
								type="primary"
								class="mr20"
								@click="openDialog('view', row)"
								>{{ $t('详情') }}
							</el-button>
							<el-button
								text
								type="primary"
								class="mr20"
								@click="openDialog('edit', row)"
								>{{ $t('编辑') }}
							</el-button>
						</div>
					</template>
				</el-table-column>
			</el-table>
			<pagination
				@current-change="currentChangeHandle"
				@size-change="sizeChangeHandle"
				v-bind="state.pagination"
			/>
		</div>
		<el-dialog
			v-model="statusVisible"
			:show-close="false"
			:close-on-click-modal="false"
			:close-on-press-escape="false"
			width="25%"
			class="status-header"
		>
			<div>
				<div class="flex items-center mb10">
					<el-icon size="22px" :color="status ? '#2E5CF6' : '#f56c6c'"
						><Warning
					/></el-icon>
					<span class="text-lg ml8">
						{{ status ? '启用' : '停用' }}
					</span>
				</div>
				<div class="text-lg ml30">
					<div>
						确定{{ status ? '启用' : '停用' }}{{ currentRow?.bundleCode }}[{{
							currentRow?.bundleName
						}}]吗?
					</div>
				</div>
			</div>
			<template #footer>
				<div class="dialog-footer">
					<el-button @click="statusVisible = false">取消</el-button>
					<el-button v-if="status" type="primary" @click="changeStatus">
						启用
					</el-button>
					<el-button v-else type="danger" plain @click="changeStatus"
						>停用</el-button
					>
				</div>
			</template>
		</el-dialog>
		<!-- 编辑、新增  -->
		<FormDialog
			v-model="visible"
			:currentRow="currentRow"
			:visibleType="visibleType"
			:title="title"
			@closeDialog="closeDialog"
			@changeCopy="changeCopy"
			@changeEdit="changeEdit"
		></FormDialog>
		<ImportDialog
			ref="importDialogRef"
			title="导入捆绑数据"
			templateUrl="/files/import-template/导入捆绑产品模版.xlsx"
			excelUploadApi="/product/bundle/importBundle"
			@refreshDataList="getDataList"
		/>
		<!-- 展示图片 -->
		<Preview v-model="showPreview" :url="currentRow?.imgUrl" type="image" />
	</div>
</template>

<script lang="ts" name="systemDatasourceConf" setup>
import { BasicTableProps, useTable } from '/@/hooks/table';
import { DocumentCopy } from '@element-plus/icons-vue';
import { useMultipleDicts } from '/@/hooks/multipleDicts';
import { useI18n } from 'vue-i18n';
import { defineAsyncComponent, ref, reactive } from 'vue';
import { onMounted } from 'vue';
import { useMessage } from '/@/hooks/message';
import { getDicts } from '/@/api/admin/dict';
// import { getCategoryTree } from '/@/api/product/category';
import {
	getBundleList,
	enableBundle,
	disableBundle,
	getBundleDetailsById,
	getBundleExport,
} from '/@/api/product/bundle';
import { findNode } from '/@/utils/arrayTree';
import { getUserListByCondition } from '/@/api/admin/user';
import { getDeptLastDeptByCondition } from '/@/api/admin/dept';
import { sysCountryList } from '/@/api/materialFlow/track';
import { auth } from '/@/utils/authFunction';
import commonFunction from '/@/utils/commonFunction';
// 引入组件
const FormDialog = defineAsyncComponent(
	() => import('./components/form-dialog/form-dialog.vue')
);
const ToolBar = defineAsyncComponent(
	() => import('/@/components/ToolBar/tool-bar.vue')
);
const MskuPopover = defineAsyncComponent(
	() => import('./components/msku-popover.vue')
);
const TreeSelectInputApi = defineAsyncComponent(
	() => import('/@/componentsApi/TreeSelectInputApi/index.vue')
);

const SkuPopover = defineAsyncComponent(
	() => import('./components/sku-popover-next.vue')
);
const ImportDialog = defineAsyncComponent(
	() => import('/@/components/fileUpload/importDialog.vue')
);
const Preview = defineAsyncComponent(
	() => import('/@/components/Material/preview.vue')
);
const { t } = useI18n();
// table ref
const tableRef = ref();
//   初始化数据
const { dictMap } = useMultipleDicts(
	[
		{
			key: 'platform',
			fetchFn: getDicts,
			params: 'platform_channel',
		}, // 平台
		{
			key: 'productType',
			fetchFn: getDicts,
			params: 'product_type',
		}, // 产品类型
		{
			key: 'saleArea',
			fetchFn: getDicts,
			params: 'sale_area',
		}, // 销售区域
		{
			key: 'bundleType',
			fetchFn: getDicts,
			params: 'bundle_type',
		}, // 捆绑类型
		{
			key: 'skuDepts',
			fetchFn: getDeptLastDeptByCondition,
			params: {
				deptName: '运营中心',
			},
		}, // 运营部门
	],
	{
		tableRef,
	}
);
// 搜索变量
const queryRef = ref();
const showSearch = ref(true);
// 多选变量
const selectObjs = ref([]) as any;
const multiple = ref(true);

const importDialogRef = ref();
// 时间存储
const timeRange = ref([null, null]);

// 当前点击的行
const currentRow = ref<any>({
	id: '',
});
// 弹窗是否显示
const visible = ref(false);
// 是否显示预览
const showPreview = ref(false);
// 弹窗类型
const visibleType = ref('');
// 弹窗标题
const title = ref('添加SKU');

const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {
		status: 1, // 默认启用
		categoryCodes: [],
	},
	pageList: getBundleList,
	// 默认排序
	descs: ['create_time'],
	ascs: [''],
});

// 获取产品类型
const productTypeOptions = ref([]);
//  table hook
const {
	getDataList,
	currentChangeHandle,
	sizeChangeHandle,
	sortChangeHandle,
	resetTableQuery,
	tableStyle,
} = useTable(state, tableRef);

onMounted(async () => {
	try {
		// 获取产品类型
		const res = await getDicts('product_type');
		if (res.code === 0) {
			productTypeOptions.value = res.data.map((item: any) => ({
				value: item.value,
				label: item.label,
			}));
		}
	} catch (error) {
		// eslint-disable-next-line no-console
		console.error('获取产品类型失败:', error);
	}
});

// 复制
const { copyText } = commonFunction();

// 清空搜索条件
const resetQuery = () => {
	resetTableQuery(() => {
		timeRange.value = [null, null];
		return {
			queryForm: {
				current: 1,
				size: 10,
				status: 1, // 默认启用
			},
			descs: ['create_time'],
			ascs: [],
		};
	});
};

// 多选事件
const handleSelectionChange = (objs: { id: string }[]) => {
	selectObjs.value = objs.map(({ id }) => id);
	multiple.value = !objs.length;
};

// 导出捆绑产品
const exportPartFn = async () => {
	try {
		const ids = tableRef.value.getSelectionRows().map((item: any) => item.id);
		// 显示加载状态
		state.loading = true;
		// 发送请求，设置 responseType 为 'blob' 以接收二进制流
		await getBundleExport({
			...state.queryForm,
			ascs: state?.ascs,
			descs: state?.descs,
			ids: ids || [],
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

// 打开类别弹窗
const openDialog = async (type: string, row?: any) => {
	if (type === 'add') {
		// 添加操作
		title.value = '添加捆绑产品';
	} else if (type === 'edit' && row) {
		// 编辑操作
		// 查看操作
		const res = await getBundleDetailsById({
			id: row.id,
		});
		if (res.code === 0) {
			currentRow.value = res.data;
		}
		title.value = '编辑捆绑产品';
	} else if (type === 'view' && row) {
		// 查看操作
		const res = await getBundleDetailsById({
			id: row.id,
		});
		if (res.code === 0) {
			currentRow.value = res.data;
		}
		title.value = '捆绑产品详情';
	} else if (type === 'copy' && row) {
		// 复制操作
		const res = await getBundleDetailsById({
			id: row.id,
		});
		if (res.code === 0) {
			currentRow.value = res.data;
		}
		title.value = '复制捆绑产品';
	}
	visible.value = true;
	// 设置弹窗类型
	visibleType.value = type;
};
// 关闭品牌弹窗
const closeDialog = () => {
	visible.value = false;
	// 刷新数据列表
	getDataList();
};

// 辅料状态修改 -- 二次确认
const status = ref<Boolean>(false);
const statusVisible = ref(false);

const statusChange = (type: Boolean, row: any) => {
	status.value = type;
	statusVisible.value = true;
	// 设置当前行
	currentRow.value = row;
};

// 修改辅料状态
const changeStatus = async () => {
	// 关闭弹窗
	statusVisible.value = false;
	// 调用接口修改状态
	if (status.value) {
		// 启用操作
		await enableBundle({ id: currentRow.value?.id });
		getDataList();
	} else {
		// 停用操作
		await disableBundle({ id: currentRow.value?.id });
		getDataList();
	}
};

// 复制操作
const changeCopy = async (row: { id: string }) => {
	visible.value = false;
	await new Promise((resolve) => setTimeout(resolve, 100)); // 确保关闭后再打开
	openDialog('copy', row);
};
// 切换到编辑模式
const changeEdit = async (row: { id: string }) => {
	visible.value = false;
	await new Promise((resolve) => setTimeout(resolve, 100)); // 确保关闭后再打开
	openDialog('edit', row);
};
</script>
<style lang="scss" scoped>
.el-dropdown-link {
	cursor: pointer;
	color: var(--el-color-primary);
	display: flex;
	align-items: center;
}
.ellipsis-text {
	max-width: 100%;
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
}
.copy-icon {
	display: none;
}
.hover-row {
	.copy-icon {
		display: block;
	}
}
</style>
