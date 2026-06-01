<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<!-- 查询区 -->
			<el-row class="ml10" v-show="showSearch">
				<el-form
					:inline="true"
					:model="state.queryForm"
					@keyup.enter="getDataList"
					ref="queryRef"
				>
					<AdvancedSearchStyle ref="advancedSearchStyleRef">
						<template #default>
							<el-form-item>
								<SelectInput
									v-model:queryForm="state.queryForm"
									:searchTypes="[
										{ label: '发货单号', value: 'deliveryNos' },
										{ label: '提货单号', value: 'pickupNos' },
										{ label: '采购单号', value: 'purchaseNos' },
										{ label: '需求单号', value: 'demandNos' },
										{ label: '订柜号', value: 'orderContainerNos' },
										{ label: '柜号', value: 'containerNos' },
										{ label: '封条号', value: 'sealNos' },
										{ label: 'SO号', value: 'soNos' },
									]"
									:getDataList="getDataList"
								/>
							</el-form-item>
							<el-form-item>
								<SelectInput
									v-model:queryForm="state.queryForm"
									:searchTypes="[
										{ label: 'SKU', value: 'skuCodes' },
										{ label: 'MSKU', value: 'mskuCodes' },
									]"
									:getDataList="getDataList"
								/>
							</el-form-item>
							<el-form-item>
								<TreeSelectInputApi
									v-model:queryForm="state.queryForm"
									componentType="dicts"
									:settings="{
										width: '220px',
										code: 'statusList',
										text: '状态',
										getTreeDataParams: 'delivered_plan_status',
										searchFn: getDataList,
									}"
								/>
							</el-form-item>
							<el-form-item>
								<TreeSelectInputApi
									v-model:queryForm="state.queryForm"
									componentType="country"
									:settings="{
										width: '200px',
										code: 'countryCodes',
										text: '国家',
										searchFn: getDataList,
									}"
								/>
							</el-form-item>
							<el-form-item>
								<TreeSelectInputApi
									v-model:queryForm="state.queryForm"
									componentType="dicts"
									:settings="{
										width: '220px',
										code: 'platformChannelCodes',
										text: '平台渠道',
										getTreeDataParams: 'platform_channel',
										searchFn: getDataList,
									}"
								/>
							</el-form-item>
							<el-form-item>
								<TreeSelectInputApi
									v-model:queryForm="state.queryForm"
									componentType="dicts"
									:settings="{
										width: '220px',
										code: 'shippingMethods',
										text: '发货方式',
										getTreeDataParams: 'shipping_method',
										searchFn: getDataList,
									}"
								/>
							</el-form-item>
							<el-form-item>
								<TreeSelectInputApi
									v-model:queryForm="state.queryForm"
									componentType="warehouseQianyi"
									:settings="{
										width: '220px',
										code: 'destWarehouseCodes',
										text: '目的仓',
										searchFn: getDataList,
									}"
								/>
							</el-form-item>
							<el-form-item>
								<TreeSelectInputApi
									v-model:queryForm="state.queryForm"
									componentType="basePort"
									:settings="{
										code: 'startPortCodes',
										text: '起始港',
										searchFn: getDataList,
									}"
								/>
							</el-form-item>
							<el-form-item>
								<TreeSelectInputApi
									v-model:queryForm="state.queryForm"
									componentType="basePort"
									:settings="{
										code: 'destPortCodes',
										text: '目的港',
										searchFn: getDataList,
									}"
								/>
							</el-form-item>
						</template>
						<template #second>
							<el-form-item>
								<SelectCategory
									:queryForm="state.queryForm"
									:settings="{
										categoryStyle: { width: '150px' },
										optionStyle: { width: '220px' },
									}"
									:placeholder="'货代类型'"
									:categoryList="forwarderTypesOptions"
									:optionList="forwarderTypesList"
									:categoryFieldName="'forwarderType'"
									:optionFieldName="'forwarderOptList'"
									@categoryChangeItem="changeForwarderType"
									:getDataList="getDataList"
								/>
							</el-form-item>
							<el-form-item>
								<SelectDate
									v-model:queryForm="state.queryForm"
									:settings="{
										selectStyle: { width: '130px' },
										dateStyle: { width: '130px' },
									}"
									:searchTypes="dateSearchTypes"
									:getDataList="getDataList"
								/>
							</el-form-item>
							<el-form-item>
								<TreeSelectInputApi
									v-model:queryForm="state.queryForm"
									componentType="userList"
									:settings="{
										width: '220px',
										code: 'operationUserIds',
										text: '运营',
										getTreeDataParams: {
											lockFlag: 0,
										},
										searchFn: getDataList,
									}"
								/>
							</el-form-item>
							<el-form-item>
								<TreeSelectInputApi
									v-model:queryForm="state.queryForm"
									componentType="userList"
									:settings="{
										width: '220px',
										code: 'purchaseUserIds',
										text: '采购',
										getTreeDataParams: {
											postCodeList: [
												'PURCHASING_DIRECTOR',
												'PURCHASING_MANAGER',
												'PROCUREMENT_MANAGER',
												'PURCHASING_OFFICER',
											],
										},
										searchFn: getDataList,
									}"
								/>
							</el-form-item>
							<el-form-item>
								<TreeSelectInputApi
									v-model:queryForm="state.queryForm"
									componentType="userList"
									:settings="{
										width: '220px',
										code: 'createIds',
										text: '物控（创建人）',
										searchFn: getDataList,
									}"
								/>
							</el-form-item>
							<el-form-item>
								<TreeSelectInputApi
									v-model:queryForm="state.queryForm"
									componentType="userList"
									:settings="{
										width: '220px',
										code: 'logisticsUserIds',
										text: '物流',
										searchFn: getDataList,
									}"
								/>
							</el-form-item>
							<el-form-item>
								<el-tree-select
									@blur="getDataList"
									v-model="state.queryForm.deptIds"
									placeholder="部门和小组"
									show-checkbox
									fit-input-width
									clearable
									multiple
									collapse-tags
									:max-collapse-tags="1"
									style="width: 200px"
									filterable
									:props="{ children: 'children', label: 'name', value: 'id' }"
									:node-key="'id'"
									:data="dictMap.deptTree"
								/>
							</el-form-item>
						</template>
						<template #right>
							<el-form-item>
								<div class="flex item-center">
									<el-button @click="getDataList" type="primary">
										{{ $t('搜索') }}
									</el-button>
									<el-button @click="resetQuery" type="info" plain>
										{{ $t('common.resetBtn') }}
									</el-button>
									<el-button
										type="info"
										plain
										@click="advancedSearchStyleRef.changeSecondToggle()"
									>
										{{
											$t(advancedSearchStyleRef?.showSecond ? '收起' : '展开')
										}}
									</el-button>
								</div>
							</el-form-item>
						</template>
					</AdvancedSearchStyle>
				</el-form>
			</el-row>

			<!-- 列表区 -->
			<BaseTable :register="register" ref="baseTableRef">
				<template #countryCode="{ row }">
					{{ row.countryCode || '---' }}-{{ row.countryName || '---' }}
				</template>
				<template #destWarehouseNameList="{ row }">
					{{ row.destWarehouseNameList?.join('、') || '---' }}
				</template>
				<template #statusText="{ row }">
					{{ row.statusText || '---' }}
				</template>
				<template #action="{ row }">
					<el-button text type="primary" @click="openLog(row)">
						{{ $t('日志') }}
					</el-button>
				</template>
			</BaseTable>
		</div>

		<!-- 日志弹窗：查看已发货计划新增/修改记录 -->
		<LogDialog
			v-model="logDialogVisible"
			:id="currentRow.id"
			:biz-type="['LOGISTICS_DELIVERY_PLAN']"
			:showSearchForm="false"
			:showToolBar="false"
			@closeDialog="logDialogVisible = false"
		/>
	</div>
</template>

<script setup lang="ts">
import { reactive, ref, defineAsyncComponent } from 'vue';
import { useI18n } from 'vue-i18n';
import { deptTree } from '/@/api/admin/dept';
import { getForwarderList } from '/@/api/materialFlow/freightForwarder/index';
import {
	exportDeliveredPlan,
	getDeliveredPlanPage,
} from '/@/api/materialFlow/deliveredPlan/index';
import { useMessage } from '/@/hooks/message';
import {
	BasicTableProps,
	useTable,
} from '/@/components/BaseTable/hooks/BaseTable';
import { useMultipleDicts } from '/@/hooks/multipleDicts';
import { columns } from './config/index';

const BaseTable = defineAsyncComponent(
	() => import('/@/components/BaseTable/index.vue')
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
const AdvancedSearchStyle = defineAsyncComponent(
	() => import('/@/components/TableFormModule/advanced-search-style.vue')
);
const SelectCategory = defineAsyncComponent(
	() => import('/@/components/TableFormModule/select-category.vue')
);
const TreeSelectInputApi = defineAsyncComponent(
	() => import('/@/componentsApi/TreeSelectInputApi/index.vue')
);

// 页面基础状态
const { t } = useI18n();
const baseTableRef = ref();
const queryRef = ref();
const showSearch = ref(true);
const advancedSearchStyleRef = ref();
const logDialogVisible = ref(false);
const currentRow = ref<{ id?: string | number }>({});

// 时间筛选项：字段名需与 deliveredPlan 后端查询参数保持一致
const dateSearchTypes = [
	{
		label: '实际提货时间',
		value: 'actualPickupTime',
		isAddHMS: true,
		dateStart: 'actualPickupTimeStart',
		dateEnd: 'actualPickupTimeEnd',
		defaultMonthsAgo: 3,
	},
	{
		label: '实际装柜时间',
		value: 'actualLoadingTime',
		isAddHMS: true,
		dateStart: 'actualLoadingTimeStart',
		dateEnd: 'actualLoadingTimeEnd',
	},
	{
		label: '预计开船时间',
		value: 'estimatedDepartureTime',
		isAddHMS: true,
		dateStart: 'estimatedDepartureTimeStart',
		dateEnd: 'estimatedDepartureTimeEnd',
	},
	{
		label: '实际开船时间',
		value: 'actualDepartureTime',
		isAddHMS: true,
		dateStart: 'actualDepartureTimeStart',
		dateEnd: 'actualDepartureTimeEnd',
	},
	{
		label: '预计到港时间',
		value: 'estimatedArrivalTime',
		isAddHMS: true,
		dateStart: 'estimatedArrivalTimeStart',
		dateEnd: 'estimatedArrivalTimeEnd',
	},
	{
		label: '实际到港时间',
		value: 'actualArrivalTime',
		isAddHMS: true,
		dateStart: 'actualArrivalTimeStart',
		dateEnd: 'actualArrivalTimeEnd',
	},
	{
		label: '卸船时间',
		value: 'dischargingTime',
		isAddHMS: true,
		dateStart: 'dischargingTimeStart',
		dateEnd: 'dischargingTimeEnd',
	},
	{
		label: '提柜时间',
		value: 'containerPickupTime',
		isAddHMS: true,
		dateStart: 'containerPickupTimeStart',
		dateEnd: 'containerPickupTimeEnd',
	},
	{
		label: '到仓时间',
		value: 'arrivalWarehouseTime',
		isAddHMS: true,
		dateStart: 'arrivalWarehouseTimeStart',
		dateEnd: 'arrivalWarehouseTimeEnd',
	},
];

// BaseTable 配置：默认按实际提货时间倒序
const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {},
	pageList: getDeliveredPlanPage as any,
	columns,
	descs: ['actual_pickup_time', 'delivery_no'],
	ascs: [],
	toolBarConfig: {
		handleRefresh: () => {
			register?.getDataList();
		},
		handleExport: () => {
			handleExport();
		},
		settingKey: 'deliveredPlan-index',
	},
});

const { register, getDataList, resetTableQuery } = useTable(
	state,
	baseTableRef
);

const forwarderTypesList = ref<Array<{ label: string; value: string }>>([]);
// 硬编码写死的头大
const forwarderTypesOptions = ref<
	Array<{ label: string; value: string | number; prop: string | number }>
>([
	{ label: '国内拖车报关', value: 'DOMESTIC', prop: 1 },
	{ label: '海运/空运/铁路', value: 'MAIN', prop: 2 },
	{ label: '清关', value: 'CUSTOMS', prop: 3 },
	{ label: '国外拖车', value: 'DELIVERY', prop: 4 },
]);
// 修改货代类型
const changeForwarderType = async (selectedOption: any) => {
	const forwarderType = selectedOption?.prop;
	const res = await getForwarderList({
		forwarderTypes: [forwarderType],
	});
	forwarderTypesList.value =
		res.data.map((item: any) => {
			return {
				label: item.forwarderName,
				value: item.forwarderCode,
			};
		}) || [];
};
// 字典统一加载（与 deliveryPlan 保持一致写法）
const { dictMap } = useMultipleDicts(
	[
		{
			key: 'deptTree',
			fetchFn: deptTree,
			params: {
				deptName: '运营中心',
				showRootFlag: 0,
			},
		},
	],
	{
		isAuto: true,
	}
);

// 打开日志弹窗
const openLog = (row: any) => {
	currentRow.value = row || {};
	logDialogVisible.value = true;
};

// 重置查询：恢复分页与默认排序
const resetQuery = () => {
	resetTableQuery(() => ({
		queryForm: {
			current: 1,
			size: 10,
		},
		descs: ['actual_pickup_time', 'delivery_no'],
		ascs: [],
	}));
};

// 导出：沿用列表当前筛选条件与排序
const handleExport = async () => {
	try {
		const ids = register?.getSelectedIds() || [];
		register.state.loading = true;
		await exportDeliveredPlan({
			...register.state.queryForm,
			ids: ids.length > 0 ? ids : undefined,
			ascs: register.state.ascs,
			descs: register.state.descs,
			current: 1,
			size: 1000,
		});
	} catch (error: any) {
		useMessage().error(error?.msg || t('导出失败'));
	} finally {
		register.state.loading = false;
	}
};
</script>
