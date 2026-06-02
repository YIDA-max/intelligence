<template>
	<confirm-dialog
		ref="dialogRef"
		:title="title"
		:message="props.message"
		:show-icon="props.showIcon"
		:icon-type="props.iconType"
		:cancel-button-text="props.cancelButtonText"
		:confirm-button-text="props.confirmButtonText"
		:confirm-button-type="props.confirmButtonType"
		:width="props.width"
		@cancel="handleCancel"
		@confirm="handleConfirm"
		@closed="handleClosed"
		@opened="handleOpened"
	>
		<el-row class="mb18">
			<div v-if="props.currentRow?.autoIntoFlag === 0" class="red mb18">
				已预报的调拨单如果手动操作确认入库则以手动操作数据为准，不再调用三方仓接口数据
			</div>
			<el-col :span="24">
				<el-table
					:data="props.currentRow?.deliveryVOList || []"
					border
					height="300"
					style="width: 100%"
					native-scrollbar
					show-summary
					:summary-method="getSummaries"
				>
					<el-table-column
						label="发货单号"
						prop="deliveryNo"
						width="160"
						show-overflow-tooltip
					>
						<template #default="{ row }">
							{{ row.deliveryNo || '-' }}
						</template>
					</el-table-column>
					<el-table-column
						prop="takeInWarehouse"
						label="调入仓"
						width="200"
						show-overflow-tooltip
					>
						<template #default="{ row }">
							{{ row.takeInWarehouse || '-' }}
						</template>
					</el-table-column>
					<el-table-column prop="skuCode" label="SKU/产品名称" width="150">
						<template #default="{ row }">
							<div class="sku-info">
								<div class="text-ellipsis">{{ row.skuCode }}</div>
								<div class="text-ellipsis">{{ row.productName }}</div>
							</div>
						</template>
					</el-table-column>
					<el-table-column
						label="调拨箱数"
						prop="deliveryCartonQuantity"
						width="100"
					>
						<template #default="{ row }">
							{{ row.deliveryCartonQuantity || '-' }}
						</template>
					</el-table-column>
					<el-table-column label="调拨数量" prop="shipmentQuantity" width="100">
						<template #default="{ row }">
							{{ row.shipmentQuantity || '-' }}
						</template>
					</el-table-column>
					<el-table-column
						label="可入库数量"
						prop="allowIntoQuantity"
						width="100"
					>
						<template #default="{ row }">
							{{ row.allowIntoQuantity || '0' }}
						</template>
					</el-table-column>
					<el-table-column
						prop="intoTotalQuantity"
						:label="t('本次入库数量')"
						show-overflow-tooltip
						width="200"
					>
						<template #header>
							{{ t('本次入库数量') }}
							<el-button
								class="ml8"
								link
								type="primary"
								@click.stop="batchFillIntoQuantity"
							>
								一键填写
							</el-button>
						</template>
						<template #default="{ row }">
							<el-input
								v-model.number="row.intoTotalQuantity"
								type="number"
								:min="0"
								@input="handleIntoQuantityInput(row)"
							/>
						</template>
					</el-table-column>
					<!-- <el-table-column :label="t('本次入库箱数')" show-overflow-tooltip width="180">
						<template #default="{ row }">
							{{ Math.ceil((row.intoTotalQuantity || 0) / (row.singleCartonQuantity || 1)) }}
						</template>
					</el-table-column> -->
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
						prop="countryCode"
						:label="t('国家')"
						show-overflow-tooltip
						width="180"
					>
						<template #default="{ row }">
							{{ row.countryCode || '---' }}
						</template>
					</el-table-column>
					<el-table-column
						prop="platformChannelCode"
						:label="t('渠道')"
						show-overflow-tooltip
						width="180"
					>
						<template #default="{ row }">
							{{ row.platformChannelText || '---' }}
						</template>
					</el-table-column>
					<el-table-column
						prop="mskuCode"
						:label="t('MSKU')"
						show-overflow-tooltip
						width="180"
					>
						<template #default="{ row }">
							{{ row.mskuCode || '---' }}
						</template>
					</el-table-column>
					<el-table-column
						prop=""
						:label="t('平台店铺')"
						show-overflow-tooltip
						width="180"
					>
						<template #default="{ row }">
							{{ row?.platformStore || '---' }}
						</template>
					</el-table-column>
					<el-table-column
						prop=""
						:label="t('平台入库单')"
						show-overflow-tooltip
						width="180"
					>
						<template #default="{ row }">
							{{ row?.shipmentId || '---' }}
						</template>
					</el-table-column>
					<el-table-column
						prop=""
						:label="t('条码')"
						show-overflow-tooltip
						width="180"
					>
						<template #default="{ row }">
							{{ row?.barcode || '---' }}
						</template>
					</el-table-column>
					<el-table-column
						prop=""
						:label="t('送仓码/关联单号')"
						show-overflow-tooltip
						width="180"
					>
						<template #default="{ row }">
							{{ row?.referenceId || '---' }}
						</template>
					</el-table-column>
					<el-table-column
						prop="departmentName"
						:label="t('部门&小组')"
						show-overflow-tooltip
						width="180"
					>
						<template #default="{ row }">
							{{ row.departmentName || '---' }} & {{ row.deptName }}
						</template>
					</el-table-column>
					<el-table-column
						prop="operationName"
						:label="t('运营人')"
						show-overflow-tooltip
						width="180"
					/>
				</el-table>
			</el-col>
		</el-row>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="handleCancel">取消</el-button>
				<el-button
					v-if="showDifferenceConfirm"
					@click="handleDifferenceConfirm"
				>
					确认差异入库完成
				</el-button>
				<el-button type="primary" @click="handleConfirm">确认</el-button>
			</span>
		</template>
	</confirm-dialog>
	<!-- 差异入库确认弹窗 -->
	<DifferenceConfirmDialog
		v-model="differenceDialogVisible"
		:query-params="props.currentRow || {}"
		@success="handleDifferenceConfirmSuccess"
	/>
</template>

<script setup lang="ts">
import { ref, reactive, nextTick, computed } from 'vue';
import ConfirmDialog, { IconType } from '/@/components/ConfirmDialog/index.vue';
import DifferenceConfirmDialog from './differenceConfirmDalog.vue';
import { useI18n } from 'vue-i18n';
import { useMessage } from '/@/hooks/message';
const { t } = useI18n();
const props = defineProps({
	// 基础配置
	message: {
		type: String,
		default: '',
	},
	width: {
		type: String,
		default: '80%',
	},
	// 图标配置
	showIcon: {
		type: Boolean,
		default: true,
	},
	iconType: {
		type: String as () => IconType,
		default: 'info',
	},
	// 按钮配置
	cancelButtonText: {
		type: String,
		default: '取消',
	},
	confirmButtonText: {
		type: String,
		default: '确认',
	},
	confirmButtonType: {
		type: String,
		default: 'primary',
	},
	// 输入框配置
	inputLabel: {
		type: String,
		default: '',
	},
	inputPlaceholder: {
		type: String,
		default: '请输入',
	},
	inputType: {
		type: String,
		default: 'text', // text, textarea
	},
	inputRows: {
		type: Number,
		default: 4,
	},
	// 初始值
	modelValue: {
		type: [String, Number],
		default: '',
	},
	// 当前行数据
	currentRow: {
		type: Object,
		default: () => ({}),
	},
});

const sumBy = (data: any[], key: string) =>
	(data || []).reduce(
		(sum: number, row: any) => sum + (Number(row?.[key]) || 0),
		0
	);
/**
 * 获取表格合计
 * @param columns 表格列
 * @param data 数据
 */
const getSummaries = ({ columns, data }: any) => {
	const sums = columns.map(() => '');
	// 第一列展示“求和”
	if (sums.length > 0) sums[0] = t('求和');

	const totals: Record<string, number> = {
		deliveryCartonQuantity: sumBy(data, 'deliveryCartonQuantity'),
		shipmentQuantity: sumBy(data, 'shipmentQuantity'),
		allowIntoQuantity: sumBy(data, 'allowIntoQuantity'),
		intoTotalQuantity: sumBy(data, 'intoTotalQuantity'),
	};

	columns.forEach((column: any, index: number) => {
		const key = String(column?.property || '');
		if (!key) return;
		if (key in totals) sums[index] = String(totals[key]);
	});
	return sums;
};
/**
 * 批量填写本次入库数量
 * 需求：直接把“可入库数量”赋值到“本次入库数量”，并保证数字类型
 */
const batchFillIntoQuantity = () => {
	const { deliveryVOList = [] } = props.currentRow || {};
	deliveryVOList.forEach((row: any) => {
		row.intoTotalQuantity = formatQuantity(
			row.allowIntoQuantity,
			row.allowIntoQuantity
		);
	});
};
const formatQuantity = (val: any, max: any) => {
	let n = Math.floor(Number(val) || 0);
	return Math.min(Math.max(n, 0), max || 0);
};

// 计算是否显示差异确认按钮
const showDifferenceConfirm = computed(() => {
	return props.currentRow?.deliveryVOList?.[0]?.thirdWarehouseFlag;
});

// 计算输入框的最大值限制
const getInputMaxValue = (row: any) => {
	if (showDifferenceConfirm.value) {
		return undefined;
	}
	const maxValue = Number(row.allowIntoQuantity) || 0;
	return maxValue > 0 ? maxValue : undefined;
};

// 输入框输入事件处理
const handleIntoQuantityInput = (row: any) => {
	const maxValue = getInputMaxValue(row);
	if (maxValue !== undefined && row.intoTotalQuantity > maxValue) {
		row.intoTotalQuantity = maxValue;
	}
};

const emit = defineEmits(['cancel', 'confirm', 'closed', 'update:modelValue']);
const title = ref('确认入库');
// 表单数据
const formData = reactive<Record<string, any>>({});
const dialogRef = ref<InstanceType<typeof ConfirmDialog> | null>(null);
const differenceDialogVisible = ref(false);

// 初始化表单数据
const initFormData = () => {
	// 清空之前的数据
	Object.keys(formData).forEach((key) => {
		delete formData[key];
	});
};

/**
 * 弹窗打开时的处理函数
 * 确保数据被正确初始化
 */
const handleOpened = () => {
	// 弹窗完全打开后，确保数据初始化
	nextTick(() => {
		initFormData();
		title.value =
			'确认入库' +
			(props.currentRow?.firstMileNo
				? `- ${props.currentRow.firstMileNo}`
				: '');
	});
};
/**
 * 取消操作处理函数
 */
const handleCancel = () => {
	emit('cancel', false);
};

/**
 * 差异入库确认前置校验
 */
const validateBeforeDifferenceConfirm = () => {
	const { deliveryVOList } = props.currentRow || {};

	// 校验1：至少有一行填写了有效数量（>0）
	const hasFilled = deliveryVOList?.some(
		(row: { intoTotalQuantity: any }) =>
			row.intoTotalQuantity === '' ||
			row.intoTotalQuantity === undefined ||
			row.intoTotalQuantity === null
	);
	if (hasFilled) {
		useMessage().warning('请填写所有SKU的入库数量（大于等于0）');
		return false;
	}

	// 校验2：必须存在差异（单行入库数量大于可入库数量）
	const hasDifference = deliveryVOList?.every(
		(row: { intoTotalQuantity: any; allowIntoQuantity: any }) =>
			Number(row.intoTotalQuantity) === Number(row.allowIntoQuantity)
	);
	if (hasDifference) {
		useMessage().warning('入库数量不存在差异，不可操作！');
		return false;
	}

	return true;
};

/**
 * 点击"确认差异入库完成"按钮
 */
const handleDifferenceConfirm = () => {
	// 前置校验
	if (!validateBeforeDifferenceConfirm()) {
		return;
	}
	// 打开差异确认弹窗
	differenceDialogVisible.value = true;
};

const handleDifferenceConfirmSuccess = () => {
	differenceDialogVisible.value = false;
	emit('cancel', true);
};

/**
 * 确认操作处理函数
 */
const handleConfirm = () => {
	const { deliveryVOList } = props.currentRow || {};

	// 校验1：至少有一行填写了有效数量（>0）
	const hasFilled = deliveryVOList?.some(
		(row: { intoTotalQuantity: any }) => Number(row.intoTotalQuantity) > 0
	);
	if (!hasFilled) {
		useMessage().warning('请至少填写一行有效入库数量（大于0）');
		return;
	}

	// 校验2：单行入库数量不能大于可入库数量
	// for (const row of deliveryVOList) {
	// 	const intoQty = Number(row.intoTotalQuantity) || 0;
	// 	const allowQty = Number(row.allowIntoQuantity) || 0;
	// 	if (intoQty > allowQty) {
	// 		const skuInfo = row.skuCode;
	// 		const productName = row.productName || '';
	// 		useMessage().warning(
	// 			`SKU【${skuInfo}${
	// 				productName ? '-' + productName : ''
	// 			}】入库数量大于发货数量，请通过【确认差异入库完成】来处理差异！`
	// 		);
	// 		return;
	// 	}
	// }

	// 所有校验通过后触发确认事件
	emit('confirm', {
		data: JSON.parse(JSON.stringify(deliveryVOList)),
	});
};
/**
 * 弹窗关闭后的回调
 */
const handleClosed = () => {
	emit('closed');
};

/**
 * 打开弹窗方法
 * 供父组件调用
 */
const show = () => {
	if (dialogRef.value) {
		dialogRef.value.show();
	}
};

/**
 * 关闭弹窗方法
 * 供父组件调用
 */
const hide = () => {
	if (dialogRef.value) {
		dialogRef.value.hide();
	}
};

// 暴露方法给父组件
defineExpose({
	show,
	hide,
	initFormData,
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
.red {
	color: red;
	font-weight: 700;
}
.sku-info {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: flex-start;
	width: 100%;
}
.text-ellipsis {
	max-width: 100%;
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
}
</style>
