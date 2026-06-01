<template>
	<confirm-dialog
		ref="dialogRef"
		:title="props.title"
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
		<el-form :model="formData" ref="formRef" label-width="100px">
			<el-row class="mb18">
				<el-col :span="12">
					<el-form-item label="订柜号" prop="bookingNo">
						<el-select
							clearable
							filterable
							v-model="formData.bookingNo"
							placeholder="订柜号"
							@change="handleChange"
						>
							<el-option
								v-for="item in dictMap.bookingNo || []"
								:key="item"
								:label="item"
								:value="item"
							/>
						</el-select>
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="运输方式" prop="transportMethodText">
						{{ formData.transportMethodText }}
					</el-form-item>
				</el-col>
			</el-row>
			<el-row class="mb18">
				<el-col :span="12">
					<el-form-item label="起运国" prop="startCountryText">
						{{ formData.startCountryText }}
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="目的国" prop="destCountryText">
						{{ formData.destCountryText }}
					</el-form-item>
				</el-col>
			</el-row>
			<el-row class="mb18">
				<el-col :span="12">
					<el-form-item label="起运港" prop="startPortText">
						{{ formData.startPortText }}
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="目的港" prop="destPortText">
						{{ formData.destPortText }}
					</el-form-item>
				</el-col>
			</el-row>
			<el-row class="mb18">
				<el-col :span="24">
					<el-form-item label="总体数据">
						<el-text type="danger">
							发货计划总体积: {{ showTotalData.totalVolume }} m³, 总净重:
							{{ showTotalData.totalNetWeight }} KG, 总毛重:
							{{ showTotalData.totalGrossWeight }} KG, 总箱数:
							{{ showTotalData.containerTotalCartonQuantity }} 箱, 总数量:
							{{ showTotalData.containerTotalQuantity }} 件
						</el-text>
					</el-form-item>
				</el-col>
			</el-row>
		</el-form>
	</confirm-dialog>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue';
import ConfirmDialog, { IconType } from '/@/components/ConfirmDialog/index.vue';
import { postAddContainerView } from '/@/api/materialFlow/lclRecommend/index';
import { useMultipleDicts } from '/@/hooks/multipleDicts';
import { getSelectBookingNos } from '/@/api/materialFlow/lclRecommend/index';
const dialogRef = ref<InstanceType<typeof ConfirmDialog> | null>(null);
const { dictMap, reload } = useMultipleDicts(
	[
		{
			key: 'bookingNo',
			fetchFn: getSelectBookingNos,
		}, // 查询所有的货柜号
	],
	{
		isAuto: true,
		tableRef: dialogRef,
	}
);

const props = defineProps({
	// 基础配置
	title: {
		type: String,
		default: '加入货柜',
	},
	message: {
		type: String,
		default: '',
	},
	width: {
		type: String,
		default: '800px',
	},
	// 图标配置
	showIcon: {
		type: Boolean,
		default: false,
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
	// 当前选中的行
	selectedRows: {
		type: Array,
		default: () => [],
	},
});

const emit = defineEmits(['cancel', 'confirm', 'closed', 'update:modelValue']);

// 表单数据
const formData = ref<Record<string, any>>({});
const formRef = ref(null);

// 计算的总数据
const showTotalData = ref({
	totalVolume: 0, // 总体积
	totalNetWeight: 0, // 总净重
	totalGrossWeight: 0, // 总毛重
	containerTotalCartonQuantity: 0, // 总箱数
	containerTotalQuantity: 0, // 总数量
});
// 初始化表单数据
const initFormData = () => {
	// 清空之前的数据
	Object.keys(formData.value).forEach((key) => {
		delete formData.value[key];
	});
};

/**
 * 弹窗打开时的处理函数
 * 确保数据被正确初始化
 */
const handleOpened = () => {
	// 弹窗完全打开后，确保数据初始化
	nextTick(async () => {
		initFormData();
		// 重新获取字典数据
		await reload();
		// 清空计算的总数据
		showTotalData.value = {
			totalVolume: 0, // 总体积
			totalNetWeight: 0, // 总净重
			totalGrossWeight: 0, // 总毛重
			containerTotalCartonQuantity: 0, // 总箱数
			containerTotalQuantity: 0, // 总数量
		};
	});
};

/**
 * 订柜号改变时的处理函数
 */
const handleChange = async (value: string) => {
	if (!value) {
		// 清空数据
		showTotalData.value = {
			totalVolume: 0, // 总体积
			totalNetWeight: 0, // 总净重
			totalGrossWeight: 0, // 总毛重
			containerTotalCartonQuantity: 0, // 总箱数
			containerTotalQuantity: 0, // 总数量
		};
		formData.value = {};
		return;
	}
	const res = await postAddContainerView({
		bookingNo: value,
		deliveryNos: props.selectedRows?.map((item: any) => item.deliveryNo),
	});
	if (res.code === 0) {
		// 赋值计算的总数据
		showTotalData.value = {
			...res.data,
		};
		// 赋值表单数据
		formData.value = {
			...res.data,
		};
		formData.value.bookingNo = value;
	} else {
		// 清空数据
		showTotalData.value = {
			totalVolume: 0, // 总体积
			totalNetWeight: 0, // 总净重
			totalGrossWeight: 0, // 总毛重
			containerTotalCartonQuantity: 0, // 总箱数
			containerTotalQuantity: 0, // 总数量
		};
		formData.value = {};
	}
};

/**
 * 取消操作处理函数
 */
const handleCancel = () => {
	emit('cancel', { ...formData.value });
};

/**
 * 确认操作处理函数
 */
const handleConfirm = () => {
	emit('confirm', { ...formData.value });
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
