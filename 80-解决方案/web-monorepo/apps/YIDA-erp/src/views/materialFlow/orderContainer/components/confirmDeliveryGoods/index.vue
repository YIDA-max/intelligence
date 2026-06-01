<!--
 * @Author: wuyueqin wuyueqin@merach.com
 * @Date: 2026-04-26 15:10:55
 * @LastEditors: wuyueqin wuyueqin@merach.com
 * @LastEditTime: 2026-04-30 14:41:32
 * @FilePath: \qianyi-ui\src\views\materialFlow\orderContainer\components\arrangeContainerLoading\index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
	<el-dialog
		v-model="visible"
		width="90%"
		:close-on-click-modal="false"
		draggable
		:destroy-on-close="false"
		title="确认提货"
		@closed="emit('closeDialog')"
	>
		<div v-loading="detailLoading">
			<BaseTable
				:register="register"
				:rowConfig="{ keyField: 'id' }"
				:height="450"
			>
				<!-- <template #destWarehouseCode-header>
					<div class="header-with-batch" v-if="props.visiableType !== 'view'">
						<span>目的仓</span>
						<BatchPopover
							ref="warehouseBatchPopover"
							type="select"
							:options="warehouseOptions"
							label-key="name"
							value-key="warehouseCode"
							placeholder="请选择目的仓"
							@confirm="handleBatchDestWarehouse"
						/>
					</div>
					<span v-else>目的仓</span>
				</template> -->
				<!-- <template #destWarehouseCode="{ row }">
					<SelectInputApi
						v-model="row.destWarehouseCode"
						placeholder="请选择目的仓"
						:settings="{
							getTreeData: async () => ({ code: 0, data: warehouseOptions }),
							getTreeDataParams: { status: 1 },
							prefixKey: 'spName',
							separator: '-',
							selectTreeProps: {
								value: 'warehouseCode',
								label: 'warehouseName',
							},
							getIdsCode: 'warehouseCode',
						}"
					/>
				</template> -->
				<template #shipmentQuantity="{ row }">
					<el-input-number
						v-model="row.shipmentQuantity"
						:min="0"
						:max="row.deliveryQuantity"
						:precision="0"
						controls-position="right"
						:disabled="row.status === PickUpStatus.PICKED_UP"
					/>
				</template>
				<template #actualPickupTime="{ row }">
					<el-date-picker
						v-model="row.actualPickupTime"
						type="datetime"
						placeholder="请选择日期"
						format="YYYY-MM-DD HH:mm:ss "
						value-format="YYYY-MM-DD HH:mm:ss"
						:disabled="row.status === PickUpStatus.PICKED_UP"
						@change="(val: any) => onActualPickupTimeChange(row, val)"
					/>
				</template>
				<template #skuCode="{ row }">
					<div
						style="
							display: flex;
							flex-direction: column;
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
				<template #countryCode="{ row }"
					>{{ row.countryCode || '---' }}-{{
						row.countryText || '---'
					}}</template
				>
				<template #startPortCode="{ row }"
					>{{ row.startPortCode || '---' }}-{{
						row.startPortName || '---'
					}}</template
				>
				<template #destPortCode="{ row }"
					>{{ row.destPortCode || '---' }}-{{
						row.destPortName || '---'
					}}</template
				>
				<template #storeName="{ row }"
					>{{ row.storeName || '---' }}:{{ row.countryCode || '---' }}</template
				>
				<template #outCartonLength="{ row }"
					>{{ row.outCartonLength || '---' }} *
					{{ row.outCartonWidth || '---' }} *
					{{ row.outCartonHeight || '---' }}</template
				>
			</BaseTable>
		</div>
		<template #footer>
			<el-button @click="visible = false">{{ $t('取消') }}</el-button>
			<el-button type="primary" @click="onSubmit" :disabled="detailLoading">{{
				$t('确认')
			}}</el-button>
		</template>
	</el-dialog>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import {
	BasicTableProps,
	useTable,
} from '/@/components/BaseTable/hooks/BaseTable';
import { useMessage } from '/@/hooks/message';

// import BatchPopover from '/@/components/BatchPopover/index.vue';
// import { getWarehouseInfoList } from '/@/api/warehouse/third-warehouse/index';
import {
	getOrderContainerDetail,
	postConfirmPickup,
} from '/@/api/materialFlow/orderContainer/index';
import { tableColumns } from './config';

const BaseTable = defineAsyncComponent(
	() => import('/@/components/BaseTable/index.vue')
);
// const SelectInputApi = defineAsyncComponent(
// 	() => import('/@/componentsApi/SelectInputApi/index.vue')
// );
enum PickUpStatus {
	/**
	 * 未提货
	 */
	NOT_PICKED_UP = 1,
	/**
	 * 已提货
	 */
	PICKED_UP = 2,
}

const { t } = useI18n();
const props = defineProps({
	dictMap: { type: Object, default: () => ({}) },
	visiableType: { type: String, default: '' },
	currentRow: { type: Object, default: () => ({}) },
});

const emit = defineEmits(['closeDialog']);

const visible = ref(true);
const detailLoading = ref(false);
const tableRef = ref();

const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {},
	columns: tableColumns,
	isPage: false,
	isShowpagination: false,
	toolBarConfig: {
		isShowRefresh: false,
		isShowExport: false,
		isShowSetting: false,
	},
});

const { register, setTableData } = useTable(state, tableRef);

// const warehouseBatchPopover = ref();
// const warehouseOptions = ref<any[]>([]);

// const handleBatchDestWarehouse = (value: any) => {
// 	const updated = (state.dataList ?? []).map((item: any) => ({
// 		...item,
// 		destWarehouseCode: value,
// 	}));
// 	setTableData(updated);
// };

onMounted(async () => {
	detailLoading.value = true;
	try {
		const detailRes = await getOrderContainerDetail({
			id: props.currentRow.id,
		});
		const deliveryVOList = (detailRes.data?.deliveryVOList ?? []).map(
			(row: any) => ({
				...row,
				shipmentQuantity:
					row.status === PickUpStatus.PICKED_UP
						? row.shipmentQuantity
						: undefined, //部分发货时取已发货数量，否则不显示
				deliveryQuantity: row.shipmentQuantity,
			})
		);
		setTableData(deliveryVOList);
		// const warehouseRes = await getWarehouseInfoList({ status: 1 });
		// warehouseOptions.value = (warehouseRes.data ?? []).map((item: any) => ({
		// 	...item,
		// 	name: `${item.spName}-${item.warehouseName}`,
		// }));
	} catch (error: any) {
		useMessage().error(error?.msg || t('获取详情失败'));
	} finally {
		detailLoading.value = false;
	}
});

const onActualPickupTimeChange = (row: any, val: any) => {
	(state.dataList ?? []).forEach((item: any) => {
		if (item.factoryId === row.factoryId) {
			item.actualPickupTime = val;
			item.shipmentQuantity = item.deliveryQuantity;
		}
	});
};

const onSubmit = async () => {
	for (let i = 0; i < (state.dataList ?? []).length; i++) {
		const row: any = state?.dataList?.[i];
		const rowNum = i + 1;
		if (!row.destWarehouseCode) {
			useMessage().warning(`第${rowNum}行目的仓库不能为空`);
			return;
		}
		// if (
		// 	row.shipmentQuantity === null ||
		// 	row.shipmentQuantity === undefined ||
		// 	row.shipmentQuantity === ''
		// ) {
		// 	useMessage().warning(`第${rowNum}行实际发货数量不能为空`);
		// 	return;
		// }
		// if (Number(row.shipmentQuantity) < 0) {
		// 	useMessage().warning(`第${rowNum}行实际发货数量必须大于等于0`);
		// 	return;
		// }
		// if (!row.actualPickupTime) {
		// 	useMessage().warning(`第${rowNum}行实际提货时间不能为空`);
		// 	return;
		// }
		if (row.actualPickupTime && Number(row.shipmentQuantity) < 0) {
			useMessage().warning(`第${rowNum}行实际发货数量必须大于等于0`);
			return;
		}
	}

	const detailDTOList = (state.dataList ?? []).map((row: any) => ({
		id: row.id,
		destWarehouseCode: row.destWarehouseCode,
		shipmentQuantity: row.shipmentQuantity,
		deliveryQuantity: row.deliveryQuantity,
		actualPickupTime: row.actualPickupTime,
	}));
	const res = await postConfirmPickup({
		id: props.currentRow.id,
		items: detailDTOList,
	});
	if (res.code === 0) {
		useMessage().success(t('操作成功'));
		emit('closeDialog');
	}
};
</script>

<style lang="scss" scoped>
.operate {
	display: flex;
	gap: 8px;
	margin-left: 20px;
}

.header-with-batch {
	display: flex;
	align-items: center;
	gap: 4px;
}
</style>
