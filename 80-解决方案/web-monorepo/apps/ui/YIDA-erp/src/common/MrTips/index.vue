<template>
	<span class="mr-tips">
		<slot>
			<template v-if="!required">
				{{ label }}
			</template>
			<template v-else>
				<span class="text-red">*</span>
				<span>{{ label }}</span>
			</template>
		</slot>
		<el-tooltip v-if="tips" :effect="effect" :placement="placement" :content="tips">
			<el-icon :size="iconSize" :color="iconColor" class="mr-tips-icon">
				<QuestionFilled />
			</el-icon>
		</el-tooltip>
	</span>
</template>

<script setup lang="ts">
import { QuestionFilled } from '@element-plus/icons-vue';

/**
 * MrTips 组件
 * 基于表格表头的问号提示组件
 * 
 * 功能特点：
 * 1. 支持显示标签文本
 * 2. 支持必填标记（红色*号）
 * 3. 支持 tooltip 提示信息
 * 4. 使用 Element Plus 的问号图标
 * 5. 支持自定义插槽
 * 
 * 使用场景：
 * - 表格表头提示
 * - 表单标签提示
 * - 任何需要附加说明的文本标签
 */

interface Props {
	/** 显示的标签文本 */
	label?: string | number;
	/** 提示信息内容 */
	tips?: string;
	/** 图标大小 */
	iconSize?: string | number;
	/** 图标颜色 */
	iconColor?: string;
	/** 是否必填（显示红色*号） */
	required?: boolean;
	/** Tooltip 效果类型 */
	effect?: 'dark' | 'light';
	/** Tooltip 出现位置 */
	placement?:
		| 'top'
		| 'top-start'
		| 'top-end'
		| 'bottom'
		| 'bottom-start'
		| 'bottom-end'
		| 'left'
		| 'left-start'
		| 'left-end'
		| 'right'
		| 'right-start'
		| 'right-end';
}

const props = withDefaults(defineProps<Props>(), {
	label: '',
	tips: '',
	iconSize: 14,
	iconColor: '#909399',
	required: false,
	effect: 'dark',
	placement: 'top',
});
</script>

<style scoped lang="scss">
.mr-tips {
	display: inline-flex;
	align-items: center;
	gap: 4px;

	.text-red {
		color: #f56c6c;
		margin-right: 2px;
	}

	.mr-tips-icon {
		cursor: pointer;
		vertical-align: middle;
		transition: color 0.3s;

		&:hover {
			color: #409eff;
		}
	}
}
</style>

