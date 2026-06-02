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
			<el-col :span="24">
				<el-table
					:data="props.currentRow?.deliveryVOList || []"
					border
					height="300"
					style="width: 100%"
					native-scrollbar
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
						prop="transWarehouseName"
						label="头程目的仓"
						width="200"
						show-overflow-tooltip
					>
						<template #default="{ row }">
							{{
								props.currentRow.transWarehouseName
									? props.currentRow.transWarehouseName
									: row.destWarehouseName
							}}
						</template>
					</el-table-column>
					<el-table-column prop="skuCode" label="SKU/产品名称" width="150">
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
					<el-table-column label="发货箱数" width="100">
						<template #default="{ row }">
							{{ row.deliveryCartonQuantity || '-' }}
						</template>
					</el-table-column>
					<el-table-column label="发货数量" width="100">
						<template #default="{ row }">
							{{ row.shipmentQuantity || '-' }}
						</template>
					</el-table-column>
					<el-table-column label="可入库数量" width="100">
						<template #default="{ row }">
							{{ row.allowIntoQuantity || '0' }}
						</template>
					</el-table-column>
					<el-table-column
						prop="intoQuantity"
						:label="t('本次入库数量')"
						show-overflow-tooltip
						width="180"
					>
						<template #default="{ row }">
							<el-input
								v-model.number="row.intoQuantity"
								type="number"
								:min="0"
								:max="row.allowIntoQuantity || 0"
								@change="
									() => {
										if (row.intoQuantity > (row.allowIntoQuantity || 0)) {
											row.intoQuantity = row.allowIntoQuantity || 0;
										} else if (row.intoQuantity < 0) {
											row.intoQuantity = 0;
										}
									}
								"
							/>
						</template>
					</el-table-column>
					<el-table-column
						:label="t('本次入库箱数')"
						show-overflow-tooltip
						width="180"
					>
						<template #default="{ row }">
							{{
								Math.ceil(
									(row.intoQuantity || 0) / (row.singleCartonQuantity || 1)
								)
							}}
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
						prop="outCartonLength"
						:label="t('外箱长宽高(CM)')"
						show-overflow-tooltip
						width="200"
					>
						<template #default="{ row }">
							{{ row.outCartonLength }}*{{ row.outCartonWidth }}*{{
								row.outCartonHeight
							}}
						</template>
					</el-table-column>
					<el-table-column
						prop="productNetWeight"
						:label="t('产品净重(KG)')"
						show-overflow-tooltip
						width="180"
					>
						<template #default="{ row }">
							{{ row.productNetWeight?.toFixed(2) || '---' }}
						</template>
					</el-table-column>
					<el-table-column
						prop="outCartonGrossWeight"
						:label="t('外箱毛重(KG)')"
						show-overflow-tooltip
						width="180"
					>
						<template #default="{ row }">
							{{ row.outCartonGrossWeight?.toFixed(2) || '---' }}
						</template>
					</el-table-column>
					<el-table-column
						prop="totalVolume"
						:label="t('总体积(m³)')"
						show-overflow-tooltip
						width="180"
					>
						<template #default="{ row }">
							{{ row.totalVolume?.toFixed(2) || '---' }}
						</template>
					</el-table-column>
					<el-table-column
						prop="totalNetWeight"
						:label="t('总净重(KG)')"
						show-overflow-tooltip
						width="180"
					>
						<template #default="{ row }">
							{{ row.totalNetWeight?.toFixed(2) || '---' }}
						</template>
					</el-table-column>
					<el-table-column
						prop="totalGrossWeight"
						:label="t('总毛重(KG)')"
						show-overflow-tooltip
						width="180"
					>
						<template #default="{ row }">
							{{ row.totalGrossWeight?.toFixed(2) || '---' }}
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
						:label="t('平台渠道')"
						show-overflow-tooltip
						width="180"
					>
						<template #default="{ row }">
							{{ row.platformChannelCodeText || '---' }}
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
							{{ row?.storeName || '---' }}
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
						prop="deptName"
						:label="t('部门&小组')"
						show-overflow-tooltip
						width="180"
					>
						<template #default="{ row }">
							{{ row.deptName || '---' }}
						</template>
					</el-table-column>
					<el-table-column
						prop="operationUserName"
						:label="t('运营人')"
						show-overflow-tooltip
						width="180"
					/>
					<el-table-column label="备注" min-width="200" show-overflow-tooltip>
						<template #default="{ row }">
							{{ row.remark || '-' }}
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
		default: '1200px',
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

const emit = defineEmits(['cancel', 'confirm', 'closed', 'update:modelValue']);
const title = ref('确认入库');
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
	emit('cancel', {
		data: JSON.parse(JSON.stringify(props.currentRow?.deliveryVOList)),
	});
};

/**
 * 确认操作处理函数
 */
const handleConfirm = () => {
	const { deliveryVOList } = props.currentRow || {};

	// 校验1：至少有一行填写了有效数量（>0）
	const hasFilled = deliveryVOList?.some(
		(row: { intoQuantity: any }) => Number(row.intoQuantity) > 0
	);
	if (!hasFilled) {
		useMessage().error('请至少填写一行有效入库数量（大于0）');
		return;
	}

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
</style>
