<script setup lang="ts">
import { ref, defineProps } from 'vue';
import { postOrderShipped } from '/@/api/fbm/selfOrder/index';
import { useI18n } from 'vue-i18n';
import { useMessage } from '/@/hooks/message';
import { useResultDialog } from '/@/hooks/useResultDialog';
const { open } = useResultDialog();
const { t } = useI18n();
const props = defineProps({
	// 当前行数据
	currentRow: {
		type: Object,
		default: () => ({}),
	},
});
const dialogRef = ref<any | null>(null);
// 弹窗显示与否
const dialogVisible = ref(false);
const getDataList = inject<any>('getDataList');
// 表单数据
// const formData = ref<Record<string, any>>({
// 	shippingTime: '', // 发货时间
// 	warehouseNo: '', // 仓库单号
// 	waybillNo: '', // 运单号
// 	logisticsTrackingNo: '', // 追踪号
// });
// const formRef = ref<any>(null);
// // 表单校验
// const rules = ref({
// 	shippingTime: [{ required: true, message: '请选择发货时间', trigger: 'blur' }],
// 	warehouseNo: [{ required: true, message: '请输入仓库单号', trigger: 'blur' }],
// 	waybillNo: [{ required: true, message: '请输入运单号', trigger: 'blur' }],
// 	logisticsTrackingNo: [{ required: true, message: '请输入追踪号', trigger: 'blur' }],
// });

/**
 * 初始化
 */
const init = () => {
	// 重置数据
	// formData.value = {
	// 	shippingTime: '', // 发货时间
	// 	warehouseNo: '', // 仓库单号
	// 	waybillNo: '', // 运单号
	// 	logisticsTrackingNo: '', // 追踪号
	// };
};
/**
 * 确定
 */
const onSubmit = async () => {
	// 表单校验
	// if (!formRef.value) return;
	// await formRef.value.validate();
	// 调用接口
	const params = {
		ids: [props.currentRow.id],
		// shippingTime: formData.value.shippingTime,
		// warehouseNo: formData.value.warehouseNo,
		// waybillNo: formData.value.waybillNo,
		// logisticsTrackingNo: formData.value.logisticsTrackingNo,
	};
	const res = await postOrderShipped(params);
	if (res.code === 0) {
		// 判断是否有失败的记录
		if (res.data?.failCount > 0) {
			// 展示错误提示
			open({
				title: t('订单发货失败'),
				data: res.data,
			});
		} else if (res.data?.failCount === 0) {
			useMessage().success('操作成功');
			getDataList();
		}
		dialogVisible.value = false;
	}
};
/**
 * 打开弹窗方法
 * 供父组件调用
 */
const show = () => {
	dialogVisible.value = true;
};

/**
 * 关闭弹窗方法
 * 供父组件调用
 */
const hide = () => {
	dialogVisible.value = false;
};

// 暴露方法给父组件
defineExpose({
	show,
	hide,
});
</script>

<template>
	<el-dialog
		draggable
		ref="dialogRef"
		v-model="dialogVisible"
		:width="600"
		:close-on-click-modal="false"
		:close-on-press-escape="false"
		:append-to-body="true"
		@open="init"
		@close="hide"
		:title="t('确定发货')"
		:style="{
			height: '200px',
		}"
	>
		<div
			:style="{
				height: '30px',
				overflow: 'auto',
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'flex-start',
				justifyContent: 'center',
			}"
		>
			<span> 确认订单已发货? </span>
			<!-- <el-form :model="formData" ref="formRef" label-width="100px" :rules="rules">
				<el-row class="mb18">
					<el-col :span="24" prop="shippingTime">
						<el-form-item label="发货时间(北京)"> </el-form-item>
					</el-col>
				</el-row>
				<el-row class="mb18">
					<el-col :span="24">
						<el-form-item label="仓库单号" prop="warehouseNo"> </el-form-item>
					</el-col>
				</el-row>
				<el-row class="mb18">
					<el-col :span="24">
						<el-form-item label="运单号" prop="waybillNo"> </el-form-item>
					</el-col>
				</el-row>
				<el-row class="mb18">
					<el-col :span="24">
						<el-form-item label="追踪号" prop="logisticsTrackingNo"> </el-form-item>
					</el-col>
				</el-row>
			</el-form> -->
		</div>

		<template #footer>
			<div style="text-align: right">
				<el-button @click="hide">{{ t('取消') }}</el-button>

				<el-button type="primary" @click="onSubmit">{{ t('确定') }}</el-button>
			</div>
		</template>
	</el-dialog>
</template>

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
