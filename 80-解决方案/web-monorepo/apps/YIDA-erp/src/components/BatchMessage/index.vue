<script setup lang="ts">
import { computed } from 'vue';
import { useMessage } from '/@/hooks/message';

defineOptions({
	name: 'BatchMessage',
});

/**
 * 批量填写弹出层组件参数
 * 兼容场景：
 * 1. 文本/多行文本批量填写（如备注、原因）
 * 2. 数值批量填写（如数量）
 */
interface IBatchMessageProps {
	/** 标题 */
	title?: string;
	/** 触发入口文案 */
	linkText?: string;
	/** 输入类型 */
	inputType?: 'text' | 'textarea' | 'number';
	/** 输入占位符 */
	placeholder?: string;
	/** 弹层宽度 */
	width?: number;
	/** 弹层位置 */
	placement?: 'top' | 'bottom' | 'left' | 'right';
	/** textarea 行数 */
	rows?: number;
	/** 非 number 时最大长度 */
	maxlength?: number;
	/** number 最小值 */
	min?: number;
	/** number 最大值 */
	max?: number;
	/** number 步长 */
	step?: number;
	/** number 精度 */
	precision?: number;
	/** 点击入口时是否清空当前值 */
	clearOnOpen?: boolean;
	/** 确认前是否校验非空 */
	validateRequired?: boolean;
	/** 非空校验提示语 */
	requiredMessage?: string;
}

const props = withDefaults(defineProps<IBatchMessageProps>(), {
	title: '批量填写',
	linkText: '批量填写',
	inputType: 'textarea',
	placeholder: '请输入内容',
	width: 320,
	placement: 'right',
	rows: 4,
	maxlength: 1000,
	min: undefined,
	max: undefined,
	step: 1,
	precision: 0,
	clearOnOpen: true,
	validateRequired: false,
	requiredMessage: '请输入内容',
});

const emit = defineEmits<{
	/** 点击确认后抛出填写值 */
	(e: 'submit', value: string | number | null): void;
	/** 点击入口时触发，便于父级做初始化 */
	(e: 'init'): void;
	/** 点击取消时触发 */
	(e: 'cancel'): void;
}>();

const msg = useMessage();
const visible = ref(false);
const inputValue = ref<string | number | null>('');

/**
 * 使用默认值优化 placeholder 文案体验
 */
const currentPlaceholder = computed(() => {
	if (props.placeholder) return props.placeholder;
	return props.inputType === 'number' ? '请输入数值' : '请输入内容';
});

/**
 * 打开弹层
 */
const init = () => {
	visible.value = true;
	if (props.clearOnOpen) {
		inputValue.value = props.inputType === 'number' ? null : '';
	}
	emit('init');
};

/**
 * 取消填写
 */
const cancel = () => {
	visible.value = false;
	emit('cancel');
};

/**
 * 是否为“空值”
 */
const isEmptyValue = (value: unknown) => {
	return value === '' || value === null || value === undefined;
};

/**
 * 提交填写值
 */
const submit = () => {
	if (props.validateRequired && isEmptyValue(inputValue.value)) {
		msg.warning(props.requiredMessage);
		return;
	}

	emit('submit', inputValue.value);
	visible.value = false;
};
</script>

<template>
	<el-popover
		:placement="props.placement"
		trigger="click"
		:visible="visible"
		:width="props.width"
	>
		<template #default>
			<el-row class="mb-2">
				<div>
					<strong>{{ props.title }}</strong>
				</div>
			</el-row>
			<el-row class="mb-2">
				<!-- 外部可通过插槽自定义输入区；未传入时走内置输入组件 -->
				<template v-if="$slots.input">
					<slot name="input" :inputValue="inputValue" />
				</template>
				<el-input-number
					v-else-if="props.inputType === 'number'"
					v-model="inputValue"
					:min="props.min"
					:max="props.max"
					:step="props.step"
					:precision="props.precision"
					:placeholder="currentPlaceholder"
					controls-position="right"
					style="width: 100%"
				/>
				<el-input
					v-else
					v-model="inputValue"
					:type="props.inputType"
					:rows="props.inputType === 'textarea' ? props.rows : undefined"
					:placeholder="currentPlaceholder"
					:maxlength="props.maxlength"
				/>
			</el-row>
			<el-row class="flex" style="justify-content: flex-end; gap: 8px">
				<el-button @click="cancel">取消</el-button>
				<el-button type="primary" @click="submit">确定</el-button>
			</el-row>
		</template>
		<template #reference>
			<span>
				<el-link underline="never" type="primary" @click="init">
					{{ props.linkText }}
				</el-link>
			</span>
		</template>
	</el-popover>
</template>
