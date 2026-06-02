<!--
 * @Author: YIDA 3136271519@qq.com
 * @Date: 2025-08-08 17:44:33
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2026-01-12 15:28:00
 * @FilePath: \qianyi-ui\src\components\TableFormModule\advanced-search-style.vue
 * @Description: 
 * 
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved. 
-->
<!-- advanced-search-style.vue -->
<script setup lang="ts">
import { ref, useSlots, computed } from 'vue';
import { ArrowDown, ArrowUp } from '@element-plus/icons-vue';

defineProps({
	showRightBtn: {
		type: Boolean,
		default: false,
	},
});

const emit = defineEmits(['search', 'reset']);

const slots = useSlots();

const showSecond = ref(false);
const changeSecondToggle = () => {
	showSecond.value = !showSecond.value;
};

// 判断默认插槽是否有内容
const hasSecondSlot = computed(() => {
	// 检查 slots.second 是否存在
	if (slots.second) {
		// 调用 slots.second() 获取 VNode 数组，然后检查数组长度
		const vnodes = slots.second();
		return vnodes.length > 0;
	}
	return false;
});

const handleSearch = () => {
	emit('search');
};

const handleReset = () => {
	emit('reset');
};

defineExpose({ showSecond, changeSecondToggle });
</script>

<template>
	<div class="slot-container">
		<!-- 左边的内容 -->
		<div class="left-content">
			<div class="content-item">
				<slot name="default" />
			</div>
			<div v-show="showSecond" class="content-item">
				<slot name="second" />
			</div>
			<div class="mb-2 splitLine" v-if="hasSecondSlot">
				<el-link
					@click="changeSecondToggle"
					:icon="showSecond ? ArrowUp : ArrowDown"
					type="primary"
					underline="never"
				>
					{{ showSecond ? '收起' : '展开' }}
				</el-link>
			</div>
		</div>

		<!-- 右边的内容操作插槽（要求永远贴顶） -->
		<div class="right-content">
			<el-form-item v-if="showRightBtn">
				<div class="flex item-center">
					<el-button @click="handleSearch" type="primary"
						>{{ $t('搜索') }}
					</el-button>
					<el-button pa @click="handleReset" type="info" plain
						>{{ $t('重置') }}
					</el-button>
				</div>
			</el-form-item>
			<slot name="right" />
		</div>
	</div>
</template>

<style lang="scss" scoped>
.slot-container {
	display: flex;
	justify-content: space-between;
	align-items: flex-start; // ← 从 center 改为 flex-start，整体贴顶
	width: 100%;

	.left-content {
		display: flex;
		flex-wrap: wrap;
		flex: 1; // 左侧内容占满剩余空间
		.content-item {
			// padding: 8px;
		}
	}

	.right-content {
		display: flex;
		align-items: center;
		gap: 10px;
		align-self: flex-start; // ← 双保险：右侧单独也始终贴顶
	}
	.splitLine {
		width: 100%;
		border-bottom: 1px solid #e8e8e8;
		// margin: 8px 0;
		display: flex;
		justify-content: center;
		align-items: center;
		button {
			background-color: #fff;
			border: none;
			cursor: pointer;
			padding: 0 10px;
			font-size: 14px;
			color: #1890ff;
		}
	}
}
</style>
