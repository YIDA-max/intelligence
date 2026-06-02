<template>
	<el-dialog
		v-model="visible"
		title="处理差异"
		width="1280"
		:close-on-click-modal="false"
		:close-on-press-escape="false"
		@close="handleClose"
	>
		<el-table :data="tableData" border style="width: 100%" max-height="500">
			<el-table-column prop="shipmentId" label="货件单号" min-width="140" />
			<el-table-column
				prop="transferOrderNo"
				label="调拨单号"
				min-width="140"
			/>
			<el-table-column prop="deliveryNo" label="发货单号" min-width="140" />
			<el-table-column prop="skuCode" label="SKU" min-width="140" />
			<el-table-column prop="shipQuantity" label="发货数量" min-width="100" />
			<el-table-column
				prop="receiveQuantity"
				label="收货数量"
				min-width="100"
			/>
			<el-table-column prop="diffQuantity" label="差异数量" min-width="100" />
			<el-table-column label="已处理差异数量" min-width="160">
				<template #default="{ row }">
					{{ row.handledDiffQuantity || 0 }}
				</template>
			</el-table-column>
			<el-table-column label="索赔数量" min-width="140">
				<template #default>
					<el-input-number
						v-model="form.claimQuantity"
						:min="1"
						:max="getFieldMax('claimQuantity')"
						:step="1"
						:precision="0"
						:disabled="isClaimAndLossDisabled"
						controls-position="right"
						placeholder="请输入"
						@change="handleQuantityChange('claimQuantity')"
					/>
				</template>
			</el-table-column>
			<el-table-column label="认丢数量" min-width="140">
				<template #default>
					<el-input-number
						v-model="form.lossQuantity"
						:min="1"
						:max="getFieldMax('lossQuantity')"
						:step="1"
						:precision="0"
						:disabled="isClaimAndLossDisabled"
						controls-position="right"
						placeholder="请输入"
						@change="handleQuantityChange('lossQuantity')"
					/>
				</template>
			</el-table-column>
			<el-table-column label="多收数量" min-width="140">
				<template #default>
					<el-input-number
						v-model="form.extraReceiveQuantity"
						:min="1"
						:max="getFieldMax('extraReceiveQuantity')"
						:step="1"
						:precision="0"
						:disabled="isExtraReceiveDisabled"
						controls-position="right"
						placeholder="请输入"
						@change="handleQuantityChange('extraReceiveQuantity')"
					/>
				</template>
			</el-table-column>
		</el-table>

		<template #footer>
			<span class="dialog-footer">
				<el-button @click="handleClose">取消</el-button>
				<el-button type="primary" :loading="loading" @click="handleSubmit">
					确定
				</el-button>
			</span>
		</template>
	</el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue';
import { useMessage } from '/@/hooks/message';
import { listApi } from '../config/index';

interface Props {
	modelValue: boolean;
	rowData?: any;
}

const props = defineProps<Props>();
const emit = defineEmits(['update:modelValue', 'success']);

const message = useMessage();
const visible = ref(false);
const loading = ref(false);
const tableData = ref<any[]>([]);
const currentRow = ref<any>(null);

const form = reactive({
	claimQuantity: undefined as number | undefined | string,
	lossQuantity: undefined as number | undefined | string,
	extraReceiveQuantity: undefined as number | undefined | string,
});

const fieldLabels = {
	claimQuantity: '索赔数量',
	lossQuantity: '认丢数量',
	extraReceiveQuantity: '多收数量',
} as const;

const getDiffQuantity = () => Number(currentRow.value?.diffQuantity || 0);

const getRemainQuantity = () => {
	if (!currentRow.value) return 0;
	return Math.max(
		0,
		Math.abs(getDiffQuantity()) -
			Number(currentRow.value?.handledDiffQuantity || 0)
	);
};

const isClaimAndLossDisabled = computed(() => getDiffQuantity() > 0);
const isExtraReceiveDisabled = computed(() => getDiffQuantity() < 0); //差异数量小于0

const normalizePositiveInteger = (value?: number | string) => {
	if (value === undefined || value === null) {
		return undefined;
	}
	const normalized = Math.floor(Number(value));
	if (!Number.isFinite(normalized) || normalized <= 0) {
		return undefined;
	}
	return normalized;
};

const getHandleTotal = () => {
	return (
		Number(form.claimQuantity || 0) +
		Number(form.lossQuantity || 0) +
		Number(form.extraReceiveQuantity || 0)
	);
};

const getFieldValue = (field: keyof typeof fieldLabels) => {
	return Number(form[field] || 0);
};

const getFieldMax = (field: keyof typeof fieldLabels) => {
	const remainQuantity = getRemainQuantity();
	const otherTotal = getHandleTotal() - getFieldValue(field);
	return Math.max(remainQuantity - otherTotal, 1);
};

const handleQuantityChange = (field: keyof typeof fieldLabels) => {
	form[field] = normalizePositiveInteger(form[field]) as never;

	if (
		(field === 'claimQuantity' || field === 'lossQuantity') &&
		isClaimAndLossDisabled.value
	) {
		form[field] = undefined as never;
		return;
	}

	if (field === 'extraReceiveQuantity' && isExtraReceiveDisabled.value) {
		form[field] = undefined as never;
		return;
	}

	const currentValue = getFieldValue(field);
	const currentMax = getFieldMax(field);

	if (currentValue > currentMax) {
		form[field] = currentMax as never;
		message.warning(fieldLabels[field] + ' 超过剩余数量');
	}
};

const resetForm = () => {
	form.claimQuantity = undefined;
	form.lossQuantity = undefined;
	form.extraReceiveQuantity = undefined;
};

watch(
	() => props.modelValue,
	(val) => {
		visible.value = val;
		if (val && props.rowData) {
			currentRow.value = { ...props.rowData };
			tableData.value = [currentRow.value];
			resetForm();
		}
	}
);

watch(visible, (val) => {
	emit('update:modelValue', val);
});

const handleClose = () => {
	visible.value = false;
	tableData.value = [];
	currentRow.value = null;
	resetForm();
};

const handleSubmit = async () => {
	const claimQuantity =
		form.claimQuantity !== '' && form.claimQuantity != null
			? Number(form.claimQuantity)
			: undefined;
	const lossQuantity =
		form.lossQuantity !== '' && form.lossQuantity != null
			? Number(form.lossQuantity)
			: undefined;
	const extraReceiveQuantity =
		form.extraReceiveQuantity !== '' && form.extraReceiveQuantity != null
			? Number(form.extraReceiveQuantity)
			: undefined;
	const totalHandledQuantity = (claimQuantity ?? 0) + (lossQuantity ?? 0);

	if (!currentRow.value) {
		message.warning('请选择差异行');
		return;
	}
	if (
		![claimQuantity, lossQuantity, extraReceiveQuantity]
			.filter((v) => v !== undefined)
			.every(Number.isInteger)
	) {
		message.warning('数量只能为整数');
		return;
	}

	if (
		[claimQuantity, lossQuantity, extraReceiveQuantity]
			.filter((v) => v !== undefined)
			.some((item) => item < 0)
	) {
		message.warning('数量不能小于0');
		return;
	}

	//业务校验
	if (isExtraReceiveDisabled.value) {
		if (totalHandledQuantity <= 0) {
			message.warning('索赔数量和认丢数量要必填其中一个');
			return;
		}
		const remainQuantity = getRemainQuantity();
		if (totalHandledQuantity !== remainQuantity) {
			message.warning('索赔数量+认丢数量必须等于差异数量');
			return;
		}
	}
	if (isClaimAndLossDisabled.value) {
		if ((extraReceiveQuantity ?? 0) <= 0) {
			message.warning('多收数量必填');
			return;
		}
		if (extraReceiveQuantity !== getRemainQuantity()) {
			message.warning('多收数量必须等于差异数量');
			return;
		}
	}

	try {
		loading.value = true;
		const res = await listApi.handleDiff({
			id: currentRow.value.id,
			claimQuantity,
			lossQuantity,
			extraReceiveQuantity,
		});

		if (res.code === 0) {
			handleClose();
			emit('success');
		}
	} catch (error: any) {
		message.error(error?.msg || error?.message || 'Handle failed');
	} finally {
		loading.value = false;
	}
};
</script>
