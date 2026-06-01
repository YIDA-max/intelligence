<!--
 * @Author: wuyueqin wuyueqin@merach.com
 * @Date: 2026-04-26 15:10:55
 * @LastEditors: wuyueqin wuyueqin@merach.com
 * @LastEditTime: 2026-04-30 15:15:36
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
		title="安排装柜"
		@closed="emit('closeDialog')"
	>
		<div v-loading="detailLoading">
			<BaseTable
				:register="register"
				:rowConfig="{ keyField: 'id' }"
				:height="350"
			>
				<template #changedEstimatedLoadingTime="{ row }">
					<el-date-picker
						v-model="row.changedEstimatedLoadingTime"
						type="date"
						placeholder="请选择日期"
						format="YYYY-MM-DD"
						value-format="YYYY-MM-DD"
						:disabled="true"
					/>
					<!-- :disabled="props.visiableType === 'view'" -->
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

			<div class="section-title"><span class="section-bar"></span>装柜顺序</div>
			<mr-table-vxe
				ref="sortTableRef"
				:data="loadContainerSort"
				:row-drag-config="{
					isEnabled: true,
					trigger: 'cell',
					icon: 'vxe-icon-menu',
				}"
				:row-config="{ keyField: 'factoryName', drag: true }"
				max-height="300"
				@row-dragend="onRowDragEnd"
			>
				<mr-table-column-vxe type="seq" title="序号" width="60" />
				<mr-table-column-vxe type="drag" :drag-sort="true" width="100">
					<template #header>
						<el-tooltip content="拖拽行对装柜顺序进行排序" placement="top">
							<span class="drag-col-header">
								装柜排序
								<el-icon class="drag-col-header__icon"
									><QuestionFilled
								/></el-icon>
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
							:disabled="props.visiableType === 'view'"
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
					v-if="props.visiableType !== 'view'"
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
import { Plus, Delete, QuestionFilled, Grid } from '@element-plus/icons-vue';
import {
	getOrderContainerDetail,
	postArrangeStuffing,
} from '/@/api/materialFlow/orderContainer/index';
import { getFactoryList } from '/@/api/mcp/collectionPlan';

import { tableColumns } from './config';

const BaseTable = defineAsyncComponent(
	() => import('/@/components/BaseTable/index.vue')
);

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

const loadContainerSort = ref<
	Array<{
		factoryId: any;
		id: any;
		factoryName: string;
		factoryAddress?: string;
	}>
>([]);
const factoryOptions = ref<Array<any>>([]);

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

const removeFactoryOrder = (idx: number) => {
	if (loadContainerSort.value.length <= 1) return;
	loadContainerSort.value.splice(idx, 1);
};

const setFactoryOptions = (options: Array<any>, loadContainerSortRes: []) => {
	if (Array.isArray(loadContainerSortRes) && loadContainerSortRes.length > 0) {
		const idToOption = new Map<any, any>();
		options.forEach((o: any) => idToOption.set(o.id ?? o.factoryId, o));
		const orderList = loadContainerSortRes.map((id: any) => {
			const o = idToOption.get(id) || {};
			return {
				id,
				factoryId: o.factoryId ?? id,
				factoryName: o.factoryName ?? '',
				factoryAddress: o.factoryAddress ?? '',
				...o,
			};
		});
		loadContainerSort.value = orderList;
	} else {
		loadContainerSort.value = [];
	}
};
const getFactoryListAndSet = async (
	deliveryVOList: [],
	loadContainerSort: []
) => {
	// 1) 计算表格中过滤出的不同工厂ID集合
	// TODO: mock data for drag test, remove before release
	// const mockFactories = [
	// 	{
	// 		id: 'f001',
	// 		factoryId: 'f001',
	// 		factoryName: '工厂A',
	// 		factoryAbbreviation: '工厂A',
	// 		countryName: '中国',
	// 		provinceName: '广东省',
	// 		cityName: '深圳市',
	// 		districtName: '南山区',
	// 		streetName: '科技园路',
	// 		address: '科技园路1号',
	// 		contact: '张三',
	// 		phone: '13800000001',
	// 	},
	// 	{
	// 		id: 'f002',
	// 		factoryId: 'f002',
	// 		factoryName: '工厂B',
	// 		factoryAbbreviation: '工厂B',
	// 		countryName: '中国',
	// 		provinceName: '浙江省',
	// 		cityName: '杭州市',
	// 		districtName: '余杭区',
	// 		streetName: '文一西路',
	// 		address: '文一西路999号',
	// 		contact: '李四',
	// 		phone: '13800000002',
	// 	},
	// 	{
	// 		id: 'f003',
	// 		factoryId: 'f003',
	// 		factoryName: '工厂C',
	// 		factoryAbbreviation: '工厂C',
	// 		countryName: '中国',
	// 		provinceName: '江苏省',
	// 		cityName: '苏州市',
	// 		districtName: '工业园区',
	// 		streetName: '星湖街',
	// 		address: '星湖街328号',
	// 		contact: '王五',
	// 		phone: '13800000003',
	// 	},
	// ];
	// setFactoryOptions(mockFactories);
	// return;
	const tableFactoryIds: any[] = Array.from(
		new Set(
			(deliveryVOList || [])
				.map((r: any) => r.factoryId)
				.filter((v: any) => v !== undefined && v !== null && v !== '')
		)
	);

	const res = await getFactoryList({ factoryIds: tableFactoryIds });
	factoryOptions.value = Array.isArray(res?.data) ? res?.data : [];
	setFactoryOptions(factoryOptions.value, loadContainerSort);
};

onMounted(async () => {
	detailLoading.value = true;
	try {
		const res = await getOrderContainerDetail({ id: props.currentRow.id });
		const deliveryVOList = res.data?.deliveryVOList ?? [];
		setTableData(deliveryVOList);

		getFactoryListAndSet(deliveryVOList, res?.data?.loadContainerSort || []);
	} catch (error: any) {
		useMessage().error(error?.msg || t('获取详情失败'));
	} finally {
		detailLoading.value = false;
	}
});

const onSubmit = async () => {
	const sortedFactoryIds = loadContainerSort.value
		.map((i) => i.id)
		.filter(Boolean);
	if (sortedFactoryIds.length < 1) {
		useMessage().warning(t('【装柜顺序】至少选择一家工厂'));
		return;
	}

	const detailDTOList = (state.dataList ?? []).map((row: any) => ({
		id: row.id,
		changedEstimatedLoadingTime: row.changedEstimatedLoadingTime,
	}));
	const res = await postArrangeStuffing({
		id: props.currentRow.id,
		loadContainerSort: sortedFactoryIds,
		detailDTOList,
	});
	if (res.code === 0) {
		useMessage().success(t('操作成功'));
		emit('closeDialog');
	}
};
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
</style>
