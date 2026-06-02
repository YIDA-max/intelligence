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
					:data="filteredDeliveryList"
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
					<el-table-column
						prop="skuCode"
						label="SKU/产品名称"
						width="150"
						show-overflow-tooltip
					>
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
								<div>
									{{ row.skuCode }}
								</div>
								<div>{{ row.skuName }}</div>
							</div>
						</template>
					</el-table-column>
					<el-table-column
						label="发货箱数"
						prop="deliveryCartonQuantity"
						width="100"
					>
						<template #default="{ row }">
							{{ row.deliveryCartonQuantity || '-' }}
						</template>
					</el-table-column>
					<el-table-column label="发货数量" prop="shipmentQuantity" width="100">
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
						prop="intoQuantity"
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
								v-model.number="row.intoQuantity"
								:min="0"
								type="number"
								@input="handleIntoQuantityInput(row)"
							/>
						</template>
					</el-table-column>
					<!-- <el-table-column :label="t('本次入库箱数')" show-overflow-tooltip width="180">
						<template #default="{ row }">
							{{ Math.ceil((row.intoQuantity || 0) / (row.singleCartonQuantity || 1)) }}
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
					<!-- <el-table-column prop="outCartonLength" :label="t('外箱长宽高(CM)')" show-overflow-tooltip width="200">
						<template #default="{ row }"> {{ row.outCartonLength }}*{{ row.outCartonWidth }}*{{ row.outCartonHeight }} </template>
					</el-table-column>
					<el-table-column prop="productNetWeight" :label="t('产品净重(KG)')" show-overflow-tooltip width="180">
						<template #default="{ row }"> {{ row.productNetWeight?.toFixed(2) || '---' }} </template>
					</el-table-column>
					<el-table-column prop="outCartonGrossWeight" :label="t('外箱毛重(KG)')" show-overflow-tooltip width="180">
						<template #default="{ row }"> {{ row.outCartonGrossWeight?.toFixed(2) || '---' }} </template>
					</el-table-column>
					<el-table-column prop="totalVolume" :label="t('总体积(m³)')" show-overflow-tooltip width="180">
						<template #default="{ row }"> {{ row.totalVolume?.toFixed(2) || '---' }} </template>
					</el-table-column>
					<el-table-column prop="totalNetWeight" :label="t('总净重(KG)')" show-overflow-tooltip width="180">
						<template #default="{ row }"> {{ row.totalNetWeight?.toFixed(2) || '---' }} </template>
					</el-table-column>
					<el-table-column prop="totalGrossWeight" :label="t('总毛重(KG)')" show-overflow-tooltip width="180">
						<template #default="{ row }"> {{ row.totalGrossWeight?.toFixed(2) || '---' }} </template>
					</el-table-column> -->
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
							{{ row.departmentName || '---' }} & {{ row.deptName }}
						</template>
					</el-table-column>
					<el-table-column
						prop="operationUserName"
						:label="t('运营人')"
						show-overflow-tooltip
						width="180"
					/>
					<!-- <el-table-column label="备注" min-width="200" show-overflow-tooltip>
						<template #default="{ row }">
							{{ row.remark || '-' }}
						</template>
					</el-table-column> -->
				</el-table>
			</el-col>
		</el-row>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="handleCancel">取消</el-button>
				<el-button
					@click="handleDiffSecondConfirm"
					v-if="showDiffSecondConfirmButton"
					>入库完成并生成二程调拨</el-button
				>
				<el-button @click="handleDiffConfirm" v-if="showDiffConfirmButton"
					>确认差异入库完成</el-button
				>
				<el-button type="primary" @click="handleConfirm">确认</el-button>
			</span>
		</template>
	</confirm-dialog>
	<DifferenceConfirmDialog
		v-model="differenceDialogVisible"
		:query-params="props.currentRow || {}"
		:show-diff-confirm-button="showDiffConfirmButton"
		@success="handleDifferenceConfirmSuccess"
	/>
</template>

<script setup lang="ts">
import { ref, reactive, nextTick, computed } from 'vue';
import ConfirmDialog, { IconType } from '/@/components/ConfirmDialog/index.vue';
import { useI18n } from 'vue-i18n';
import { useMessage } from '/@/hooks/message';
import DifferenceConfirmDialog from './differenceConfirmDalog.vue';

import { postDiffConfirm } from '/@/api/materialFlow/firstMileLogistics/index';
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
	/**
	 * 当前操作行数据
	 */
	tabeleRow: {
		type: Object,
		default: () => ({}),
	},
});

const sumBy = (data: any[], key: string) =>
	(data || []).reduce(
		(sum: number, row: any) => sum + (Number(row?.[key]) || 0),
		0
	);

const filteredDeliveryList = computed(
	() =>
		props.currentRow?.deliveryVOList?.filter(
			(item: any) => item.allowIntoQuantity !== 0
		) ?? []
);

/**
 *
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
		intoQuantity: sumBy(data, 'intoQuantity'),
	};

	columns.forEach((column: any, index: number) => {
		const key = String(column?.property || '');
		if (!key) return;
		if (key in totals) sums[index] = String(totals[key]);
	});
	return sums;
};
const formatQuantity = (val: any, max: any) => {
	let n = Math.floor(Number(val) || 0);
	return Math.min(Math.max(n, 0), max || 0);
};

// 计算是否显示入库完成并生成二程调拨
const showDiffSecondConfirmButton = computed(() => {
	//中转仓
	return props.tabeleRow.transshipmentFlag === 1;
});
// 计算是否显示差异确认按钮
const showDiffConfirmButton = computed(() => {
	//非中转仓&&海外仓
	return (
		props.tabeleRow.transshipmentFlag === 0 &&
		!props.tabeleRow.hasDestPlatformWareHouse
	);
});

// 计算输入框的最大值限制
const getInputMaxValue = (row: any) => {
	if (showDiffSecondConfirmButton.value || showDiffConfirmButton.value) {
		return undefined;
	}
	const maxValue = Number(row.allowIntoQuantity) || 0;
	return maxValue > 0 ? maxValue : undefined;
};

// 输入框输入事件处理
const handleIntoQuantityInput = (row: any) => {
	const maxValue = getInputMaxValue(row);
	if (maxValue !== undefined && row.intoQuantity > maxValue) {
		row.intoQuantity = maxValue;
	}
};

/**
 * 批量填写本次入库数量
 * 需求：直接把“可入库数量”赋值到“本次入库数量”，并保证数字类型
 */
const batchFillIntoQuantity = () => {
	filteredDeliveryList.value.forEach((row: any) => {
		row.intoQuantity = formatQuantity(
			row.allowIntoQuantity,
			row.allowIntoQuantity
		);
	});
};
const emit = defineEmits([
	'cancel',
	'confirm',
	'diffConfirm',
	'closed',
	'update:modelValue',
]);
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
 * 确认操作处理函数
 */
const handleConfirm = () => {
	const { deliveryVOList } = props.currentRow || {};
	// 校验1：至少有一行填写了有效数量（>0）
	const hasFilled = filteredDeliveryList.value?.some(
		(row: { intoQuantity: any }) => Number(row.intoQuantity) > 0
	);
	if (!hasFilled) {
		useMessage().warning('请至少填写一行有效入库数量（大于0）');
		return;
	}

	// 校验2：单行入库数量不能大于可入库数量
	// for (const row of deliveryVOList) {
	// 	const intoQty = Number(row.intoQuantity) || 0;
	// 	const allowQty = Number(row.allowIntoQuantity) || 0;
	// 	if (intoQty > allowQty) {
	// 		const skuInfo = row.skuCode;
	// 		const skuName = row.skuName || '';
	// 		useMessage().error(
	// 			`SKU[${skuInfo}${
	// 				skuName ? '-' + skuName : ''
	// 			}]入库数量大于可入库数量，请通过【入库完成并生成二程调拨】来处理差异！`
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
 * 确认差异入库完成
 */
const handleDiffConfirm = () => {
	const hasFilled = filteredDeliveryList.value?.some(
		(row: { intoQuantity: any }) =>
			row.intoQuantity === '' ||
			row.intoQuantity === undefined ||
			row.intoQuantity === null
	);
	if (hasFilled) {
		useMessage().warning('请填写所有SKU的入库数量（大于等于0）');
		return;
	}

	// 校验2：必须存在差异（单行入库数量大于可入库数量）
	const hasDifference = filteredDeliveryList.value?.every(
		(row: { intoQuantity: any; allowIntoQuantity: any }) =>
			Number(row.intoQuantity) === Number(row.allowIntoQuantity)
	);
	if (hasDifference) {
		//不存在差异直接调接口
		const intoDataDTOS = props.currentRow?.deliveryVOList?.map((item: any) => {
			return {
				intoQuantity: item.intoQuantity || 0,
				id: item.id,
			};
		});
		postDiffConfirm({
			id: props.currentRow?.id,
			intoDataDTOS: intoDataDTOS,
		}).then((res) => {
			if (res.code === 0) {
				useMessage().success(res.msg ? res.msg : '操作成功');
				emit('cancel', true);
			}
		});

		return;
	}

	differenceDialogVisible.value = true;
};

/**
 * 确认差异入库操作处理函数
 */
const handleDiffSecondConfirm = () => {
	const hasFilled = filteredDeliveryList.value?.some(
		(row: { intoQuantity: any }) =>
			row.intoQuantity === '' ||
			row.intoQuantity === undefined ||
			row.intoQuantity === null
	);
	if (hasFilled) {
		useMessage().warning('请填写所有SKU的入库数量（大于等于0）');
		return;
	}

	// 校验2：必须存在差异（单行入库数量大于可入库数量）
	const hasDifference = filteredDeliveryList.value?.every(
		(row: { intoQuantity: any; allowIntoQuantity: any }) =>
			Number(row.intoQuantity) === Number(row.allowIntoQuantity)
	);
	if (hasDifference) {
		useMessage().warning('入库数量不存在差异，不可操作！');
		return;
	}

	differenceDialogVisible.value = true;
};

const handleDifferenceConfirmSuccess = () => {
	differenceDialogVisible.value = false;
	emit('cancel', true);
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
</style>
