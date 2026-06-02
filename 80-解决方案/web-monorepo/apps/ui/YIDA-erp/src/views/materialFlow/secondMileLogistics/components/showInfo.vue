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
		:showConfirmButton="false"
		:width="props.width"
		@cancel="handleCancel"
		@confirm="handleConfirm"
		@closed="handleClosed"
		@opened="handleOpened"
	>
		<el-form ref="formRef" :inline="false" label-position="left">
			<div class="section-title"><span class="section-bar"></span>基本信息</div>
			<el-row class="mb18">
				<el-col :span="12">
					<el-form-item label="调出仓">
						<span>{{
							props.currentRow?.basicInfo.takeOutWarehouse || '--'
						}}</span>
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="调入仓">
						<span>{{
							props.currentRow?.basicInfo.takeInWarehouse || '--'
						}}</span>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row class="mb18">
				<el-col :span="24">
					<el-form-item label="运输方式">
						<span>{{
							props.currentRow?.basicInfo.transportMethodText || '--'
						}}</span>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row class="mb18">
				<el-col :span="24"
					><el-form-item label="预计发货日期">
						<span>{{
							props.currentRow?.basicInfo.planShipmentDate || '--'
						}}</span>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row class="mb18">
				<el-col :span="12"
					><el-form-item label="调拨备注">
						<span>{{ props.currentRow?.basicInfo.remark || '--' }}</span>
					</el-form-item>
				</el-col>
			</el-row>
			<div class="section-title"><span class="section-bar"></span>调拨明细</div>
			<el-row class="mb18">
				<el-col :span="24">
					<el-table
						:data="props.currentRow?.detailList || []"
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
						<el-table-column prop="skuCode" label="SKU/产品名称" width="250">
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
										{{ row.productName }}
									</div>
								</div>
							</template>
						</el-table-column>
						<el-table-column label="本次调拨数量" width="120">
							<template #default="{ row }">
								{{ row.takeSecondContainerQuantity || '-' }}
							</template>
						</el-table-column>
						<el-table-column label="本次调拨箱数" width="120">
							<template #default="{ row }">
								{{ row.takeSecondCartonQuantity || '-' }}
							</template>
						</el-table-column>
						<el-table-column
							prop="platformChannelCode"
							:label="t('渠道')"
							show-overflow-tooltip
							width="180"
						>
							<template #default="{ row }">
								{{ row?.platformChannelText || '---' }}
							</template>
						</el-table-column>
						<el-table-column
							prop="platformStore"
							:label="t('平台店铺')"
							show-overflow-tooltip
							width="180"
						>
							<template #default="{ row }">
								{{ row?.platformStore || '---' }}
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
							prop=""
							:label="t('附件')"
							show-overflow-tooltip
							width="220"
						>
							<template #default="{ row }">
								箱唛：<el-tooltip
									:content="row.shippingMarkAttachmentName || '---'"
									placement="top"
									:disabled="
										!row.shippingMarkAttachmentName ||
										row.shippingMarkAttachmentName.length <= 20
									"
								>
									<el-link
										target="_blank"
										:href="row.shippingMarkAttachmentUrl"
										type="primary"
										class="attachment-link"
										>{{
											truncateFileName(row.shippingMarkAttachmentName) || '---'
										}}</el-link
									>
								</el-tooltip>
								<br />
								条码：<el-tooltip
									:content="row.barcodeAttachmentName || '---'"
									placement="top"
									:disabled="
										!row.barcodeAttachmentName ||
										row.barcodeAttachmentName.length <= 20
									"
								>
									<el-link
										target="_blank"
										:href="row.barcodeAttachmentUrl"
										type="primary"
										class="attachment-link"
										>{{
											truncateFileName(row.barcodeAttachmentName) || '---'
										}}</el-link
									>
								</el-tooltip>
								<br />
								透明计划标签：<el-tooltip
									:content="row.transparencyAttachmentName || '---'"
									placement="top"
									:disabled="
										!row.transparencyAttachmentName ||
										row.transparencyAttachmentName.length <= 20
									"
								>
									<el-link
										target="_blank"
										:href="row.transparencyAttachmentUrl"
										type="primary"
										class="attachment-link"
										>{{
											truncateFileName(row.transparencyAttachmentName) || '---'
										}}</el-link
									>
								</el-tooltip>
								<br />
								其他：<el-tooltip
									:content="row.otherAttachmentName || '---'"
									placement="top"
									:disabled="
										!row.otherAttachmentName ||
										row.otherAttachmentName.length <= 20
									"
								>
									<el-link
										target="_blank"
										:href="row.otherAttachmentUrl"
										type="primary"
										class="attachment-link"
										>{{
											truncateFileName(row.otherAttachmentName) || '---'
										}}</el-link
									>
								</el-tooltip>
								<br />
							</template>
						</el-table-column>
						<el-table-column
							prop="skuCartonCode"
							:label="t('箱规编码')"
							show-overflow-tooltip
							width="180"
						>
							<template #default="{ row }">
								{{ row.skuCartonCode || '---' }}
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
							prop="outCartonSize"
							:label="t('外箱长宽高(CM)')"
							show-overflow-tooltip
							width="200"
						>
							<template #default="{ row }">
								{{ row.outCartonSize || '---' }}
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
							prop="deptName"
							:label="t('部门&小组')"
							show-overflow-tooltip
							width="180"
						>
							<template #default="{ row }">
								{{ row.departmentName || '---' }} & {{ row.deptName || '---' }}
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
		</el-form>
	</confirm-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, nextTick } from 'vue';
import ConfirmDialog, { IconType } from '/@/components/ConfirmDialog/index.vue';
import { useI18n } from 'vue-i18n';
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

const emit = defineEmits(['cancel', 'confirm', 'closed', 'update:modelValue']);

// 表单数据
const formData = reactive<Record<string, any>>({});
const formRef = ref(null);
const dialogRef = ref<InstanceType<typeof ConfirmDialog> | null>(null);
const title = ref('二程调拨详情');
// 初始化表单数据
const initFormData = () => {
	// 清空之前的数据
	Object.keys(formData).forEach((key) => {
		delete formData[key];
	});
};

// 截取文件名的函数
const truncateFileName = (fileName: string, maxLength = 20) => {
	if (!fileName) return '';
	if (fileName.length <= maxLength) return fileName;
	// 获取文件扩展名
	const lastDotIndex = fileName.lastIndexOf('.');
	if (lastDotIndex === -1) {
		// 没有扩展名，直接截取
		return fileName.substring(0, maxLength - 3) + '...';
	}

	const nameWithoutExt = fileName.substring(0, lastDotIndex);
	const extension = fileName.substring(lastDotIndex);

	// 如果扩展名太长，直接截取
	if (extension.length > maxLength - 3) {
		return fileName.substring(0, maxLength - 3) + '...';
	}
	// 保留扩展名，截取文件名部分
	const availableLength = maxLength - extension.length - 3;
	if (availableLength <= 0) {
		return extension;
	}

	return nameWithoutExt.substring(0, availableLength) + '...' + extension;
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
			'二程调拨详情' +
			(props.currentRow?.firstMileNo
				? `- ${props.currentRow.firstMileNo}`
				: '');
	});
};

/**
 * 取消操作处理函数
 */
const handleCancel = () => {
	emit('cancel', { ...formData });
};

/**
 * 确认操作处理函数
 */
const handleConfirm = () => {
	emit('confirm', { ...formData });
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
.attachment-link {
	display: inline-block;
	max-width: 200px;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	vertical-align: middle;
}
</style>
