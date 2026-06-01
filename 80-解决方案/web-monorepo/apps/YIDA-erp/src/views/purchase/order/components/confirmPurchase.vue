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
		:disabled="props.disabled"
		@cancel="handleCancel"
		@confirm="handleConfirm"
		@closed="handleClosed"
		@opened="handleOpened"
	>
		<el-row class="mb18">
			<el-col :span="24">
				<el-table
					:data="props.currentRow?.dataList ?? []"
					border
					height="300"
					style="width: 100%"
					native-scrollbar
				>
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

					<el-table-column label="计划数量" width="150">
						<template #default="{ row }">
							{{ row.plannedQuantity ?? '--' }}
						</template>
					</el-table-column>
					<el-table-column label="待采购数量" width="150">
						<template #default="{ row }">
							{{ row.pendingPurchaseQuantity ?? '--' }}
						</template>
					</el-table-column>
					<el-table-column label="本次采购数量" width="150">
						<template #header>
							<span
								:style="{
									color: '#f78c8c',
									marginRight: '3px',
								}"
								>*
							</span>
							{{ $t('本次采购数量') }}
						</template>
						<template #default="{ row }">
							<el-input
								v-model.number="row.currentPurchaseQuantity"
								type="number"
								:min="0"
								:max="row.pendingPurchaseQuantity || 0"
								@change="
									() => {
										row.currentPurchaseQuantity = Math.floor(
											Number(row.currentPurchaseQuantity) || 0
										);
										if (
											row.currentPurchaseQuantity >
											(row.pendingPurchaseQuantity || 0)
										) {
											row.currentPurchaseQuantity =
												row.pendingPurchaseQuantity || 0;
										} else if (row.currentPurchaseQuantity < 0) {
											row.currentPurchaseQuantity = 0;
										}
									}
								"
								:disabled="row.pendingPurchaseQuantity === 0"
							/>
						</template>
					</el-table-column>
					<el-table-column
						prop="factoryReplyDeliveryDate"
						:label="t('工厂回复交期')"
						show-overflow-tooltip
						width="200"
					>
						<template #header>
							<span
								:style="{
									color: '#f78c8c',
									marginRight: '3px',
								}"
								>*
							</span>
							{{ $t('工厂回复交期') }}
						</template>
						<template #default="{ row }">
							<el-date-picker
								v-model="row.factoryReplyDeliveryDate"
								clearable
								type="date"
								value-format="YYYY-MM-DD"
								placeholder="年/月/日"
								:disabled="!row.pendingPurchaseQuantity"
							/>
						</template>
					</el-table-column>
					<el-table-column label="备注" min-width="200" show-overflow-tooltip>
						<template #default="{ row }">
							<el-input
								v-model="row.remark"
								placeholder="请输入"
								style="width: 100%"
								type="textarea"
								:disabled="!row.pendingPurchaseQuantity"
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
		default: () => {},
	},
	// 确认按钮禁用状态
	disabled: {
		type: Boolean,
		default: false,
	},
});

const emit = defineEmits(['cancel', 'confirm', 'closed', 'update:modelValue']);
const title = ref('采购确认');
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

/**
 * 确认操作处理函数
 */
const handleConfirm = () => {
	const { dataList } = props.currentRow || [];

	// 校验1：至少有一行填写了有效数量（>0）
	const hasFilled = (
		dataList as Array<{
			currentPurchaseQuantity: any;
			factoryReplyDeliveryDate: any;
		}>
	)?.some(
		(row) =>
			Number(row.currentPurchaseQuantity) > 0 && row.factoryReplyDeliveryDate
	);
	if (!hasFilled) {
		useMessage().error(
			'请至少填写一行本次采购数量>0且工厂回复交期不为空的数据'
		);
		return;
	}
	for (const item of dataList as Array<{
		currentPurchaseQuantity: any;
		factoryReplyDeliveryDate: any;
	}>) {
		if (
			Number(item.currentPurchaseQuantity) > 0 &&
			!item.factoryReplyDeliveryDate
		) {
			useMessage().error('请填写工厂回复交期');
			return;
		}
	}
	const filterData = dataList.filter(
		(row: any) => Number(row.currentPurchaseQuantity) > 0
	);
	// 所有校验通过后触发确认事件
	emit('confirm', {
		data: JSON.parse(JSON.stringify(filterData)),
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
</style>
