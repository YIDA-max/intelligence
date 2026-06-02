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
		<el-form :model="formData" ref="formRef" label-width="100px" :rules="rules">
			<el-row class="mb18">
				<el-col :span="24">
					<el-form-item label="总体数据">
						<el-text type="danger">
							发货计划总体积: {{ showTotalData.containerTotalVolume }} m³,
							总净重: {{ showTotalData.containerTotalNetWeight }} KG, 总毛重:
							{{ showTotalData.containerTotalGrossWeight }} KG, 总箱数:
							{{ showTotalData.containerTotalCartonQuantity }} 箱, 总数量:
							{{ showTotalData.containerTotalQuantity }} 件
						</el-text>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row class="mb18">
				<el-col :span="12">
					<el-form-item label="发货方式" prop="shippingMethodText">
						{{ formData.shippingMethodText }}
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="运输方式" prop="transportMethod">
						<el-select
							clearable
							filterable
							v-model="formData.transportMethod"
							placeholder="运输方式"
						>
							<el-option
								v-for="item in dictMap.transportMethod"
								:key="item.value"
								:label="item.label"
								:value="item.value"
							/>
						</el-select>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row class="mb18">
				<el-col :span="12">
					<el-form-item label="起运国" prop="startCountryCode">
						{{ formData.startCountryCode }} - {{ formData.startCountryText }}
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="目的国" prop="destCountryCode">
						{{ formData.destCountryCode }} - {{ formData.destCountryText }}
					</el-form-item>
				</el-col>
			</el-row>
			<el-row class="mb18">
				<el-col :span="12">
					<el-form-item label="起运港" prop="startPortCode">
						<el-select
							clearable
							filterable
							ultiple
							v-model="formData.startPortCode"
							placeholder="起运港"
						>
							<el-option
								v-for="item in props.dictMap.listByCondition"
								:key="item.portCode"
								:label="`${item.portCode}-${item.portName}`"
								:value="item.portCode"
							/>
						</el-select>
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="目的港" prop="destPortCode">
						<el-select
							clearable
							filterable
							v-model="formData.destPortCode"
							placeholder="目的港"
						>
							<el-option
								v-for="item in props.dictMap.listByCondition"
								:key="item.portCode"
								:label="`${item.portCode}-${item.portName}`"
								:value="item.portCode"
							/>
						</el-select>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row class="mb18">
				<el-col :span="24">
					<el-form-item label="备注" prop="remark">
						<el-input
							v-model="formData.remark"
							type="textarea"
							placeholder="请输入备注"
						/>
					</el-form-item>
				</el-col>
			</el-row>
		</el-form>
	</confirm-dialog>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue';
import ConfirmDialog, { IconType } from '/@/components/ConfirmDialog/index.vue';
import { postOrderContainerReCreateOrderContainer } from '/@/api/materialFlow/deliveryPlan/index';
const props = defineProps({
	// 基础配置
	title: {
		type: String,
		default: '创建货柜',
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
	// 字典数据
	dictMap: {
		type: Object,
		default: () => ({}),
	},
});

const emit = defineEmits(['cancel', 'confirm', 'closed', 'update:modelValue']);

// 表单数据
const formData = ref<Record<string, any>>({});
const formRef = ref<any>(null);
// 表单校验
const rules = ref({
	transportMethod: [
		{ required: true, message: '运输方式不能为空', trigger: 'change' },
	],
	startPortCode: [
		{ required: true, message: '起运港不能为空', trigger: 'change' },
	],
	destPortCode: [
		{ required: true, message: '目的港不能为空', trigger: 'change' },
	],
});
const dialogRef = ref<InstanceType<typeof ConfirmDialog> | null>(null);
// 计算的总数据
const showTotalData = ref({
	containerTotalVolume: 0, // 总体积
	containerTotalNetWeight: 0, // 总净重
	containerTotalGrossWeight: 0, // 总毛重
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
		// 调用接口拿到计算的总数据
		const res = await postOrderContainerReCreateOrderContainer({
			ids: props.selectedRows?.map((item: any) => item.id) || [],
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
		}
		await new Promise((resolve) => setTimeout(resolve, 10));
		// 清空表单的校验结果
		if (formRef.value) {
			formRef.value.clearValidate();
		}
	});
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
const handleConfirm = async () => {
	// 删除不需要提交的字段
	delete formData.value.startPortText;
	delete formData.value.transportMethodText;
	delete formData.value.destPortText;
	await formRef.value.validate();
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
