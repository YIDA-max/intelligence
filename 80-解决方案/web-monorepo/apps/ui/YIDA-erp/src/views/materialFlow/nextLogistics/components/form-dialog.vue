<template>
	<el-dialog
		v-model="visible"
		:close-on-click-modal="false"
		:title="props.title"
		width="1200px"
		@close="handleClose"
		draggable
	>
		<div class="dialog-container">
			<el-form
				:model="formData"
				:rules="rules"
				ref="formRef"
				label-width="150px"
			>
				<el-row class="mb18" :gutter="60">
					<el-col :span="12">
						<el-form-item label="订柜号" prop="bookingNo">
							<el-input
								v-model="formData.bookingNo"
								maxlength="500"
								disabled
								placeholder="formatData.bookingNo"
							/>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="SO" prop="soNo">
							<el-input
								v-model="formData.soNo"
								maxlength="500"
								disabled
								placeholder="formatData.soNo"
							/>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row class="mb18" :gutter="60">
					<el-col :span="12">
						<el-form-item label="柜号" prop="containerNo">
							<el-input
								v-model="formData.containerNo"
								maxlength="500"
								disabled
								placeholder="formatData.containerNo"
							/>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item
							label="平台填写预计送达时间"
							prop="estimatedDeliveryTime"
						>
							<el-date-picker
								v-model="formData.estimatedDeliveryTime"
								type="datetime"
								maxlength="500"
								placeholder="选择时间"
								value-format="YYYY-MM-DD HH:mm:ss"
								format="YYYY-MM-DD HH:mm:ss"
							></el-date-picker>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row class="mb18" :gutter="60">
					<el-col :span="12">
						<el-form-item
							label="预约送平台仓时间"
							prop="scheduledDeliveryTimeToPlatformWarehouse"
						>
							<el-date-picker
								v-model="formData.scheduledDeliveryTimeToPlatformWarehouse"
								type="datetime"
								maxlength="500"
								placeholder="选择时间"
								value-format="YYYY-MM-DD HH:mm:ss"
								format="YYYY-MM-DD HH:mm:ss"
							></el-date-picker>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item
							label="实际送平台仓时间"
							prop="actualDeliveryTimeToPlatformWarehouse"
						>
							<el-date-picker
								v-model="formData.actualDeliveryTimeToPlatformWarehouse"
								type="datetime"
								maxlength="500"
								placeholder="选择时间"
								value-format="YYYY-MM-DD HH:mm:ss"
								format="YYYY-MM-DD HH:mm:ss"
							></el-date-picker>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row class="mb18" :gutter="60">
					<el-col :span="12">
						<el-form-item label="Plan ID(TK)" prop="planIdTk">
							<el-input
								v-model="formData.planIdTk"
								maxlength="500"
								placeholder="请输入"
							/>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="ISA NO" prop="isaNo">
							<el-input
								v-model="formData.isaNo"
								maxlength="500"
								placeholder="请输入"
							/>
						</el-form-item>
					</el-col>
				</el-row>

				<el-row class="mb18" :gutter="60">
					<el-col :span="12">
						<el-form-item label="尾程调拨单号" prop="lastMileAllocationNo">
							<el-input
								v-model="formData.lastMileAllocationNo"
								maxlength="500"
								placeholder="请输入"
							/>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
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
	</el-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { postSecondMileLogisticsUpdate } from '/@/api/materialFlow/nextLogistics/index';
import { useMessage } from '/@/hooks/message';

const props = defineProps({
	title: { type: String, default: '编辑头程单' },
});
const emit = defineEmits(['closeDialog', 'save']);

// 加载
const loading = ref(false);

const visible = ref(false);

// form表单
const formRef = ref();
const formData = ref({
	// ID
	id: '',
	// 预约单号
	bookingNo: '',
	// SO
	soNo: '',
	// SKU
	sku: '',
	// 柜号
	containerNo: '',
	// MSKU
	msku: '',
	// 实际发货数量
	actualQty: '',
	// 实际送仓数量
	actualQtyDeliveryToWarehouse: '',
	// 平台填写预计送达时间
	estimatedDeliveryTime: '',
	// 预约送平台仓时间
	scheduledDeliveryTimeToPlatformWarehouse: '',
	// 实际送平台仓时间
	actualDeliveryTimeToPlatformWarehouse: '',
	// Plan ID(TK)
	planIdTk: '',
	// ISA NO
	isaNo: '',
	// 尾程调拨单号
	lastMileAllocationNo: '',
});

// 校验规则
const rules = {
	actualQtyDeliveryToWarehouse: [
		{ required: true, message: '实际送仓数量不能为空', trigger: 'blur' },
	],
	scheduledDeliveryTimeToPlatformWarehouse: [
		{ required: true, message: '预约送平台仓时间不能为空', trigger: 'blur' },
	],
	actualDeliveryTimeToPlatformWarehouse: [
		{ required: true, message: '实际送平台仓时间不能为空', trigger: 'blur' },
	],
	isaNo: [{ required: false, message: 'ISA NO不能为空', trigger: 'change' }],
	lastMileAllocationNo: [
		{ required: true, message: '尾程调拨单号不能为空', trigger: 'change' },
	],
};

// 打开弹窗
const handleOpen = async (row: any) => {
	// resetForm();
	formData.value = {
		id: row.id || null,
		bookingNo: row.bookingNo || null,
		soNo: row.soNo || null,
		sku: row.sku || null,
		containerNo: row.containerNo || null,
		msku: row.msku || null,
		actualQty: row.actualQty || null,
		// 实际送仓数量
		actualQtyDeliveryToWarehouse: row.actualQtyDeliveryToWarehouse || '',
		// 平台填写预计送达时间
		estimatedDeliveryTime: row.estimatedDeliveryTime || '',
		// 预约送平台仓时间
		scheduledDeliveryTimeToPlatformWarehouse:
			row.scheduledDeliveryTimeToPlatformWarehouse || '',
		// 实际送平台仓时间
		actualDeliveryTimeToPlatformWarehouse:
			row.actualDeliveryTimeToPlatformWarehouse || '',
		// Plan ID(TK)
		planIdTk: row.planIdTk || '',
		// ISA NO
		isaNo: row.isaNo || '',
		// 尾程调拨单号
		lastMileAllocationNo: row.lastMileAllocationNo || '',
	};
	visible.value = true;
};

// 关闭弹窗
const handleClose = () => {
	visible.value = false;
};

// 提交
const onSubmit = () => {
	formRef.value.validate(async (valid: boolean) => {
		if (valid) {
			let api = postSecondMileLogisticsUpdate;
			try {
				const res = await api({
					id: formData.value.id,
					bookingNo: formData.value.bookingNo,
					soNo: formData.value.soNo,
					sku: formData.value.sku,
					containerNo: formData.value.containerNo,
					msku: formData.value.msku,
					// 实际发货数量
					actualQty: formData.value.actualQty,
					// 实际送仓数量
					actualQtyDeliveryToWarehouse:
						formData.value.actualQtyDeliveryToWarehouse,
					// 平台填写预计送达时间
					estimatedDeliveryTime: formData.value.estimatedDeliveryTime,
					// 预约送平台仓时间
					scheduledDeliveryTimeToPlatformWarehouse:
						formData.value.scheduledDeliveryTimeToPlatformWarehouse,
					// 实际送平台仓时间
					actualDeliveryTimeToPlatformWarehouse:
						formData.value.actualDeliveryTimeToPlatformWarehouse,
					// Plan ID(TK)
					planIdTk: formData.value.planIdTk,
					// ISA NO
					isaNo: formData.value.isaNo,
					// 尾程调拨单号
					lastMileAllocationNo: formData.value.lastMileAllocationNo,
				});
				if (res.code === 0) {
					useMessage().success('更新成功');
					emit('save');
				}
			} catch (error: any) {
				useMessage().error(error.msg);
			}
			handleClose();
		}
	});
};

defineExpose({
	handleOpen,
	handleClose,
});
</script>

<style lang="scss" scoped>
.dialog-container {
	padding: 0 20px;
	overflow: auto;
	height: 500px;
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
