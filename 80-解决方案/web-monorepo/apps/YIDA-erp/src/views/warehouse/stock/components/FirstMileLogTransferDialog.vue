<template>
	<div class="dialog-container">
		<!-- 循环渲染每一组 -->
		<div
			v-for="(group, groupIndex) in transferGroups"
			:key="group.id"
			class="transfer-group"
		>
			<span class="error-dot" v-if="group.hasError"></span>
			<!-- 原库存信息 -->
			<div class="group-header">
				<div class="section-title">
					<span class="section-bar"></span>原库存信息
				</div>
				<el-button
					type="primary"
					size="small"
					:icon="Minus"
					v-if="transferGroups.length > 1"
					@click="removeTransferGroup(groupIndex)"
				/>
			</div>
			<el-table
				:data="group.originList"
				border
				size="small"
				v-loading="group.loading"
				native-scrollbar
			>
				<el-table-column
					v-for="column in originStockColumns"
					:key="column.prop"
					:prop="column.prop"
					:label="column.label"
					:width="column.width"
					:min-width="column.minWidth"
					:show-overflow-tooltip="column.showOverflowTooltip"
				>
					<template #header>
						<span class="required-icon" v-if="column.isRequired">*</span>
						<span>{{ column.label }}</span>
					</template>
					<template #default="{ row }">
						<!-- 头程调拨单特殊处理：有单号显示，否则显示下拉框（支持多选） -->
						<template v-if="column.type === 'firstMileOrder'">
							<span v-if="row.businessNo">{{ row.businessNo }}</span>
							<el-select
								v-else
								v-model="group.selectedOrders"
								placeholder="请选择头程调拨单（可多选）"
								multiple
								clearable
								filterable
								collapse-tags
								:max-collapse-tags="2"
								value-key="relateOrderNo"
								@blur="handleGroupOrderBlur(group)"
							>
								<el-option
									v-for="item in getAvailableOrderOptions(group)"
									:key="item.relateOrderNo"
									:label="item.relateOrderNo"
									:value="item"
								/>
							</el-select>
						</template>

						<!-- SKU 特殊处理：显示 SKU 和产品名称 -->
						<template v-else-if="column.type === 'sku'">
							<div class="sku-column">
								<div class="sku-text">{{ row.skuCode || '---' }}</div>
								<div class="sku-text">{{ row.skuName || '---' }}</div>
							</div>
						</template>

						<!-- 普通字段：使用 formatter 或直接显示 -->
						<template v-else>
							<span>{{
								column.formatter
									? column.formatter(row)
									: row[column.prop] ?? '---'
							}}</span>
						</template>
					</template>
				</el-table-column>
			</el-table>

			<!-- 新库存信息 -->
			<div class="section-title section-title-spacing">
				<span class="section-bar"></span>新库存信息
			</div>

			<el-table :data="group.newRows" border size="small" class="new-table">
				<el-table-column
					v-for="column in newStockColumns"
					:key="column.prop"
					:prop="column.prop"
					:width="column.width"
					:min-width="column.minWidth"
					:show-overflow-tooltip="column.showOverflowTooltip"
				>
					<template #header>
						<span class="required-icon" v-if="column.isRequired">*</span>
						<span>{{ column.label }}</span>
					</template>
					<template #default="{ row }">
						<!-- 头程调拨单：有单号显示文本，无单号显示下拉框（支持多选） -->
						<template v-if="column.prop === 'businessNo'">
							<span v-if="row.businessNo">{{ row.businessNo }}</span>
							<el-select
								v-else
								v-model="group.selectedOrders"
								placeholder="请选择头程调拨单（可多选）"
								multiple
								clearable
								filterable
								collapse-tags
								:max-collapse-tags="2"
								value-key="relateOrderNo"
								@blur="handleGroupOrderBlur(group)"
							>
								<el-option
									v-for="item in getAvailableOrderOptions(group)"
									:key="item.relateOrderNo"
									:label="item.relateOrderNo"
									:value="item"
								/>
							</el-select>
						</template>

						<!-- 国家选择器 -->
						<el-select
							v-else-if="column.type === 'country'"
							v-model="row[column.prop]"
							:placeholder="column.placeholder || '请选择'"
							clearable
							filterable
							@change="column.onChange ? column.onChange(row, group) : null"
						>
							<el-option
								v-for="option in column.options ? column.options() : []"
								:key="option.value"
								:label="option.label"
								:value="option.value"
							/>
						</el-select>

						<!-- 平台渠道选择器 -->
						<el-select
							v-else-if="column.type === 'platformChannel'"
							v-model="row[column.prop]"
							:placeholder="column.placeholder || '请选择'"
							collapse-tags
							:max-collapse-tags="1"
							clearable
							filterable
							class="select-platform"
							@change="column.onChange ? column.onChange(row, group) : null"
						>
							<el-option
								v-for="option in column.options ? column.options() : []"
								:key="option.id"
								:label="option.label"
								:value="option.value"
							/>
						</el-select>

						<!-- MSKU选择器 -->
						<el-select
							v-else-if="column.type === 'msku'"
							v-model="row[column.prop]"
							:placeholder="column.placeholder || '请选择'"
							clearable
							filterable
						>
							<el-option
								v-for="option in column.options ? column.options(group) : []"
								:key="option.mskuCode"
								:label="option.platform"
								:value="option.mskuCode"
							/>
						</el-select>

						<!-- 部门&运营小组级联选择器 -->
						<el-cascader
							v-else-if="column.type === 'cascader'"
							v-model="row[column.prop]"
							:placeholder="column.placeholder || '请选择'"
							clearable
							:options="column.options ? column.options() : []"
							filterable
							:props="{
								label: 'name',
								value: 'id',
								emitPath: false,
								checkStrictly: false,
								leafOnly: true,
							}"
						/>

						<!-- 箱规编码（特殊处理，多行） -->
						<template v-else-if="column.prop === 'skuCartonCode'">
							<el-row
								v-for="(cartonItem, index) in getStockCartonRows(row)"
								:key="`carton-${index}`"
								class="mb8 full-width"
								:gutter="8"
							>
								<el-col :span="20">
									<el-select
										v-model="row.stockCartonList[index]"
										collapse-tags
										:max-collapse-tags="1"
										clearable
										filterable
										placeholder="请选择箱规编码"
										value-key="skuCartonCode"
										:disabled="row.businessNo ? false : true"
										@change="() => handleStockCartonChange(row, index)"
									>
										<el-option
											v-for="opt in getAvailableStockCartonOptions(row, index)"
											:key="opt.skuCartonCode"
											:label="opt.skuCartonCode"
											:value="opt"
										/>
									</el-select>
								</el-col>
								<el-col :span="4">
									<div class="btn-group">
										<el-button
											v-if="index === 0"
											type="primary"
											size="small"
											:icon="Plus"
											@click="addStockCartonList(row)"
										/>
										<el-button
											v-else
											:disabled="row.businessNo ? false : true"
											type="primary"
											size="small"
											:icon="Minus"
											@click="removeStockCartonList(row, index)"
										/>
									</div>
								</el-col>
							</el-row>
						</template>

						<!-- 转换箱数（输入框） -->
						<template v-else-if="column.prop === 'transferCartons'">
							<el-row
								v-for="(item, index) in row.stockCartonList"
								:key="index"
								class="mb8 full-width"
								:gutter="8"
							>
								<el-input
									v-model="item.transferCartons"
									placeholder="请输入"
									@blur="() => onQtyBlur(row, item)"
									:disabled="!item.skuCartonCode"
								/>
							</el-row>
						</template>

						<!-- 其他只读字段（根据 formatter 显示） -->
						<template v-else-if="column.type === 'display'">
							<template v-if="column.useStockCartonList">
								<el-row
									v-for="(item, index) in row.stockCartonList"
									:key="index"
									class="mb8 full-width"
									:gutter="8"
								>
									<div :class="column.className">
										{{
											column.formatter
												? column.formatter(row, item)
												: item[column.prop] ?? '---'
										}}
									</div>
								</el-row>
							</template>
							<span v-else>
								{{
									column.formatter
										? column.formatter(row)
										: row[column.prop] ?? '---'
								}}
							</span>
						</template>
					</template>
				</el-table-column>
			</el-table>
		</div>
		<!-- 添加单按钮 -->
		<div class="add-demand-btn">
			<el-button
				type="primary"
				size="small"
				:icon="Plus"
				@click="addDemandGroup"
			/>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { Plus, Minus } from '@element-plus/icons-vue';
import { useMessage, useMessageBox } from '/@/hooks/message';
import {
	postBatchSave,
	getListStockOnewayDetailByPrefix,
	getListDeliveryPlan,
} from '/@/api/warehouse/stock';
import { getSkuQueryMsku } from '/@/api/purchase/demand';

const props = defineProps({
	dictMap: { type: Object, default: () => ({}) },
});

const emit = defineEmits(['closed', 'submitted']);

const visible = ref(false);

// 转库存类型：1-在途转换，2-头程在途转换
const transferType = ref<number>(1);
// 保存之前的选中值，用于取消时恢复
const previousTransferType = ref<number>(1);

// 头程调拨单选项
const firstMileOrderOptions = ref<
	Array<{ label: string; value: string }> | any
>([]);

/**
 * 获取头程调拨单选项
 * @description 根据前缀 FL 查询在途库存明细
 */
const fetchFirstMileOrderOptions = async () => {
	loading.value = true;
	try {
		const res = await getListStockOnewayDetailByPrefix({
			prefix: 'FL',
			stockId: originalRow.value.id,
		});
		if (res.code === 0 && res.data) {
			// 将返回的数据格式化为下拉选项，label 和 value 都使用 relateOrderNo
			firstMileOrderOptions.value = res.data;
		}
	} catch (error: any) {
		useMessage().error(error.msg || error.message || '加载头程调拨单失败');
	} finally {
		loading.value = false;
	}
};

/**
 * 获取指定组的可用头程调拨单选项
 * 过滤掉已被其他组选择的订单号，避免重复选择
 * @param currentGroup 当前组
 * @returns 可用的订单选项列表
 */
const getAvailableOrderOptions: any = (currentGroup: TransferGroup) => {
	// 收集其他组已选的订单号（包括 businessNo 和 selectedOrders）
	const selectedOrdersSet = new Set<string>();

	transferGroups.value.forEach((g) => {
		if (g.id !== currentGroup.id) {
			// 添加单个已选订单号
			if (g.businessNo) {
				selectedOrdersSet.add(g.businessNo);
			}
		}
	});

	// 返回过滤后的选项，使用 relateOrderNo 作为判断 key
	return firstMileOrderOptions.value.filter(
		(option: any) => !selectedOrdersSet.has(option.relateOrderNo)
	);
};

// 转库存组列表
interface TransferGroup {
	id: number;
	loading: boolean;
	originList: any[];
	baseDetail: any;
	newRows: any[];
	mskuOption: any[];
	businessNo: string; // 头程调拨单号（单个）
	selectedOrders: any[]; // 多选的头程调拨单对象列表
	orderDetail: any; // 头程调拨单完整对象
	hasError?: boolean; // 校验状态标记
}

const transferGroups = ref<TransferGroup[]>([]);
let groupIdCounter = 0;

// 原始 row 数据
let originalRow = ref<any>({});

// 国家改变
const changeCountry = (row: any, group: TransferGroup) => {
	row.platformChannelCode = '';
	row.mskuCode = '';
	group.mskuOption = [];
};

// 平台渠道改变
const changePlatformChannel = (row: any, group: TransferGroup) => {
	row.mskuCode = '';
	getMSKUList(group, row);
};

/**
 * 箱规选中变化处理
 * @description 当箱规下拉选择变化时触发
 */
const handleStockCartonChange = (row: any, index: any) => {
	const selectedCarton = row.stockCartonList[index];
	if (!selectedCarton || !selectedCarton.skuCartonCode) {
		// 清空时重置相关字段
		if (row.stockCartonList[index]) {
			row.stockCartonList[index].transferCartons = '';
			row.stockCartonList[index].convertQty = '';
		}
		return;
	}
	// 箱规选中后的处理逻辑（如果需要）
	// console.log('箱规已选中:', selectedCarton);
};

/**
 * 获取箱规列表
 * @description 从原库存信息中提取参数，调用接口获取箱规列表
 */
const getStockCartonList = async (row: any, group: TransferGroup) => {
	try {
		// 从原库存信息中提取参数
		const originData = group.originList[0] || {};
		const params = {
			firstMileNo:
				originData.relateOrderNo || originData.businessNo || row.businessNo,
			countryCode: originData.countryCode,
			platformChannelCode: originData.platformChannelCode,
			msku: originData.mskuCode,
			deptId: originData.deptId,
		};

		const res = await getListDeliveryPlan(params);
		if (res.code === 0 && res.data?.deliverPlanTransfers) {
			// 将返回的箱规数据存储到 stockCartonVOList，并计算可用箱数
			row.stockCartonVOList =
				res.data?.deliverPlanTransfers?.map((item: any) => {
					item.availableQty = Math.floor(
						item.availableQuantity / item.singleCartonQuantity
					);
					return item;
				}) || [];

			// 如果箱规只有一条，自动选中第一条
			if (row.stockCartonVOList.length === 1) {
				// 初始化 stockCartonList
				if (!Array.isArray(row.stockCartonList)) {
					row.stockCartonList = [];
				}
				// 自动选中第一条箱规
				const firstCarton = row.stockCartonVOList[0];
				row.stockCartonList[0] = {
					...firstCarton,
					transferCartons: '',
					convertQty: '',
				};
			}
		}
	} catch (error: any) {
		useMessage().error(error.msg || error.message || '加载箱规列表失败');
	}
};

// 创建新的转库存组
const createTransferGroup = (orderDetail?: any | {}): TransferGroup => {
	// 如果传入了调拨单详情，则合并参数
	const businessNo = orderDetail?.relateOrderNo || '';
	const mergedData = {
		...originalRow.value,
		// ...orderDetail,
		availableQty: orderDetail?.availableQty || '',
		qty: orderDetail?.qty || '',
		businessNo: businessNo,
		stockCartonVOList: [],
		stockCartonList: [],
	};

	return {
		id: ++groupIdCounter,
		loading: false,
		originList: [mergedData],
		baseDetail: {},
		newRows: [createTransferNewRow(mergedData)],
		mskuOption: [],
		businessNo: businessNo,
		selectedOrders: [], // 初始化为空数组
		orderDetail: orderDetail || null,
	};
};
/**
 * 创建新的转库存行数据
 * @param orderDetail 订单详情（可选）
 */
const createTransferNewRow = (orderDetail?: any | {}): any => {
	return {
		...originalRow.value,
		...orderDetail,
		stockCartonVOList: [], // 可用的箱规选项列表
		stockCartonList: [], // 已选择的箱规列表（初始为空，渲染时会自动显示一行）
		platformChannelCodeText: '',
		platformChannelCode: '',
		deptName: '',
		deptId: '',
		mskuCode: '',
	};
};

// 原库存信息字段配置
const originStockColumns: any = [
	{
		prop: 'businessNo',
		label: '头程调拨单',
		width: 200,
		isRequired: true,
		showOverflowTooltip: true,
		type: 'firstMileOrder', // 特殊类型：需要下拉框
	},
	{
		prop: 'warehouseName',
		label: '仓库',
		width: 120,
		isRequired: false,
		showOverflowTooltip: true,
	},
	{
		prop: 'legalPersonName',
		label: '法人主体',
		width: 120,
		isRequired: false,
		showOverflowTooltip: true,
	},
	{
		prop: 'skuCode',
		label: 'SKU/产品名称',
		width: 200,
		isRequired: false,
		type: 'sku', // 特殊类型：需要显示 SKU 和产品名称
	},
	{
		prop: 'countryCode',
		label: '国家',
		width: 100,
		isRequired: false,
		showOverflowTooltip: true,
		formatter: (row: any) => row.countryCode || '',
	},
	{
		prop: 'platformChannelCode',
		label: '平台渠道',
		width: 120,
		isRequired: false,
		showOverflowTooltip: true,
	},
	{
		prop: 'mskuCode',
		label: 'MSKU',
		width: 140,
		isRequired: false,
		showOverflowTooltip: true,
	},
	{
		prop: 'qty',
		label: '可用库存',
		width: 120,
		isRequired: false,
	},
	{
		prop: 'parentDeptName',
		label: '部门',
		width: 120,
		isRequired: false,
		showOverflowTooltip: true,
	},
	{
		prop: 'deptName',
		label: '运营小组',
		minWidth: 140,
		isRequired: false,
		showOverflowTooltip: true,
	},
];

// 新库存信息字段配置
const newStockColumns: any = [
	{
		prop: 'businessNo',
		label: '头程调拨单',
		width: 200,
		isRequired: true,
		showOverflowTooltip: true,
	},
	{
		prop: 'countryCode',
		label: '国家',
		type: 'country',
		width: 150,
		isRequired: true,
		placeholder: '请选择',
		options: () => {
			return (props.dictMap.countryList || []).map((item: any) => ({
				label: `${item.chineseName} - ${item.abbTwoCode}`,
				value: item.abbTwoCode,
			}));
		},
		onChange: changeCountry,
	},
	{
		prop: 'platformChannelCode',
		label: '平台渠道',
		type: 'platformChannel',
		width: 240,
		isRequired: true,
		placeholder: '请选择',
		options: () => props.dictMap.platformChannel || [],
		onChange: changePlatformChannel,
	},
	{
		prop: 'mskuCode',
		label: 'MSKU',
		type: 'msku',
		width: 220,
		isRequired: true,
		placeholder: '请选择',
		options: (group: TransferGroup) => group.mskuOption || [],
	},
	{
		prop: 'deptId',
		label: '部门&运营小组',
		type: 'cascader',
		width: 220,
		isRequired: true,
		placeholder: '请选择',
		options: () => props.dictMap.deptTree || [],
	},
	{
		prop: 'skuCartonCode',
		label: '箱规编码',
		width: 280,
		isRequired: true,
		showOverflowTooltip: true,
	},
	{
		prop: 'convertQty',
		label: '转换数量',
		type: 'display',
		minWidth: 120,
		isRequired: false,
		useStockCartonList: true,
	},
	{
		prop: 'transferCartons',
		label: '转换箱数',
		width: 100,
		isRequired: true,
	},
	{
		prop: 'availableQty',
		label: '可用箱数',
		type: 'display',
		width: 100,
		isRequired: false,
		useStockCartonList: true,
		formatter: (row: any, item: any) => {
			// if (!item.skuCartonCodes) return '0';
			// const carton = row.stockCartonVOList.find((c: any) => c.skuCartonCode === item.skuCartonCodes);
			// return carton?.availableQty || 0;
			return item?.availableQty || 0;
		},
	},
	{
		prop: 'singleCartonQuantity',
		label: '单箱数量',
		type: 'display',
		width: 100,
		isRequired: false,
		useStockCartonList: true,
		formatter: (row: any, item: any) => {
			// if (!item.skuCartonCodes) return '0';
			// const carton = row.stockCartonVOList.find((c: any) => c.skuCartonCode === item.skuCartonCodes);
			// return carton?.singleCartonQuantity || 0;
			return item?.singleCartonQuantity || 0;
		},
	},
	{
		prop: 'outCartonSpecLength',
		label: '外箱长宽高(CM)',
		type: 'display',
		width: 200,
		isRequired: false,
		showOverflowTooltip: true,
		useStockCartonList: true,
		className: 'customClass',
		formatter: (row: any, item: any) => {
			// if (!item.skuCartonCodes) return '0*0*0';
			// const carton = row.stockCartonVOList.find((c: any) => c.skuCartonCode === item.skuCartonCodes);
			// if (!carton) return '0*0*0';
			// return `${carton.outCartonLength || 0}*${carton.outCartonWidth || 0}*${carton.outCartonHeight || 0}`;
			return `${item?.outCartonLength || 0}*${item?.outCartonWidth || 0}*${
				item?.outCartonHeight || 0
			}`;
		},
	},
	{
		prop: 'outCartonGrossWeight',
		label: '外箱毛重(KG)',
		type: 'display',
		width: 180,
		isRequired: false,
		showOverflowTooltip: true,
		useStockCartonList: true,
		className: 'customClass',
		formatter: (row: any, item: any) => {
			// if (!item.skuCartonCodes) return '0';
			// const carton = row.stockCartonVOList.find((c: any) => c.skuCartonCode === item.skuCartonCodes);
			// return carton?.outCartonGrossWeight || 0;
			return item?.outCartonGrossWeight || 0;
		},
	},
];

let loading = ref<boolean>(false);

// 打开弹窗：入参为选中的原库存记录（至少包含唯一标识）
const open = async (_row: any) => {
	resetAll();
	visible.value = true;
	originalRow.value = _row;
	loading.value = true;
	// 加载头程调拨单选项
	await fetchFirstMileOrderOptions();

	// 创建第一组数据（默认为空组，用于新增）
	let firstGroup = createTransferGroup();
	transferGroups.value = [firstGroup];
	loading.value = false;
	// 获取该组的详情数据
	// await fetchOriginForGroup(firstGroup, originalRow.value);
	// await fetchOriginForGroup(firstGroup, row);
};

// 重置弹窗
const resetAll = () => {
	transferType.value = 1;
	previousTransferType.value = 1;
	transferGroups.value = [];
	groupIdCounter = 0;
	originalRow.value = {};
};

// 获取 MSKU 列表
const getMSKUList = async (group: TransferGroup, row: any) => {
	try {
		const res = await getSkuQueryMsku({
			skuCode:
				row.skuCode || (group.originList.length && group.originList[0].skuCode),
			countryCode:
				row.countryCode ||
				(group.originList.length && group.originList[0].countryCode),
			platformChannelCode: row.platformChannelCode,
		});
		if (res.code === 0) {
			group.mskuOption = res.data || [];
		}
	} catch (error: any) {
		useMessage().error(error.msg || '加载失败，请稍后重试');
	}
};

/**
 * 处理头程调拨单下拉框失去焦点事件
 * 只有在选中多个调拨单时才创建新组
 * @param group 当前组
 */
const handleGroupOrderBlur = async (group: TransferGroup) => {
	const selectedOrders = group.selectedOrders || [];

	// 如果没有选中任何调拨单，清空当前组的 businessNo
	if (selectedOrders.length === 0) {
		// group.businessNo = '';
		// group.orderDetail = null;
		// if (group.originList.length > 0) {
		// 	group.originList[0].businessNo = '';
		// }
		// if (group.newRows.length > 0) {
		// 	group.newRows[0].businessNo = '';
		// }
		return;
	}

	// 如果只选中一个调拨单，直接更新当前组，不创建新组
	if (selectedOrders.length === 1) {
		const orderDetail = selectedOrders[0];
		group.businessNo = orderDetail.relateOrderNo;
		group.orderDetail = orderDetail;
		group.selectedOrders = []; // 清空多选状态
		await initTransferGroups(group, orderDetail);
		return;
	}

	// 如果选中多个调拨单（大于1个），则根据选中的数量创建对应的组
	if (selectedOrders.length > 1) {
		// 找到当前组在数组中的位置
		const currentIndex = transferGroups.value.findIndex(
			(g) => g.id === group.id
		);
		if (currentIndex === -1) return;

		// 创建新的组数组：第一个调拨单分配给当前组，其余的创建新组
		const newGroups: TransferGroup[] = [];

		// 使用 for 循环处理异步操作
		for (let index = 0; index < selectedOrders.length; index++) {
			const orderDetail = selectedOrders[index];
			if (index === 0) {
				// 第一个调拨单分配给当前组，并获取箱规
				await initTransferGroups(group, orderDetail);
			} else {
				// 其余的调拨单创建新组，传入完整的调拨单对象
				const newGroup = createTransferGroup(orderDetail);
				// 为新组也获取箱规列表
				if (newGroup.newRows.length > 0) {
					await getStockCartonList(newGroup.newRows[0], newGroup);
				}
				newGroups.push(newGroup);
			}
		}

		// 将新组插入到当前组之后
		transferGroups.value.splice(currentIndex + 1, 0, ...newGroups);

		useMessage().success(
			`已根据选中的 ${selectedOrders.length} 个调拨单创建 ${selectedOrders.length} 组数据`
		);
	}
};

const initTransferGroups = async (group: TransferGroup, orderDetail: any) => {
	// 第一个调拨单分配给当前组
	group.businessNo = orderDetail.relateOrderNo;
	group.orderDetail = orderDetail;
	group.selectedOrders = []; // 清空多选状态

	// 合并调拨单参数到原库存信息
	if (group.originList.length > 0) {
		group.originList[0] = {
			...group.originList[0],
			// ...orderDetail,
			availableQty: orderDetail.availableQty,
			qty: orderDetail?.qty || '',
			businessNo: orderDetail.relateOrderNo,
		};
	}

	// 合并调拨单参数到新库存信息
	if (group.newRows.length > 0) {
		group.newRows[0] = createTransferNewRow({
			...group.newRows[0],
			...orderDetail,
			mskuCode: '',
			businessNo: orderDetail.relateOrderNo,
		});

		// 获取箱规列表（在选中头程调拨单时自动获取）
		await getStockCartonList(group.newRows[0], group);
	}

	return group;
};

/**
 * 删除转库存组
 */
const removeTransferGroup = async (index: number) => {
	const result = await useMessageBox().confirm('确定要删除吗？');
	if (!result) return;
	// 不能删除唯一的空组
	const groupsWithData = transferGroups.value.filter((g) => g.businessNo);
	if (groupsWithData.length === 0 && transferGroups.value.length === 1) {
		useMessage().warning('至少保留一组数据');
		return;
	}

	transferGroups.value.splice(index, 1);
};
const addDemandGroup = () => {
	const newGroup = createTransferGroup();
	transferGroups.value.push(newGroup);
};
/**
 * 获取箱规编码行数据
 * @description 确保至少返回一行数据，用于 v-for 渲染
 */
const getStockCartonRows = (row: any) => {
	// 初始化 stockCartonList（如果未定义）
	if (!Array.isArray(row.stockCartonList)) {
		row.stockCartonList = [];
	}
	// 至少返回一行空数据，用于显示添加按钮
	return row.stockCartonList.length > 0 ? row.stockCartonList : [{}];
};

/**
 * 获取可用的箱规选项（过滤掉已选的）
 * @description 在下拉选项中过滤掉其他位置已选择的箱规，避免重复选择
 * @param row 当前行数据
 * @param currentIndex 当前选择框的索引
 * @returns 过滤后的箱规选项列表
 */
const getAvailableStockCartonOptions = (row: any, currentIndex: any) => {
	// 如果没有可用的箱规列表，返回空数组
	if (!Array.isArray(row.stockCartonVOList)) return [];
	// 如果没有已选列表，返回全部选项
	if (!Array.isArray(row.stockCartonList)) return row.stockCartonVOList;

	// 获取其他位置已选的箱规编码（排除当前位置）
	const selectedCodes = row.stockCartonList
		.map((item: any, index: number) => {
			// 排除当前索引位置，允许当前位置显示已选的项
			if (index === currentIndex) return null;
			return item?.skuCartonCode;
		})
		.filter((code: any) => code); // 过滤掉空值

	// 过滤掉其他位置已选的箱规
	return row.stockCartonVOList.filter((opt: any) => {
		return !selectedCodes.includes(opt.skuCartonCode);
	});
};

/**
 * 增加箱规编码行
 */
const addStockCartonList = (row: any) => {
	// 初始化 stockCartonList（如果未定义）
	if (!Array.isArray(row.stockCartonList)) {
		row.stockCartonList = [];
	}
	if (!Array.isArray(row.stockCartonVOList)) {
		row.stockCartonVOList = [];
	}

	// 添加的行不能超过箱规编码的总数
	if (row.stockCartonList.length >= row.stockCartonVOList.length) {
		useMessage().warning('箱规编码已全部添加完毕');
		return;
	}

	// 添加新的空行
	row.stockCartonList.push({
		skuCartonCode: '',
		skuCartonCodes: '',
		transferCartons: '',
		convertQty: '',
	});
};

/**
 * 删除箱规编码行
 */
const removeStockCartonList = (row: any, index: any) => {
	if (row.stockCartonList.length > 1) {
		row.stockCartonList.splice(index, 1);
	} else {
		useMessage().warning('至少保留一行箱规编码');
	}
};

const onQtyBlur = (row: any, item: any) => {
	// const code = item.skuCartonCodes;
	// if (!code) return;
	// const carton = (row.stockCartonVOList || []).find((c: any) => c.skuCartonCode === code) || {};
	// 校验正整数
	const raw = String(item.transferCartons || '').trim();
	if (!raw) {
		item.convertQty = '';
		return;
	}
	if (!/^(?:[1-9]\d*)$/.test(raw)) {
		useMessage().error('转换箱数只能输入正整数');
		item.transferCartons = '';
		item.convertQty = '';
		return;
	}
	const n = Number(raw);
	const max = Number(item.availableQty || item.availableQty || 0);
	if (n > max) {
		useMessage().warning('转换箱数不可大于可用箱数');
		item.transferCartons = String(max);
		item.convertQty = computeCartons(
			max,
			Number(item.singleCartonQuantity || 0)
		);
		return;
	}
	item.convertQty = computeCartons(n, Number(item.singleCartonQuantity || 0));
};

const computeCartons = (qty: number, single: number) => {
	if (!qty || !single) return 0;
	return Math.ceil(qty * single);
};

const handleClose = () => {
	visible.value = false;
	emit('closed');
};

/**
 * 校验所有组的数据
 * @returns 校验是否通过
 */
const postVerify = () => {
	// 过滤掉空组（没有头程调拨单号的组）

	// 检查是否有有效的组
	if (transferGroups.value.length === 0) {
		useMessage().error('请至少填写一组数据');
		return false;
	}

	// 记录第一个错误消息
	let firstErrorMessage = '';

	// 校验所有有效组并更新分组校验状态
	for (
		let groupIndex = 0;
		groupIndex < transferGroups.value.length;
		groupIndex++
	) {
		const group = transferGroups.value[groupIndex];
		const row = group.newRows[0] || {};

		// 必填字段校验 - 头程调拨单
		if (!group.businessNo && !row.businessNo) {
			group.hasError = true;
			if (!firstErrorMessage) {
				firstErrorMessage = `第${groupIndex + 1}组库存信息：请选择头程调拨单`;
			}
			continue; // 跳到下一个组
		}

		// 必填字段校验 - 国家
		if (!row.countryCode) {
			group.hasError = true;
			if (!firstErrorMessage) {
				firstErrorMessage = `第${groupIndex + 1}组库存信息：请选择国家`;
			}
			continue;
		}

		// 必填字段校验 - 平台渠道
		if (!row.platformChannelCode) {
			group.hasError = true;
			if (!firstErrorMessage) {
				firstErrorMessage = `第${groupIndex + 1}组库存信息：请选择平台渠道`;
			}
			continue;
		}

		// 必填字段校验 - MSKU
		if (!row.mskuCode) {
			group.hasError = true;
			if (!firstErrorMessage) {
				firstErrorMessage = `第${groupIndex + 1}组库存信息：请选择MSKU`;
			}
			continue;
		}

		// 必填字段校验 - 部门&运营小组
		if (!row.deptId) {
			group.hasError = true;
			if (!firstErrorMessage) {
				firstErrorMessage = `第${
					groupIndex + 1
				}组库存信息：请选择部门&运营小组`;
			}
			continue;
		}

		// 箱规编码校验
		if (!row.stockCartonList || row.stockCartonList.length === 0) {
			group.hasError = true;
			if (!firstErrorMessage) {
				firstErrorMessage = `第${groupIndex + 1}组库存信息：请至少选择一条箱规`;
			}
			continue;
		}

		// 箱规编码详细校验
		let hasCartonError = false;
		for (let i = 0; i < row.stockCartonList.length; i++) {
			const it = row.stockCartonList[i];
			if (!it.skuCartonCode) {
				group.hasError = true;
				hasCartonError = true;
				if (!firstErrorMessage) {
					firstErrorMessage = `第${groupIndex + 1}组库存信息 第${
						i + 1
					}行：请选择箱规编码`;
				}
				break; // 跳出箱规循环
			}
			if (!/^(?:[1-9]\d*)$/.test(String(it.transferCartons || ''))) {
				group.hasError = true;
				hasCartonError = true;
				if (!firstErrorMessage) {
					firstErrorMessage = `第${groupIndex + 1}组库存信息 第${
						i + 1
					}行：请输入有效转换箱数`;
				}
				break; // 跳出箱规循环
			}
		}

		// 如果箱规校验有错误，跳到下一个组
		if (hasCartonError) {
			continue;
		}

		// 该组校验通过，标记为无错误
		group.hasError = false;
	}

	// 如果有错误，提示第一个错误消息并返回 false
	if (firstErrorMessage) {
		useMessage().error(firstErrorMessage);
		return false;
	}

	return true;
};

const handleConfirm = async () => {
	// 调用校验函数
	if (!postVerify()) {
		return;
	}

	try {
		// 构建提交数据（只提交有效组）
		const submitList = transferGroups.value.map((group) => {
			const row = group.newRows[0];
			const baseDetail = group.originList[0];

			// oldDTO
			const oldDTO = {
				...baseDetail,
				legalPersonId: baseDetail.legalPersonId,
				skuCode: baseDetail.skuCode,
				countryCode: baseDetail.countryCode,
				platformChannelCode: baseDetail.platformChannelCode,
				deptId: baseDetail.deptId,
				warehouseCode: baseDetail.warehouseCode,
				mskuCode: baseDetail.mskuCode,
			};

			// newDTOList
			const newFirstMileDTOList = (row.stockCartonList || []).map((it: any) => {
				const postNewDataItem = { ...baseDetail, ...row, ...it };
				return {
					businessNo: postNewDataItem.businessNo,
					legalPersonId: baseDetail.legalPersonId,
					skuCode: postNewDataItem.skuCode,
					countryCode: postNewDataItem.countryCode,
					platformChannelCode: postNewDataItem.platformChannelCode,
					deptId: postNewDataItem.deptId,
					warehouseCode: postNewDataItem.warehouseCode,
					mskuCode: postNewDataItem.mskuCode,
					skuCartonCode: postNewDataItem.skuCartonCode,
					warehouseSku: postNewDataItem.warehouseSku,
					transferCartons: postNewDataItem.transferCartons,
					transferQuantity: postNewDataItem.convertQty,
					deliveryNoAvailableQuantityList:
						postNewDataItem.deliveryNoAvailableQuantityList,
				};
			});
			// 1、采购在途转库存，2、海外仓在途转库存，3、头程在途转库存',
			return { oldDTO, newFirstMileDTOList, transferType: 3 };
		});

		const res = await postBatchSave(submitList);
		if (res.code === 0) {
			if (res.data?.totalCount == res.data?.successCount) {
				emit('submitted');
				handleClose();
				useMessage().success('提交成功');
			} else {
				useMessage().error(
					`提交失败,失败原因:${res.data?.failInfos?.join(',')}`
				);
			}
		}
	} catch (error: any) {
		useMessage().error(error.msg || error.message || '提交失败');
	}
};

defineExpose({ open, handleClose, handleConfirm });
</script>

<style lang="scss" scoped>
// 头部控制区
.header-controls {
	margin-bottom: 16px;
}

.select-type {
	width: 200px;
}

.select-platform {
	width: 220px;
}

// 对话框容器
.dialog-container {
	padding: 0 10px;
	max-height: 70vh;
	overflow: auto;
}

// 转库存组
.transfer-group {
	margin-bottom: 24px;
	padding: 0 16px;
	border: 1px solid #e4e7ed;
	border-radius: 4px;
	background-color: #f9fafb;
	position: relative;

	&:last-of-type {
		margin-bottom: 16px;
	}
}

// 组头部
.group-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	width: 100%;
}

// 标题
.section-title {
	font-weight: bold;
	margin: 10px 0 10px 0;
	display: flex;
	align-items: center;
}

.section-title-spacing {
	margin-top: 16px;
}

.section-bar {
	display: inline-block;
	width: 4px;
	height: 18px;
	background: #2e5cf6;
	border-radius: 2px;
	margin-right: 8px;
}

// SKU 列样式
.sku-column {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: flex-start;
	width: 100%;
}

.sku-text {
	max-width: 100%;
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
}

// 按钮组
.btn-group {
	display: flex;
	justify-content: center;
	align-items: center;
	gap: 4px;
	height: 100%;
}

// 通用样式
.full-width {
	width: 100%;
}

.mb8 {
	margin-bottom: 8px;
}

.mb12 {
	margin-bottom: 12px;
}

.new-table :deep(.el-input__wrapper) {
	padding: 0 8px;
}

.customClass {
	color: #333333;
	margin-top: 4px;
}

.required-icon {
	color: red;
}
.add-demand-btn {
	text-align: left;
	padding: 16px 0;
}

.error-dot {
	position: absolute;
	top: 10px;
	right: 10px;
	width: 8px;
	height: 8px;
	background-color: #f56c6c;
	border-radius: 50%;
}
</style>
