<!--
 * @Author: YIDA 3136271519@qq.com
 * @Date: 2025-09-26 14:00:50
 * @LastEditors: YIDA 3136271519@qq.com
 * @LastEditTime: 2026-01-06 10:22:10
 * @FilePath: \qianyi-ui\src\views\fbm\selfOrder\components\info\components\progressBar\index.vue
 * @Description: 
 * 
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved. 
-->

<script setup lang="ts">
import { computed, inject, ref, unref, watch } from 'vue';

const active = ref(1);
const currentRow = inject<any>('currentRow');
const row = computed(() => unref(currentRow) || {});

// 创建时间  createTime
// 审核时间  reviewTime
// 物流下单时间  shipOrderTime
// 发货中时间  pushWareTime
// 已发货  shippingTime
// 取消时间  cancelTime（接口若无该字段则为空）
const stepList = [
	{ label: '创建', value: 'createTime' },
	{ label: '审核', value: 'reviewTime' },
	{ label: '物流下单', value: 'shipOrderTime' },
	{ label: '发货中', value: 'pushWareTime' },
	{ label: '已发货', value: 'shippingTime' },
	{ label: '取消', value: 'cancelTime' },
];

// 监听 currentRow 的变化，更新 active 的值（自发货详情页展示逻辑）
watch(
	() => row.value,
	(newRow: any) => {
		// orderStatus: 2待接单 3待审核 4待发货 5已发货 6不发货
		const orderStatus = Number(newRow?.orderStatus);
		const hasTrackingNo = Boolean(newRow?.logisticsTrackingNo);
		const hasWarehouseOrderNo = Boolean(newRow?.warehouseOrderNo);

		// 不发货 -> 取消
		if (orderStatus === 6) {
			active.value = 6;
			return;
		}

		// 已发货
		if (orderStatus === 5) {
			active.value = 5;
			return;
		}

		// 待发货：按字段优先级展示
		if (orderStatus === 4) {
			// 有仓库单号 -> 发货中
			if (hasWarehouseOrderNo) {
				active.value = 4;
				return;
			}
			// 有跟踪号 -> 物流下单
			if (hasTrackingNo) {
				active.value = 3;
				return;
			}
			// 无跟踪号 -> 审核
			active.value = 2;
			return;
		}

		// 待接单、待审核 -> 创建
		if (orderStatus === 2 || orderStatus === 3) {
			active.value = 1;
			return;
		}

		active.value = 0;
	},
	{ immediate: true }
);
</script>
<template>
	<div class="progress-bar">
		<div class="progress-bar-header">
			<el-steps
				class="custom-steps"
				:active="active"
				finish-status="success"
				align-center
			>
				<el-step
					v-for="(item, index) in stepList"
					:key="index"
					:title="item.label"
				>
					<template #title> {{ item.label }} </template>
					<template #description>
						{{ row?.[item.value] || '---' }}
					</template>
				</el-step>
			</el-steps>
		</div>
		<el-row class="progress-bar-info">
			<el-col :span="8" class="info-item">
				<div>
					<span class="font-color"> 发货仓库: </span>
					{{ row?.designatedWarehouse || '---' }}
				</div>
				<div>
					<span class="font-color"> 物流商: </span>
					{{ row?.logisticsProvider || '---' }}
				</div>
			</el-col>
			<el-col :span="8" class="info-item">
				<div>
					<span class="font-color"> 物流渠道: </span>
					{{ row?.logisticsName || '---' }}
				</div>
				<div>
					<span class="font-color"> 追踪号: </span>
					{{ row?.logisticsTrackingNo || '---' }}
				</div>
			</el-col>
			<el-col :span="8" class="info-item">
				<div>
					<span class="font-color"> 运单号: </span>
					{{ row?.waybillNo || '---' }}
				</div>
				<div>
					<span class="font-color"> 仓库单号: </span>
					{{ row?.warehouseOrderNo || '---' }}
				</div>
			</el-col>
		</el-row>
	</div>
</template>
<style scoped lang="scss">
.progress-bar {
	padding: 10px;
	border: 1px solid #e4e7ed;
	border-radius: 5px;
	font-size: 12px;
	.font-color {
		color: #939da8;
	}
	.progress-bar-header {
		background-color: #f7f8fa;
		padding: 20px;
		border-radius: 8px;
		margin-bottom: 8px;
		.custom-steps {
			:deep(.el-step__icon-inner) {
				font-size: 1.2rem !important;
			}
		}
	}
	.progress-bar-info {
		height: 60px;
		.info-item {
			display: flex;
			align-items: center;
			flex-direction: column;
			justify-content: center;
			div:nth-child(1) {
				margin-bottom: 8px;
			}
		}
	}
}
</style>
