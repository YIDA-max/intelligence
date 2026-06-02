<template>
	<confirm-dialog
		ref="dialogRef"
		:title="title"
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
		<el-form ref="formRef" :inline="false" label-position="left" :rules="rules" :model="formData">
			<el-row class="mb18" v-if="props.type === '1' || props.type === '2'">
				<el-col :span="24">
					<el-form-item :label="props.type === '1' ? t('原中转仓') : props.type === '2' ? t('原目的仓') : ''">
						<span>{{
							props.type === '1' ? props.currentRow.transWarehouseName : props.type === '2' ? props.currentRow.destWarehouseNameList?.join(', ') : ''
						}}</span>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row class="mb18">
				<el-col :span="24">
					<el-form-item
						:label="props.type === '1' ? '新中转仓' : props.type === '2' ? '新目的仓' : props.type === '3' ? '新中转仓' : ''"
						prop="warehouseCode"
					>
						<el-select v-model="formData.warehouseCode" clearable filterable placeholder="三方仓">
							<el-option
								v-for="item in dictMap.warehouseList"
								:key="item.warehouseCode"
								:label="`${item.spName}-${item.warehouseName}`"
								:value="item.warehouseCode"
							/>
						</el-select>
					</el-form-item>
				</el-col>
			</el-row>
		</el-form>
	</confirm-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, defineProps, defineEmits, nextTick } from 'vue';
import ConfirmDialog, { IconType } from '/@/components/ConfirmDialog/index.vue';
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
const props = defineProps({
	// 基础配置
	width: {
		type: String,
		default: '500px',
	},
	// 图标配置
	showIcon: {
		type: Boolean,
		default: true,
	},
	iconType: {
		type: String as () => IconType,
		default: 'warning',
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
	// 当前的类型
	type: {
		type: String,
		default: '1', // 1 中转 2 目的 3 中转仓拆柜
	},
	// 字典数据
	dictMap: {
		type: Object,
		default: () => ({}),
	},
});

const emit = defineEmits(['cancel', 'confirm', 'closed', 'update:modelValue']);
const title = ref('变更中转仓');
// 表单数据
const formData = reactive<Record<string, any>>({});
const formRef = ref(null);
const dialogRef = ref<InstanceType<typeof ConfirmDialog> | null>(null);
const rules = reactive({
	warehouseCode: [{ required: true, message: '请选择仓库', trigger: 'change' }],
});
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
		// 根据类型设置标题
		if (props.type === '1') {
			title.value = '变更中转仓';
		} else if (props.type === '2') {
			title.value = '变更目的仓';
		} else if (props.type === '3') {
			title.value = '中转仓拆柜';
		} else {
			title.value = '操作';
		}
	});
};

/**
 * 取消操作处理函数
 */
const handleCancel = () => {
	emit('cancel', { ...formData });
};

/**
 * 确认操作处理函数
 */
const handleConfirm = () => {
	emit('confirm', { ...formData });
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
