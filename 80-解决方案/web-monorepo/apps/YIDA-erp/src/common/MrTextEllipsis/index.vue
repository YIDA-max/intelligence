<!--
 * @Author: YIDA 3136271519@qq.com
 * @Date: 2026-01-29 18:00:00
 * @LastEditors: wuyueqin wuyueqin@merach.com
 * @LastEditTime: 2026-03-27 10:27:02
 * @FilePath: \qianyi-ui\src\common\MrTextEllipsis\index.vue
 * @Description: 文本截断组件，超过指定长度显示省略号并支持 tooltip
 * 
 * Copyright (c) 2026 by ${git_name_email}, All Rights Reserved. 
-->
<template>
	<el-tooltip
		:disabled="isDisabled || !text"
		:content="String(text || '')"
		:placement="placement"
	>
		<template #content>
			<div class="show-text-content">{{ text }}</div>
		</template>
		<span
			:class="['text-ellipsis-container', { 'css-ellipsis': maxLength === 0 }]"
			@mouseenter="checkOverflow"
		>
			<span
				:class="['text-ellipsis-content', { 'css-ellipsis': maxLength === 0 }]"
				ref="textRef"
			>
				{{ truncateText(text, maxLength) }}
			</span>
		</span>
	</el-tooltip>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

defineOptions({
	name: 'MrTextEllipsis',
});

interface Props {
	/** 文本内容 */
	text?: string | number | null;
	/**
	 * 最大长度（字符数）。
	 * - maxLength > 0： 硬截断
	 *   - 文本 < maxLength：完全显示，可换行，不受容器限制
	 *   - 文本 > maxLength：截断 + ...，显示 Tooltip
	 * - maxLength = 0：CSS 动态截断，根据容器宽度调整
	 */
	maxLength?: number;
	/** tooltip 位置 */
	placement?: 'top' | 'bottom' | 'left' | 'right';
	/** 空值时的显示文本 */
	emptyText?: string;
}

const props = withDefaults(defineProps<Props>(), {
	text: '',
	maxLength: 0,
	placement: 'top',
	emptyText: '无',
});

const textRef = ref<HTMLElement | null>(null);
const isDisabled = ref(true);

/**
 * 截断文本，超过指定长度显示省略号
 */
const truncateText = (
	text: string | number | null | undefined,
	maxLength: number
): string => {
	if (!text) return props.emptyText;
	const textStr = String(text);

	// 当 maxLength > 0 时，进行硬截断
	if (maxLength > 0 && textStr.length > maxLength) {
		return textStr.substring(0, maxLength) + '...';
	}

	// 其他情况：返回原文本，由 CSS 截断处理
	return textStr;
};

/**
 * 鼠标悬浮时检测是否需要显示 Tooltip
 *
 * 两种模式：
 * 1. maxLength > 0：根据文本长度是否超过 maxLength 判断
 * 2. maxLength = 0：根据 CSS 宽度截断判断
 */
const checkOverflow = () => {
	const textStr = String(props.text || '');

	// 模式 1：maxLength > 0（JS 硬截断模式）
	if (props.maxLength > 0) {
		// 文本超过 maxLength → 显示 Tooltip
		if (textStr.length > props.maxLength) {
			isDisabled.value = false;
			return;
		}
		// 文本未超过 maxLength → 全部显示 → 不显示 Tooltip
		isDisabled.value = true;
		return;
	}

	// 模式 2：maxLength = 0（CSS 动态宽度模式）
	// 检测 CSS 宽度是否截断
	if (textRef.value) {
		isDisabled.value = textRef.value.clientWidth >= textRef.value.scrollWidth;
	}
};

onMounted(() => {
	checkOverflow();
});
</script>

<style lang="scss" scoped>
// 默认样式：maxLength > 0 时（文本不受容器限制，可完全显示和换行）
.text-ellipsis-container {
	display: inline;
	width: auto;
	max-width: none;
	overflow: visible;
	vertical-align: top;
	align-items: unset;
}

.text-ellipsis-content {
	display: inline;
	max-width: none;
	overflow: visible;
	white-space: normal;
	text-overflow: unset;
	cursor: pointer;
	min-width: auto;
	flex: none;
	word-break: break-word;
}

// CSS 动态截断样式：maxLength = 0 时
.text-ellipsis-container.css-ellipsis {
	display: inline-flex;
	width: 100%;
	max-width: 100%;
	vertical-align: middle;
	align-items: center;
	overflow: hidden;
	min-width: 0;
}

.text-ellipsis-content.css-ellipsis {
	display: inline-block;
	max-width: 100%;
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
	cursor: pointer;
	min-width: 0;
	flex: 1;
}

// Tooltip 内容样式
.show-text-content {
	max-width: 1000px !important;
	max-height: 400px !important; /* 最大高度，按需调整 */
	overflow: auto !important; /* overflow:auto 仅在内容超出时显示滚动条 */
	box-sizing: border-box !important;
	white-space: pre-wrap !important;
	padding: 6px 10px !important; /* 让内容不贴边 */
}
</style>
