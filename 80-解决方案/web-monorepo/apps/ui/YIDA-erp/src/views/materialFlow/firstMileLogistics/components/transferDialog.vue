<template>
	<el-dialog
		v-model="visible"
		width="90%"
		:close-on-click-modal="false"
		draggable
		:destroy-on-close="false"
		title="转库存申请"
	>
		<div class="header-controls">
			<el-select
				v-model="transferType"
				placeholder="请选择单据类型"
				class="select-type"
				@change="handleTransferTypeChange"
			>
				<el-option label="头程在途转换" :value="1" />
				<el-option label="海外仓" :value="2" />
			</el-select>
		</div>

		<div class="dialog-container">
			<!-- 循环渲染每一组 -->
			<div
				v-for="(group, groupIndex) in transferGroups"
				:key="group.id"
				class="transfer-group"
			>
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
						<template #default="{ row }">
							<!-- 头程调拨单特殊处理：有单号显示，否则显示下拉框（支持多选） -->
							<template v-if="column.type === 'firstMileOrder'">
								<span v-if="row.firstMileOrderNo">{{
									row.firstMileOrderNo
								}}</span>
								<el-select
									v-else
									v-model="group.selectedOrders"
									placeholder="请选择头程调拨单（可多选）"
									multiple
									clearable
									filterable
									collapse-tags
									:max-collapse-tags="2"
									@blur="handleGroupOrderBlur(group)"
								>
									<el-option
										v-for="item in getAvailableOrderOptions(group)"
										:key="item.value"
										:label="item.label"
										:value="item.value"
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
							<template v-if="column.prop === 'firstMileOrderNo'">
								<span v-if="row.firstMileOrderNo">{{
									row.firstMileOrderNo
								}}</span>
								<el-select
									v-else
									v-model="group.selectedOrders"
									placeholder="请选择头程调拨单（可多选）"
									multiple
									clearable
									filterable
									collapse-tags
									:max-collapse-tags="2"
									@blur="handleGroupOrderBlur(group)"
								>
									<el-option
										v-for="item in getAvailableOrderOptions(group)"
										:key="item.value"
										:label="item.label"
										:value="item.value"
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
									v-for="(item, index) in row.stockCartonList"
									:key="index"
									class="mb8 full-width"
									:gutter="8"
								>
									<el-col :span="20">
										<el-select
											collapse-tags
											:max-collapse-tags="1"
											clearable
											filterable
											v-model="item.skuCartonCodes"
											placeholder="请选择"
										>
											<el-option
												v-for="opt in row.stockCartonVOList || []"
												:key="opt.skuCartonCode"
												:label="opt.skuCartonCode"
												:value="opt.skuCartonCode"
											/>
										</el-select>
									</el-col>
									<el-col :span="4">
										<div class="btn-group">
											<el-button
												type="primary"
												size="small"
												:icon="Plus"
												v-if="index === 0"
												@click="addStockCartonList(row)"
											/>
											<el-button
												type="primary"
												size="small"
												:icon="Minus"
												v-else
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
										:disabled="!item.skuCartonCodes"
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
												column.formatter ? column.formatter(row, item) : '---'
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
			<!-- 添加需求单按钮 -->
			<div class="add-demand-btn">
				<el-button
					type="primary"
					size="small"
					:icon="Plus"
					@click="addDemandGroup"
				/>
			</div>
		</div>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="handleClose">取消</el-button>
				<el-button type="primary" @click="handleConfirm">确认提交</el-button>
			</span>
		</template>
	</el-dialog>
</template>

<script lang="ts" setup>
import { ref, defineExpose } from 'vue';
import { Plus, Minus } from '@element-plus/icons-vue';
import { useMessage, useMessageBox } from '/@/hooks/message';
import { saveTransferInventoryReview } from '/@/api/warehouse/stock';
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

// 头程调拨单选项（模拟数据，实际应从接口获取）
const firstMileOrderOptions = ref<Array<{ label: string; value: string }>>([
	{ label: '头程调拨单001', value: 'FM001' },
	{ label: '头程调拨单002', value: 'FM002' },
	{ label: '头程调拨单003', value: 'FM003' },
	{ label: '头程调拨单004', value: 'FM004' },
	{ label: '头程调拨单005', value: 'FM005' },
]);

/**
 * 获取指定组的可用头程调拨单选项
 * 过滤掉已被其他组选择的订单号，避免重复选择
 * @param currentGroup 当前组
 * @returns 可用的订单选项列表
 */
const getAvailableOrderOptions = (currentGroup: TransferGroup) => {
	// 收集其他组已选的订单号（包括 firstMileOrderNo 和 selectedOrders）
	const selectedOrdersSet = new Set<string>();

	transferGroups.value.forEach((g) => {
		if (g.id !== currentGroup.id) {
			// 添加单个已选订单号
			if (g.firstMileOrderNo) {
				selectedOrdersSet.add(g.firstMileOrderNo);
			}
			// 添加多选中的订单号
			if (g.selectedOrders && g.selectedOrders.length > 0) {
				g.selectedOrders.forEach((order) => selectedOrdersSet.add(order));
			}
		}
	});

	// 返回过滤后的选项
	return firstMileOrderOptions.value.filter(
		(option) => !selectedOrdersSet.has(option.value)
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
	firstMileOrderNo: string; // 头程调拨单号（单个）
	selectedOrders: string[]; // 多选的头程调拨单号列表
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

// 创建新的转库存组
const createTransferGroup = (firstMileOrderNo?: string): TransferGroup => {
	return {
		id: ++groupIdCounter,
		loading: false,
		originList: [
			{
				...originalRow.value,
				createId: 1,
				createName: '管理员',
				updateId: 1,
				updateName: '管理员',
				createTime: '2025-11-10 19:59:08',
				updateTime: '2025-11-10 19:59:08',
				delFlag: '0',
				id: 13,
				firstMileNo: 'FL202511100008',
				orderContainerNo: 'KJCNNBOGE25ces0058',
				intoNo: null,
				intoPredictionTime: null,
				predictionWarehouseCode: null,
				autoIntoFlag: 0,
				status: 1,
				startCountryCode: 'US',
				destCountryCode: 'GE',
				startPortCode: 'CNNBO',
				destPortCode: 'USNYK',
				transportMethod: '1',
				shippingMethod: null,
				domesticForwarderNo: 'huodai001',
				mainForwarderNo: 'HU-3434',
				customsForwarderNo: 'HU-343455',
				deliveryForwarderNo: 'test01',
				transshipmentFlag: 0,
				transshipmentWarehouseCode: null,
				actualLoadingTime: '2025-11-10 00:00:00',
				containerType: '40GP',
				soNo: '1231231',
				containerNo: '123123123',
				containerTotalQuantity: 100,
				containerTotalCartonQuantity: 10,
				intoTotalQuantity: 0,
				intoTotalCartonQuantity: 0,
				containerTotalVolume: 0.01,
				containerTotalNetWeight: 920,
				containerTotalGrossWeight: 100,
				statusText: '已出库',
				destWarehouseNameList: ['GLK仓库'],
				transshipmentFlagText: '否',
				transWarehouseName: null,
				startCountryText: '美国',
				destCountryText: '格鲁吉亚',
				startPortText: '宁波港',
				destPortText: '纽约港',
				shippingMethodText: 'null',
				transportMethodText: '海运-OA船',
				domesticForwarderName: '货代测试',
				mainForwarderName: '有点东西',
				customsForwarderName: '堡森',
				deliveryForwarderName: 'test货代',
				containerTypeText: '40GP',
				needPredictionFlag: 0,
			},
		],
		baseDetail: {},
		newRows: [
			{
				firstMileOrderNo: firstMileOrderNo || '',
				countryCode: '',
				platformChannelCode: '',
				mskuCode: '',
				deptId: '',
				stockCartonVOList: [],
				stockCartonList: [
					{ skuCartonCodes: '', convertQty: '', transferCartons: '' },
				],
			},
		],
		mskuOption: [],
		firstMileOrderNo: firstMileOrderNo || '',
		selectedOrders: [], // 初始化为空数组
	};
};

// 原库存信息字段配置
const originStockColumns = [
	{
		prop: 'firstMileOrderNo',
		label: '头程调拨单',
		width: 200,
		showOverflowTooltip: true,
		type: 'firstMileOrder', // 特殊类型：需要下拉框
	},
	{
		prop: 'destWarehouseNameList',
		label: '仓库',
		width: 120,
		showOverflowTooltip: true,
		formatter: (row: any) => row.destWarehouseNameList.join(',') || '',
	},
	{
		prop: 'legalPersonName',
		label: '法人主体',
		width: 120,
		showOverflowTooltip: true,
		formatter: (row: any) => row.legalPersonName ?? '---',
	},
	{
		prop: 'skuCode',
		label: 'SKU/产品名称',
		width: 200,
		type: 'sku', // 特殊类型：需要显示 SKU 和产品名称
	},
	{
		prop: 'countryCode',
		label: '国家',
		width: 100,
		showOverflowTooltip: true,
		formatter: (row: any) => row.countryCode || '',
	},
	{
		prop: 'platformChannelCodeText',
		label: '平台渠道',
		width: 120,
		showOverflowTooltip: true,
		formatter: (row: any) => row.platformChannelCodeText || '',
	},
	{
		prop: 'mskuCode',
		label: 'MSKU',
		width: 140,
		showOverflowTooltip: true,
		formatter: (row: any) => row.skuCode || row.mskuCode,
	},
	{
		prop: 'availableQty',
		label: '可用库存',
		width: 120,
		formatter: (row: any) => row.availableQty ?? '---',
	},
	{
		prop: 'deptName',
		label: '部门',
		width: 120,
		showOverflowTooltip: true,
		formatter: (row: any) => row.deptName || '',
	},
	{
		prop: 'deptName',
		label: '运营小组',
		minWidth: 140,
		showOverflowTooltip: true,
		formatter: (row: any) => row.deptName ?? '---',
	},
];

// 新库存信息字段配置
const newStockColumns = [
	{
		prop: 'firstMileOrderNo',
		label: '头程调拨单',
		width: 200,
		isRequired: false,
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
		prop: 'availableQuantity',
		label: '可用数量',
		type: 'display',
		width: 100,
		isRequired: false,
		useStockCartonList: true,
		formatter: (row: any, item: any) => {
			if (!item.skuCartonCodes) return '0';
			const carton = row.stockCartonVOList.find(
				(c: any) => c.skuCartonCode === item.skuCartonCodes
			);
			return carton?.availableQuantity || 0;
		},
	},
	{
		prop: 'convertQty',
		label: '转换数量',
		type: 'display',
		minWidth: 120,
		isRequired: false,
		useStockCartonList: true,
		formatter: (row: any, item: any) => {
			return item.convertQty ? item.convertQty || 0 : '0';
		},
	},
	{
		prop: 'transferCartons',
		label: '转换箱数',
		width: 100,
		isRequired: false,
	},
	{
		prop: 'availableQty',
		label: '可用箱数',
		type: 'display',
		width: 100,
		isRequired: false,
		useStockCartonList: true,
		formatter: (row: any, item: any) => {
			if (!item.skuCartonCodes) return '0';
			const carton = row.stockCartonVOList.find(
				(c: any) => c.skuCartonCode === item.skuCartonCodes
			);
			return carton?.availableQty || 0;
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
			if (!item.skuCartonCodes) return '0';
			const carton = row.stockCartonVOList.find(
				(c: any) => c.skuCartonCode === item.skuCartonCodes
			);
			return carton?.singleCartonQuantity || 0;
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
			if (!item.skuCartonCodes) return '0*0*0';
			const carton = row.stockCartonVOList.find(
				(c: any) => c.skuCartonCode === item.skuCartonCodes
			);
			if (!carton) return '0*0*0';
			return `${carton.outCartonLength || 0}*${carton.outCartonWidth || 0}*${
				carton.outCartonHeight || 0
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
			if (!item.skuCartonCodes) return '0';
			const carton = row.stockCartonVOList.find(
				(c: any) => c.skuCartonCode === item.skuCartonCodes
			);
			return carton?.outCartonGrossWeight || 0;
		},
	},
];

// 打开弹窗：入参为选中的原库存记录（至少包含唯一标识）
const open = async (_row: any) => {
	resetAll();
	visible.value = true;
	originalRow.value = _row;

	// 创建第一组数据（默认为空组，用于新增）
	let firstGroup = createTransferGroup();
	transferGroups.value = [firstGroup];
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
const handleGroupOrderBlur = (group: TransferGroup) => {
	const selectedOrders = group.selectedOrders || [];

	// 如果没有选中任何调拨单，清空当前组的 firstMileOrderNo
	if (selectedOrders.length === 0) {
		group.firstMileOrderNo = '';
		if (group.originList.length > 0) {
			group.originList[0].firstMileOrderNo = '';
		}
		if (group.newRows.length > 0) {
			group.newRows[0].firstMileOrderNo = '';
		}
		return;
	}

	// 如果只选中一个调拨单，直接更新当前组，不创建新组
	if (selectedOrders.length === 1) {
		group.firstMileOrderNo = selectedOrders[0];
		group.selectedOrders = []; // 清空多选状态
		if (group.originList.length > 0) {
			group.originList[0].firstMileOrderNo = selectedOrders[0];
		}
		if (group.newRows.length > 0) {
			group.newRows[0].firstMileOrderNo = selectedOrders[0];
		}
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

		selectedOrders.forEach((orderNo, index) => {
			if (index === 0) {
				// 第一个调拨单分配给当前组
				group.firstMileOrderNo = orderNo;
				group.selectedOrders = []; // 清空多选状态
				if (group.originList.length > 0) {
					group.originList[0].firstMileOrderNo = orderNo;
				}
				if (group.newRows.length > 0) {
					group.newRows[0].firstMileOrderNo = orderNo;
				}
			} else {
				// 其余的调拨单创建新组
				const newGroup = createTransferGroup(orderNo);
				newGroups.push(newGroup);
			}
		});

		// 将新组插入到当前组之后
		transferGroups.value.splice(currentIndex + 1, 0, ...newGroups);

		useMessage().success(
			`已根据选中的 ${selectedOrders.length} 个调拨单创建 ${selectedOrders.length} 组数据`
		);
	}
};

/**
 * 删除转库存组
 */
const removeTransferGroup = async (index: number) => {
	const result = await useMessageBox().confirm('确定要删除吗？', '提示', {
		confirmButtonText: '确定',
		cancelButtonText: '取消',
		type: 'warning',
	});
	if (!result) return;
	// 不能删除唯一的空组
	const groupsWithData = transferGroups.value.filter((g) => g.firstMileOrderNo);
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
 * 处理转库存类型切换
 */
const handleTransferTypeChange = async (value: number) => {
	try {
		await useMessageBox().confirm(
			'切换后当前编辑内容将被清空是否修改',
			'提示',
			{
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
			}
		);

		// 用户点击确定，更新选中项并重置为初始状态
		previousTransferType.value = value;

		// 保存原始数据的引用（用于重新初始化）
		const savedOriginalRow = { ...originalRow.value };

		// 重置所有数据到初始状态
		transferGroups.value = [];
		groupIdCounter = 0;

		// 重新创建第一组数据（空组）
		const firstGroup = createTransferGroup();
		transferGroups.value = [firstGroup];

		// 如果有原始数据，恢复到 originalRow
		if (savedOriginalRow && Object.keys(savedOriginalRow).length > 0) {
			originalRow.value = savedOriginalRow;
			// 恢复原始列表数据
			transferGroups.value[0].originList = [...savedOriginalRow];
		}

		useMessage().success('已切换单据类型');
	} catch (error) {
		// 用户点击取消或关闭，恢复到之前的选中项
		transferType.value = previousTransferType.value;
	}
};
/**
 * 增加箱规编码行
 */
const addStockCartonList = (row: any) => {
	// 添加的行不能超过箱规编码的总数
	if (row.stockCartonList.length >= row.stockCartonVOList.length) {
		useMessage().warning('箱规编码已全部添加完毕');
		return;
	}
	row.stockCartonList.push({ skuCartonCodes: '', convertQty: 0 });
};

/**
 * 删除箱规编码行
 */
const removeStockCartonList = (row: any, index: number) => {
	if (row.stockCartonList.length > 1) {
		row.stockCartonList.splice(index, 1);
	} else {
		useMessage().warning('至少保留一行箱规编码');
	}
};

const onQtyBlur = (row: any, item: any) => {
	const code = item.skuCartonCodes;
	if (!code) return;
	const carton =
		(row.stockCartonVOList || []).find((c: any) => c.skuCartonCode === code) ||
		{};
	// 校验正整数
	const raw = String(item.transferCartons || '').trim();
	if (!raw) {
		item.convertQty = 0;
		return;
	}
	if (!/^(?:[1-9]\d*)$/.test(raw)) {
		useMessage().error('转换箱数只能输入正整数');
		item.transferCartons = '';
		item.convertQty = 0;
		return;
	}
	const n = Number(raw);
	const max = Number(carton.availableQty || carton.availableQty || 0);
	if (n > max) {
		useMessage().warning('转换箱数不可大于可用箱数');
		item.convertQty = String(max);
		item.convertQty = computeCartons(
			max,
			Number(carton.singleCartonQuantity || 0)
		);
		return;
	}
	item.convertQty = computeCartons(n, Number(carton.singleCartonQuantity || 0));
};

const computeCartons = (qty: number, single: number) => {
	if (!qty || !single) return 0;
	return Math.ceil(qty * single);
};

const handleClose = () => {
	visible.value = false;
	emit('closed');
};

const handleConfirm = async () => {
	// 过滤掉空组（没有头程调拨单号的组）
	const validGroups = transferGroups.value.filter(
		(group) =>
			group.firstMileOrderNo ||
			(group.newRows[0] && group.newRows[0].firstMileOrderNo)
	);

	// 检查是否有有效的组
	if (validGroups.length === 0) {
		return useMessage().error('请至少填写一组数据');
	}

	// 校验所有有效组
	for (let groupIndex = 0; groupIndex < validGroups.length; groupIndex++) {
		const group = validGroups[groupIndex];
		const row = group.newRows[0] || {};

		// 必填字段校验
		if (!group.firstMileOrderNo && !row.firstMileOrderNo) {
			return useMessage().error(`第${groupIndex + 1}组：请选择头程调拨单`);
		}

		if (!row.countryCode) {
			return useMessage().error(`第${groupIndex + 1}组：请选择国家`);
		}

		if (!row.platformChannelCode) {
			return useMessage().error(`第${groupIndex + 1}组：请选择平台渠道`);
		}

		if (!row.mskuCode) {
			return useMessage().error(`第${groupIndex + 1}组：请选择MSKU`);
		}

		if (!row.deptId) {
			return useMessage().error(`第${groupIndex + 1}组：请选择部门&运营小组`);
		}

		// 箱规编码校验
		if (!row.stockCartonList || row.stockCartonList.length === 0) {
			return useMessage().error(`第${groupIndex + 1}组：请至少选择一条箱规`);
		}

		for (let i = 0; i < row.stockCartonList.length; i++) {
			const it = row.stockCartonList[i];
			if (!it.skuCartonCodes) {
				return useMessage().error(
					`第${groupIndex + 1}组 第${i + 1}行：请选择箱规编码`
				);
			}
			if (!/^(?:[1-9]\d*)$/.test(String(it.transferCartons || ''))) {
				return useMessage().error(
					`第${groupIndex + 1}组 第${i + 1}行：请输入有效转换箱数`
				);
			}
		}
	}

	try {
		// 构建提交数据（只提交有效组）
		const submitList = validGroups.map((group) => {
			const row = group.newRows[0];
			const base = group.baseDetail;

			// oldDTO
			const oldDTO = {
				legalPersonId: base.legalPersonId,
				skuCode: base.skuCode,
				countryCode: base.countryCode,
				platformChannelCode: base.platformChannelCode,
				deptId: base.deptId,
				warehouseCode: base.warehouseCode,
				mskuCode: base.mskuCode,
				firstMileOrderNo: group.firstMileOrderNo,
			};

			// newDTOList
			const newDTOList = (row.stockCartonList || []).map((it: any) => ({
				legalPersonId: base.legalPersonId,
				skuCode: base.skuCode,
				countryCode: row.countryCode || base.countryCode,
				platformChannelCode: row.platformChannelCode,
				deptId: row.deptId || base.deptId,
				warehouseCode: base.warehouseCode,
				mskuCode: row.mskuCode || base.mskuCode,
				skuCartonCode: it.skuCartonCodes,
				transferCartons: Number(it.transferCartons || 0),
				transferQuantity: Number(it.convertQty || 0),
				warehouseSku: base.stockCartonVOS?.[0]?.warehouseSku,
				firstMileOrderNo: group.firstMileOrderNo,
			}));

			return { oldDTO, newDTOList };
		});

		// TODO: 这里需要根据实际接口调整提交格式
		// 如果接口支持批量提交，可以直接传 submitList
		// 如果不支持，需要循环提交每一组
		const payload = {
			transferList: submitList,
			stockTransferType: transferType.value, // 1-在途转换，2-头程在途转换
		};

		const res = await saveTransferInventoryReview(payload);
		if (res.code === 0) {
			emit('submitted');
			handleClose();
			useMessage().success('提交成功');
		}
	} catch (error: any) {
		useMessage().error(error.msg || error.message || '提交失败');
	}
};

defineExpose({ open, handleClose });
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
	padding: 16px;
	border: 1px solid #e4e7ed;
	border-radius: 4px;
	background-color: #f9fafb;

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
</style>
