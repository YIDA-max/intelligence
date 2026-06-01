<template>
	<el-dialog
		v-bind="$attrs"
		:close-on-click-modal="false"
		:title="props.title"
		width="70%"
		@close="handleClose"
		@open="handleOpen"
		draggable
	>
		<div class="dialog-container">
			<el-row class="mb18">
				<el-col :span="24">
					<el-button
						:icon="Plus"
						@click="handleAdd"
						class="mb-4"
						v-show="props.visibleType !== 'edit'"
						type="primary"
					/>
					<el-table
						:data="state.dataList"
						style="width: 100%"
						v-loading="state.loading"
						border
						ref="tableRef"
						row-key="id"
						height="480"
						:cell-style="tableStyle.cellStyle"
						:header-cell-style="tableStyle.headerCellStyle"
						native-scrollbar
					>
						<el-table-column prop="demandOrderNo" width="180">
							<template #header>
								{{ $t('需求单号') }}
							</template>
							<template #default="{ row }">
								{{ row.demandOrderNo || '---' }}
							</template>
						</el-table-column>
						<el-table-column prop="skuCode" width="180">
							<template #header>
								{{ $t('SKU') }}
							</template>
							<template #default="{ row }">
								<MrTextEllipsis :text="row.skuCode" empty-text="---" />
							</template>
						</el-table-column>
						<el-table-column prop="countryCode" width="150">
							<template #header>
								{{ $t('国家') }}
							</template>
							<template #default="{ row }">
								<SelectInputApi
									componentType="country"
									v-model="row.countryCode"
									:disabled="true"
									@change="
										() => {
											row.mskuCode = '';
										}
									"
									:settings="{
										text: '国家',
										width: '220px',
									}"
								/>
							</template>
						</el-table-column>
						<el-table-column prop="platformChannelCode" width="150">
							<template #header>
								<span
									:style="{
										color: '#f78c8c',
										marginRight: '3px',
									}"
									>*
								</span>
								{{ $t('平台渠道') }}
							</template>
							<template #default="{ row }">
								<SelectInputApi
									componentType="dicts"
									:disabled="true"
									v-model="row.platformChannelCode"
									@change="
										() => {
											row.mskuCode = '';
										}
									"
									:settings="{
										text: '平台渠道',
										width: '220px',
										getTreeDataParams: 'platform_channel',
									}"
								/>
							</template>
						</el-table-column>
						<el-table-column prop="mskuCode" width="150">
							<template #header> {{ $t('MSKU') }}</template>
							<template #default="{ row }">
								<el-select
									v-model="row.mskuCode"
									placeholder="请选择"
									style="width: 100%"
									filterable
									clearable
									:loading="row._loading"
									:remote="true"
									@focus="ensureLoaded(row)"
								>
									<el-option-group
										v-for="group in row?._options || []"
										:key="group.label"
										:label="group.label"
									>
										<el-option
											v-for="opt in group.options || []"
											:key="opt.mskuCode"
											:label="opt.label"
											:value="opt.mskuCode"
										/>
									</el-option-group>
								</el-select>
							</template>
						</el-table-column>
						<el-table-column prop="shippingMethod" width="150">
							<template #header>
								<span
									:style="{
										color: '#f78c8c',
										marginRight: '3px',
									}"
									>*
								</span>
								{{ $t('发货方式') }}
							</template>
							<template #default="{ row }">
								<SelectInputApi
									componentType="dicts"
									v-model="row.shippingMethod"
									:settings="{
										text: '发货方式',
										width: '220px',
										getTreeDataParams: 'shipping_method',
									}"
								/>
							</template>
						</el-table-column>
						<el-table-column prop="transportMethod" width="170">
							<template #header>
								<span
									:style="{
										color: '#f78c8c',
										marginRight: '3px',
									}"
									>*
								</span>
								{{ $t('运输方式') }}
							</template>
							<template #default="{ row }">
								<SelectInputApi
									componentType="dicts"
									v-model="row.transportMethod"
									:settings="{
										text: '运输方式',
										width: '220px',
										getTreeDataParams: 'transport_method',
									}"
								/>
							</template>
						</el-table-column>

						<el-table-column prop="expectedPickupDate" width="180">
							<template #header>
								{{ $t('期望提货时间') }}
							</template>
							<template #default="{ row }">
								{{ row.expectedPickupDate || '---' }}
							</template>
						</el-table-column>
						<el-table-column prop="orderTypeText" width="100">
							<template #header>
								{{ $t('订单类型') }}
							</template>
							<template #default="{ row }">
								{{ row.orderTypeText }}
							</template>
						</el-table-column>
						<el-table-column prop="deptText" width="180">
							<template #header>
								{{ $t('部门&运营小组') }}
							</template>
							<template #default="{ row }">
								{{ row?.departmentText || '---' }} {{ row?.deptText || '---' }}
							</template>
						</el-table-column>
						<el-table-column
							prop="operationText"
							:label="t('运营人')"
							width="100"
						>
							<template #default="{ row }">
								{{ row.operationText || '---' }}
							</template>
						</el-table-column>
						<el-table-column
							prop="purchaseNum"
							:label="t('采购数量')"
							width="100"
						>
							<template #default="{ row }">
								{{ row.purchaseNum || '---' }}
							</template>
						</el-table-column>
						<el-table-column
							prop="availableQuantity"
							:label="t('可提数量')"
							width="100"
						>
							<template #header>
								{{ $t('可提数量') }}
								<el-popover placement="right" trigger="hover" :width="320">
									<template #default>
										<div class="popover-tip">
											<div>
												可提数量 = 采购数量 - 退货数量（含未处理的）- 已提数量
											</div>
										</div>
									</template>
									<!-- 这个是触发 Popover 的小图标 -->
									<template #reference>
										<el-icon class="tip-trigger"><InfoFilled /></el-icon>
									</template>
								</el-popover>
							</template>
							<template #default="{ row }">
								{{ row.availableQuantity ? row.availableQuantity : '0' }}
							</template>
						</el-table-column>
						<el-table-column
							prop="cartonQty"
							:label="t('单箱数量')"
							width="100"
						>
							<template #header>
								{{ $t('单箱数量') }}
								<el-popover placement="right" trigger="hover" :width="320">
									<template #default>
										<div class="popover-tip">
											<div>一箱多少个</div>
										</div>
									</template>
									<!-- 这个是触发 Popover 的小图标 -->
									<template #reference>
										<el-icon class="tip-trigger"><InfoFilled /></el-icon>
									</template>
								</el-popover>
							</template>
							<template #default="{ row }">
								{{ row.cartonQty ? row.cartonQty : '0' }}
							</template>
						</el-table-column>
						<el-table-column prop="pickupQuantity" width="150">
							<template #header>
								<span
									:style="{
										color: '#f78c8c',
										marginRight: '3px',
									}"
									>*
								</span>
								{{ $t('本次提货数量') }}
								<el-popover placement="right" trigger="hover" :width="320">
									<template #default>
										<div class="popover-tip">
											<div>必须是单箱数量的倍数</div>
										</div>
									</template>
									<!-- 这个是触发 Popover 的小图标 -->
									<template #reference>
										<el-icon class="tip-trigger"><InfoFilled /></el-icon>
									</template>
								</el-popover>
							</template>
							<template #default="{ row }">
								<el-input
									v-model="row.pickupQuantity"
									:min="1"
									type="number"
									:max="row.availableQuantity"
									:precision="0"
									style="width: 100%"
									placeholder="请输入"
									@change="(value: number) => validatePickupQuantity(row, value)"
								/>
							</template>
						</el-table-column>
						<el-table-column prop="plannedPickupDate" width="180">
							<template #header>
								<span
									:style="{
										color: '#f78c8c',
										marginRight: '3px',
									}"
									>*
								</span>
								{{ $t('计划提货日期') }}
							</template>
							<template #default="{ row }">
								<el-date-picker
									v-model="row.plannedPickupDate"
									type="date"
									placeholder="请选择日期"
									format="YYYY-MM-DD"
									value-format="YYYY-MM-DD"
									style="width: 100%"
									clearable
									@change="(val: string) => validatePlannedPickupDate(row, val)"
								/>
							</template>
						</el-table-column>
						<el-table-column prop="urgentDate" width="180">
							<template #header>
								{{ $t('加急日期') }}
							</template>
							<template #default="{ row }">
								<el-date-picker
									v-model="row.urgentDate"
									type="date"
									placeholder="请选择日期"
									format="YYYY-MM-DD"
									value-format="YYYY-MM-DD"
									style="width: 100%"
									clearable
								/>
							</template>
						</el-table-column>
						<el-table-column prop="remark" width="150">
							<template #header>
								{{ $t('备注') }}
							</template>
							<template #default="{ row }">
								<el-input
									v-model="row.remark"
									placeholder="请输入"
									style="width: 100%"
								/>
							</template>
						</el-table-column>
						<el-table-column
							:label="$t('common.action')"
							width="150"
							fixed="right"
							v-if="props.visibleType !== 'edit'"
						>
							<template #default="{ row, $index: index }">
								<el-button :icon="Minus" @click="handleDelete(row, index)" />
							</template>
						</el-table-column>
					</el-table>
				</el-col>
			</el-row>
		</div>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="handleClose">{{
					$t('common.cancelButtonText')
				}}</el-button>
				<el-button type="primary" @click="onSubmit" :disabled="loading">{{
					$t('保存')
				}}</el-button>
			</span>
		</template>
		<!-- 选择产品弹窗 -->
		<SkuDialog
			v-model="skuDialogVisible"
			@closeDialog="skuDialogVisible = false"
			@setRows="setRows"
			:deptId="formData.deptId"
		/>
	</el-dialog>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useMessage } from '/@/hooks/message';
import { Minus, Plus } from '@element-plus/icons-vue';
import { BasicTableProps, useTable } from '/@/hooks/table';
import { getSkuQueryMskuWithBundleFlag } from '/@/api/purchase/demand';
import {
	postCollectionPlanSave,
	postCollectionPlanUpdate,
} from '/@/api/mcp/collectionPlan';
import { useI18n } from 'vue-i18n';
import { InfoFilled } from '@element-plus/icons-vue';
const SkuDialog = defineAsyncComponent(
	() => import('./sku-module/material-dialog.vue')
);
const SelectInputApi = defineAsyncComponent(
	() => import('/@/componentsApi/SelectInputApi/index.vue')
);
const { t } = useI18n();
const props = defineProps({
	title: { type: String, default: '添加仓库' },
	currentRow: { type: Object, default: () => ({}) }, // 当前编辑的数据
	visibleType: { type: String, default: '' }, // 弹窗类型
});
const emit = defineEmits(['closeDialog', 'save']);

// 加载
const loading = ref(false);

const formData = ref<any>({});

// 弹窗是否显示
const skuDialogVisible = ref(false);

// 表格数据
const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {},
	// pageList: getMaterialList,
	descs: [''],
	isPage: false,
});
// tableRef
const tableRef = ref<any>(null);
//  table hook
const { tableStyle, setTableData } = useTable(state, tableRef);
onMounted(() => {
	// 初始化表格数据
	// setTableData([{}]);
});

// 打开选择产品弹窗
const handleAdd = () => {
	skuDialogVisible.value = true;
};

// 打开弹窗
const handleOpen = async () => {
	if (props.visibleType === 'edit') {
		const normalizeRow = (row: any) => ({
			...row,
			transportMethod:
				!isNaN(parseFloat(row.transportMethod)) && isFinite(row.transportMethod)
					? String(row.transportMethod)
					: row.collectionPlanMessage?.transportMethod || '',
		});
		Array.isArray(props.currentRow)
			? setTableData(props.currentRow.map((item: any) => normalizeRow(item)))
			: setTableData([normalizeRow(props.currentRow)]);
		// 当前选中的部门-运营小组
		formData.value.deptId = (state.dataList ?? [])[0]?.deptId;
	} else if (props.visibleType === 'add') {
		setTableData([]);
		// 清空部门-运营小组
		formData.value.deptId = '';
	}
};

// 删除行
const handleDelete = (row: any, index: number) => {
	const dataList = [...(state.dataList ? state.dataList : [])];
	// 最少保留一行
	if (dataList.length <= 1) {
		useMessage().warning('至少保留一行数据');
		return;
	}
	dataList.splice(index, 1);
	setTableData(dataList);
};

/**
 * 校验提货数量
 * @param row 当前行数据
 * @param value 输入的值
 */
const validatePickupQuantity = (row: any, value: number) => {
	const pickupQuantity = Number(value);
	const availableQuantity = Number(row.availableQuantity);
	const cartonQty = Number(row.cartonQty);
	// 非正整数校验：如果不是正整数（包括0、负数、小数），设置为1
	if (!Number.isInteger(pickupQuantity) || pickupQuantity <= 0) {
		row.pickupQuantity = null;
		useMessage().warning('请输入正整数');
		return;
	}

	// 如果输入的值大于可提数量
	if (pickupQuantity > availableQuantity) {
		row.pickupQuantity = null;
		useMessage().warning('提货数量不能大于可提数量');
		return;
	}

	// 必须是单箱数量的倍数
	if (cartonQty > 0 && pickupQuantity % cartonQty !== 0) {
		useMessage().warning(
			'请输入正确的值：必须是单箱数量的倍数且必须小于等于可提数量'
		);
		row.pickupQuantity = null;
		return;
	}
};

/**
 * 校验计划提货日期
 * 不能早于 MAX(当前时间+16天, factoryStandardDeliveryDate-5天)
 * @param row 当前行数据
 * @param val 选中的日期字符串 YYYY-MM-DD
 */
const validatePlannedPickupDate = (row: any, val: string) => {
	if (!val) return;

	const selected = new Date(val);
	selected.setHours(0, 0, 0, 0);

	// 提货计划下推PMC日期 = 当前时间 + 16天
	const pmcDate = new Date();
	pmcDate.setHours(0, 0, 0, 0);
	pmcDate.setDate(pmcDate.getDate() + 16);

	// PO标准交期 - 5天（取 row.factoryStandardDeliveryDate 字段）
	let poMinDate: Date | null = null;
	if (row.factoryStandardDeliveryDate) {
		poMinDate = new Date(row.factoryStandardDeliveryDate);
		poMinDate.setHours(0, 0, 0, 0);
		poMinDate.setDate(poMinDate.getDate() - 5);
	}

	// MIN_DATE = MAX(pmcDate, poMinDate)
	const minDate = poMinDate && poMinDate > pmcDate ? poMinDate : pmcDate;

	if (selected < minDate) {
		row.plannedPickupDate = null;
		// 格式化 minDate 为 YYYY-MM-DD 用于提示
		const y = minDate.getFullYear();
		const m = String(minDate.getMonth() + 1).padStart(2, '0');
		const d = String(minDate.getDate()).padStart(2, '0');
		useMessage().warning(
			`不可早于${y}-${m}-${d}(计划提货日期不能早于【MAX(提货计划下推PMC日期+16天，PO标准交期-5天)】)`
		);
	}
};

// 关闭弹窗
const handleClose = () => {
	emit('closeDialog');
};

// 弹窗设置
const setRows = (rows: any[]) => {
	const dataList = state.dataList ? [...state.dataList] : [];
	rows.forEach((row: any) => {
		// 检查是否已存在相同的辅料
		const existingIndex = dataList.findIndex(
			(item: any) => item.demandOrderNo === row.demandOrderNo
		);
		if (existingIndex !== -1) {
			// 无需处理
		} else {
			// 如果不存在，添加新的辅料
			dataList.push({
				...row,
			});
		}
	});
	// 设置选中的辅料
	setTableData(dataList);
};

// 提交
const onSubmit = async () => {
	loading.value = true;
	try {
		const dataList = state.dataList ? [...state.dataList] : [];
		// 判断渠道是否选择
		for (const item of dataList) {
			if (!item.platformChannelCode) {
				useMessage().warning(`${item.skuCode} 请选择渠道`);
				return;
			}
		}
		// 判断发货方式
		for (const item of dataList) {
			if (!item.shippingMethod) {
				useMessage().warning(`${item.skuCode} 请选择发货方式`);
				return;
			}
		}
		// 判断运输方式
		for (const item of dataList) {
			if (!item.transportMethod) {
				useMessage().warning(`${item.skuCode} 请选择运输方式`);
				return;
			}
		}
		// 判断本次提货数量
		for (const item of dataList) {
			if (item.pickupQuantity === undefined || item.pickupQuantity === null) {
				useMessage().warning(`${item.skuCode} 请填写本次提货数量`);
				return;
			}
		}
		// 判断计划提货日期
		for (const item of dataList) {
			if (
				item.plannedPickupDate === undefined ||
				item.plannedPickupDate === null
			) {
				useMessage().warning(`${item.skuCode} 请填写计划提货日期`);
				return;
			}
		}
		const api =
			props.visibleType === 'edit'
				? postCollectionPlanUpdate
				: postCollectionPlanSave;
		const res = await api(
			props.visibleType === 'edit' ? dataList[0] : dataList
		);
		if (res.code === 0) {
			useMessage().success('操作成功');
			// 清空表格数据
			setTableData([]);
			handleClose();
		}
	} catch (error: any) {
		useMessage().error(error.msg || '操作失败，请稍后重试');
	} finally {
		loading.value = false;
	}
};

/**
 * 确保加载SKU选项
 * sku + 国家 + 平台渠道 + 部门ID 唯一确定MSKU列表
 * @param row
 */
const ensureLoaded = async (row: any) => {
	try {
		// TODO: 换成你的接口
		const res = await getSkuQueryMskuWithBundleFlag({
			skuCode: row.skuCode,
			countryCode: row.countryCode,
			platformChannelCode: row.platformChannelCode,
			deptId: row?.deptId,
		});
		if (res.code === 0) {
			const list = res.data || [];
			row._options = list;
		}
	} finally {
		row._loading = false; // 确保加载状态被清除
	}
};

defineExpose({
	handleOpen,
});
</script>

<style lang="scss" scoped>
.dialog-container {
	padding: 0 20px;
	height: 60vh;
	overflow: auto;
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
.mb18 {
	margin-bottom: 18px;
}
</style>
