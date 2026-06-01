<template>
	<el-popover
		:placement="placement"
		:width="width"
		:trigger="trigger"
		:hide-on-click="false"
		v-model:visible="popoverVisible"
	>
		<template #reference>
			<el-button class="popover-title" link type="primary" size="small">{{
				buttonText
			}}</el-button>
		</template>
		<div class="batch-popover">
			<!-- 下拉选择器 -->
			<el-select
				v-if="type === 'select'"
				v-model="tempValue"
				:placeholder="placeholder"
				clearable
				filterable
				style="width: 100%"
				:teleported="false"
			>
				<el-option
					v-for="item in options"
					:key="getOptionValue(item)"
					:label="getOptionLabel(item)"
					:value="getOptionValue(item)"
				/>
			</el-select>

			<!-- 输入框 -->
			<el-input
				v-else-if="type === 'input'"
				v-model="tempValue"
				:teleported="false"
				:placeholder="placeholder"
				clearable
				style="width: 100%"
			/>

			<!-- 数字输入框 -->
			<el-input-number
				v-else-if="type === 'number'"
				v-model="tempValue"
				:placeholder="placeholder"
				:teleported="false"
				:precision="precision"
				:min="min"
				:max="max"
				controls-position="right"
				style="width: 100%"
			/>

			<!-- 日期选择器 -->
			<el-date-picker
				v-else-if="type === 'date'"
				v-model="tempValue"
				:teleported="false"
				:type="dateType"
				:placeholder="placeholder"
				style="width: 100%"
			/>

			<!-- 操作按钮 -->
			<div class="batch-actions">
				<el-button size="small" @click="handleCancel">取消</el-button>
				<el-button size="small" type="primary" @click="handleConfirm">
					确认
				</el-button>
			</div>
		</div>
	</el-popover>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useMessage } from '/@/hooks/message';

defineOptions({ name: 'BatchPopover' });
/**
 * 批量操作 Popover 组件属性
 */
interface BatchPopoverProps {
	buttonText?: string;
	/** 组件类型：select-下拉选择，input-输入框，number-数字输入框，date-日期选择器 */
	type?: 'select' | 'input' | 'number' | 'date';
	/** 下拉选项数据（type 为 select 时必填） */
	options?: any[];
	/** 选项的 label 字段名，默认为 'label' */
	labelKey?: string;
	/** 选项的 value 字段名，默认为 'value' */
	valueKey?: string;
	/** 占位符文本 */
	placeholder?: string;
	/** Popover 弹出位置 */
	placement?: 'top' | 'bottom' | 'left' | 'right';
	/** Popover 宽度 */
	width?: number;
	/** 触发方式 */
	trigger?: 'click' | 'hover' | 'focus';
	/** 数字输入框的精度（小数位数） */
	precision?: number;
	/** 数字输入框的最小值 */
	min?: number;
	/** 数字输入框的最大值 */
	max?: number;
	/** 日期选择器类型 */
	dateType?: 'date' | 'datetime' | 'daterange' | 'datetimerange';
	/** 是否在确认前进行校验 */
	validateBeforeConfirm?: boolean;
	/** 自定义校验函数 */
	validator?: (value: any) => boolean | string;
}

const props = withDefaults(defineProps<BatchPopoverProps>(), {
	buttonText: '批量',
	type: 'select',
	options: () => [],
	labelKey: 'label',
	valueKey: 'value',
	placeholder: '请选择',
	placement: 'bottom',
	width: 200,
	trigger: 'click',
	precision: 0,
	dateType: 'date',
	validateBeforeConfirm: true,
});

const emit = defineEmits<{
	/** 确认事件，返回选中的值 */
	confirm: [value: any];
	/** 取消事件 */
	cancel: [];
}>();

const msg = useMessage();

// Popover 显示状态
const popoverVisible = ref(false);
// 临时存储的值
const tempValue = ref<any>('');

/**
 * 获取选项的 label
 */
const getOptionLabel = (item: any) => {
	if (typeof item === 'object') {
		return item[props.labelKey];
	}
	return item;
};

/**
 * 获取选项的 value
 */
const getOptionValue = (item: any) => {
	if (typeof item === 'object') {
		return item[props.valueKey];
	}
	return item;
};

/**
 * 校验输入值
 */
const validateValue = (): boolean => {
	if (!props.validateBeforeConfirm) {
		return true;
	}

	// 检查是否为空
	if (
		tempValue.value === '' ||
		tempValue.value === null ||
		tempValue.value === undefined
	) {
		msg.warning('请输入或选择要批量设置的值');
		return false;
	}

	// 自定义校验
	if (props.validator) {
		const result = props.validator(tempValue.value);
		if (result === false) {
			msg.warning('输入值不符合要求');
			return false;
		}
		if (typeof result === 'string') {
			msg.warning(result);
			return false;
		}
	}

	return true;
};

/**
 * 确认批量设置
 */
const handleConfirm = () => {
	// 校验
	if (!validateValue()) {
		return;
	}

	// 触发确认事件
	emit('confirm', tempValue.value);

	msg.success('批量设置成功');
	// 关闭 Popover
	handleCancel();
};

/**
 * 取消批量设置
 */
const handleCancel = () => {
	// 清空临时值
	tempValue.value = '';
	// 关闭 Popover
	popoverVisible.value = false;

	// 触发取消事件
	emit('cancel');
};
</script>

<style lang="scss" scoped>
.batch-popover {
	padding: 8px 0;

	.batch-actions {
		display: flex;
		justify-content: flex-end;
		gap: 8px;
		margin-top: 12px;
	}
}
.popover-title {
	margin-left: 10px;
}
</style>
