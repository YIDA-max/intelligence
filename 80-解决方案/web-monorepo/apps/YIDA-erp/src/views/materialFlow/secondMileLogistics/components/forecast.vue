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
					:data="tableData || []"
					border
					height="300"
					style="width: 100%"
					native-scrollbar
				>
					<el-table-column
						label="调拨单号"
						prop="secondMileNo"
						width="160"
						show-overflow-tooltip
					>
						<template #default="{ row }">
							{{ row.secondMileNo || '-' }}
						</template>
					</el-table-column>
					<el-table-column
						prop="destWarehouseName"
						label="调入仓"
						width="200"
						show-overflow-tooltip
					>
						<template #default="{ row }">
							{{ row.destWarehouseName || '--' }}
						</template>
					</el-table-column>
					<el-table-column
						prop="containerType"
						label="货柜类型"
						width="200"
						show-overflow-tooltip
					>
						<template #default="{ row }">
							{{ row.containerTypeText || '--' }}
						</template>
					</el-table-column>
					<el-table-column
						prop="estimateDeliveryTime"
						label="预计发货时间"
						width="200"
						show-overflow-tooltip
					>
						<template #header>
							预计发货时间
							<el-tooltip
								effect="dark"
								content="调入仓属于新欧达/谷仓/环世时必填"
								placement="top"
							>
								<el-icon color="#a8abb2"><QuestionFilled /></el-icon>
							</el-tooltip>
						</template>
						<template #default="{ row }">
							<el-date-picker
								v-model="row.estimateDeliveryTime"
								clearable
								type="datetime"
								value-format="YYYY-MM-DD HH:mm:ss"
								placeholder="年/月/日"
							/>
						</template>
					</el-table-column>
					<el-table-column
						prop="estimateArrivalTime"
						label="预计送达时间"
						width="200"
						show-overflow-tooltip
					>
						<template #header>
							预计送达时间
							<el-tooltip
								effect="dark"
								content="调入仓属于新欧达/谷仓/环世/SLM时必填"
								placement="top"
							>
								<el-icon color="#a8abb2"><QuestionFilled /></el-icon>
							</el-tooltip>
						</template>
						<template #default="{ row }">
							<el-date-picker
								v-model="row.estimateArrivalTime"
								clearable
								type="datetime"
								value-format="YYYY-MM-DD HH:mm:ss"
								placeholder="年/月/日"
							/>
						</template>
					</el-table-column>
					<el-table-column
						prop="palletQuantity"
						label="打托数量"
						width="160"
						show-overflow-tooltip
					>
						<template #header>
							打托数量
							<el-tooltip
								effect="dark"
								content="调入仓属于义达/华贸/品晟时必填"
								placement="top"
							>
								<el-icon color="#a8abb2"><QuestionFilled /></el-icon>
							</el-tooltip>
						</template>
						<template #default="{ row }">
							<el-input
								v-model="row.palletQuantity"
								placeholder="请输入"
								clearable
							/>
						</template>
					</el-table-column>
				</el-table>
			</el-col>
		</el-row>
	</confirm-dialog>
</template>

<script setup lang="ts">
import { ref, nextTick, type PropType } from 'vue';
import ConfirmDialog, { IconType } from '/@/components/ConfirmDialog/index.vue';
import { useMessage } from '/@/hooks/message';
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
	selectedRows: {
		type: Array as PropType<forecastArr[]>,
		default: () => [],
	},
	dialogArray: {
		type: Array,
		default: () => [],
	},
});

interface forecastArr {
	id: string | number;
	firstMileNo: string;
	estimateDeliveryTime: string;
	estimateArrivalTime: string;
	palletQuantity?: number | null;
}
const emit = defineEmits(['c', 'confirm', 'closed', 'update:modelValue']);
const title = ref('确认入库');
// 表单数据
const dialogRef = ref<InstanceType<typeof ConfirmDialog> | null>(null);
const tableData = ref<forecastArr[]>([]);
// 初始化表单数据
const initFormData = () => {
	// 获取需要展示的ID集合（只有在 dialogArray 中的数据才展示）
	const targetIds = new Set(props.dialogArray.map((item: any) => item.id));
	// 过滤 selectedRows，只保留在 dialogArray 中的数据
	tableData.value = (props.selectedRows || []).filter((item: any) =>
		targetIds.has(item.id)
	);
};

/**
 * 弹窗打开时的处理函数
 * 确保数据被正确初始化
 */
const handleOpened = () => {
	// 弹窗完全打开后，确保数据初始化
	nextTick(() => {
		initFormData();
		title.value = '入库预报';
	});
};
/**
 * 取消操作处理函数
 */
/**
 * 取消操作处理函数
 * 触发 closed 事件，通知父组件关闭弹窗
 */
const handleCancel = () => {
	emit('closed');
};
const handleConfirm = () => {
	// 所有校验通过后触发确认事件
	// 将 dialogArray 转为 Map 以提高查找效率
	const dialogMap = new Map(
		props.dialogArray.map((item: any) => [item.id, item])
	);
	for (let i = 0; i < tableData.value.length; i++) {
		const row = tableData.value[i];
		// 校验规则：新欧达/谷仓/华贸/品晟/义达 需要填入库预报相关信息
		if (dialogMap.has(row.id)) {
			const targetData = dialogMap.get(row.id);
			const spCode = targetData?.spCode || '';

			// 调入仓属于新欧达/谷仓/环世，预计发货时间和预计送达时间必填
			if (spCode === 'NOD' || spCode === 'GC' || spCode === 'HUANSHI') {
				if (!row.estimateDeliveryTime) {
					useMessage().error(`第${i + 1}行预计发货时间必填`);
					return false;
				}
				if (!row.estimateArrivalTime) {
					useMessage().error(`第${i + 1}行预计送达时间必填`);
					return false;
				}
			}
			// 调入仓属于SLM，预计发货时间和预计送达时间必填
			if (spCode === 'SLM') {
				if (!row.estimateArrivalTime) {
					useMessage().error(`第${i + 1}行预计送达时间必填`);
					return false;
				}
			}
			// 调入仓属于义达/华贸/品晟时必填，打托数量必填，打托数量限制为正整数
			if (spCode === 'ECCANG') {
				if (!row.palletQuantity) {
					useMessage().error(`第${i + 1}行打托数量必填`);
					return false;
				}
				if (!/^[1-9]\d*$/.test(String(row.palletQuantity))) {
					useMessage().error(`第${i + 1}行打托数量必须为正整数`);
					return false;
				}
			}
		}
	}
	tableData.value.forEach((item) => {
		item.palletQuantity = item.palletQuantity
			? Number(item.palletQuantity)
			: null;
	});
	emit('confirm', JSON.parse(JSON.stringify(tableData.value)));
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
