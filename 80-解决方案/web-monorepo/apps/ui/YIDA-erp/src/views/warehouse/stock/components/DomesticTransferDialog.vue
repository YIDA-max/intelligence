<template>
	<el-dialog
		v-model="visible"
		width="90%"
		:close-on-click-modal="false"
		draggable
		:destroy-on-close="false"
		title="转库存申请—采购在途转换"
	>
		<div class="dialog-container" v-loading="loading">
			<!-- 循环渲染每一组需求单 -->
			<div
				v-for="(group, groupIndex) in demandGroups"
				:key="group.id"
				class="demand-group"
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
						v-if="demandGroups.length > 1"
						@click="removeDemandGroup(groupIndex)"
					/>
				</div>
				<el-table :data="group.originList" border size="small" native-scrollbar>
					<el-table-column
						v-for="column in originStockColumns"
						:key="column.prop"
						:prop="column.prop"
						:label="column.label"
						:width="column.width"
						:show-overflow-tooltip="column.showOverflowTooltip"
					>
						<template #default="{ row }">
							<!-- SKU特殊展示 -->
							<sku-table-column v-if="column.type === 'sku'" :row="row" />
							<!-- 常规文本显示 -->
							<span v-else>{{
								column.formatter
									? column.formatter(row)
									: row[column.prop] ?? '---'
							}}</span>
						</template>
					</el-table-column>
				</el-table>
				<!-- 新库存信息 -->
				<div class="section-title" style="margin-top: 16px">
					<span class="section-bar"></span>新库存信息
				</div>
				<el-table :data="group.newRows" border size="small" class="new-table">
					<el-table-column
						v-for="column in newStockColumns"
						:key="column.prop"
						:prop="column.prop"
						:width="column.width"
					>
						<template #header>
							<MrTips
								:required="column.isRequired"
								:label="column.label"
								:tips="column.tips"
							/>
						</template>
						<template #default="{ row }">
							<!-- 输入框 -->
							<el-input
								v-if="column.type === 'input'"
								v-model="row[column.prop]"
								:placeholder="column.placeholder || '请输入'"
								:type="column.inputType || 'text'"
								clearable
								@blur="column.onBlur ? column.onBlur(row, group) : null"
							/>
							<!-- 选择器 -->
							<SelectInputApi
								v-else-if="column.type === 'select'"
								v-model="row[column.prop]"
								:placeholder="column.placeholder || '请选择'"
								clearable
								filterable
								:settings="getSelectInputSettings(column)"
								@change="column.onChange ? column.onChange(row) : null"
							/>

							<!-- 级联选择器 -->
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
							<!-- 只读显示 -->
							<span v-else-if="column.type === 'display'">
								{{
									column.formatter
										? column.formatter(group, row)
										: row[column.prop] ?? '---'
								}}
							</span>
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
					@click="openSelectDemandDialog"
				/>
			</div>
		</div>

		<!-- 选择需求单弹窗 -->
		<SelectDemandDialog
			ref="selectDemandDialogRef"
			:dictMap="props.dictMap"
			@confirm="handleDemandSelected"
		/>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="handleClose">取消</el-button>
				<el-button type="primary" @click="handleConfirm">确认提交</el-button>
			</span>
		</template>
	</el-dialog>
</template>

<script lang="ts" setup>
import { ref, defineAsyncComponent } from 'vue';
import { Plus, Minus } from '@element-plus/icons-vue';
import { useMessage, useMessageBox } from '/@/hooks/message';

import {
	transferInventoryReview,
	getListStockOnewayDetailByPrefix,
} from '/@/api/warehouse/stock/index';
import { getDetailInfoDemandNo } from '/@/api/purchase/demand/index';
const SelectDemandDialog = defineAsyncComponent(
	() => import('./SelectDemandDialog.vue')
);
const SelectInputApi = defineAsyncComponent(
	() => import('/@/componentsApi/SelectInputApi/index.vue')
);
const SkuTableColumn = defineAsyncComponent(
	() => import('/@/components/SkuTableColumn/index.vue')
);
const MrTips = defineAsyncComponent(() => import('/@/common/MrTips/index.vue'));

const props = defineProps({
	dictMap: { type: Object, default: () => ({}) },
});

const emit = defineEmits(['closed', 'submitted']);

interface ISelectOption {
	label: string;
	value: string | number;
}

interface ISelectColumn {
	prop: string;
	placeholder?: string;
	options?: () => ISelectOption[];
}

const visible = ref(false);

// 需求单组列表
interface DemandGroup {
	id: number;
	loading: boolean;
	originList: any[];
	baseDetail: any;
	newRows: any[];
	mskuOption: any[];
	hasError?: boolean; // 校验状态标记
}

const demandGroups = ref<DemandGroup[]>([]);
let groupIdCounter = 0;

// 原始row数据
const originalRow = ref<any>({});

// 选择需求单弹窗引用
const selectDemandDialogRef = ref();

// 转换数量失焦校验
const onTransferQuantityBlur = (row: any, group: DemandGroup) => {
	const raw = String(row.transferNum || '').trim();
	if (!raw) {
		return;
	}
	// 校验是否为正整数
	if (!/^(?:[1-9]\d*)$/.test(raw)) {
		useMessage().error('转换数量只能输入正整数');
		row.transferNum = '';
		return;
	}
	const n = Number(raw);
	const availableQty = group.originList[0]?.availableQuantity || 0;
	// 校验是否大于可提数量
	if (n > availableQty) {
		useMessage().warning('转换数量不可大于可提数量');
		row.transferNum = String(availableQty);
		return;
	}
};

// 国家改变
const changeCountry = (row: any) => {
	row.platformChannelCode = '';
};

const getSelectInputSettings = (column: ISelectColumn) => {
	const options = column.options ? column.options() : [];

	return {
		text: column.placeholder || '请选择',
		getTreeData: async () => ({
			code: 0,
			data: options,
		}),
		selectTreeProps: {
			value: 'value',
			label: 'label',
		},
		getIdsCode: 'value',
		width: '100%',
	};
};

// 获取并填充初始需求单信息（原库存信息 + 新库存信息）
const fillDemandInfoToNewStock = async (group: DemandGroup, row: any) => {
	loading.value = true;
	try {
		// 检查是否有关联的需求信息
		if (!row.onwaySourceDetails || row.onwaySourceDetails.length === 0) {
			return group;
		}

		// 取第一个需求单的 sourceOrderNo
		const firstDemand = row.onwaySourceDetails[0];
		const sourceOrderNo = firstDemand.sourceOrderNo;

		if (!sourceOrderNo) {
			return group;
		}
		// 调用接口查询需求关联的 SKU
		await getDemandInfo(sourceOrderNo, group, row);
	} catch (error) {
		loading.value = false;
		throw error;
	} finally {
		loading.value = false;
	}
};

const getDemandInfo = async (
	demandNo: string,
	group: DemandGroup,
	row: any
) => {
	// 调用接口查询需求关联的 SKU
	const res = await getDetailInfoDemandNo({
		demandNo: demandNo,
	});

	// 处理返回数据（可能是分页数据或数组）
	if (res.code === 0 && res.data) {
		// 取第一条需求单数据
		const firstSkuData = res.data;

		// 合并原始 row 数据和需求单数据，构建完整的原库存信息
		const originData = {
			...row, // 原始库存数据（如 onwayQty, lockQty 等）
			...firstSkuData, // 需求单数据
			// 字段映射
			demandNo: demandNo,
			deliveryMethod: firstSkuData.shippingMethod,
			deliveryMethodText: firstSkuData.shippingMethodText,
			purchaseQty: firstSkuData.purchaseNum,
			availableQuantity: firstSkuData.availableQuantity || 0,
		};
		// 更新原库存信息（originList）
		group.originList = [originData];
		group.baseDetail = originData;
		// 将需求单数据填充到新库存信息（newRows[0]）
		group.newRows[0] = {
			...row,
			...group.newRows[0],
			...firstSkuData,
			demandNo: demandNo,
			platformChannelCode: '',
			platformChannelCodeText: '',
			deptId: '',
			deptName: '',
			operation: '',
			transferNum: '',
			deliveryMethod: firstSkuData.shippingMethod,
			deliveryMethodText: firstSkuData.shippingMethodText,
		};

		return group;
	}
};
// 原库存信息字段配置
const originStockColumns = [
	{
		prop: 'demandNo',
		label: '需求单号',
		width: 120,
		showOverflowTooltip: true,
	},
	{
		prop: 'warehouseCode',
		label: '仓库',
		width: 100,
		showOverflowTooltip: true,
		formatter: (row: any) => row.warehouseName,
	},
	{
		prop: 'legalPersonId',
		label: '法人主体',
		width: 120,
		showOverflowTooltip: true,
		formatter: (row: any) => row.legalPersonName,
	},
	{
		prop: 'skuCode',
		label: 'SKU/产品名称',
		width: 200,
		type: 'sku',
	},
	{
		prop: 'countryCode',
		label: '国家',
		width: 100,
		showOverflowTooltip: true,
	},
	{
		prop: 'platformChannelCode',
		label: '平台渠道',
		width: 120,
		showOverflowTooltip: true,
		formatter: (row: any) => row.platformChannelCode,
	},
	// {
	// 	prop: 'mskuCode',
	// 	label: 'MSKU',
	// 	width: 140,
	// 	showOverflowTooltip: true,
	// },
	{
		prop: 'deliveryMethod',
		label: '发货方式',
		width: 100,
		showOverflowTooltip: true,
		formatter: (row: any) => row.deliveryMethodText,
	},
	{
		prop: 'purchaseQty',
		label: '采购数量',
		width: 100,
		showOverflowTooltip: true,
	},
	{
		prop: 'parentDeptName',
		label: '部门',
		width: 100,
		showOverflowTooltip: true,
	},
	{
		prop: 'deptName',
		label: '运营小组',
		width: 100,
		showOverflowTooltip: true,
	},
	{
		prop: 'operationName',
		label: '运营',
		minWidth: 100,
		showOverflowTooltip: true,
	},
];

// 新库存信息字段配置
const newStockColumns = [
	{
		prop: 'demandNo',
		label: '需求单号',
		type: 'display',
		width: 120,
		isRequired: false,
	},
	{
		prop: 'countryCode',
		label: '国家',
		type: 'select',
		width: 180,
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
		type: 'select',
		width: 180,
		isRequired: true,
		placeholder: '请选择',
		options: () => {
			return props.dictMap.platformChannel || [];
		},
		onChange: () => {},
	},
	{
		prop: 'shippingMethod',
		label: '发货方式',
		type: 'select',
		width: 150,
		isRequired: true,
		placeholder: '请选择',
		options: () => props.dictMap.shippingMethod || [],
	},
	{
		prop: 'deptId',
		label: '部门&运营小组',
		type: 'cascader',
		width: 200,
		isRequired: true,
		placeholder: '请选择',
		options: () => props.dictMap.deptTree || [],
	},
	{
		prop: 'operationId',
		label: '运营',
		type: 'select',
		width: 180,
		isRequired: true,
		placeholder: '请选择',
		options: () =>
			(props.dictMap.productManageId || []).map((item: any) => ({
				label: item.name,
				value: item.userId,
			})),
	},
	{
		prop: 'availableQuantity',
		label: '可用数量',
		type: 'display',
		width: 100,
		isRequired: false,
		tips: '=在途库存 - 在途占用',
		formatter: (group: DemandGroup, row: any) => row.availableQuantity ?? 0,
	},
	{
		prop: 'transferNum',
		label: '转换数量',
		type: 'input',
		inputType: 'number',
		width: 120,
		isRequired: true,
		placeholder: '请输入',
		onBlur: onTransferQuantityBlur,
	},
];

/**
 * 点击查询详情
 */
const getStockList = async (row: any) => {
	//新封装接口获取
	const res = await getListStockOnewayDetailByPrefix({
		prefix: 'XQ',
		stockId: row.id,
	});
	if (res.code === 0 && res.data) {
		// 将返回的数据格式化为下拉选项，label 和 value 都使用 sourceOrderNo
		originalRow.value.onwaySourceDetails = res.data;
		row.onwaySourceDetails = res.data;
	}
	//从列表接口获取在途库存详情
	// const res = await postStockList({
	// 	ids: [row.id],
	// });
	// if (res.code === 0) {
	// 	// 在途库存
	// 	originalRow.value.onwaySourceDetails = res.data[0]?.onwaySourceDetails;
	// 	row.onwaySourceDetails =res.data[0]?.onwaySourceDetails;
	// }
};

// 创建新的需求单组
const createDemandGroup = (initData?: any): DemandGroup => {
	return {
		id: ++groupIdCounter,
		loading: false,
		originList: initData ? [initData] : [],
		baseDetail: initData || {},
		newRows: [
			{
				demandNo: '',
				countryCode: '',
				platformChannelCode: '',
				deliveryMethod: '',
				deptId: '',
				operation: '',
				transferNum: '',
			},
		],
		mskuOption: [],
	};
};

let loading = ref<boolean>(false);
// 打开弹窗
const open = async (row: any) => {
	resetAll();
	visible.value = true;
	originalRow.value = row;

	await getStockList(row); // 获取库存列表
	// 创建第一组需求单（不传入 initData，让原库存信息为空）
	let firstGroup = createDemandGroup();
	// 获取关联需求信息并填充到原库存信息和新库存信息
	await fillDemandInfoToNewStock(firstGroup, row);
	demandGroups.value = [firstGroup];
};

// 重置弹窗
const resetAll = () => {
	demandGroups.value = [];
	groupIdCounter = 0;
	originalRow.value = {};
};

// 打开选择需求单弹窗
const openSelectDemandDialog = () => {
	if (originalRow.value.onwaySourceDetails.length === 0) {
		return useMessage().warning('当前在途库存无可选需求单');
	}

	// 获取已选择的需求单号列表
	const selectedDemandNos = demandGroups.value
		.map((group) => group.originList[0]?.demandNo)
		.filter(Boolean); // 过滤掉空值

	// 过滤掉已选的需求单
	const onwaySourceDetails = originalRow.value.onwaySourceDetails.filter(
		(item: any) => {
			// 比对 sourceOrderNo 是否已在已选列表中
			return !selectedDemandNos.includes(item.sourceOrderNo);
		}
	);

	// 如果过滤后没有可选需求单，提示用户
	if (onwaySourceDetails.length === 0) {
		return useMessage().warning('所有需求单已添加完毕');
	}

	// 将当前行的 skuCode 传递给子弹窗作为默认查询条件
	selectDemandDialogRef.value?.open(originalRow.value, onwaySourceDetails);
};

// 处理选择的需求单
const handleDemandSelected = (selectedDemands: any[]) => {
	// 遍历选中的需求单，为每个需求单创建一个需求单组
	selectedDemands.forEach(async (demand) => {
		// 合并原始库存数据和需求单数据，构建完整的原库存信息
		// const originData = {
		// 	...originalRow.value, // 原始库存数据（如 onwayQty, lockQty 等）
		// 	...demand, // 需求单数据
		// 	// 字段映射：将需求单字段映射到目标字段
		// 	demandNo: demand.demandNo,
		// 	deliveryMethod: demand.shippingMethod,
		// 	deliveryMethodText: demand.shippingMethodText,
		// 	purchaseQty: demand.purchaseNum,
		// 	operationName: demand.operationText,
		// 	availableQuantity: demand.availableQuantity || 0,
		// };

		// 创建新的需求单组（不传入 initData）
		const newGroup = createDemandGroup(demand);
		await getDemandInfo(demand.demandNo, newGroup, originalRow.value);

		// 手动设置原库存信息（originList）和基础数据
		// newGroup.originList = [originData];
		// newGroup.baseDetail = originData;

		// // 将需求单数据填充到新库存信息（newRows[0]）
		// newGroup.newRows[0] = {
		// 	...newGroup.newRows[0],
		// 	...demand,
		// 	deliveryMethod: demand.shippingMethod,
		// 	deliveryMethodText: demand.shippingMethodText,
		// 	demandNo: demand.demandNo,
		// 	platformChannelCode: '',
		// 	platformChannelCodeText: '',
		// 	deptId: '',
		// 	deptName: '',
		// 	operation: '',
		// 	transferNum: '',
		// };

		demandGroups.value.push(newGroup);
	});
};

// 删除需求单组
const removeDemandGroup = async (index: number) => {
	const result = await useMessageBox().confirm('确定要删除吗？');
	if (!result) return;
	if (demandGroups.value.length <= 1) {
		useMessage().warning('至少保留一组数据');
		return;
	}
	demandGroups.value.splice(index, 1);
};

// 关闭弹窗
const handleClose = () => {
	visible.value = false;
	emit('closed');
};
const postVerify = () => {
	// 校验所有需求单并更新分组校验状态
	let firstErrorMessage = ''; // 记录第一个错误消息

	for (let i = 0; i < demandGroups.value.length; i++) {
		const group = demandGroups.value[i];
		const row = group.newRows[0];

		// 必填字段校验 - 国家
		if (!row.countryCode) {
			group.hasError = true;
			if (!firstErrorMessage) {
				firstErrorMessage = `第${i + 1}组库存信息：请选择国家`;
			}
			continue; // 跳到下一个组
		}

		// 必填字段校验 - 平台渠道
		if (!row.platformChannelCode) {
			group.hasError = true;
			if (!firstErrorMessage) {
				firstErrorMessage = `第${i + 1}组库存信息：请选择平台渠道`;
			}
			continue;
		}

		// 必填字段校验 - 发货方式
		if (!row.shippingMethod) {
			group.hasError = true;
			if (!firstErrorMessage) {
				firstErrorMessage = `第${i + 1}组库存信息：请选择发货方式`;
			}
			continue;
		}

		// 必填字段校验 - 部门&运营小组
		if (!row.deptId) {
			group.hasError = true;
			if (!firstErrorMessage) {
				firstErrorMessage = `第${i + 1}组库存信息：请选择部门&运营小组`;
			}
			continue;
		}

		// 必填字段校验 - 运营
		if (!row.operationId) {
			group.hasError = true;
			if (!firstErrorMessage) {
				firstErrorMessage = `第${i + 1}组库存信息：请选择运营`;
			}
			continue;
		}

		// 必填字段校验 - 转换数量
		if (!row.transferNum || !/^(?:[1-9]\d*)$/.test(String(row.transferNum))) {
			group.hasError = true;
			if (!firstErrorMessage) {
				firstErrorMessage = `第${i + 1}组库存信息：请输入有效的转换数量`;
			}
			continue;
		}

		// 该组校验通过，标记为无错误
		group.hasError = false;
	}

	// 如果有错误，提示第一个错误消息并返回
	if (firstErrorMessage) {
		useMessage().error(firstErrorMessage);
		return false;
	}
	return true;
};
// 确认提交
const handleConfirm = async () => {
	// 校验所有需求单并更新分组校验状态
	if (!(await postVerify())) {
		return false;
	}

	// 构建提交数据
	const submitList = demandGroups.value.map((group) => {
		const row = group.newRows[0];
		const origin = group.originList[0];

		return {
			oldDemandInfo: {
				planNum: origin.planNum ?? 1,
				...origin,
			},
			newDemandInfo: {
				planNum: origin.planNum ?? 1,
				...row,
			},
		};
	});

	try {
		const res = await transferInventoryReview({
			transferType: 1,
			purchaseInTransitDTOList: submitList,
		});
		if (res.code !== 0) {
			throw new Error(res.msg || '提交失败');
		}

		useMessage().success('提交成功');
		emit('submitted');
		handleClose();
	} catch (error: any) {
		useMessage().error(error.msg || error.message || '提交失败');
	}
};

defineExpose({ open, handleClose });
</script>

<style lang="scss" scoped>
.dialog-container {
	padding: 0 10px;
	max-height: 70vh;
	overflow: auto;
}

.demand-group {
	margin-bottom: 24px;
	padding: 16px;
	border: 1px solid #e4e7ed;
	border-radius: 4px;
	background-color: #f9fafb;
	position: relative;

	&:last-of-type {
		margin-bottom: 16px;
	}
}

.group-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	width: 100%;

	.group-title {
		font-size: 16px;
		font-weight: bold;
		color: #303133;
	}
}

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

.add-demand-btn {
	text-align: left;
	padding: 16px 0;
}

.new-table :deep(.el-input__wrapper) {
	padding: 0 8px;
}
.required-icon {
	color: red;
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
