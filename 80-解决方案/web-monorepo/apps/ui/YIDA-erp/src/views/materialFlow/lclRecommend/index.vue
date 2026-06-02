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
										label: '发货单号',
										value: 'deliveryNos',
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
								]"
								:getDataList="getDataList"
							/>
						</div>
					</el-form-item>
					<el-form-item>
						<TreeSelectInputApi
							v-model:queryForm="state.queryForm"
							componentType="country"
							multiple
							@change="getDataList"
							:settings="{
								text: '国家',
								code: 'countryCodes',
								width: '200px',
							}"
						/>
					</el-form-item>
					<el-form-item>
						<TreeSelectInputApi
							v-model:queryForm="state.queryForm"
							componentType="dicts"
							multiple
							@change="getDataList"
							:settings="{
								text: '发货方式',
								code: 'shippingMethods',
								getTreeDataParams: 'shipping_method',
								width: '220px',
							}"
						/>
					</el-form-item>
					<el-form-item>
						<TreeSelectInputApi
							v-model:queryForm="state.queryForm"
							componentType="basePort"
							multiple
							@change="getDataList"
							:settings="{
								text: '起始港口',
								code: 'startPortCodes',
							}"
						/>
					</el-form-item>
					<el-form-item>
						<TreeSelectInputApi
							v-model:queryForm="state.queryForm"
							componentType="basePort"
							multiple
							@change="getDataList"
							:settings="{
								text: '目的港口',
								code: 'destPortCodes',
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
										label: '计划发货时间',
										value: 'planShipmentDate',
										isAddHMS: false,
										dateStart: 'planShipmentDateStart',
										dateEnd: 'planShipmentDateEnd',
									},
								]"
								:getDataList="getDataList"
							/>
						</div>
					</el-form-item>
					<el-form-item>
						<el-input
							v-model="state.queryForm.volumeUtilizationRate"
							placeholder="体积满柜率"
							style="width: 320px"
							clearable
							@keyup.enter="getDataList"
							type="number"
						>
							<template #prepend
								><div
									:style="{
										width: '80px',
										textAlign: 'center',
									}"
								>
									体积满柜率>=
								</div></template
							>
						</el-input>
					</el-form-item>
					<el-form-item>
						<el-input
							v-model="state.queryForm.weightUtilizationRate"
							placeholder="重量满柜率"
							style="width: 320px"
							clearable
							@keyup.enter="getDataList"
							type="number"
						>
							<template #prepend>
								<div
									:style="{
										width: '80px',
										textAlign: 'center',
									}"
								>
									重量满柜率>=
								</div>
							</template>
						</el-input>
					</el-form-item>
					<el-form-item>
						<div class="flex item-center">
							<el-button @click="getDataList" type="primary"
								>{{ $t('搜索') }}
							</el-button>
							<el-button @click="resetQuery" type="info" plain
								>{{ $t('common.resetBtn') }}
							</el-button>
						</div>
					</el-form-item>
				</el-form>
			</el-row>
			<el-row>
				<ToolBar @handleRefresh="getDataList" @handleExport="handleExport">
					<template #left-tool>
						<el-button
							class="ml10"
							@click="openDialog('recommend')"
							v-auth="'lclRecommend_recommend'"
						>
							{{ $t('重新推荐') }}</el-button
						>
						<el-button
							class="ml10"
							@click="openDialog('create')"
							v-auth="'lclRecommend_create'"
						>
							{{ $t('创建货柜') }}</el-button
						>
						<el-button
							class="ml10"
							@click="openDialog('join')"
							v-auth="'lclRecommend_join'"
						>
							{{ $t('加入货柜') }}</el-button
						>
						<el-button
							class="ml10"
							@click="openDialog('shift')"
							v-auth="'lclRecommend_shift'"
						>
							{{ $t('移出货柜') }}</el-button
						>
					</template>
				</ToolBar>
			</el-row>
			<el-table
				:data="state.dataList"
				@sort-change="sortChangeHandle"
				style="width: 100%"
				v-loading="state.loading"
				border
				row-key="id"
				ref="tableRef"
				:cell-style="tableStyle.cellStyle"
				:header-cell-style="tableStyle.headerCellStyle"
				@selection-change="(val:any) => (selectedRows = val)"
				:span-method="spanMethod"
				native-scrollbar
			>
				<el-table-column
					align="center"
					type="selection"
					width="40"
					reserve-selection
					fixed="left"
				/>
				<el-table-column
					prop="lclRecommendId"
					:label="t('拼柜概要')"
					show-overflow-tooltip
					width="300"
				>
					<template #default="{ row }">
						<div class="lclRecommend-cell">
							<el-form :model="row" label-width="100px">
								<el-row class="mb18">
									<el-col :span="24">
										<el-form-item label="预订柜:">
											<el-text truncated>{{ row.bookingNo }}</el-text>
										</el-form-item>
									</el-col>
								</el-row>
								<el-row class="mb18">
									<el-col :span="24">
										<el-form-item label="起始港:">
											<el-text truncated>{{ row.startPortText }}</el-text>
										</el-form-item>
									</el-col>
								</el-row>
								<el-row class="mb18">
									<el-col :span="24">
										<el-form-item label="目的港:">
											<el-text truncated>{{ row.destPortText }}</el-text>
										</el-form-item>
									</el-col>
								</el-row>
								<el-row class="mb18">
									<el-col :span="24">
										<el-form-item label="国家:">
											<el-text truncated
												>{{ row.recommendCountryCode }}-{{
													row.recommendCountryName
												}}</el-text
											>
										</el-form-item>
									</el-col>
								</el-row>
								<el-row class="mb18">
									<el-col :span="24">
										<el-form-item label="计划发货时间:">
											<el-text truncated>{{
												row.recommendPlanShipmentDate
											}}</el-text>
										</el-form-item>
									</el-col>
								</el-row>
								<el-row class="mb18">
									<el-col :span="24">
										<el-form-item label="体积满载率:">
											<el-text truncated
												>{{ row.volumeUtilizationRate }}%
												{{ row.recommendTotalVolume || 0 }}/{{
													row.internalCube || 0
												}}
												m³
											</el-text>
										</el-form-item>
									</el-col>
								</el-row>
								<el-row class="mb18">
									<el-col :span="24">
										<el-form-item label="重量满载率:">
											<el-text truncated
												>{{ row.weightUtilizationRate }}%
												{{ row.recommendTotalWeight || 0 }}/{{
													row.payloadCapacity || 0
												}}
												KG</el-text
											>
										</el-form-item>
									</el-col>
								</el-row>
							</el-form>
						</div>
					</template>
				</el-table-column>
				<el-table-column
					prop="deliveryNo"
					:label="t('发货单号')"
					show-overflow-tooltip
					width="180"
				>
					<template #default="{ row }">
						{{ row.deliveryNo || '---' }}
					</template>
				</el-table-column>
				<el-table-column
					prop="factoryName"
					:label="t('工厂名称')"
					show-overflow-tooltip
					width="180"
				>
					<template #default="{ row }">
						{{ row.factoryName || '---' }}
					</template>
				</el-table-column>
				<el-table-column
					prop="skuCode"
					:label="t('SKU/产品名称')"
					show-overflow-tooltip
					width="200"
				>
					<template #default="{ row }">
						<div
							style="
								display: flex;
								flex-direction: column;
								justify-content: center;
								align-items: flex-start;
								width: 100%;
							"
						>
							<div
								style="
									max-width: 100%;
									overflow: hidden;
									white-space: nowrap;
									text-overflow: ellipsis;
								"
							>
								{{ row.skuCode }}
							</div>
							<div
								style="
									max-width: 100%;
									overflow: hidden;
									white-space: nowrap;
									text-overflow: ellipsis;
								"
							>
								{{ row.skuName }}
							</div>
						</div>
					</template>
				</el-table-column>
				<el-table-column
					prop="factoryDeliveryDate"
					:label="t('工厂回复时间')"
					show-overflow-tooltip
					width="180"
				>
					<template #default="{ row }">
						{{ row.factoryDeliveryDate || '---' }}
					</template>
				</el-table-column>
				<el-table-column
					prop="planShipmentDate"
					:label="t('计划发货时间')"
					show-overflow-tooltip
					width="180"
				>
					<template #default="{ row }">
						{{ row.planShipmentDate || '---' }}
					</template>
				</el-table-column>
				<el-table-column
					prop="shippingMethod"
					:label="t('发货方式')"
					show-overflow-tooltip
					width="180"
				>
					<template #default="{ row }">
						{{ row.shippingMethodText || '---' }}
					</template>
				</el-table-column>
				<el-table-column
					prop="transportMethodText"
					:label="t('运输方式')"
					show-overflow-tooltip
					width="180"
				>
					<template #default="{ row }">
						{{ row.transportMethodText || '---' }}
					</template>
				</el-table-column>
				<el-table-column
					prop="startPort"
					:label="t('起始港')"
					show-overflow-tooltip
					width="180"
				>
					<template #default="{ row }">
						{{ row.startPortName || '---' }}
					</template>
				</el-table-column>
				<el-table-column
					prop="destPort"
					:label="t('目的港')"
					show-overflow-tooltip
					width="180"
				>
					<template #default="{ row }">
						{{ row.destPortName || '---' }}
					</template>
				</el-table-column>
				<el-table-column
					prop="countryCode"
					:label="t('目的国家')"
					show-overflow-tooltip
					width="180"
				>
					<template #default="{ row }">
						{{ row.countryCode || '---' }}-{{ row.countryName || '---' }}
					</template>
				</el-table-column>
				<el-table-column
					prop="platformChannelCode"
					:label="t('平台渠道')"
					show-overflow-tooltip
					width="180"
				>
					<template #default="{ row }">
						{{ row.platformChannelCodeText || '---' }}
					</template>
				</el-table-column>
				<el-table-column
					prop="shipmentQuantity"
					:label="t('发货数量')"
					show-overflow-tooltip
					width="180"
				>
					<template #default="{ row }">
						{{ row.shipmentQuantity || '---' }}
					</template>
				</el-table-column>
				<el-table-column
					prop="cartons"
					:label="t('总箱数')"
					show-overflow-tooltip
					width="180"
				>
					<template #default="{ row }"> {{ row.cartons || '---' }} </template>
				</el-table-column>
				<el-table-column
					prop="totalVolume"
					:label="t('总体积(m³)')"
					show-overflow-tooltip
					width="180"
				>
					<template #default="{ row }">
						{{ row.totalVolume || '---' }}
					</template>
				</el-table-column>
				<el-table-column
					prop="totalNetWeight"
					:label="t('总净重(KG)')"
					show-overflow-tooltip
					width="180"
				>
					<template #default="{ row }">
						{{ row.totalNetWeight || '---' }}
					</template>
				</el-table-column>
				<el-table-column
					prop="totalGrossWeight"
					:label="t('总毛重(KG)')"
					show-overflow-tooltip
					width="180"
				>
					<template #default="{ row }">
						{{ row.totalGrossWeight || '---' }}
					</template>
				</el-table-column>
				<el-table-column
					prop="createName"
					:label="t('创建人')"
					show-overflow-tooltip
					width="180"
				/>
				<el-table-column
					prop="createTime"
					:label="t('创建时间')"
					show-overflow-tooltip
					width="180"
				/>
			</el-table>
			<pagination
				@current-change="currentChangeHandle"
				@size-change="sizeChangeHandle"
				v-bind="state.pagination"
			/>
		</div>
		<!-- 创建货柜 -->
		<CreateContainer
			ref="createContainerRef"
			:selectedRows="selectedRows"
			:show-icon="false"
			:icon-type="'info'"
			:cancel-button-text="$t('取消')"
			:confirm-button-text="$t('确认')"
			:confirm-button-type="'primary'"
			width="80%"
			:dictMap="dictMap"
			@confirm="
				(e) => {
					confirmCreateContainer(e);
				}
			"
			@cancel="
				() => {
					createContainerRef.hide();
				}
			"
		/>
		<!-- 加入货柜 -->
		<JoinContainer
			ref="joinContainerRef"
			:selectedRows="selectedRows"
			:show-icon="false"
			:icon-type="'info'"
			:cancel-button-text="$t('取消')"
			:confirm-button-text="$t('确认')"
			:confirm-button-type="'primary'"
			width="80%"
			:dictMap="dictMap"
			@confirm="
				(e) => {
					confirmJoinContainer(e);
				}
			"
			@cancel="
				() => {
					joinContainerRef.hide();
				}
			"
		/>
	</div>
</template>

<script setup lang="ts">
import { BasicTableProps, useTable } from '/@/hooks/table';
import { useI18n } from 'vue-i18n';
import { defineAsyncComponent, ref, reactive } from 'vue';
import { useMessage, useMessageBox } from '/@/hooks/message';
import { deptTree } from '/@/api/admin/dept';
import { getDicts } from '/@/api/admin/dict';
import {
	postDeleteDeliveryPlan,
	getListByCondition,
	postOrderContainerCheckOrderContainer,
	postOrderContainerCheckOrderContainerState,
	postOrderContainerInsertOrderContainer,
} from '/@/api/materialFlow/deliveryPlan/index';
import {
	getLclRecommendPage,
	postAddContainer,
	postRemoveContainer,
	postRecommend,
	getExportCollectionPlan,
} from '/@/api/materialFlow/lclRecommend/index';
import { getUserListByCondition } from '/@/api/admin/user';
import { sysCountryList } from '/@/api/materialFlow/track';
import { useMultipleDicts } from '/@/hooks/multipleDicts';

import { useResultDialog } from '/@/hooks/useResultDialog';
const ToolBar = defineAsyncComponent(
	() => import('/@/components/ToolBar/tool-bar.vue')
);
const SelectDate = defineAsyncComponent(
	() => import('/@/components/TableFormModule/select-date.vue')
);
const SelectInput = defineAsyncComponent(
	() => import('/@/components/TableFormModule/select-input.vue')
);
const CreateContainer = defineAsyncComponent(
	() => import('./components/createContainer.vue')
);
const JoinContainer = defineAsyncComponent(
	() => import('./components/joinContainer.vue')
);
const TreeSelectInputApi = defineAsyncComponent(
	() => import('/@/componentsApi/TreeSelectInputApi/index.vue')
);
const { open } = useResultDialog();
// table的引用
const tableRef = ref();
const { dictMap } = useMultipleDicts(
	[
		{
			key: 'deptTree',
			fetchFn: deptTree,
			params: {
				deptName: '运营中心',
				showRootFlag: 0, // 是否显示根节点 1是展示 0不展示
			},
		}, // 部门树
		{
			key: 'countryList',
			fetchFn: sysCountryList,
		}, // 国家列表
		{
			key: 'platformChannel',
			fetchFn: getDicts,
			params: 'platform_channel',
		}, // 平台 渠道
		{
			key: 'deliveryPlanStatus',
			fetchFn: getDicts,
			params: 'delivery_plan_status',
		}, // 发货计划状态
		{
			key: 'shippingMethod',
			fetchFn: getDicts,
			params: 'shipping_method',
		}, // 发货方式
		{
			key: 'productManageId',
			fetchFn: getUserListByCondition,
			params: { lockFlag: 0 },
		}, // 人员列表
		{
			key: 'purchaseDemandStatus',
			fetchFn: getDicts,
			params: 'purchase_demand_status',
		}, // 需求计划的审批状态
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
			key: 'listByCondition',
			fetchFn: getListByCondition,
		}, // 国家港口列表
		{
			key: 'transportMethod',
			fetchFn: getDicts,
			params: 'transport_method',
		}, // 运输方式
	],
	{
		isAuto: true,
		tableRef,
	}
);
const { t } = useI18n();

// 搜索变量
const queryRef = ref();
// 是否显示搜索
const showSearch = ref(true);
// 创建货柜的引用
const createContainerRef = ref();
// 加入货柜的引用
const joinContainerRef = ref();
// 当前选中的行
const selectedRows = ref<Array<any>>([]);
// 当前点击的行
const currentRow = ref({
	id: '',
	shipmentQuantity: 0,
});
// 日志对话框是否可见
const logDialogVisible = ref(false);
const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {},
	pageList: getLclRecommendPage,
	loading: false,
	dataList: [],
	ascs: [],
	descs: ['volume_utilization_rate'],
});
//  table hook
const {
	getDataList,
	currentChangeHandle,
	sizeChangeHandle,
	sortChangeHandle,
	tableStyle,
} = useTable(state, tableRef);

// 重置
const resetQuery = () => {
	state.queryForm = {
		current: 1,
		size: 99999,
	};
	getDataList();
};
type Row = Record<string, any>;
type MergeDef = {
	/** 表格列的 prop（span-method 用 column.property 匹配） */
	prop: string;
	/** 可选：用于比较/分组的取值器（展示字段和 prop 不一致时用） */
	get?: (row: Row) => any;
};
/** 想合并的列（按顺序层层合并）——你可自由增删或调整顺序 */
const mergeDefs: MergeDef[] = [
	{ prop: 'lclRecommendId' }, // 拼柜概要（第一层）
	// { prop: 'deliveryNo' }, // 发货单号（在同一拼柜概要内继续合并）
	// { prop: 'planShipmentDate' }, // 计划发货时间（在同一拼柜概要内继续合并）
	// { prop: 'shippingMethod', get: (r) => r.shippingMethodText }, // 发货方式（列 prop 是 shippingMethod，但按 Text 合并）
	// { prop: 'transportMethodText' }, // 运输方式
	// { prop: 'startPort', get: (r) => r.startPortName }, // 起始港（按显示名合并）
	// { prop: 'destPort', get: (r) => r.destPortName }, // 目的港
	// { prop: 'platformChannelCode', get: (r) => r.platformChannelCodeText }, // 平台渠道
];

/** 空值是否也参与合并（默认 false：空值不合并） */
const mergeEmpty = false;

/** 预计算每一列、每一行的 rowspan */
const spansMap = computed(() =>
	calcSpans(state.dataList ?? [], mergeDefs, { mergeEmpty })
);

function calcSpans(
	data: Row[],
	defs: MergeDef[],
	opts: { mergeEmpty: boolean }
): Record<string, number[]> {
	const map: Record<string, number[]> = {};
	defs.forEach((d) => (map[d.prop] = Array(data.length).fill(1)));

	// 逐层细分区间：第一层以 [0, n) 为整体，之后每一层在上一层的子区间内继续按值分段
	let segments: Array<[number, number]> = [[0, data.length]];

	for (const def of defs) {
		const getVal = (idx: number) =>
			def.get ? def.get(data[idx]) : data[idx]?.[def.prop];
		const isEmpty = (v: any) => v === null || v === undefined || v === '';
		const newSegments: Array<[number, number]> = [];

		for (const [start, end] of segments) {
			let i = start;
			while (i < end) {
				const v0 = getVal(i);
				if (!opts.mergeEmpty && isEmpty(v0)) {
					map[def.prop][i] = 1;
					i++;
					continue;
				}
				let j = i + 1;
				while (
					j < end &&
					(opts.mergeEmpty || !isEmpty(getVal(j))) &&
					getVal(j) === v0
				)
					j++;

				const len = j - i;
				map[def.prop][i] = len;
				for (let k = i + 1; k < j; k++) map[def.prop][k] = 0;
				newSegments.push([i, j]); // 下一层在这个子区间内继续细分
				i = j;
			}
		}
		segments = newSegments;
	}
	return map;
}

/** 给 <el-table :span-method="spanMethod"> 使用 */
const spanMethod = ({
	column,
	rowIndex,
}: {
	column: any;
	rowIndex: number;
}) => {
	const arr = spansMap.value[column?.property];
	if (arr) {
		const rowspan = arr[rowIndex] ?? 1;
		return { rowspan, colspan: rowspan > 0 ? 1 : 0 };
	}
	return { rowspan: 1, colspan: 1 };
};
// 打开对话框
const openDialog = async (type: string, row?: any) => {
	try {
		if (type === 'del') {
			//
			const ids = selectedRows.value.map((item: any) => item.id);
			if (ids.length === 0) {
				useMessage().warning(t('请至少选择一条数据'));
				return;
			}
			await useMessageBox()
				.confirm(t('是否确认删除选中数据？'))
				.then(async () => {
					const res = await postDeleteDeliveryPlan({ ids });
					if (res.code === 0) {
						useMessage().success(t('删除成功'));
					}
					tableRef.value.clearSelection();
					getDataList();
				})
				.catch(() => {});
		} else if (type === 'log') {
			logDialogVisible.value = true;
			currentRow.value = row;
		} else if (type === 'create') {
			//
			// const ids = selectedRows.value.map((item: any) => item.id);
			// 创建货柜
			if (selectedRows.value.length === 0) {
				useMessage().warning(t('请至少选择一条数据'));
				return;
			}
			// 先拿到选中的所有的拼柜号id,如果有多个就提示不能创建
			const bookingNos = selectedRows.value.map((item: any) => item.bookingNo);
			const uniqueBookingNos = Array.from(new Set(bookingNos));
			if (uniqueBookingNos.length > 1) {
				useMessage().warning(t('只能选择同一预定柜号的数据创建货柜'));
				return;
			}
			// 根据拿到的拼柜号id去拿所有的货柜id
			const getAllIds = await getLclRecommendPage({
				bookingNo: uniqueBookingNos[0],
			});
			if (getAllIds.code === 0) {
				const getIds = getAllIds.data.records.map((item: any) => item.id);
				// 校验是否可以创建货柜
				const res = await postOrderContainerCheckOrderContainer({
					ids: getIds,
				});
				if (res.data?.failCount > 0) {
					// 打开提示框
					open({
						title: t('错误提示'),
						data: res.data,
					});
					return;
				}
				createContainerRef.value?.show(getIds);
			}
		} else if (type === 'join') {
			// 加入货柜
			if (selectedRows.value.length === 0) {
				useMessage().warning(t('请至少选择一条数据'));
				return;
			}
			// 校验是否可以加入货柜
			const ids = selectedRows.value.map((item: any) => item.id);
			const res = await postOrderContainerCheckOrderContainerState({
				ids,
			});
			if (res.data?.failCount > 0) {
				// 打开提示框
				open({
					title: t('错误提示'),
					data: res.data,
				});
				return;
			}
			joinContainerRef.value?.show();
		} else if (type === 'shift') {
			// 移出货柜
			const deliveryNos = selectedRows.value.map(
				(item: any) => item.deliveryNo
			);
			if (deliveryNos.length === 0) {
				useMessage().warning(t('请至少选择一条数据'));
				return;
			}
			const res = await postRemoveContainer({ deliveryNos });
			if (res.data?.failCount > 0) {
				// 打开提示框
				open({
					title: t('错误提示'),
					data: res.data,
				});
				tableRef.value.clearSelection();
				getDataList();
				return;
			}
			if (res.code === 0) {
				useMessage().success(t('移出成功'));
			}
			tableRef.value.clearSelection();
			getDataList();
		} else if (type === 'recommend') {
			await useMessageBox()
				.confirm(t('是否确认重新推荐？'))
				.then(async () => {
					const res = await postRecommend();
					if (res.code === 0) {
						useMessage().success(t('推荐成功'));
					}
					tableRef.value.clearSelection();
					getDataList();
				})
				.catch(() => {});
		}
	} catch (error: any) {
		useMessage().error(error?.msg || t('错误'));
	}
};

// 导出
const handleExport = async () => {
	try {
		const ids = [
			...new Set(selectedRows.value.map((item: any) => item.lclRecommendId)),
		];
		// 显示加载状态
		state.loading = true;
		// 发送请求，设置 responseType 为 'blob' 以接收二进制流
		await getExportCollectionPlan({
			...state.queryForm,
			ascs: state?.ascs,
			ids: ids.length > 0 ? ids : undefined,
			descs: state?.descs,
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

// 确定创建货柜的回调
const confirmCreateContainer = async (e: any) => {
	const res = await postOrderContainerInsertOrderContainer({
		ids: selectedRows.value.map((item: any) => item.id),
		...e,
		recommendFlag: 1, // 是否为推荐创建 1是 0否
	});
	if (res.code === 0) {
		useMessage().success(t('创建成功'));
		// 关闭弹窗
		createContainerRef.value?.hide();
	}
	// 清空选中
	tableRef.value.clearSelection();
	getDataList();
};

// 确定加入货柜的回调
const confirmJoinContainer = async (e: any) => {
	const res = await postAddContainer({
		deliveryNos: selectedRows.value.map((item: any) => item.deliveryNo),
		...e,
	});
	if (res.code === 0) {
		useMessage().success(t('加入成功'));
		// 关闭弹窗
		joinContainerRef.value?.hide();
	}
	// 清空选中
	tableRef.value.clearSelection();
	getDataList();
};
</script>

<style lang="scss" scoped>
.text-blue {
	color: #0089ef;
}
.lclRecommend-cell {
	min-height: 200px;
}
</style>
