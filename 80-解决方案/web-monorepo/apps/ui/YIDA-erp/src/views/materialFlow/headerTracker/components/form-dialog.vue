<template>
	<el-dialog
		v-model="visible"
		:close-on-click-modal="false"
		:title="props.title"
		width="70%"
		@close="handleClose"
		draggable
	>
		<div class="dialog-container">
			<el-form :model="formData" ref="formRef" label-width="100px">
				<el-row class="mb18" :gutter="20">
					<el-col :span="12">
						<el-form-item label="订柜号" prop="bookingNo" label-width="200px">
							<el-input
								v-model="formData.bookingNo"
								maxlength="500"
								disabled
								placeholder="formatData.bookingNo"
							/>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="SO" prop="soNo" label-width="120px">
							<el-input
								v-model="formData.soNo"
								maxlength="500"
								disabled
								placeholder="formatData.soNo"
							/>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row class="mb18" :gutter="20">
					<el-col :span="12">
						<el-form-item label="柜号" prop="containerNo" label-width="200px">
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
							label="货物状态"
							prop="cargoStatus"
							label-width="120px"
						>
							<el-select
								v-model="formData.cargoStatus"
								placeholder="货物状态"
								maxlength="500"
							>
								<el-option
									v-for="item in props.dictMap.cargoStatus.filter((i:any) => ['4', '5', current_status].includes(i.value))"
									:key="item.id"
									:label="item.label"
									:value="item.value"
								/>
							</el-select>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row class="mb18" :gutter="20">
					<el-col :span="12">
						<el-form-item
							label="预计入库(第一目的仓)"
							prop="scheduledInboundTimeFirst"
							label-width="200px"
						>
							<el-date-picker
								v-model="formData.scheduledInboundTimeFirst"
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
							label="调拨单号"
							prop="transferOrderNo"
							label-width="120px"
						>
							<el-input
								v-model="formData.transferOrderNo"
								maxlength="500"
								placeholder="请输入"
							/>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row class="mb18" :gutter="20">
					<el-col :span="12">
						<el-form-item
							label="实际入库(第一目的仓)"
							prop="actualInboundTimeFirst"
							label-width="200px"
						>
							<el-date-picker
								v-model="formData.actualInboundTimeFirst"
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
							label="第三方入库单号"
							prop="thirdWarehouseInboundNo"
							label-width="120px"
						>
							<el-input
								v-model="formData.thirdWarehouseInboundNo"
								maxlength="500"
								placeholder="请输入"
							/>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row class="mb18" :gutter="20">
					<el-col :span="12">
						<el-form-item
							label="到仓时间"
							prop="warehouseArrivalTime"
							label-width="200px"
						>
							<el-date-picker
								v-model="formData.warehouseArrivalTime"
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
							label="入库时间"
							prop="inboundTime"
							label-width="120px"
						>
							<el-date-picker
								v-model="formData.inboundTime"
								type="datetime"
								maxlength="500"
								placeholder="选择时间"
								value-format="YYYY-MM-DD HH:mm:ss"
								format="YYYY-MM-DD HH:mm:ss"
							></el-date-picker>
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
import {
	updateHeaderTrack,
	saveHeaderTrack,
} from '/@/api/materialFlow/headerTracker/index';
import { useMessage } from '/@/hooks/message';

const props = defineProps({
	title: { type: String, default: '编辑头程单' },
	dictMap: { type: Object, default: () => ({}) }, // 字典数据
});
const emit = defineEmits(['closeDialog', 'save']);

// 加载
const loading = ref(false);

const visible = ref(false);

const current_status = ref('');

// form表单
const formRef = ref();
const formData = ref({
	id: '',
	bookingNo: '',
	soNo: '',
	sku: '',
	containerNo: '',
	msku: '',
	cargoStatus: '',
	scheduledInboundTimeFirst: '',
	deliveryMethod: '',
	actualInboundTimeFirst: '',
	transferOrderNo: '',
	thirdWarehouseInboundNo: '',
	inboundTime: '',
	warehouseArrivalTime: '',
});

// 校验规则
// const rules = {
// 	 estimatedDate: [
// 	 	{ required: true, message: '预计入库时间不能为空', trigger: 'blur' },
// 	 ],
// 	 actualDate: [{ required: true, message: '实际入库时间不能为空', trigger: 'blur' }],
// 	 orderNumber: [{ required: true, message: '调拨单号不能为空', trigger: 'change' }],
// 	 status: [{ required: true, message: '状态不能为空', trigger: 'change' }],
// };

// 打开弹窗
const handleOpen = async (row: any) => {
	resetForm();
	if (!row.id) {
		formData.value = {
			id: '',
			bookingNo: '',
			soNo: '',
			sku: '',
			containerNo: '',
			msku: '',
			cargoStatus: '',
			scheduledInboundTimeFirst: '',
			deliveryMethod: '',
			actualInboundTimeFirst: '',
			transferOrderNo: '',
			thirdWarehouseInboundNo: '',
			inboundTime: '',
			warehouseArrivalTime: '',
		};
	} else {
		formData.value = {
			id: row.id || '------',
			bookingNo: row.bookingNo || '------',
			soNo: row.soNo || '------',
			sku: row.sku || '------',
			containerNo: row.containerNo || '------',
			msku: row.msku || '------',
			cargoStatus: row.cargoStatus,
			scheduledInboundTimeFirst: row.scheduledInboundTimeFirst,
			deliveryMethod: row.deliveryMethod,
			actualInboundTimeFirst: row.actualInboundTimeFirst,
			transferOrderNo: row.transferOrderNo,
			thirdWarehouseInboundNo: row.thirdWarehouseInboundNo,
			inboundTime: row.inboundTime,
			warehouseArrivalTime: row.warehouseArrivalTime,
		};
	}
	visible.value = true;

	current_status.value = row.cargoStatus;
};

// 关闭弹窗
const handleClose = () => {
	visible.value = false;
};

// 重置表单
function resetForm() {
	formRef.value?.resetFields();
}
// 提交
const onSubmit = () => {
	formRef.value.validate(async (valid: boolean) => {
		if (valid) {
			let api =
				props.title === '编辑头程单' ? updateHeaderTrack : saveHeaderTrack;
			try {
				const res = await api({
					id: props.title === '编辑头程单' ? formData.value.id : '',
					bookingNo: formData.value.bookingNo,
					soNo: formData.value.soNo,
					sku: formData.value.sku,
					containerNo: formData.value.containerNo,
					msku: formData.value.msku,
					cargoStatus: formData.value.cargoStatus,
					scheduledInboundTimeFirst: formData.value.scheduledInboundTimeFirst,
					deliveryMethod: formData.value.deliveryMethod,
					actualInboundTimeFirst: formData.value.actualInboundTimeFirst,
					transferOrderNo: formData.value.transferOrderNo,
					thirdWarehouseInboundNo: formData.value.thirdWarehouseInboundNo,
					inboundTime: formData.value.inboundTime,
					warehouseArrivalTime: formData.value.warehouseArrivalTime,
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
