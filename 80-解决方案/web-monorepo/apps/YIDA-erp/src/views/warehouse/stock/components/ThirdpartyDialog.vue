<template>
	<el-dialog
		v-model="visible"
		width="90%"
		:close-on-click-modal="false"
		draggable
		:destroy-on-close="false"
		title="转库存申请"
	>
		<div class="header-controls">
			<el-select
				v-model="transferType"
				placeholder="请选择单据类型"
				class="select-type mr-2"
				@change="handleTransferTypeChange"
			>
				<el-option label="头程在途转换" :value="1" />
				<el-option label="海外仓" :value="2" />
			</el-select>
			<!-- 海外仓可以进行整箱还是散货切换 -->
			<el-select
				v-if="transferType === 2"
				v-model="stockAndCartonType"
				placeholder="请选择整箱还是散货"
				class="select-type"
				@change="handleStockAndCartonTypeChange"
			>
				<el-option
					v-for="value in [
						{
							label: '整箱',
							value: 1,
						},
						{
							label: '散货',
							value: 2,
						},
					]"
					:key="value.value"
					:label="value.label"
					:value="value.value"
				/>
			</el-select>
		</div>
		<firstMileLogTransferDialog
			:dictMap="dictMap"
			v-show="transferType === 1"
			ref="firstMileLogTransferDialogRef"
			@submitted="handleSubmitted"
		/>
		<transferDialog
			:dictMap="dictMap"
			v-show="transferType === 2"
			ref="transferDialogRef"
			@submitted="handleSubmitted"
		/>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="handleClose">取消</el-button>
				<el-button type="primary" @click="handleConfirm">确认提交</el-button>
			</span>
		</template>
	</el-dialog>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';
import firstMileLogTransferDialog from './FirstMileLogTransferDialog.vue';
import transferDialog from './transferDialog.vue';

// 接收上级传入的字典数据
const props = defineProps<{
	dictMap: Record<string, unknown>;
}>();

// 暴露给模板使用的字典数据
const dictMap = computed(() => props.dictMap || {});

const emit = defineEmits(['closed', 'submitted']);

const visible = ref(false);
const firstMileLogTransferDialogRef = ref<any>(null);
const transferDialogRef = ref<any>(null);

// 转库存类型：1-在途转换，2-头程在途转换
const transferType = ref<number>(1);

// 海外仓查询库存的时候要整箱还是散货
const stockAndCartonType = ref<number>(1);

let originalRow = ref<any>({});
// 打开弹窗：入参为选中的原库存记录（至少包含唯一标识）
const open = async (_row: any) => {
	visible.value = true;
	originalRow.value = _row;
	transferType.value = 1;
	setTimeout(() => {
		firstMileLogTransferDialogRef.value?.open(originalRow.value);
	}, 100);
};

/**
 * 处理转库存类型切换
 */
const handleTransferTypeChange = async (value: number) => {
	if (value === 1) {
		firstMileLogTransferDialogRef.value.open(originalRow.value);
	} else {
		// 默认整箱
		stockAndCartonType.value = 1;
		// 触发更新
		transferDialogRef.value.open(originalRow.value, stockAndCartonType.value);
	}
};
/**
 * 海外仓处理整箱还是散货切换
 */
const handleStockAndCartonTypeChange = async () => {
	// 手动的触发一次更新
	transferDialogRef.value.open(originalRow.value, stockAndCartonType.value);
};
const handleClose = () => {
	visible.value = false;
	emit('closed');
};

const handleConfirm = async () => {
	if (transferType.value === 1) {
		firstMileLogTransferDialogRef.value.handleConfirm();
	} else {
		transferDialogRef.value.handleConfirm();
	}
};
const handleSubmitted = () => {
	emit('submitted');
	handleClose();
};
defineExpose({ open, handleClose });
</script>

<style lang="scss" scoped>
// 头部控制区
.header-controls {
	margin-bottom: 16px;
}

.select-type {
	width: 200px;
}

.select-platform {
	width: 220px;
}

// 对话框容器
.dialog-container {
	padding: 0 10px;
	max-height: 70vh;
	overflow: auto;
}

// 转库存组
.transfer-group {
	margin-bottom: 24px;
	padding: 16px;
	border: 1px solid #e4e7ed;
	border-radius: 4px;
	background-color: #f9fafb;

	&:last-of-type {
		margin-bottom: 16px;
	}
}

// 组头部
.group-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	width: 100%;
}

// 标题
.section-title {
	font-weight: bold;
	margin: 10px 0 10px 0;
	display: flex;
	align-items: center;
}

.section-title-spacing {
	margin-top: 16px;
}

.section-bar {
	display: inline-block;
	width: 4px;
	height: 18px;
	background: #2e5cf6;
	border-radius: 2px;
	margin-right: 8px;
}

// SKU 列样式
.sku-column {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: flex-start;
	width: 100%;
}

.sku-text {
	max-width: 100%;
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
}

// 按钮组
.btn-group {
	display: flex;
	justify-content: center;
	align-items: center;
	gap: 4px;
	height: 100%;
}

// 通用样式
.full-width {
	width: 100%;
}

.mb8 {
	margin-bottom: 8px;
}

.mb12 {
	margin-bottom: 12px;
}

.new-table :deep(.el-input__wrapper) {
	padding: 0 8px;
}

.customClass {
	color: #333333;
	margin-top: 4px;
}

.required-icon {
	color: red;
}
.add-demand-btn {
	text-align: left;
	padding: 16px 0;
}
</style>
