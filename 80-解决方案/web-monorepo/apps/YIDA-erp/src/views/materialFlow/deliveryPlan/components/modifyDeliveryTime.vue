<template>
	<el-dialog
		v-model="visible"
		:close-on-click-modal="false"
		title="修改计划发货时间"
		width="50%"
		@close="handleClose"
		draggable
	>
		<div class="dialog-container">
			<el-form :model="formData" ref="formRef" label-width="100px">
				<el-row class="mb18" :gutter="20">
					<el-col>
						<el-form-item
							label="计划发货时间"
							prop="planShipmentDate"
							label-width="120px"
						>
							<el-date-picker
								v-model="formData.planShipmentDate"
								type="date"
								maxlength="500"
								placeholder="选择时间"
								value-format="YYYY-MM-DD"
								format="YYYY-MM-DD"
							></el-date-picker>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row class="mb18" :gutter="20">
					<el-col>
						<el-form-item label="备注" prop="remark">
							<el-input v-model="formData.remark" type="textarea" />
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
					$t('确认修改')
				}}</el-button>
			</span>
		</template>
	</el-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { updatePlanShipmentDate } from '/@/api/materialFlow/deliveryPlan/index';
import { useMessage } from '/@/hooks/message';
interface HeaderSettingForm {
	ids: number[];
	planShipmentDate: string; // 平台渠道
	remark: string;
}
const defaultForm: HeaderSettingForm = {
	ids: [],
	planShipmentDate: '',
	remark: '',
};

const emit = defineEmits(['closeDialog', 'save']);

// 加载
const loading = ref(false);

const visible = ref(false);

// form表单
const formRef = ref();
const formData = ref<HeaderSettingForm>({ ...defaultForm });

// 打开弹窗
const handleOpen = (ids: any = {}) => {
	resetForm();
	formData.value.ids = ids;
	visible.value = true;
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
		if (!valid) return;

		loading.value = true;
		try {
			const api = updatePlanShipmentDate;

			const res = await api({ ...formData.value });

			if (res.code === 0) {
				useMessage().success('保存成功');
			} else {
				useMessage().error(res.msg || '保存失败');
			}
		} catch (error: any) {
			useMessage().error(error.msg || '接口异常');
		} finally {
			loading.value = false;
			handleClose();
			emit('save');
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
	height: 300px;
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
