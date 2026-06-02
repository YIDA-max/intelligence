<template>
	<el-table
		:data="state.dataList"
		v-loading="state.loading"
		border
		max-height="500"
		ref="tableRef"
		row-key="id"
		show-summary
		:summary-method="getSummaries"
		sum-text="合计"
		:cell-style="tableStyle.cellStyle"
		:header-cell-style="tableStyle.headerCellStyle"
		native-scrollbar
	>
		<el-table-column
			prop="deliveryNo"
			:label="t('发货单号')"
			fixed
			show-overflow-tooltip
			width="180"
		>
			<template #default="{ row }"> {{ row.deliveryNo || '---' }} </template>
		</el-table-column>
		<el-table-column
			prop="shippingMethod"
			:label="t('发货方式')"
			fixed
			show-overflow-tooltip
			width="180"
		>
			<template #default="{ row }">
				{{ row.shippingMethodText || '---' }}
			</template>
		</el-table-column>
		<el-table-column
			prop="destWarehouseCode"
			:label="t('目的仓')"
			fixed
			show-overflow-tooltip
			width="250"
		>
			<template #header>
				<div class="header-with-batch" v-if="props.visiableType !== 'view'">
					<span class="required-star">*</span>
					<span>目的仓</span>
					<BatchPopover
						v-if="
							state.dataList?.some(
								(item) => item.shippingMethod === 'dropshipping'
							)
						"
						ref="forwarderBatchPopover"
						type="select"
						:options="props.dictMap.thirdWarehouseList.map((item:any
            ) => ({
							...item,
							name: `${item.spName}-${item.warehouseName}`,
						}))"
						label-key="name"
						value-key="warehouseCode"
						placeholder="请选择目的仓"
						@confirm="handleBatchDestWarehouse"
					/>
				</div>
				<span v-else>目的仓</span>
			</template>
			<!-- 发货方式为一件代发的，默认为空，必填，下拉单选三方仓 -->
			<template #default="{ row }">
				<div
					v-if="row.shippingMethod === 'dropshipping'"
					:style="{
						display: 'flex',
						'flex-direction': 'column',
						'align-items': 'center',
					}"
				>
					<SelectInputApi
						v-model="row.destWarehouseCode"
						placeholder="请选择"
						:disabled="props.visiableType === 'view'"
						:settings="{
							getTreeData: getWarehouseInfoList,
							getTreeDataParams: {
								status: 1,
							},
							prefixKey: 'spName',
							separator: '-',
							selectTreeProps: {
								value: 'warehouseCode',
								label: 'warehouseName',
							},
							getIdsCode: 'warehouseCode',
						}"
					/>
				</div>
				<div v-else>{{ row.destWarehouseName || '---' }}</div>
			</template>
		</el-table-column>
		<el-table-column
			prop="skuCode"
			:label="t('SKU/产品名称')"
			show-overflow-tooltip
			sortable="custom"
			width="160"
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
			prop="deliveryCartonQuantity"
			:label="t('发货箱数')"
			show-overflow-tooltip
			width="180"
		>
			<template #default="{ row }">
				{{ row.deliveryCartonQuantity || '---' }}
			</template>
		</el-table-column>
		<el-table-column
			prop="totalVolume"
			:label="t('总体积(m³)')"
			show-overflow-tooltip
			width="180"
		>
			<template #default="{ row }">
				{{ row.totalVolume.toFixed(2) || '---' }}
			</template>
		</el-table-column>
		<el-table-column
			prop="totalNetWeight"
			:label="t('总净重(KG)')"
			show-overflow-tooltip
			width="180"
		>
			<template #default="{ row }">
				{{ row.totalNetWeight.toFixed(2) || '---' }}
			</template>
		</el-table-column>
		<el-table-column
			prop="totalGrossWeight"
			:label="t('总毛重(KG)')"
			show-overflow-tooltip
			width="180"
		>
			<template #default="{ row }">
				{{ row.totalGrossWeight.toFixed(2) || '---' }}
			</template>
		</el-table-column>
		<el-table-column
			prop="countryCode"
			:label="t('国家')"
			show-overflow-tooltip
			width="180"
		>
			<template #default="{ row }">
				{{ row.countryCode || '---' }}-{{ row.countryText || '---' }}
			</template>
		</el-table-column>
		<el-table-column
			prop="startPortCode"
			:label="t('起始港')"
			show-overflow-tooltip
			width="180"
		>
			<template #default="{ row }">
				{{ row.startPortCode || '---' }}-{{ row.startPortName || '---' }}
			</template>
		</el-table-column>
		<el-table-column
			prop="destPortCode"
			:label="t('目的港')"
			show-overflow-tooltip
			width="180"
		>
			<template #default="{ row }">
				{{ row.destPortCode || '---' }}-{{ row.destPortName || '---' }}
			</template>
		</el-table-column>

		<el-table-column
			prop="mskuCode"
			:label="t('MSKU')"
			show-overflow-tooltip
			width="180"
		>
			<template #default="{ row }"> {{ row.mskuCode || '---' }} </template>
		</el-table-column>
		<el-table-column
			prop="orderTypeText"
			:label="t('订单类型')"
			show-overflow-tooltip
			width="180"
		>
			<template #default="{ row }">
				{{ row.orderTypeText || '---' }}
			</template>
		</el-table-column>
		<el-table-column
			prop="platformChannelCode"
			:label="t('渠道')"
			show-overflow-tooltip
			width="180"
		>
			<template #default="{ row }">
				{{ row.platformChannelCodeText || '---' }}
			</template>
		</el-table-column>
		<el-table-column
			prop="storeName"
			:label="t('平台店铺')"
			show-overflow-tooltip
			width="180"
		>
			<template #default="{ row }">
				{{ row.storeName || '---' }}:{{ row.countryCode || '---' }}
			</template>
		</el-table-column>
		<el-table-column
			prop="shipmentId"
			:label="t('平台入库单')"
			show-overflow-tooltip
			width="180"
		>
			<template #default="{ row }"> {{ row.shipmentId || '---' }} </template>
		</el-table-column>
		<el-table-column
			prop="barcode"
			:label="t('条码')"
			show-overflow-tooltip
			width="180"
		>
			<template #default="{ row }"> {{ row.barcode || '---' }} </template>
		</el-table-column>
		<el-table-column
			prop="referenceId"
			:label="t('送仓码')"
			show-overflow-tooltip
			width="180"
		>
			<template #default="{ row }"> {{ row.referenceId || '---' }} </template>
		</el-table-column>
		<el-table-column
			prop="remark"
			:label="t('运营/物控备注')"
			show-overflow-tooltip
			width="180"
		>
			<template #default="{ row }"> {{ row.remark || '---' }} </template>
		</el-table-column>
		<el-table-column
			prop="outCartonLength"
			:label="t('外箱长宽高')"
			show-overflow-tooltip
			width="180"
		>
			<template #default="{ row }">
				{{ row.outCartonLength || '---' }} * {{ row.outCartonWidth || '---' }} *
				{{ row.outCartonHeight || '---' }}</template
			>
		</el-table-column>
		<el-table-column
			prop="skuCartonCode"
			:label="t('箱规编码')"
			show-overflow-tooltip
			width="180"
		>
			<template #default="{ row }">
				{{ row.skuCartonCode || '---' }}
			</template>
		</el-table-column>
		<el-table-column
			prop="productNetWeight"
			:label="t('产品净重(KG)')"
			show-overflow-tooltip
			width="180"
		>
			<template #default="{ row }">
				{{ row.productNetWeight || '---' }}
			</template>
		</el-table-column>
		<el-table-column
			prop="outCartonGrossWeight"
			:label="t('外箱毛重(KG)')"
			show-overflow-tooltip
			width="180"
		>
			<template #default="{ row }">
				{{ row.outCartonGrossWeight || '---' }}
			</template>
		</el-table-column>
		<el-table-column
			prop="singleCartonQuantity"
			:label="t('单箱数量')"
			show-overflow-tooltip
			width="180"
		>
			<template #default="{ row }">
				{{ row.singleCartonQuantity || '---' }}
			</template>
		</el-table-column>
		<el-table-column
			prop="factoryId"
			:label="t('工厂名称')"
			show-overflow-tooltip
			width="180"
		>
			<template #default="{ row }"> {{ row.factoryName || '---' }} </template>
		</el-table-column>
		<el-table-column
			prop="purchaseUserId"
			:label="t('采购员')"
			show-overflow-tooltip
			width="180"
		>
			<template #default="{ row }">
				{{ row.purchaseUserName || '---' }}
			</template>
		</el-table-column>
		<el-table-column
			prop="factoryDeliveryDate"
			:label="t('工厂回复交期')"
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
			prop="purchaseNo"
			:label="t('采购单号')"
			show-overflow-tooltip
			width="180"
		>
			<template #default="{ row }"> {{ row.purchaseNo || '---' }} </template>
		</el-table-column>
		<el-table-column
			prop="deptName"
			:label="t('部门&小组')"
			show-overflow-tooltip
			width="180"
		>
			<template #default="{ row }"> {{ row.deptName || '---' }} </template>
		</el-table-column>
		<el-table-column
			prop="operationUserId"
			:label="t('运营')"
			show-overflow-tooltip
			width="180"
		>
			<template #default="{ row }">
				{{ row.operationUserName || '---' }}
			</template>
		</el-table-column>
		<el-table-column
			prop="createId"
			:label="t('物控')"
			show-overflow-tooltip
			width="180"
		>
			<template #default="{ row }"> {{ row.createName || '---' }} </template>
		</el-table-column>
	</el-table>
	<div class="section-title"><span class="section-bar"></span>装柜顺序</div>
	<mr-table-vxe
		ref="sortTableRef"
		:data="loadContainerSort"
		:row-drag-config="{
			isEnabled: !isContainerSortReadonly,
			trigger: 'cell',
			icon: 'vxe-icon-menu',
		}"
		:row-config="{ keyField: 'factoryName', drag: true }"
		max-height="300"
		@row-dragend="onRowDragEnd"
	>
		<mr-table-column-vxe type="seq" title="序号" width="60" />
		<mr-table-column-vxe
			type="drag"
			:drag-sort="true"
			width="100"
			v-if="props.visiableType !== 'view' && !isContainerSortReadonly"
		>
			<template #header>
				<el-tooltip content="拖拽行对装柜顺序进行排序" placement="top">
					<span class="drag-col-header">
						装柜排序
						<el-icon class="drag-col-header__icon"><QuestionFilled /></el-icon>
					</span>
				</el-tooltip>
			</template>
			<template #default>
				<el-icon class="drag-handle-icon"><Grid /></el-icon>
			</template>
		</mr-table-column-vxe>
		<mr-table-column-vxe field="factoryName" title="工厂" min-width="200">
			<template #default="{ row, rowIndex }">
				<el-select-v2
					v-model="row.id"
					placeholder="请选择工厂"
					@change="(val: any) => onFactoryChange(rowIndex, val)"
					:disabled="props.visiableType === 'view' || isContainerSortReadonly"
					filterable
					:options="getFactorySelectOptions(rowIndex)"
				/>
			</template>
		</mr-table-column-vxe>
		<mr-table-column-vxe field="countryName1" title="地址" min-width="250">
			<template #default="{ row }">
				<span v-if="row.id">
					{{ row?.countryName }}
					{{ row?.provinceName }}
					{{ row?.cityName }}
					{{ row?.districtName }}
					{{ row?.streetName }}
				</span>
				<span v-else>---</span>
			</template>
		</mr-table-column-vxe>
		<mr-table-column-vxe field="address" title="详细地址" min-width="180">
			<template #default="{ row }">{{ row?.address || '---' }}</template>
		</mr-table-column-vxe>
		<mr-table-column-vxe field="contact" title="联系人" width="120">
			<template #default="{ row }">{{ row?.contact || '---' }}</template>
		</mr-table-column-vxe>
		<mr-table-column-vxe field="phone" title="联系电话" width="150">
			<template #default="{ row }">{{ row?.phone || '---' }}</template>
		</mr-table-column-vxe>
		<mr-table-column-vxe
			title="操作"
			width="100"
			fixed="right"
			v-if="props.visiableType !== 'view' && !isContainerSortReadonly"
		>
			<template #header>
				<el-button
					type="primary"
					:icon="Plus"
					plain
					size="small"
					@click="addFactoryOrder"
				/>
			</template>
			<template #default="{ rowIndex }">
				<el-button
					type="danger"
					:icon="Delete"
					plain
					size="small"
					:disabled="loadContainerSort.length <= 1"
					@click="removeFactoryOrder(rowIndex)"
				/>
			</template>
		</mr-table-column-vxe>
	</mr-table-vxe>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { BasicTableProps, useTable } from '/@/hooks/table';
import { useMessage } from '/@/hooks/message';
import { Plus, Delete, QuestionFilled, Grid } from '@element-plus/icons-vue';
import { OrderContainerStatus } from '/@/views/materialFlow/orderContainer/confige/enums';

// 已安排装柜、部分提货、全部提货、已发货、已出库 这些状态不可编辑装柜顺序
const isContainerSortReadonly = computed(() =>
	[
		OrderContainerStatus.CONTAINER_LOADING,
		OrderContainerStatus.PART_PICKED_UP,
		OrderContainerStatus.PICKED_UP,
		OrderContainerStatus.ALREADY_DELIVERY,
		OrderContainerStatus.ALREADY_OUT_STORAGE,
	].includes(props.status as OrderContainerStatus)
);

import { getWarehouseInfoList } from '/@/api/warehouse/third-warehouse/index';
const SelectInputApi = defineAsyncComponent(
	() => import('/@/componentsApi/SelectInputApi/index.vue')
);

const { t } = useI18n();
const props = defineProps({
	dictMap: { type: Object, default: () => ({}) },
	visiableType: {
		type: String,
		default: '',
	},
	status: {
		type: Number,
		default: null,
	},
});

const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {},
});

//  table hook
const { tableStyle, setTableData } = useTable(state, null);
// tableRef
const tableRef = ref<any>(null);

// 装柜顺序
const loadContainerSort = ref<
	Array<{
		factoryId: any;
		id: any;
		factoryName: string;
		factoryAddress?: string;
	}>
>([]);
// 工厂下拉选项
const factoryOptions = ref<
	Array<
		| { id: any; factoryId: any; factoryName: string; factoryAddress?: string }
		| any
	>
>([]);

// 选择工厂联动地址，并做去重校验（通过 el-select-v2 disabled 选项实现，此处直接更新行数据）
const onFactoryChange = async (index: number, val: any) => {
	const opt = factoryOptions.value.find((o) => o.id === val);
	if (opt) {
		loadContainerSort.value.splice(index, 1, {
			...loadContainerSort.value[index],
			...opt,
		});
		await nextTick();
		sortTableRef.value?.xTableRef?.reloadData?.(loadContainerSort.value);
	}
};

const sortTableRef = ref();

const syncSortFromTable = async () => {
	await nextTick();
	const tableData = sortTableRef.value?.xTableRef?.getTableData?.()?.tableData;
	if (tableData && tableData.length) {
		loadContainerSort.value = [...tableData];
	}
};

const onRowDragEnd = async () => {
	await syncSortFromTable();
};

const getFactorySelectOptions = computed(
	() => (rowIndex: number) =>
		factoryOptions.value.map((item) => ({
			label: item.factoryAbbreviation,
			value: item.id,
			disabled: loadContainerSort.value.some(
				(s, i) => i !== rowIndex && s.id === item.id
			),
		}))
);

// 新增工厂，初始值为空
const addFactoryOrder = () => {
	if (
		loadContainerSort.value.length >= 0 &&
		loadContainerSort.value.length < factoryOptions.value.length
	) {
		loadContainerSort.value.push({
			factoryId: '',
			id: undefined,
			factoryName: '',
			factoryAddress: '',
		});
	} else {
		useMessage().warning('可添加工厂数已达上限');
	}
};
// 删除工厂
const removeFactoryOrder = (idx: number) => {
	if (loadContainerSort.value.length <= 1) return;
	loadContainerSort.value.splice(idx, 1);
};

const getDataList = () => state.dataList;
const setData = (data: any) => setTableData(data);

// 设置工厂下拉列表
const setLoadContainerSort = (
	list: Array<{
		id: any;
		factoryId: any;
		factoryName: string;
		factoryAddress?: string;
	}> = []
) => {
	loadContainerSort.value = Array.isArray(list) ? [...list] : [];
};
// 获取已设置的工厂顺序
const getLoadContainerSort = () => loadContainerSort.value.map((i) => i.id);

// 设置工厂下拉列表
const setFactoryOptions = (
	list: Array<{
		id: any;
		factoryId: any;
		factoryName: string;
		factoryAddress?: string;
	}>
) => {
	factoryOptions.value = Array.isArray(list) ? list : [];
};

// 求和
const getSummaries = ({ columns, data }: { columns: any[]; data: any[] }) => {
	const sums: (string | number)[] = [];
	columns.forEach((column, index) => {
		if (index === 0) {
			sums[index] = '合计';
			return;
		}
		if (column.property === 'shipmentQuantity') {
			// 统计产品种类去重数量
			const total = data.reduce(
				(sum, item) => sum + (Number(item.shipmentQuantity) || 0),
				0
			);
			sums[index] = total.toFixed(2);
		} else if (column.property === 'deliveryCartonQuantity') {
			// 采购量求和
			const total = data.reduce(
				(sum, item) => sum + (Number(item.deliveryCartonQuantity) || 0),
				0
			);
			sums[index] = total.toFixed(0);
		} else if (column.property === 'totalVolume') {
			// 退货数量求和
			const total = data.reduce(
				(sum, item) => sum + (Number(item.totalVolume) || 0),
				0
			);
			sums[index] = total.toFixed(2);
		} else if (column.property === 'totalNetWeight') {
			// 退货数量求和
			const total = data.reduce(
				(sum, item) => sum + (Number(item.totalNetWeight) || 0),
				0
			);
			sums[index] = total.toFixed(2);
		} else if (column.property === 'totalGrossWeight') {
			// 退货数量求和
			const total = data.reduce(
				(sum, item) => sum + (Number(item.totalGrossWeight) || 0),
				0
			);
			sums[index] = total.toFixed(2);
		} else {
			sums[index] = '';
		}
	});
	return sums;
};
// 一件代发支持批量修改目的仓
const handleBatchDestWarehouse = (value: any) => {
	const dataList = state.dataList?.map((item: any) => {
		if (item.shippingMethod === 'dropshipping') {
			item.destWarehouseCode = value;
		}
		return item;
	});
	setData(dataList);
};

defineExpose({
	setData,
	getDataList,
	setLoadContainerSort,
	getLoadContainerSort,
	setFactoryOptions,
});
</script>

<style lang="scss" scoped>
.section-title {
	font-weight: bold;
	margin: 10px 0 10px 0;
	display: flex;
	align-items: center;
}
.section-bar {
	display: inline-block;
	width: 4px;
	height: 18px;
	background: #2e5cf6;
	border-radius: 2px;
	margin-right: 8px;
}
.operate {
	display: flex;
	gap: 8px;
	margin-left: 20px;
}

.drag-col-header {
	cursor: help;
	display: inline-flex;
	align-items: center;
	gap: 4px;

	&__icon {
		vertical-align: middle;
	}
}

.drag-handle-icon {
	cursor: move;
	color: #c0c4cc;
	font-size: 16px;
}
:deep(.el-table__footer .el-table__cell) {
	text-align: center;
}
:deep(.el-table__footer .cell) {
	display: flex; /* Element Plus 默认 .cell 为 flex */
	justify-content: center; /* 水平居中 */
	text-align: center; /* 兜底 */
}
.header-with-batch {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 100%;

	.required-star {
		color: #f56c6c;
		margin-right: 4px;
	}
}
</style>
