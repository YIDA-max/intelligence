<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-row class="ml10" v-show="showSearch">
				<el-form
					:inline="true"
					:model="state.queryForm"
					@keyup.enter="register?.getDataList"
					ref="queryRef"
				>
					<el-form-item>
						<TreeSelectInputApi
							v-model:queryForm="state.queryForm"
							:style="{ width: '220px' }"
							:settings="{
								getTreeData: getUserListByCondition,
								text: '登记人',
								width: '220px',
								searchFn: register?.getDataList,
								code: 'createId',
								selectTreeProps: {
									value: 'userId',
									label: 'name',
									children: 'children',
								},
								getIdsCode: 'userId',
							}"
						/>
					</el-form-item>
					<el-form-item prop="orderTypes">
						<el-select
							v-model="state.queryForm.orderTypes"
							filterable
							clearable
							multiple
							collapse-tags
							:max-collapse-tags="1"
							placeholder="工单类型"
							@change="register?.getDataList"
						>
							<el-option label="售前" :value="1" />
							<el-option label="售后" :value="2" />
						</el-select>
					</el-form-item>
					<el-form-item>
						<TreeSelectInputApi
							v-model:queryForm="state.queryForm"
							componentType="dicts"
							:settings="{
								text: '平台渠道',
								code: 'platformChannelCodes',
								searchFn: register?.getDataList,
								getTreeDataParams: 'platform_channel',
							}"
						/>
						<!-- <TreeSelectInput
							v-model:queryForm="state.queryForm"
							:style="{ width: '220px' }"
							:settings="{
								getTreeData: getDicts,
								getTreeDataParams: 'platform_channel',
								text: '平台渠道',
								width: '220px',
								searchFn: register?.getDataList,
								code: 'platformChannelCodes',
								selectTreeProps: {
									value: 'value',
									label: 'label',
									children: 'children',
								},
								getIdsCode: 'value',
							}"
						/> -->
					</el-form-item>
					<el-form-item>
						<CustomCascaderApi
							v-model:queryForm="state.queryForm"
							:data="storeData"
							:settings="{
								code: 'storeIds',
								text: '站点/店铺',
								width: '240px',
								props: {
									value: 'id',
									label: 'name',
									children: 'children',
								},
								checkStrictly: false,
								showSelectAll: false,
							}"
							@change="register?.getDataList"
						/>
					</el-form-item>
					<el-form-item prop="skuBrandCodes">
						<TreeSelectInputApi
							v-model:queryForm="state.queryForm"
							componentType="brand"
							:settings="{
								code: 'skuBrandCodes',
								text: '品牌',
								searchFn: register?.getDataList,
							}"
						></TreeSelectInputApi>
						<!-- <TreeSelectInput
							v-model:queryForm="state.queryForm"
							:style="{ width: '220px' }"
							:settings="{
									getTreeData: getBrandAllList,
									text: '品牌',
									width: '220px',
									searchFn: register?.getDataList,
									code: 'skuBrandCodes',
									selectTreeProps: {
										value: 'brandCode',
										label: 'brandName',
										children: 'children',
									},
									getIdsCode: 'brandCode',
                  renderData: (data: any) => {
										return data.map((item: any) => {
											return {
												...item,
												brandName: `${item.brandCode} - ${item.brandName}`,
											};
										});
									},
								}"
						/> -->
					</el-form-item>
					<el-form-item prop="skuCategoryCodes">
						<TreeSelectInputApi
							v-model:queryForm="state.queryForm"
							:style="{ width: '220px' }"
							:settings="{
								getTreeData: getCategoryTree,
								text: '类目',
								width: '220px',
								searchFn: register?.getDataList,
								code: 'skuCategoryCodes',
								selectTreeProps: {
									value: 'id',
									label: 'name',
									children: 'children',
								},
								getIdsCode: 'id',
							}"
						/>
					</el-form-item>
					<el-form-item>
						<CustomCascaderApi
							:style="{ width: '220px' }"
							v-model:queryForm="state.queryForm"
							:data="tagData"
							:settings="{
								code: 'tagIds',
								text: '一级原因&二级原因',
								width: '190px',
								props: {
									value: 'id',
									label: 'name',
									children: 'children',
								},
								checkStrictly: false,
								showSelectAll: false,
							}"
							@change="register?.getDataList"
						/>
					</el-form-item>
					<el-form-item prop="processStatuses">
						<el-select
							v-model="state.queryForm.processStatuses"
							filterable
							clearable
							multiple
							placeholder="处理进度"
							@change="register?.getDataList"
						>
							<el-option
								v-for="item in STATUS_MAP"
								:key="item.value"
								:label="item.label"
								:value="item.value"
							/>
						</el-select>
					</el-form-item>
					<el-form-item>
						<div class="flex item-center">
							<SelectInput
								v-model:queryForm="state.queryForm"
								:searchTypes="[
									{
										label: '平台订单号',
										value: 'relatedOrderNos',
									},
									{
										label: '工单编号',
										value: 'orderNos',
									},
								]"
								:getDataList="register?.getDataList"
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
										value: 'skuName',
									},
								]"
								:getDataList="register?.getDataList"
							/>
						</div>
					</el-form-item>
					<el-form-item>
						<div class="flex item-center">
							<SelectInput
								v-model:queryForm="state.queryForm"
								:searchTypes="[
									{
										label: '中文描述',
										value: 'chineseDescription',
									},
									{
										label: '英文描述',
										value: 'englishDescription',
									},
									{
										label: '内部备注',
										value: 'remark',
									},
								]"
								:showAppend="false"
								:showExpand="false"
								:getDataList="register?.getDataList"
							/>
						</div>
					</el-form-item>
					<el-form-item>
						<div class="flex item-center">
							<SelectInput
								v-model:queryForm="state.queryForm"
								:searchTypes="[
									{
										label: '邮箱',
										value: 'emails',
									},
								]"
								:showAppend="false"
								:getDataList="register?.getDataList"
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
										defaultDaysAgo: 7,
									},
									{
										label: '截止时间',
										value: 'deadlineTime',
										isAddHMS: true,
										dateStart: 'deadlineTimeStart',
										dateEnd: 'deadlineTimeEnd',
										defaultDaysAgo: 7,
									},
									{
										label: '解决时间',
										value: 'handlerTime',
										isAddHMS: true,
										dateStart: 'handlerTimeStart',
										dateEnd: 'handlerTimeEnd',
										defaultDaysAgo: 7,
									},
									{
										label: '补发新机时间',
										value: 'reshipNewTime',
										isAddHMS: true,
										dateStart: 'reshipNewTimeStart',
										dateEnd: 'reshipNewTimeEnd',
										defaultDaysAgo: 7,
									},
									{
										label: '补发配件时间',
										value: 'reshipPartTime',
										isAddHMS: true,
										dateStart: 'reshipPartTimeStart',
										dateEnd: 'reshipPartTimeEnd',
										defaultDaysAgo: 7,
									},
								]"
								:getDataList="register?.getDataList"
							/>
						</div>
					</el-form-item>
					<el-form-item>
						<el-button @click="register?.getDataList" type="primary"
							>{{ $t('搜索') }}
						</el-button>
						<el-button @click="resetQuery" type="info" plain
							>{{ $t('common.resetBtn') }}
						</el-button>
					</el-form-item>
				</el-form>
			</el-row>
			<BaseTable
				:register="register"
				ref="tableRef"
				:columns="columns"
				:cell-config="{
					height: 75,
				}"
			>
				<template #left-tool>
					<el-button
						type="primary"
						class="ml10"
						@click="openDialog('add')"
						v-auth="'workOrder_add'"
						>{{ $t('新增工单') }}
					</el-button>
					<el-dropdown class="ml10">
						<el-button v-if="auths(['workOrder_changeStatus'])">
							{{ $t('批量操作') }}
							<el-icon class="el-icon--right">
								<arrow-down />
							</el-icon>
						</el-button>
						<template #dropdown>
							<el-dropdown-menu>
								<el-dropdown-item
									v-if="auth('workOrder_changeStatus')"
									@click="openDialog('processing')"
									>{{ $t('提交为处理中') }}</el-dropdown-item
								>
								<el-dropdown-item
									@click="openDialog('exception')"
									v-if="auth('workOrder_changeStatus')"
									>{{ $t('提交为处理异常') }}</el-dropdown-item
								>
								<el-dropdown-item
									@click="openDialog('solved')"
									v-if="auth('workOrder_changeStatus')"
									>{{ $t('提交为已解决') }}</el-dropdown-item
								>
							</el-dropdown-menu>
						</template>
					</el-dropdown>
					<el-dropdown>
						<el-button
							class="ml10"
							v-if="auths(['workOrder_importOrder', 'workOrder_solutions'])"
							>{{ $t('导入')
							}}<el-icon class="el-icon--right"> <arrow-down /> </el-icon
						></el-button>
						<template #dropdown>
							<el-dropdown-menu>
								<el-dropdown-item
									@click="openDialog('importOrder')"
									v-if="auth('workOrder_importOrder')"
									>{{ $t('导入工单信息') }}</el-dropdown-item
								>
								<el-dropdown-item
									@click="openDialog('solutions')"
									v-if="auth('workOrder_solutions')"
									>{{ $t('导入解决方案') }}</el-dropdown-item
								>
							</el-dropdown-menu>
						</template>
					</el-dropdown>
					<!-- <el-button type="primary" class="ml10" @click="openExportDialog"
						>{{ $t('导出') }}
					</el-button> -->
				</template>
				<template #skus="{ row }">
					<div v-if="row.skus && row.skus.length > 0">
						<!-- SKU Line -->
						<div class="flex items-center">
							<span class="mr-2">{{ row.skus[0].skuCode }}</span>
							<el-tooltip
								v-if="row.skus.length > 1"
								placement="bottom"
								effect="light"
							>
								<template #content>
									<div
										v-for="item in row.skus.slice(1)"
										:key="item.skuId"
										class="mb-1"
									>
										{{ item.skuCode }}
									</div>
								</template>
								<el-icon class="cursor-pointer text-gray-400">
									<ArrowDown />
								</el-icon>
							</el-tooltip>
						</div>
						<!-- Product Name Line -->
						<div class="flex items-center mt-1">
							<MrTextEllipsis
								:text="row.skus[0].skuName || '---'"
								:maxLength="30"
							/>
							<el-tooltip
								v-if="row.skus.length > 1"
								placement="bottom"
								effect="light"
							>
								<template #content>
									<div
										v-for="item in row.skus.slice(1)"
										:key="item.skuId"
										class="mb-1"
									>
										{{ item.skuName }}
									</div>
								</template>
								<el-icon class="cursor-pointer text-gray-400">
									<ArrowDown />
								</el-icon>
							</el-tooltip>
						</div>
					</div>
				</template>
				<template #skuCategory="{ row }">
					<div class="flex items-center">
						<span class="mr-2" v-if="row.skus && row.skus.length > 0">{{
							row.skus[0].skuCategory
						}}</span>
						<el-tooltip
							v-if="row.skus && row.skus.length > 1"
							placement="bottom"
							effect="light"
						>
							<template #content>
								<div
									v-for="item in row.skus.slice(1)"
									:key="item.skuId"
									class="mb-1"
								>
									{{ item.skuCategory }}
								</div>
							</template>
							<el-icon class="cursor-pointer text-gray-400">
								<ArrowDown />
							</el-icon>
						</el-tooltip>
					</div>
				</template>
				<template #skuBrand="{ row }">
					<div class="flex items-center">
						<span class="mr-2" v-if="row.skus && row.skus.length > 0">{{
							row.skus[0].skuBrand
						}}</span>
						<el-tooltip
							v-if="row.skus && row.skus.length > 1"
							placement="bottom"
							effect="light"
						>
							<template #content>
								<div
									v-for="item in row.skus.slice(1)"
									:key="item.skuId"
									class="mb-1"
								>
									{{ item.skuBrand }}
								</div>
							</template>
							<el-icon class="cursor-pointer text-gray-400">
								<ArrowDown />
							</el-icon>
						</el-tooltip>
					</div>
				</template>
				<template #oneTags="{ row }">
					<div class="flex items-center">
						<span class="mr-2" v-if="row.oneTags && row.oneTags.length > 0">{{
							row.oneTags[0]
						}}</span>
						<el-tooltip
							v-if="row.oneTags && row.oneTags.length > 1"
							placement="bottom"
							effect="light"
						>
							<template #content>
								<div
									v-for="(item, index) in row.oneTags.slice(1)"
									:key="index"
									class="mb-1"
								>
									{{ item }}
								</div>
							</template>
							<el-icon class="cursor-pointer text-gray-400">
								<ArrowDown />
							</el-icon>
						</el-tooltip>
					</div>
				</template>
				<template #twoTags="{ row }">
					<div class="flex items-center">
						<span class="mr-2" v-if="row.twoTags && row.twoTags.length > 0">{{
							row.twoTags[0]
						}}</span>
						<el-tooltip
							v-if="row.twoTags && row.twoTags.length > 1"
							placement="bottom"
							effect="light"
						>
							<template #content>
								<div
									v-for="(item, index) in row.twoTags.slice(1)"
									:key="index"
									class="mb-1"
								>
									{{ item }}
								</div>
							</template>
							<el-icon class="cursor-pointer text-gray-400">
								<ArrowDown />
							</el-icon>
						</el-tooltip>
					</div>
				</template>
				<template #processStatus="{ row }">
					<el-select
						v-model="row.processStatus"
						style="width: 120px"
						:disabled="
							!auth('workOrder_changeStatus') || row.processStatus === 4
						"
					>
						<el-option
							v-for="item in getStatusOptions(row.processStatus)"
							:key="item.value"
							:label="item.label"
							:value="item.value"
							@click.native="handleStatusChange(item, row)"
						/>
					</el-select>
					<!-- 剩余时间/超时提示 -->
					<div v-if="showRemainTime(row)" style="margin-top: 4px">
						<span
							:style="isTimeout(row) ? 'color: #f56c6c; font-size: 12px;' : ''"
						>
							{{ getRemainTimeText(row) }}
						</span>
					</div>
				</template>
				<template #action="{ row }">
					<div class="flex items-center">
						<el-button
							text
							type="primary"
							@click="openDialog('detail', row)"
							v-auth="'workOrder_detail'"
							>{{ $t('详情') }}
						</el-button>
						<el-dropdown placement="bottom-end">
							<el-button
								text
								type="primary"
								v-if="
									auths(['workOrder_edit', 'workOrder_copy', 'workOrder_log'])
								"
								>{{ $t('操作') }}
								<el-icon class="el-icon--right">
									<arrow-down />
								</el-icon>
							</el-button>
							<template #dropdown>
								<el-dropdown-menu>
									<el-dropdown-item
										@click="openDialog('edit', row)"
										v-if="auth('workOrder_edit') && row.processStatus !== 4"
										>{{ $t('编辑') }}</el-dropdown-item
									>
									<el-dropdown-item
										@click="openDialog('copy', row)"
										v-if="auth('workOrder_copy')"
										>{{ $t('复制') }}</el-dropdown-item
									>
									<el-dropdown-item
										@click="openDialog('log', row)"
										v-if="auth('workOrder_log')"
										>{{ $t('日志') }}</el-dropdown-item
									>
								</el-dropdown-menu>
							</template>
						</el-dropdown>
					</div>
				</template>
			</BaseTable>
		</div>
		<!-- 自定义导出工单 -->
		<ExportFieldsDialog
			v-model="exportVisible"
			:modules="exportModules"
			title="自定义导出工单"
			@confirm="handleExportConfirm"
		/>
		<!-- 新增工单弹窗 -->
		<AddWorkOrderDialog
			:dialogType="dialogType"
			:dictMap="dictMap"
			:currentRow="currentRow"
			:title="dialogTitle"
			:storeData="storeData"
			ref="addWorkOrderDialogRef"
			@success="handleAddSuccess"
		/>
		<!-- 导入弹窗 -->
		<ImportDialog
			ref="importDialogRef"
			:title="importTitle"
			:templateUrl="
				importTitle === '导入解决方案'
					? '/files/import-template/工单解决方案导入模板.xlsx'
					: '/files/import-template/客诉工单导入模板.xlsx'
			"
			:excelUploadApi="
				importTitle === '导入解决方案'
					? '/customer-service/order/import-action'
					: '/customer-service/order/import-order'
			"
			@refreshDataList="register?.getDataList"
		/>
		<confirm-dialog
			:title="`提交为${statusTitle}`"
			width="20%"
			ref="statusRef"
			:show-icon="true"
			@cancel="
				() => {
					statusRef.hide();
					register?.getDataList();
				}
			"
			@confirm="handleConfirmStatus"
		>
			<div>确认将工单进度调整为{{ statusTitle }}吗？</div>
		</confirm-dialog>
		<!-- 日志对话框 -->
		<LogDialog
			v-model="logDialogVisible"
			:id="currentRow.id"
			:biz-type="['CUSTOMER_SERVICE_ORDER']"
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
import { columns } from './config/TableColumn';
import { exportModules } from './config/export';
import { ref, reactive } from 'vue';
import { useNow } from '@vueuse/core';
// import { getGroupStoreByPlatform } from '/@/api/base/store/index';
import { useMultipleDicts } from '/@/hooks/multipleDicts';
import { getDicts } from '/@/api/admin/dict';
import { sysCountryList } from '/@/api/materialFlow/track';
import { useMessage } from '/@/hooks/message';
import { getCategoryTree } from '/@/api/product/category';
import { getUserListByCondition } from '/@/api/admin/user';
import { getListByCondition } from '/@/api/purchase/supplierSku/index';
import { getListByCondition as getSiteList } from '/@/api/mcp/collectionPlan';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { useI18n } from 'vue-i18n';
import {
	getCustomerServiceOrderPage,
	orderInfo,
	statusOrderUpdate,
	exporOrder,
} from '/@/api/customerService/workOrder/index';
import { getAllTag } from '/@/api/customerService/orderSetting/index';
import { auth, auths } from '/@/utils/authFunction';
const { t } = useI18n();

dayjs.extend(duration);

// 导入弹窗
const ImportDialog = defineAsyncComponent(
	() => import('/@/components/fileUpload/importDialog.vue')
);
//新增弹窗
const AddWorkOrderDialog = defineAsyncComponent(
	() => import('./components/add-dialog/index.vue')
);
// 导出弹窗
const ExportFieldsDialog = defineAsyncComponent(
	() => import('./components/ExportFieldsDialog/index.vue')
);
// 确认弹窗
const ConfirmDialog = defineAsyncComponent(
	() => import('/@/components/ConfirmDialog/index.vue')
);

const LogDialog = defineAsyncComponent(
	() => import('/@/components/log/log-dialog.vue')
);

const MrTextEllipsis = defineAsyncComponent(
	() => import('/@/common/MrTextEllipsis/index.vue')
);

const TreeSelectInputApi = defineAsyncComponent(
	() => import('/@/componentsApi/TreeSelectInputApi/index.vue')
);

const CustomCascaderApi = defineAsyncComponent(
	() => import('/@/componentsApi/customCascaderApi/index.vue')
);
// 搜索变量
const queryRef = ref();
// table的引用
const tableRef = ref();
// 是否显示搜索
const showSearch = ref(true);

const state: BasicTableProps = reactive<BasicTableProps>({
	pageList: getCustomerServiceOrderPage,
	columns,
	toolBarConfig: {
		handleRefresh: () => {
			register?.getDataList();
		},
		handleExport: () => {
			handleExport();
		},
		settingKey: 'work-order-list',
	},
	descs: ['t1.create_time'],
});
//  table hook
const { register, tableRef: baseTableRef } = useTable(state, tableRef);

//   初始化数据
const { dictMap } = useMultipleDicts(
	[
		{
			key: 'platform',
			fetchFn: getDicts,
			params: 'platform_channel',
		}, // 平台渠道
		{
			key: 'countryList',
			fetchFn: sysCountryList,
		}, // 国家列表
		{
			key: 'currencyOptions',
			fetchFn: getListByCondition,
		}, // 币种
	],
	{
		isAuto: true,
		tableRef: register.tableRef,
	}
);

onMounted(() => {
	// 初始加载站点数据
	loadStoreData();
	loadTagData();
});

// 站点数据
const storeData = ref<Array<any>>([]);
// 站点选择相关
const loadStoreData = async () => {
	getPlatformTree();
};

const getPlatformTree = async () => {
	const [platformRes, siteRes]: any = await Promise.all([
		getDicts('platform_channel'),
		getSiteList({}),
	]);

	const platformList = Array.isArray(platformRes?.data) ? platformRes.data : [];
	const siteList = Array.isArray(siteRes?.data) ? siteRes.data : [];

	// 先按平台分组站点
	const siteMap: Record<string, any[]> = {};

	siteList.forEach((site: any) => {
		const key = site.platformChannelCode;

		if (!siteMap[key]) {
			siteMap[key] = [];
		}

		siteMap[key].push({
			id: site.id,
			name: `${site.storeName}：${site.siteCode}`,
		});
	});

	// 生成树
	storeData.value = platformList
		.filter((platform: any) => siteMap[platform.value]?.length)
		.map((platform: any) => ({
			id: platform.value,
			name: platform.label,
			children: siteMap[platform.value],
		}));
};

// 标签数据
const tagData = ref<Array<any>>([]);
// 站点选择相关
const loadTagData = async () => {
	try {
		const res = await getAllTag({
			status: 1,
		});
		tagData.value = res.data.map((item: any) => ({
			id: item.id,
			name: item.tagName,
			children: item.children.map((val: any) => ({
				id: val.id,
				name: val.tagName,
			})),
		}));
	} catch (error) {
		tagData.value = [];
	}
};

// 导出弹窗
const exportVisible = ref(false);

// 新增弹窗
const addWorkOrderDialogRef = ref();
const dialogType = ref('add');
const dialogTitle = ref('新增工单');

const currentRow = ref<any>({});

// 导入弹窗
const importDialogRef = ref();
const importTitle = ref('导入工单信息');

// 日志弹窗
const logDialogVisible = ref(false);

// 打开弹窗
const openDialog = async (type: string, row?: any) => {
	if (type === 'add') {
		// 新增工单
		dialogType.value = type;
		dialogTitle.value = '新增工单';
		await new Promise((resolve) => setTimeout(resolve, 0));
		addWorkOrderDialogRef.value.handleOpen();
	} else if (type === 'edit') {
		// 编辑工单
		dialogType.value = type;
		const res = await orderInfo({
			orderNo: row.orderNo,
		});
		if (res.code === 0) {
			currentRow.value = res.data;
		}
		dialogTitle.value = '编辑工单';
		await new Promise((resolve) => setTimeout(resolve, 0));
		addWorkOrderDialogRef.value.handleOpen();
	} else if (type === 'copy') {
		// 复制工单
		dialogType.value = type;
		const res = await orderInfo({
			orderNo: row.orderNo,
		});
		if (res.code === 0) {
			currentRow.value = res.data;
		}
		dialogTitle.value = '复制工单';
		await new Promise((resolve) => setTimeout(resolve, 0));
		addWorkOrderDialogRef.value.handleOpen();
	} else if (type === 'detail') {
		// 详情
		dialogType.value = type;
		const res = await orderInfo({
			orderNo: row.orderNo,
		});
		if (res.code === 0) {
			currentRow.value = res.data;
		}
		dialogTitle.value = '工单详情';
		await new Promise((resolve) => setTimeout(resolve, 0));
		addWorkOrderDialogRef.value.handleOpen();
	} else if (type === 'importOrder') {
		// 导入工单信息
		importDialogRef.value.show();
		importTitle.value = '导入工单信息';
	} else if (type === 'solutions') {
		// 导入解决方案
		importDialogRef.value.show();
		importTitle.value = '导入解决方案';
	} else if (
		type === 'processing' ||
		type === 'exception' ||
		type === 'solved'
	) {
		const selectedRows = baseTableRef.value?.getCheckboxRecords();
		const ids = selectedRows?.map((item: any) => item.id);

		if (!ids || ids.length === 0) {
			useMessage().warning('请选择工单');
			return;
		}

		if (type === 'processing') {
			// 只有待处理(1)和处理异常(3)的状态可以提交为处理中
			if (
				selectedRows.some(
					(row: any) => row.processStatus !== 1 && row.processStatus !== 3
				)
			) {
				useMessage().warning('只有待处理和处理异常的状态可以提交为处理中');
				return;
			}
			statusValue.value = 2;
		} else if (type === 'exception') {
			// 只有待处理(1)和处理中(2)的状态可以提交为处理异常
			if (
				selectedRows.some(
					(row: any) => row.processStatus !== 1 && row.processStatus !== 2
				)
			) {
				useMessage().warning('只有待处理和处理中的状态可以提交为处理异常');
				return;
			}
			statusValue.value = 3;
		} else if (type === 'solved') {
			// 只有待处理(1)，处理中(2)，处理异常(3)可以提交为已解决
			if (
				selectedRows.some(
					(row: any) =>
						row.processStatus !== 1 &&
						row.processStatus !== 2 &&
						row.processStatus !== 3
				)
			) {
				useMessage().warning('只有待处理，处理中，处理异常可以提交为已解决');
				return;
			}
			statusValue.value = 4;
		}

		// 提交为处理中/处理异常/已解决
		statusRef.value.show();
		statusTitle.value = t(
			`${
				type === 'processing'
					? '处理中'
					: type === 'exception'
					? '处理异常'
					: '已解决'
			}`
		);
	} else if (type === 'log') {
		// 日志
		logDialogVisible.value = true;
		currentRow.value = row;
	}
};

const handleAddSuccess = () => {
	register?.getDataList();
};

// const openExportDialog = () => {
// 	exportVisible.value = true;
// };

// 导出确认
const handleExportConfirm = async () => {
	try {
		// 显示加载状态
		state.loading = true;
	} catch (error) {
		useMessage().error(`导出失败: ${error}`);
	} finally {
		// 隐藏加载状态
		state.loading = false;
	}
};

// 处理进度下拉选项
const STATUS_MAP = [
	{ label: '处理中', value: 2 },
	{ label: '处理异常', value: 3 },
	{ label: '已解决', value: 4 },
];

// 处理进度下拉选项过滤
const getStatusOptions = (current: number) => {
	if (current === 2 || current === 3 || current === 4) {
		return STATUS_MAP.filter((i) => i.value !== 1);
	}
	return STATUS_MAP;
};

// 状态改变弹窗title
const statusTitle = ref();
const statusValue = ref();
// 状态改变弹窗ref
const statusRef = ref();
// 状态切换
const handleStatusChange = (item: any, row: any) => {
	currentRow.value = row;
	statusTitle.value = item.label;
	statusValue.value = item.value;
	statusRef.value.show();
};
// 切换状态
const handleConfirmStatus = async () => {
	const selectedRows = baseTableRef.value?.getCheckboxRecords();
	let orderNos;
	if (!selectedRows.length) {
		orderNos = [currentRow.value.orderNo];
	} else {
		orderNos = selectedRows.map((item: any) => item.orderNo);
	}
	try {
		const res = await statusOrderUpdate({
			orderNos: orderNos,
			status: statusValue.value,
		});
		if (res.code === 0) {
			useMessage().success(t('操作成功'));
		}
		statusRef.value.hide();
		register?.getDataList();
	} catch (error: any) {
		useMessage().error(error?.msg || t('操作失败'));
	}
};
// 是否显示剩余/超时
const showRemainTime = (row: any) => {
	return (
		(row.processStatusDesc === '处理中' ||
			row.processStatusDesc === '处理异常') &&
		!!row.deadlineTime
	);
};
// 是否超时
const isTimeout = (row: any) => {
	if (!row.deadlineTime) return false;
	return dayjs().isAfter(dayjs(row.deadlineTime));
};

// 每秒更新一次的响应式时间对象
// dayjs() 获取当前时间是一个静态值，不会随时间自动更新。 使用 computed无法实时更新，
// 需要使用 useNow 来实现实时更新（useNow 会返回一个响应式的时间对象，每秒更新一次）
const now = useNow({ interval: 1000 });

// 剩余/超时文本
const getRemainTimeText = (row: any) => {
	if (!row.deadlineTime) return '';
	const currentTime = dayjs(now.value);
	const deadline = dayjs(row.deadlineTime);
	if (currentTime.isBefore(deadline)) {
		const diff = deadline.diff(currentTime);
		return `剩余处理时间：${formatDuration(diff)}`;
	} else {
		const diff = currentTime.diff(deadline);
		return `已超时：${formatDuration(diff)}`;
	}
};
// 只显示到分，不显示秒
const formatDuration = (ms: number) => {
	const totalMinutes = Math.floor(ms / 1000 / 60);
	const days = Math.floor(totalMinutes / (60 * 24));
	const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
	const minutes = totalMinutes % 60;
	let str = '';
	if (days > 0) str += `${days}天`;
	if (hours > 0) str += `${hours}小时`;
	str += `${minutes}分`;
	return str;
};

// 重置
// 清空搜索条件
const resetQuery = () => {
	register?.resetTableQuery(() => {
		return {
			queryForm: {
				current: 1,
				size: 10,
			},
			ascs: [],
			descs: [],
		};
	});
};

// 导出
const handleExport = async () => {
	try {
		// 显示加载状态
		state.loading = true;
		const ids = register?.getSelectedIds();
		// 发送请求，设置 responseType 为 'blob' 以接收二进制流
		await exporOrder({
			ids,
			...state.queryForm,
			ascs: state?.ascs,
			descs: state?.descs,
			current: 1,
			size: 10000,
		});
	} catch (error) {
		useMessage().error(`导出失败: ${error}`);
	} finally {
		// 隐藏加载状态
		state.loading = false;
	}
};
</script>

<style lang="scss" scoped>
.text-blue {
	color: #0089ef;
	word-break: break-all;
	white-space: pre-line;
	cursor: pointer;
	text-align: left;
}
.el-dropdown-link {
	cursor: pointer;
	color: var(--el-color-primary);
	display: flex;
	align-items: center;
}
</style>
