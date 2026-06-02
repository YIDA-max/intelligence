<template>
	<!-- 分配采购数量 -->
	<confirm-dialog
		ref="dialogRef"
		:title="title"
		:message="props.message"
		:showConfirmButton="auth('order_purchaseQuantity')"
		:show-icon="props.showIcon"
		:icon-type="props.iconType"
		:cancel-button-text="props.cancelButtonText"
		:confirm-button-text="props.confirmButtonText"
		:confirm-button-type="props.confirmButtonType"
		:width="props.width"
		:disabled="disabled"
		@cancel="handleCancel"
		@confirm="handleConfirm"
		@closed="handleClosed"
		@opened="handleOpened"
	>
		<el-row class="mb18">
			<el-col :span="24">
				<el-table
					:data="props.currentRow?.purchaseOrderSkuList ?? []"
					border
					height="300"
					style="width: 100%"
					show-summary
					:summary-method="getSummaries"
					sum-text="合计"
					native-scrollbar
				>
					<el-table-column label="需求单号" width="150">
						<template #default="{ row }">
							{{ row.demandNo || '-' }}
						</template>
					</el-table-column>
					<el-table-column prop="skuCode" label="SKU/产品名称" min-width="220">
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
					<el-table-column label="国家" prop="countryCode" width="150">
						<template #default="{ row }">
							{{ row.countryCode || '-' }}
						</template>
					</el-table-column>
					<el-table-column
						label="平台渠道"
						prop="platformChannelCode"
						width="150"
					>
						<template #default="{ row }">
							{{ row.platformChannelCode || '-' }}
						</template>
					</el-table-column>
					<el-table-column label="MSKU" prop="mskuCode" width="150">
						<template #default="{ row }">
							{{ row.mskuCode || '-' }}
						</template>
					</el-table-column>
					<el-table-column
						label="期望提货时间"
						prop="expectedPickupDate"
						width="150"
					>
						<template #default="{ row }">
							{{ row.expectedPickupDate || '-' }}
						</template>
					</el-table-column>
					<el-table-column label="计划数量" prop="planNum" width="150">
						<template #default="{ row }">
							{{ row.planNum ?? '--' }}
						</template>
					</el-table-column>
					<el-table-column label="原采购数量" prop="purchaseNum" width="150">
						<template #default="{ row }">
							{{ row.purchaseNum ?? '--' }}
						</template>
					</el-table-column>
					<el-table-column
						:label="t('新采购数量')"
						prop="newPurchaseNum"
						width="150"
					>
						<template #header>
							<span
								:style="{
									color: '#f78c8c',
									marginRight: '3px',
								}"
								>*
							</span>
							{{ $t('新采购数量') }}
						</template>
						<template #default="{ row }">
							<el-input
								v-model.number="row.newPurchaseNum"
								:disabled="!auth('order_purchaseQuantity')"
								type="number"
								:min="0"
								:max="row.purchaseNum || 0"
								@change="
									() => {
										if (row.newPurchaseNum < 0) {
											row.newPurchaseNum = 0;
										}
									}
								"
							/>
						</template>
					</el-table-column>
				</el-table>
			</el-col>
		</el-row>
	</confirm-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, defineProps, defineEmits, nextTick } from 'vue';
import ConfirmDialog, { IconType } from '/@/components/ConfirmDialog/index.vue';
import { useI18n } from 'vue-i18n';
import { useMessage } from '/@/hooks/message';
import { auth } from '/@/utils/authFunction';

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
	// 确认按钮禁用状态
	disabled: {
		type: Boolean,
		default: false,
	},
});

const emit = defineEmits(['cancel', 'confirm', 'closed', 'update:modelValue']);
const title = ref('分配采购数量');
// 表单数据
const formData = reactive<Record<string, any>>({});
const dialogRef = ref<InstanceType<typeof ConfirmDialog> | null>(null);

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
	});
};
/**
 * 取消操作处理函数
 */
const handleCancel = () => {
	emit('cancel');
};

const getSummaries = ({ columns, data }: { columns: any[]; data: any[] }) => {
	const sums: (string | number)[] = [];
	columns.forEach((column, index) => {
		if (index === 6) {
			sums[index] = '合计';
			return;
		}
		if (column.label === '原采购数量') {
			const total = data.reduce(
				(sum: number, item: any) => sum + (Number(item.purchaseNum) || 0),
				0
			);
			sums[index] = total;
		} else if (column.label === '新采购数量') {
			const total = data.reduce(
				(sum: number, item: any) => sum + (Number(item.newPurchaseNum) || 0),
				0
			);
			sums[index] = total;
		}
	});
	return sums;
};

/**
 * 确认操作处理函数
 */
const handleConfirm = () => {
	const { purchaseOrderSkuList } = props.currentRow || {};

	if (!purchaseOrderSkuList || purchaseOrderSkuList.length === 0) {
		useMessage().error('暂无数据');
		return;
	}
	// 校验1：新采购数量汇总 = 原采购数量汇总
	const totalOriginalPurchase = purchaseOrderSkuList.reduce(
		(sum: number, item: any) => sum + (Number(item.purchaseNum) || 0),
		0
	);
	const totalNewPurchase = purchaseOrderSkuList.reduce(
		(sum: number, item: any) => sum + (Number(item.newPurchaseNum) || 0),
		0
	);

	if (totalNewPurchase !== totalOriginalPurchase) {
		useMessage().error(
			`新采购数量汇总(${totalNewPurchase})必须等于原采购数量汇总(${totalOriginalPurchase})`
		);
		return;
	}

	// 校验2：需求单的采购数量必须 >= 提货数量 + 采购退货数量（含退货中）
	for (const item of purchaseOrderSkuList) {
		const newPurchaseQuantity = Number(item.newPurchaseNum) || 0;
		// 注意：需要确认提货数量和退货数量的实际字段名
		// 目前假设字段名为 builtTakeGoodsNum（提货数量）和 returnNum（退货数量）
		// 如果字段名不正确，请提供正确的字段名
		const takeGoodsQuantity = Number(item.builtTakeGoodsNum) || 0;
		const returnQuantity = Number(item.returnNum) || 0;

		const minRequiredQuantity = takeGoodsQuantity + returnQuantity;

		if (newPurchaseQuantity > 0 && newPurchaseQuantity < minRequiredQuantity) {
			useMessage().error(
				`SKU: ${item.skuCode} 的采购数量(${newPurchaseQuantity})不能小于已处理数量(${minRequiredQuantity})`
			);
			return;
		}
	}

	// 校验3：至少有一行填写了有效数量（>0）
	const hasValidData = purchaseOrderSkuList.some(
		(row: any) => Number(row.newPurchaseNum) > 0
	);
	if (!hasValidData) {
		useMessage().error('请至少填写一行新采购数量>0的数据');
		return;
	}

	// 所有校验通过后，准备提交数据
	const submitData = purchaseOrderSkuList.map((row: any) => ({
		id: row.id || 0,
		purchaseNo: row.purchaseNo || '',
		demandNo: row.demandNo || '',
		skuCode: row.skuCode || '',
		skuName: row.skuName || '',
		mskuCode: row.mskuCode || '',
		expectedPickupDate: row.expectedPickupDate || '',
		countryCode: row.countryCode || '',
		platformChannelCode: row.platformChannelCode || '',
		planNum: row.planNum || 0,
		purchaseNum: row.purchaseNum || 0,
		newPurchaseNum: row.newPurchaseNum || 0,
	}));

	// 触发确认事件，传递格式化的数据
	emit('confirm', submitData);
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
</style>
