<!--
 * @Author: YIDA 3136271519@qq.com
 * @Date: 2025-09-24 15:55:59
 * @LastEditors: YIDA 3136271519@qq.com
 * @LastEditTime: 2026-02-06 13:37:36
 * @FilePath: \qianyi-ui\src\views\fbm\selfOrder\components\tableColumnHeader\header-order-action\index.vue
 * @Description: 
 * 
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved. 
-->
<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
	currentRow: {
		type: Object,
		default: () => ({}),
	},
});

// 订单类型枚举映射
const orderTypeMap: Record<string, string> = {
	STANDARD: '标准订单',
	SUPPLEMENT: '补单',
	EXCHANGE: '换货订单',
	CHANNELS_ORDER: '多渠道订单',
	LONG_LEAD_TIME: '长交货期订单',
	PRE: '预购订单',
	BACK: '缺货订单',
	SOURCING_ON_DEMAND: '按需采购订单',
	OTHER: '其他订单',
};

// 订单来源枚举映射
const orderFromMap: Record<number, string> = {
	1: '手工',
	2: '接口',
	3: '开放接口',
	4: '导入',
	5: '积加同步',
};

// 订单类型标签
const orderTypeLabel = computed(() => {
	const orderType = props.currentRow?.orderType;
	if (!orderType || typeof orderType !== 'string') return null;
	return orderTypeMap[orderType] || orderType;
});

// 订单来源标签
const orderFromLabel = computed(() => {
	const orderFrom = props.currentRow?.orderFrom;
	if (
		orderFrom === undefined ||
		orderFrom === null ||
		typeof orderFrom !== 'number'
	) {
		return null;
	}
	return orderFromMap[orderFrom] || null;
});
</script>
<template>
	<div class="component">
		<el-row class="row">
			<el-col :span="12" class="flex items-center justify-center">
				<el-tag v-if="orderTypeLabel" type="info" size="small">
					{{ orderTypeLabel }}
				</el-tag>
				<!-- <el-tag v-else type="info" size="small">暂无</el-tag> -->
			</el-col>
			<el-col :span="12" class="flex items-center justify-center">
				<el-tag v-if="orderFromLabel" type="info" size="small">
					{{ orderFromLabel }}
				</el-tag>
				<el-tag v-else type="info" size="small">未知来源</el-tag>
			</el-col>
		</el-row>
	</div>
</template>

<style scoped lang="scss">
.component {
	display: flex;
	gap: 8px;
	width: 100%;
	height: 100%;
	.row {
		width: 100%;
	}
}
</style>
